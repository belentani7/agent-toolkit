#!/usr/bin/env python3
"""
Auditor de Traducciones — Manos Abiertas
Verifica que los 39 idiomas tengan cobertura completa en i18n.ts
y que las voces asignadas sean únicas por idioma.
"""

import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# ─── CONFIGURACIÓN ───────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
I18N_FILE = PROJECT_ROOT / "src" / "data" / "i18n.ts"
VOICE_MAP_FILE = PROJECT_ROOT / "docs" / "GUIA-VOCES-39-IDIOMAS.md"

# 39 idiomas con sus códigos ISO 639-1
IDIOMAS_39: Dict[str, str] = {
    "es": "Español", "en": "English", "pt": "Português", "ca": "Català",
    "ar": "العربية", "fr": "Français", "de": "Deutsch", "it": "Italiano",
    "ru": "Русский", "zh": "中文", "ja": "日本語", "ko": "한국어",
    "hi": "हिन्दी", "bn": "বাংলা", "ur": "اردو", "fa": "فارسی",
    "tr": "Türkçe", "nl": "Nederlands", "pl": "Polski", "uk": "Українська",
    "ro": "Română", "el": "Ελληνικά", "cs": "Čeština", "sv": "Svenska",
    "da": "Dansk", "fi": "Suomi", "no": "Norsk", "hu": "Magyar",
    "bg": "Български", "sk": "Slovenčina", "sl": "Slovenščina", "lt": "Lietuvių",
    "lv": "Latviešu", "et": "Eesti", "he": "עברית", "th": "ไทย",
    "vi": "Tiếng Việt", "id": "Bahasa Indonesia", "sw": "Kiswahili",
}

# Voces Web Speech API por idioma (únicas, no repetidas)
VOZ_POR_IDIOMA: Dict[str, List[str]] = {
    "es": ["Google español", "Microsoft Helena", "Apple Mónica"],
    "en": ["Google US English", "Microsoft Aria", "Apple Samantha"],
    "pt": ["Google português do Brasil", "Microsoft Francisca", "Apple Luciana"],
    "ca": ["Google català", "Microsoft Montserrat"],
    "ar": ["Google العربية", "Microsoft Salma", "Apple Maged"],
    "fr": ["Google français", "Microsoft Denise", "Apple Amélie"],
    "de": ["Google Deutsch", "Microsoft Katja", "Apple Anna"],
    "it": ["Google italiano", "Microsoft Elsa", "Apple Alice"],
    "ru": ["Google русский", "Microsoft Svetlana", "Apple Milena"],
    "zh": ["Google 中文", "Microsoft Xiaoxiao", "Apple Tingting"],
    "ja": ["Google 日本語", "Microsoft Nanami", "Apple Kyoko"],
    "ko": ["Google 한국어", "Microsoft SunHi", "Apple Yuna"],
    "hi": ["Google हिन्दी", "Microsoft Swara"],
    "bn": ["Google বাংলা", "Microsoft Tanishaa"],
    "ur": ["Google اردو", "Microsoft Uzma"],
    "fa": ["Google فارسی", "Microsoft Dilara"],
    "tr": ["Google Türkçe", "Microsoft Emel", "Apple Yelda"],
    "nl": ["Google Nederlands", "Microsoft Colette", "Apple Claire"],
    "pl": ["Google polski", "Microsoft Paulina", "Apple Ewa"],
    "uk": ["Google українська", "Microsoft Polina"],
    "ro": ["Google română", "Microsoft Alina"],
    "el": ["Google Ελληνικά", "Microsoft Athina"],
    "cs": ["Google čeština", "Microsoft Vlasta"],
    "sv": ["Google svenska", "Microsoft Hillevi"],
    "da": ["Google dansk", "Microsoft Naja"],
    "fi": ["Google suomi", "Microsoft Noora"],
    "no": ["Google norsk", "Microsoft Nora"],
    "hu": ["Google magyar", "Microsoft Szabolcs"],
    "bg": ["Google български", "Microsoft Kalina"],
    "sk": ["Google slovenčina", "Microsoft Viktoria"],
    "sl": ["Google slovenščina", "Microsoft Mojca"],
    "lt": ["Google lietuvių", "Microsoft Ona"],
    "lv": ["Google latviešu", "Microsoft Everita"],
    "et": ["Google eesti", "Microsoft Anu"],
    "he": ["Google עברית", "Microsoft Hila"],
    "th": ["Google ไทย", "Microsoft Premwadee"],
    "vi": ["Google Tiếng Việt", "Microsoft HoaiMy"],
    "id": ["Google Bahasa Indonesia", "Microsoft Ardi"],
    "sw": ["Google Kiswahili", "Microsoft Rehema"],
}

# ─── FUNCIONES DE AUDITORÍA ─────────────────────────────────────────────

def extraer_idiomas_implementados(i18n_content: str) -> List[str]:
    """Extrae los códigos de idioma definidos en i18n.ts"""
    patron = r'"([a-z]{2})"\s*:\s*\{'
    return re.findall(patron, i18n_content)

def extraer_claves_traduccion(i18n_content: str, idioma: str) -> int:
    """Cuenta las claves de traducción para un idioma específico"""
    patron = rf'"{idioma}"\s*:\s*\{{([^}}]*(?:\{{[^}}]*\}})*[^}}]*)\}}'
    match = re.search(patron, i18n_content, re.DOTALL)
    if not match:
        return 0
    bloque = match.group(1)
    return len(re.findall(r'\w+\s*:', bloque))

def verificar_unicidad_voces() -> Tuple[bool, List[str]]:
    """Verifica que no haya voces duplicadas entre idiomas"""
    voces_usadas: Dict[str, str] = {}
    duplicados: List[str] = []
    
    for idioma, voces in VOZ_POR_IDIOMA.items():
        for voz in voces:
            if voz in voces_usadas and voces_usadas[voz] != idioma:
                duplicados.append(f"⚠️ Voz '{voz}' duplicada: {voces_usadas[voz]} ↔ {idioma}")
            voces_usadas[voz] = idioma
    
    return (len(duplicados) == 0, duplicados)

def ejecutar_auditoria() -> Dict:
    """Ejecuta la auditoría completa de i18n y voces"""
    print("=" * 70)
    print("AUDITORÍA DE TRADUCCIONES Y VOCES — MANOS ABIERTAS")
    print("=" * 70)
    
    # 1. Leer archivo i18n.ts
    if not I18N_FILE.exists():
        print(f"❌ ERROR: No se encuentra {I18N_FILE}")
        sys.exit(1)
    
    i18n_content = I18N_FILE.read_text(encoding="utf-8")
    
    # 2. Extraer idiomas implementados
    idiomas_implementados = extraer_idiomas_implementados(i18n_content)
    print(f"\n[1] IDIOMAS DETECTADOS: {len(idiomas_implementados)}")
    for idioma in sorted(idiomas_implementados):
        nombre = IDIOMAS_39.get(idioma, "???")
        print(f"    ✓ {idioma} → {nombre}")
    
    # 3. Verificar cobertura de los 39 idiomas
    faltantes = set(IDIOMAS_39.keys()) - set(idiomas_implementados)
    print(f"\n[2] COBERTURA DE IDIOMAS:")
    print(f"    Implementados: {len(idiomas_implementados)}/39")
    if faltantes:
        print(f"    ❌ FALTAN {len(faltantes)} IDIOMAS:")
        for idioma in sorted(faltantes):
            print(f"       - {idioma} ({IDIOMAS_39[idioma]})")
    else:
        print(f"    ✅ Los 39 idiomas están implementados")
    
    # 4. Contar claves por idioma
    print(f"\n[3] CLAVES DE TRADUCCIÓN POR IDIOMA:")
    claves_por_idioma = {}
    for idioma in idiomas_implementados:
        n_claves = extraer_claves_traduccion(i18n_content, idioma)
        claves_por_idioma[idioma] = n_claves
        print(f"    {idioma:4s} → {n_claves:4d} claves")
    
    # 5. Verificar consistencia de claves
    if claves_por_idioma:
        claves_referencia = max(claves_por_idioma.values())
        inconsistentes = {k: v for k, v in claves_por_idioma.items() if v != claves_referencia}
        if inconsistentes:
            print(f"\n    ⚠️ INCONSISTENCIAS DETECTADAS:")
            for idioma, n in inconsistentes.items():
                print(f"       {idioma}: {n} claves (esperado: {claves_referencia})")
        else:
            print(f"\n    ✅ Consistencia perfecta: {claves_referencia} claves en todos los idiomas")
    
    # 6. Verificar unicidad de voces
    print(f"\n[4] VERIFICACIÓN DE UNICIDAD DE VOCES:")
    voces_ok, duplicados = verificar_unicidad_voces()
    if voces_ok:
        print(f"    ✅ Todas las voces son únicas por idioma")
        total_voces = sum(len(v) for v in VOZ_POR_IDIOMA.values())
        print(f"    Total voces asignadas: {total_voces}")
    else:
        print(f"    ❌ PROBLEMAS DE UNICIDAD:")
        for d in duplicados:
            print(f"       {d}")
    
    # 7. Generar informe
    resultado = {
        "total_idiomas_objetivo": 39,
        "total_idiomas_implementados": len(idiomas_implementados),
        "idiomas_faltantes": sorted(list(faltantes)),
        "claves_por_idioma": claves_por_idioma,
        "voces_unicas": voces_ok,
        "total_voces": sum(len(v) for v in VOZ_POR_IDIOMA.values()),
    }
    
    # 8. Guardar informe
    informe_path = PROJECT_ROOT / "docs" / "AUDITORIA-I18N.json"
    informe_path.parent.mkdir(exist_ok=True)
    informe_path.write_text(json.dumps(resultado, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n[5] INFORME GUARDADO: {informe_path}")
    
    return resultado

if __name__ == "__main__":
    resultado = ejecutar_auditoria()
    print("\n" + "=" * 70)
    print("RESULTADO FINAL:", "APROBADO ✅" if resultado["total_idiomas_implementados"] == 39 else "PENDIENTE ⚠️")
    print("=" * 70)
