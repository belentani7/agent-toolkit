# 🎬 BELTANI IMAX ALBUM VISUAL FACTORY

## 🎯 MISIÓN
Sistema de producción audiovisual autónomo para generar **30 videoclips cinematográficos estilo IMAX** a partir de un álbum musical completo.

**Escala**: 30 canciones × ~4-5 min = **~150 min de contenido visual IMAX**

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOAD BALANCER                               │
│                      Caddy (reverse proxy)                          │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
       │          │          │          │          │
┌──────▼──────┐ ┌─▼────────┐ ┌▼─────────┐ ┌▼────────┐ ┌▼──────────────┐
│   FRONTEND  │ │   API    │ │ComfyUI   │ │  MCP    │ │  Worker      │
│  Next.js    │ │ FastAPI  │ │ Server   │ │ Servers │ │  Cluster     │
│  :3000      │ │ :8000    │ │ :8188    │ │ :9090   │ │  (Celery)    │
└─────────────┘ └──────────┘ └──────────┘ └─────────┘ └───────────────┘
```

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **Next.js 15** (App Router) - SSR, API routes, streaming
- **shadcn/ui + Radix** - Componentes accesibles
- **Tailwind CSS 4** - Utility-first
- **Video.js 8** - HLS/DASH support
- **Zustand** - State management
- **Socket.io-client** - Real-time progress

### Backend
- **FastAPI** (Python 3.12) - Async native
- **Celery + Redis** - Distributed task queue
- **SQLAlchemy 2.0 + Alembic** - Async ORM
- **pydub + librosa** - Audio analysis
- **ffmpeg-python** - Video compositing

### GPU Workers (Modelos de IA)
| Modelo | Propósito | VRAM | Licencia |
|--------|-----------|------|----------|
| **Wan2.1 I2V 14B** | Image-to-video principal | 24GB | Apache 2.0 |
| **LTX-2.5** | Audio-sync video, 4K 50fps | 16GB | Apache 2.0 |
| **LivePortrait** | Animación facial | 4GB | Apache 2.0 |
| **HunyuanVideo 1.5** | T2V fallback | 16GB | Apache 2.0 |
| **Real-ESRGAN** | Upscale 4K/8K | 4GB | BSD-3 |

---

## 📊 MODELO DE DATOS

```sql
-- Proyectos (un proyecto por álbum)
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    artist_name VARCHAR(255),
    style VARCHAR(100) DEFAULT 'imax_cinematic',
    target_resolution VARCHAR(20) DEFAULT '4096x2160',
    fps INTEGER DEFAULT 24,
    status VARCHAR(50) DEFAULT 'draft'
);

-- Canciones del álbum
CREATE TABLE songs (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    track_number INTEGER,
    title VARCHAR(255),
    audio_path TEXT,
    duration_seconds FLOAT,
    bpm FLOAT,
    energy_profile JSONB
);

-- Shots (unidades de producción)
CREATE TABLE shots (
    id UUID PRIMARY KEY,
    song_id UUID REFERENCES songs(id),
    shot_number INTEGER,
    archetype VARCHAR(50),
    start_time FLOAT,
    end_time FLOAT,
    prompt TEXT,
    camera_movement VARCHAR(50),
    lighting VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending'
);
```

---

## 🎬 ENDPOINTS API

### Proyectos
```
POST   /api/projects                    # Crear proyecto
GET    /api/projects                    # Listar proyectos
GET    /api/projects/{id}               # Detalle
```

### Canciones
```
POST   /api/projects/{pid}/songs        # Subir canción + analizar
GET    /api/projects/{pid}/songs        # Listar canciones
POST   /api/songs/{id}/analyze          # Re-analizar audio
```

### Shots
```
POST   /api/songs/{sid}/shots           # Crear shot
POST   /api/songs/{sid}/auto-storyboard # Generar storyboard con IA
```

### Render
```
POST   /api/render/i2v                  # Image-to-video
POST   /api/render/upscale              # Upscale video
POST   /api/render/composite            # Ensamblar shots + audio
POST   /api/render/batch-album          # Pipeline completo (30 canciones)
```

---

## 🚀 DESPLIEGUE

### Requisitos
- GPU: NVIDIA RTX 3090/4090 (24GB VRAM) o equivalente cloud
- RAM: 64GB mínimo
- Storage: 500GB SSD para modelos
- Docker + Docker Compose

### Instalación
```bash
# Clonar repo
git clone https://github.com/belentani7/imax-album-engine.git
cd imax-album-engine

# Configurar variables
cp .env.example .env
# Editar .env con API keys

# Levantar servicios
docker compose up -d

# Verificar
curl http://localhost:8000/health
```

### Uso
```bash
# 1. Crear proyecto
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Judas Album", "artist_name": "Belentani"}'

# 2. Subir canción
curl -X POST http://localhost:8000/api/projects/{id}/songs \
  -F "audio=@judas.mp3" \
  -F "title=Judas"

# 3. Generar storyboard automático
curl -X POST http://localhost:8000/api/songs/{id}/auto-storyboard

# 4. Renderizar videoclip completo
curl -X POST http://localhost:8000/api/render/batch-song \
  -d '{"song_id": "{id}"}'
```

---

## 📈 ROADMAP

### Fase 1: Core Pipeline (✅ 60%)
- [x] Arquitectura definida
- [x] Modelo de datos diseñado
- [x] Endpoints API especificados
- [ ] Implementar FastAPI backend
- [ ] Integrar Celery + Redis
- [ ] Configurar ComfyUI workflows

### Fase 2: GPU Workers (⏳ 0%)
- [ ] Configurar Wan2.1 I2V
- [ ] Integrar LivePortrait
- [ ] Configurar Real-ESRGAN
- [ ] Testear LTX-2.5

### Fase 3: Frontend Dashboard (⏳ 0%)
- [ ] Next.js setup
- [ ] Video player integration
- [ ] Real-time progress (WebSocket)
- [ ] Asset management UI

### Fase 4: Production Pipeline (⏳ 0%)
- [ ] Batch processing (30 canciones)
- [ ] Google Drive export
- [ ] Quality control system
- [ ] Multi-language support

---

## 💰 COSTES ESTIMADOS

### Cloud GPU (RunPod / Lambda Labs)
- **RTX 4090**: $0.34/hora
- **A100 80GB**: $1.10/hora
- **Tiempo por videoclip**: ~2-4 horas
- **Coste por videoclip**: $0.68 - $4.40
- **Coste total (30 videoclips)**: $20 - $132

### APIs de Video IA (Alternativa sin GPU)
- **Hailuo AI**: 100 credits/día gratis
- **Alibaba Wan**: $0.02/segundo de video
- **Coste por videoclip (4 min)**: $4.80
- **Coste total (30 videoclips)**: $144

### Recomendación
**Usar Hailuo AI para prototipado** (gratis) → **Cloud GPU para producción** (calidad IMAX)

---

## 📚 DOCUMENTACIÓN

- `PROMPT_MAESTRO.md` - Prompts optimizados para generación
- `STORYBOARD_TEMPLATE.md` - Template para storyboards
- `API_REFERENCE.md` - Documentación completa de API
- `DEPLOYMENT_GUIDE.md` - Guía de despliegue detallada

---

## 🎵 CASO DE USO: JUDAS ALBUM

**Canciones**: 30 tracks
**Duración total**: ~2 horas
**Estilo**: Cyberpunk cinematográfico
**Arquetipos**: Observador, Caminante, Traidor, Espectador, Niño
**Resolución**: 4K IMAX (4096x2160)
**FPS**: 24 (cinematográfico)

**Tiempo estimado de producción**: 30-60 horas
**Coste estimado**: $20-132 (cloud GPU) o $144 (APIs)

---

**Status**: 🟡 EN DESARROLLO (Fase 1: 60%)
**Versión**: 0.1.0-alpha
**Última actualización**: 2026-09-01
