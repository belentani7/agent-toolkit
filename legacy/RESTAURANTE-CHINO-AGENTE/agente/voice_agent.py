"""
🐉 DRAGÓN DE JADE — Voice Agent Module
Agente de voz para llamadas telefónicas del restaurante.
Basado en: Patter (754★), livekit (19.3k★), SenseVoice (8.6k★), CyberVerse (1.2k★)
"""

import json
from datetime import datetime
from pathlib import Path

try:
    import aiohttp
    import websockets
except ImportError:
    print("Instalando dependencias de voz...")
    import subprocess
    subprocess.run(["pip", "install", "websockets", "aiohttp"], check=True)
    import aiohttp
    import websockets


class VoiceAgentConfig:
    """Configuración del agente de voz."""

    def __init__(self):
        self.restaurante = self._load_restaurante_config()
        self.voice_settings = {
            "idiomas": ["es", "ca", "en", "zh"],
            "idioma_default": "es",
            "voz_genero": "femenino",
            "voz_nombre": "Jade",
            "velocidad_habla": 1.0,
            "volumen": 0.9,
            "silence_threshold_ms": 500,
            "max_duracion_llamada_s": 300,
            "timeout_respuesta_s": 10,
            "grabar_llamadas": True,
            "transcripcion_realtime": True,
        }
        self.stt_config = {
            "proveedor": "whisper",
            "modelo": "whisper-large-v3",
            "idiomas_soportados": ["es", "ca", "en", "zh", "ja", "pt"],
            "endpoint": "http://localhost:8001/stt",
        }
        self.tts_config = {
            "proveedor": "piper",
            "modelo": "es_ES/davefx/medium",
            "velocidad": 1.0,
            "pitch": 1.0,
            "endpoint": "http://localhost:8002/tts",
        }
        self.llm_config = {
            "proveedor": "ollama",
            "modelo": "qwen3:14b",
            "endpoint": "http://localhost:11434",
            "temperatura": 0.7,
            "max_tokens": 256,
        }
        self.telefonia_config = {
            "proveedor": "twilio",
            "account_sid": "TU_TWILIO_SID",
            "auth_token": "TU_TWILIO_TOKEN",
            "numero_restaurante": "+34933456789",
            "webhook_url": "https://tu-dominio.com/webhook/voice",
            "websocket_url": "wss://tu-dominio.com/ws/voice",
        }

    def _load_restaurante_config(self) -> dict:
        config_path = Path(__file__).parent.parent / 'restaurante' / 'config.json'
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)['restaurante']


class VoiceAgent:
    """
    Agente de voz principal para llamadas telefónicas.
    Responde llamadas, toma pedidos, confirma reservas.
    """

    def __init__(self):
        self.config = VoiceAgentConfig()
        self.conversaciones = {}
        self.historial_llamadas = []

    def get_system_prompt(self) -> str:
        """Prompt del sistema para el LLM de voz."""
        r = self.config.restaurante
        return f"""Eres {self.config.voice_settings['voz_nombre']}, asistente de voz de {r['nombre']} ({r['lema']}).

INSTRUCCIONES CRÍTICAS:
- Responde SIEMPRE en español (o el idioma del caller)
- Sé amable, profesional y eficiente
- Habla de forma natural, como un humano
- Usa frases cortas y claras para teléfono
- Nunca inventes información que no conozcas
- Si no entiendes algo, pide que repitan amablemente

HORARIO:
- Lunes a jueves: {r['horario']['lunes_a_jueves']}
- Viernes y sábado: {r['horario']['viernes_sabado']}
- Domingos: {r['horario']['domingos_festivos']}

INFORMACIÓN:
- Dirección: {r['direccion']['calle']}, {r['direccion']['cp']} {r['direccion']['ciudad']}
- Teléfono: {r['telefono']}
- WhatsApp: {r['whatsapp']}

MENÚ RESUMEN:
- Entrantes: desde 4€ (Har Gow 6.50€, Siu Mai 6€, Spring Rolls 5€)
- Arroces: desde 7€ (Arroz del dragón 9.50€)
- Carnes: desde 11€ (Cerdo agridulce 12.50€, Pato Pekín 14€)
- Pescados: desde 10€ (Bacalao 14€)
- Postres: desde 3€
- Menú del día: 12.50€ (básico), 16.50€ (premium)

CAPACIDADES:
1. Reservar mesas (fecha, hora, personas, nombre)
2. Informar del menú y precios
3. Recibir pedidos para llevar
4. Dar información del restaurante
5. Transferir a humano si es necesario

FLUJO DE RESERVA:
1. Pregunta: ¿Para qué día?
2. Pregunta: ¿A qué hora?
3. Pregunta: ¿Cuántas personas?
4. Pregunta: ¿Nombre para la reserva?
5. Confirma todos los datos
6. Confirma la reserva

FLUJO DE PEDIDO:
1. Pregunta qué desea
2. Confirma el plato y cantidad
3. Pregunta si algo más
4. Calcula el total
5. Pregunta: ¿Para llevar o para comer aquí?
6. Si es para llevar: confirma dirección

REGLAS:
- Si preguntan por precios → da el precio exacto
- Si preguntan por alérgenos → di que consulten con el personal
- Si hay problemas → transfiere a humano: "Un momento por favor, le paso con alguien"
- Nunca cuelgues sin despedirte
- Usa: "Espero verle pronto", "Que tenga un buen día"
"""

    async def procesar_audio_stream(self, audio_stream, caller_info: dict) -> dict:
        """
        Procesa stream de audio en tiempo real.
        Implementa pipeline: STT → LLM → TTS
        """
        conversation_id = caller_info.get('call_id', f"call_{datetime.now().strftime('%Y%m%d_%H%M%S')}")

        if conversation_id not in self.conversaciones:
            self.conversaciones[conversation_id] = {
                'caller': caller_info,
                'history': [],
                'started_at': datetime.now(),
                'transcript': []
            }

        conv = self.conversaciones[conversation_id]

        try:
            # 1. Speech-to-Text
            texto_usuario = await self.stt(audio_stream)

            if not texto_usuario or texto_usuario.strip() == "":
                return {"action": "silence", "response": None}

            conv['transcript'].append({
                'role': 'user',
                'text': texto_usuario,
                'timestamp': datetime.now().isoformat()
            })

            # 2. LLM Response
            respuesta = await self.generate_response(texto_usuario, conv['history'])

            conv['history'].append({"role": "user", "content": texto_usuario})
            conv['history'].append({"role": "assistant", "content": respuesta})

            conv['transcript'].append({
                'role': 'assistant',
                'text': respuesta,
                'timestamp': datetime.now().isoformat()
            })

            # 3. Text-to-Speech
            audio_respuesta = await self.tts(respuesta)

            # 4. Detectar acciones especiales
            accion = self.detectar_accion(texto_usuario, respuesta)

            return {
                "action": accion,
                "response": respuesta,
                "audio": audio_respuesta,
                "transcript": texto_usuario,
                "conversation_id": conversation_id
            }

        except Exception as e:
            return {
                "action": "error",
                "response": "Lo siento, ha habido un problema técnico. Un momento por favor.",
                "audio": None,
                "error": str(e)
            }

    async def stt(self, audio_stream) -> str:
        """Speech-to-Text usando Whisper local o API."""
        try:
            async with aiohttp.ClientSession() as session:
                data = aiohttp.FormData()
                data.add_field('audio', audio_stream, filename='audio.wav', content_type='audio/wav')

                async with session.post(
                    self.config.stt_config['endpoint'],
                    data=data,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    if resp.status == 200:
                        result = await resp.json()
                        return result.get('text', '')
        except Exception:
            pass

        # Fallback: usar Whisper local
        return await self.stt_local(audio_stream)

    async def stt_local(self, audio_stream) -> str:
        """STT local con Whisper."""
        try:
            import whisper
            model = whisper.load_model("base")
            result = model.transcribe(audio_stream, language="es")
            return result["text"]
        except ImportError:
            return ""

    async def generate_response(self, user_message: str, history: list) -> str:
        """Genera respuesta usando LLM (Ollama local)."""
        system_prompt = self.get_system_prompt()

        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history[-10:])
        messages.append({"role": "user", "content": user_message})

        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.config.llm_config['modelo'],
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": self.config.llm_config['temperatura'],
                        "num_predict": self.config.llm_config['max_tokens']
                    }
                }

                async with session.post(
                    f"{self.config.llm_config['endpoint']}/api/chat",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as resp:
                    if resp.status == 200:
                        result = await resp.json()
                        return result.get('message', {}).get('content', '')
        except Exception:
            pass

        # Fallback: respuesta predefinida
        return self.respuesta_predefinida(user_message)

    async def tts(self, texto: str) -> bytes:
        """Text-to-Speech usando Piper local o API."""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "text": texto,
                    "voice": self.config.tts_config['modelo'],
                    "speed": self.config.tts_config['velocidad']
                }

                async with session.post(
                    self.config.tts_config['endpoint'],
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    if resp.status == 200:
                        return await resp.read()
        except Exception:
            pass

        # Fallback: usar gTTS
        return await self.tts_fallback(texto)

    async def tts_fallback(self, texto: str) -> bytes:
        """TTS fallback con gTTS."""
        try:
            import io

            from gtts import gTTS

            tts = gTTS(text=texto, lang='es')
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            return audio_buffer.getvalue()
        except Exception:
            return b''

    def detectar_accion(self, user_message: str, response: str) -> str:
        """Detecta si se realizó una acción específica."""
        msg_lower = user_message.lower()

        if any(p in msg_lower for p in ['reservar', 'reserva', 'mesa']):
            if any(p in response.lower() for p in ['confirmada', 'reservada', 'hecho']):
                return 'reserva_creada'
            return 'reserva_en_curso'

        if any(p in msg_lower for p in ['pedir', 'pedido', 'llevar', 'para llevar']):
            return 'pedido_en_curso'

        if any(p in msg_lower for p in ['dirección', 'cómo llegar', 'dónde']):
            return 'info_direccion'

        if any(p in msg_lower for p in ['horario', 'abierto', 'cierran']):
            return 'info_horario'

        if any(p in msg_lower for p in ['menú', 'carta', 'platos']):
            return 'info_menu'

        return 'conversacion'

    def respuesta_predefinida(self, msg: str) -> str:
        """Respuestas rápidas predefinidas (sin LLM)."""
        msg_lower = msg.lower()

        respuestas = {
            'hola': '¡Buenas! Gracias por llamar a Dragón de Jade. ¿En qué puedo ayudarle?',
            'adiós': '¡Hasta luego! Que tenga un buen día. ¡Le esperamos!',
            'menú': 'Nuestro menú incluye entrantes desde 4 euros, arroces desde 7, carnes desde 11 y pescados desde 10. El menú del día cuesta 12 euros con entrada, principal y bebida.',
            'horario': 'Estamos abiertos de lunes a jueves de 12 a 23 horas, viernes y sábado de 12 a medianoche, y domingos de 12 a 22 horas.',
            'reservar': 'Perfecto. ¿Para qué día desea reservar?',
            'dirección': 'Estamos en la Calle Gran Vía de los Chinos, número 42, en Barcelona. Junto al Mercado de Sant Antoni.',
            'precio': '¿Le interesa algún plato en concreto? Puedo darle los precios exactos.',
        }

        for clave, respuesta in respuestas.items():
            if clave in msg_lower:
                return respuesta

        return 'Un momento por favor, le paso con alguien que pueda ayudarle mejor.'


class PhoneIntegration:
    """Integración con sistemas de telefonía (Twilio / Telnyx / Plivo)."""

    def __init__(self, voice_agent: VoiceAgent):
        self.agent = voice_agent
        self.twilio_client = None

    async def handle_incoming_call(self, call_data: dict) -> dict:
        """Maneja llamada entrante de Twilio."""
        call_sid = call_data.get('CallSid', '')
        caller = call_data.get('From', 'unknown')

        return {
            "action": "connect",
            "websocket_url": f"wss://tu-dominio.com/ws/voice?call_id={call_sid}",
            "caller": caller,
            "greeting": "¡Buenas! Gracias por llamar a Dragón de Jade. ¿En qué puedo ayudarle?"
        }

    async def handle_call_status(self, status_data: dict) -> dict:
        """Maneja cambio de estado de llamada."""
        status = status_data.get('CallStatus', '')
        call_sid = status_data.get('CallSid', '')

        if status == 'completed':
            # Guardar transcripción
            if call_sid in self.agent.conversaciones:
                conv = self.agent.conversaciones[call_sid]
                await self._save_transcript(call_sid, conv)

        return {"status": status, "call_sid": call_sid}

    async def _save_transcript(self, call_sid: str, conversation: dict):
        """Guarda transcripción de la llamada."""
        transcripts_dir = Path(__file__).parent.parent / 'restaurante' / 'transcripciones'
        transcripts_dir.mkdir(exist_ok=True)

        transcript_file = transcripts_dir / f"{call_sid}.json"
        with open(transcript_file, 'w', encoding='utf-8') as f:
            json.dump({
                'call_sid': call_sid,
                'caller': conversation['caller'],
                'started_at': conversation['started_at'].isoformat(),
                'transcript': conversation['transcript']
            }, f, indent=2, ensure_ascii=False)


class VoiceServer:
    """
    Servidor WebSocket para streaming de voz en tiempo real.
    Basado en livekit (19.3k★) y CyberVerse (1.2k★).
    """

    def __init__(self):
        self.voice_agent = VoiceAgent()
        self.phone = PhoneIntegration(self.voice_agent)
        self.active_connections = {}

    async def websocket_handler(self, websocket, path):
        """Handler para conexiones WebSocket de voz."""
        call_id = None

        try:
            async for message in websocket:
                data = json.loads(message)

                if data.get('type') == 'call_init':
                    # Inicializar llamada
                    call_id = data.get('call_id', f"call_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
                    self.active_connections[call_id] = websocket

                    # Enviar saludo
                    greeting = self.voice_agent.respuesta_predefinida('hola')
                    audio_greeting = await self.voice_agent.tts(greeting)

                    await websocket.send(json.dumps({
                        'type': 'greeting',
                        'text': greeting,
                        'audio': audio_greeting.hex() if audio_greeting else None
                    }))

                elif data.get('type') == 'audio_chunk':
                    # Chunk de audio del usuario
                    audio_data = bytes.fromhex(data.get('audio', ''))

                    result = await self.voice_agent.procesar_audio_stream(
                        audio_data,
                        {'call_id': call_id, 'caller': data.get('caller', '')}
                    )

                    await websocket.send(json.dumps({
                        'type': 'response',
                        'text': result.get('response', ''),
                        'audio': result['audio'].hex() if result.get('audio') else None,
                        'action': result.get('action', ''),
                        'transcript': result.get('transcript', '')
                    }))

                elif data.get('type') == 'end_call':
                    # Finalizar llamada
                    if call_id in self.active_connections:
                        del self.active_connections[call_id]
                    break

        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            if call_id and call_id in self.active_connections:
                del self.active_connections[call_id]


class VoiceAPI:
    """API REST para gestión de llamadas."""

    def __init__(self):
        self.voice_server = VoiceServer()

    async def get_call_history(self) -> list:
        """Obtiene historial de llamadas."""
        return self.voice_server.voice_agent.historial_llamadas

    async def get_active_calls(self) -> int:
        """Retorna número de llamadas activas."""
        return len(self.voice_server.active_connections)

    async def make_outbound_call(self, to_number: str, message: str) -> dict:
        """Realiza llamada saliente (para recordatorios, etc.)."""
        return {
            "status": "initiated",
            "to": to_number,
            "message": message
        }


# ═══════════════════════════════════════════════════════════
# INSTALACIÓN DE COMPONENTES DE VOZ
# ═══════════════════════════════════════════════════════════

VOICE_COMPONENTS = """
# ═══════════════════════════════════════════════════════════
# INSTALACIÓN RÁPIDA — AGENTE DE VOZ
# ═══════════════════════════════════════════════════════════

# 1. Whisper (Speech-to-Text)
pip install openai-whisper
# o local: pip install faster-whisper

# 2. Piper (Text-to-Speech local — GRATIS)
pip install piper-tts
# Modelos: piper download es_ES/davefx/medium

# 3. gTTS (fallback TTS — GRATIS)
pip install gTTS

# 4. WebSocket
pip install websockets

# 5. Ollama (ya instalado)
# Modelo recomendado: qwen3:14b

# ═══════════════════════════════════════════════════════════
# ALTERNATIVAS CLOUD (si prefieres no hostear)
# ═══════════════════════════════════════════════════════════

# STT Cloud:
# - Deepgram (447★): 200$/mes, realtime
# - AssemblyAI: 50$/mes, muy preciso
# - Google Speech-to-Text: pay-per-use

# TTS Cloud:
# - ElevenLabs: 5$/mes, voces naturales
# - Bark (Suno): open source, emociones
# - XTTS (Coqui): open source, voice cloning

# Telefonia:
# - Twilio: 1$/mes por número + 0.01$/min
# - Telnyx: más barato para alto volumen
# - Plivo: alternativa económica
"""


if __name__ == '__main__':
    import io
    import sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("🐉 Dragón de Jade — Voice Agent")
    print("="*50)
    print(VOICE_COMPONENTS)

    agent = VoiceAgent()
    print("\n✅ Agente de voz inicializado")
    print(f"📞 Configurado para: {agent.config.restaurante['nombre']}")
    print(f"🗣️ Voz: {agent.config.voice_settings['voz_nombre']}")
    print(f"🤖 LLM: {agent.config.llm_config['modelo']}")
    print(f"🎯 STT: {agent.config.stt_config['modelo']}")
    print(f"🔊 TTS: {agent.config.tts_config['modelo']}")
