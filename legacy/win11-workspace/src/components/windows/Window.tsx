'use client'

import React, { useRef, useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Square, Copy } from 'lucide-react'
import { useDesktopStore, WindowState } from '@/store/useDesktopStore'
import { CourseExplorer } from './apps/CourseExplorer'
import { CVCreator } from './apps/CVCreator'
import { PDFConverter } from './apps/PDFConverter'
import { Notepad } from './apps/Notepad'
import { Settings } from './apps/Settings'
import { FileExplorer } from './apps/FileExplorer'

interface WindowProps {
  windowData: WindowState
}

// Map component names to actual components
const componentMap: Record<string, React.ComponentType> = {
  CourseExplorer,
  CVCreator,
  PDFConverter,
  Notepad,
  Settings,
  FileExplorer
}

export function Window({ windowData }: WindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId
  } = useDesktopStore()
  
  const windowRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
    resizeDirection: ''
  })
  
  const [showSnapPreview, setShowSnapPreview] = useState(false)
  const [snapPosition, setSnapPosition] = useState<'left' | 'right' | null>(null)
  
  const isActive = activeWindowId === windowData.id
  const Component = componentMap[windowData.appId]
  
  // Handle mouse down on window to focus
  const handleWindowMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.window-header')) {
      focusWindow(windowData.id)
    }
  }, [focusWindow, windowData.id])
  
  // Drag functionality for title bar
  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return
    if (windowData.isMaximized) return
    
    e.preventDefault()
    dragState.current = {
      ...dragState.current,
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: windowData.x,
      startTop: windowData.y
    }
    
    focusWindow(windowData.id)
  }, [windowData.x, windowData.y, windowData.isMaximized, focusWindow, windowData.id])
  
  // Resize functionality
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    if (windowData.isMaximized) return
    
    e.preventDefault()
    e.stopPropagation()
    
    dragState.current = {
      ...dragState.current,
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowData.width,
      startHeight: windowData.height,
      startLeft: windowData.x,
      startTop: windowData.y,
      resizeDirection: direction
    }
    
    focusWindow(windowData.id)
  }, [windowData.width, windowData.height, windowData.x, windowData.y, windowData.isMaximized, focusWindow, windowData.id])
  
  // Double click to maximize/restore
  const handleTitleBarDoubleClick = useCallback(() => {
    if (windowData.isMaximized) {
      restoreWindow(windowData.id)
    } else {
      maximizeWindow(windowData.id)
    }
  }, [windowData.isMaximized, maximizeWindow, restoreWindow, windowData.id])
  
  // Global mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const state = dragState.current
      
      if (state.isDragging) {
        const deltaX = e.clientX - state.startX
        const deltaY = e.clientY - state.startY
        
        // Snap preview
        if (e.clientX <= 5) {
          setShowSnapPreview(true)
          setSnapPosition('left')
        } else if (e.clientX >= window.innerWidth - 5) {
          setShowSnapPreview(true)
          setSnapPosition('right')
        } else {
          setShowSnapPreview(false)
          setSnapPosition(null)
        }
        
        updateWindowPosition(
          windowData.id,
          state.startLeft + deltaX,
          Math.max(0, state.startTop + deltaY)
        )
      }
      
      if (state.isResizing) {
        const deltaX = e.clientX - state.startX
        const deltaY = e.clientY - state.startY
        let newWidth = state.startWidth
        let newHeight = state.startHeight
        let newX = state.startLeft
        let newY = state.startTop
        
        // Handle different resize directions
        if (state.resizeDirection.includes('e')) {
          newWidth = Math.max(windowData.minWidth, state.startWidth + deltaX)
        }
        if (state.resizeDirection.includes('w')) {
          newWidth = Math.max(windowData.minWidth, state.startWidth - deltaX)
          if (newWidth > windowData.minWidth) {
            newX = state.startLeft + deltaX
          }
        }
        if (state.resizeDirection.includes('s')) {
          newHeight = Math.max(windowData.minHeight, state.startHeight + deltaY)
        }
        if (state.resizeDirection.includes('n')) {
          newHeight = Math.max(windowData.minHeight, state.startHeight - deltaY)
          if (newHeight > windowData.minHeight) {
            newY = state.startTop + deltaY
          }
        }
        
        updateWindowSize(windowData.id, newWidth, newHeight)
        updateWindowPosition(windowData.id, newX, newY)
      }
    }
    
    const handleMouseUp = () => {
      const state = dragState.current
      
      // Handle snap on release
      if (state.isDragging && snapPosition) {
        if (snapPosition === 'left') {
          updateWindowPosition(windowData.id, 0, 0)
          updateWindowSize(windowData.id, window.innerWidth / 2, window.innerHeight - 48)
        } else if (snapPosition === 'right') {
          updateWindowPosition(windowData.id, window.innerWidth / 2, 0)
          updateWindowSize(windowData.id, window.innerWidth / 2, window.innerHeight - 48)
        }
      }
      
      dragState.current = {
        ...dragState.current,
        isDragging: false,
        isResizing: false
      }
      setShowSnapPreview(false)
      setSnapPosition(null)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [windowData.id, windowData.minWidth, windowData.minHeight, snapPosition, updateWindowPosition, updateWindowSize])
  
  // Get icon component dynamically
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      GraduationCap: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      FileText: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
        </svg>
      ),
      FileOutput: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>
        </svg>
      ),
      FolderOpen: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
        </svg>
      ),
      FileEdit: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 11.27c.28-.17.59-.29.92-.35a3.5 3.5 0 0 1 3.73 1.76l.1.17V19"/><path d="M8 21h8"/>
        </svg>
      ),
      Settings: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      )
    }
    return icons[iconName] || null
  }
  
  if (!Component) return null
  
  return (
    <>
      {/* Snap Preview Overlay */}
      <AnimatePresence>
        {showSnapPreview && snapPosition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bg-blue-500/20 border border-blue-500/50 z-[9999] pointer-events-none ${
              snapPosition === 'left' ? 'left-0' : 'right-0'
            }`}
            style={{
              top: 0,
              width: '50%',
              height: `calc(100vh - 48px)`
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Window */}
      <AnimatePresence>
        {!windowData.isMinimized && (
          <motion.div
            ref={windowRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: windowData.isMaximized ? 0 : windowData.x,
              y: windowData.isMaximized ? 0 : windowData.y,
              width: windowData.isMaximized ? '100vw' : windowData.width,
              height: windowData.isMaximized ? 'calc(100vh - 48px)' : windowData.height
            }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onMouseDown={handleWindowMouseDown}
            className={`fixed flex flex-col overflow-hidden ${
              windowData.isMaximized ? 'rounded-none' : 'rounded-lg'
            } shadow-2xl shadow-black/30`}
            style={{ zIndex: windowData.zIndex }}
          >
            {/* Title Bar */}
            <div
              className={`
                window-header flex items-center justify-between h-9 px-3 select-none shrink-0
                ${isActive 
                  ? 'bg-white/90 backdrop-blur-xl' 
                  : 'bg-white/70 backdrop-blur-lg'
                }
              `}
              onMouseDown={handleTitleBarMouseDown}
              onDoubleClick={handleTitleBarDoubleClick}
              style={{
                borderBottom: isActive ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(0,0,0,0.03)'
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-${isActive ? '[#0078d4]' : '[#666]'} flex-shrink-0`}>
                  {getIconComponent(windowData.icon)}
                </span>
                <span className={`text-xs truncate ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                  {windowData.title}
                </span>
              </div>
              
              <div className="window-controls flex items-center -mr-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    minimizeWindow(windowData.id)
                  }}
                  className="w-11 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                  <Minus size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (windowData.isMaximized) {
                      restoreWindow(windowData.id)
                    } else {
                      maximizeWindow(windowData.id)
                    }
                  }}
                  className="w-11 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                  {windowData.isMaximized ? (
                    <Copy size={12} className="text-gray-600" />
                  ) : (
                    <Square size={12} className="text-gray-600" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeWindow(windowData.id)
                  }}
                  className="w-11 h-8 flex items-center justify-center hover:bg-red-500 transition-colors group"
                >
                  <X size={14} className="text-gray-600 group-hover:text-white" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto bg-white">
              <Component windowId={windowData.id} />
            </div>
            
            {/* Resize Handles */}
            {!windowData.isMaximized && (
              <>
                {/* Corners */}
                <div 
                  className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
                />
                <div 
                  className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
                />
                <div 
                  className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
                />
                <div 
                  className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
                />
                
                {/* Edges */}
                <div 
                  className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
                />
                <div 
                  className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 's')}
                />
                <div 
                  className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
                />
                <div 
                  className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// HOC for app components to receive windowId
export interface WithWindowIdProps {
  windowId: string
}
