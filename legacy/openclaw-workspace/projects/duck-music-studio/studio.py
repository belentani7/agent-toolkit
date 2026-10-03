# -*- coding: utf-8 -*-
"""
Duck Music Studio 🦆🎵 - Estudio de producción musical con IA
=============================================================
Interfaz web simple (Gradio) que combina:
  1. Texto -> Música (varios motores gratuitos en la nube)
  2. Separación de pistas (voz / bajo / batería / otros) con Demucs
  3. Mezclador: volumen por pista y exportación del mix final

Todo funciona con APIs GRATUITAS de HuggingFace. No necesitas GPU.

Uso:  python studio.py   (o doble clic en run.bat)
"""

import os
import traceback

import numpy as np
import soundfile as sf
import gradio as gr

from generate import (
    BACKENDS,
    BACKEND_LABELS,
    BackendError,
    MusicGenerator,
    OUTPUT_DIR,
)

DEMUCS_SPACE = "teamup-tech/demucs-source-separation"  # Demucs htdemucs en la nube (gratis)
STEM_NAMES = ["Voces", "Bajo", "Batería", "Otros"]
TARGET_SR = 44100

HERE = os.path.dirname(os.path.abspath(__file__))
MIX_DIR = os.path.join(HERE, "mixes")
os.makedirs(MIX_DIR, exist_ok=True)

_clients = {}


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def _get_demucs_client():
    if "demucs" not in _clients:
        from gradio_client import Client
        _clients["demucs"] = Client(DEMUCS_SPACE, verbose=False)
    return _clients["demucs"]


def _load_mono_or_stereo(path):
    """Carga audio como float32 [n_samples, n_channels]."""
    data, sr = sf.read(path, dtype="float32", always_2d=True)
    return data, sr


def _match_length(a, n):
    if len(a) >= n:
        return a[:n]
    return np.pad(a, ((0, n - len(a)), (0, 0)))


# ---------------------------------------------------------------------------
# 1) Generación texto -> música
# ---------------------------------------------------------------------------
def generate_music(backend_key, prompt, duration, lyrics):
    if not prompt or not prompt.strip():
        return None, "❌ Escribe una descripción de la música que quieres."
    backend_key = backend_key.split(" ")[0].lower() if backend_key else "musicgen"
    try:
        gen = MusicGenerator(backend_key)
        path = gen.generate(prompt.strip(), duration=duration,
                            lyrics=lyrics if lyrics and lyrics.strip() else None)
        if path:
            return path, f"✅ ¡Listo! Guardado en {path}"
        return None, "❌ El servicio no devolvió audio. Prueba con otro motor."
    except BackendError as e:
        return None, f"❌ {e}"
    except Exception as e:
        traceback.print_exc()
        return None, f"❌ Error inesperado: {e}"


# ---------------------------------------------------------------------------
# 2) Separación de pistas (Demucs en la nube)
# ---------------------------------------------------------------------------
def separate_stems(audio_path):
    if not audio_path:
        return [None, None, None, None], "❌ Sube primero un archivo de audio."
    try:
        from gradio_client import handle_file
        client = _get_demucs_client()
        fd = handle_file(audio_path)
        if isinstance(fd, dict):
            fd.setdefault("meta", {"_type": "gradio.FileData"})
        # El espacio devuelve (batería, bajo, voces, otros)
        drums, bass, vocals, other = client.predict(
            fd, "htdemucs", api_name="/process"
        )
        return [vocals, bass, drums, other], "✅ ¡Pistas separadas! Pasa a la pestaña «Mezclador»."
    except BackendError as e:
        return [None, None, None, None], f"❌ {e}"
    except Exception as e:
        traceback.print_exc()
        return [None, None, None, None], f"❌ Error al separar pistas: {e}"


# ---------------------------------------------------------------------------
# 3) Mezclador
# ---------------------------------------------------------------------------
def mix_stems(vocals_path, bass_path, drums_path, other_path,
              v_vol, b_vol, d_vol, o_vol, normalize):
    inputs = [
        (vocals_path, v_vol),
        (bass_path, b_vol),
        (drums_path, d_vol),
        (other_path, o_vol),
    ]
    loaded = []
    for path, vol in inputs:
        if not path or not os.path.exists(path):
            continue
        data, sr = _load_mono_or_stereo(path)
        loaded.append((data * (vol / 100.0), sr))

    if not loaded:
        return None, None, "❌ No hay pistas que mezclar. Separa una canción primero (o sube pistas)."

    sr = loaded[0][1]
    n = max(d.shape[0] for d, _ in loaded)
    ch = max(d.shape[1] for d, _ in loaded)

    mix = np.zeros((n, ch), dtype=np.float64)
    for data, _ in loaded:
        if data.shape[1] == 1 and ch == 2:
            data = np.repeat(data, 2, axis=1)
        mix += _match_length(data, n)

    peak = np.max(np.abs(mix))
    if normalize and peak > 0:
        mix = mix / max(peak, 1.0) * 0.95
    mix = np.clip(mix, -1.0, 1.0).astype(np.float32)

    out_path = os.path.join(MIX_DIR, f"mix_{len(os.listdir(MIX_DIR)) + 1:03d}.wav")
    sf.write(out_path, mix, sr)
    return out_path, out_path, f"✅ Mix exportado: {out_path}"


# ---------------------------------------------------------------------------
# Interfaz
# ---------------------------------------------------------------------------
def build_app():
    try:
        theme = gr.themes.Soft(primary_hue="amber", secondary_hue="orange")
    except Exception:
        theme = None
    blocks_kwargs = {"title": "Duck Music Studio 🦆"}
    launch_kwargs = {"inbrowser": True, "show_error": True}
    try:
        with gr.Blocks(theme=theme, **blocks_kwargs) as app:
            _build_ui(app)
    except TypeError:
        # Gradio 6: theme se pasa a launch()
        launch_kwargs["theme"] = theme
        with gr.Blocks(**blocks_kwargs) as app:
            _build_ui(app)
    return app, launch_kwargs


def _build_ui(app):
        gr.Markdown(
            "# 🦆 Duck Music Studio\n"
            "Estudio de música con IA — **gratis y sin GPU**. "
            "Escribe lo que quieres, genera, separa pistas y mezcla."
        )

        with gr.Tabs():
            # ---------------- Pestaña 1: Generar ----------------
            with gr.Tab("1️⃣ Generar música"):
                with gr.Row():
                    with gr.Column():
                        backend = gr.Dropdown(
                            choices=list(BACKEND_LABELS.values()),
                            value=list(BACKEND_LABELS.values())[0],
                            label="Motor (backend)",
                            info="ACE-Step acepta letra; los demás son instrumentales.",
                        )
                        prompt = gr.Textbox(
                            label="Describe tu música",
                            placeholder="Ej: dark synthwave, 120 bpm, heavy drums, melancholic",
                            lines=2,
                        )
                        duration = gr.Slider(5, 180, value=30, step=5,
                                             label="Duración (segundos)",
                                             info="ACE-Step lo respeta; MusicGen genera clips cortos.")
                        lyrics = gr.Textbox(
                            label="Letra (opcional, solo ACE-Step)",
                            placeholder="[verse]\nEscribe aquí tu letra...\n[chorus]",
                            lines=4,
                        )
                        btn_gen = gr.Button("🎵 Generar música", variant="primary")
                    with gr.Column():
                        audio_out = gr.Audio(label="Resultado", type="filepath")
                        status_gen = gr.Markdown("")
                btn_gen.click(generate_music,
                              inputs=[backend, prompt, duration, lyrics],
                              outputs=[audio_out, status_gen])

            # ---------------- Pestaña 2: Separar ----------------
            with gr.Tab("2️⃣ Separar pistas"):
                gr.Markdown(
                    "Sube una canción (tuya o generada arriba) y la IA la divide en "
                    "**voces, bajo, batería y otros**. Usa la nube, tarda un poco."
                )
                audio_in = gr.Audio(label="Canción a separar", type="filepath")
                btn_sep = gr.Button("✂️ Separar pistas", variant="primary")
                status_sep = gr.Markdown("")
                with gr.Row():
                    st_vocals = gr.Audio(label="🎤 Voces", type="filepath")
                    st_bass = gr.Audio(label="🎸 Bajo", type="filepath")
                with gr.Row():
                    st_drums = gr.Audio(label="🥁 Batería", type="filepath")
                    st_other = gr.Audio(label="🎹 Otros", type="filepath")
                btn_sep.click(separate_stems, inputs=[audio_in],
                              outputs=[st_vocals, st_bass, st_drums, st_other, status_sep])

            # ---------------- Pestaña 3: Mezclar ----------------
            with gr.Tab("3️⃣ Mezclador"):
                gr.Markdown(
                    "Ajusta el volumen de cada pista y exporta tu mezcla final. "
                    "Si acabas de separar una canción, las pistas se rellenan solas "
                    "(si no, también puedes subir archivos aquí)."
                )
                with gr.Row():
                    mx_vocals = gr.Audio(label="🎤 Voces", type="filepath")
                    mx_bass = gr.Audio(label="🎸 Bajo", type="filepath")
                with gr.Row():
                    mx_drums = gr.Audio(label="🥁 Batería", type="filepath")
                    mx_other = gr.Audio(label="🎹 Otros", type="filepath")
                with gr.Row():
                    vol_v = gr.Slider(0, 200, value=100, step=5, label="Vol. voces %")
                    vol_b = gr.Slider(0, 200, value=100, step=5, label="Vol. bajo %")
                    vol_d = gr.Slider(0, 200, value=100, step=5, label="Vol. batería %")
                    vol_o = gr.Slider(0, 200, value=100, step=5, label="Vol. otros %")
                normalize = gr.Checkbox(value=True, label="Normalizar volumen final (recomendado)")
                btn_mix = gr.Button("🎚️ Mezclar y exportar", variant="primary")
                status_mix = gr.Markdown("")
                mix_out = gr.Audio(label="Mezcla final", type="filepath")
                mix_file = gr.File(label="Descargar mezcla")

                btn_mix.click(mix_stems,
                              inputs=[mx_vocals, mx_bass, mx_drums, mx_other,
                                      vol_v, vol_b, vol_d, vol_o, normalize],
                              outputs=[mix_out, mix_file, status_mix])

                # Al separar, copiar pistas al mezclador automáticamente
                btn_sep.click(
                    lambda v, b, d, o: [v, b, d, o],
                    inputs=[st_vocals, st_bass, st_drums, st_other],
                    outputs=[mx_vocals, mx_bass, mx_drums, mx_other],
                )

        gr.Markdown(
            "---\n"
            "🦆 *Duck Music Studio* — todo con APIs gratuitas de HuggingFace "
            "(MusicGen, ACE-Step, Stable Audio, Demucs). Tus pistas se guardan en "
            "`output/` y tus mezclas en `mixes/`."
        )


if __name__ == "__main__":
    print("\n🦆 Duck Music Studio arrancando...")
    print("Se abrirá en tu navegador automáticamente.\n")
    app, launch_kwargs = build_app()
    app.launch(**launch_kwargs)
