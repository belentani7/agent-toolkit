#!/usr/bin/env python3
"""
video-generator.py — Generador automático de videos cortos para redes sociales
Genera videos con narración IA + imágenes IA + subtítulos automáticos.

Uso:
    python video-generator.py --niche "reformas" --topic "5 errores en cocinas"
    python video-generator.py --niche "moda" --duration 30

Requiere:
    pip install huggingface_hub requests Pillow moviepy
    Instalar FFmpeg: scoop install ffmpeg

Config:
    HF_TOKEN en automations/config/.env
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    print("❌ pip install python-dotenv")
    sys.exit(1)

CONFIG_DIR = Path(__file__).parent.parent / "config"
OUTPUT_DIR = Path(__file__).parent.parent / "output" / "videos"
LOG_DIR = Path(__file__).parent.parent / "logs"

load_dotenv(CONFIG_DIR / ".env")


def check_dependencies():
    """Verifica dependencias necesarias."""
    missing = []

    try:
        import huggingface_hub
    except ImportError:
        missing.append("huggingface_hub")

    try:
        from PIL import Image
    except ImportError:
        missing.append("Pillow")

    # Check FFmpeg
    import subprocess
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        missing.append("ffmpeg (scoop install ffmpeg)")

    if missing:
        print(f"❌ Dependencias faltantes: {', '.join(missing)}")
        print(f"   pip install {' '.join([m for m in missing if m != 'ffmpeg (scoop install ffmpeg)'])}")
        return False
    return True


def generate_script(niche: str, topic: str, duration: int = 30) -> dict:
    """Genera el guión del video."""
    hf_token = os.getenv("HF_TOKEN")

    script = {
        "title": topic,
        "niche": niche,
        "duration": duration,
        "scenes": [],
        "generated_at": datetime.now().isoformat()
    }

    if hf_token:
        try:
            from huggingface_hub import InferenceClient
            client = InferenceClient(token=hf_token)

            prompt = f"""Genera un guión para un video corto de {duration} segundos sobre: {topic}
Nicho: {niche}
Formato: TikTok/Reels (vertical 9:16)

Devuelve un JSON con esta estructura exacta:
{{
  "hook": "frase gancho de 3 segundos",
  "scenes": [
    {{
      "text": "narración de la escena",
      "visual": "descripción de la imagen/video a generar",
      "duration": 5
    }}
  ],
  "cta": "call to action final"
}}

Solo devuelve el JSON, nada más."""

            response = client.text_generation(
                prompt,
                model="meta-llama/Llama-3.1-8B-Instruct",
                max_new_tokens=800,
                temperature=0.7,
            )

            try:
                script_data = json.loads(response.strip())
                script.update(script_data)
            except json.JSONDecodeError:
                script["scenes"] = [{"text": topic, "visual": f"Imagen sobre {topic}", "duration": duration}]

        except Exception as e:
            print(f"⚠️ Error HF API: {e}")
            script["scenes"] = [{"text": topic, "visual": f"Imagen sobre {topic}", "duration": duration}]
    else:
        print("⚠️ Sin HF_TOKEN — generando guión placeholder")
        script["hook"] = f"¿Sabías esto sobre {topic}?"
        script["scenes"] = [
            {"text": f"Punto clave sobre {topic}", "visual": f"Imagen ilustrativa de {niche}", "duration": 8},
            {"text": "Detalle importante", "visual": f"Gráfico o dato visual", "duration": 8},
            {"text": "Conclusión práctica", "visual": f"Resultado final", "duration": 8},
        ]
        script["cta"] = "¡Sígueme para más tips!"

    return script


def generate_tts(text: str, output_path: Path) -> bool:
    """Genera audio TTS usando Hugging Face."""
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        print(f"  ⚠️ Sin HF_TOKEN — TTS no disponible")
        return False

    try:
        from huggingface_hub import InferenceClient
        client = InferenceClient(token=hf_token)

        audio = client.text_to_speech(text, model="facebook/mms-tts-spa")

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(audio)

        print(f"  🔊 Audio generado: {output_path.name}")
        return True

    except Exception as e:
        print(f"  ⚠️ Error TTS: {e}")
        return False


def generate_image(prompt: str, output_path: Path) -> bool:
    """Genera imagen usando Hugging Face."""
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        print(f"  ⚠️ Sin HF_TOKEN — imagen no disponible")
        return False

    try:
        from huggingface_hub import InferenceClient
        client = InferenceClient(token=hf_token)

        image = client.text_to_image(
            prompt,
            model="stabilityai/stable-diffusion-xl-base-1.0",
            width=768,
            height=1344,  # 9:16 aspect ratio
        )

        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(output_path)
        print(f"  🖼️ Imagen generada: {output_path.name}")
        return True

    except Exception as e:
        print(f"  ⚠️ Error imagen: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Generador automático de videos cortos")
    parser.add_argument("--niche", required=True, help="Nicho de contenido")
    parser.add_argument("--topic", required=True, help="Tema del video")
    parser.add_argument("--duration", type=int, default=30, help="Duración en segundos")
    parser.add_argument("--dry-run", action="store_true", help="Solo generar guión, no assets")

    args = parser.parse_args()

    print(f"🎬 Generador de Video IA")
    print(f"   Nicho: {args.niche}")
    print(f"   Topic: {args.topic}")
    print(f"   Duración: {args.duration}s")
    print()

    # 1. Generar guión
    print("📝 Generando guión...")
    script = generate_script(args.niche, args.topic, args.duration)

    # Guardar guión
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    project_dir = OUTPUT_DIR / f"{args.niche}_{timestamp}"
    project_dir.mkdir(parents=True, exist_ok=True)

    script_path = project_dir / "script.json"
    with open(script_path, 'w', encoding='utf-8') as f:
        json.dump(script, f, ensure_ascii=False, indent=2)
    print(f"✅ Guión guardado: {script_path}")

    if args.dry_run:
        print("\n🏃 Dry run — solo guión generado.")
        print(json.dumps(script, indent=2, ensure_ascii=False))
        return

    # 2. Generar assets por escena
    print("\n🎨 Generando assets...")
    for i, scene in enumerate(script.get("scenes", [])):
        print(f"\n--- Escena {i+1} ---")
        print(f"  📝 {scene.get('text', '')}")

        # TTS
        audio_path = project_dir / f"scene_{i+1}_audio.wav"
        generate_tts(scene.get("text", ""), audio_path)

        # Imagen
        img_path = project_dir / f"scene_{i+1}_image.png"
        generate_image(scene.get("visual", ""), img_path)

    print(f"\n✅ Proyecto de video generado en: {project_dir}")
    print(f"   Próximo paso: Ensamblar con FFmpeg o editor de video")


if __name__ == "__main__":
    main()
