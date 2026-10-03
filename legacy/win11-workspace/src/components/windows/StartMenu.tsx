'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Star, 
  Power,
  Settings,
  User,
  FileText,
  Grid3X3
} from 'lucide-react'
import { useDesktopStore, availableApps } from '@/store/useDesktopStore'

export function StartMenu() {
  const { isStartMenuOpen, closeStartMenu, openWindow, language, toggleLanguage } = useDesktopStore()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Focus search input when start menu opens
  useEffect(() => {
    if (isStartMenuOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isStartMenuOpen])
  
  // Filter apps based on search - using derived state
  const filteredApps = useMemo(() => {
    if (searchQuery.trim() === '') {
      return availableApps
    } else {
      const query = searchQuery.toLowerCase()
      return availableApps.filter(app => 
        app.name.toLowerCase().includes(query) ||
        (app.namePt && app.namePt.toLowerCase().includes(query))
      )
    }
  }, [searchQuery])
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isStartMenuOpen && !(e.target as HTMLElement).closest('.start-menu-container')) {
        closeStartMenu()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isStartMenuOpen, closeStartMenu])
  
  // Get icon component
  const getIconComponent = (iconName: string, size: number = 24) => {
    const iconProps = { width: size, height: size }
    switch (iconName) {
      case 'GraduationCap':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        )
      case 'FileText':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#107c10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
          </svg>
        )
      case 'FileOutput':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d83b01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>
          </svg>
        )
      case 'FolderOpen':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
          </svg>
        )
      case 'FileEdit':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#5c5c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 11.27c.28-.17.59-.29.92-.35a3.5 3.5 0 0 1 3.73 1.76l.1.17V19"/><path d="M8 21h8"/>
          </svg>
        )
      case 'Settings':
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        )
      default:
        return null
    }
  }
  
  const handleAppClick = (app: typeof availableApps[0]) => {
    openWindow(app.id, app)
    setSearchQuery('')
    closeStartMenu()
  }
  
  const translations = {
    es: {
      search: 'Escribir para buscar',
      pinned: 'Fijados',
      recommended: 'Recomendados',
      allApps: 'Todas las aplicaciones',
      power: 'Apagar',
      settings: 'Configuración',
      documents: 'Documentos',
      downloads: 'Descargas',
      images: 'Imágenes',
      userName: 'Usuario',
      noResults: 'No se encontraron resultados'
    },
    pt: {
      search: 'Digite para pesquisar',
      pinned: 'Fixos',
      recommended: 'Recomendados',
      allApps: 'Todos os aplicativos',
      power: 'Desligar',
      settings: 'Configurações',
      documents: 'Documentos',
      downloads: 'Downloads',
      images: 'Imagens',
      userName: 'Usuário',
      noResults: 'Nenhum resultado encontrado'
    }
  }
  
  const t = translations[language]
  
  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9997]"
            onClick={closeStartMenu}
          />
          
          {/* Start Menu */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              start-menu-container fixed bottom-14 left-1/2 -translate-x-1/2
              w-[600px] max-w-[calc(100vw-32px)]
              bg-white/90 backdrop-blur-2xl rounded-xl
              border border-white/40 shadow-2xl shadow-black/20
              overflow-hidden z-[9998]
            "
          >
            {/* Search Bar */}
            <div className="p-4 pb-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search}
                  className="
                    w-full h-10 pl-9 pr-4 rounded-full
                    bg-gray-100/80 border-none outline-none
                    text-sm placeholder:text-gray-400
                    focus:bg-white focus:ring-2 focus:ring-blue-500/30
                    transition-all
                  "
                />
              </div>
            </div>
            
            {/* Content Area */}
            <div className="px-4 pb-4 max-h-[400px] overflow-y-auto">
              {/* Pinned Apps Section */}
              {!searchQuery && (
                <section className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">{t.pinned}</h3>
                    <button className="text-xs text-[#0078d4] hover:underline flex items-center gap-1">
                      <Grid3X3 size={12} />
                      {t.allApps}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-1">
                    {availableApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleAppClick(app)}
                        className="
                          flex flex-col items-center p-3 rounded-lg
                          hover:bg-gray-100/80 transition-colors group
                        "
                      >
                        <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                          {getIconComponent(app.icon, 28)}
                        </div>
                        <span className="text-xs text-center text-gray-700 truncate w-full leading-tight">
                          {language === 'pt' && app.namePt ? app.namePt : app.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Search Results or Recommended */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {searchQuery ? t.recommended : t.recommended}
                </h3>
                
                {filteredApps.length > 0 ? (
                  <div className="space-y-1">
                    {(searchQuery ? filteredApps : availableApps.slice(0, 4)).map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleAppClick(app)}
                        className="
                          w-full flex items-center gap-3 p-2.5 rounded-md
                          hover:bg-gray-100/80 transition-colors
                        "
                      >
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md">
                          {getIconComponent(app.icon, 22)}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-800">
                            {language === 'pt' && app.namePt ? app.namePt : app.name}
                          </div>
                          <div className="text-xs text-gray-500">Aplicación del sistema</div>
                        </div>
                        <Star size={14} className="ml-auto text-gray-300 hover:text-yellow-500 transition-colors" />
                      </button>
                    ))}
                    
                    {/* Quick Access Items */}
                    {!searchQuery && (
                      <>
                        <div className="my-2 border-t border-gray-200/60" />
                        
                        {[
                          { id: 'docs', name: t.documents, icon: FileText },
                          { id: 'settings', name: t.settings, icon: Settings },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => item.id === 'settings' && handleAppClick(availableApps.find(a => a.id === 'settings')!)}
                            className="
                              w-full flex items-center gap-3 p-2.5 rounded-md
                              hover:bg-gray-100/80 transition-colors
                            "
                          >
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md">
                              <item.icon size={22} className="text-gray-600" />
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium text-gray-800">{item.name}</div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    {t.noResults}
                  </div>
                )}
              </section>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-gray-200/60 px-4 py-3 flex items-center justify-between bg-gray-50/50">
              {/* User Profile */}
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/60 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{t.userName}</span>
              </button>
              
              {/* Power Button */}
              <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200/60 transition-colors">
                <Power size={18} className="text-gray-600" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
