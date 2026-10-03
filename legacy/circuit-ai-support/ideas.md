# CIRCUIT AI Support — Dirección visual

## Tres enfoques explorados

### Enfoque 1 — Agua negra
Una interfaz de consultoría premium basada en oscuridad precisa, líneas de circuito y luz ámbar como señal. La información se presenta como un sistema vivo, sobrio y técnico.

**Probabilidad:** 0.07

### Enfoque 2 — Archivo operativo
Un lenguaje editorial claro, casi de informe técnico: papel cálido, tipografía monoespaciada, diagramas y una navegación lateral. La sensación es la de abrir un expediente de diagnóstico bien ordenado.

**Probabilidad:** 0.04

### Enfoque 3 — Sala de control
Una interfaz de dashboard compacta, con paneles de estado, métricas y colas de revisión. El tono es operativo y directo, pensado para decidir rápido sin parecer una aplicación SaaS genérica.

**Probabilidad:** 0.09

## Enfoque elegido: Archivo operativo

### Movimiento de diseño
Editorial brutalism refinado aplicado a una herramienta de consultoría: jerarquía tipográfica fuerte, retícula asimétrica, textura de papel oscuro y trazos de diagrama como estructura narrativa.

### Principios
1. La evidencia va antes que el entusiasmo: cifras, criterios y fuentes visibles.
2. La interfaz debe parecer una página de trabajo, no una demo de IA.
3. El ámbar es una señal de acción o atención; el verde solo indica un estado resuelto.
4. Las plantillas se muestran como piezas editables de un sistema, no como texto decorativo.

### Filosofía cromática
El negro circuito crea concentración y confianza; el blanco papel mantiene legibilidad en bloques densos; el ámbar señal marca nodos y decisiones; el verde flujo confirma controles o pasos aprobados. Se evita el color por decoración.

### Paradigma de layout
Un lienzo asimétrico: navegación lateral fija, columna editorial principal y paneles de evidencia que entran desde el margen. Las comparativas usan líneas, tableros y bandas de datos en lugar de tarjetas uniformes.

### Elementos distintivos
- Línea vertical de circuito con nodos numerados.
- Etiquetas monoespaciadas de diagnóstico (`MODELO`, `CANAL`, `REVISIÓN`).
- Panel de conversación que muestra el salto de mensaje entrante a borrador revisable.

### Filosofía de interacción
Cada interacción debe responder a una pregunta: cambiar de modelo, abrir una plantilla, alternar chat/correo o revisar un guardrail. Los botones muestran estado y consecuencias; no hay acciones ficticias de envío.

### Animación
Transiciones cortas y discretas: 160–240 ms para paneles, opacidad y desplazamiento mínimo. Los nodos de la línea se iluminan al recorrer secciones. Se respeta `prefers-reduced-motion` y no se usan animaciones que oculten contenido.

### Tipografía
Titulares: Space Grotesk, peso 600–700. Cuerpo: Inter, 400–500. Datos, etiquetas y código: JetBrains Mono, 11–13 px con tracking amplio. Los titulares se rompen en dos líneas para crear ritmo editorial.

### Esencia de marca
CIRCUIT convierte la atención al cliente asistida por IA en un circuito controlable: más rápido para lo repetitivo, más humano en lo delicado y auditable en cada paso.

**Personalidad:** preciso, humano, sobrio.

### Voz de marca
Los titulares son directos y sin hype. Las CTAs describen la acción. El microcopy distingue claramente entre sugerir, revisar y enviar.

Ejemplos: “Responde rápido. Decide con criterio.” / “Abrir una plantilla de correo”.

### Wordmark y logo
El wordmark usa CIRCUIT en mayúsculas con la “U” tratada como un nodo cuadrado abierto, acompañado de una línea de entrada y salida. El símbolo compacto es un nodo ámbar dentro de un marco negro.

### Color de marca
**Ámbar señal — `#E8A838`**, reservado para nodos activos, llamadas a la acción y puntos donde el sistema pide atención humana.

## Recordatorio de implementación
La página es un informe interactivo estático. Las integraciones de producción (OAuth, Gmail API, Pub/Sub, backend, proveedor de LLM) se describen y se comparan, pero no se simulan como si estuvieran conectadas.
