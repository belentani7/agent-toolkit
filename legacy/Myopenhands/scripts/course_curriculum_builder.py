#!/usr/bin/env python3
"""
CONSTRUCTOR & GENERADOR DE CURRÍCULUM EDUCATIVO EXTENDIDO
Estructura itinerarios didácticos de alta densidad:
1. Alfabetización Digital, Linux CLI & Terminal Bash, Windows 11
2. Suite Ofimática & Automatización de Hojas de Cálculo (Excel / Sheets)
3. Inteligencia Artificial Aplicada, Chatbots & Asistentes de Voz
4. Lengua Española Funcional (MCER A1, A2, B1, B2)
5. Preparación Certificada de Exámenes Oficiales (DELE A2 / CCSE)
6. Derecho Administrativo, Ley de Extranjería y Regularización
"""

import json
import os

CURRICULUM_MATRIX = {
    "track_os_and_sysadmin": {
        "title": "Entornos de Trabajo: Linux Bash CLI & Windows 11 Profesional",
        "objective": "Capacitar en el uso de terminal, gestión de archivos, automatización de tareas y resolución de problemas técnicos sin intermediarios.",
        "modules": [
            {
                "id": "os-lin-01",
                "name": "Fundamentos de Terminal Linux / Ubuntu",
                "topics": ["Comandos esenciales (ls, cd, pwd, cp, mv, rm, mkdir)", "Permisos de usuario (chmod, chown, sudo)", "Gestión de paquetes con apt", "Redirecciones y pipes (| , >, >>)"],
                "interactive_practice": "Simulador de consola interactivo para navegar directorios y crear scripts .sh"
            },
            {
                "id": "os-win-02",
                "name": "Administración de Windows 11 & Configuración Segura",
                "topics": ["Atajos de teclado clave (Win+E, Win+R, Ctrl+Shift+Esc)", "Instalación de certificados digitales FNMT/DNIe en el almacén de Windows", "Seguridad contra malware y phishing en correos de ofertas de empleo", "Gestión de impresoras y exportación PDF/A"],
                "interactive_practice": "Protocolo de verificación de firmas digitales y cifrado"
            }
        ]
    },
    "track_office_productivity": {
        "title": "Suite Ofimática & Competencias Administrativas de Alto Rendimiento",
        "objective": "Superar los estándares de productividad de empresas españolas en procesamiento de texto oficial, hojas de cálculo complejas y bases de datos.",
        "modules": [
            {
                "id": "off-calc-01",
                "name": "Excel Avanzado & Hojas de Cálculo Google",
                "topics": ["Fórmulas condicionales anidadas (=SI, =Y, =O)", "Funciones de búsqueda moderna (=BUSCARX, =INDICE/COINCIDIR)", "Tablas dinámicas y segmentadores de datos", "Diseño de presupuestos, nóminas y control de inventario"],
                "interactive_practice": "Simulador en vivo de comisiones y presupuestos con cálculo en tiempo real"
            },
            {
                "id": "off-docs-02",
                "name": "Redacción Administrativa Oficial (Word / Google Docs)",
                "topics": ["Estructura canónica de Instancia General / Solicitud a la Administración", "Recurso de reposición y alegaciones", "Encabezados, pies de página con numeración formal y estilos normativos ISO/UNE", "Plantillas de CV Europass y ATS-friendly"],
                "interactive_practice": "Generador y exportador A4 listo para imprimir y firmar"
            }
        ]
    },
    "track_ai_and_automation": {
        "title": "Inteligencia Artificial Aplicada, Agentes & Tutores de Voz",
        "objective": "Utilizar modelos de lenguaje para orientación legal, preparación de entrevistas y redacción de reclamaciones.",
        "modules": [
            {
                "id": "ai-tutor-01",
                "name": "Ingeniería de Prompts para Trámites & Documentación",
                "topics": ["Construcción de prompts con contexto y restricciones", "Extracción de requisitos desde boletines oficiales (BOE)", "Simulación de entrevistas laborales y de integración social"],
                "interactive_practice": "Tutor IA 'Manos' con reconocimiento de voz Web Speech API y síntesis TTS"
            }
        ]
    }
}

def generate_report():
    output_path = os.path.join(os.path.dirname(__file__), "curriculum_summary.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(CURRICULUM_MATRIX, f, ensure_ascii=False, indent=2)
    print(f"Currículum pedagógico estructurado y guardado en: {output_path}")

if __name__ == "__main__":
    generate_report()
