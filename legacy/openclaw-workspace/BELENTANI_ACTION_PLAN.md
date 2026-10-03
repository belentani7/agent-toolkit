# 🦞 BELENTANI ACTION PLAN
## Pla Executiu 90 Dies - Setembre 2026

**Data:** 2026-09-01  
**Responsable:** Pedro Belentani + OpenClaw  
**Versió:** 1.0

---

## 🎯 OBJECTIUS ESTRATÈGICS

### O1: Seguretat i Higiene (Setmana 1-2)
**Prioritat:** 🔴 CRÍTICA

| # | Acció | Responsable | Deadline | Estat |
|---|-------|-------------|----------|-------|
| 1.1 | Revocar API key OpenRouter | Pedro | Avui | ⏳ |
| 1.2 | Purgar secret CARQUIDEC | OpenClaw | Avui | ⏳ |
| 1.3 | Verificar RLS Supabase | Pedro | Demà | ⏳ |
| 1.4 | Eliminar duplicats JSON | OpenClaw | Avui | ⏳ |
| 1.5 | Afegir .gitignore a 13 repos | OpenClaw | Setmana 1 | ⏳ |
| 1.6 | Afegir README a 12 repos | OpenClaw | Setmana 1 | ⏳ |
| 1.7 | Activar secret scanning GitHub | Pedro | Setmana 2 | ⏳ |

### O2: Consolidació d'Ecosistema (Setmana 2-4)
**Prioritat:** 🟠 ALTA

| # | Acció | Responsable | Deadline | Estat |
|---|-------|-------------|----------|-------|
| 2.1 | Consolidar Duck repos (25→8) | OpenClaw | Setmana 3 | ⏳ |
| 2.2 | Consolidar Judas/Omega (10→3) | OpenClaw | Setmana 3 | ⏳ |
| 2.3 | Arxivar repos inactius | Pedro | Setmana 4 | ⏳ |
| 2.4 | Documentar arquitectura unificada | OpenClaw | Setmana 4 | ⏳ |

### O3: Integració Google Drive (Setmana 2-3)
**Prioritat:** 🟠 ALTA

| # | Acció | Responsable | Deadline | Estat |
|---|-------|-------------|----------|-------|
| 3.1 | Configurar Google Drive API | Pedro | Setmana 2 | ⏳ |
| 3.2 | Autenticar compte | Pedro | Setmana 2 | ⏳ |
| 3.3 | Escanejar documents | OpenClaw | Setmana 3 | ⏳ |
| 3.4 | Organitzar per projectes | OpenClaw | Setmana 3 | ⏳ |
| 3.5 | Eliminar duplicats Drive | OpenClaw | Setmana 3 | ⏳ |
| 3.6 | Renombrar segons convencions | OpenClaw | Setmana 3 | ⏳ |

### O4: Programa Ambassador (Setmana 3-6)
**Prioritat:** 🟡 MITJANA

| # | Acció | Responsable | Deadline | Estat |
|---|-------|-------------|----------|-------|
| 4.1 | Enviar app Qwen Ambassador | Pedro | Setmana 3 | ⏳ |
| 4.2 | Enviar app HF Builders | Pedro | Setmana 3 | ⏳ |
| 4.3 | Enviar app Alibaba | Pedro | Setmana 4 | ⏳ |
| 4.4 | Primer contingut públic | Pedro | Setmana 5 | ⏳ |
| 4.5 | Meetup Barcelona (organitzar) | Pedro | Setmana 8 | ⏳ |

### O5: Contribucions OSS (Setmana 1-4)
**Prioritat:** 🟡 MITJANA

| # | Acció | Responsable | Deadline | Estat |
|---|-------|-------------|----------|-------|
| 5.1 | PR Transformers ES (3 docs) | OpenClaw | Setmana 1 | ⏳ |
| 5.2 | PR Qwen Code bugfix | OpenClaw | Setmana 2 | ⏳ |
| 5.3 | PR Codex bugfix | OpenClaw | Setmana 2 | ⏳ |
| 5.4 | PR Claude Code docs | OpenClaw | Setmana 3 | ⏳ |

### O6: Monetització i Sostenibilitat (Setmana 4-12)
**Prioritat:** 🟢 BAIXA (però important)

| # | Acció | Responsable | Deadline | Estat |
|---|-------|-------------|----------|-------|
| 6.1 | Dissenyar marketplace assets | OpenClaw | Setmana 6 | ⏳ |
| 6.2 | Crear plugin DAW (MVP) | OpenClaw | Setmana 10 | ⏳ |
| 6.3 | API pública prompts (beta) | OpenClaw | Setmana 12 | ⏳ |
| 6.4 | Primer ingrés external | Pedro | Setmana 12 | ⏳ |

---

## 📊 MÈTRIQUES D'ÈXIT

### Setmanals
- [ ] Repos consolidats: 80 → 50
- [ ] Secrets resolts: 1 → 0
- [ ] Contribucions enviades: 6 → 10
- [ ] Documents Drive organitzats: TBD → 100%

### Mensuals
- [ ] Ambassador apps enviades: 0 → 3
- [ ] Meetups organitzats: 0 → 1
- [ ] Contingut públic publicat: 0 → 4
- [ ] Ingressos externs: €0 → €100+

### Trimestrals
- [ ] Ecosistema consolidat i documentat
- [ ] Programa ambassador actiu
- [ ] Primer ingrés external
- [ ] Comunitat creixent (50+ seguidors nous)

---

## 🛠️ RECURSOS NECESSARIS

### Temps de Pedro
- **Setmana 1-2:** 2h/dia (seguretat + configuració)
- **Setmana 3-6:** 1h/dia (ambassador + contingut)
- **Setmana 7-12:** 30min/dia (supervisió)

### Temps d'OpenClaw
- **Setmana 1-2:** 4h/dia (automatització + consolidació)
- **Setmana 3-6:** 2h/dia (documentació + integració)
- **Setmana 7-12:** 1h/dia (manteniment)

### Costos
- **APIs:** €0 (totes gratuïtes o Token Plan pagat)
- **Domini:** ~€10/any (belentani.eu)
- **Hosting:** €0 (GitHub Pages)
- **Total:** €10/any

---

## 📅 CALENDARI DETALLAT

### Setmana 1 (1-7 Set)
```
Dilluns 1: Revocar API key + purgar secret
Dimarts 2: Verificar RLS Supabase
Dimecres 3: Eliminar duplicats JSON
Dijous 4: Afegir .gitignore (batch 1/2)
Divendres 5: Afegir .gitignore (batch 2/2)
Dissabte 6: Afegir README (batch 1/2)
Diumenge 7: Afegir README (batch 2/2)
```

### Setmana 2 (8-14 Set)
```
Dilluns 8: Activar secret scanning
Dimarts 9: Configurar Google Drive API
Dimecres 10: Autenticar Drive
Dijous 11: Escanejar documents Drive
Divendres 12: Organitzar Drive (text)
Dissabte 13: Organitzar Drive (imatges)
Diumenge 14: Eliminar duplicats Drive
```

### Setmana 3 (15-21 Set)
```
Dilluns 15: Enviar app Qwen Ambassador
Dimarts 16: Enviar app HF Builders
Dimecres 17: Consolidar Duck repos (1/3)
Dijous 18: Consolidar Duck repos (2/3)
Divendres 19: Consolidar Duck repos (3/3)
Dissabte 20: Consolidar Judas/Omega (1/2)
Diumenge 21: Consolidar Judas/Omega (2/2)
```

### Setmana 4 (22-28 Set)
```
Dilluns 22: Enviar app Alibaba
Dimarts 23: Documentar arquitectura unificada
Dimecres 24: PR Transformers ES (1/3)
Dijous 25: PR Transformers ES (2/3)
Divendres 26: PR Transformers ES (3/3)
Dissabte 27: PR Qwen Code bugfix
Diumenge 28: PR Codex bugfix
```

### Setmana 5-8 (29 Set - 26 Oct)
```
- Primer contingut públic (blog/video)
- Organitzar meetup Barcelona
- PR Claude Code docs
- Arxivar repos inactius
- Dissenyar marketplace assets
```

### Setmana 9-12 (27 Oct - 23 Nov)
```
- Crear plugin DAW (MVP)
- API pública prompts (beta)
- Primer ingrés external
- Avaluació trimestral
- Pla Q1 2027
```

---

## 🎯 PRIORITATS D'AVUI

### 🔴 CRÍTIQUES (Avui 1 Set)
1. ✅ Revocar API key OpenRouter → https://openrouter.ai/keys
2. ✅ Executar `fix-github-critical.ps1 -Apply`
3. ✅ Eliminar `audit_repos.json` (duplicat)

### 🟠 ALTES (Demà 2 Set)
4. ✅ Verificar RLS Supabase
5. ✅ Configurar Google Drive API
6. ✅ Afegir .gitignore a repos restants

### 🟡 MITJANES (Aquesta setmana)
7. ✅ Enviar contribucions OSS pendents
8. ✅ Enviar aplicacions ambassador
9. ✅ Consolidar repos Duck

---

## 📝 NOTES I DECISIONS

### Decisions Preses
- **No esborrar repos buits** sense confirmació de Pedro
- **Consolidar Duck** però mantenir noms reconeixibles
- **Google Drive** requereix autenticació manual de Pedro
- **Ambassador** prioritzar Qwen (millor free tier)

### Riscos Identificats
- **API key compromesa** → costos no autoritzats
- **APIs gratuïtes** poden canviar termes
- **Fragmentació** dificulta manteniment
- **Temps limitat** de Pedro (treball + projectes)

### Dependències
- Pedro ha de generar App Password Gmail
- Pedro ha de configurar DNS belentani.eu
- Pedro ha d'autenticar Google Drive
- Pedro ha d'aprovar enviament d'emails

---

## 🔄 REVISIÓ I ACTUALITZACIÓ

**Freqüència:** Setmanal (cada diumenge)  
**Pròxima revisió:** 2026-09-08  
**Responsable:** OpenClaw (prepara) + Pedro (aprova)

### Canvis des de v1.0
- Versió inicial creada 2026-09-01

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Pla d'acció executiu 90 dies — Versió 1.0*
