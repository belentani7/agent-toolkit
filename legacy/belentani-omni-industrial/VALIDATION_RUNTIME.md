# Validación de runtime BELENTANI OMNI

- El servidor `tsx server.ts` arranca correctamente en el puerto 3000.
- `/api/health` devuelve `ok: true`, versión `2.1.0-omni` y uptime.
- `/api/omni/capabilities` devuelve las cinco capacidades limitadas del runtime.
- La ruta `/omni` renderiza correctamente la navegación, consola de autonomía, controles de pausa/parada, modo seguro, capacidades, memoria vectorial, interoperabilidad, diagnóstico y registro.
- El diagnóstico visible reporta 100%, conectividad disponible, almacenamiento local disponible y backend disponible.
- El banner de cookies aparece correctamente para el primer acceso.
- La compilación y la comprobación TypeScript pasan sin errores en el último ciclo de validación.

La prueba de interacción confirmó que el botón «Comprobación de salud» está expuesto como control accesible en la consola OMNI y que la interfaz permanece estable al activarlo.

Durante la primera navegación final a `/omni`, el navegador mostró una pantalla vacía sin elementos detectables. El servidor seguía activo y entregaba HTML correctamente; se inició una revisión adicional de carga de assets y errores de runtime.

La pantalla vacía no provenía del servidor: el DOM tenía `#root` vacío y el navegador cargaba un bundle antiguo (`index-BX_X4Sgz.js`) aunque `dist/index.html` ya apuntaba a `index-KCeTt94x.js`. El service worker `belentani-omni-shell-v1` estaba cacheando `/index.html`; se debe invalidar el caché al actualizar la versión del shell.

Tras versionar el service worker a `belentani-omni-shell-v2` y usar network-first para HTML, `/omni` volvió a renderizar correctamente. La navegación mostró el skip link, selector ES/EN/PT y controles OMNI. La selección de EN cambió los textos de navegación a inglés sin romper la consola.
