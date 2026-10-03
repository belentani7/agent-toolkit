# Belentani — Dirección de diseño

## Tres rutas estilísticas consideradas

### Theme Name: Obsidian Workbench
Very Brief Intro: Una estación de trabajo oscura y precisa, inspirada en consolas de ingeniería y herramientas de sistemas. El cobre eléctrico aporta foco sin caer en el neón genérico.
Probability: 0.07

### Theme Name: Paper Compiler
Very Brief Intro: Un IDE claro, editorial y casi arquitectónico, con paneles blancos cálidos, tinta negra y acentos rojos de revisión. La sensación es de cuaderno técnico convertido en herramienta.
Probability: 0.03

### Theme Name: Field Manual
Very Brief Intro: Una interfaz de operaciones con verde pino, crema y amarillo señal, inspirada en manuales de campo y equipos robustos. Comunica autonomía y control físico.
Probability: 0.09

## Enfoque elegido: Obsidian Workbench

### Design Movement
Neo-industrial minimalism: una mezcla de terminal profesional, panel de instrumentación y taller de software. No intenta simular una conversación con una IA; presenta el trabajo como un sistema observable y controlable.

### Core Principles
1. Cada acción debe dejar una huella visible: estado, diff, permiso o resultado.
2. La densidad sirve a la tarea: compacta en navegación y terminal, generosa en el área de decisión.
3. La jerarquía se construye con tipografía, líneas de señal y contraste, no con tarjetas redondeadas por defecto.
4. Belentani se siente local: sin badges de nube, sin proveedores, sin magia opaca.

### Color Philosophy
El fondo carbón reduce fatiga y hace que el editor sea el centro. El marfil verdoso mantiene legibilidad prolongada. El cobre eléctrico (#E28B4B) es el color propio de Belentani: marca operaciones, cambios y puntos de atención. El verde musgo señala disponibilidad local, mientras el rojo óxido solo aparece en riesgos y bloqueos.

### Layout Paradigm
Workbench asimétrico de tres zonas: rail estrecho de navegación, explorador contextual y una superficie central dividida entre editor y consola. El encabezado funciona como barra de estado, no como hero. En móvil, las zonas laterales se convierten en drawers y la superficie central permanece prioritaria.

### Signature Elements
- Un monograma geométrico B construido con dos corchetes y una línea de circuito.
- Líneas finas de cobre que actúan como guías de selección y separadores.
- Etiquetas de estado en mayúsculas pequeñas con indicadores cuadrados, nunca píldoras excesivas.

### Interaction Philosophy
La interacción es explícita y reversible. Los botones muestran qué van a cambiar. Las operaciones potencialmente peligrosas pasan por una bandeja de aprobación. Hover revela contexto; click confirma; undo mantiene el control.

### Animation
Transiciones de 160–220 ms con entrada por opacidad y desplazamiento de 4 px. Los cambios de panel no rebotan. Los estados de ejecución usan un pulso sutil en el indicador, nunca un spinner permanente. Se respeta reduced-motion y los atajos de teclado son instantáneos.

### Typography System
Display: Space Grotesk, 600–700, para marca y títulos cortos. UI: IBM Plex Sans, 400–600, para navegación y estados. Código: IBM Plex Mono, 400–500, para editor, terminal y rutas. Los títulos usan tracking negativo moderado; las etiquetas usan tracking amplio y mayúsculas.

### Brand Essence
Belentani es el taller local para construir, revisar y ejecutar software sin depender de un modelo, una API o una nube; para personas que quieren ver y controlar cada operación. Personalidad: sobria, ingeniosa, autónoma.

### Brand Voice
Los titulares son directos y operativos; las CTAs describen la acción real. El microcopy explica límites sin dramatismo.

Ejemplo 1: “Tu proyecto. Tus reglas. Cada cambio visible.”

Ejemplo 2: “Preparar ejecución” en lugar de “Empezar ahora”.

### Wordmark & Logo
El símbolo es una B modular formada por dos corchetes angulares enfrentados, con un pequeño corte horizontal que evoca una línea de código. El wordmark usa Space Grotesk semibold con una alteración manual en la “e” para recordar un prompt de terminal.

### Signature Brand Color
Cobre eléctrico — `#E28B4B`, reservado para acciones, foco y cambios verificables.

## Style Decisions

- El monograma siempre debe leerse como una B modular construida con corchetes y una línea de circuito; no usar un glifo abstracto encerrado que parezca una I o un icono genérico.
- La interfaz de usuario permanece en español y con verbos operativos; el inglés queda reservado para código, rutas, tokens de protocolo y abreviaturas de sistema.
- El cobre `#E28B4B` es la traza de trabajo de Belentani: aparece en selección activa, cambios pendientes, acciones ejecutables y foco de operaciones verificables.
- El panel derecho es la superficie de decisión: allí se agrupan estado, operación preparada y aprobación antes de ejecutar.
- El estado de primera carga se expresa como preparación y permiso local, nunca como una etiqueta de depuración o una función ausente.
- La superficie central conserva una trama técnica sutil y metadatos de ruta para hacer visible el sistema incluso antes de abrir un archivo.
