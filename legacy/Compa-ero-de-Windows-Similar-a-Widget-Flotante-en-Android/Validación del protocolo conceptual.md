# Validación del protocolo conceptual

## Alcance validado

La validación se ejecutó exclusivamente con cálculos deterministas y datos sintéticos. No se consultaron fuentes externas, no se usaron archivos de usuario y no se hicieron acciones reales.

| Prueba | Resultado | Evidencia |
|---|---|---|
| Repetición Monte Carlo | Superada | Mismos parámetros y semilla generan la misma salida completa. |
| Orden estadístico | Superada | Se comprueba que P10 ≤ P50 ≤ P90 y que la probabilidad está dentro de 0–100 %. |
| Escenarios | Superada | Los tres escenarios calculan correctamente sus valores porcentuales. |
| Entradas inválidas | Superada | El modelo rechaza incertidumbre negativa y variaciones fuera del dominio. |
| Cifrado e integridad | Superada | La bóveda se descifra con su clave; otra clave o una alteración fallan. |
| Trazabilidad cifrada | Superada | El estado y las comprobaciones del protocolo sobreviven el ciclo de cifrado/descifrado. |
| Estabilidad conceptual | Superada | Un Monte Carlo de 4.000 iteraciones recibe «estable en el modelo». |
| Muestra insuficiente | Superada | Un Monte Carlo de 500 iteraciones se etiqueta «frágil en el modelo». |
| Sensibilidad alta | Superada | Un caso de varianza extrema falla la comprobación de perturbación local. |
| No evaluable | Superada | Una entrada no numérica se clasifica como «no evaluable». |

## Resultado

El protocolo distingue entre un modelo coherente bajo sus propios supuestos, uno frágil y uno que no puede interpretarse. La aplicación conserva el detalle de cada chequeo junto al experimento dentro de la bóveda cifrada.

> Esta validación es de software y de coherencia conceptual. No verifica una hipótesis sobre el mundo real, ni convierte una simulación en evidencia empírica.
