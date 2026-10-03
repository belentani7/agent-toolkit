---
name: threat-hunting
description: Proactive threat hunting — hypothesis-driven investigation, IOC analysis, detection engineering, MITRE ATT&CK mapping.
origin: adapted from Anthropic-Cybersecurity-Skills
---

## When to Use

Use this skill when:
- Proactively searching for threats in the environment
- Investigating suspicious alerts
- Building detection rules from threat intelligence
- Mapping findings to MITRE ATT&CK

## Hunting Workflow

### Step 1: Form Hypothesis

Based on threat intel, anomalies, or environment context:

```
HYPOTHOTHESIS: [adversary] may be using [technique] to [objective]
DATA SOURCES: [logs to investigate]
MITRE TECHNIQUE: [T####]
```

Common hypotheses:
- Lateral movement via RDP/SMB with compromised credentials
- C2 communication via DNS tunneling
- Data exfiltration via cloud storage APIs
- Persistence via scheduled tasks or registry run keys

### Step 2: Identify Data Sources

| Activity | Data Source | Location |
|----------|-------------|----------|
| Process execution | Sysmon, EDR | Windows Event Log 4688 |
| Network connections | Firewall, NetFlow, Zeek | SIEM, PCAP |
| Authentication | AD logs, LDAP | Windows Event 4624/4625 |
| File changes | Sysmon, auditd | Windows Event 11/4663 |
| Registry changes | Sysmon | Windows Event 13 |
| DNS queries | DNS logs, Sysmon | Windows Event 22 |

### Step 3: Investigate

```bash
# Process analysis
# Find suspicious processes
ps aux | grep -E "(nc|ncat|socat|curl|wget)" | grep -v grep
wmic process list full 2>/dev/null

# Network connections
netstat -tlnp
ss -tlnp
lsof -i -P -n | grep LISTEN

# Authentication anomalies
# Failed logons
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn

# Unusual logon times
ausearch -m LOGIN --start today | grep -v "normal_hours"

# File integrity
find /etc -mmin -60 -type f 2>/dev/null  # Recently modified system files
find /tmp -type f -executable 2>/dev/null  # Executables in temp
```

### Step 4: Map to MITRE ATT&CK

| Finding | Tactic | Technique | ID |
|---------|--------|-----------|-----|
| Suspicious PowerShell | Execution | Command and Scripting Interpreter | T1059.001 |
| DNS queries to rare domains | Exfiltration | Application Layer Protocol | T1071.004 |
| Scheduled task created | Persistence | Scheduled Task | T1053.005 |
| RDP to new host | Lateral Movement | Remote Services | T1021.001 |
| Credential dump attempt | Credential Access | OS Credential Dumping | T1003 |

### Step 5: Detection Rule Creation

```yaml
# Sigma rule example
title: Suspicious DNS Tunneling
id: abc-123
status: experimental
description: Detects DNS queries with unusually long subdomains (potential tunneling)
references:
  - https://attack.mitre.org/techniques/T1071/004
logsource:
  category: dns
detection:
  selection:
    query|re: '[a-zA-Z0-9]{30,}\.'
  condition: selection
level: medium
tags:
  - attack.exfiltration
  - attack.t1071.004
```

```bash
# Snort rule example
alert dns $HOME_NET any -> $EXTERNAL_NET any (msg:"Potential DNS Tunneling"; 
  content:"|01 00|"; depth:2; offset:0;
  pcre:"/([a-zA-Z0-9]{30,}\.)+/"; 
  sid:1000001; rev:1;)
```

### Step 6: Report

```
THREAT HUNT REPORT
════════════════════════════════════════
Hypothesis:    [what was suspected]
Data sources:  [what was analyzed]
Time period:   [start] to [end]
════════════════════════════════════════
Findings:
1. [finding] — MITRE [T####] — Severity: [level]
2. [finding] — MITRE [T####] — Severity: [level]
════════════════════════════════════════
Detections created:
1. [rule name] — [technique] — [status]
════════════════════════════════════════
Recommendations:
1. [action item]
════════════════════════════════════════
```

## IOC Analysis Quick Reference

| IOC Type | Analysis Tool | What to check |
|----------|---------------|---------------|
| IP address | AbuseIPDB, VirusTotal | Reputation, history, ASN |
| Domain | URLhaus, PassiveTotal | Registration, DNS history |
| File hash | VirusTotal, Hybrid Analysis | Detections, behavior |
| URL | URLScan.io, Hybrid Analysis | Screenshot, resources |
| Email | MXToolbox, EmailRep | Headers, reputation |

## ATT&CK Coverage Check

```bash
# Map your detections to ATT&CK
# Find gaps in coverage
# Priority: focus on techniques used by threats targeting your industry
```
