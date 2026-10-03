"""
🐉 DRAGÓN DE JADE — Voice Agent LITE
Versión ligera: solo dependencias esenciales y gratuitas.
"""

import json
from pathlib import Path

# ═══════════════════════════════════════════════════════════
# DEPENDENCIAS LIGERAS (solo estas se instalan)
# ═══════════════════════════════════════════════════════════
LIGHT_DEPS = """
# INSTALACIÓN LIGERA (solo lo necesario):
pip install gTTS websockets aiohttp

# TOTAL: ~5MB de dependencias
# NO necesita GPU, NO necesita Whisper grande
"""

class VoiceAgentLite:
    """
    Agente de voz ligero.
    Usa: gTTS (gratis) + Ollama (ya instalado) + WebSocket
    """

    def __init__(self):
        self.config = self._load_config()
        self.conversaciones = {}

    def _load_config(self) -> dict:
        config_path = Path(__file__).parent.parent / 'restaurante' / 'config.json'
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)['restaurante']

    def get_system_prompt(self) -> str:
        r = self.config
        return f"""Eres Jade, asistente de voz de {r['nombre']}.

REGLAS:
- Responde en español, frases cortas y claras
- Sé amable y eficiente
- Para teléfono: máximo 2-3 oraciones por respuesta
- Nunca inventes información

HORARIO:
- Lu-Ju: {r['horario']['lunes_a_jueves']}
- Vi-Sa: {r['horario']['viernes_sabado']}
- Do: {r['horario']['domingos_festivos']}

MENÚ RESUMEN:
- Entrantes: 4-7€ (Har Gow 6.50€, Siu Mai 6€)
- Arroces: 7-12€ (Arroz dragón 9.50€)
- Carnes: 11-15€ (Cerdo agridulce 12.50€)
- Menú del día: 12.50€

CAPACIDADES:
1. Reservar mesas
2. Informar del menú
3. Recibir pedidos
4. Dar información

FLUJO RESERVA:
1. ¿Para qué día?
2. ¿A qué hora?
3. ¿Cuántas personas?
4. ¿Nombre?
5. Confirmar

Si no entiendes: "¿Podría repetir, por favor?"
Si hay problema: "Un momento, le paso con alguien."
"""

    async def tts(self, texto: str) -> bytes:
        """Text-to-Speech con gTTS (gratis)."""
        try:
            import io

            from gtts import gTTS

            tts = gTTS(text=texto, lang='es')
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            return audio_buffer.getvalue()
        except Exception:
            return b''

    async def chat(self, mensaje: str, call_id: str = 'default') -> dict:
        """Procesa mensaje y retorna respuesta."""
        if call_id not in self.conversaciones:
            self.conversaciones[call_id] = {'history': [], 'transcript': []}

        conv = self.conversaciones[call_id]
        conv['transcript'].append({'role': 'user', 'text': mensaje})

        # Intentar con Ollama
        respuesta = await self._ollama_chat(mensaje, conv['history'])

        conv['history'].append({"role": "user", "content": mensaje})
        conv['history'].append({"role": "assistant", "content": respuesta})
        conv['transcript'].append({'role': 'assistant', 'text': respuesta})

        # Generar audio
        audio = await self.tts(respuesta)

        return {
            "text": respuesta,
            "audio": audio.hex() if audio else None,
            "action": self._detect_action(mensaje)
        }

    async def _ollama_chat(self, mensaje: str, history: list) -> str:
        """Chat con Ollama local."""
        try:
            import aiohttp

            messages = [{"role": "system", "content": self.get_system_prompt()}]
            messages.extend(history[-8:])
            messages.append({"role": "user", "content": mensaje})

            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": "qwen3:14b",
                    "messages": messages,
                    "stream": False,
                    "options": {"temperature": 0.7, "num_predict": 150}
                }

                async with session.post(
                    "http://localhost:11434/api/chat",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    if resp.status == 200:
                        result = await resp.json()
                        return result.get('message', {}).get('content', '')
        except Exception:
            pass

        return self._fallback_response(mensaje)

    def _fallback_response(self, msg: str) -> str:
        """Respuestas predefinidas."""
        msg_lower = msg.lower()

        respuestas = {
            'hola': '¡Buenas! Gracias por llamar a Dragón de Jade. ¿En qué puedo ayudarle?',
            'adiós': '¡Hasta luego! Que tenga un buen día.',
            'menú': 'Tenemos entrantes desde 4 euros, arroces desde 7, y menú del día por 12.50.',
            'horario': 'Lunes a jueves de 12 a 23, viernes y sábado de 12 a medianoche, domingos de 12 a 22.',
            'reservar': 'Perfecto. ¿Para qué día desea reservar?',
            'dirección': 'Estamos en Gran Vía de los Chinos, 42, junto al Mercado de Sant Antoni.',
        }

        for clave, respuesta in respuestas.items():
            if clave in msg_lower:
                return respuesta

        return 'Un momento por favor, le paso con alguien.'

    def _detect_action(self, msg: str) -> str:
        msg_lower = msg.lower()
        if any(p in msg_lower for p in ['reservar', 'reserva', 'mesa']):
            return 'reserva'
        if any(p in msg_lower for p in ['pedir', 'pedido', 'llevar']):
            return 'pedido'
        return 'conversacion'


class VoiceServerLite:
    """Servidor WebSocket ligero."""

    def __init__(self):
        self.agent = VoiceAgentLite()
        self.connections = {}

    async def handler(self, websocket, path):
        call_id = None
        try:
            async for message in websocket:
                data = json.loads(message)

                if data.get('type') == 'start':
                    call_id = data.get('call_id', 'web')
                    self.connections[call_id] = websocket

                    greeting = '¡Buenas! Gracias por llamar a Dragón de Jade. ¿En qué puedo ayudarle?'
                    audio = await self.agent.tts(greeting)

                    await websocket.send(json.dumps({
                        'type': 'greeting',
                        'text': greeting,
                        'audio': audio.hex() if audio else None
                    }))

                elif data.get('type') == 'message':
                    texto = data.get('text', '')
                    result = await self.agent.chat(texto, call_id or 'web')

                    await websocket.send(json.dumps({
                        'type': 'response',
                        **result
                    }))

                elif data.get('type') == 'end':
                    break

        except Exception:
            pass
        finally:
            if call_id and call_id in self.connections:
                del self.connections[call_id]


if __name__ == '__main__':
    import io
    import sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("🐉 Dragón de Jade — Voice Agent LITE")
    print("="*50)
    print(LIGHT_DEPS)

    agent = VoiceAgentLite()
    print("✅ Agente inicializado")
    print(f"📞 Restaurante: {agent.config['nombre']}")
    print("🗣️ Voz: Jade")
    print("🤖 LLM: Ollama (qwen3:14b)")
    print("🔊 TTS: gTTS (gratis)")
    print()
    print("Para iniciar servidor:")
    print("  pip install websockets aiohttp")
    print("  python voice_agent_lite.py")
