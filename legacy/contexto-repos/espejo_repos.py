#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Espejo + limpieza segura del usuario.

1) Crea `repos/git/<repo>` (carpeta VACIA) por cada repo del panel de contexto.
2) Verifica las 3 reglas de oro antes de borrar:
     a) repo limpio (sin cambios sin commitear) y sin commits sin subir
     b) visible en GitHub (git ls-remote responde)
     c) clone de prueba OK (git clone --depth 1)
3) Borra SOLO los verificados. Nunca borra rutas protegidas ni un repo que
   contenga dentro otro repo NO verificado.

Uso:
    python espejo_repos.py              # dry-run: crea espejo + informe, NO borra
    python espejo_repos.py --apply      # crea espejo + BORRA lo verificado
    python espejo_repos.py --fast       # sin clone de prueba (menos lento)
"""
import argparse
import json
import os
import shutil
import stat
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path

HOME = Path.home()
BASE = Path(__file__).resolve().parent
PANEL = BASE / "contexto_panel.json"
ESPEJO = HOME / "repos" / "git"
REPORT_JSON = BASE / "espejo_verificacion.json"
REPORT_MD = BASE / "espejo_verificacion.md"

PROTEGIDOS = {
    HOME, HOME / "Desktop", HOME / "Documents", HOME / "Downloads",
    HOME / "Videos", HOME / "Pictures", HOME / "Music", HOME / "Favorites",
    HOME / "OneDrive", HOME / "repos", HOME / "repos" / "git", HOME / "USO",
    HOME / "_MEDIA", HOME / "AppData", HOME / ".config", HOME / ".ssh",
    HOME / "_PROYECTOS", HOME / "Google Drive",
}
NOMBRES_CRITICOS = {"windows", "users", "program files", "program files (x86)",
                    "appdata", "desktop", "documents", "onedrive"}


def run_proc(cmd, timeout=60):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout,
                           errors="replace")
        return r.returncode, r.stdout.strip(), r.stderr.strip()
    except Exception as e:
        return 1, "", str(e)


def git(path, *args, timeout=30):
    code, out, _ = run_proc(["git", "-C", str(path), *args], timeout=timeout)
    return out if code == 0 else ""


def verify(rec, do_clone=True):
    path = Path(rec["path"])
    remote = rec.get("remote") or ""
    motivos = []
    if not remote:
        return False, ["sin remoto"]
    st = git(path, "status", "--porcelain")
    if st:
        motivos.append("cambios sin commitear (%d)" % len(st.splitlines()))
    ab = git(path, "rev-list", "--count", "@{u}..HEAD")
    if not ab:
        motivos.append("sin upstream (no se puede comprobar push)")
    elif ab.isdigit() and int(ab) > 0:
        motivos.append("commits sin subir (%s)" % ab)
    code, out, _ = run_proc(["git", "ls-remote", remote, "HEAD"], timeout=40)
    if code != 0 or not out:
        motivos.append("remoto no responde (ls-remote)")
    if not motivos and do_clone:
        tmp = tempfile.mkdtemp(prefix="clonechk_")
        try:
            c, _, err = run_proc(["git", "clone", "--depth", "1", "--no-tags",
                                  remote, os.path.join(tmp, "c")], timeout=180)
            if c != 0:
                motivos.append("clone fallo: " + err[:80])
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    return (len(motivos) == 0), motivos


def on_rm_error(func, path, exc):
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception:
        pass


def crear_espejo(repos):
    ESPEJO.mkdir(parents=True, exist_ok=True)
    usados = {}
    creadas = 0
    for rec in repos:
        n = "".join(c for c in rec["name"] if c not in '<>:"/\\|?*').strip() or "repo"
        key = n.lower()
        if key in usados:
            usados[key] += 1
            n = "%s__%d" % (n, usados[key])
        else:
            usados[key] = 1
        (ESPEJO / n).mkdir(exist_ok=True)
        creadas += 1
    return creadas


def es_ancestro(p, q):
    try:
        return str(Path(q).resolve()).startswith(str(Path(p).resolve()) + os.sep)
    except Exception:
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="borra lo verificado")
    ap.add_argument("--fast", action="store_true", help="sin clone de prueba")
    args = ap.parse_args()

    if not PANEL.is_file():
        print("Falta", PANEL, "-> ejecuta antes: python contexto_panel.py")
        return 1
    data = json.loads(PANEL.read_text(encoding="utf-8"))
    repos = data["repos"]
    print("Panel: %d repos. Espejo -> %s" % (len(repos), ESPEJO))

    n = crear_espejo(repos)
    print("Carpetas vacias creadas/aseguradas en espejo: %d" % n)

    print("Verificando las 3 reglas (clone=%s)..." % ("no" if args.fast else "si"))
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=8) as ex:
        resultados = list(ex.map(lambda r: verify(r, not args.fast), repos))
    for rec, (ok, motivos) in zip(repos, resultados):
        rec["seguro_borrar"] = ok
        rec["motivos"] = motivos

    # Guardas: no borrar protegidos, ni ancestros, ni padres con hijos no seguros.
    by_path = {r["path"]: r for r in repos}

    def protegido(p):
        rp = Path(p).resolve()
        if rp in {x.resolve() for x in PROTEGIDOS}:
            return True
        if rp.name.lower() in NOMBRES_CRITICOS:
            return True
        if es_ancestro(rp, ESPEJO) or es_ancestro(ESPEJO, rp):
            return True
        return False

    for r in repos:
        if not r["seguro_borrar"]:
            continue
        if protegido(r["path"]):
            r["seguro_borrar"] = False
            r["motivos"].append("ruta protegida (no se borra)")
            continue
        hijos_unsafe = [q for q in by_path
                        if q != r["path"] and es_ancestro(r["path"], q)
                        and not by_path[q]["seguro_borrar"]]
        if hijos_unsafe:
            r["seguro_borrar"] = False
            r["motivos"].append("contiene %d repo(s) no verificados" % len(hijos_unsafe))

    seguros = [r for r in repos if r["seguro_borrar"]]
    no_seguros = [r for r in repos if not r["seguro_borrar"]]
    reporte = {
        "generado": datetime.now().isoformat(timespec="seconds"),
        "total": len(repos),
        "seguros_borrar": len(seguros),
        "no_seguros": len(no_seguros),
        "aplicado": args.apply,
        "espejo": str(ESPEJO),
        "seguros": [{"name": r["name"], "path": r["path"], "remote": r["remote"]} for r in seguros],
        "no_seguros": [{"name": r["name"], "path": r["path"],
                        "motivos": r["motivos"]} for r in no_seguros],
    }
    REPORT_JSON.write_text(json.dumps(reporte, ensure_ascii=False, indent=2), encoding="utf-8")

    md = ["# Verificacion de limpieza (espejo en repos/git)", "",
          "Generado: %s  |  total: %d  |  SEGURO BORRAR: %d  |  NO: %d  |  aplicado: %s"
          % (reporte["generado"], len(repos), len(seguros), len(no_seguros), args.apply), "",
          "## SEGURO BORRAR (%d)" % len(seguros), ""]
    for r in seguros:
        md.append("- `%s` <- %s" % (r["path"], r["remote"]))
    md += ["", "## NO BORRAR (%d)" % len(no_seguros), ""]
    for r in no_seguros:
        md.append("- `%s` — %s" % (r["path"], "; ".join(r["motivos"])))
    REPORT_MD.write_text("\n".join(md), encoding="utf-8")

    print("Verificacion en %.0fs -> seguros: %d | no: %d" % (time.time() - t0, len(seguros), len(no_seguros)))
    print("Informe:", REPORT_MD.name, "y", REPORT_JSON.name)

    if not args.apply:
        print("\nDRY-RUN. Nada borrado. Ejecuta con --apply para borrar los seguros.")
        return 0

    print("\nBorrando %d carpetas verificadas..." % len(seguros))
    borrados, fallos = [], []
    for r in seguros:
        p = Path(r["path"])
        try:
            shutil.rmtree(p, onerror=on_rm_error)
            borrados.append(r["path"])
        except Exception as e:
            fallos.append((r["path"], str(e)))
    manifiesto = BASE / ("espejo_borrados_%s.txt" % datetime.now().strftime("%Y%m%d_%H%M%S"))
    manifiesto.write_text("\n".join(borrados), encoding="utf-8")
    print("Borrados: %d | fallos: %d | manifiesto: %s" % (len(borrados), len(fallos), manifiesto.name))
    for p, e in fallos[:20]:
        print("  FALLO", p, e)
    return 0


if __name__ == "__main__":
    sys.exit(main())
