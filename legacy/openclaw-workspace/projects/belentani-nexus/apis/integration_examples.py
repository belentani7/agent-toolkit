# -*- coding: utf-8 -*-
"""
integration_examples.py — Ejemplos de integración para TODAS las APIs gratuitas (2026)
Proyecto: belentani-nexus

Requisitos:
    pip install openai requests edge-tts sentence-transformers  (según sección)

Las claves se leen de variables de entorno. Nunca las hardcodees.
"""

import os
from openai import OpenAI


# =====================================================================
# 1. TEXTO / LLM — cliente universal OpenAI-compatible con failover
# =====================================================================

PROVIDERS = [
    # (nombre, base_url, env_var, modelo)
    ("Gemini",      "https://generativelanguage.googleapis.com/v1beta/openai/", "GEMINI_API_KEY",     "gemini-3-flash"),
    ("Groq",        "https://api.groq.com/openai/v1",                           "GROQ_API_KEY",       "openai/gpt-oss-120b"),
    ("OpenRouter",  "https://openrouter.ai/api/v1",                             "OPENROUTER_API_KEY", "deepseek/deepseek-r1:free"),
    ("Z.AI (GLM)",  "https://api.z.ai/api/paas/v4",                             "ZAI_API_KEY",        "glm-4.7-flash"),
    ("DeepSeek",    "https://api.deepseek.com/v1",                              "DEEPSEEK_API_KEY",   "deepseek-chat"),
    ("Moonshot",    "https://api.moonshot.ai/v1",                               "MOONSHOT_API_KEY",   "kimi-k3"),
    ("Alibaba Qwen","https://dashscope-intl.aliyuncs.com/compatible-mode/v1",   "DASHSCOPE_API_KEY",  "qwen-plus"),
    ("Baidu ERNIE", "https://qianfan.baidubce.com/v2",                          "QIANFAN_API_KEY",    "ernie-3.5-8k"),
    ("Tencent",     "https://api.hunyuan.cloud.tencent.com/v1",                 "TENCENT_HUNYUAN_API_KEY", "hunyuan-t1"),
    ("Kilo (no key)","https://api.kilo.ai/api/gateway",                         None,                  "kilo-auto/free"),
]

def chat(prompt: str, system: str = "You are a helpful assistant."):
    """Prueba proveedores en cadena hasta que uno responda (failover)."""
    for name, base_url, env_var, model in PROVIDERS:
        api_key = os.environ.get(env_var) if env_var else "no-key-required"
        if not api_key:
            continue
        try:
            client = OpenAI(api_key=api_key, base_url=base_url)
            r = client.chat.completions.create(
                model=model,
                messages=[{"role": "system", "content": system},
                          {"role": "user", "content": prompt}],
                max_tokens=1024,
                timeout=60,
            )
            print(f"[OK] {name} ({model})")
            return r.choices[0].message.content
        except Exception as e:
            print(f"[FAIL] {name}: {e}")
    raise RuntimeError("Todos los proveedores fallaron")

# curl equivalente (OpenRouter free):
# curl https://openrouter.ai/api/v1/chat/completions \
#   -H "Authorization: Bearer $OPENROUTER_API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{"model":"deepseek/deepseek-r1:free","messages":[{"role":"user","content":"Hola"}]}'


# =====================================================================
# 2. IMAGEN
# =====================================================================

def image_pollinations(prompt: str, out="out.png", model="flux", w=1024, h=1024):
    """Pollinations: sin API key, Flux ilimitado."""
    import requests
    from urllib.parse import quote
    url = f"https://image.pollinations.ai/prompt/{quote(prompt)}?model={model}&width={w}&height={h}&nologo=true"
    data = requests.get(url, timeout=120).content
    open(out, "wb").write(data)
    return out

# curl:  curl -o out.png "https://image.pollinations.ai/prompt/a%20red%20fox?model=flux"

def image_together_flux(prompt: str, out="flux.png"):
    """Together AI: FLUX.1-schnell-Free (gratis/ilimitado en promo)."""
    import requests, base64
    r = requests.post(
        "https://api.together.xyz/v1/images/generations",
        headers={"Authorization": f"Bearer {os.environ['TOGETHER_API_KEY']}"},
        json={"model": "black-forest-labs/FLUX.1-schnell-Free",
              "prompt": prompt, "width": 1024, "height": 1024,
              "response_format": "b64_json"},
        timeout=120,
    )
    open(out, "wb").write(base64.b64decode(r.json()["data"][0]["b64_json"]))
    return out

# curl -X POST https://api.together.xyz/v1/images/generations \
#   -H "Authorization: Bearer $TOGETHER_API_KEY" -H "Content-Type: application/json" \
#   -d '{"model":"black-forest-labs/FLUX.1-schnell-Free","prompt":"a red fox","width":1024,"height":1024,"response_format":"b64_json"}'


# =====================================================================
# 3. VIDEO (patrón asíncrono típico)
# =====================================================================

def video_minimax(prompt: str):
    """MiniMax Hailuo: crear tarea → poll estado → descargar."""
    import requests, time
    key = os.environ["MINIMAX_API_KEY"]
    base = "https://api.minimax.io/v1"
    h = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

    r = requests.post(f"{base}/video_generation", headers=h,
                      json={"model": "Hailuo-2.3", "prompt": prompt}, timeout=30)
    task_id = r.json()["task_id"]

    while True:
        s = requests.get(f"{base}/video_generation/{task_id}", headers=h, timeout=30).json()
        if s["status"] in ("Success", "Fail"):
            break
        time.sleep(10)

    if s["status"] == "Success":
        url = s["file_id"]  # luego GET /v1/files/retrieve → download_url
        return url
    raise RuntimeError(s)

def video_wan_alibaba(prompt: str):
    """Alibaba Wan vía DashScope SDK (pip install dashscope)."""
    import dashscope
    from dashscope import VideoSynthesis
    dashscope.base_http_api_url = "https://dashscope-intl.aliyuncs.com/api/v1"
    rsp = VideoSynthesis.call(
        api_key=os.environ["DASHSCOPE_API_KEY"],
        model="wan2.6-t2v", prompt=prompt,
        size="1280*720", duration=5,
    )
    return rsp.output.video_url if rsp.status_code == 200 else rsp


# =====================================================================
# 4. AUDIO / TTS
# =====================================================================

def tts_fish(text: str, out="speech.mp3", voice="7f9ae668-89f9-4a96-80d3-a2f3b1bf00e6"):
    """Fish Audio s2.1-pro-free (gratis, fair use)."""
    import requests
    r = requests.post(
        "https://api.fish.audio/v1/tts",
        headers={"Authorization": f"Bearer {os.environ['FISH_AUDIO_API_KEY']}"},
        json={"text": text, "reference_id": voice,
              "format": "mp3", "latency": "normal"},
        timeout=120,
    )
    open(out, "wb").write(r.content)
    return out

# curl -X POST https://api.fish.audio/v1/tts \
#   -H "Authorization: Bearer $FISH_AUDIO_API_KEY" \
#   -d '{"text":"Hola mundo","reference_id":"<voice_id>","format":"mp3"}' -o speech.mp3

def tts_elevenlabs(text: str, out="el.mp3", voice_id="JBFqnCBsd6RMkjVDRZzb"):
    """ElevenLabs free: 10.000 créditos/mes."""
    import requests
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
        json={"text": text, "model_id": "eleven_multilingual_v2"},
        timeout=120,
    )
    open(out, "wb").write(r.content)
    return out

def tts_edge(text: str, out="edge.mp3", voice="es-ES-AlvaroNeuron"):
    """Edge TTS: sin key (no oficial)."""
    import asyncio, edge_tts
    async def run():
        c = edge_tts.Communicate(text, voice)
        await c.save(out)
    asyncio.run(run())
    return out

def tts_cosyvoice_dashscope(text: str):
    """CosyVoice (Alibaba intl) — requiere dashscope SDK; cuota free 90 días."""
    import dashscope
    from dashscope.audio.tts_v2 import SpeechSynthesizer
    dashscope.base_http_api_url = "https://dashscope-intl.aliyuncs.com/api/v1"
    synth = SpeechSynthesizer(model="cosyvoice-v3-flash",
                              api_key=os.environ["DASHSCOPE_API_KEY"])
    return synth.call(text)


# =====================================================================
# 5. EMBEDDINGS
# =====================================================================

def embed_local(texts):
    """Sentence-Transformers local: gratis total, sin API. (BGE-M3 multilingüe)"""
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("BAAI/bge-m3")
    return model.encode(texts, normalize_embeddings=True)

def embed_cohere(texts):
    """Cohere embed-v4 (trial 1000 llamadas/mes)."""
    import requests
    r = requests.post(
        "https://api.cohere.com/v2/embed",
        headers={"Authorization": f"Bearer {os.environ['COHERE_API_KEY']}"},
        json={"texts": texts, "model": "embed-v4.0", "input_type": "search_document"},
        timeout=60,
    )
    return [d["embedding"] for d in r.json()["embeddings"]]

# curl -X POST https://api.cohere.com/v2/embed \
#   -H "Authorization: Bearer $COHERE_API_KEY" -H "Content-Type: application/json" \
#   -d '{"texts":["hola"],"model":"embed-v4.0","input_type":"search_document"}'

def embed_pollinations(text):
    """Pollinations embeddings (cuenta gratuita)."""
    import requests
    r = requests.post(
        "https://gen.pollinations.ai/v1/embeddings",
        headers={"Authorization": f"Bearer {os.environ.get('POLLINATIONS_API_KEY','')}"},
        json={"model": "openai-3-small", "input": text, "dimensions": 512},
        timeout=60,
    )
    return r.json()["data"][0]["embedding"]


# =====================================================================
# 6. CHINA: llamada rápida sin SDKs extra
# =====================================================================

def zhipu_glm_free(prompt: str):
    """GLM-4.7-Flash permanente gratis (endpoint internacional z.ai)."""
    client = OpenAI(api_key=os.environ["ZAI_API_KEY"],
                    base_url="https://api.z.ai/api/paas/v4")
    r = client.chat.completions.create(model="glm-4.7-flash",
                                       messages=[{"role": "user", "content": prompt}])
    return r.choices[0].message.content

# curl https://api.z.ai/api/paas/v4/chat/completions \
#   -H "Authorization: Bearer $ZAI_API_KEY" -H "Content-Type: application/json" \
#   -d '{"model":"glm-4.7-flash","messages":[{"role":"user","content":"Hola"}]}'


if __name__ == "__main__":
    print(chat("Di hola en 5 idiomas."))
