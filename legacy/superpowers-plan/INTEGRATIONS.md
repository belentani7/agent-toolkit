# Integraciones verificadas

## GitHub

La identidad de GitHub de la sesión está autenticada y el repositorio oficial `obra/superpowers` fue clonado en `vendor/superpowers` con commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`. El repositorio declara licencia MIT y se conserva como referencia metodológica auditada; no se ejecutan sus hooks ni se instalan plugins en el entorno del producto. El pipeline de la aplicación usa la API REST de GitHub y admite `GITHUB_TOKEN` como variable de entorno para elevar límites y acceder a repositorios autorizados. Sin esa variable, la aplicación debe fallar de forma explícita y no inventar sincronizaciones.

## Supabase

No hay un conector Supabase habilitado en la configuración de esta sesión y el command center actual usa Drizzle/MySQL. No se presenta Supabase como activo. La integración futura debe entrar mediante un adaptador explícito para Postgres/pgvector, health check y migración independiente; requiere URL y credenciales aportadas por el usuario o una conexión habilitada.

## Hugging Face

No hay un conector Hugging Face habilitado en la configuración de esta sesión. No se descargan modelos ni se afirma inferencia activa. La integración futura debe aislar modelo, endpoint, versión, timeout, coste y fallback; requiere token o endpoint autorizado. El producto seguirá mostrando estado pendiente hasta que el health check valide la conexión.

## Google Drive/Gmail

No hay coincidencias activas en la configuración de conectores inspeccionada. El importador de metadata de Drive existente acepta exports proporcionados por el usuario y excluye categorías sensibles; no equivale a una conexión viva. No se lee Gmail ni Drive sin una integración autenticada y explícita.
