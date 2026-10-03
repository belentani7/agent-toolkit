# INVENTARIO DE REPOS - auditoria verificada 2026-09-26

Generado por `INVENTARIO.ps1`. Datos reales, sin estimar:
`git remote get-url`, `git status --porcelain`, `git rev-list --count`, `git ls-tree -r --long HEAD`.

## Totales

| Categoria | Repos | Peso .git | Codigo tracked |
| --- | ---: | ---: | ---: |
| Propios (belentani7) | 79 | 1.05 GB | 341 MB |
| Clones de terceros | 13 | 1.78 GB | 706 MB |
| Sin remote (solo local) | 34 | 0.07 GB | 3.5 MB |
| **TOTAL** | **126** | **2.9 GB** | **1047 MB** |

- Repos unicos en GitHub (con remote): **89**
- Archivos tracked totales: **73625**
- Codigo <=2 MB: **1047 MB** en **67809** archivos (propios 341 MB / terceros 706 MB)
- Blobs >2 MB (binarios, inservibles para un LLM): **581.4 MB** en **145** archivos
- Volumen de una pasada de LLM: **274.5 M tokens** (todo) / **89.4 M tokens** (solo propios)
- Commits sin subir: **5** en **5** repos
- Repos con cambios sin commitear: **22**
- Repos atrasados (behind): **8**
- Repos sin upstream configurado: **6**

## BLOQUEOS - leer antes de subir

### B1. belentani-workspace NO se puede subir (limite 100 MB de GitHub)

Ruta: `C:\Users\USER\Desktop` (el Desktop entero es un repo). Commit sin subir `cde1d71`:

| Blob | Tamano | Limite 100 MB |
| --- | ---: | --- |
| `j.reg` | 900.0 MB | 9x superado |
| `aaa.reg` | 323.5 MB | 3.2x superado |
| `Recording 2026-09-23 093010.mp4` | 4.3 MB | ok |

Los dos `.reg` ya no estan en disco (salen como `D`), pero **los blobs siguen dentro del commit**.
El push sera **rechazado** por GitHub. Ademas el Desktop tiene 47 borrados, 8 anadidos y 32 sin trackear.

**Arreglo:** reescribir el commit sin los `.reg` (`git filter-repo` o amend) o resetear `cde1d71`.
**Nunca** hacer `git add -A` en el Desktop.

### B2. belentani-unified tiene un modulo borrado

`apps/secure-t` figura como borrado (`D`), no existe en disco, pero esta tracked (1 gitlink).
Un `commit -a` + push borraria `secure-t` del remoto. Decidir: restaurar el directorio o confirmar la baja.

### B3. Terceros con miles de cambios que NUNCA debes pushear

| Path local | Remoto | Modificados | Atras |
| --- | --- | ---: | ---: |
| `C:\Users\USER\Documents\01_PROYECTOS\_HERRAMIENTAS\paperclip` | paperclipai/paperclip | 6261 | 36 |
| `C:\Users\USER\Documents\Proyectos\PROJECTOS\freellmapi` | tashfeenahmed/freellmapi | 540 | 348 |
| `C:\Users\USER\.cursor\plugins\marketplaces\cli-anything` | HKUDS/CLI-Anything | 431 | 0 |
| `C:\Users\USER\AppData\Local\hermes\hermes-agent` | NousResearch/hermes-agent | 158 | 0 |
| `C:\Users\USER\Documents\_movido\MoneyPrinterTurbo` | harry0703/MoneyPrinterTurbo | 50 | 83 |

Son repos de terceros: no hay permiso de push. El ruido viene de builds, `node_modules` y entornos.
Dejarlos como espejo local.

## Commits sin subir (ahead > 0)

| Repo | Rama | Path local |
| --- | --- | --- |
| belentani7/ai-command-center-level10 | `main` | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\ai-command-center-level10` |
| belentani7/Belentani | `main` | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\Belentani` |
| belentani7/belentani-artista-unified | `main` | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-artista-unified` |
| belentani7/belentani-workspace | `main` | `C:\Users\USER\Desktop` |
| pro-vi/loopgen | `main` | `C:\Users\USER\Documents\_movido\loopgen` |

## Atrasados (behind > 0) - requieren pull antes de push

| Repo | Path local | Commits pendientes |
| --- | --- | ---: |
| belentani7/ai-command-center-level10 | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\ai-command-center-level10` | 4 |
| belentani7/Belentani | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\Belentani` | 5 |
| belentani7/belentani-artista-unified | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-artista-unified` | 14 |
| belentani7/belentani-github-catalogo-minimalista | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-github-catalogo-minimalista` | 7 |
| belentani7/belentani-omega-showcase | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-omega-showcase` | 7 |
| harry0703/MoneyPrinterTurbo | `C:\Users\USER\Documents\_movido\MoneyPrinterTurbo` | 83 |
| paperclipai/paperclip | `C:\Users\USER\Documents\01_PROYECTOS\_HERRAMIENTAS\paperclip` | 36 |
| tashfeenahmed/freellmapi | `C:\Users\USER\Documents\Proyectos\PROJECTOS\freellmapi` | 348 |

## Sin upstream - el push falla

| Repo | Rama | Path local |
| --- | --- | --- |
| belentani7/20-demos | `main` | `C:\Users\USER\Documents\Proyectos\respaldo_belentani\20-demos` |
| belentani7/belentani-judas-evolved | `HEAD` | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\belentani-judas-evolved` |
| belentani7/belentani-unified | `gh-pages` | `C:\Users\USER\Desktop\belentani-unified\dist` |
| belentani7/belentani-unified | `main` | `C:\Users\USER\Desktop\belentani-unified` |
| belentani7/CARQUIDEC | `HEAD` | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\CARQUIDEC` |
| belentani7/uaol-machine-realm | `HEAD` | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\uaol-machine-realm` |

Fix: `git -C <path> push -u origin <branch>`

## Propios con cambios sin commitear

| Repo | .git | Codigo | Modif. | Sin trackear | Path local |
| --- | ---: | ---: | ---: | ---: | --- |
| belentani-omega-versions-archive | 428.5 MB | 126.06 MB | 1 | 0 | `C:\Users\USER\Documents\_OMEGA-ARCHIVE-2026-09-22` |
| belentani-unified | 103.8 MB | 60.11 MB | 5 | 3 | `C:\Users\USER\Desktop\belentani-unified` |
| belentani-workspace | 101.9 MB | 5.73 MB | 56 | 32 | `C:\Users\USER\Desktop` |
| belentani-unified | 99.6 MB | 60.11 MB | 1 | 20 | `C:\Users\USER\Desktop\belentani-unified\dist` |
| belentani-unified | 14.3 MB | 60.11 MB | 0 | 58 | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-unified` |
| judas-experience-web | 11 MB | 2.67 MB | 7 | 0 | `C:\Users\USER\Desktop\judas-experience-web` |
| Plan-de-Adquisici-n-de-Informaci-n-y-Ejecuci-n-Automatizada | 1.7 MB | 1.45 MB | 0 | 1 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\Plan de Adquisición de Información y Ejecución Automatizada` |
| uaol-machine-realm | 1.3 MB | 2.75 MB | 3 | 0 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\uaol-machine-realm` |
| modern-creative-web-development | 1.1 MB | 0.17 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\modern-creative-web-development` |
| Review-uploaded-workspace-archive | 0.9 MB | 0.28 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\Review uploaded workspace archive` |
| system-one-local-belentani | 0.4 MB | 0.87 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\system-one-local-belentani` |
| Compa-ero-de-Windows-Similar-a-Widget-Flotante-en-Android | 0.4 MB | 0.11 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\Compañero de Windows Similar a Widget Flotante en Android` |
| workspace-13- | 0.2 MB | 0.35 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (13)` |
| workspace-14- | 0.2 MB | 0.35 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (14)` |
| Belentani-Agency-AI-Omega | 0.2 MB | 0.38 MB | 0 | 1 | `C:\Users\USER\Documents\01_PROYECTOS_ACTIVOS\Belentani-Agency-AI-Omega` |
| workspace-12- | 0.2 MB | 0.16 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (12)` |
| comfyui-json-compiler | 0.1 MB | 0.13 MB | 0 | 1 | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\comfyui-json-compiler` |
| cinematic-prompt-formatter | 0.1 MB | 0.16 MB | 0 | 1 | `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\cinematic-prompt-formatter` |
| workspace-2- | 0.1 MB | 0.26 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (2)` |
| contexto-repos | 0.1 MB | 0.27 MB | 1 | 0 | `C:\Users\USER\Documents\_movido\_PROYECTOS\contexto-repos` |
| workspace | 0.1 MB | 0.22 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace` |
| Revisi-n-de-Herramientas-Python-en-GitHub-y-Locales | 0.1 MB | 0.47 MB | 0 | 1 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\Revisión de Herramientas Python en GitHub y Locales` |
| workspace-21- | 0.1 MB | 0.2 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (21)` |
| workspace-10- | 0.1 MB | 0.18 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (10)` |
| workspace-11- | 0.1 MB | 0.13 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (11)` |
| workspace-1- | 0.1 MB | 0.21 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (1)` |
| workspace-18- | 0.1 MB | 0.18 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (18)` |
| workspace-15- | 0.1 MB | 0.16 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (15)` |
| workspace-17- | 0.1 MB | 0.33 MB | 0 | 2 | `C:\Users\USER\_PROYECTOS\_DESCARGAS_EXTRAIDAS\workspace (17)` |

## Propios ya sincronizados (limpios, upstream OK, 0 ahead 0 behind)

- `agentbox` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\agentbox`
- `agentguard` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\agentguard`
- `agent-skills` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\agent-skills`
- `aprende-brasil` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\aprende-brasil`
- `arte-que-veste` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\arte-que-veste`
- `Belentani.cv-ai` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\Belentani.cv-ai`
- `belentani_Omega` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani_Omega`
- `belentani7` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani7`
- `belentani7.github.io` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani7.github.io`
- `belentani-es-neon` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-es-neon`
- `belentaniexperience` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentaniexperience`
- `belentani-experience-tour` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-experience-tour`
- `belentani-java-platform` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-java-platform`
- `belentani-judas-era-omega` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-judas-era-omega`
- `belentani-judas-experience` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-judas-experience`
- `belentani-judas-web` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-judas-web`
- `belentani-monorepo` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-monorepo`
- `belentani-omega-immersive-portal` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-omega-immersive-portal`
- `belentani-omega-template` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-omega-template`
- `Belentanislide` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\Belentanislide`
- `belentani-the-judas-experience` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-the-judas-experience`
- `belentani-the-judas-experience-archive` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-the-judas-experience-archive`
- `belentani-video-forge` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belentani-video-forge`
- `belent-cad` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\belent-cad`
- `claude-skills-pack` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\claude-skills-pack`
- `CODEX-OMEGA-SKILL` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\CODEX-OMEGA-SKILL`
- `Cruzando-el-charco` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\Cruzando-el-charco`
- `deepseek-fix-verify` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\deepseek-fix-verify`
- `duck-2026` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-2026`
- `duck-apps` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-apps`
- `duck-apps-web` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-apps-web`
- `duck-belentani-os-audited-2026-08-23` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-belentani-os-audited-2026-08-23`
- `duck-docs` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-docs`
- `duck-ecosystem` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-ecosystem`
- `duck-full-studio-pro` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-full-studio-pro`
- `duck-hub` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-hub`
- `duck-lab` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-lab`
- `duck-music-lab` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-music-lab`
- `Duck-Omega` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\Duck-Omega`
- `duck-studio-suite` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-studio-suite`
- `duck-unified-master` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-unified-master`
- `duck-zion-apex-public` - `C:\Users\USER\Documents\github-scan-2026-09-25\public-clones\duck-zion-apex-public`

**Total sincronizados y verificados: 42 repos.**

## Coste estimado con LLM

GPT-Alpha es un agente interno de OpenAI (filtrado en 2025-09) **sin API ni precio publico**.
La tabla usa los modelos frontera equivalentes, precio por 1M de tokens.

Base de calculo: CodeMB / 4 bytes por token.

| Volumen | MB | Archivos | Tokens |
| --- | ---: | ---: | ---: |
| Solo repos propios (79) | 341 | 15631 | 89.4 M |
| Todos los repos con remote (92) | 1047.1 | 67809 | 274.5 M |

### Escenario A - una pasada de lectura (input 1x, output 5%)

Coste = tokens * precio_input + (5% tokens) * precio_output

| Modelo | Solo propios | Todos |
| --- | ---: | ---: |
| GPT-6 Astra (frontera) | $1117 | $3431 |
| GPT-5.6 Sol | $447 | $1372 |
| GPT-5.5 | $581 | $1784 |
| GPT-6 Sol | $223 | $686 |
| GPT-5 | $156 | $480 |
| GPT-6 Luna (barato) | $11 | $34 |

### Escenario B - trabajo agentico real (input 10x por relecturas, output 10%)

Un agente reenvia el contexto en cada turno: input ~10x, output ~10% (informes y diffs).

| Modelo | Solo propios | Todos |
| --- | ---: | ---: |
| GPT-6 Astra (frontera) | $9387 | $28821 |
| GPT-5.6 Sol | $3755 | $11528 |
| GPT-5.5 | $4738 | $14548 |
| GPT-6 Sol | $1877 | $5764 |
| GPT-5 | $1207 | $3706 |
| GPT-6 Luna (barato) | $94 | $288 |

### Escenario C - economico, solo lo que importa (input 3x, output 3%, GPT-6 Luna)

- Solo propios: **USD 28**
- Todos: **USD 86**

### Excluido del calculo

- 581.41 MB en 145 blobs >2 MB (registros, HTML giant, video, binarios). Sin util para un LLM.
- Los 34 repos sin remote (3.5 MB), que ademas no se subirian.
- Cache de input: si el mismo repo se repregunta, el cached input baja 10x (p.ej. GPT-6 Astra $1.00/M).

Conclusion: el precio lo decide el modelo, no el volumen. GPT-6 Luna hace **todo** por menos de
lo que cuesta una sesion de GPT-6 Astra sobre **un solo repo**.

## Orden de subida recomendado

1. Los 42 repos sincronizados: no tocar.
2. Los 5 commits sueltos (tabla ahead): push directo, sin conflictos.
3. Configurar upstream en los 6 repos sin rama de seguimiento.
4. `belentani-unified` y `judas-experience-web`: revisar diff linea a linea, luego commitear.
5. `belentani-workspace` (Desktop): **requiere BLOQUEO B1** antes de cualquier push.
6. Terceros: no pushear nunca; candidata a borrado local tras verificar.

