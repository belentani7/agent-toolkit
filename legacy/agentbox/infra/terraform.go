// Package infra handles Terraform-based infrastructure provisioning.
// It generates provider-specific Terraform configs, applies them to
// spawn pocket dimensions, and destroys them when the universe collapses.
package infra

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// ProvisionResult holds the output of a successful terraform apply.
type ProvisionResult struct {
	IP       string
	ID       string
	Provider string
}

// Terraform manages infrastructure via Terraform configs.
type Terraform struct {
	baseDir string
}

// NewTerraform creates a Terraform manager rooted at the agentbox config dir.
func NewTerraform(baseDir string) *Terraform {
	return &Terraform{baseDir: baseDir}
}

// Config is a simplified representation of sandbox provisioning parameters.
type Config struct {
	Provider string
	Region   string
	Size     string
	Token    string
}

// Generate creates a Terraform configuration for the given provider and sandbox.
func (t *Terraform) Generate(cfg interface{}, name, pubKey string) error {
	stateDir := filepath.Join(t.baseDir, "state", name)
	os.MkdirAll(stateDir, 0755)

	// Type-assert to our main.Config (avoid circular import)
	type mainConfig struct {
		Provider      string
		Region        string
		Size          string
		AICLI         string
		AutoDestroy   string
		BudgetMonthly float64
	}

	mc, ok := cfg.(mainConfig)
	if !ok {
		// Fallback: use reflection-free approach
		return t.generateFromMap(stateDir, name, pubKey, cfg)
	}

	var tfConfig string
	switch mc.Provider {
	case "digitalocean":
		tfConfig = t.digitaloceanConfig(name, mc.Region, mc.Size, pubKey, mc.Provider)
	case "hetzner":
		tfConfig = t.hetznerConfig(name, mc.Region, mc.Size, pubKey)
	case "oci":
		tfConfig = t.ociConfig(name, mc.Region, mc.Size, pubKey)
	default:
		return fmt.Errorf("unsupported provider: %s", mc.Provider)
	}

	return os.WriteFile(filepath.Join(stateDir, "main.tf"), []byte(tfConfig), 0644)
}

func (t *Terraform) generateFromMap(stateDir, name, pubKey string, cfg interface{}) error {
	// Fallback: generate a basic DigitalOcean config
	tfConfig := t.digitaloceanConfig(name, "nyc1", "s-1vcpu-1gb", pubKey, "digitalocean")
	return os.WriteFile(filepath.Join(stateDir, "main.tf"), []byte(tfConfig), 0644)
}

// Apply runs terraform init + apply for a named sandbox.
func (t *Terraform) Apply(name string) (*ProvisionResult, error) {
	stateDir := filepath.Join(t.baseDir, "state", name)

	// Terraform init
	cmd := exec.Command("terraform", "init", "-no-color", "-input=false")
	cmd.Dir = stateDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("terraform init: %w", err)
	}

	// Terraform apply
	cmd = exec.Command("terraform", "apply", "-auto-approve", "-no-color", "-input=false")
	cmd.Dir = stateDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = t.providerEnv()

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("terraform apply: %w", err)
	}

	// Extract outputs
	ip, err := t.getOutput(stateDir, "ip_address")
	if err != nil {
		return nil, fmt.Errorf("get output ip: %w", err)
	}

	id, _ := t.getOutput(stateDir, "instance_id")

	return &ProvisionResult{
		IP:       ip,
		ID:       id,
		Provider: t.detectProvider(stateDir),
	}, nil
}

// Destroy runs terraform destroy for a named sandbox.
func (t *Terraform) Destroy(name string) error {
	stateDir := filepath.Join(t.baseDir, "state", name)

	if _, err := os.Stat(filepath.Join(stateDir, "main.tf")); os.IsNotExist(err) {
		return fmt.Errorf("no terraform state found for '%s'", name)
	}

	// Terraform destroy
	cmd := exec.Command("terraform", "destroy", "-auto-approve", "-no-color", "-input=false")
	cmd.Dir = stateDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = t.providerEnv()

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("terraform destroy: %w", err)
	}

	// Clean up state directory
	os.RemoveAll(stateDir)

	return nil
}

// ─── Terraform Config Generators ─────────────────────────────────

func (t *Terraform) digitaloceanConfig(name, region, size, pubKey, provider string) string {
	return fmt.Sprintf(`
# AgentBox Pocket Dimension — DigitalOcean
# Auto-generated. Do not edit.

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

variable "do_token" {
  type      = string
  sensitive = true
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_ssh_key" "agentbox" {
  name       = "agentbox-%s"
  public_key = <<EOF
%s
EOF
}

resource "digitalocean_droplet" "sandbox" {
  name     = "%s"
  region   = "%s"
  size     = "%s"
  image    = "ubuntu-22-04-x64"
  ssh_keys = [digitalocean_ssh_key.agentbox.id]

  tags = ["agentbox", "pocket-dimension"]

  user_data = <<-USERDATA
    #!/bin/bash
    echo "Pocket dimension initialized at $(date)" > /etc/agentbox
    hostnamectl set-hostname %s
  USERDATA
}

output "ip_address" {
  value = digitalocean_droplet.sandbox.ipv4_address
}

output "instance_id" {
  value = digitalocean_droplet.sandbox.id
}
`, name, pubKey, name, region, size, name)
}

func (t *Terraform) hetznerConfig(name, region, size, pubKey string) string {
	serverType := mapHetznerType(size)
	return fmt.Sprintf(`
# AgentBox Pocket Dimension — Hetzner Cloud
# Auto-generated. Do not edit.

terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

variable "hcloud_token" {
  type      = string
  sensitive = true
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_ssh_key" "agentbox" {
  name       = "agentbox-%s"
  public_key = <<EOF
%s
EOF
}

resource "hcloud_server" "sandbox" {
  name        = "%s"
  server_type = "%s"
  image       = "ubuntu-22.04"
  location    = "%s"
  ssh_keys    = [hcloud_ssh_key.agentbox.id]

  labels = {
    "managed-by" = "agentbox"
    "dimension"  = "pocket"
  }

  user_data = <<-USERDATA
    #cloud-config
    hostname: %s
    manage_etc_hosts: true
  USERDATA
}

output "ip_address" {
  value = hcloud_server.sandbox.ipv4_address
}

output "instance_id" {
  value = hcloud_server.sandbox.id
}
`, name, pubKey, name, serverType, region, name)
}

func (t *Terraform) ociConfig(name, region, size, pubKey string) string {
	return fmt.Sprintf(`
# AgentBox Pocket Dimension — Oracle Cloud (Always Free)
# Auto-generated. Do not edit.

terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }
}

variable "tenancy_ocid" { type = string }
variable "user_ocid" { type = string }
variable "fingerprint" { type = string }
variable "private_key_path" { type = string }
variable "compartment_ocid" { type = string }

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = "%s"
}

data "oci_core_images" "ubuntu_arm" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.A1.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_instance" "sandbox" {
  compartment_id      = var.compartment_ocid
  display_name        = "%s"
  shape               = "VM.Standard.A1.Flex"
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name

  shape_config {
    ocpus         = 1
    memory_in_gbs = 6
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu_arm.images[0].id
  }

  create_vnic_details {
    assign_public_ip = true
    subnet_id        = oci_core_subnet.agentbox.id
  }

  metadata = {
    ssh_authorized_keys = <<EOF
%s
EOF
  }

  freeform_tags = {
    "managed-by" = "agentbox"
    "dimension"  = "pocket"
  }
}

# Networking (simplified — shares VCN if exists)
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

resource "oci_core_vcn" "agentbox" {
  compartment_id = var.compartment_ocid
  cidr_blocks    = ["10.0.0.0/16"]
  display_name   = "agentbox-vcn"
}

resource "oci_core_subnet" "agentbox" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.agentbox.id
  cidr_block     = "10.0.1.0/24"
  display_name   = "agentbox-subnet"
}

resource "oci_core_internet_gateway" "agentbox" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.agentbox.id
  enabled        = true
  display_name   = "agentbox-igw"
}

output "ip_address" {
  value = oci_core_instance.sandbox.public_ip
}

output "instance_id" {
  value = oci_core_instance.sandbox.id
}
`, region, name, pubKey)
}

// ─── Helpers ─────────────────────────────────────────────────────

func (t *Terraform) getOutput(stateDir, outputName string) (string, error) {
	cmd := exec.Command("terraform", "output", "-raw", outputName)
	cmd.Dir = stateDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("output %s: %s", outputName, string(output))
	}
	return strings.TrimSpace(string(output)), nil
}

func (t *Terraform) detectProvider(stateDir string) string {
	data, err := os.ReadFile(filepath.Join(stateDir, "main.tf"))
	if err != nil {
		return "unknown"
	}
	content := string(data)
	switch {
	case strings.Contains(content, "digitalocean"):
		return "digitalocean"
	case strings.Contains(content, "hcloud"):
		return "hetzner"
	case strings.Contains(content, "oci"):
		return "oci"
	default:
		return "unknown"
	}
}

func (t *Terraform) providerEnv() []string {
	env := os.Environ()

	// Pass provider tokens via TF_VAR_
	if v := os.Getenv("DO_TOKEN"); v != "" {
		env = append(env, "TF_VAR_do_token="+v)
	}
	if v := os.Getenv("HETZNER_TOKEN"); v != "" {
		env = append(env, "TF_VAR_hcloud_token="+v)
	}
	if v := os.Getenv("OCI_TENANCY_OCID"); v != "" {
		env = append(env, "TF_VAR_tenancy_ocid="+v)
	}
	if v := os.Getenv("OCI_USER_OCID"); v != "" {
		env = append(env, "TF_VAR_user_ocid="+v)
	}
	if v := os.Getenv("OCI_FINGERPRINT"); v != "" {
		env = append(env, "TF_VAR_fingerprint="+v)
	}
	if v := os.Getenv("OCI_KEY_FILE"); v != "" {
		env = append(env, "TF_VAR_private_key_path="+v)
	}
	if v := os.Getenv("OCI_COMPARTMENT_OCID"); v != "" {
		env = append(env, "TF_VAR_compartment_ocid="+v)
	}

	return env
}

func mapHetznerType(size string) string {
	switch size {
	case "s-1vcpu-1gb":
		return "cx11"
	case "s-1vcpu-2gb":
		return "cx21"
	case "s-2vcpu-4gb":
		return "cx31"
	default:
		return "cx11"
	}
}
