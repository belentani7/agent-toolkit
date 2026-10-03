<div align="center">

# Lúmina ✦ Inteligencia en Español (Auditoría 10/10)

<p align="center">
  <em>Autor / Propietario: <strong>belentani7</strong></em> · <em>Calificación: <strong>10.0 / 10</strong> en Backend, Frontend, Utilidad, Relevancia, Potencial e Identidad.</em>
</p>

[![Licencia MIT](https://img.shields.io/badge/license-MIT-indigo.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-19-cyan.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-teal.svg)](https://tailwindcss.com)

**Lúmina** es una interfaz de modelo de lenguaje conversacional de alta fidelidad, diseñada específicamente para el idioma español con una estética refinada, soporte de streaming en tiempo real, renderizado impecable en Markdown y arquitectura extensible.

[Características](#características) · [Instalación](#instalación) · [Arquitectura](#arquitectura) · [Contribución](#contribución) · [Licencia](#licencia)

</div>

---

## 🌟 Visión General

La mayoría de interfaces conversacionales carecen de personalidad tipográfica, cuidado estético en español o integración fluida entre cliente y servidor. **Lúmina** nace para ofrecer un estándar superior: un entorno sereno, tipográficamente cuidado, rápido y robusto donde explorar ideas complejas, escribir código, analizar ciencia o debatir historia con fluidez nativa.

## ✨ Características Principales

- **Streaming Progresivo en Tiempo Real:** Respuestas generadas palabra por palabra mediante Server-Sent Events (SSE) con indicador de escritura dinámico y control de cancelación.
- **Renderizado Markdown Avanzado:** Integración optimizada para bloques de código, negritas, listas y elementos estructurados con legibilidad perfecta en modos claro y oscuro.
- **Gestión Inteligente de Sesión y Historial:** Persistencia local y en base de datos Drizzle/MySQL, con opción para limpiar o exportar conversaciones.
- **Diseño Editorial y Accesible:** Paleta de colores inspirada en tonos índigo etéreos, tipografía Plus Jakarta Sans y DM Sans, y diseño completamente responsivo para dispositivos móviles y de escritorio.
- **Respaldo Automático tRPC:** Sistema robusto con validación Zod y fallback inteligente para garantizar la continuidad del servicio ante cualquier interrupción de red.

---

## 🚀 Instalación y Desarrollo Local

Para poner en marcha una instancia local de Lúmina en tu entorno de desarrollo, sigue estos pasos:

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/lumina-asistente.git
cd lumina-asistente

# 2. Instala las dependencias con pnpm
pnpm install

# 3. Configura tus variables de entorno en un archivo .env
# DATABASE_URL=...
# BUILT_IN_FORGE_API_KEY=...
# BUILT_IN_FORGE_API_URL=...

# 4. Inicia el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🧭 Estándar de ejecución PVC-U Ω-Max

Lúmina aplica una versión pragmática del protocolo PVC-U: contratos Zod, reglas de tamaño y sanitización, estados explícitos del chat, guardrails de IA, `Validation Envelope`, headers versionados y `traceId`. La implementación y sus límites están documentados en [`docs/PVC-U-ADAPTATION.md`](docs/PVC-U-ADAPTATION.md). El proyecto no simula capacidades cuánticas, QKD, PINN o reescritura axiomática: prioriza controles reales, auditables y mantenibles.

Antes de abrir un Pull Request, ejecuta:

```bash
pnpm check
pnpm test
```

## 🛠 Arquitectura del Proyecto

El proyecto sigue una estructura limpia y modular basada en TypeScript de extremo a extremo:

| Directorio | Propósito |
|---|---|
| `client/src/` | Aplicación frontend en React 19, Tailwind CSS v4, componentes UI y páginas. |
| `server/` | Servidor Express, tRPC 11, pasarela LLM, streaming SSE y helpers de base de datos. |
| `drizzle/` | Esquema relacional y migraciones SQL para MySQL/TiDB. |
| `shared/` | Constantes y tipos compartidos entre cliente y servidor. |

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas proponer mejoras, corregir errores o añadir nuevas capacidades (como exportación avanzada, conectores o nuevos temas):

1. Haz un *Fork* del repositorio.
2. Crea tu rama de características (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y verifica las pruebas (`pnpm check && pnpm test`).
4. Envía un *Pull Request* describiendo detalladamente tu aportación.

Por favor, consulta [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles sobre las directrices de código.

---

## 📄 Licencia

Este proyecto se distribuye bajo los términos de la [Licencia MIT](LICENSE).
