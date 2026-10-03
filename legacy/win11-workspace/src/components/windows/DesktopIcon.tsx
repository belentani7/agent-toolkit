'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDesktopStore, DesktopApp } from '@/store/useDesktopStore'

interface DesktopIconProps {
  app: DesktopApp
  index: number
}

// Icon components mapping
const iconComponents: Record<string, React.ReactNode> = {
  GraduationCap: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  FileText: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#107c10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
  ),
  FileOutput: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d83b01" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>
    </svg>
  ),
  FolderOpen: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  FileEdit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5c5c5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 11.27c.28-.17.59-.29.92-.35a3.5 3.5 0 0 1 3.73 1.76l.1.17V19"/><path d="M8 21h8"/>
    </svg>
  ),
  Settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export function DesktopIcon({ app, index }: DesktopIconProps) {
  const { openWindow, language } = useDesktopStore()
  const [isHovered, setIsHovered] = useState(false)
  
  const handleDoubleClick = () => {
    openWindow(app.id, app)
  }
  
  const displayName = language === 'pt' && app.namePt ? app.namePt : app.name
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        flex flex-col items-center justify-center w-20 p-2 rounded-lg cursor-pointer
        select-none transition-colors
        ${isHovered ? 'bg-white/20' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        left: 16,
        top: 16 + index * 90
      }}
    >
      {/* Icon */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
        isHovered ? 'bg-white/30 scale-110' : ''
      }`}>
        {iconComponents[app.icon]}
      </div>
      
      {/* Label */}
      <span className={`
        mt-1 text-xs text-center text-white leading-tight 
        px-1 py-0.5 rounded max-w-[76px] truncate
        ${isHovered ? 'bg-[#0078d4] shadow-lg' : ''}
        drop-shadow-md
      `}>
        {displayName}
      </span>
    </motion.div>
  )
}
