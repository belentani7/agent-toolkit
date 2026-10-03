# -*- coding: utf-8 -*-
"""
Duck Music Studio - Generador de música multi-backend
=====================================================
Todos los backends usan APIs GRATUITAS en la nube (HuggingFace Spaces).
No se necesita GPU local.

Backends:
  - MusicGen   (facebook/MusicGen)          : rápido, instrumental
  - ACE-Step   (ACE-Step/ACE-Step)          : canciones completas con letra
  - StableAudio(Stable-Audio-Open-Zero)     : efectos / loops cortos
  - Riffusion  (riffusion/riffusion)        : legado (puede estar desconectado)
  - Suno       (sin nivel gratuito público) : deshabilitado

Uso CLI:
    python generate.py "dark synthwave, 120 bpm, heavy drums" --backend musicgen
"""

import os
import shutil
import sys
import time

# Consola Windows: evitar errores con emojis/acentos (cp1252)
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from gradio_client import Client

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def _clean_name(text, max_len=40):
    clean = "".join(c if c.isalnum() or c in (" ", "-", "_") else "" for c in text)
    return clean.strip().replace(" ", "_")[:max_len] or "pista"


def _save(audio_path, prompt, tag):
    """Copia el audio generado a la carpeta output/."""
    if audio_path and os.path.exists(audio_path):
        final_path = os.path.join(OUTPUT_DIR, f"{_clean_name(prompt)}_{tag}.wav")
        shutil.copy2(audio_path, final_path)
        print(f"✔ Guardado: {final_path}")
        return final_path
    return None


class BackendError(Exception):
    """Error claro para mostrar al usuario."""


# ---------------------------------------------------------------------------
# Backend 1: MusicGen (Meta) via espacio oficial de HuggingFace - GRATIS
# ---------------------------------------------------------------------------
class MusicGenBackend:
    NAME = "musicgen"
    SPACE = "facebook/MusicGen"

    def __init__(self):
        print(f"Conectando a {self.SPACE} ...")
        self.client = Client(self.SPACE, verbose=False)
        print("¡Conectado!")

    def generate(self, prompt, duration=30, **kwargs):
        """duration no es configurable en este espacio (genera ~15 s), se ignora."""
        result = self.client.predict(
            texts=prompt,
            melodies=None,           # sin melodía de referencia
            api_name="/predict_batched",
        )
        path = result if isinstance(result, str) else result[0]
        return _save(path, prompt, "musicgen")


# ---------------------------------------------------------------------------
# Backend 2: ACE-Step - canciones completas con letra - GRATIS
# ---------------------------------------------------------------------------
class AceStepBackend:
    NAME = "acestep"
    SPACE = "ACE-Step/ACE-Step"

    def __init__(self):
        print(f"Conectando a {self.SPACE} ...")
        self.client = Client(self.SPACE, verbose=False)
        print("¡Conectado!")

    def generate(self, prompt, duration=60, lyrics="[Instrumental]", **kwargs):
        result = self.client.predict(
            audio_duration=float(duration) if duration and duration > 0 else -1,
            prompt=prompt,
            lyrics=lyrics or "[Instrumental]",
            infer_step=60,
            guidance_scale=15.0,
            scheduler_type="euler",
            cfg_type="apg",
            omega_scale=10.0,
            manual_seeds=None,
            guidance_interval=0.5,
            guidance_interval_decay=0.0,
            min_guidance_scale=3.0,
            use_erg_tag=True,
            use_erg_lyric=False,
            use_erg_diffusion=True,
            oss_steps=None,
            guidance_scale_text=0.0,
            guidance_scale_lyric=0.0,
            audio2audio_enable=False,
            ref_audio_strength=0.5,
            ref_audio_input=None,
            lora_name_or_path="none",
            api_name="/__call__",
        )
        # devuelve (audio, json de parámetros)
        audio = result[0] if isinstance(result, (list, tuple)) else result
        return _save(audio, prompt, "acestep")


# ---------------------------------------------------------------------------
# Backend 3: Stable Audio Open Zero - gratis, bueno para loops/FX
# ---------------------------------------------------------------------------
class StableAudioBackend:
    NAME = "stableaudio"
    SPACE = "artificialguybr/Stable-Audio-Open-Zero"

    def __init__(self):
        print(f"Conectando a {self.SPACE} ...")
        self.client = Client(self.SPACE, verbose=False)
        print("¡Conectado!")

    def generate(self, prompt, duration=10, **kwargs):
        result = self.client.predict(
            prompt=prompt,
            seconds_total=int(min(max(duration, 1), 47)),  # límite del espacio
            steps=100,
            cfg_scale=7.0,
            api_name="/predict",
        )
        path = result if isinstance(result, str) else result[0]
        return _save(path, prompt, "stableaudio")


# ---------------------------------------------------------------------------
# Backend 4: Riffusion (legado - el espacio oficial suele estar caído)
# ---------------------------------------------------------------------------
class RiffusionBackend:
    NAME = "riffusion"
    SPACE = "riffusion/riffusion"

    def __init__(self):
        print(f"Conectando a {self.SPACE} ...")
        try:
            self.client = Client(self.SPACE, verbose=False)
        except Exception as e:
            raise BackendError(
                "El espacio de Riffusion parece estar desconectado (404). "
                "Usa 'musicgen' o 'acestep' en su lugar."
            ) from e
        print("¡Conectado!")

    def generate(self, prompt, duration=30, steps=50, **kwargs):
        result = self.client.predict(
            prompt=prompt,
            seed=0,
            negative_prompt="",
            num_inference_steps=steps,
            width=512,
            height=512,
            api_name="/generate",
        )
        if result and len(result) >= 2:
            return _save(result[1], prompt, "riffusion")
        raise BackendError("Riffusion no devolvió audio.")


# ---------------------------------------------------------------------------
# Backend 5: Suno - NO hay nivel gratuito público
# ---------------------------------------------------------------------------
class SunoBackend:
    NAME = "suno"

    def __init__(self):
        raise BackendError(
            "Suno no tiene API pública gratuita. Si algún día tienes una clave de "
            "pago, se puede añadir. De momento usa 'acestep' (con letra) o 'musicgen'."
        )

    def generate(self, prompt, duration=30, **kwargs):
        raise BackendError("Suno no disponible.")


BACKENDS = {
    "musicgen": MusicGenBackend,
    "acestep": AceStepBackend,
    "stableaudio": StableAudioBackend,
    "riffusion": RiffusionBackend,
    "suno": SunoBackend,
}

BACKEND_LABELS = {
    "acestep": "🎤 ACE-Step - canciones completas con letra (recomendado)",
    "musicgen": "🎹 MusicGen (Meta) - instrumental rápido",
    "stableaudio": "🥁 Stable Audio - loops y efectos cortos",
    "riffusion": "🎨 Riffusion (legado, puede fallar)",
}


class MusicGenerator:
    """Fachada simple: elige backend por nombre."""

    def __init__(self, backend="musicgen"):
        if backend not in BACKENDS:
            raise BackendError(f"Backend desconocido: {backend}. Opciones: {list(BACKENDS)}")
        self.backend_name = backend
        self.backend = BACKENDS[backend]()

    def generate(self, prompt, duration=30, lyrics=None, retries=2):
        print(f"\n--- Generando [{self.backend_name}]: {prompt} ---")
        last_err = None
        for attempt in range(1, retries + 2):
            try:
                return self.backend.generate(prompt, duration=duration, lyrics=lyrics)
            except BackendError:
                raise
            except Exception as e:
                last_err = e
                if attempt <= retries:
                    wait = 10 * attempt
                    print(f"⚠ Intento {attempt} falló ({e}). Reintentando en {wait}s...")
                    time.sleep(wait)
        raise BackendError(f"El servicio falló tras {retries + 1} intentos: {last_err}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Genera música con APIs gratuitas en la nube")
    parser.add_argument("prompt", nargs="?", default="lofi hip hop, chill, rainy night, piano")
    parser.add_argument("--backend", default="musicgen", choices=list(BACKENDS))
    parser.add_argument("--duration", type=float, default=30)
    parser.add_argument("--lyrics", default=None, help="Letra (solo ACE-Step)")
    args = parser.parse_args()

    try:
        gen = MusicGenerator(args.backend)
        path = gen.generate(args.prompt, duration=args.duration, lyrics=args.lyrics)
        if path:
            print(f"\n✅ Listo: {path}")
        else:
            print("\n❌ No se generó audio")
    except BackendError as e:
        print(f"\n❌ {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
