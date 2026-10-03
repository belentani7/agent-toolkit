# 🖥️ Win11 Workspace — Desktop OS in the Browser

> A fully interactive Windows 11 desktop experience running entirely in your browser. Drag windows, snap to edges, switch apps, right-click context menus — everything powered by Next.js, Framer Motion, and Zustand.

![Banner](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-%230055FF?logo=framer)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-%2306B6D4?logo=tailwindcss)

## ✨ Features

| Feature | Details |
|---------|---------|
| **Windows 11 Authentic UI** | Acrylic/glassmorphism effects, proper shadows, Fluent Design accents |
| **Draggable Windows** | Full drag, resize from all edges/corners, maximize, minimize, restore |
| **Snap-to-Edge** | Drag windows to left/right edges for 50/50 split layout |
| **Start Menu** | Search-filtered pinned apps, user profile, language toggle |
| **Context Menu** | Right-click desktop for Quick actions — Settings, Notepad, Explorer |
| **Taskbar** | Centered icons, active window indicators, system tray (WiFi, Volume, Battery) |
| **Live Clock** | Real-time clock with date display, locale-aware formatting |
| **Language System** | Toggle between Español and Português globally |
| **6 Built-in Apps** | Course Explorer, CV Creator, PDF Converter, File Explorer, Notepad, Settings |
| **Spring Animations** | Framer Motion physics-based transitions for all window state changes |
| **Keyboard Shortcuts** | `Escape` closes menus, extensible architecture |

## 🏗️ Architecture

```
workspace-extracted/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Win11 acrylic glass system + animations
│   │   ├── layout.tsx          # Root layout (dark mode ready)
│   │   └── page.tsx            # <Desktop /> entry point
│   ├── components/windows/     # Desktop OS shell
│   │   ├── Desktop.tsx         # Wallpaper + icon grid + context menu
│   │   ├── Window.tsx          # Draggable/resizable window manager
│   │   ├── StartMenu.tsx       # Search + pinned apps panel
│   │   ├── Taskbar.tsx         # Center bar + system tray + notifications
│   │   └── apps/               # 6 built-in applications
│   │       ├── CourseExplorer.tsx
│   │       ├── CVCreator.tsx
│   │       ├── PDFConverter.tsx
│   │       ├── FileExplorer.tsx
│   │       ├── Notepad.tsx
│   │       └── Settings.tsx
│   ├── store/useDesktopStore.ts  # Zustand state management
│   └── lib/utils.ts              # Class merging utilities
├── prisma/schema.prisma          # SQLite schema (User, Post)
├── db/custom.db                  # Local SQLite database
└── next.config.ts                # Standalone output + TS error tolerance
```

### Tech Stack

- **Framework:** Next.js 16 (App Router, standalone output)
- **State:** Zustand (window management, Start Menu, language)
- **Animations:** Framer Motion (spring physics, AnimatePresence)
- **Styling:** Tailwind CSS v4 + custom acrylic glass primitives
- **Icons:** Lucide React
- **Database:** Prisma + SQLite (local dev)
- **Runtime:** Bun (dev server + build)

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Push database schema
bun run db:push

# Start development server (localhost:3000)
bun run dev

# Build for production
bun run build
```

## 🎨 Customization

### Adding New Apps

1. Create `src/components/windows/apps/YourApp.tsx`
2. Register in `useDesktopStore.ts` → `availableApps[]` array

```typescript
{ id: 'your-app', name: 'Your App', icon: 'SomeIcon', /* ... */ }
```

### Changing Wallpapers

Replace `.win11-wallpaper` in `globals.css` with your gradient or image background. The current wallpaper uses multi-layer radial gradients to simulate Windows 11 Bloom.

### Extending Keyboard Shortcuts

Add to `Desktop.tsx` → keyboard shortcut useEffect:

```typescript
if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
  // Open File Explorer
}
```

## 📦 Build & Deploy

```bash
# Production build (standalone output)
bun run build

# Start production server
bun run start
```

The standalone output enables deployment to Vercel, Railway, Cloudflare Workers, or any Node.js host.

## 🤝 Contributing

This project is open-source and free to use, modify, and redistribute. Fork it, customize it, make it yours.

## 📄 License

MIT
