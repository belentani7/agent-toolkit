# Arquitectura del acompañante de investigación para Windows

**Versión:** prototipo local-primero

## Propósito

El producto es un acompañante de escritorio discreto. Permite capturar notas de investigación por temas, transformar cada nota en una hipótesis explícita, ejecutar una simulación matemática sobre datos sintéticos y registrar una propuesta de aplicación futura. No consulta la web, no controla software externo y no ejecuta pruebas sobre recursos reales.

> **Ciclo principal:** nota → hipótesis → parámetros sintéticos → simulación matemática → conclusión limitada → propuesta de escala.

La estructura de experiencia toma como referencia el patrón de Reflection —promesa directa, entrada corta, módulos de profundización, vistas de hallazgos y privacidad visible— sin reutilizar su marca, texto ni activos [1].

## Límites de seguridad

| Área | Permitido | Prohibido |
|---|---|---|
| Datos | Texto introducido por el usuario y números sintéticos | Datos reales, archivos no seleccionados, telemetría |
| Cálculo | Estadística descriptiva, Monte Carlo, sensibilidad y escenarios | Acciones físicas, financieras o de producción |
| Red | Ninguna conexión por defecto | Sincronización, carga, descarga, analítica y peticiones ocultas |
| Ejecución | Operaciones deterministas empaquetadas | Shell, código arbitrario, complementos y ejecutables externos |
| Decisión | Hipótesis, resultados y propuesta editable | Recomendaciones automáticas o implementación sin revisión |

## Modelo de privacidad

La aplicación se ejecuta offline. El prototipo usa una bóveda local cifrada completa con AES-256-GCM; una evolución posterior puede migrarla a SQLite manteniendo el mismo contrato criptográfico. La clave de datos se genera localmente, se guarda protegida por el mecanismo de protección del usuario de Windows y nunca se muestra en texto claro. En Electron, `safeStorage` usa DPAPI en Windows; la documentación indica que normalmente solo las credenciales del mismo usuario pueden descifrarlo en el mismo equipo [2]. Windows DPAPI documenta además que añade una comprobación de integridad autenticada al contenido protegido [3].

| Elemento | Diseño |
|---|---|
| Bóveda del prototipo | Archivo local cifrado en el perfil de aplicación; no sincronizado |
| Campos cifrados | Nota, hipótesis, resultados narrativos, propuesta de escala |
| Clave de datos | Clave aleatoria de 256 bits; envoltura local con `safeStorage`/DPAPI |
| Datos no sensibles | Fecha, identificador aleatorio, estado y versión de esquema |
| Bloqueo | Bloqueo manual; al reabrir, se verifica disponibilidad de cifrado antes de acceder a notas |
| Copia de seguridad | Exportación manual cifrada; desactivada en el primer prototipo |
| Sincronización futura | Módulo separado, apagado por defecto; paquete cifrado extremo a extremo y consentimiento previo |

No se declarará un nivel de protección superior a la protección del propio perfil de Windows. Una aplicación que se ejecute con la misma sesión de Windows del usuario no queda aislada por DPAPI de la misma manera que otro usuario del sistema [2].

## Aplicación de escritorio

Se utilizará Electron con una ventana principal y un widget auxiliar. La ventana principal sirve para explorar los temas y escribir; el widget brinda captura y consulta rápida. `BrowserWindow` permite crear una ventana separada y controlar su comportamiento visual; la configuración se mantendrá con aislamiento de contexto, sin integración directa de Node en el contenido de interfaz y con el renderizador en modo sandbox [4].

| Superficie | Tamaño inicial | Función | Comportamiento |
|---|---:|---|---|
| Widget flotante | 360 × 164 px | Tema actual, nota rápida, acceso a detalle | Sin bordes, baja opacidad, visible sobre ventanas normales, movible y plegable |
| Ventana principal | 1180 × 780 px | Investigación, simulaciones y propuestas | Vista completa, sin navegación remota |
| Ajustes | Panel dentro de la ventana | Privacidad, apariencia y exportación | Sin opciones de automatización ni red en la primera versión |

El widget debe desaparecer visualmente cuando pierde foco y reaparecer por una acción explícita del usuario, manteniendo accesibilidad mediante bandeja del sistema y atajo configurable. Persistente no significa intrusivo: no tapa la pantalla, no muestra anuncios ni genera avisos automáticos.

## Entidades de dominio

| Entidad | Campos clave | Relación |
|---|---|---|
| Tema | id, nombre, color, estado, fecha | Agrupa notas, hipótesis y experimentos |
| Nota | id, temaId, cuerpo cifrado, etiquetas, fecha | Material de investigación capturado por usuario |
| Hipótesis | id, temaId, formulación cifrada, variable objetivo, estado | Punto de partida de cada experimento |
| Experimento | id, hipótesisId, método, parámetros cifrados, semilla, versión | Una simulación matemática reproducible |
| Resultado | id, experimentoId, métricas cifradas, interpretación cifrada | Salida limitada a datos sintéticos |
| Propuesta | id, temaId, resumen cifrado, supuestos, riesgos, siguiente revisión | Puente editable hacia una escala real futura |

## Experimentos matemáticos permitidos

| Método | Pregunta que responde | Entrada sintética | Resultado registrado |
|---|---|---|---|
| Escenario determinista | ¿Qué pasa si cambian dos o tres supuestos? | Valores definidos manualmente | Tabla de escenarios y variación porcentual |
| Monte Carlo | ¿Qué tan sensible es el resultado a la incertidumbre? | Distribuciones definidas por usuario y semilla local | Percentiles, probabilidad de umbral y resumen |
| Sensibilidad univariable | ¿Qué parámetro domina el modelo? | Rango y paso de una variable | Tornado simple y ranking de influencia |
| Simulación de cola | ¿Qué capacidad teórica requeriría un flujo? | Llegadas y servicio sintéticos | Tiempo medio, percentiles y utilización simulada |
| Comparación multicriterio | ¿Qué alternativa puntúa mejor bajo pesos explícitos? | Matriz de puntuaciones y pesos | Puntuación normalizada y análisis de peso |

Cada resultado mostrará el aviso: **«Resultado sintético: no demuestra comportamiento real ni debe usarse como decisión final.»**

## Flujo de usuario

| Paso | Interacción | Salida |
|---:|---|---|
| 1 | El usuario elige o crea un tema | Espacio de investigación local |
| 2 | Captura una nota desde widget o ventana | Registro cifrado y etiquetado |
| 3 | Convierte la idea en una hipótesis | Hipótesis editable y acotada |
| 4 | Selecciona método matemático y parámetros | Vista previa de modelo y advertencias |
| 5 | Pulsa «Ejecutar simulación» | Resultado reproducible con semilla local |
| 6 | Escribe una interpretación | Conclusión limitada y supuestos claros |
| 7 | Genera propuesta de escala manual | Plan editable: validación real, recursos, riesgos y criterio de salida |

## Puente a escala real

La propuesta de escala no ejecuta nada. Produce una ficha editable con: objetivo, hipótesis a validar con datos reales, diseño de piloto, población o muestra, métricas, umbrales de éxito, riesgos, responsables, presupuesto estimado y decisión de continuar/detener. La etapa real solo puede comenzar fuera de la app, después de revisión humana y cumplimiento aplicable.

## Criterios de aceptación del prototipo

1. El usuario puede crear, editar y eliminar temas, notas, hipótesis y propuestas solo en almacenamiento local.
2. La nota rápida del widget no abre ninguna conexión ni lanza procesos externos.
3. Cada simulación acepta solo números ingresados por el usuario o generados localmente, y conserva una semilla para repetición.
4. La app explica variables, supuestos y límites antes de ejecutar un modelo.
5. El contenido sensible no aparece sin descifrado local válido.
6. El tráfico de red no es requerido para iniciar, capturar, simular ni consultar el historial.
7. La interfaz replica la secuencia de producto de la referencia: entrada simple, profundización modular, hallazgos y privacidad; no reproduce su identidad visual ni sus activos.

## Referencias

[1]: https://www.reflection.app/ "Reflection — página principal"
[2]: https://www.electronjs.org/docs/latest/api/safe-storage "Electron — safeStorage"
[3]: https://learn.microsoft.com/en-us/windows/win32/api/dpapi/nf-dpapi-cryptprotectdata "Microsoft Learn — CryptProtectData"
[4]: https://www.electronjs.org/docs/latest/api/browser-window "Electron — BrowserWindow"

## Protocolo conceptual integrado

Al terminar una simulación, el proceso local ejecuta un protocolo que se guarda dentro del experimento. El veredicto visible no sustituye la interpretación humana.

| Veredicto | Regla de la aplicación | Significado limitado |
|---|---|---|
| Estable en el modelo | Pasan entradas válidas, repetición, salidas finitas, tamaño mínimo, coherencia y perturbación local | El cálculo se conserva bajo sus propios supuestos |
| Frágil en el modelo | Falla una comprobación no crítica, como tamaño conceptual o perturbación | Se deben ajustar el modelo o sus rangos antes de elaborar una propuesta |
| No evaluable | Fallan datos válidos, repetición, salida finita o la ejecución del protocolo | No se debe interpretar el resultado |

La perturbación consiste en una variación controlada del 5 % de un parámetro interno; evalúa sensibilidad del modelo, no una magnitud física o económica real. El detalle completo está en `docs/PROTOCOLO_CONCEPTUAL.md`.
