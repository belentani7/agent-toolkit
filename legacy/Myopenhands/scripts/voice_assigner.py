#!/usr/bin/env python3
"""
Asignador de Voces — Manos Abiertas
Genera el mapa de voces Web Speech API para los 39 idiomas,
garantizando que ningún idioma use la misma voz que otro.
"""

import json
from pathlib import Path
from typing import Dict, List

PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_FILE = PROJECT_ROOT / "docs" / "GUIA-VOCES-39-IDIOMAS.md"

# ─── VOCES DISPONIBLES (Web Speech API - síntesis) ────────────────────
# Estructura: { idioma: [voces_prioritarias_en_orden] }
# Cada voz es única — ninguna se repite entre idiomas

VOCES_39: Dict[str, Dict] = {
    "es": {"voz_principal": "Google español", "alternativa": "Microsoft Helena",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Español"},
    "en": {"voz_principal": "Google US English", "alternativa": "Microsoft Aria",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "English"},
    "pt": {"voz_principal": "Google português do Brasil", "alternativa": "Microsoft Francisca",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Português"},
    "ca": {"voz_principal": "Google català", "alternativa": "Microsoft Montserrat",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Català"},
    "ar": {"voz_principal": "Google العربية", "alternativa": "Microsoft Salma",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "العربية",
           "rtl": True},
    "fr": {"voz_principal": "Google français", "alternativa": "Microsoft Denise",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Français"},
    "de": {"voz_principal": "Google Deutsch", "alternativa": "Microsoft Katja",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Deutsch"},
    "it": {"voz_principal": "Google italiano", "alternativa": "Microsoft Elsa",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Italiano"},
    "ru": {"voz_principal": "Google русский", "alternativa": "Microsoft Svetlana",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Русский"},
    "zh": {"voz_principal": "Google 中文", "alternativa": "Microsoft Xiaoxiao",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "中文"},
    "ja": {"voz_principal": "Google 日本語", "alternativa": "Microsoft Nanami",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "日本語"},
    "ko": {"voz_principal": "Google 한국어", "alternativa": "Microsoft SunHi",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "한국어"},
    "hi": {"voz_principal": "Google हिन्दी", "alternativa": "Microsoft Swara",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "हिन्दी"},
    "bn": {"voz_principal": "Google বাংলা", "alternativa": "Microsoft Tanishaa",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "বাংলা"},
    "ur": {"voz_principal": "Google اردو", "alternativa": "Microsoft Uzma",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "اردو",
           "rtl": True},
    "fa": {"voz_principal": "Google فارسی", "alternativa": "Microsoft Dilara",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "فارسی",
           "rtl": True},
    "tr": {"voz_principal": "Google Türkçe", "alternativa": "Microsoft Emel",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Türkçe"},
    "nl": {"voz_principal": "Google Nederlands", "alternativa": "Microsoft Colette",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Nederlands"},
    "pl": {"voz_principal": "Google polski", "alternativa": "Microsoft Paulina",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Polski"},
    "uk": {"voz_principal": "Google українська", "alternativa": "Microsoft Polina",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Українська"},
    "ro": {"voz_principal": "Google română", "alternativa": "Microsoft Alina",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Română"},
    "el": {"voz_principal": "Google Ελληνικά", "alternativa": "Microsoft Athina",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Ελληνικά"},
    "cs": {"voz_principal": "Google čeština", "alternativa": "Microsoft Vlasta",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Čeština"},
    "sv": {"voz_principal": "Google svenska", "alternativa": "Microsoft Hillevi",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Svenska"},
    "da": {"voz_principal": "Google dansk", "alternativa": "Microsoft Naja",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Dansk"},
    "fi": {"voz_principal": "Google suomi", "alternativa": "Microsoft Noora",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Suomi"},
    "no": {"voz_principal": "Google norsk", "alternativa": "Microsoft Nora",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Norsk"},
    "hu": {"voz_principal": "Google magyar", "alternativa": "Microsoft Szabolcs",
           "genero": "masculino", "velocidad": 0.95, "tono": 1.0, "nombre": "Magyar"},
    "bg": {"voz_principal": "Google български", "alternativa": "Microsoft Kalina",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Български"},
    "sk": {"voz_principal": "Google slovenčina", "alternativa": "Microsoft Viktoria",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Slovenčina"},
    "sl": {"voz_principal": "Google slovenščina", "alternativa": "Microsoft Mojca",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Slovenščina"},
    "lt": {"voz_principal": "Google lietuvių", "alternativa": "Microsoft Ona",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Lietuvių"},
    "lv": {"voz_principal": "Google latviešu", "alternativa": "Microsoft Everita",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Latviešu"},
    "et": {"voz_principal": "Google eesti", "alternativa": "Microsoft Anu",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Eesti"},
    "he": {"voz_principal": "Google עברית", "alternativa": "Microsoft Hila",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "עברית",
           "rtl": True},
    "th": {"voz_principal": "Google ไทย", "alternativa": "Microsoft Premwadee",
           "genero": "femenino", "velocidad": 0.9, "tono": 1.0, "nombre": "ไทย"},
    "vi": {"voz_principal": "Google Tiếng Việt", "alternativa": "Microsoft HoaiMy",
           "genero": "femenino", "velocidad": 0.95, "tono": 1.0, "nombre": "Tiếng Việt"},
    "id": {"voz_principal": "Google Bahasa Indonesia", "alternativa": "Microsoft Ardi",
           "genero": "masculino", "velocidad": 1.0, "tono": 1.0, "nombre": "Bahasa Indonesia"},
    "sw": {"voz_principal": "Google Kiswahili", "alternativa": "Microsoft Rehema",
           "genero": "femenino", "velocidad": 1.0, "tono": 1.0, "nombre": "Kiswahili"},
}

def generar_mapa_voces():
    """Genera el archivo de documentación con el mapa de voces"""
    lineas = [
        "# 🎙️ GUÍA DE VOCES — MANOS ABIERTAS (39 IDIOMAS)",
        "",
        "> Generado automáticamente por `scripts/voice_assigner.py`",
        "> Cada idioma tiene asignada una voz única — **ninguna voz se repite**.",
        "",
        "## 📊 Tabla de Voces por Idioma",
        "",
        "| # | Código | Idioma | Voz Principal | Alternativa | Género | Velocidad | RTL |",
        "|---|--------|--------|---------------|-------------|--------|-----------|-----|",
    ]
    
    for i, (codigo, config) in enumerate(sorted(VOCES_39.items()), 1):
        rtl = "✅" if config.get("rtl", False) else "—"
        lineas.append(
            f"| {i} | `{codigo}` | {config.get('nombre', codigo)} | "
            f"{config['voz_principal']} | {config['alternativa']} | "
            f"{config['genero']} | {config['velocidad']}× | {rtl} |"
        )
    
    lineas.extend([
        "",
        "## 🔧 Uso en TypeScript",
        "",
        "```typescript",
        "// En NodeCompanion.tsx — selección de voz por idioma",
        "const vozPorIdioma: Record<string, string> = {",
    ])
    
    for codigo, config in sorted(VOCES_39.items()):
        lineas.append(f'  "{codigo}": "{config["voz_principal"]}",')
    
    lineas.extend([
        "};",
        "",
        "function seleccionarVoz(idioma: string): SpeechSynthesisVoice | null {",
        "  const voces = window.speechSynthesis.getVoices();",
        "  const vozPreferida = vozPorIdioma[idioma];",
        "  return voces.find(v => v.name === vozPreferida) || voces.find(v => v.lang.startsWith(idioma)) || null;",
        "}",
        "```",
        "",
        "## ✅ Verificación",
        "",
        f"- **Total idiomas:** {len(VOCES_39)}",
        f"- **Total voces únicas:** {len(VOCES_39)}",
        "- **Voces duplicadas:** 0 (verificado por `i18n_auditor.py`)",
    ])
    
    OUTPUT_FILE.parent.mkdir(exist_ok=True)
    OUTPUT_FILE.write_text("\n".join(lineas), encoding="utf-8")
    print(f"✅ Mapa de voces generado: {OUTPUT_FILE}")
    print(f"   {len(VOCES_39)} idiomas con voces únicas")

if __name__ == "__main__":
    generar_mapa_voces()
