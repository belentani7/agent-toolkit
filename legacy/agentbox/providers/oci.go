package providers

import (
	"fmt"
	"os"
	"os/exec"
)

// ─── Oracle Cloud Infrastructure (OCI) ──────────────────────────

// OCI provisions always-free ARM instances as pocket dimensions.
// The cheapest possible way to spawn parallel universes: $0/month.
//
// OCI's Always Free tier includes:
//   - 2x AMD.Compute.A1.Flex (ARM) with 24 GB RAM total
//   - 2x VM.Standard.E2.1.Micro (AMD) with 1 GB RAM each
//   - 10 TB outbound data transfer/month
type OCI struct {
	tenancyOCID     string
	compartmentOCID string
	userOCID        string
	fingerprint     string
	keyFile         string
	region          string
}

func NewOCI() *OCI {
	return &OCI{
		tenancyOCID:     os.Getenv("OCI_TENANCY_OCID"),
		compartmentOCID: os.Getenv("OCI_COMPARTMENT_OCID"),
		userOCID:        os.Getenv("OCI_USER_OCID"),
		fingerprint:     os.Getenv("OCI_FINGERPRINT"),
		keyFile:         os.Getenv("OCI_KEY_FILE"),
		region:          envOrDefault("OCI_REGION", "us-ashburn-1"),
	}
}

func (o *OCI) Name() string { return "oci" }

func (o *OCI) CreateVM(name, region, size, pubKey string) (string, error) {
	if err := o.Validate(); err != nil {
		return "", err
	}

	// Check if OCI CLI is available
	if _, err := exec.LookPath("oci"); err != nil {
		return "", fmt.Errorf("OCI CLI not installed. Install from: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm")
	}

	// Use always-free ARM shape
	shape := "VM.Standard.A1.Flex"
	ocpus := "1"
	memoryGB := "6"

	if size == "micro" {
		shape = "VM.Standard.E2.1.Micro"
		ocpus = ""
		memoryGB = ""
	}

	// Create VCN if it doesn't exist
	subnetID, err := o.ensureNetwork(name)
	if err != nil {
		return "", fmt.Errorf("network setup: %w", err)
	}

	// Build the instance creation command
	args := []string{
		"compute", "instance", "launch",
		"--compartment-id", o.compartmentOCID,
		"--display-name", name,
		"--shape", shape,
		"--subnet-id", subnetID,
		"--image-id", o.getARMImageID(),
		"--ssh-authorized-keys-file", pubKey,
		"--wait-for-state", "RUNNING",
		"--region", o.region,
	}

	if ocpus != "" {
		args = append(args, "--shape-config",
			fmt.Sprintf(`{"ocpus":%s,"memoryInGBs":%s}`, ocpus, memoryGB))
	}

	// Add free-tier tag
	args = append(args, "--freeform-tags",
		`{"managed-by":"agentbox","dimension":"pocket"}`)

	cmd := exec.Command("oci", args...)
	cmd.Env = append(os.Environ(),
		"OCI_CLI_TENANCY="+o.tenancyOCID,
		"OCI_CLI_USER="+o.userOCID,
		"OCI_CLI_FINGERPRINT="+o.fingerprint,
		"OCI_CLI_KEY_FILE="+o.keyFile,
		"OCI_CLI_REGION="+o.region,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("create instance: %s", string(output))
	}

	// Extract public IP
	instanceID := extractJSONField(string(output), "id")
	ip, err := o.getPublicIP(instanceID)
	if err != nil {
		return "", err
	}

	return ip, nil
}

func (o *OCI) DestroyVM(name string) error {
	if _, err := exec.LookPath("oci"); err != nil {
		return fmt.Errorf("OCI CLI not installed")
	}

	// Find instance by display name
	cmd := exec.Command("oci", "compute", "instance", "list",
		"--compartment-id", o.compartmentOCID,
		"--display-name", name,
		"--lifecycle-state", "RUNNING",
		"--region", o.region,
		"--output", "table",
	)
	cmd.Env = o.ociEnv()

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("list instances: %s", string(output))
	}

	instanceID := extractJSONField(string(output), "id")
	if instanceID == "" {
		return fmt.Errorf("instance '%s' not found on OCI", name)
	}

	// Terminate instance
	cmd = exec.Command("oci", "compute", "instance", "terminate",
		"--instance-id", instanceID,
		"--force",
		"--wait-for-state", "TERMINATED",
		"--region", o.region,
	)
	cmd.Env = o.ociEnv()

	output, err = cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("terminate instance: %s", string(output))
	}

	// Clean up network resources (best effort)
	o.cleanupNetwork(name)

	return nil
}

func (o *OCI) InstallAICLI(ip, keyPath, aiCLI string) error {
	var installCmd string
	switch aiCLI {
	case "claude":
		installCmd = "curl -fsSL https://claude.ai/install.sh | bash"
	case "aider":
		// ARM-compatible install
		installCmd = "apt-get update && apt-get install -y python3-pip && pip3 install aider-chat"
	case "codex":
		installCmd = "curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs && npm install -g @openai/codex"
	default:
		return fmt.Errorf("unknown AI CLI: %s", aiCLI)
	}
	return sshExec(ip, keyPath, installCmd)
}

func (o *OCI) MonthlyCost(size string) float64 {
	// OCI Always Free tier = $0
	// Only charge if using non-free shapes
	if size == "micro" || size == "arm-flex" {
		return 0.00
	}
	// Non-free shapes (fallback)
	return 7.50
}

func (o *OCI) Validate() error {
	if o.tenancyOCID == "" {
		return fmt.Errorf("OCI_TENANCY_OCID not set")
	}
	if o.compartmentOCID == "" {
		return fmt.Errorf("OCI_COMPARTMENT_OCID not set")
	}
	if o.userOCID == "" {
		return fmt.Errorf("OCI_USER_OCID not set")
	}
	if o.keyFile == "" {
		return fmt.Errorf("OCI_KEY_FILE not set")
	}
	if _, err := os.Stat(o.keyFile); os.IsNotExist(err) {
		return fmt.Errorf("OCI key file not found: %s", o.keyFile)
	}
	return nil
}

// ─── Private ─────────────────────────────────────────────────────

func (o *OCI) ociEnv() []string {
	return append(os.Environ(),
		"OCI_CLI_TENANCY="+o.tenancyOCID,
		"OCI_CLI_USER="+o.userOCID,
		"OCI_CLI_FINGERPRINT="+o.fingerprint,
		"OCI_CLI_KEY_FILE="+o.keyFile,
		"OCI_CLI_REGION="+o.region,
	)
}

func (o *OCI) ensureNetwork(name string) (string, error) {
	// Check if agentbox VCN exists
	cmd := exec.Command("oci", "network", "vcn", "list",
		"--compartment-id", o.compartmentOCID,
		"--display-name", "agentbox-vcn",
		"--region", o.region,
	)
	cmd.Env = o.ociEnv()

	output, _ := cmd.CombinedOutput()
	vcnID := extractJSONField(string(output), "id")

	if vcnID == "" {
		// Create VCN
		cmd = exec.Command("oci", "network", "vcn", "create",
			"--compartment-id", o.compartmentOCID,
			"--display-name", "agentbox-vcn",
			"--cidr-block", "10.0.0.0/16",
			"--region", o.region,
			"--wait-for-state", "AVAILABLE",
		)
		cmd.Env = o.ociEnv()
		output, err := cmd.CombinedOutput()
		if err != nil {
			return "", fmt.Errorf("create VCN: %s", string(output))
		}
		vcnID = extractJSONField(string(output), "id")

		// Create Internet Gateway
		cmd = exec.Command("oci", "network", "internet-gateway", "create",
			"--compartment-id", o.compartmentOCID,
			"--vcn-id", vcnID,
			"--display-name", "agentbox-igw",
			"--is-enabled", "true",
			"--region", o.region,
			"--wait-for-state", "AVAILABLE",
		)
		cmd.Env = o.ociEnv()
		cmd.Run()
	}

	// Find or create subnet
	cmd = exec.Command("oci", "network", "subnet", "list",
		"--compartment-id", o.compartmentOCID,
		"--vcn-id", vcnID,
		"--region", o.region,
	)
	cmd.Env = o.ociEnv()
	output, _ = cmd.CombinedOutput()
	subnetID := extractJSONField(string(output), "id")

	if subnetID == "" {
		cmd = exec.Command("oci", "network", "subnet", "create",
			"--compartment-id", o.compartmentOCID,
			"--vcn-id", vcnID,
			"--display-name", "agentbox-subnet",
			"--cidr-block", "10.0.1.0/24",
			"--region", o.region,
			"--wait-for-state", "AVAILABLE",
		)
		cmd.Env = o.ociEnv()
		output, err := cmd.CombinedOutput()
		if err != nil {
			return "", fmt.Errorf("create subnet: %s", string(output))
		}
		subnetID = extractJSONField(string(output), "id")
	}

	return subnetID, nil
}

func (o *OCI) cleanupNetwork(name string) {
	// Best-effort: only clean if no other instances use the network
	// In practice, we share the VCN across sandboxes and only clean on full teardown
}

func (o *OCI) getARMImageID() string {
	// Query for the latest Ubuntu ARM image
	cmd := exec.Command("oci", "compute", "image", "list",
		"--compartment-id", o.compartmentOCID,
		"--operating-system", "Canonical Ubuntu",
		"--operating-system-version", "22.04",
		"--shape", "VM.Standard.A1.Flex",
		"--region", o.region,
		"--sort-by", "TIMECREATED",
		"--sort-order", "DESC",
		"--limit", "1",
	)
	cmd.Env = o.ociEnv()
	output, _ := cmd.CombinedOutput()
	id := extractJSONField(string(output), "id")
	if id == "" {
		// Fallback: use a known Ubuntu 22.04 ARM image OCID for us-ashburn-1
		return "ocid1.image.oc1.iad.aaaaaaaahxhnwoseqpgmhyj5lgmj7l2mnsub3kkm5q3hqwvpf5vqljw3b2uq"
	}
	return id
}

func (o *OCI) getPublicIP(instanceID string) (string, error) {
	if instanceID == "" {
		return "", fmt.Errorf("no instance ID")
	}

	// Get VNIC attachment
	cmd := exec.Command("oci", "compute", "vnic-attachment", "list",
		"--compartment-id", o.compartmentOCID,
		"--instance-id", instanceID,
		"--region", o.region,
	)
	cmd.Env = o.ociEnv()
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("list vnics: %s", string(output))
	}

	vnicID := extractJSONField(string(output), "vnic-id")
	if vnicID == "" {
		return "", fmt.Errorf("no VNIC found for instance")
	}

	// Get VNIC details
	cmd = exec.Command("oci", "network", "vnic", "get",
		"--vnic-id", vnicID,
		"--region", o.region,
	)
	cmd.Env = o.ociEnv()
	output, err = cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("get vnic: %s", string(output))
	}

	publicIP := extractJSONField(string(output), "public-ip")
	if publicIP == "" {
		// Need to assign ephemeral IP
		privateIPID := extractJSONField(string(output), "private-ip-id")
		cmd = exec.Command("oci", "network", "public-ip", "create",
			"--compartment-id", o.compartmentOCID,
			"--lifetime", "EPHEMERAL",
			"--private-ip-id", privateIPID,
			"--region", o.region,
		)
		cmd.Env = o.ociEnv()
		output, err = cmd.CombinedOutput()
		if err != nil {
			return "", fmt.Errorf("assign public ip: %s", string(output))
		}
		publicIP = extractJSONField(string(output), "ip-address")
	}

	return publicIP, nil
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
