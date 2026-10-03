'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, 
  Volume2, 
  Battery, 
  ChevronUp,
  Monitor
} from 'lucide-react'
import { useDesktopStore, availableApps } from '@/store/useDesktopStore'

export function Taskbar() {
  const { 
    windows, 
    activeWindowId, 
    isStartMenuOpen, 
    toggleStartMenu,
    focusWindow,
    language,
    toggleLanguage
  } = useDesktopStore()
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSystemTray, setShowSystemTray] = useState(false)
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'es' ? 'es-ES' : 'pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  // Get icon component for taskbar items
  const getIconComponent = (iconName: string, size: number = 20) => {
    const iconProps = { width: size, height: size }
    switch (iconName) {
      case 'GraduationCap':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        )
      case 'FileText':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
          </svg>
        )
      case 'FileOutput':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>
          </svg>
        )
      case 'FolderOpen':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
          </svg>
        )
      case 'FileEdit':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 11.27c.28-.17.59-.29.92-.35a3.5 3.5 0 0 1 3.73 1.76l.1.17V19"/><path d="M8 21h8"/>
          </svg>
        )
      case 'Settings':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 z-[9998] flex justify-center pb-1 px-2">
      {/* Taskbar Container */}
      <div className="relative w-full max-w-[98%] h-full flex items-center justify-center">
        {/* Taskbar Background */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="
            absolute inset-0 rounded-xl
            bg-white/80 backdrop-blur-2xl
            border border-white/40
            shadow-lg shadow-black/10
            flex items-center justify-center px-2 gap-1
          "
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (isStartMenuOpen) {
                toggleStartMenu()
              }
            }
          }}
        >
          {/* Centered Content */}
          <div className="flex items-center gap-1">
            {/* Start Button */}
            <button
              onClick={toggleStartMenu}
              className={`
                relative w-10 h-10 rounded-md flex items-center justify-center
                transition-all duration-150
                ${isStartMenuOpen 
                  ? 'bg-black/10' 
                  : 'hover:bg-black/5'
                }
              `}
            >
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill={isStartMenuOpen ? '#0078d4' : '#0078d4'}
              >
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </button>
            
            {/* Search Button */}
            <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-black/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </button>
            
            {/* Separator */}
            <div className="w-px h-6 bg-gray-300/60 mx-1" />
            
            {/* Open Windows */}
            {windows.map((window) => (
              <motion.button
                key={window.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (window.isMinimized || activeWindowId !== window.id) {
                    focusWindow(window.id)
                  } else {
                    // Could add minimize on click functionality here
                  }
                }}
                className={`
                  relative w-10 h-10 rounded-md flex items-center justify-center
                  transition-all duration-150 overflow-hidden
                  ${activeWindowId === window.id && !window.isMinimized
                    ? 'bg-black/10 border-b-2 border-[#0078d4]'
                    : 'hover:bg-black/5'
                  }
                `}
                title={window.title}
              >
                <span className={`text-sm ${activeWindowId === window.id ? '' : 'opacity-70'}`}>
                  {getIconComponent(window.icon, 18)}
                </span>
                
                {/* Underline indicator for active but not focused windows */}
                {activeWindowId !== window.id && !window.isMinimized && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gray-400/50 rounded-full" />
                )}
              </motion.button>
            ))}
            
            {/* Pinned Apps (show when no windows open or as quick launch) */}
            {windows.length === 0 && availableApps.slice(0, 4).map((app) => (
              <button
                key={app.id}
                className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-black/5 transition-colors opacity-80"
                title={app.name}
              >
                {getIconComponent(app.icon, 18)}
              </button>
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-gray-300/60 mx-1" />
            
            {/* File Explorer Quick Launch */}
            <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-black/5 transition-colors">
              {getIconComponent('FolderOpen', 18)}
            </button>
            
            {/* Edge/Browser Icon */}
            <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-black/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.88" x2="8.5" y1="12" y2="12"/><line x1="16.5" x2="21.17" y1="12" y2="16"/>
              </svg>
            </button>
          </div>
          
          {/* System Tray - Right Side */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Hidden Icons Chevron */}
            <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-black/5 transition-colors">
              <ChevronUp size={14} className="text-gray-600" />
            </button>
            
            {/* System Icons */}
            <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-md hover:bg-black/5 cursor-pointer"
                 onMouseEnter={() => setShowSystemTray(true)}
                 onMouseLeave={() => setShowSystemTray(false)}>
              <Wifi size={14} className="text-gray-600 mx-0.5" />
              <Volume2 size={14} className="text-gray-600 mx-0.5" />
              <Battery size={14} className="text-gray-600 mx-0.5" />
            </div>
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-md hover:bg-black/5 text-xs font-medium text-gray-700 transition-colors min-w-[36px]"
              title={language === 'es' ? 'Cambiar a Português' : 'Mudar para Espanhol'}
            >
              {language.toUpperCase()}
            </button>
            
            {/* Date & Time */}
            <button className="px-2 py-1 rounded-md hover:bg-black/5 text-right transition-colors">
              <div className="text-xs font-medium text-gray-800 leading-tight">
                {formatTime(currentTime)}
              </div>
              <div className="text-[10px] text-gray-600 leading-tight">
                {formatDate(currentTime)}
              </div>
            </button>
            
            {/* Show Desktop Button */}
            <div className="w-px h-6 bg-transparent mx-0.5" />
          </div>
        </motion.div>
        
        {/* System Tray Popup */}
        <AnimatePresence>
          {showSystemTray && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-14 right-2 w-72 bg-white/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200/60 p-4"
              onMouseEnter={() => setShowSystemTray(true)}
              onMouseLeave={() => setShowSystemTray(false)}
            >
              {/* Quick Settings Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button className="flex flex-col items-center p-3 rounded-lg bg-blue-500 text-white">
                  <Wifi size={20} />
                  <span className="text-xs mt-1">Wi-Fi</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <Monitor size={20} className="text-gray-700" />
                  <span className="text-xs mt-1 text-gray-700">Pantalla</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <Volume2 size={20} className="text-gray-700" />
                  <span className="text-xs mt-1 text-gray-700">Sonido</span>
                </button>
              </div>
              
              {/* Slider placeholder */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Volume2 size={16} className="text-gray-600" />
                  <div className="flex-1 h-1 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Battery size={16} className="text-gray-600" />
                  <div className="flex-1 h-1 bg-gray-200 rounded-full">
                    <div className="w-[85%] h-full bg-green-500 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Battery Info */}
              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-600">Batería</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
