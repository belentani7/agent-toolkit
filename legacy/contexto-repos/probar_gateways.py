#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Comprueba en vivo que gateways IA gratis/baratos responden con tus claves.

No imprime claves. Mide latencia y nº de modelos. Uso: python probar_gateways.py
"""
import json
import os
import time
import urllib.request

# (nombre, url_modelos, env_key, estilo_auth, nota)
PROVEEDORES = [
    ("Groq", "https://api.groq.com/openai/v1/models", "GROQ_API_KEY", "bearer",
     "gpt-oss-120b/20b gratis, muy rapido"),
    ("Cerebras", "https://api.cerebras.ai/v1/models", "CEREBRAS_API_KEY", "bearer",
     "gpt-oss-120b gratis, muy rapido"),
    ("OpenRouter", "https://openrouter.ai/api/v1/key", "OPENROUTER_API_KEY", "bearer",
     "modelos :free"),
    ("Gemini", "https://generativelanguage.googleapis.com/v1beta/models", "GEMINI_API_KEY", "query",
     "gemini-flash gratis con limites"),
    ("NVIDIA NIM", "https://integrate.api.nvidia.com/v1/models", "NVIDIA_API_KEY", "bearer",
     "creditos gratis"),
    ("Mistral", "https://api.mistral.ai/v1/models", "MISTRAL_API_KEY", "bearer",
     "free tier experiment"),
    ("GitHub Models", "https://models.github.ai/inference/models", "GH_TOKEN", "bearer",
     "GPT/Llama gratis con cuenta GitHub"),
    ("DeepSeek", "https://api.deepseek.com/models", "DEEPSEEK_API_KEY", "bearer",
     "barato (no free)"),
    ("SiliconFlow", "https://api.siliconflow.cn/v1/models", "SILICONFLOW_API_KEY", "bearer",
     "modelos gratis limitados"),
    ("ZAI", "https://open.bigmodel.cn/api/paas/v4/models", "ZAI_API_KEY", "bearer",
     "glm flash barato/gratis"),
]


def get(url, key, estilo, timeout=12):
    req = urllib.request.Request(url)
    if estilo == "bearer" and key:
        req.add_header("Authorization", "Bearer " + key)
    if estilo == "query" and key:
        url += ("&" if "?" in url else "?") + "key=" + key
        req = urllib.request.Request(url)
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=timeout) as r:
        body = r.read().decode("utf-8", "replace")
    return r.status, body, (time.time() - t0) * 1000


def contar_modelos(body):
    try:
        d = json.loads(body)
        for k in ("data", "models"):
            if isinstance(d.get(k), list):
                return len(d[k])
    except Exception:
        pass
    return None


def openrouter_free():
    try:
        req = urllib.request.Request("https://openrouter.ai/api/v1/models")
        with urllib.request.urlopen(req, timeout=15) as r:
            d = json.loads(r.read().decode("utf-8", "replace"))
        free = [m["id"] for m in d.get("data", []) if str(m.get("id", "")).endswith(":free")]
        return sorted(free)[:15]
    except Exception as e:
        return ["(error %s)" % e]


def main():
    print("== Gateways IA (tus claves, sin imprimirlas) ==\n")
    for nombre, url, env, estilo, nota in PROVEEDORES:
        key = os.environ.get(env, "").strip()
        if not key:
            print("  [ -- ] %-14s sin %s" % (nombre, env))
            continue
        try:
            st, body, ms = get(url, key, estilo)
            n = contar_modelos(body)
            extra = "  %d modelos" % n if n else ""
            print("  [ OK ] %-14s %d  %5.0f ms%s  (%s)" % (nombre, st, ms, extra, nota))
        except Exception as e:
            print("  [FAIL] %-14s %s" % (nombre, str(e)[:60]))

    print("\n== OpenRouter :free (sin coste) ==")
    for mid in openrouter_free():
        print("   -", mid)
    print("\nRecuerda: Groq/Cerebras = gpt-oss gratis y muy rapido; GitHub Models = GPT gratis con tu cuenta.")


if __name__ == "__main__":
    main()
