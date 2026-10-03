# Guía de Contribución a Lúmina

¡Gracias por tu interés en contribuir a Lúmina! Queremos que este proyecto sea un referente de calidad, elegancia y robustez técnica en el ecosistema de código abierto en español.

## Código de Conducta

Al participar en este proyecto, te comprometes a mantener un trato respetuoso, constructivo y colaborativo con todos los miembros de la comunidad.

## Cómo Empezar

1. **Busca o crea un Issue:** Si vas a corregir un error importante o añadir una funcionalidad relevante, abre un issue primero para comentarlo.
2. **Haz un Fork y clona tu rama:**
   ```bash
   git clone https://github.com/tu-usuario/lumina-asistente.git
   cd lumina-asistente
   git checkout -b feature/nombre-descriptivo
   ```
3. **Ejecuta las pruebas y comprobaciones:**
   ```bash
   pnpm install
   pnpm check  # Ejecuta tsc --noEmit
   pnpm test   # Ejecuta Vitest
   ```
4. **Envía tu Pull Request:** Explica claramente qué problema resuelve tu aportación y cómo la has probado.
