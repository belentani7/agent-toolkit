---
name: incident-response
description: Incident response procedures — detection, containment, eradication, recovery, lessons learned. NIST SP 800-61 / SANS PICERL aligned.
origin: adapted from Anthropic-Cybersecurity-Skills + CyberSecurity-Skills
---

## When to Use

Use this skill when:
- Responding to a security incident
- Building IR playbooks
- Post-incident review and lessons learned
- Tabletop exercises

## PICERL Framework

```
┌──────────┐    ┌────────────┐    ┌────────────┐
│PREPARATION│───▶│DETECTION & │───▶│CONTAINMENT │
│           │    │ ANALYSIS   │    │            │
└──────────┘    └────────────┘    └─────┬──────┘
                                        │
┌──────────┐    ┌────────────┐    ┌─────▼──────┐
│  LESSONS │◀───│ RECOVERY   │◀───│ERADICATION │
│  LEARNED │    │            │    │            │
└──────────┘    └────────────┘    └────────────┘
```

### Phase 1: Preparation

- [ ] IR team roles defined (Incident Commander, SOC, Legal, Comms)
- [ ] Contact list maintained and tested
- [ ] Communication channels (out-of-band) established
- [ ] Forensic tools ready (Volatility, Autopsy, Wireshark)
- [ ] Backup and recovery procedures tested
- [ ] Playbooks documented for top 10 incident types

### Phase 2: Detection & Analysis

**Triage questions:**
1. What is the scope? (single host, network segment, full environment)
2. What data is at risk? (PII, credentials, intellectual property)
3. Is the attacker still active?
4. What is the initial attack vector?

**Evidence collection:**
```bash
# Memory dump (before shutdown)
# Windows
winpmem_mini_x64.exe memory.raw
# Linux
dd if=/dev/mem of=memory.dump bs=1M

# Disk image
dd if=/dev/sda of=disk.img bs=4M

# Network capture
tcpdump -i eth0 -w capture.pcap

# Log preservation
cp -r /var/log/ /evidence/logs/
```

**Timeline reconstruction:**
```bash
# Linux timeline
find / -mtime -7 -type f 2>/dev/null > timeline.txt
last -F | head -50
cat /var/log/auth.log | grep "Failed password"

# Windows timeline
# Use Timesketch or Plaso
log2timeline.py timeline.plaso memory.raw
```

### Phase 3: Containment

**Short-term (stop the bleeding):**
- Isolate affected hosts from network
- Block malicious IPs/domains at firewall
- Disable compromised accounts
- Preserve evidence before containment

**Long-term (prevent spread):**
- Segment network
- Implement additional monitoring
- Patch exploited vulnerability
- Reset all potentially compromised credentials

### Phase 4: Eradication

- Remove malware and backdoors
- Patch exploited vulnerability
- Close unauthorized access points
- Verify clean state on all affected systems
- Update detection signatures

### Phase 5: Recovery

- Restore from known-good backups
- Monitor for re-infection
- Gradually restore services
- Validate system integrity
- Confirm normal operations

### Phase 6: Lessons Learned

**Report structure:**
```
INCIDENT REPORT
════════════════════════════════════════
Incident ID:    [YYYY-MM-DD-NNN]
Severity:       [Critical/High/Medium/Low]
Duration:       [start] to [end] ([total time])
Impact:         [data affected, systems affected, business impact]
════════════════════════════════════════
Timeline:
[timestamp] - [event]
[timestamp] - [event]
...
════════════════════════════════════════
Root cause:     [what allowed this]
Detection:      [how it was found]
Response:       [what was done]
════════════════════════════════════════
Recommendations:
1. [preventive control]
2. [detective control]
3. [corrective control]
════════════════════════════════════════
```

## Incident Type Playbooks

### Ransomware
1. Isolate infected systems immediately
2. Do NOT pay ransom (consult legal)
3. Identify strain (ID Ransomware, VirusTotal)
4. Check for decryptor (nomoreransom.org)
5. Restore from backups
6. Check for data exfiltration (double extortion)

### Phishing/BEC
1. Identify all recipients, block the email
2. Reset credentials for anyone who clicked
3. Check for mailbox rules (forwarding, delegate access)
4. Review wire transfer requests (call sender to verify)
5. Check for OAuth app grants
6. Update email security rules

### Data Breach
1. Identify scope of data exposed
2. Legal notification requirements (GDPR 72h, state laws)
3. Preserve evidence
4. Engage forensics firm if needed
5. Notify affected parties per regulations
6. Credit monitoring for affected individuals

### Insider Threat
1. Preserve evidence before confrontation
2. Legal/HR involvement mandatory
3. Do not tip off the insider
4. Document all evidence chain of custody
5. Plan for access revocation
6. Consider civil/criminal referral
