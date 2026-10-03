'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktopStore, availableApps, DesktopApp } from '@/store/useDesktopStore'
import { Window } from './Window'
import { Taskbar } from './Taskbar'
import { StartMenu } from './StartMenu'

interface DesktopIconData {
  app: DesktopApp
}

export function Desktop() {
  const {
    windows,
    isStartMenuOpen,
    openWindow,
    language,
    closeStartMenu
  } = useDesktopStore()

  // Context menu state
  const [ctxPos, setCtxPos] = useState<{ x: number; y: number } | null>(null)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  // ── Right-click context menu ────────────────
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if ((e.target as HTMLElement).closest('.window') ||
        (e.target as HTMLElement).closest('.desktop-icon') ||
        (e.target as HTMLElement).closest('.taskbar-area')) return
    setCtxPos({ x: e.clientX, y: e.clientY })
    closeStartMenu()
  }, [closeStartMenu])

  const closeContextMenu = useCallback(() => setCtxPos(null), [])

  useEffect(() => {
    const handleClick = () => closeContextMenu()
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [closeContextMenu])

  // ── Keyboard shortcuts ──────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isStartMenuOpen) closeStartMenu()
        closeContextMenu()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isStartMenuOpen, closeStartMenu, closeContextMenu])

  // ── Icon helpers ────────────────────────────
  const handleAppClick = useCallback((app: DesktopApp) => {
    openWindow(app.id, app)
  }, [openWindow])

  const displayName = (app: DesktopApp) => 
    language === 'pt' && app.namePt ? app.namePt : app.name

  const icons: DesktopIconData[] = availableApps.map(app => ({ app }))

  const handleDragStart = (idx: number) => setDraggedIdx(idx)

  return (
    <div 
      className="fixed inset-0 overflow-hidden win11-desktop"
      onContextMenu={handleContextMenu}
    >
      {/* Wallpaper */}
      <div className="absolute inset-0 win11-wallpaper pointer-events-none" />

      {/* Desktop Icons — Grid Layout */}
      <div className="absolute inset-0 pb-14 p-6 desktop-icon-grid">
        <div className="inline-grid" style={{ gridAutoRows: 88 }}>
          {icons.map(({ app }, displayIdx) => (
            <div
              key={app.id}
              className={`
                desktop-icon flex flex-col items-center justify-center w-20 p-1.5 rounded-lg cursor-pointer select-none transition-colors duration-100
                ${draggedIdx === displayIdx ? 'opacity-40' : ''} hover:bg-white/20
              `}
              style={{
                gridColumn: Math.floor(displayIdx / 8) + 1,
                gridRow: (displayIdx % 8) + 1,
              }}
              onDoubleClick={() => handleAppClick(app)}
              draggable
              onDragStart={() => handleDragStart(displayIdx)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                {renderIconSvg(app.icon, 36)}
              </div>
              <span className="mt-1 px-1 py-0.5 text-[10px] text-center text-white leading-tight w-full rounded break-words min-h-[24px] flex items-center justify-center drop-shadow-md">
                {displayName(app)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Open Windows */}
      <AnimatePresence>
        {windows.map((windowData) => (
          <Window key={windowData.id} windowData={windowData} />
        ))}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar />

      {/* Start Menu */}
      <StartMenu />

      {/* Right-click Context Menu */}
      <AnimatePresence>
        {ctxPos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[99999] acrylic-dark rounded-lg shadow-win-md overflow-hidden min-w-[220px]"
            style={{ left: ctxPos.x, top: ctxPos.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { label: 'Ajustar iconos automáticamente', action: () => {} },
              { label: 'Organizar iconos', action: () => {} },
              { divider: true },
              { label: 'Actualizar', shortcut: 'F5', action: () => window.location.reload() },
              { divider: true },
              { label: 'Configuración', action: () => {
                const s = availableApps.find(a => a.id === 'settings')
                if (s) { openWindow(s.id, s); closeContextMenu() }
              }},
              { label: 'Bloc de notas', action: () => {
                const n = availableApps.find(a => a.id === 'notepad')
                if (n) { openWindow(n.id, n); closeContextMenu() }
              }},
              { label: 'Explorador', action: () => {
                const f = availableApps.find(a => a.id === 'file-explorer')
                if (f) { openWindow(f.id, f); closeContextMenu() }
              }},
            ].map((item, idx) => {
              if ('divider' in item && item.divider) return <div key={`d${idx}`} className="h-px bg-white/10 mx-2 my-1" />
              return (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 flex items-center justify-between transition-colors"
                  onClick={() => { item.action(); closeContextMenu() }}
                >
                  <span>{item.label}</span>
                  {'shortcut' in item && item.shortcut && <span className="text-xs text-white/40">{item.shortcut}</span>}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Icon SVG Map ────────────────────────────────── */
function renderIconSvg(name: string, size: number = 24): React.ReactNode {
  const s = { width: size, height: size }
  const m: Record<string, React.ReactNode> = {
    GraduationCap: <svg {...s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#60cdff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    FileText: <svg {...s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7ac943" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
    FileOutput: <svg {...s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff8700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>,
    FolderOpen: <svg {...s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffd83d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>,
    FileEdit: <svg {...s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#949494" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13a2 2 0 0 0-2 2c0 .8-.04 2-.26 4"/><path d="M14 11.27c.28-.17.59-.29.92-.35a3.5 3.5 0 0 1 3.73 1.76v2"/><path d="M8 21h8"/></svg>,
    Settings: <svg {...s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#60cdff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  }
  return m[name] ?? null
}
