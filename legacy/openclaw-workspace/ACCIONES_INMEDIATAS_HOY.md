# 🚀 ACCIONES INMEDIATAS - HOY 2026-09-01

## ⏰ PRIORIDAD ALTA (Hacer ahora)

### 1. OBTENER API KEYS GRATUITAS (30 min)

**Abre estos enlaces y copia las keys**:

```powershell
# 1. Groq (1000 req/día)
Start-Process "https://console.groq.com/keys"

# 2. Gemini (1500 req/día)
Start-Process "https://aistudio.google.com/app/apikey"

# 3. DeepSeek (free trial)
Start-Process "https://platform.deepseek.com/api_keys"

# 4. HuggingFace (modelos open source)
Start-Process "https://huggingface.co/settings/tokens"

# 5. Fish Audio TTS (ilimitado)
Start-Process "https://fish.audio/app/api-keys/"

# 6. Z.AI GLM (gratis permanente)
Start-Process "https://z.ai/manage-apikey/apikey-list"
```

**Pega las keys en**:
```powershell
notepad C:\Users\USER\.openclaw\workspace\.env
```

### 2. ACTIVAR PAGES EN 5 REPOS (10 min)

```powershell
# Ejecutar uno por uno
gh repo edit belentani7/Belentani --enable-pages --branch main
gh repo edit belentani7/the-judas-experience --enable-pages --branch main
gh repo edit belentani7/duck-docs --enable-pages --branch main
gh repo edit belentani7/duck-hub --enable-pages --branch main
gh repo edit belentani7/belentani-office --enable-pages --branch main

# Verificar
Write-Host "✅ Pages activado en 5 repos"
Write-Host " URLs:"
Write-Host " - https://belentani7.github.io/Belentani/"
Write-Host " - https://belentani7.github.io/the-judas-experience/"
Write-Host " - https://belentani7.github.io/duck-docs/"
Write-Host " - https://belentani7.github.io/duck-hub/"
Write-Host " - https://belentani7.github.io/belentani-office/"
```

### 3. VERIFICAR TOKEN PLAN RESET (5 min)

```powershell
# Ver uso actual
Write-Host "=== TOKEN PLAN QWEN ==="
Write-Host "Estado: 48.6% (4,860/10,000 tokens)"
Write-Host "Reset: Hoy 2026-09-01 09:25:00"
Write-Host ""
Write-Host "Después del reset tendrás: 10,000 tokens"
Write-Host "Meta: Usar <500 req/semana = ~2,000 tokens/día"
```

---

## 📋 PRIORIDAD MEDIA (Hoy o mañana)

### 4. ELIMINAR REPOS DUPLICADOS (15 min)

```powershell
# Ver lista de duplicados
$duplicates = @(
    "heyduck-3", "heyduck-4",
    "carquidec-3", "carquidec-4",
    "nataliamarinho-2", "nataliamarinho-3", "nataliamarinho-4",
    "local-agent-2", "local-agent-3",
    "steven-renovation-2", "steven-renovation-3"
)

Write-Host "⚠️  Se eliminarán $($duplicates.Count) repos duplicados:"
$duplicates | ForEach-Object { Write-Host "  - $_" }
Write-Host ""

$confirm = Read-Host "¿Continuar? (escribir 'SI')"
if ($confirm -eq "SI") {
    foreach ($repo in $duplicates) {
        Write-Host "Eliminando $repo..."
        gh repo delete belentani7/$repo --yes
        Start-Sleep 2
    }
    Write-Host "✅ Eliminados $($duplicates.Count) repos"
}
```

### 5. ABRIR REPOS EDUCATIVOS (10 min)

```powershell
# Hacer públicos (valor educativo)
gh repo edit belentani7/NOIACORE --visibility public
gh repo edit belentani7/voz-belentani --visibility public
gh repo edit belentani7/belentani-voz --visibility public

Write-Host "✅ 3 repos abiertos como open source"
Write-Host " - NOIACORE: Sistema multi-agente"
Write-Host " - voz-belentani: Notebooks de entrenamiento"
Write-Host " - belentani-voz: Sistema de voz Java"
```

### 6. GENERAR PRIMER VIDEO CON HAILUO (20 min)

**Manual (web)**:
1. Ir a https://hailuoai.video/
2. Iniciar sesión (gratis)
3. Usar este prompt:

```
Prompt: "Cyberpunk galactic station at night, neon lights reflecting on wet metal floors, distant stars visible through massive windows, cinematic lighting, 4K quality"

Camera Control: "slow dolly forward, slight tilt up, cinematic"

Duration: 5 seconds
Resolution: 768p
```

4. Descargar video
5. Repetir 2-3 veces (free tier = 100 créditos/día)

---

## 🎯 PRIORIDAD BAJA (Esta semana)

### 7. CONFIGURAR MCP SERVER CON FALLBACK (30 min)

```powershell
# Actualizar mcp-server.js con fallback chain
cd C:\Users\USER\.openclaw\workspace\projects\belentani-nexus
notepad mcp-server.js

# Agregar fallbackChain al inicio del archivo
# (ver código en PLAN_MASTRO_BELENTANI_2026.md sección 3.3)

# Probar
npm run mcp
```

### 8. DOCUMENTAR AION EN NOIACORE (1h)

```powershell
# Clonar NOIACORE
cd C:\Users\USER\.openclaw\workspace\projects
git clone https://github.com/belentani7/NOIACORE.git
cd NOIACORE

# Crear estructura
mkdir docs\architecture
mkdir docs\agents
mkdir docs\workflows

# Crear documento principal
notepad docs\architecture\AION.md
# (copiar contenido de PLAN_MASTRO_BELENTANI_2026.md sección 5.2)

# Commit
git add .
git commit -m "docs: Add AION architecture documentation"
git push
```

### 9. INTEGRAR VOZ CON FISH AUDIO (1h)

**Opción A: Subir samples de voz**
1. Ir a https://fish.audio/speech-tts-voice-clone
2. Subir 3-5 samples de audio (10-30 segundos cada uno)
3. Esperar entrenamiento (5-10 min)
4. Copiar voice_id
5. Configurar en `.env`:
   ```
   FISH_AUDIO_VOICE_ID=belentani-custom-voice-id
   ```

**Opción B: Usar voz existente**
```python
# Usar Fish Audio con voz prediseñada
from fish_audio import TTS

tts = TTS(api_key="tu_fish_key")
tts.speak("Hola, soy Belentani", voice="default")
```

---

## 📊 CHECKLIST FINAL

### Hoy (2026-09-01)
- [ ] Obtener 6 API keys gratuitas
- [ ] Pegar keys en `.env`
- [ ] Activar Pages en 5 repos
- [ ] Verificar reset de tokens (09:25)
- [ ] Eliminar 10 repos duplicados
- [ ] Abrir 3 repos educativos
- [ ] Generar 1 video con Hailuo

### Mañana (2026-09-02)
- [ ] Eliminar 20 repos duplicados más
- [ ] Generar 3 videos más con Hailuo
- [ ] Configurar MCP server con fallback
- [ ] Probar todas las APIs gratuitas

### Esta semana
- [ ] Eliminar 10 repos duplicados restantes
- [ ] Generar 10 videos para Judas Experience
- [ ] Documentar AION en NOIACORE
- [ ] Integrar voz con Fish Audio
- [ ] Consolidar 40+ backups en 1 repo

### Próxima semana
- [ ] Generar 20 videos más
- [ ] Integrar videos con música (ACE-Step + Demucs)
- [ ] Crear dashboard de monitoreo
- [ ] Configurar backup automático
- [ ] Revisar y actualizar PLAN_MASTRO

---

## 🎬 COMANDOS RÁPIDOS

```powershell
# Ver uso de tokens
curl https://dashscope-intl.aliyuncs.com/compatible-mode/v1/usage -H "Authorization: Bearer $env:QWEN_API_KEY"

# Ver repos privados
gh repo list belentani7 --limit 100 --json name,isPrivate | Where-Object { $_.isPrivate -eq $true }

# Ver páginas web
gh repo list belentani7 --limit 100 --json name,homepageUrl | Where-Object { $_.homepageUrl -ne "" }

# Eliminar repo
gh repo delete belentani7/NOMBRE_REPO --yes

# Hacer público
gh repo edit belentani7/NOMBRE_REPO --visibility public

# Activar Pages
gh repo edit belentani7/NOMBRE_REPO --enable-pages --branch main
```

---

## 📞 SOPORTE

**Documentación completa**:
- PLAN_OPTIMIZACION_TOKENS_2026.md
- VIDEO_IA_COMPARATIVA_2026.md
- PLAN_MASTRO_BELENTANI_2026.md
- ACCIONES_INMEDIATAS_HOY.md (este documento)

**APIs configuradas**:
- apis_config.json (35+ providers)
- .env (tus keys personales)

**Proyectos**:
- projects/belentani-nexus/ (frontend + MCP server)
- projects/belentani-nexus/contributions/ (10 contribuciones listas)

---

**¡Empieza ahora con las 3 acciones de prioridad alta!** 🚀
