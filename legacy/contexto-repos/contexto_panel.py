#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Panel de CONTEXTO (no auditoria) — estado real de TODOS tus repos git.

Mide 0-100 % el estado de cada repo con barra progresiva rojo -> amarillo -> verde,
que funcion cumple, que le falta y el tiempo estimado de arreglo.

Autoejecutable:
    python contexto_panel.py                 # escanea y regenera JSON + HTML
    python contexto_panel.py --serve 8770    # ademas sirve y abre el panel

El HTML se auto-actualiza cada 1 h leyendo contexto_panel.json (via HTTP).
"""
import argparse
import html
import json
import os
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

OWNER = "belentani7"
HOME = Path.home()
BASE = Path(__file__).resolve().parent
OUT_JSON = BASE / "contexto_panel.json"
OUT_HTML = BASE / "contexto_panel.html"

ROOTS = [
    (HOME / "repos", 6),
    (HOME / "_PROYECTOS", 6),
    (HOME / "PROYECTOS", 6),
    (HOME / "Desktop", 3),
    (HOME / "Documents", 4),
    (HOME / "GitHub", 6),
    (HOME / "github-limpieza", 4),
    (HOME / "_ORDENAR", 4),
    (HOME / "buquet", 4),
    (HOME / "Belentani", 4),
    (HOME / "MoneyPrinterTurbo", 3),
    (HOME / "MANOS-ABIERTAS-UNIFICADO", 4),
    (HOME / "omega-max-universal", 4),
    (HOME / "vibe-coding", 4),
    (HOME / "tools", 4),
    (HOME / "USO", 4),
    (HOME / "ORDENADO", 4),
]

PRUNE = {
    "node_modules", ".git", ".venv", "venv", "__pycache__", "AppData",
    "dist", "build", ".next", ".astro", ".turbo", ".cache", "site-packages",
    ".pnpm-store", "target", ".rustup", ".cargo", "_MEDIA", "OneDrive",
    ".m2", ".gradle", ".nuget", "WPS Cloud Files", "Movies", "Music",
    "temp_extraccion", "_SALIDAS", ".ollama", ".codex", ".claude",
}

MANIFIESTOS = ["package.json", "pyproject.toml", "requirements.txt",
               "Cargo.toml", "go.mod", "composer.json"]

FUNC_KEY = [
    (r"visual|engine|three|webgl|3d|render|shader", "Motor visual / experiencia 3D"),
    (r"judas|eau|noire|relato|narrat|novel|story", "Obra narrativa / marca artistica"),
    (r"secure|security|cyber|guard|audit", "Seguridad / gobernanza"),
    (r"school|educa|curso|academy|manos|lingua|open-school|eso|tutor", "Educacion / formacion"),
    (r"music|audio|suno|rvc|voz|voice|song|harmonia|muse|studio", "Musica / audio IA"),
    (r"panel|dashboard|invent|contexto|informe|grafo|graph", "Panel / visualizacion de datos"),
    (r"gateway|router|mcp|server|backend|fastapi|api", "API / backend / tooling IA"),
    (r"\bcv\b|resume|portfolio|profile|landing|web|site|portal", "Web / portafolio"),
    (r"local|studio|lumen|duck|zion|system-one|harness", "Estudio / sistema local"),
    (r"money|monet|saas|client|business|agency|store|shop", "Monetizacion / cliente"),
]


def run_git(repo, *args, timeout=20):
    try:
        r = subprocess.run(["git", "-C", str(repo), *args], capture_output=True,
                           text=True, timeout=timeout, errors="replace")
        if r.returncode == 0:
            return r.stdout.strip()
    except Exception:
        pass
    return ""


def discover():
    found = {}
    for root, maxdepth in ROOTS:
        if not root.is_dir():
            continue
        root = root.resolve()
        base_depth = len(root.parts)
        for dirpath, dirnames, _ in os.walk(root, onerror=lambda e: None):
            p = Path(dirpath)
            if len(p.parts) - base_depth > maxdepth:
                dirnames[:] = []
                continue
            if (p / ".git").exists():
                found[str(p)] = p
            dirnames[:] = [d for d in dirnames if d not in PRUNE]
    return [found[k] for k in sorted(found)]


def dir_size(p, budget=1.5):
    total = 0
    t0 = time.time()
    for root, dirs, files in os.walk(p):
        dirs[:] = [d for d in dirs if d not in PRUNE]
        for f in files:
            try:
                total += (Path(root) / f).stat().st_size
            except Exception:
                pass
        if time.time() - t0 > budget:
            break
    return total


def has_any(p, names):
    return any((p / n).exists() for n in names)


def git_info(p):
    """Lee remoto/rama/fecha directo del .git (sin lanzar git)."""
    g = p / ".git"
    remote = ""
    branch = "(sin commits)"
    last = ""
    cfg = g / "config"
    if cfg.is_file():
        try:
            txt = cfg.read_text(encoding="utf-8", errors="replace")
            m = re.search(r'\[remote "origin"\][^\[]*?url\s*=\s*(\S+)', txt, re.S)
            if m:
                remote = m.group(1)
        except Exception:
            pass
    head = g / "HEAD"
    if head.is_file():
        try:
            h = head.read_text(encoding="utf-8", errors="replace").strip()
            branch = h.split("/")[-1] if h.startswith("ref:") else "(detached)"
        except Exception:
            pass
    logs = g / "logs" / "HEAD"
    if logs.is_file():
        try:
            line = logs.read_text(encoding="utf-8", errors="replace").strip().splitlines()[-1]
            ts = int(line.split("\t")[0].split()[4])
            last = datetime.fromtimestamp(ts, timezone.utc).date().isoformat()
        except Exception:
            pass
    return remote, branch, last


def analyze(p):
    remote, branch, last = git_info(p)
    porcelain = run_git(p, "status", "--porcelain")
    dirty = len([x for x in porcelain.splitlines() if x.strip()])
    recent = False
    if last:
        try:
            dt = datetime.fromisoformat(last).replace(tzinfo=timezone.utc)
            recent = (datetime.now(timezone.utc) - dt).days <= 60
        except Exception:
            pass
    wf = p / ".github" / "workflows"
    info = {
        "name": p.name,
        "path": str(p),
        "remote": remote,
        "owner": (re.search(r"github\.com[:/]+([^/]+)/", remote).group(1)
                  if remote and re.search(r"github\.com[:/]+([^/]+)/", remote) else ""),
        "branch": branch,
        "dirty": dirty,
        "last_commit": last,
        "recent": recent,
        "readme": has_any(p, ["README.md", "readme.md", "README.MD", "README.rst"]),
        "manifest": has_any(p, MANIFIESTOS),
        "gitignore": (p / ".gitignore").is_file(),
        "license": has_any(p, ["LICENSE", "LICENSE.md", "LICENSE.txt", "license"]),
        "security": has_any(p, ["SECURITY.md", "security.md"]),
        "ci": wf.is_dir() and any(wf.iterdir()),
        "tests": has_any(p, ["tests", "test", "__tests__", "spec"]) or (p / "tests").is_dir(),
        "size_mb": round(dir_size(p) / (1024 * 1024), 1),
        "secrets": [n for n in os.listdir(p)
                    if n in (".env", ".env.local", ".env.production", "credentials.json")
                    or n.lower().endswith((".pem", ".key")) or "keys" in n.lower()][:5],
    }
    return info


FUNC_CACHE = {}


def infer_funcion(p, info):
    text = (info["name"] + " " + (info["remote"] or "")).lower()
    for pat, label in FUNC_KEY:
        if re.search(pat, text):
            return label
    for fn in ("README.md", "readme.md", "README.MD"):
        f = p / fn
        if f.is_file():
            try:
                for line in f.read_text(encoding="utf-8", errors="replace").splitlines():
                    s = line.strip().lstrip("#").strip()
                    if s and not s.startswith("!") and len(s) > 8:
                        return s[:70]
            except Exception:
                pass
    return "(sin documentar)"


def score(info):
    s = 0
    falta = []
    items = [
        ("readme", 12, "README"),
        ("manifest", 12, "manifiesto"),
        ("ci", 12, "CI"),
        ("gitignore", 8, ".gitignore"),
        ("license", 8, "LICENSE"),
        ("security", 6, "SECURITY.md"),
        ("tests", 8, "tests"),
        ("recent", 8, "commit reciente"),
    ]
    for key, pts, label in items:
        if info[key]:
            s += pts
        else:
            falta.append(label)
    if info["remote"]:
        s += 14
    else:
        falta.append("remoto/push")
    if info["dirty"] == 0:
        s += 12
    else:
        falta.append("%d cambios sin subir" % info["dirty"])
    return min(s, 100), falta


def tiempo_arreglo(pct, info):
    if pct >= 90:
        return 0
    base = (100 - pct) * 1.5
    if not info["remote"]:
        base += 30
    if info["dirty"] > 0:
        base += 15
    if not info["manifest"]:
        base += 10
    return int(round(base / 5.0) * 5)


def build():
    print("[1/3] descubriendo repos git...", flush=True)
    repos = discover()
    print("      %d repos" % len(repos), flush=True)
    print("[2/3] analizando estado...", flush=True)

    with ThreadPoolExecutor(max_workers=24) as ex:
        infos = list(ex.map(analyze, repos))

    items = []
    for info, p in zip(infos, repos):
        pct, falta = score(info)
        items.append({
            **info,
            "pct": pct,
            "funcion": infer_funcion(p, info),
            "falta": falta,
            "tiempo_min": tiempo_arreglo(pct, info),
        })
    items.sort(key=lambda x: (x["pct"], x["name"].lower()))

    total = len(items)
    avg = round(sum(i["pct"] for i in items) / total, 1) if total else 0
    payload = {
        "generado": datetime.now().isoformat(timespec="seconds"),
        "owner": OWNER,
        "total": total,
        "promedio": avg,
        "verde": sum(1 for i in items if i["pct"] >= 80),
        "amarillo": sum(1 for i in items if 40 <= i["pct"] < 80),
        "rojo": sum(1 for i in items if i["pct"] < 40),
        "tiempo_total_min": sum(i["tiempo_min"] for i in items),
        "repos": items,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print("[3/3] JSON ->", OUT_JSON.name, flush=True)
    write_html(payload)
    print("      HTML ->", OUT_HTML.name, flush=True)
    return payload


def write_html(payload):
    data = json.dumps(payload, ensure_ascii=False)
    doc = """<!doctype html><html lang="es"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,">
<title>Panel de Contexto - belentani7</title>
<style>
:root{--bg:#0b1220;--card:#111a2e;--line:#24304a;--tx:#e5e7eb;--mut:#94a3b8}
*{box-sizing:border-box}body{margin:0;font-family:Segoe UI,system-ui,Arial;background:var(--bg);color:var(--tx)}
header{padding:18px 26px;background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
h1{margin:0 0 4px;font-size:20px}.sub{color:var(--mut);font-size:13px}
.wrap{padding:18px 26px}
.cards{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;min-width:120px}
.card .v{font-size:24px;font-weight:700}.card .l{color:var(--mut);font-size:12px}
.big{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:6px 0 4px}
.bigbar{height:22px;background:#0f172a;border-radius:6px;overflow:hidden;margin-top:8px}
.bigbar>i{display:block;height:100%;text-align:right;color:#08101f;font-size:12px;font-weight:700;padding-right:8px;line-height:22px;transition:width .4s}
.bar{display:inline-block;width:90px;height:14px;background:#0f172a;border-radius:6px;overflow:hidden;vertical-align:middle;margin-right:8px}
.bar>i{display:block;height:100%}
.controls{margin:12px 0;display:flex;gap:8px;flex-wrap:wrap}
input,select{background:#0f172a;color:var(--tx);border:1px solid #2b3a55;border-radius:8px;padding:8px 10px}
table{border-collapse:collapse;width:100%;font-size:13px;margin-top:8px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #1f2a40;vertical-align:middle}
th{position:sticky;top:96px;background:var(--card);cursor:pointer;user-select:none}
tbody tr:hover{background:#131d33}
.tag{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;background:#1e293b;color:#cbd5e1;margin-right:4px}
.num{text-align:right;font-variant-numeric:tabular-nums}
a{color:#7dd3fc;text-decoration:none}footer{text-align:center;color:var(--mut);font-size:12px;padding:20px}
</style>
<header>
<h1>Panel de Contexto — estado de tus repos git <span class="tag" id="gen">--</span></h1>
<div class="sub">Contexto, no auditoria. Barra 0-100%: <b style="color:#f85149">rojo</b> - <b style="color:#d29922">amarillo</b> - <b style="color:#3fb950">verde</b>. Que funcion cumple, que le falta y tiempo de arreglo. Se auto-actualiza cada 1 h.</div>
</header>
<div class="wrap">
<div class="big">
  <div style="display:flex;justify-content:space-between"><b>Estado global</b><span id="avg-txt">--</span></div>
  <div class="bigbar"><i id="avg-bar" style="width:0%"></i></div>
</div>
<div class="cards">
  <div class="card"><div class="v" id="c-total">--</div><div class="l">repos git</div></div>
  <div class="card"><div class="v" style="color:#3fb950" id="c-verde">--</div><div class="l">verde (80-100)</div></div>
  <div class="card"><div class="v" style="color:#d29922" id="c-amarillo">--</div><div class="l">amarillo (40-79)</div></div>
  <div class="card"><div class="v" style="color:#f85149" id="c-rojo">--</div><div class="l">rojo (0-39)</div></div>
  <div class="card"><div class="v" id="c-tiempo">--</div><div class="l">tiempo total arreglo</div></div>
</div>
<div class="controls">
  <input id="q" placeholder="Buscar repo..." oninput="render()">
  <select id="f" onchange="render()">
    <option value="">Todos</option><option value="r">Solo rojo</option>
    <option value="a">Solo amarillo</option><option value="v">Solo verde</option>
    <option value="noremote">Sin remoto</option><option value="dirty">Con cambios sin subir</option>
  </select>
  <select id="s" onchange="render()">
    <option value="pct">Ordenar: estado</option><option value="name">Ordenar: nombre</option>
    <option value="tiempo">Ordenar: tiempo arreglo</option>
  </select>
</div>
<table id="t"><thead><tr>
<th onclick="setS('name')">Repo</th><th onclick="setS('pct')">Estado</th><th>Funcion</th>
<th>Que le falta</th><th onclick="setS('tiempo')">Tiempo</th><th>Remote</th><th>Ultimo commit</th>
</tr></thead><tbody id="tb"><tr><td colspan="7" style="text-align:center;color:#94a3b8">Cargando...</td></tr></tbody></table>
<footer>belentani7 · generado por <code>contexto_panel.py</code> · <span id="foot">--</span></footer>
</div>
<script>
const EMB = __DATA__;
let DATA = EMB, sortKey = "pct";
function color(p){var h=Math.round(p*1.2);return "hsl("+h+",70%,45%)"}   // rojo->amarillo->verde progresivo
function esc(t){var d=document.createElement("div");d.textContent=t==null?"":t;return d.innerHTML}
function mins(m){if(!m)return "0m";var h=Math.floor(m/60),r=m%60;return (h?h+"h ":"")+r+"m"}
function setS(k){sortKey=k;render()}
function render(){
  var q=document.getElementById("q").value.toLowerCase(), f=document.getElementById("f").value;
  document.getElementById("gen").textContent="act. "+DATA.generado;
  document.getElementById("avg-txt").textContent=DATA.promedio+"% · "+DATA.total+" repos · "+mins(DATA.tiempo_total_min)+" de trabajo";
  var b=document.getElementById("avg-bar");b.style.width=DATA.promedio+"%";b.style.background=color(DATA.promedio);b.textContent=DATA.promedio+"%";
  document.getElementById("c-total").textContent=DATA.total;
  document.getElementById("c-verde").textContent=DATA.verde;
  document.getElementById("c-amarillo").textContent=DATA.amarillo;
  document.getElementById("c-rojo").textContent=DATA.rojo;
  document.getElementById("c-tiempo").textContent=mins(DATA.tiempo_total_min);
  document.getElementById("foot").textContent=new Date().toLocaleString();
  var rows=DATA.repos.filter(function(r){
    if(q && (r.name+" "+r.funcion).toLowerCase().indexOf(q)<0) return false;
    if(f==="r")return r.pct<40; if(f==="a")return r.pct>=40&&r.pct<80; if(f==="v")return r.pct>=80;
    if(f==="noremote")return !r.remote; if(f==="dirty")return r.dirty>0; return true;
  });
  rows.sort(function(a,b){if(sortKey==="name")return a.name.localeCompare(b.name);
    if(sortKey==="tiempo")return b.tiempo_min-a.tiempo_min; return a.pct-b.pct});
  var tb=document.getElementById("tb");tb.innerHTML="";
  rows.forEach(function(r){
    var tr=document.createElement("tr");
    var rem=r.remote?('<a href="'+esc(r.remote.replace(/\\.git$/,""))+'" target="_blank">'+esc(r.owner||"remoto")+'</a>'):'<span style="color:#f85149">sin remoto</span>';
    var falta=r.falta.length?r.falta.map(function(x){return '<span class="tag">'+esc(x)+'</span>'}).join(""):'<span style="color:#3fb950">nada critico</span>';
    tr.innerHTML='<td><b>'+esc(r.name)+'</b><div style="color:#64748b;font-size:11px">'+esc(r.path)+'</div></td>'
      +'<td><span class="bar"><i style="width:'+r.pct+'%;background:'+color(r.pct)+'"></i></span><span class="num">'+r.pct+'%</span></td>'
      +'<td>'+esc(r.funcion)+'</td><td>'+falta+'</td><td class="num">'+mins(r.tiempo_min)+'</td>'
      +'<td>'+rem+'</td><td style="color:#94a3b8">'+esc(r.last_commit||"?")+'</td>';
    tb.appendChild(tr);
  });
}
async function refresh(){
  try{var resp=await fetch("contexto_panel.json",{cache:"no-store"});
    if(resp.ok){DATA=await resp.json();}}catch(e){}
  render();
}
refresh();setInterval(refresh,3600000);
</script></html>"""
    OUT_HTML.write_text(doc.replace("__DATA__", data), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--serve", type=int, default=0)
    args = ap.parse_args()
    payload = build()
    print("\nResumen: %d repos | promedio %.1f%% | verde %d / amarillo %d / rojo %d | %d min"
          % (payload["total"], payload["promedio"], payload["verde"],
             payload["amarillo"], payload["rojo"], payload["tiempo_total_min"]))
    if args.serve:
        import functools
        import http.server
        import webbrowser
        port = args.serve
        handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(BASE))
        webbrowser.open("http://localhost:%d/contexto_panel.html" % port)
        print("Sirviendo en http://localhost:%d/contexto_panel.html (Ctrl+C para parar)" % port)
        http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
    return 0


if __name__ == "__main__":
    sys.exit(main())
