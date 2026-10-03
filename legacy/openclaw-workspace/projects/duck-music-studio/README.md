# 🦆 Duck Music Studio

Estudio de producción musical con Inteligencia Artificial para Windows.
**Gratis y sin necesidad de GPU** — toda la IA se ejecuta en la nube
(HuggingFace), tu ordenador solo muestra la interfaz.

## ¿Qué puede hacer?

1. **Generar música a partir de texto** — escribe «dark synthwave, 120 bpm»
   y obtén un archivo de audio.
2. **Separar pistas** — sube una canción y la divide en voces, bajo,
   batería y otros instrumentos.
3. **Mezclar** — ajusta el volumen de cada pista y exporta tu mezcla final.

## Cómo empezar (3 pasos)

### Paso 1 — Instalar dependencias (solo la primera vez)
Abre una terminal (PowerShell) en esta carpeta y ejecuta:

```
pip install -r requirements.txt
```

### Paso 2 — Arrancar el estudio
Haz **doble clic en `run.bat`**.
Se abrirá automáticamente tu navegador con el estudio.

### Paso 3 — Crear música
1. Pestaña **«Generar música»**: elige un motor, escribe la descripción y
   pulsa 🎵 Generar.
2. (Opcional) Pestaña **«Separar pistas»**: sube una canción y pulsa ✂️.
3. Pestaña **«Mezclador»**: mueve los controles de volumen y pulsa
   🎚️ Mezclar y exportar.

Tus canciones generadas se guardan en la carpeta `output/` y tus mezclas
en `mixes/`.

## Motores disponibles (todos gratis)

| Motor | Qué hace | Estado |
|---|---|---|
| 🎤 **ACE-Step** | Canciones completas, acepta letra, hasta 3 min | ✅ Recomendado |
| 🎹 **MusicGen** (Meta) | Instrumental rápido | ⚠️ A veces caído |
| 🥁 **Stable Audio** | Loops y efectos cortos | ⚠️ A veces caído |
| 🎨 **Riffusion** | Legado | ❌ Espacio oficial caído |

> ⚠️ **Suno** no tiene API gratuita pública, por eso no está incluido.
> Si algún día hay acceso de pago, se puede añadir fácilmente.

## Uso desde terminal (opcional)

```
python generate.py "lofi hip hop, chill, piano" --backend musicgen
python generate.py "reggaeton oscuro con 808s" --backend acestep --duration 60
```

## Consejos

- Los espacios gratuitos de HuggingFace a veces «se duermen»: la primera
  generación del día puede tardar un par de minutos mientras despiertan.
- ACE-Step tarda más que MusicGen, pero crea canciones de hasta 3 minutos.
- Escribe los prompts en inglés para mejores resultados
  (ej: «ethereal ambient pads, melancholic piano, reverb»).
- La separación de pistas usa Demucs en la nube; con canciones largas
  puede tardar varios minutos.

## Solución de problemas

| Problema | Solución |
|---|---|
| `run.bat` se cierra solo | Ejecuta primero `pip install -r requirements.txt` |
| «Error al conectar» | El espacio de HF está dormido; espera 1-2 min y reintenta |
| «Internal Gradio error» / «RuntimeError» | El motor elegido está fallando hoy en la nube; prueba otro (ACE-Step es el más fiable) |
| «Riffusion desconectado» | Es normal: el espacio oficial lleva tiempo caído. Usa ACE-Step |
| Sin sonido | Revisa que tu navegador no tenga el audio silenciado |

---
🦆 Duck Music Studio — hecho para artistas, sin necesidad de saber programar.
