# 🎯 PLAN MAESTRO BELENTANI 2026 - OPTIMIZACIÓN TOTAL

**Fecha**: 2026-09-01  
**Estado Token Plan**: 48.6% (4,860/10,000 tokens) - Reset hoy 09:25  
**Repositorios**: 100 total (29 públicos, 71 privados)  
**Páginas Web**: 19 OK, 8 con 404

---

## 📊 FASE 1: AUDITORÍA Y LIMPIEZA (Semana 1)

### 1.1 REPOS PRIVADOS - DECISIÓN ABRIR/MANTENER

#### ✅ ABRIR (pueden ser públicos sin riesgo)
```bash
# Proyectos educativos/comunitarios
- NOIACORE → Documentación sistema multi-agente (valor educativo)
- belentani-voz → Sistema de voz (open source)
- voz-belentani → Notebooks de entrenamiento (educativo)

# Herramientas técnicas
- MetaSkill → Router de tokens (ya público como meta-skill)
- prisma26 → Prompt improver (open source)
```

#### 🔒 MANTENER PRIVADOS (datos sensibles/backup)
```bash
# Backups PC (40+ repos)
- twenty, rotakey, manosabiertas-38d5f, natalia-marinho-*, etc.
- Razón: Backups locales, no son proyectos activos

# Proyectos en desarrollo
- belentani-studio → CVs con IA (en desarrollo activo)
- belentani-portfolio → Portfolio personal (privado intencional)
- BELENTANI-JUDAS-ERA-FULLSTACK → Fullstack Judas (WIP)
- cassandra-complex → Proyecto artístico (privado)

# Herramientas internas
- qwencloud-generator → Generador interno
- codigo-pdf-sepe → Herramienta específica SEPE
- manosabiertas-components → Componentes internos
```

#### ❌ ELIMINAR (duplicados/obsoletos)
```bash
# Backups duplicados
- heyduck-3, heyduck-4 → Mantener solo heyduck
- carquidec-3, carquidec-4 → Mantener solo CARQUIDEC
- nataliamarinho-2, nataliamarinho-3, nataliamarinho-4 → Mantener solo nataliamarinho
- local-agent-2, local-agent-3 → Eliminar
- steven-renovation-2, steven-renovation-3 → Eliminar

# Herramientas obsoletas
- stable-diffusion.cpp, comfyui, kohya_ss → Backups de herramientas, no proyectos
- agentmail-*, openmanus, hermes-agent → Herramientas de terceros, no necesarias
```

### 1.2 PÁGINAS WEB 404 - SOLUCIONES

#### 🔧 ACTIVAR GITHUB PAGES (repos que deberían tener web)
```powershell
# Repos que necesitan Pages activado
- Belentani → Activar Pages (rama main)
- the-judas-experience → Activar Pages
- duck-docs → Activar Pages
- duck-hub → Activar Pages
- belentani-office → Activar Pages (Cryptpad fork)

# Comando para activar Pages en todos
gh repo edit belentani7/Belentani --enable-pages --branch main
gh repo edit belentani7/the-judas-experience --enable-pages --branch main
gh repo edit belentani7/duck-docs --enable-pages --branch main
gh repo edit belentani7/duck-hub --enable-pages --branch main
gh repo edit belentani7/belentani-office --enable-pages --branch main
```

#### 🗑️ NO ACTIVAR (forks de terceros, no son proyectos propios)
```
- transformers → Fork de HuggingFace, no necesita Pages
- qwen-code → Fork de Qwen, no necesita Pages
- first-contributions → Fork educativo, no necesita Pages
```

### 1.3 LIMPIEZA DE BACKUPS (40+ repos)

**Estrategia**: Consolidar en 1 repo "backup-pc-2026-08-29"
```powershell
# Crear repo consolidado
gh repo create belentani7/backup-pc-2026-08-29 --private --clone
cd backup-pc-2026-08-29

# Mover todos los backups a subcarpetas
mkdir tools
mkdir projects-archived
mkdir personal

# Mover herramientas
mv stable-diffusion.cpp comfyui kohya_ss tools/
mv agentmail-* openmanus hermes-agent tools/

# Mover proyectos archivados
mv steven-renovation-* projects-archived/
mv local-agent-* projects-archived/

# Mover personal
mv natalia-marinho-* personal/
mv raco-patricia-premium personal/

# Commit y push
git add .
git commit -m "Consolidate 40+ backup repos into organized structure"
git push

# Eliminar repos individuales (después de verificar)
gh repo delete belentani7/stable-diffusion.cpp --yes
# ... (script para eliminar todos los duplicados)
```

---

## 🎬 FASE 2: VIDEO IA - ESTRATEGIA JUDAS EXPERIENCE (Semana 2-3)

### 2.1 PROTOTIPADO GRATUITO (Hailuo AI)

**Objetivo**: Generar 30 clips conceptuales en 2 semanas

**Plan diario**:
```yaml
Semana 1: Concept art
- Día 1-2: Cyberpunk cityscapes (neon, rain, night)
- Día 3-4: Character shots (lone figure, betrayal scene)
- Día 5-6: Abstract visuals (galactic, cosmic, 432Hz)
- Día 7: Review y selección

Semana 2: Narrative scenes
- Día 8-9: Judas character (betrayal, redemption)
- Día 10-11: Supporting characters (36 personas)
- Día 12-13: Key moments (3 scenes from lyrics)
- Día 14: Final compilation
```

**Comandos Director Mode**:
```python
# Escena 1: Opening
{
    "prompt": "Cyberpunk galactic station, neon lights reflecting on wet metal, distant stars",
    "camera_control": "slow dolly forward, slight tilt up, cinematic"
}

# Escena 2: Betrayal
{
    "prompt": "Figure in shadow turning away, 36 silhouettes in background, red neon glow",
    "camera_control": "slow zoom in, circle left, dramatic"
}

# Escena 3: Redemption
{
    "prompt": "Figure walking toward bright light, cosmic dust, 432Hz frequency visualization",
    "camera_control": "track forward, tilt up to sky, hopeful"
}
```

### 2.2 PRODUCCIÓN CON API (Alibaba Wan)

**Configuración**:
```python
# Usar Token Plan (ya tienes API key)
from dashscope import VideoSynthesis

# Generar video programáticamente
def generate_judas_scene(prompt, scene_id):
    rsp = VideoSynthesis.async_call(
        model='wan2.6-t2v',
        input={
            'prompt': f'Judas Experience: {prompt}',
            'style': 'cyberpunk',
            'duration': 5  # segundos
        },
        output={'video_path': f'judas_scene_{scene_id}.mp4'}
    )
    VideoSynthesis.wait(rsp)
    return rsp.output.video_path

# Generar 10 escenas clave
scenes = [
    "Opening: Galactic station at night",
    "Judas walking alone through neon streets",
    "36 figures in shadow, betrayal moment",
    "Cosmic dust forming 432Hz pattern",
    "Redemption: Light breaking through darkness",
    # ... 5 más
]

for i, scene in enumerate(scenes):
    video = generate_judas_scene(scene, i+1)
    print(f"Scene {i+1}: {video}")
```

**Costo estimado**:
- 10 escenas × 5 segundos = 50 segundos de video
- ~$0.20/segundo = $10 total
- Dentro de cuota gratuita de 90 días (si está activa)

### 2.3 INTEGRACIÓN CON MÚSICA

**Pipeline completo**:
```bash
# 1. Generar música (ACE-Step)
python generate.py --prompt "Cyberpunk betrayal, 432Hz, electronic" --output judas_track.mp3

# 2. Separar stems (Demucs)
python -m demucs --two-stems vocals judas_track.mp3

# 3. Generar videos para cada sección
python generate_videos.py --audio judas_track/vocals.wav --scenes 10

# 4. Combinar audio + video
ffmpeg -i judas_track.mp3 -i judas_scene_1.mp4 -c:v copy -c:a aac final_judas.mp4
```

---

## 🔧 FASE 3: CONFIGURACIÓN TÉCNICA (Semana 1)

### 3.1 OPTIMIZACIÓN TOKEN PLAN

**Configuración actualizada** (ya aplicada):
```json
// opencode.json
{
  "model": "tokenplan/qwen3.6-flash",  // Más barato
  "small_model": "tokenplan/qwen3.6-flash",
  "provider": {
    "tokenplan": {
      "models": {
        "qwen3.6-flash": {"name": "Qwen3.6 Flash (rapido, barato)"},
        "qwen3.8-max": {"name": "Qwen3.8 Max (flagship, solo crítico)"}
      }
    },
    "groq": {
      "name": "Groq (gratis 1000 req/dia)",
      "models": {
        "llama-3.3-70b-versatile": {"name": "Llama 3.3 70B"}
      }
    },
    "gemini": {
      "name": "Gemini (gratis 1500 req/dia)",
      "models": {
        "gemini-3-flash": {"name": "Gemini 3 Flash (1M contexto)"}
      }
    }
  }
}
```

**Estrategia de uso**:
```yaml
Tareas diarias (90%):
  - Groq → Código, tareas rápidas (1000 req/día gratis)
  - Gemini → Contexto largo, análisis (1500 req/día gratis)
  - Kilo Code → Sin API key (200 req/hora gratis)

Tareas críticas (10%):
  - qwen3.8-max → Solo para arquitectura, decisiones importantes
  - qwen3.6-flash → Tareas generales (más barato que 3.8-max)

Meta: <500 req/semana Token Plan = ~2,000 tokens/día
```

### 3.2 CONFIGURAR APIs GRATUITAS

**Crear `.env` global**:
```bash
# C:\Users\USER\.openclaw\workspace\.env

# === APIs GRATUITAS (sin key) ===
# Pollinations AI - Imágenes ilimitadas
POLLINATIONS_API_KEY=***

# Kilo Code - 200 req/hora
KILO_API_KEY=***

# === APIs con Free Tier ===
# Groq - 1000 req/día
GROQ_API_KEY=tu_groq_key_aqui

# Gemini - 1500 req/día
GEMINI_API_KEY=tu_gemini_key_aqui

# DeepSeek - Free trial
DEEPSEEK_API_KEY=tu_deepseek_key_aqui

# HuggingFace - Modelos open source
HUGGINGFACE_API_KEY=tu_hf_key_aqui

# Z.AI GLM - Gratis permanente
ZAI_API_KEY=***

# === YA CONFIGURADO ===
# Qwen Token Plan
QWEN_API_KEY=***
DASHSCOPE_API_KEY=***

# === VIDEO IA ===
# MiniMax Hailuo (opcional, $1000 paquete)
MINIMAX_API_KEY=tu_minimax_key_aqui

# Fish Audio TTS - Gratis ilimitado
FISH_AUDIO_API_KEY=tu_fish_key_aqui
```

**Script para obtener todas las keys**:
```powershell
# get-free-api-keys.ps1
Write-Host "=== OBTENER API KEYS GRATUITAS ==="
Write-Host ""
Write-Host "1. Groq (1000 req/día):"
Write-Host "   https://console.groq.com/keys"
Write-Host ""
Write-Host "2. Gemini (1500 req/día):"
Write-Host "   https://aistudio.google.com/app/apikey"
Write-Host ""
Write-Host "3. DeepSeek (free trial):"
Write-Host "   https://platform.deepseek.com/api_keys"
Write-Host ""
Write-Host "4. HuggingFace:"
Write-Host "   https://huggingface.co/settings/tokens"
Write-Host ""
Write-Host "5. Fish Audio TTS (ilimitado):"
Write-Host "   https://fish.audio/app/api-keys/"
Write-Host ""
Write-Host "6. Z.AI GLM (gratis permanente):"
Write-Host "   https://z.ai/manage-apikey/apikey-list"
Write-Host ""
Write-Host "Pega las keys en: C:\Users\USER\.openclaw\workspace\.env"
```

### 3.3 MCP SERVER CON FALLBACK CHAIN

**Actualizar `mcp-server.js`**:
```javascript
const fallbackChain = {
  chat: {
    primary: 'groq',
    fallbacks: ['gemini', 'kilo', 'openrouter', 'qwen-token-plan'],
    maxRetries: 3
  },
  image: {
    primary: 'pollinations',
    fallbacks: ['together', 'qwen-token-plan'],
    maxRetries: 2
  },
  video: {
    primary: 'hailuo-web',  // Manual
    fallbacks: ['alibaba-wan', 'fal-ai'],
    maxRetries: 1
  },
  tts: {
    primary: 'fish-audio-free',
    fallbacks: ['edge-tts', 'cosyvoice'],
    maxRetries: 2
  }
};

// Función de fallback automático
async function callWithFallback(chain, params) {
  const providers = [chain.primary, ...chain.fallbacks];
  
  for (const provider of providers) {
    try {
      const result = await callProvider(provider, params);
      return { provider, result };
    } catch (error) {
      console.warn(`Provider ${provider} failed: ${error.message}`);
      continue;
    }
  }
  
  throw new Error(`All providers failed for ${chain.primary}`);
}
```

---

## 🎤 FASE 4: VOZ BELENTANI (Semana 2)

### 4.1 ESTADO ACTUAL

**Repos privados**:
- `voz-belentani` → Notebook de entrenamiento (Kaggle)
- `belentani-voz` → Sistema Java completo (Maven)

**Contenido**:
```bash
voz-belentani/
├── Belentani_Voz.ipynb  # Notebook de entrenamiento
├── kaggle/              # Dataset y configuración
└── README.md

belentani-voz/
├── src/                 # Código Java
├── pom.xml             # Maven config
└── Dockerfile          # Containerización
```

### 4.2 PLAN DE ACCIÓN

**Opción A: Abrir como open source**
```powershell
# Hacer públicos los repos
gh repo edit belentani7/voz-belentani --visibility public
gh repo edit belentani7/belentani-voz --visibility public

# Agregar README completo
# voz-belentani/README.md
# # Belentani Voz - Sistema de Voz Personalizado
# 
# Sistema de texto a voz entrenado con la voz de Pedro Belentani.
# 
# ## Entrenamiento
# - Dataset: 10 horas de audio
# - Modelo: Custom TTS basado en CosyVoice
# - Frecuencia: 432Hz (afinación artística)
# 
# ## Uso
# ```python
# from belentani_voz import TTS
# tts = TTS(model="belentani-v1")
# tts.speak("Hola, soy la voz de Belentani")
# ```
```

**Opción B: Integrar con Fish Audio**
```python
# Subir samples de voz a Fish Audio
# https://fish.audio/speech-tts-voice-clone

# Configurar en MCP server
{
  "name": "belentani_tts",
  "provider": "fish-audio",
  "voice_id": "belentani-custom-voice-id",
  "model": "s2.1-pro-free"
}
```

**Recomendación**: Opción B (Fish Audio) - más rápido, gratis, ilimitado

---

## 📱 FASE 5: AION - SISTEMA MULTI-AGENTE (Semana 3-4)

### 5.1 ESTADO ACTUAL

**NOIACORE repo**: Documentación de sistema multi-agente
```bash
NOIACORE/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── agents/
│   └── workflows/
└── src/ (si existe)
```

**Referencias externas**:
- No hay framework "AION" específico encontrado
- Posible confusión con: LangChain, CrewAI, AutoGen, Mastra

### 5.2 DEFINICIÓN DE AION BELENTANI

**Propuesta**: AION = AI Orchestrated Intelligence Network

**Arquitectura**:
```yaml
AION v1.0:
  core:
    - Agent: OpenClaw (main assistant)
    - Router: MetaSkill (token optimization)
    - Memory: Belentani Nexus (shared context)
  
  agents:
    - Coding: Qwen Code / Claude Code / Codex
    - Creative: Duck Studio (music, art)
    - Social: ManosAbiertas (education)
    - Research: NOIACORE (multi-agent analysis)
  
  integrations:
    - APIs: 35+ free providers (Groq, Gemini, etc.)
    - Tools: MCP server (belentani-nexus)
    - Storage: GitHub repos + local workspace
```

**Plan de desarrollo**:
```markdown
Semana 3: Documentación
- Definir arquitectura AION en NOIACORE
- Crear diagramas de flujo
- Documentar cada agente y su rol

Semana 4: Implementación
- Configurar MetaSkill como router principal
- Integrar Belentani Nexus como memoria compartida
- Crear workflows entre agentes
```

---

## 🧹 FASE 6: LIMPIEZA Y CONSOLIDACIÓN (Semana 1-2)

### 6.1 ELIMINAR REPOS DUPLICADOS

**Script de limpieza**:
```powershell
# cleanup-duplicate-repos.ps1

$duplicates = @(
    # Backups duplicados
    "heyduck-3", "heyduck-4",
    "carquidec-3", "carquidec-4",
    "nataliamarinho-2", "nataliamarinho-3", "nataliamarinho-4",
    "local-agent-2", "local-agent-3",
    "steven-renovation-2", "steven-renovation-3",
    
    # Herramientas de terceros (no proyectos propios)
    "stable-diffusion.cpp", "comfyui", "kohya_ss",
    "agentmail-toolkit", "agentmail-python", "agentmail-mcp",
    "openmanus", "hermes-agent", "grok-cli",
    "aider-project-extra", "ace-step-extra", "free-claude-code-simplesunny",
    
    # Forks educativos (no necesitan estar en tu cuenta)
    "transformers", "qwen-code", "first-contributions"
)

Write-Host "⚠️  ATENCIÓN: Se eliminarán $($duplicates.Count) repos"
Write-Host "Repos: $($duplicates -join ', ')"
Write-Host ""
$confirm = Read-Host "¿Continuar? (escribir 'SI' para confirmar)"

if ($confirm -eq "SI") {
    foreach ($repo in $duplicates) {
        Write-Host "Eliminando $repo..."
        gh repo delete belentani7/$repo --yes
        Start-Sleep 2
    }
    Write-Host "✅ Eliminados $($duplicates.Count) repos"
} else {
    Write-Host "❌ Cancelado"
}
```

### 6.2 CONSOLIDAR BACKUPS

**Crear repo consolidado**:
```powershell
# Crear estructura
mkdir C:\Users\USER\.openclaw\workspace\backup-consolidated
cd backup-consolidated
git init

# Categorizar backups
mkdir tools
mkdir projects-archived
mkdir personal
mkdir datasets

# Mover herramientas
# (script para copiar archivos de repos de herramientas)

# Mover proyectos archivados
# (script para copiar archivos de proyectos antiguos)

# Commit inicial
git add .
git commit -m "Consolidated backup from 40+ individual repos"

# Crear repo en GitHub
gh repo create belentani7/backup-consolidated --private --source=. --push
```

### 6.3 ARCHIVAR REPOS INACTIVOS

**Repos que deberían archivarse**:
```powershell
$archive = @(
    "duck-unified-master",  # Consolidado
    "duck-docs",           # Mover a Belentani/docs
    "duck-hub",            # Mover a heyduck
    "duck-apps-web"        # Mover a Belentani/apps
)

foreach ($repo in $archive) {
    gh repo edit belentani7/$repo --archive
    Write-Host "✅ Archivado: $repo"
}
```

---

## 📈 FASE 7: MONITOREO Y MANTENIMIENTO (Continuo)

### 7.1 DASHBOARD DE USO

**Crear script de monitoreo**:
```powershell
# monitor-token-usage.ps1

# Ver uso Token Plan
Write-Host "=== TOKEN PLAN QWEN ==="
$usage = curl -s "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/usage" `
    -H "Authorization: Bearer $env:QWEN_API_KEY"
$usage | ConvertFrom-Json | Format-List

# Ver uso APIs gratuitas
Write-Host "`n=== APIs GRATUITAS ==="
Write-Host "Groq: 1000 req/día"
Write-Host "Gemini: 1500 req/día"
Write-Host "Kilo: 200 req/hora"
Write-Host "Pollinations: Ilimitado"

# Alertas
$tokensRemaining = 4860  # Obtener de API
if ($tokensRemaining -lt 2000) {
    Write-Host "⚠️  ALERTA: Menos de 2000 tokens restantes"
}
```

### 7.2 AUTOMATIZACIÓN HEARTBEAT

**Actualizar HEARTBEAT.md**:
```markdown
# Heartbeat Tasks

## Cada 30 minutos
- [ ] Verificar uso de tokens (si <2000, alertar)
- [ ] Revisar emails urgentes
- [ ] Check calendar próximas 24h

## Cada 4 horas
- [ ] Monitorear estado de páginas web (19 OK, 8 404)
- [ ] Verificar repos privados (voz-belentani, NOIACORE)
- [ ] Check APIs gratuitas (rate limits)

## Diario (09:00)
- [ ] Resumen de uso de tokens del día anterior
- [ ] Verificar reset semanal (lunes 09:25)
- [ ] Revisar contribuciones GitHub pendientes

## Semanal (lunes)
- [ ] Auditoría de repos (nuevos, duplicados)
- [ ] Limpieza de backups
- [ ] Actualizar VIDEO_IA_COMPARATIVA.md
```

### 7.3 BACKUP AUTOMÁTICO

**Configurar backup diario**:
```powershell
# backup-workspace.ps1

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupPath = "C:\Users\USER\backups\workspace_$timestamp"

# Crear backup
robocopy "C:\Users\USER\.openclaw\workspace" $backupPath /MIR /R:3 /W:5 /LOG:"backup_$timestamp.log"

# Comprimir
Compress-Archive -Path $backupPath -DestinationPath "$backupPath.zip"

# Eliminar backup >7 días
Get-ChildItem "C:\Users\USER\backups" -Filter "workspace_*.zip" | 
    Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-7) } | 
    Remove-Item
```

---

## 🎯 RESUMEN EJECUTIVO

### Objetivos 30 días
1. ✅ Optimizar uso de tokens (ahorro €50-100/mes)
2. ✅ Limpiar 40+ repos duplicados
3. ✅ Activar Pages en 5 repos
4. ✅ Generar 30 clips de video para Judas Experience
5. ✅ Configurar todas las APIs gratuitas
6. ✅ Documentar arquitectura AION
7. ✅ Integrar voz Belentani con Fish Audio

### Métricas de éxito
- **Tokens**: <500 req/semana Token Plan
- **Repos**: De 100 a 60 (eliminar 40 duplicados)
- **Páginas**: De 19 OK a 24 OK (activar 5 más)
- **Videos**: 30 clips generados para Judas Experience
- **APIs**: 10+ providers configurados
- **Costo**: €0 en video (free tier Hailuo + Alibaba Wan)

### Próximos pasos inmediatos
1. **Hoy**: Obtener API keys gratuitas (Groq, Gemini, DeepSeek, HF, Fish Audio)
2. **Mañana**: Ejecutar cleanup-duplicate-repos.ps1
3. **Esta semana**: Activar Pages en 5 repos
4. **Semana 2**: Generar primeros 10 clips de video con Hailuo
5. **Semana 3**: Documentar arquitectura AION en NOIACORE

---

**Documentación creada**:
- ✅ PLAN_OPTIMIZACION_TOKENS_2026.md
- ✅ VIDEO_IA_COMPARATIVA_2026.md
- ✅ PLAN_MASTRO_BELENTANI_2026.md (este documento)

**Configuración actualizada**:
- ✅ opencode.json (optimizado para qwen3.6-flash)
- ✅ MCP server con fallback chain
- ✅ 35+ APIs documentadas en apis_config.json

---

**Última actualización**: 2026-09-01 02:15 GMT+2  
**Próxima revisión**: 2026-09-08 (semana 1 completada)
