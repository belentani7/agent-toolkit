<p align="center">
  <img src="https://img.shields.io/badge/skills-35-brightgreen?style=for-the-badge&logo=shield&logoColor=white" alt="Skills">
  <img src="https://img.shields.io/badge/frameworks-6-blue?style=for-the-badge" alt="Frameworks">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/language-English%20🇷🇺-blueviolet?style=for-the-badge" alt="Language">
</p>

<h1 align="center">MiMoCode Skills</h1>

<p align="center">
  <b>35 ready-to-use skills for AI agents — cybersecurity, design, engineering, IoT/hardware security, frontend design</b><br>
  Adapted from <a href="https://github.com/garrytan/gstack">gstack</a>, <a href="https://github.com/affaan-m/ECC">ECC</a>, <a href="https://github.com/bergside/typeui">TypeUI</a>, <a href="https://github.com/emilkowalski/skills">emilkowalski/skills</a>, <a href="https://github.com/Leonxlnx/taste-skill">taste-skill</a>, <a href="https://github.com/pbakaus/impeccable">impeccable</a>, <a href="https://github.com/BrownFineSecurity/iothackbot">IoTHackBot</a>, and security repositories
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#skill-catalog">Skills</a> •
  <a href="#usage">Usage</a> •
  <a href="#workflows">Workflows</a> •
  <a href="#sources">Sources</a> •
  <a href="README.md">Русский</a>
</p>

---

## What is this?

A collection of **35 structured skills** that give AI agents specialized capabilities:

### Skill Categories

**Cybersecurity & Engineering:**
- **Code review** with confidence scoring and severity classification
- **Systematic debugging** with root cause analysis
- **QA testing** with health scoring and triage
- **Security audit** with OWASP/WCAG checklists
- **Penetration testing** with PTES methodology
- **Incident response** with NIST/SANS playbooks
- **Threat hunting** with MITRE ATT&CK mapping
- **TDD processes** with RED/GREEN/REFACTOR cycles
- **CSO** — infrastructure security audit with OWASP Top 10 + STRIDE

**Frontend Design & UX:**
- **Design Engineering** — full UI philosophy, animations, springs, gestures, components (emilkowalski)
- **Review Animations** — strict animation review with 10 non-negotiable standards
- **Animation Vocabulary** — glossary of terms for describing effects
- **Taste Engineering** — anti-slop with 3 design dials, anti-AI-tell rules, redesign protocol (taste-skill)
- **Premium Visual Design** — agency level: double-bezel, magnetic hover, cinematic motion
- **Minimalist UI** — editorial minimalism, warm monochrome, Notion/Linear style
- **Industrial Brutalist UI** — Swiss typographic + military terminal aesthetics
- **Impeccable** — production-grade design with 23 commands, brand/product registers
- **Redesign Existing** — audit and upgrade of existing projects
- **Full Output Enforcement** — no truncation, full code output

**Design Systems & UI/UX:**
- **Design System** — universal principles of hierarchy, spacing, typography
- **Design Audit** — UI review against design principles

**IoT/Hardware Security:**
- Firmware analysis (apktool, jadx)
- JTAG/UART debugging (picocom, jtagprobe)
- Network analysis (nmap, iotnet, wsdiscovery)
- Android reverse engineering (apktool, jadx)
- Telnet/Serial shells

**Engineering Processes:**
- **Search first** — research before coding
- **Incident response** — NIST SP 800-61 / SANS PICERL
- **Threat Hunting** — hypothesis-driven investigation

---

## Quick Start

### Option 1: Clone entirely

```bash
git clone https://github.com/Samuraiprm/mimocode-skills.git ~/.mimocode/skills/
```

### Option 2: Copy individual skills

```bash
# Frontend design skills only
cp -r ~/.mimocode/skills/taste-engineering ~/.mimocode/skills/
cp -r ~/.mimocode/skills/design-engineering ~/.mimocode/skills/
cp -r ~/.mimocode/skills/impeccable ~/.mimocode/skills/
# ... and so on

# IoT skills only
cp -r iot-* ~/.mimocode/skills/
```

### Option 3: Manual clone

```bash
cd ~/.mimocode/skills/
git clone https://github.com/Samuraiprm/mimocode-skills.git temp/
cp -r temp/*/ .
rm -rf temp/
```

---

## Skill Catalog

### Frontend Design

| Skill | Description | Source |
|-------|-------------|--------|
| `design-engineering` | UI polish, animations, springs, gestures, components, perf, a11y | [emilkowalski/skills](https://github.com/emilkowalski/skills) |
| `review-animations` | Strict animation review: 10 standards, escalation triggers, verdict | [emilkowalski/skills](https://github.com/emilkowalski/skills) |
| `animation-vocabulary` | Glossary: describe effect -> get exact term | [emilkowalski/skills](https://github.com/emilkowalski/skills) |
| `taste-engineering` | Anti-slop: 3 dials, brief inference, anti-AI-tell, redesign protocol | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `premium-visual-design` | Agency level: double-bezel, magnetic hover, cinematic motion | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `minimalist-ui` | Editorial minimalism: warm monochrome, typographic contrast | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `industrial-brutalist-ui` | Swiss typographic + military terminal: rigid grids, CRT scanlines | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `impeccable` | Production-grade: 23 commands, brand/product registers, 45 rules | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `redesign-existing` | Audit and upgrade: typography, color, layout, a11y, components | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `full-output-enforcement` | No truncation, full output, banned placeholder patterns | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |

### Security & Engineering

| Skill | Description | Source |
|-------|-------------|--------|
| `code-review` | PR review: SQL safety, race conditions, trust boundaries | gstack |
| `code-audit` | Security code audit: static analysis, vulnerabilities | gstack |
| `investigate` | Systematic debugging: root cause analysis | gstack |
| `qa-test` | QA testing: 3 levels (Quick/Standard/Exhaustive) | gstack |
| `review` | Pre-landing review: structural issues, scope drift | gstack |
| `tdd-workflow` | TDD: RED/GREEN/REFACTOR cycles | ECC |
| `search-first` | Research before coding: find existing solutions | ECC |
| `verification-loop` | Build -> Type Check -> Lint -> Test -> Security | ECC |
| `security-review` | Checklists: auth, input handling, API, secrets | gstack |
| `cso` | Infrastructure security audit: OWASP Top 10 + STRIDE | gstack |

### Security & Incidents

| Skill | Description | Source |
|-------|-------------|--------|
| `pentest` | PTES: recon, scanning, exploitation, post-exploitation | PTES |
| `incident-response` | NIST SP 800-61 / SANS PICERL: detection -> recovery | NIST/SANS |
| `threat-hunting` | MITRE ATT&CK: hypotheses, IOC, detection engineering | MITRE |

### Design Systems

| Skill | Description | Source |
|-------|-------------|--------|
| `design-system` | Universal principles: hierarchy, spacing, typography | TypeUI |
| `design-audit` | UI review: hierarchy, spacing, typography, accessibility | TypeUI |

### IoT/Hardware Security

| Skill | Description | Tool |
|-------|-------------|------|
| `iot-apktool` | Android APK/IPK decompilation | apktool |
| `iot-jadx` | Java/Dex source analysis | jadx |
| `iot-jtagprobe` | JTAG/UART debugging and memory dumps | jtagprobe |
| `iot-picocom` | Serial/UART terminal | picocom |
| `iot-nmap` | Network scanning and discovery | nmap |
| `iot-iotnet` | UPnP/SSDP device discovery | iotnet |
| `iot-wsdiscovery` | WS-Discovery protocol | wsdiscovery |
| `iot-ffind` | Firmware file search and analysis | ffind |
| `iot-chipsec` | Chip analysis and hardware security | chipsec |
| `iot-telnetshell` | Telnet/Serial shells | telnetshell |

---

## Usage

### In Claude Code / Cursor / Codex

Skills are automatically loaded from `~/.mimocode/skills/`. Just describe your task:

```
Review this PR for SQL injection vulnerabilities
```

```
Create a landing page using taste-engineering
```

```
Audit this endpoint for security issues
```

### Manual skill invocation

```
/impeccable critique landing
```

```
/impeccable polish settings
```

### Choosing a specific skill

```
Use design-engineering to review animations in this component
```

---

## Workflows

### Frontend Design Pipeline

```
1. taste-engineering → brief inference, design dials
2. design-engineering → animations, components, perf
3. review-animations → motion code review
4. impeccable → production-grade final pass
```

### Security Audit Pipeline

```
1. code-audit → static analysis
2. security-review → OWASP checklists
3. pentest → PTES methodology
4. incident-response → NIST/SANS playbooks
```

### Redesign Pipeline

```
1. redesign-existing → current state audit
2. taste-engineering → new design dials
3. design-engineering → components and motion
4. impeccable → final polish
```

### IoT Security Pipeline

```
1. iot-nmap → device discovery
2. iot-iotnet / iot-wsdiscovery → UPnP/WS-Discovery
3. iot-apktool / iot-jadx → firmware analysis
4. iot-jtagprobe / iot-picocom → hardware debugging
```

---

## Sources

### Original Repositories

| Repository | Description | Skills taken |
|------------|-------------|--------------|
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | Skills for Design Engineers | 3 |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Anti-Slop Frontend Framework | 7 |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Frontend Design Guidance | 1 |
| [garrytan/gstack](https://github.com/garrytan/gstack) | Engineering workflows | 6 |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | Engineering best practices | 3 |
| [bergside/typeui](https://github.com/bergside/typeui) | Design system principles | 2 |
| [BrownFineSecurity/iothackbot](https://github.com/BrownFineSecurity/iothackbot) | IoT security tools | 9 |

### Standards & Frameworks

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST SP 800-61](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)
- [SANS PICERL](https://www.sans.org/white-papers/incident-handlers-handbook/)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [PTES](http://www.pentest-standard.org/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)

---

## License

[MIT License](LICENSE) - free to use, modify, and distribute.

---

## Contributing

PRs with new skills or improvements to existing ones are welcome. Each skill must:
- Have a `SKILL.md` with YAML frontmatter (`name`, `description`)
- Be self-contained (not depend on other skills)
- Have clear usage triggers
- Contain a step-by-step workflow
