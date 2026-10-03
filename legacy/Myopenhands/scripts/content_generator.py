#!/usr/bin/env python3
"""
Generador de Material Didáctico — Manos Abiertas
Genera contenido educativo estructurado para los 15 nodos,
con metadatos, niveles de dificultad y objetivos de aprendizaje.
"""

import json
from pathlib import Path
from typing import Dict, List

PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / "src" / "data" / "generated"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ─── PLANTILLAS DE CONTENIDO ────────────────────────────────────────────

def generar_modulo_ia(nivel: int) -> Dict:
    """Genera una lección de IA para el nivel dado"""
    temas = {
        1: "Introducción a la Inteligencia Artificial",
        2: "ChatGPT para trámites administrativos",
        3: "Gemini para búsqueda de empleo",
        4: "DeepSeek para traducción de documentos",
        5: "Copilot para redacción profesional",
        6: "Qwen para análisis de texto",
        7: "Claude para resúmenes legales",
        8: "Perplexity para investigación fiable",
        9: "Meta AI para comunicación",
        10: "IA para creación de contenido",
        11: "IA para análisis de datos",
        12: "IA para aprendizaje autónomo",
        13: "Ética y seguridad en IA",
        14: "Proyecto final integrador",
    }
    
    return {
        "id": f"ia-{nivel:02d}",
        "titulo": temas.get(nivel, f"Lección {nivel}"),
        "nivel": nivel,
        "dificultad": ["básico", "básico", "básico", "intermedio", "intermedio",
                       "intermedio", "intermedio", "intermedio", "avanzado", "avanzado",
                       "avanzado", "avanzado", "avanzado", "proyecto"][nivel - 1],
        "duracion_min": 30 + nivel * 5,
        "objetivos": [
            f"Comprender el concepto de {temas.get(nivel, 'IA')}",
            "Aplicar la herramienta en un caso práctico real",
            "Evaluar resultados y corregir errores",
        ],
        "ejercicios": [
            {"tipo": "practica", "descripcion": "Ejercicio guiado paso a paso"},
            {"tipo": "quiz", "descripcion": "5 preguntas de autoevaluación"},
            {"tipo": "proyecto", "descripcion": "Mini-proyecto aplicado"},
        ],
    }

def generar_modulo_ofimatica(modulo: str) -> Dict:
    """Genera un módulo de ofimática"""
    modulos = {
        "word": {"titulo": "Word para documentos oficiales", "duracion": 45},
        "excel": {"titulo": "Excel para presupuestos y nóminas", "duracion": 60},
        "powerpoint": {"titulo": "PowerPoint para presentaciones", "duracion": 40},
        "gdocs": {"titulo": "Google Docs colaborativo", "duracion": 35},
        "gsheets": {"titulo": "Google Sheets para datos", "duracion": 50},
        "gslides": {"titulo": "Google Slides profesional", "duracion": 35},
        "gmail": {"titulo": "Gmail para comunicación formal", "duracion": 30},
        "clave": {"titulo": "Cl@ve y trámites digitales", "duracion": 25},
    }
    
    return {
        "id": f"office-{modulo}",
        "titulo": modulos[modulo]["titulo"],
        "duracion_min": modulos[modulo]["duracion"],
        "formulas": ["=SUMA()", "=PROMEDIO()", "=CONTAR.SI()", "=BUSCARV()"] if modulo == "excel" else [],
        "atajos": ["Ctrl+C", "Ctrl+V", "Ctrl+Z", "Ctrl+S"],
    }

def ejecutar_generacion():
    """Genera todo el material didáctico"""
    print("=" * 70)
    print("GENERADOR DE MATERIAL DIDÁCTICO — MANOS ABIERTAS")
    print("=" * 70)
    
    # 1. Generar 14 lecciones de IA
    lecciones_ia = [generar_modulo_ia(i) for i in range(1, 15)]
    archivo_ia = OUTPUT_DIR / "ai_curriculum_generated.json"
    archivo_ia.write_text(json.dumps(lecciones_ia, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"✅ Generadas {len(lecciones_ia)} lecciones de IA")
    
    # 2. Generar módulos de ofimática
    modulos_office = [generar_modulo_ofimatica(m) for m in ["word", "excel", "powerpoint", "gdocs", "gsheets", "gslides", "gmail", "clave"]]
    archivo_office = OUTPUT_DIR / "office_modules_generated.json"
    archivo_office.write_text(json.dumps(modulos_office, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"✅ Generados {len(modulos_office)} módulos de ofimática")
    
    # 3. Estadísticas
    print(f"\n📊 ESTADÍSTICAS DE GENERACIÓN:")
    print(f"   Total lecciones IA: {len(lecciones_ia)}")
    print(f"   Total módulos Office: {len(modulos_office)}")
    print(f"   Total horas estimadas: {sum(l['duracion_min'] for l in lecciones_ia) // 60}h")
    print(f"   Directorio salida: {OUTPUT_DIR}")

if __name__ == "__main__":
    ejecutar_generacion()
