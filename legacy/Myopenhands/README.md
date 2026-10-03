# Myopenhands

Interfaz web propia sobre el agente OpenHands.

## Que es

Un frontend en TypeScript (Vite + servidor Bun) que envuelve un agente de codigo y le da
interfaz propia. El agente trabaja; esta capa es la que se usa.

## Stack

- **Vite** - build y servidor de desarrollo
- **TypeScript** - tipado estricto
- **Bun** - gestor de paquetes y runtime del servidor (`server.ts`)

## Puesta en marcha

```bash
bun install
cp .env.example .env
bun run dev
```

## Configuracion

Las variables van en `.env` (plantilla en `.env.example`). Ningun secreto se versiona.

## Licencia

MIT - ver `LICENSE`.
