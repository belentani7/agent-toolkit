#!/usr/bin/env python3
"""Exporta el inventario de bloques archivados de este repositorio a JSON.

Este repo (Mother 02 - Devtools & Skills, antes "agent-toolkit") reúne en
``legacy/`` los repos originales del ecosistema Belentani sin reescribirlos.
La tabla "## Origen de cada bloque" del README.md documenta cada bloque
(repo original, tamaño en KB, visibilidad, sitio vivo y descripción).

Este script cruza el contenido real de ``legacy/`` con la tabla del README y
emite un JSON con el inventario completo. Si una carpeta de ``legacy/`` no
aparece en la tabla se incluye con ``en_readme: false``.

Uso:
    python scripts/export.py                # JSON a stdout
    python scripts/export.py --out f.json   # JSON a archivo
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
LEGACY = ROOT / "legacy"

# Fila de la tabla del README: | `legacy/<carpeta>` | [<repo>](url) | KB | vis | sitio | desc |
FILA_RE = re.compile(r"^\|\s*`?legacy/([^`|]+)`?\s*\|")


def leer_tabla_readme(ruta_readme: Path = README) -> dict[str, dict]:
    """Devuelve {carpeta: metadatos} a partir de la tabla del README.

    Lanza FileNotFoundError si no existe el README y ValueError si no
    encuentra ninguna fila de la tabla (tabla vacía o formato cambiado).
    """
    if not ruta_readme.is_file():
        raise FileNotFoundError(f"No se encontró el README en {ruta_readme}")

    filas: dict[str, dict] = {}
    for linea in ruta_readme.read_text(encoding="utf-8").splitlines():
        m = FILA_RE.match(linea)
        if not m:
            continue
        celdas = [c.strip() for c in linea.split("|")]
        # Con la barra inicial y final quedan al menos 8 partes:
        # ['', '`legacy/x`', '[repo](url)', 'KB', 'vis', 'sitio', 'desc', '']
        if len(celdas) < 8:
            continue
        carpeta = m.group(1).strip()
        repo_link = celdas[2]
        repo_m = re.match(r"\[?`?([^`\]]+)`?\]?", repo_link)
        kb_raw = celdas[3].replace(",", "")
        try:
            kb = int(kb_raw)
        except ValueError:
            kb = None
        filas[carpeta] = {
            "repo_original": repo_m.group(1).strip() if repo_m else None,
            "kb": kb,
            "visibilidad": celdas[4] or None,
            "sitio": celdas[5] or None,
            "descripcion": "|".join(celdas[6:-1]).strip() or None,
        }
    if not filas:
        raise ValueError("La tabla 'Origen de cada bloque' del README no contiene filas")
    return filas


def export_inventario() -> dict:
    """Construye el inventario: carpetas reales de legacy/ + metadatos del README."""
    if not LEGACY.is_dir():
        raise FileNotFoundError(f"No se encontró el directorio legacy/ en {ROOT}")
    carpetas = sorted(p.name for p in LEGACY.iterdir() if p.is_dir())
    tabla = leer_tabla_readme()

    bloques = []
    for carpeta in carpetas:
        meta = tabla.get(carpeta)
        bloque = {"carpeta": f"legacy/{carpeta}"}
        if meta:
            bloque.update(meta)
            bloque["en_readme"] = True
        else:
            bloque.update(
                {
                    "repo_original": None,
                    "kb": None,
                    "visibilidad": None,
                    "sitio": None,
                    "descripcion": None,
                    "en_readme": False,
                }
            )
        bloques.append(bloque)

    return {
        "proyecto": "backend_aportaciones_software02 (Mother 02 - Devtools & Skills)",
        "generado": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "total": len(bloques),
        "bloques": bloques,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Exporta el inventario de bloques a JSON")
    parser.add_argument("--out", type=Path, default=None, help="Ruta del JSON de salida (por defecto, stdout)")
    args = parser.parse_args(argv)

    inventario = export_inventario()
    texto = json.dumps(inventario, ensure_ascii=False, indent=2) + "\n"
    if args.out:
        args.out.write_text(texto, encoding="utf-8")
    else:
        sys.stdout.write(texto)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
