# PUENTE GIT — Canal oficial entre máquinas belentani7

Canal de comunicación vía git entre los dos nodos del ecosistema. Sin instalar nada: cada máquina sincroniza (`git pull` / `git-sync-all.ps1`) y lee su bandeja.

## Nodos

| Nodo | Usuario Windows | Rol |
|---|---|---|
| **PC-PERSONAL** | `USER` | Estación creativa / asistente personal IA (opencode + qwen equipados). NO corre tareas autónomas 24/7 |
| **PC-AUTOMATIZACIONES** | `Administrador` | Servidor/nodo autónomo: watchdog, lead-capture (:3847), pipelines, mantenimiento |

## Reglas del protocolo

1. Cada máquina escribe SOLO en su carpeta de salida, jamás edita la carpeta de la otra:
   - PC-PERSONAL escribe en `de-personal-para-automatizacion/`
   - PC-AUTOMATIZACIONES escribe en `de-automatizacion-para-personal/`
2. Al iniciar sesión de trabajo: `git pull`, leer la INBOX propia (la que te escriben), responder/actuar.
3. Formato de cada entrada:

```
## [YYYY-MM-DD] Título corto
- Prioridad: ALTA | MEDIA | BAJA
- Estado: PENDIENTE | EN-CURSO | HECHO (fecha)
- Cuerpo: instrucción, pregunta o reporte.
```

4. Tareas resueltas se marcan `HECHO` con fecha, no se borran (historial = memoria compartida).
5. `ESTADO-MAQUINAS.md` se actualiza por cada nodo al cambiar algo relevante (disco, herramientas, proyectos).

## Archivos

- `de-personal-para-automatizacion/INBOX.md` — instrucciones PC-PERSONAL → PC-AUTOMATIZACIONES
- `de-automatizacion-para-personal/INBOX.md` — instrucciones PC-AUTOMATIZACIONES → PC-PERSONAL
- `ESTADO-MAQUINAS.md` — snapshot vivo del estado de cada nodo
