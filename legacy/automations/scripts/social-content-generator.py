#!/usr/bin/env python3
"""
social-content-generator.py — Generador de contenido para redes sociales
Usa Hugging Face Inference API para generar texto e imágenes.

Uso:
    python social-content-generator.py --niche "reformas" --platform "instagram"
    python social-content-generator.py --niche "moda" --platform "tiktok" --count 5

Requiere:
    pip install huggingface_hub requests python-dotenv Pillow

Config:
    Crear automations/config/.env con:
    HF_TOKEN=hf_xxxxx (tu token de Hugging Face)
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    from dotenv import load_dotenv
    from huggingface_hub import InferenceClient
except ImportError:
    print("❌ Instala dependencias: pip install huggingface_hub python-dotenv")
    sys.exit(1)

# Config
CONFIG_DIR = Path(__file__).parent.parent / "config"
OUTPUT_DIR = Path(__file__).parent.parent / "output" / "social-content"
LOG_DIR = Path(__file__).parent.parent / "logs"

load_dotenv(CONFIG_DIR / ".env")

# Plantillas por nicho
NICHE_TEMPLATES = {
    "reformas": {
        "topics": [
            "Antes y después de una reforma de baño",
            "5 errores comunes al renovar la cocina",
            "Presupuesto real de una reforma integral",
            "Materiales tendencia para reformas 2026",
            "Cómo elegir al contratista correcto",
            "Reform tips: ahorra dinero sin perder calidad",
            "Transformación de piso antiguo a moderno",
        ],
        "hashtags": "#reformas #renovation #antesydespues #homedecor #interiordesign",
        "tone": "profesional, cercano, con datos prácticos"
    },
    "moda": {
        "topics": [
            "Tendencias de moda sostenible 2026",
            "Cómo crear un armario cápsula",
            "Arte que viste: moda como expresión",
            "5 piezas básicas que necesitas",
            "Moda autoral vs fast fashion",
            "Colores que dominarán esta temporada",
            "Accesorios que transforman cualquier look",
        ],
        "hashtags": "#moda #fashion #artequeveste #modaautoral #estilo",
        "tone": "creativo, artístico, inspirador"
    },
    "organizacion": {
        "topics": [
            "Organiza tu vida digital en 7 días",
            "Apps esenciales para productividad",
            "Método para limpiar tu bandeja de entrada",
            "Organización de archivos en la nube",
            "Rutina digital matutina productiva",
            "Elimina el caos digital de tu vida",
            "Herramientas gratuitas de organización",
        ],
        "hashtags": "#productividad #organizacion #vidadigital #habitos #minimalismodigital",
        "tone": "práctico, motivador, paso a paso"
    },
    "migracion": {
        "topics": [
            "Guía de supervivencia para recién llegados",
            "Papeles en España: por dónde empezar",
            "Recursos gratuitos para migrantes en Barcelona",
            "Comunidad y acogida: no estás solo",
            "Salud pública: cómo acceder sin papeles",
            "Vivienda: opciones reales y accesibles",
            "Derechos que tienes aunque no lo sepas",
        ],
        "hashtags": "#migracion #acogida #barcelona #lhospitalet #comunidad #derechos",
        "tone": "empático, informativo, directo, sin paternalismo"
    }
}

PLATFORM_SPECS = {
    "instagram": {"max_chars": 2200, "format": "carousel/reel", "aspect": "1:1 o 4:5"},
    "tiktok": {"max_chars": 300, "format": "video corto", "aspect": "9:16"},
    "linkedin": {"max_chars": 3000, "format": "post con imagen", "aspect": "1.91:1"},
    "twitter": {"max_chars": 280, "format": "thread", "aspect": "16:9"},
}


def generate_post(niche: str, platform: str, topic: str = None) -> dict:
    """Genera un post para la red social indicada."""

    niche_config = NICHE_TEMPLATES.get(niche, NICHE_TEMPLATES["organizacion"])
    platform_config = PLATFORM_SPECS.get(platform, PLATFORM_SPECS["instagram"])

    if not topic:
        import random
        topic = random.choice(niche_config["topics"])

    # Generar contenido con HF si hay token
    hf_token = os.getenv("HF_TOKEN")

    if hf_token:
        try:
            client = InferenceClient(token=hf_token)

            prompt = f"""Genera un post para {platform} sobre: {topic}

Tono: {niche_config['tone']}
Máximo {platform_config['max_chars']} caracteres.
Formato: {platform_config['format']}
Incluye emojis relevantes.
Incluye call-to-action.
Idioma: español.

Solo devuelve el texto del post, nada más."""

            response = client.text_generation(
                prompt,
                model="meta-llama/Llama-3.1-8B-Instruct",
                max_new_tokens=500,
                temperature=0.7,
            )
            content = response.strip()
        except Exception as e:
            content = f"[Error HF API: {e}] — Usa el topic como base: {topic}"
    else:
        content = f"📝 {topic}\n\n[Contenido por generar — configura HF_TOKEN en config/.env]\n\n{niche_config['hashtags']}"

    post = {
        "niche": niche,
        "platform": platform,
        "topic": topic,
        "content": content,
        "hashtags": niche_config["hashtags"],
        "generated_at": datetime.now().isoformat(),
        "status": "draft"
    }

    return post


def save_post(post: dict):
    """Guarda el post generado."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    filename = f"{post['niche']}_{post['platform']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    filepath = OUTPUT_DIR / filename

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(post, f, ensure_ascii=False, indent=2)

    return filepath


def main():
    parser = argparse.ArgumentParser(description="Generador de contenido social media")
    parser.add_argument("--niche", required=True, choices=list(NICHE_TEMPLATES.keys()),
                       help="Nicho de contenido")
    parser.add_argument("--platform", required=True, choices=list(PLATFORM_SPECS.keys()),
                       help="Red social objetivo")
    parser.add_argument("--topic", help="Tema específico (opcional)")
    parser.add_argument("--count", type=int, default=1, help="Número de posts a generar")

    args = parser.parse_args()

    print(f"🚀 Generando {args.count} post(s) para {args.platform} — nicho: {args.niche}")

    for i in range(args.count):
        post = generate_post(args.niche, args.platform, args.topic)
        filepath = save_post(post)
        print(f"\n{'='*60}")
        print(f"📝 Post {i+1}/{args.count}")
        print(f"📌 Topic: {post['topic']}")
        print(f"📄 Content:\n{post['content']}")
        print(f"#️⃣ {post['hashtags']}")
        print(f"💾 Guardado: {filepath}")

    print(f"\n✅ {args.count} post(s) generados exitosamente.")


if __name__ == "__main__":
    main()
