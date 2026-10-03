"""
🐉 Webhook Server — Dragón de Jade
Servidor multi-plataforma para recibir y responder mensajes.
Comparado con: FastAPI + webhooks de Manus AI
"""

import json
from datetime import datetime
from pathlib import Path

try:
    import uvicorn
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
except ImportError:
    print("Instalando dependencias...")
    import subprocess
    subprocess.run(["pip", "install", "fastapi", "uvicorn", "httpx"], check=True)
    import uvicorn
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse

import sys

sys.path.insert(0, str(Path(__file__).parent))
from agente_principal import AgentOrchestrator

try:
    from voice_agent import PhoneIntegration, VoiceAgent, VoiceServer
    VOICE_AVAILABLE = True
except ImportError:
    VOICE_AVAILABLE = False
    print("⚠️ Módulo de voz no disponible. Instalar dependencias con: pip install websockets aiohttp")

app = FastAPI(title="Dragón de Jade API", version="1.0.0")
orchestrator = AgentOrchestrator()

# Voice Agent (si está disponible)
voice_agent = VoiceAgent() if VOICE_AVAILABLE else None
voice_server = VoiceServer() if VOICE_AVAILABLE else None

@app.get("/")
async def root():
    return {
        "nombre": "🐉 Dragón de Jade 龍玉",
        "version": "1.0.0",
        "plataformas": ["whatsapp", "telegram", "email"],
        "estado": "activo"
    }

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.get("/stats")
async def stats():
    return orchestrator.get_stats()

@app.get("/dashboard")
async def dashboard():
    return {"dashboard": orchestrator.get_dashboard()}

# ═══════════════════════════════════════════════════════════
# WHATSAPP WEBHOOK (Twilio / Baileys / Evolution API)
# ═══════════════════════════════════════════════════════════

@app.post("/webhook/whatsapp")
async def whatsapp_webhook(request: Request):
    """
    Webhook para WhatsApp Business API / Twilio / Evolution API.
    Compatible con: Twilio, 360dialog, WATI, Baileys, Evolution API
    """
    try:
        data = await request.json()

        # Adaptar según proveedor
        if 'Body' in data:  # Twilio format
            message = {
                'body': data.get('Body', ''),
                'from': data.get('From', '').replace('whatsapp:', ''),
                'media': data.get('NumMedia', '0') != '0'
            }
        elif 'message' in data:  # Evolution API format
            msg = data['message']
            message = {
                'body': msg.get('body', ''),
                'from': msg.get('key', {}).get('remoteJid', ''),
                'fromName': msg.get('pushName', '')
            }
        else:  # Generic format
            message = {
                'body': data.get('body', data.get('text', '')),
                'from': data.get('from', data.get('phone', ''))
            }

        resultado = await orchestrator.procesar_mensaje('whatsapp', message)

        # Formato de respuesta según proveedor
        if 'From' in data:  # Twilio
            return JSONResponse({
                "message": resultado.get('text', ''),
                "status": "sent"
            })
        else:
            return JSONResponse({
                "success": True,
                "reply": resultado.get('text', ''),
                "action": resultado.get('action'),
                "buttons": resultado.get('buttons', [])
            })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# ═══════════════════════════════════════════════════════════
# TELEGRAM WEBHOOK
# ═══════════════════════════════════════════════════════════

@app.post("/webhook/telegram")
async def telegram_webhook(request: Request):
    """
    Webhook para Telegram Bot API.
    Compatible con: python-telegram-bot, aiogram, telebot
    """
    try:
        data = await request.json()

        # Telegram Update format
        if 'message' in data:
            message_data = data['message']
            message = {
                'text': message_data.get('text', ''),
                'chat_id': message_data.get('chat', {}).get('id'),
                'from': message_data.get('from', {}).get('first_name', ''),
                'username': message_data.get('from', {}).get('username', '')
            }
        elif 'callback_query' in data:
            cb = data['callback_query']
            message = {
                'text': cb.get('data', ''),
                'chat_id': cb.get('message', {}).get('chat', {}).get('id'),
                'from': cb.get('from', {}).get('first_name', '')
            }
        else:
            return JSONResponse({"ok": True})

        resultado = await orchestrator.procesar_mensaje('telegram', message)

        return JSONResponse({
            "success": True,
            "chat_id": message.get('chat_id'),
            "reply": resultado.get('text', ''),
            "parse_mode": resultado.get('parse_mode', 'Markdown'),
            "reply_markup": resultado.get('reply_markup', {}),
            "action": resultado.get('action')
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# ═══════════════════════════════════════════════════════════
# EMAIL WEBHOOK (SendGrid / Mailgun / Resend)
# ═══════════════════════════════════════════════════════════

@app.post("/webhook/email")
async def email_webhook(request: Request):
    """
    Webhook para email entrante.
    Compatible con: SendGrid Inbound Parse, Mailgun Routes, Resend Webhooks
    """
    try:
        data = await request.json()

        email_data = {
            'subject': data.get('subject', data.get('Subject', '')),
            'body': data.get('text', data.get('body', data.get('plain', ''))),
            'from': data.get('from', data.get('sender', '')),
            'html': data.get('html', '')
        }

        resultado = await orchestrator.procesar_mensaje('email', email_data)

        return JSONResponse({
            "success": True,
            "to": email_data.get('from'),
            "subject": resultado.get('subject'),
            "body": resultado.get('body'),
            "action": resultado.get('action')
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# ═══════════════════════════════════════════════════════════
# API ENDPOINTS PARA FRONTEND / CHAT WIDGET
# ═══════════════════════════════════════════════════════════

@app.post("/api/chat")
async def chat_api(request: Request):
    """API para widget de chat web."""
    data = await request.json()

    message = {
        'body': data.get('message', ''),
        'from': data.get('user_id', 'web_user'),
        'plataforma': 'web'
    }

    resultado = await orchestrator.procesar_mensaje('whatsapp', message)

    return JSONResponse({
        "reply": resultado.get('text', ''),
        "action": resultado.get('action'),
        "suggestions": resultado.get('buttons', [])
    })

@app.post("/api/reserva")
async def crear_reserva(request: Request):
    """API para crear reserva directamente."""
    data = await request.json()

    reserva = {
        'fecha': data.get('fecha'),
        'hora': data.get('hora'),
        'personas': data.get('personas'),
        'nombre': data.get('nombre'),
        'telefono': data.get('telefono'),
        'email': data.get('email'),
        'notas': data.get('notas', '')
    }

    # Guardar reserva
    reservas_path = Path(__file__).parent.parent / 'restaurante' / 'reservas.json'
    reservas = []
    if reservas_path.exists():
        with open(reservas_path, 'r') as f:
            reservas = json.load(f)

    reserva['id'] = f"RES-{len(reservas)+1:04d}"
    reserva['creada'] = datetime.now().isoformat()
    reserva['estado'] = 'pendiente'
    reservas.append(reserva)

    with open(reservas_path, 'w') as f:
        json.dump(reservas, f, indent=2, ensure_ascii=False)

    return JSONResponse({
        "success": True,
        "reserva_id": reserva['id'],
        "message": f"Reserva {reserva['id']} creada correctamente"
    })

@app.get("/api/menu")
async def get_menu():
    """API para obtener menú."""
    menu_path = Path(__file__).parent.parent / 'plantillas' / 'menu.json'
    with open(menu_path, 'r') as f:
        menu = json.load(f)
    return JSONResponse(menu)

@app.get("/api/horario")
async def get_horario():
    """API para obtener horario."""
    return JSONResponse(orchestrator.agent.config.get('horario', {}))

@app.get("/api/direccion")
async def get_direccion():
    """API para obtener dirección."""
    return JSONResponse(orchestrator.agent.config.get('direccion', {}))

# ═══════════════════════════════════════════════════════════
# VOICE AGENT ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.get("/api/voice/status")
async def voice_status():
    """Estado del agente de voz."""
    if not voice_agent:
        return {"status": "unavailable", "message": "Módulo de voz no instalado"}
    return {
        "status": "active",
        "voice_name": voice_agent.config.voice_settings['voz_nombre'],
        "stt": voice_agent.config.stt_config['modelo'],
        "tts": voice_agent.config.tts_config['modelo'],
        "llm": voice_agent.config.llm_config['modelo'],
        "languages": voice_agent.config.voice_settings['idiomas']
    }

@app.post("/api/voice/transcribe")
async def voice_transcribe(request: Request):
    """Transcribe audio a texto."""
    if not voice_agent:
        return JSONResponse({"error": "Voice module not available"}, status_code=503)

    data = await request.json()
    audio_hex = data.get('audio', '')
    audio_bytes = bytes.fromhex(audio_hex) if audio_hex else b''

    texto = await voice_agent.stt(audio_bytes)
    return {"text": texto}

@app.post("/api/voice/speak")
async def voice_speak(request: Request):
    """Genera audio a partir de texto."""
    if not voice_agent:
        return JSONResponse({"error": "Voice module not available"}, status_code=503)

    data = await request.json()
    texto = data.get('text', '')

    audio = await voice_agent.tts(texto)
    return {"audio": audio.hex() if audio else None, "text": texto}

@app.post("/api/voice/chat")
async def voice_chat(request: Request):
    """Chat de voz completo (STT → LLM → TTS)."""
    if not voice_agent:
        return JSONResponse({"error": "Voice module not available"}, status_code=503)

    data = await request.json()
    audio_hex = data.get('audio', '')
    call_id = data.get('call_id', 'web_chat')
    caller = data.get('caller', 'web_user')

    audio_bytes = bytes.fromhex(audio_hex) if audio_hex else b''

    result = await voice_agent.procesar_audio_stream(
        audio_bytes,
        {'call_id': call_id, 'caller': caller}
    )

    return {
        "text": result.get('response', ''),
        "audio": result['audio'].hex() if result.get('audio') else None,
        "action": result.get('action', ''),
        "transcript": result.get('transcript', '')
    }

@app.post("/api/voice/call/incoming")
async def voice_incoming_call(request: Request):
    """Webhook para llamadas entrantes (Twilio)."""
    if not voice_agent:
        return JSONResponse({"error": "Voice module not available"}, status_code=503)

    data = await request.form()
    phone = PhoneIntegration(voice_agent)

    result = await phone.handle_incoming_call(dict(data))
    return JSONResponse(result)

@app.get("/api/voice/calls")
async def voice_calls():
    """Lista de llamadas activas."""
    if not voice_server:
        return {"active_calls": 0, "calls": []}

    return {
        "active_calls": len(voice_server.active_connections),
        "calls": list(voice_server.active_connections.keys())
    }

@app.get("/api/voice/history")
async def voice_history():
    """Historial de llamadas."""
    if not voice_agent:
        return {"history": []}

    return {"history": voice_agent.historial_llamadas}

@app.websocket("/ws/voice")
async def voice_websocket(websocket):
    """WebSocket para streaming de voz en tiempo real."""
    if not voice_server:
        await websocket.close(code=1013, reason="Voice module not available")
        return

    await voice_server.websocket_handler(websocket, "/ws/voice")


if __name__ == '__main__':
    print("🐉 Dragón de Jade — Iniciando servidor...")
    print("📊 Dashboard: http://localhost:8000/dashboard")
    print("📱 WhatsApp: POST /webhook/whatsapp")
    print("💬 Telegram: POST /webhook/telegram")
    print("📧 Email: POST /webhook/email")
    print("🌐 Chat API: POST /api/chat")
    print("="*50)

    uvicorn.run(app, host="0.0.0.0", port=8000)
