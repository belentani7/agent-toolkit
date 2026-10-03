---
name: graphify
description: Convierte cualquier codebase en un grafo de conocimiento queryable usando AST parsing. Elimina context rot, reduce tokens 70%, permite preguntas sobre la arquitectura del código. Ejecuta /graphify en cualquier proyecto.
---

# Graphify - Knowledge Graph for Codebases

## Qué hace
Toma tu codebase completo (código, docs, configs, SQL schemas) y lo convierte en un grafo de conocimiento consultable. Cada función, clase, import, y relación se extrae como nodo y arista del grafo.

## Por qué es revolucionario
- **Elimina context rot**: No necesitas re-leer archivos en cada sesión
- **Reduce tokens 70%**: Solo Consultas lo relevante, no archivos enteros
- **Preguntas arquitectónicas**: "¿Cómo se conecta el módulo A con B?"
- **Dependencies visuales**: Ve qué archivos dependen de qué

## Setup automático
```bash
# Instalar graphify
pip install graphify

# En cualquier proyecto:
graphify init

# Esto crea:
# .graphify/
# ├── graph.json      (el grafo de conocimiento)
# ├── metadata.json   (stats del proyecto)
# └── config.json     (configuración)
```

## Uso en MiMoCode

### Generar grafo de un proyecto
```python
import tree_sitter
from graphify import GraphBuilder

builder = GraphBuilder()
builder.scan_directory("./src")
graph = builder.build()

# Guardar grafo
graph.save(".graphify/graph.json")

# Consultar
results = graph.query("¿Qué funciones usan la base de datos?")
for node in results:
    print(f"{node.file}:{node.line} - {node.name}")
```

### Preguntas que puedes hacer
```
/graphify "¿Qué archivos dependen de database.py?"
/graphify "¿Qué rutas API existen?"
/graphify "¿Qué clases heredan de BaseModel?"
/graphify "¿Qué funciones son públicas vs privadas?"
/graphify "¿Cuál es el flujo de una petición HTTP?"
```

### Integración con workflows
```python
# Auto-graphify on save
def on_file_save(filepath):
    if filepath.endswith('.py'):
        builder.update_file(filepath)
        graph.save(".graphify/graph.json")

# Query from any skill
def get_relevant_context(query, graph, max_tokens=2000):
    nodes = graph.query(query)
    return format_nodes_for_context(nodes, max_tokens)
```

## Beneficios medidos
- **Tokens ahorrados**: 60-90% en sesiones de coding
- **Velocidad**: Respuestas 3x más rápidas (sin leer archivos innecesarios)
- **Precisión**: Elimina hallucinations sobre el codebase
- **Memoria**: Persiste entre sesiones (no se olvida del código)

## Archivos generados
```
.graphify/
├── graph.json          # El grafo completo
├── metadata.json       # Stats: files, functions, classes
├── config.json         # Configuración
├── queries/            # Consultas cacheadas
└── snapshots/          # Versiones del grafo
```
