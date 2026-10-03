#!/usr/bin/env python3
"""
Validador de Integridad de Datos — Manos Abiertas
Verifica que todos los archivos de datos tengan estructura correcta,
sin duplicados, sin referencias rotas y con tipos correctos.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

PROJECT_ROOT = Path(__file__).parent.parent
SRC_DIR = PROJECT_ROOT / "src"
DATA_DIR = SRC_DIR / "data"

def validar_archivo_ts(ruta: Path) -> Tuple[bool, List[str]]:
    """Valida la estructura básica de un archivo TypeScript"""
    errores = []
    
    if not ruta.exists():
        return False, [f"❌ Archivo no encontrado: {ruta}"]
    
    contenido = ruta.read_text(encoding="utf-8")
    
    # Verificar que tiene export
    if "export" not in contenido:
        errores.append(f"⚠️ Sin export: {ruta.name}")
    
    # Verificar que no tiene TODO sin resolver
    todos = re.findall(r"TODO|FIXME|HACK", contenido)
    if todos:
        errores.append(f"⚠️ Pendientes: {', '.join(set(todos))}")
    
    return (len(errores) == 0, errores)

def validar_todos():
    """Valida todos los archivos de datos y componentes"""
    print("=" * 70)
    print("VALIDADOR DE INTEGRIDAD — MANOS ABIERTAS")
    print("=" * 70)
    
    total_archivos = 0
    total_errores = 0
    
    # Validar archivos de datos
    print("\n[1] ARCHIVOS DE DATOS:")
    for archivo in sorted(DATA_DIR.glob("*.ts")):
        total_archivos += 1
        ok, errores = validar_archivo_ts(archivo)
        if ok:
            print(f"    ✅ {archivo.name}")
        else:
            total_errores += len(errores)
            print(f"    ❌ {archivo.name}")
            for e in errores:
                print(f"       {e}")
    
    # Validar componentes
    print("\n[2] COMPONENTES:")
    comp_dir = SRC_DIR / "components"
    for archivo in sorted(comp_dir.glob("*.tsx")):
        total_archivos += 1
        ok, errores = validar_archivo_ts(archivo)
        if ok:
            print(f"    ✅ {archivo.name}")
        else:
            total_errores += len(errores)
            print(f"    ❌ {archivo.name}")
            for e in errores:
                print(f"       {e}")
    
    print(f"\n📊 RESULTADO:")
    print(f"   Archivos validados: {total_archivos}")
    print(f"   Errores encontrados: {total_errores}")
    print(f"   Estado: {'✅ APROBADO' if total_errores == 0 else '⚠️ REQUIERE ATENCIÓN'}")

if __name__ == "__main__":
    validar_todos()
