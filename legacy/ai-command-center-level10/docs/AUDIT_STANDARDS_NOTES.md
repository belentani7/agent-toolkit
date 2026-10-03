# Fuentes oficiales para la auditoría estricta

## OWASP ASVS

La página oficial de OWASP define ASVS como una base para probar controles técnicos de seguridad de aplicaciones web y como una lista de requisitos para el desarrollo seguro. La página identifica la versión estable 5.0.0. En la auditoría se usa para verificar validación de entradas, prevención de inyección, autenticación, autorización, manejo de secretos y exposición de servicios. Fuente: https://owasp.org/www-project-application-security-verification-standard/

## WCAG 2.2

W3C publica WCAG 2.2 como recomendación. La auditoría usa sus criterios de teclado, ausencia de trampas de foco, foco visible, contraste, reflujo, tamaño de objetivos, etiquetas y compatibilidad robusta como criterios de frontend. Fuente: https://www.w3.org/TR/WCAG22/

## Limitación metodológica

La auditoría local puede demostrar compilación, tipado, tests, revisión estática, políticas de seguridad y pruebas de integración del companion. No puede demostrar por sí sola experiencia real de usuarios, métricas de campo de Core Web Vitals, disponibilidad permanente de proveedores externos ni escalabilidad para millones de usuarios. Esos puntos deben quedar como no demostrados o medirse en un entorno de producción independiente.

## Evidencia del preview y rendimiento

El preview muestra una navegación clara con cinco módulos, estados honestos para Odysseus/OpenClaw/Aider, enlaces externos, copiado de comandos y un panel Model bridge. La interfaz mantiene identidad visual consistente y declara que no controla procesos del equipo desde la web.

La compilación produce un bundle JavaScript principal de aproximadamente 728 kB sin comprimir y Vite emite una advertencia de chunk superior a 500 kB. Por ello no es válido afirmar 10/10 en rendimiento extremo todavía: debe aplicarse code splitting o justificar el tamaño con mediciones. Web.dev define LCP, CLS e INP como métricas Core Web Vitals y recomienda medir calidad de experiencia con datos de campo o herramientas de medición, no solo con el resultado del build. Fuente: https://web.dev/articles/vitals

## Dependencias: bloqueo de aprobación

La ejecución de `pnpm audit --prod --audit-level high` reporta 72 avisos: 8 low, 47 moderate y 17 high, sin critical. Entre los módulos afectados aparecen axios, drizzle-orm, lodash, mermaid, dompurify, form-data, uuid, qs y body-parser, con varias rutas transitivas. La auditoría no puede otorgar 10/10 en seguridad o entrega mientras los avisos de producción sigan sin resolver o sin una justificación de riesgo documentada y comprobada.

Los avisos se almacenaron en `/tmp/ai-command-center-pnpm-audit.json` durante la auditoría. Este archivo temporal no forma parte de la distribución.
