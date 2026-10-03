"""
Cloudflare Python Worker - auditor ligero de headers (solo lectura).
No ejecuta escaneo local, solo revisa URL remota que TU le pases.
Despliegue: npx wrangler deploy (TU lo ejecutas manualmente).
"""
from workers import Response

SECURITY_HEADERS = [
    "strict-transport-security",
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
]

async def on_fetch(request, env):
    url = request.url
    # Uso: https://tu-worker.workers.dev/?url=https://ejemplo.com
    from urllib.parse import urlparse, parse_qs
    q = parse_qs(urlparse(url).query)
    target = (q.get("url") or [""])[0]
    if not target:
        return Response.json({
            "uso": "?url=https://tu-sitio.com",
            "nota": "Solo audita headers, no modifica nada."
        })
    try:
        resp = await fetch(target, {"method": "HEAD"})
        faltantes = [h for h in SECURITY_HEADERS if not resp.headers.get(h)]
        return Response.json({
            "url": target,
            "ok": len(faltantes) == 0,
            "faltantes": faltantes,
        })
    except Exception as e:
        return Response.json({"url": target, "error": str(e)})
