---
name: workflow-orchestrator
description: Orquesta workflows complejos con múltiples subagentes. Paraleliza tareas independientes, maneja dependencias, y recoverea de fallos. Usa para tareas que requieren coordinación.
---

# Workflow Orchestrator - Multi-Agent Coordination

## Arquitectura
```
User Request
    ↓
┌─────────────────────────────────────┐
│         Orchestrator Agent          │
│  (planifica, coordina, monitorea)   │
└─────────────────────────────────────┘
    ↓           ↓           ↓
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Agent A │ │ Agent B │ │ Agent C │
│ (análisis)│ │(código) │ │(tests)  │
└─────────┘ └─────────┘ └─────────┘
    ↓           ↓           ↓
┌─────────────────────────────────────┐
│         Merge & Validate            │
└─────────────────────────────────────┘
    ↓
Result
```

## Patrones de Orquestación

### 1. Fan-Out (paralelo)
```python
async def parallel_workflow(tasks):
    """Ejecuta tareas independientes en paralelo"""
    results = await asyncio.gather(*[
        execute_task(task) for task in tasks
    ])
    return results
```

### 2. Pipeline (secuencial)
```python
async def pipeline_workflow(data, stages):
    """Ejecuta etapas en secuencia"""
    result = data
    for stage in stages:
        result = await stage.execute(result)
    return result
```

### 3. Map-Reduce
```python
async def map_reduce(items, map_fn, reduce_fn):
    """Mapea items en paralelo, reduce a resultado único"""
    mapped = await asyncio.gather(*[map_fn(item) for item in items])
    return reduce_fn(mapped)
```

### 4. DAG (dependencias)
```python
async def dag_workflow(tasks, dependencies):
    """Ejecuta tareas respetando dependencias"""
    completed = set()
    while len(completed) < len(tasks):
        ready = [t for t in tasks 
                 if t.id not in completed and 
                 all(d in completed for d in dependencies[t.id])]
        results = await asyncio.gather(*[t.execute() for t in ready])
        completed.update(t.id for t in ready)
    return results
```

## Manejo de Errores

### Retry con backoff
```python
async def retry_with_backoff(fn, max_retries=3, base_delay=1):
    for attempt in range(max_retries):
        try:
            return await fn()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt)
            await asyncio.sleep(delay)
```

### Fallback
```python
async def with_fallback(primary, fallback):
    try:
        return await primary()
    except Exception:
        return await fallback()
```

### Circuit Breaker
```python
class CircuitBreaker:
    def __init__(self, threshold=5, timeout=60):
        self.failures = 0
        self.threshold = threshold
        self.timeout = timeout
        self.state = "closed"
    
    async def call(self, fn):
        if self.state == "open":
            raise Exception("Circuit breaker is open")
        try:
            result = await fn()
            self.failures = 0
            return result
        except Exception as e:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "open"
            raise
```

## Métricas
- **Tiempo total**: Suma de tiempo paralelo (no secuencial)
- **Tasa de éxito**: % de tareas completadas sin retry
- **Costo tokens**: Tokens totales consumidos
- **Throughput**: Tareas completadas por minuto
