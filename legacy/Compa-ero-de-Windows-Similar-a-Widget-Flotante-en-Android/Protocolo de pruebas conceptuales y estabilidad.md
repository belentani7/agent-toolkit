# Protocolo de pruebas conceptuales y estabilidad

## Propósito

Este protocolo convierte un experimento matemático sintético en una prueba conceptual trazable. No intenta predecir la realidad: comprueba si una **idea está bien formulada y se mantiene coherente dentro del modelo declarado**.

> Una etiqueta de «estable en el modelo» significa que el resultado es reproducible, finito y poco sensible a una perturbación pequeña de sus propios parámetros. Nunca significa que la hipótesis se haya demostrado en el mundo real.

## Estructura obligatoria

| Etapa | Pregunta obligatoria | Registro local |
|---:|---|---|
| 1. Señal | ¿Qué observación o idea merece atención? | Nota cifrada vinculada a un tema |
| 2. Hipótesis | ¿Qué relación conceptual se quiere explorar? | Formulación y variable objetivo |
| 3. Modelo | ¿Qué cálculo sintético representa esa relación? | Monte Carlo o escenarios; parámetros y límites |
| 4. Invariantes | ¿Qué no debe romperse dentro del modelo? | Valores finitos, dominios válidos, semilla y método |
| 5. Prueba conceptual | ¿El cálculo es repetible y resiste una perturbación pequeña? | Comprobaciones y métricas de estabilidad |
| 6. Interpretación | ¿Qué dice y qué no dice el resultado? | Conclusión limitada y advertencia explícita |
| 7. Propuesta | ¿Cómo se validaría fuera del modelo en el futuro? | Borrador humano; no ejecutable desde la aplicación |

## Comprobaciones implementadas

| Comprobación | Criterio | Lectura correcta |
|---|---|---|
| Entradas válidas | Todos los números son finitos y están en el dominio permitido | El modelo está definido, no que sea realista |
| Reproducibilidad | La misma semilla y los mismos parámetros devuelven las mismas métricas | La ejecución es determinista dentro del modelo |
| Salida finita | Ninguna métrica contiene `NaN` o infinito | El cálculo no se degradó numéricamente |
| Tamaño conceptual suficiente | Monte Carlo: al menos 1.000 iteraciones; escenarios: al menos 2 alternativas | Hay material mínimo para comparar, no evidencia empírica |
| Perturbación local | Modificar un parámetro un 5 % conserva variaciones de salida bajo el umbral del modelo | El resultado no es excesivamente frágil ante un cambio pequeño |
| Coherencia estructural | Escenarios etiquetados y diferenciados; métricas ordenadas cuando corresponde | La representación interna es legible y consistente |

## Clasificación

| Estado | Condición | Acción sugerida dentro de la app |
|---|---|---|
| **Estable en el modelo** | Todas las comprobaciones requeridas pasan | Documentar supuestos y redactar propuesta de validación futura |
| **Frágil en el modelo** | Alguna prueba de perturbación o coherencia falla | Revisar hipótesis, rangos, unidades o método; no escalar |
| **No evaluable** | Faltan entradas, hay valores inválidos o no se puede reproducir | Corregir el modelo antes de interpretar cualquier salida |

## Regla de estabilidad

La estabilidad no se calcula como una verdad binaria basada en la predicción. Se deriva de una evaluación limitada:

\[
\text{estable dentro del modelo} = V \land R \land F \land M \land P \land C
\]

Donde \(V\) es la validez de entradas, \(R\) la reproducibilidad, \(F\) las salidas finitas, \(M\) el tamaño conceptual mínimo, \(P\) la resistencia a una perturbación del 5 %, y \(C\) la coherencia estructural.

La aplicación conserva cada veredicto, sus comprobaciones, los parámetros y la semilla junto al experimento. Así se puede revisar por qué una simulación fue clasificada de una forma concreta.

## Límites no negociables

El protocolo no consume datos reales, no navega, no llama a servicios, no ejecuta código externo y no decide acciones reales. Una propuesta de escala es un documento local editable con criterios para un piloto futuro, nunca una orden de implementación.
