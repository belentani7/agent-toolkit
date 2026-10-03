# Acompañante

Prototipo de escritorio para Windows. Registra ideas de investigación por temas, formula hipótesis y ejecuta **solo simulaciones matemáticas sobre datos sintéticos**. Su interfaz organiza el recorrido en captura, profundización, resultados y propuesta de escala, con un widget flotante discreto.

## Garantías del prototipo

| Garantía | Implementación actual |
|---|---|
| Local primero | La aplicación inicia y funciona sin conexión. |
| Cifrado | Bóveda completa cifrada con AES-256-GCM; su clave se protege mediante el mecanismo del usuario de Windows. |
| Sin red por defecto | La política de contenido bloquea conexiones y el código no contiene solicitudes HTTP. |
| Sin ejecución externa | No abre terminales, no ejecuta código arbitrario ni automatiza otras aplicaciones. |
| Solo matemático | Incluye Monte Carlo reproducible y escenarios deterministas con valores sintéticos. |
| Decisión humana | La propuesta de escala es un borrador: no lanza pruebas, compras, mensajes ni cambios reales. |

> Las simulaciones son herramientas de razonamiento. Sus resultados **no prueban comportamiento real** y no constituyen decisiones finales.

## Funciones

La ventana principal sigue cuatro pasos: **Notas**, **Hipótesis**, **Simulación** y **Propuesta**. El widget siempre visible permite anotar una señal corta en el tema seleccionado. Todos los elementos se guardan en la bóveda local.

| Módulo | Acción |
|---|---|
| Temas | Crea áreas de investigación separadas. |
| Notas | Captura observaciones e ideas con rapidez. |
| Hipótesis | Define una relación y la variable objetivo. |
| Monte Carlo | Explora incertidumbre con una semilla local repetible. |
| Escenarios | Compara variaciones porcentuales frente a una línea base. |
| Propuestas | Documenta un futuro piloto real sin iniciarlo. |
| Protocolo conceptual | Evalúa entradas, repetición, salida finita, tamaño, coherencia y perturbación del 5 %. |

## Ejecutar en Windows

Instala Node.js LTS en Windows y abre una terminal dentro de la carpeta del proyecto.

```powershell
npm install
npm run start
```

Para generar un instalador de Windows:

```powershell
npm run package:win
```

El resultado aparecerá en `dist/`. La aplicación crea su bóveda local bajo el directorio de datos de la aplicación de Windows. No copies los archivos de la bóveda mientras la aplicación esté abierta.

## Validar modelos matemáticos

```powershell
node --check src/main.js
node --check src/preload.js
node --check src/renderer.js
node --check src/simulations.js
node tests/simulations.test.js
```

Las pruebas verifican repetibilidad con semilla, orden estadístico básico, cálculo de escenarios, rechazo de entradas fuera de rango, cifrado autenticado y los estados «estable», «frágil» y «no evaluable» del protocolo conceptual.

## Estructura

```text
src/
  main.js          Proceso principal, bóveda local e IPC limitado
  preload.js       Superficie mínima entre interfaz y proceso principal
  simulations.js    Modelos matemáticos puros y reproducibles
  vault-crypto.js   Cifrado autenticado de la bóveda
  protocol.js       Evaluación de pruebas conceptuales y estabilidad
  renderer.js       Interfaz y flujos manuales
  styles.css        Diseño local sin recursos remotos
  index.html        Política de contenido sin conexiones
  preview.html      Vista previa local con datos sintéticos

tests/
  simulations.test.js
  vault-crypto.test.js
  protocol.test.js

docs/
  ARQUITECTURA.md
  REVISION_VISUAL.md
  PROTOCOLO_CONCEPTUAL.md
  VALIDACION_PROTOCOLO.md
```

## Evolución recomendada

Primero, definir temas reales y validar que la captura y los experimentos resulten útiles. Después se puede añadir una base SQLite cifrada, bloqueo por tiempo, exportación manual cifrada y, solo si el usuario la habilita explícitamente, sincronización cifrada extremo a extremo. La sincronización no forma parte de este prototipo.

## Referencias técnicas

La arquitectura usa APIs documentadas de Electron para almacenamiento protegido por el sistema operativo y ventanas nativas [1]. En Windows, la capa de protección se basa en DPAPI, cuyo comportamiento depende del perfil local del usuario [2].

[1]: https://www.electronjs.org/docs/latest/api/safe-storage "Electron — safeStorage"
[2]: https://learn.microsoft.com/en-us/windows/win32/api/dpapi/nf-dpapi-cryptprotectdata "Microsoft Learn — CryptProtectData"
