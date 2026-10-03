# BELENTANI NEXUS - Arquitectura All-in-One AI Platform

## 🎯 Visión
Plataforma unificada estilo Cabina.AI/HappyTime con estética cyberpunk bélica Belentani
- Chat multi-modelo (50+ LLMs)
- Generación de imágenes (15+ modelos)
- Generación de video (10+ modelos)
- Text-to-Speech (8+ modelos)
- Speech-to-Text (5+ modelos)
- Sistema de créditos para imágenes/videos
- Estética: Negro + Rojo sangre + Glassmorphism + Starfield

## 🏗️ Stack Tecnológico

### Frontend
- **HTML5 + CSS3 + Vanilla JS** (sin frameworks, máximo rendimiento)
- **Three.js** para starfield 3D
- **GSAP** para animaciones
- **Tailwind CSS** para estilos rápidos
- **Custom WebGL shaders** para efectos bélicos

### Backend (Opcional - Fase 2)
- **Node.js + Express** para proxy de APIs
- **SQLite** para gestión de créditos
- **JWT** para autenticación
- **Rate limiting** por usuario

### APIs Integradas

#### 🇨🇳 CHINA (Prioridad Máxima - Gratuitas/Cheap)

**Text/Code LLMs:**
1. **Qwen (Alibaba)** - qwen3.8-max, qwen3.8-flash
   - Endpoint: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
   - Free: 1M tokens (90 días)
   - Ya tienes Token Plan Pro

2. **DeepSeek** - deepseek-v3, deepseek-r1
   - Endpoint: `https://api.deepseek.com/v1`
   - Free: 500K tokens (registro)
   - Precio: $0.14/1M input, $0.28/1M output

3. **GLM (Zhipu AI)** - glm-4, glm-4v
   - Endpoint: `https://open.bigmodel.cn/api/paas/v4`
   - Free: 500K tokens
   - Precio: $0.01/1K tokens

4. **Kimi (Moonshot AI)** - moonshot-v1-128k
   - Endpoint: `https://api.moonshot.cn/v1`
   - Free: 15K tokens/día
   - Precio: $0.012/1K tokens

5. **MiniMax** - abab6.5-chat
   - Endpoint: `https://api.minimax.chat/v1`
   - Free: 100K tokens
   - Precio: $0.001/1K tokens

6. **Baichuan** - Baichuan2-Turbo
   - Endpoint: `https://api.baichuan-ai.com/v1`
   - Free: 100K tokens
   - Precio: $0.008/1K tokens

**Image Generation:**
7. **Qwen-Image (Alibaba)** - qwen-image-3.0
   - Endpoint: `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis`
   - Free: 100 imágenes (90 días)
   - Precio: $0.02/imagen

8. **Kolors (Kuaishou)** - kolors
   - Endpoint: `https://api.kuaishou.com/v1/image/generation`
   - Free: 50 imágenes
   - Precio: $0.01/imagen

9. **ERNIE-ViL (Baidu)** - ernie-vilg-v2
   - Endpoint: `https://aip.baidubce.com/rest/2.0/text-to-image/sd-xl`
   - Free: 100 imágenes
   - Precio: $0.015/imagen

**Video Generation:**
10. **Wan (Alibaba)** - wanx-v1
    - Endpoint: `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation`
    - Free: 10 videos (90 días)
    - Precio: $0.10/video

11. **CogVideoX (Zhipu)** - cogvideox
    - Endpoint: `https://open.bigmodel.cn/api/paas/v4/videos`
    - Free: 5 videos
    - Precio: $0.15/video

12. **Tencent Hunyuan** - hunyuan-video
    - Endpoint: `https://hunyuan.tencentcloudapi.com/v1/video`
    - Free: 3 videos
    - Precio: $0.20/video

**TTS (Text-to-Speech):**
13. **CosyVoice (Alibaba)** - cosyvoice-v1
    - Endpoint: `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2audio`
    - Free: 10K caracteres (90 días)
    - Precio: $0.001/1K chars

14. **Fish Speech** - fish-speech-1.5
    - Endpoint: `https://api.fish.audio/v1/tts`
    - Free: 5K caracteres/día
    - Precio: $0.0008/1K chars

15. **Volcano TTS (ByteDance)** - volcano-tts
    - Endpoint: `https://openspeech.bytedance.com/api/v1/tts`
    - Free: 10K caracteres
    - Precio: $0.001/1K chars

**STT (Speech-to-Text):**
16. **Paraformer (Alibaba)** - paraformer-v2
    - Endpoint: `https://dashscope-intl.aliyuncs.com/api/v1/services/audio/asr`
    - Free: 1 hora (90 días)
    - Precio: $0.01/minuto

17. **Whisper Chinese (Baidu)** - paddlespeech-asr
    - Endpoint: `https://aip.baidubce.com/rest/2.0/asr/v1`
    - Free: 50K llamadas
    - Precio: $0.001/minuto

#### 🌍 OCCIDENTE (Free Tiers)

**Text LLMs:**
18. **Groq** - llama-3.3-70b, mixtral-8x7b
    - Endpoint: `https://api.groq.com/openai/v1`
    - Free: 30 requests/día
    - Ultra rápido (500+ tokens/s)

19. **OpenRouter** - 50+ modelos
    - Endpoint: `https://openrouter.ai/api/v1`
    - Free: Varía por modelo
    - Acceso unificado

20. **Cerebras** - llama-3.1-70b
    - Endpoint: `https://api.cerebras.ai/v1`
    - Free: 30 requests/día
    - Velocidad extrema

**Image Generation:**
21. **Stable Diffusion (Stability AI)** - sd3.5-large
    - Endpoint: `https://api.stability.ai/v2beta/stable-image/generate`
    - Free: 25 créditos/mes
    - Precio: $0.035/imagen

22. **Flux (Black Forest Labs)** - flux-pro, flux-schnell
    - Endpoint: `https://api.bfl.ml/v1`
    - Free: 100 imágenes (flux-schnell)
    - Precio: $0.04/imagen (flux-pro)

23. **Ideogram** - ideogram-2.0
    - Endpoint: `https://api.ideogram.ai/generate`
    - Free: 10 imágenes/día
    - Precio: $0.03/imagen

24. **Pollinations** - flux
    - Endpoint: `https://image.pollinations.ai/prompt/`
    - **GRATIS ILIMITADO** (sin API key)
    - Perfecto para prototipado

**Video Generation:**
25. **Luma Dream Machine** - dream-machine
    - Endpoint: `https://api.lumalabs.ai/dream-machine/v1/generations`
    - Free: 30 generaciones/mes
    - Precio: $0.10/video

26. **Hailuo (MiniMax)** - hailuo-video
    - Endpoint: `https://api.hailuoai.video/v1`
    - Free: 100 créditos/día
    - Precio: $0.05/video

27. **PixVerse** - pixverse-v2
    - Endpoint: `https://api.pixverse.ai/v1/video`
    - Free: 50 créditos/día
    - Precio: $0.08/video

**TTS:**
28. **ElevenLabs** - eleven_multilingual_v2
    - Endpoint: `https://api.elevenlabs.io/v1/text-to-speech`
    - Free: 10K caracteres/mes
    - Precio: $0.30/1K chars

29. **Google Cloud TTS** - waveNet
    - Endpoint: `https://texttospeech.googleapis.com/v1`
    - Free: 1M caracteres/mes
    - Precio: $16/1M chars

30. **OpenAI TTS** - tts-1-hd
    - Endpoint: `https://api.openai.com/v1/audio/speech`
    - Precio: $15/1M chars

**STT:**
31. **Whisper (OpenAI)** - whisper-1
    - Endpoint: `https://api.openai.com/v1/audio/transcriptions`
    - Precio: $0.006/minuto

32. **Deepgram** - nova-2
    - Endpoint: `https://api.deepgram.com/v1/listen`
    - Free: $200 créditos
    - Precio: $0.0043/minuto

#### 🔓 OPEN SOURCE (Self-hosted, Gratis Total)

33. **Ollama** - llama3.2, qwen2.5, mistral
    - Endpoint: `http://localhost:11434/api/generate`
    - **100% GRATIS** (local)
    - Requiere GPU

34. **LocalAI** - gpt4all, llama-cpp
    - Endpoint: `http://localhost:8080/v1`
    - **100% GRATIS** (local)
    - Compatible con OpenAI API

35. **ComfyUI** - stable diffusion workflows
    - Endpoint: `http://localhost:8188/prompt`
    - **100% GRATIS** (local)
    - Requiere GPU

## 💰 Sistema de Créditos

### Estructura
- **1 crédito = 1 imagen OR 1 video corto (5s) OR 1000 tokens de texto**
- Registro gratuito: 100 créditos
- Daily login: +5 créditos
- Referidos: +20 créditos por usuario

### Costos Internos (para calcular precios)
- Imagen SD: ~$0.035 → 1 crédito
- Imagen Flux Pro: ~$0.04 → 1.14 créditos
- Video Luma: ~$0.10 → 2.86 créditos
- Video Hailuo: ~$0.05 → 1.43 créditos
- Texto Qwen: ~$0.001/1K tokens → 0.1 créditos/1K tokens

### Precios de Venta (sugeridos)
- Pack 100 créditos: $5
- Pack 500 créditos: $20
- Pack 2000 créditos: $70
- Suscripción mensual (1000 créditos): $30/mes

## 🎨 Diseño UI/UX

### Estética Bélica Cyberpunk
- **Colores**: Negro profundo (#0a0a0a) + Rojo sangre (#ff073a) + Blanco hueso (#f5f5f0)
- **Glassmorphism**: backdrop-filter: blur(16px) + bordes sutiles
- **Starfield**: Three.js particles con movimiento parallax
- **Tipografía**: JetBrains Mono (código) + Space Grotesk (UI)
- **Animaciones**: GSAP para transiciones suaves
- **Efectos**: Scanlines CRT, glitch en hover, pulsos de energía

### Layout Principal
```
┌─────────────────────────────────────────────────┐
│  HEADER: Logo + Status + Créditos + User       │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  CHAT AREA (60% width)                  │  │
│  │  - Multi-model selector                 │  │
│  │  - Message history                      │  │
│  │  - Input con file upload                │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  SIDEBAR (40% width)                    │  │
│  │  - Image Generation                     │  │
│  │  - Video Generation                     │  │
│  │  - TTS/STT                              │  │
│  │  - Model Comparison                     │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER: Status APIs + Rate Limits + Logs      │
└─────────────────────────────────────────────────┘
```

## 🚀 Fases de Implementación

### Fase 1: MVP (1-2 semanas)
- [ ] Frontend básico con chat multi-modelo
- [ ] Integración de 5 LLMs gratuitos (Qwen, DeepSeek, GLM, Groq, Ollama)
- [ ] Sistema de créditos básico (localStorage)
- [ ] Estética cyberpunk bélica
- [ ] Deploy en GitHub Pages

### Fase 2: Imágenes y Videos (2-3 semanas)
- [ ] Integración de 10 APIs de imágenes
- [ ] Integración de 5 APIs de videos
- [ ] Galería de generaciones
- [ ] Sistema de créditos con backend
- [ ] Comparación lado a lado

### Fase 3: Audio (1-2 semanas)
- [ ] Integración de TTS (8 modelos)
- [ ] Integración de STT (5 modelos)
- [ ] Editor de audio básico
- [ ] Clonación de voz (CosyVoice)

### Fase 4: Avanzado (2-3 semanas)
- [ ] Backend Node.js + SQLite
- [ ] Autenticación de usuarios
- [ ] Sistema de pagos (Stripe)
- [ ] API pública para desarrolladores
- [ ] Documentación completa

### Fase 5: Optimización (1-2 semanas)
- [ ] Cache de respuestas
- [ ] Rate limiting inteligente
- [ ] Fallback automático entre APIs
- [ ] Monitoring y analytics
- [ ] SEO y marketing

## 📊 Métricas de Éxito

### Técnicos
- Latencia < 2s para texto
- Latencia < 10s para imágenes
- Uptime > 99%
- Soporte para 50+ modelos

### Negocio
- 1000 usuarios en 3 meses
- 10% conversión a pago
- $5000 MRR en 6 meses
- 4.5+ rating en Product Hunt

## 🔒 Seguridad y Privacidad

- API keys encriptadas en backend
- No almacenar conversaciones sensibles
- GDPR compliance
- Rate limiting por IP
- CORS configurado correctamente
- HTTPS obligatorio

## 📚 Documentación

- README.md con setup rápido
- API documentation (Swagger/OpenAPI)
- Tutoriales en video
- Blog con casos de uso
- Comunidad Discord/Telegram

## 🎯 Diferenciadores vs Cabina.AI

1. **Estética única**: Cyberpunk bélico Belentani (no genérico)
2. ** APIs chinas**: Acceso prioritario a modelos chinos gratuitos
3. **Sistema de créditos**: Más transparente y flexible
4. **Open source**: Código abierto para la comunidad
5. **Narrativa**: Integrado con universo JUDAS/BELENTANI
6. **Precio**: Más barato (modelo freemium agresivo)

---

**Próximo paso**: Crear el frontend MVP con chat multi-modelo y estética bélica
