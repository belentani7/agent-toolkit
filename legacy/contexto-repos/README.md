# contexto-repos

Panel de **contexto** (no auditoría) del ecosistema `belentani7`: estado real de todos
los repos git locales, con barra 0-100 % progresiva **rojo → amarillo → verde**, qué
función cumple cada repo, qué le falta y el tiempo estimado de arreglo.

> ## ⚠ ESTADO REAL 2026-09-26 — las repos NO estaban todas actualizadas
>
> La pasada anterior solo synció los repos que ya estaban limpios. Hay 3 bloqueos.
> **El detalle verificado está en [`INVENTARIO-REPOS.md`](./INVENTARIO-REPOS.md).**
>
> | Dato | Valor |
> |---|---:|
> | Repos locales con `.git` | 126 |
> | Repos propios (`belentani7`) | 79 |
> | Repos únicos en GitHub | 89 |
> | Peso total `.git` | **2.90 GB** |
> | Working tree checkeado | 3.75 GB / 73.625 archivos |
> | Código tracked (≤2 MB) | 1.047 MB / 67.809 archivos |
> | Blobs >2 MB (inútiles para un LLM) | 581 MB / 145 archivos |
> | Repos ya sincronizados y verificados | 42 |
> | Repos con cambios pendientes | 29 |
> | Commits sin subir | 5 |
>
> **B1 — `belentani-workspace` (el Desktop) no se puede subir.** El commit sin subir
> `cde1d71` lleva `j.reg` (900 MB) y `aaa.reg` (323 MB). GitHub rechaza blobs >100 MB,
> así que el push falla. Los archivos ya no están en disco, pero los blobs siguen en
> el commit: hay que reescribirlo o resetearlo.
>
> **B2 — `belentani-unified`:** `apps/secure-t` figura borrado y no existe en disco,
> pero está tracked. Un `commit -a` + push lo borraría del remoto.
>
> **B3 — 13 repos son de terceros** (paperclip, freellmapi, CLI-Anything ×2,
> hermes-agent, MoneyPrinterTurbo…) y suman 7.441 archivos modificados. No hay
> permiso de push: nunca subir esos.

## Contenido

| Archivo | Para qué |
|---|---|
| **`INVENTARIO-REPOS.md`** | **Índice maestro: los 126 repos, estado de sync, bloqueos y coste LLM.** |
| **`INVENTARIO.ps1`** | **Regenera el inventario desde git real. Sin estimaciones.** |
| **`COSTE.ps1`** | **Recalcula la tabla de coste por modelo y volumen de tokens.** |
| `contexto_panel.py` | Escanea todos los repos y genera `contexto_panel.json` + `.html`. |
| `contexto_panel.html` | Panel visual (se auto-actualiza cada 30 s si se sirve por HTTP). |
| `contexto_panel.json` | Datos del panel (repos, estado %, falta, tiempo). |
| `espejo_repos.py` | Crea el espejo de carpetas vacías `repos/git/<repo>` y verifica antes de borrar. |
| `espejo_verificacion.md/.json` | Informe: qué es seguro borrar y por qué no el resto. |

## Uso

```powershell
powershell -File INVENTARIO.ps1    # regenera INVENTARIO-REPOS.md (rápido, solo git)
powershell -File COSTE.ps1         # recalcula la tabla de coste LLM
python contexto_panel.py            # escanea y regenera JSON + HTML
python contexto_panel.py --serve 8770   # además sirve y abre el panel

python espejo_repos.py              # dry-run: crea espejo + informe, no borra
python espejo_repos.py --apply      # borra SOLO lo verificado (push OK + GitHub + clone OK)
```

## Coste de pasarlo todo por un LLM

GPT-Alpha es un agente interno de OpenAI (filtrado en 2025-09) **sin API ni precio
público**, así que la tabla usa los modelos frontera equivalentes.

| Modelo | Una pasada (propios) | Agéntico 10x (propios) | Agéntico 10x (todos) |
|---|---:|---:|---:|
| GPT-6 Astra | USD 1.117 | USD 9.387 | USD 28.821 |
| GPT-5.6 Sol | USD 447 | USD 3.755 | USD 11.528 |
| GPT-6 Sol | USD 223 | USD 1.877 | USD 5.764 |
| GPT-5 | USD 156 | USD 1.207 | USD 3.706 |
| GPT-6 Luna | USD 11 | USD 94 | USD 288 |

Base: 89,4 M tokens (solo propios) / 274,5 M tokens (los 92 repos con remote).
El precio lo decide el modelo, no el volumen.

## Regla de subida

Un repo se considera **subido** solo si cumple las cuatro:

1. `git rev-list --count @{u}..HEAD` = 0 (nada sin commitear por delante);
2. `git status --porcelain` vacío (nada sin commitear en el working tree);
3. upstream configurado (`git rev-parse --abbrev-ref @{u}` responde);
4. ningún blob >100 MB en el historial pendiente.

La regla 4 es la que falló en `belentani-workspace`.

## Regla de borrado

Se borra una carpeta local **solo** si pasa las tres:
1. repo limpio (sin cambios sin commitear) y sin commits sin subir;
2. visible en GitHub (`git ls-remote` responde);
3. clone de prueba OK (`git clone --depth 1`).

Nunca se borra una ruta protegida (home, Desktop, Documents, repos, USO…) ni un repo
que contenga dentro otro repo **no** verificado.

Actualizado desde la sesión del 2026-09-26.
