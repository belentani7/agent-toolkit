# Revisión visual — ventana principal

## Estado revisado

Se cargó `src/preview.html` con datos estrictamente sintéticos. La vista se presentó sin requerir conexiones de red.

| Área | Resultado |
|---|---|
| Jerarquía | La promesa principal, el contexto del tema y la captura rápida se distinguen antes del contenido histórico. |
| Estructura | La barra lateral organiza temas; el recorrido central queda separado en Notas, Hipótesis, Simulación y Propuesta. |
| Privacidad | El indicador «Cifrado local / sin red por defecto» es visible en la cabecera. |
| Acción primaria | La captura de una señal y el botón para guardarla son visibles de inmediato. |
| Densidad visual | Diseño ligero, amplio y sin componentes de red, publicidad ni avisos automáticos. |
| Ajuste pendiente | En una pantalla estrecha, el texto de algunos temas largos se reduce. La ventana principal de producción tendrá mínimo de 940 px; el nombre de tema se limitará a 80 caracteres. |

## Conclusión

La composición cumple el objetivo de ser discreta y editorial, tomando de la referencia el patrón de entrada simple, profundización por módulos e indicadores de privacidad, sin copiar su marca o activos.

## Validación funcional de navegación

Se verificó que el recorrido abre la etapa **Simulación** y que permite alternar entre los métodos **Incertidumbre** y **Escenarios**. La alternativa de incertidumbre presenta valor base, desviación, umbral e iteraciones; la de escenarios muestra línea base y tres variaciones porcentuales. Ambas mantienen el aviso visible de que no se usan datos reales ni conexiones externas.

## Revisión visual — protocolo conceptual

La ficha de resultado muestra el estado **«Estable en el modelo»**, la cuenta de comprobaciones aprobadas y un desplegable con seis verificaciones: entradas, repetición, salida finita, tamaño conceptual, coherencia y perturbación local. Los límites interpretativos permanecen visibles: resultado sintético, estabilidad restringida al modelo y necesidad de revisión humana antes de un piloto.
