# 🐉 Dragón de Jade 龍玉 — Multi-Platform AI Agent

Agente comercial automatizado para restaurante chino.  
Multi-plataforma: WhatsApp, Telegram, Email, Web.

## 🚀 Arquitectura

```
RESTAURANTE-CHINO-AGENTE/
├── restaurante/              # Datos del restaurante
│   ├── config.json          # Configuración general
│   ├── menu.md              # Menú completo
│   └── index.html           # Landing page
├── agente/                   # Agente multi-plataforma
│   ├── agente_principal.py  # Lógica del agente
│   ├── server.py            # API server (FastAPI)
│   ├── config_plataformas.json # Config de cada plataforma
│   └── whatsapp/            # Integración WhatsApp
│   └── telegram/            # Integración Telegram
│   └── email/               # Integración Email
├── plantillas/               # Templates de respuestas
│   ├── respuestas.json      # Respuestas por plataforma
│   └── menu.json            # Menú estructurado
├── imagenes/                 # Assets del restaurante
├── requirements.txt          # Dependencias Python
└── README.md                 # Este archivo
```

## 📦 Instalación

```bash
# Clonar
cd RESTAURANTE-CHINO-AGENTE

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Iniciar servidor
python agente/server.py
```

## 🔧 Configuración

### WhatsApp (Evolution API — Recomendado)
1. Instalar Evolution API: `docker compose up -d`
2. Configurar webhook: `https://tu-dominio.com/webhook/whatsapp`
3. Agregar API key en `config_plataformas.json`

### Telegram
1. Crear bot con @BotFather
2. Copiar token en `config_plataformas.json`
3. Configurar webhook: `https://tu-dominio.com/webhook/telegram`

### Email
1. Configurar SMTP en `config_plataformas.json`
2. Configurar webhook en SendGrid/Mailgun

## 🌐 Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | Info del agente |
| `/health` | GET | Health check |
| `/stats` | GET | Estadísticas |
| `/dashboard` | GET | Dashboard de estado |
| `/webhook/whatsapp` | POST | Webhook WhatsApp |
| `/webhook/telegram` | POST | Webhook Telegram |
| `/webhook/email` | POST | Webhook Email |
| `/api/chat` | POST | API chat web |
| `/api/reserva` | POST | Crear reserva |
| `/api/menu` | GET | Obtener menú |
| `/api/horario` | GET | Obtener horario |
| `/api/direccion` | GET | Obtener dirección |

## 🧪 Testing

```bash
# Test del agente
python agente/agente_principal.py

# Test del servidor
curl http://localhost:8000/
curl http://localhost:8000/stats
curl http://localhost:8000/api/menu

# Test webhook WhatsApp
curl -X POST http://localhost:8000/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"Body": "Hola, quiero reservar", "From": "whatsapp:+34612345678"}'

# Test webhook Telegram
curl -X POST http://localhost:8000/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "¿Cuál es el menú?", "chat": {"id": 12345}}}'
```

## 📊 Capacidades

### WhatsApp
- ✅ Respuestas automáticas 24/7
- ✅ Menú interactivo con botones
- ✅ Reservas por chat
- ✅ Pedidos con confirmación
- ✅ Envío de ubicación
- ✅ Transferencia a humano
- ✅ Soporte multidioma (ES, CA, EN, ZH)

### Telegram
- ✅ Comandos (/menu, /reservar, /pedir)
- ✅ Botones inline
- ✅ Teclados personalizados
- ✅ Envío de fotos de platos
- ✅ Pedidos inline
- ✅ Callback queries

### Email
- ✅ Autorespuestas
- ✅ Respuesta a consultas
- ✅ Confirmación de reservas
- ✅ Seguimiento de pedidos
- ✅ Newsletter
- ✅ Templates HTML profesional

### Web
- ✅ Chat widget
- ✅ API REST completa
- ✅ Landing page responsive
- ✅ Dark mode (Liquid Glass)

## 🏗️ Comparación con Manus AI / ElizaOS

| Capacidad | Manus AI | ElizaOS | Este Agente |
|-----------|----------|---------|-------------|
| Multi-plataforma | ✅ | ❌ | ✅ WhatsApp + Telegram + Email + Voz |
| Reservas | ✅ | ❌ | ✅ |
| Pedidos | ✅ | ❌ | ✅ |
| Menú dinámico | ✅ | ❌ | ✅ |
| Webhook server | ✅ | ✅ | ✅ FastAPI |
| Multi-idioma | ✅ | ❌ | ✅ ES/CA/EN/ZH |
| Templates | ✅ | ❌ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| **Voice Agent** | ❌ | ❌ | ✅ **Llamadas telefónicas AI** |
| **STT/TTS local** | ❌ | ❌ | ✅ **SenseVoice + Piper** |
| Self-hosted | ❌ | ✅ | ✅ |
| Costo | $39/mes | Gratis | Gratis + ~$11/mes (Twilio) |

## 📞 Voice Agent (Agente de Voz)

### Stack de Voz
- **STT**: SenseVoice (50 idiomas, 15x más rápido que Whisper)
- **TTS**: Piper (voces naturales, latencia baja)
- **LLM**: Qwen 3:14B via Ollama (ya instalado)
- **Telefonia**: Twilio ($1/mes + $0.01/min)
- **Framework**: Patter (MIT, open source)

### Capacidades de Voz
- ✅ Responder llamadas automáticamente
- ✅ Tomar reservas por teléfono
- ✅ Informar del menú y precios
- ✅ Recibir pedidos por voz
- ✅ Multiidioma (ES/CA/EN/ZH)
- ✅ Transcripción en tiempo real
- ✅ Grabación de llamadas
- ✅ Transferencia a humano

### Endpoints de Voz
| Endpoint | Descripción |
|----------|-------------|
| `GET /api/voice/status` | Estado del agente de voz |
| `POST /api/voice/transcribe` | Audio → Texto |
| `POST /api/voice/speak` | Texto → Audio |
| `POST /api/voice/chat` | Chat de voz completo |
| `WS /ws/voice` | WebSocket streaming voz |

### Latencia Estimada
- STT (SenseVoice): ~0.3s
- LLM (Qwen local): ~1s
- TTS (Piper): ~0.2s
- **Total E2E**: ~1.5s

## 📝 Licencia

Proyecto abierto para uso comercial y educativo.
