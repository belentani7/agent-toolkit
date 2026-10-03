---
name: deep-research
description: Investigación profunda y autónoma sobre cualquier tema. Paraleliza búsquedas, sintetiza fuentes, genera reportes con citas. Usa para preguntas que requieren múltiples fuentes y análisis profundo.
---

# Deep Research - Investigación Autónoma

## Flujo de Investigación
```
Pregunta del usuario
    ↓
┌─────────────────────────────────────┐
│  1. PLANIFICAR                      │
│  - Descomponer en sub-preguntas     │
│  - Identificar fuentes necesarias   │
│  - Crear plan de investigación      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  2. INVESTIGAR (paralelo)           │
│  - Subagent 1: Fuentes primarias   │
│  - Subagent 2: Fuentes secundarias │
│  - Subagent 3: Datos/recursos      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  3. SINTETIZAR                      │
│  - Cruzar fuentes                  │
│  - Identificar consenso/conflicto  │
│  - Generar insights                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  4. REPORTAR                        │
│  - Estructura clara                │
│  - Citas verificadas               │
│  - Conclusiones accionables        │
└─────────────────────────────────────┘
    ↓
Reporte completo
```

## Template de Reporte
```markdown
# [Tema de Investigación]

## Resumen Ejecutivo
[2-3 parágrafos con los hallazgos principales]

## Metodología
- Fuentes consultadas: [lista]
- Período de investigación: [fechas]
- Criterios de inclusión: [criterios]

## Hallazgos Principales

### 1. [Hallazgo 1]
[Detalle con citas]

### 2. [Hallazgo 2]
[Detalle con citas]

### 3. [Hallazgo 3]
[Detalle con citas]

## Análisis Comparativo
| Aspecto | Opción A | Opción B | Opción C |
|---------|----------|----------|----------|
| ... | ... | ... | ... |

## Recomendaciones
1. [Recomendación 1]
2. [Recomendación 2]
3. [Recomendación 3]

## Fuentes
- [Fuente 1](url)
- [Fuente 2](url)
```

## Ejecución
```python
async def deep_research(question, depth="standard"):
    """Ejecuta investigación profunda"""
    
    # 1. Planificar
    plan = await plan_research(question)
    
    # 2. Investigar en paralelo
    results = await asyncio.gather(*[
        research_source(source) for source in plan.sources
    ])
    
    # 3. Sintetizar
    synthesis = synthesize_results(results)
    
    # 4. Generar reporte
    report = generate_report(synthesis, plan)
    
    return report
```

## Calidad de Fuentes
```python
SOURCE_PRIORITY = {
    "primary": ["docs oficiales", "papers peer-reviewed", "docs técnicas"],
    "secondary": ["blogs técnicos", "documentación de herramientas", "tutoriales"],
    "tertiary": ["foros", "stackoverflow", "reddit"],
}

def evaluate_source(url, content):
    """Evalúa la confiabilidad de una fuente"""
    score = 0
    
    # Dominio confiable
    if any(d in url for d in ["github.com", "docs.", "arxiv.org"]):
        score += 30
    
    # Contenido reciente
    if is_recent(content):
        score += 20
    
    # Tiene citas/referencias
    if has_citations(content):
        score += 20
    
    # Autor verificable
    if has_author(content):
        score += 15
    
    return score
```
