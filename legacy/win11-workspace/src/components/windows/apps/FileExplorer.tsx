'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Folder,
  FolderOpen,
  FileText,
  FileImage,
  FileVideo,
  Music,
  Archive,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Home,
  Monitor,
  Download,
  Star,
  Clock,
  Search,
  Grid3X3,
  List,
  Plus,
  MoreVertical,
  HardDrive,
  Usb
} from 'lucide-react'
import { WithWindowIdProps } from '../Window'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file'
  fileType?: string
  size?: string
  modified: string
  icon?: string
  children?: FileItem[]
}

// Mock file system structure
const fileSystem: Record<string, FileItem[]> = {
  root: [
    { id: '1', name: 'Escritorio', type: 'folder', children: [] },
    { id: '2', name: 'Documentos', type: 'folder', children: [] },
    { id: '3', name: 'Descargas', type: 'folder', children: [] },
    { id: '4', name: 'Imágenes', type: 'folder', children: [] },
    { id: '5', name: 'Música', type: 'folder', children: [] },
    { id: '6', name: 'Vídeos', type: 'folder', children: [] }
  ],
  documents: [
    { 
      id: 'd1', 
      name: 'Manos Abiertas', 
      type: 'folder',
      children: [
        { id: 'd1-1', name: 'Cursos', type: 'folder' as const, children: [] },
        { id: 'd1-2', name: 'Certificados', type: 'folder' as const, children: [] },
        { 
          id: 'd1-3', 
          name: 'Mi_CV.pdf', 
          type: 'file' as const, 
          fileType: 'pdf',
          size: '245 KB',
          modified: '15/01/2024'
        },
        {
          id: 'd1-4',
          name: 'Notas.txt',
          type: 'file' as const,
          fileType: 'text',
          size: '12 KB',
          modified: '10/01/2024'
        }
      ]
    },
    { 
      id: 'd2', 
      name: 'Trabajo', 
      type: 'folder',
      children: []
    },
    {
      id: 'd3',
      name: 'Personal',
      type: 'folder',
      children: []
    },
    {
      id: 'd4',
      name: 'Contrato_2024.pdf',
      type: 'file',
      fileType: 'pdf',
      size: '1.2 MB',
      modified: '05/01/2024'
    },
    {
      id: 'd5',
      name: 'Presupuesto_Enero.xlsx',
      type: 'file',
      fileType: 'excel',
      size: '89 KB',
      modified: '01/01/2024'
    }
  ],
  downloads: [
    {
      id: 'dl1',
      name: 'Guia_IA_Completo.pdf',
      type: 'file',
      fileType: 'pdf',
      size: '15.4 MB',
      modified: '14/01/2024'
    },
    {
      id: 'dl2',
      name: 'Foto_Perfil.jpg',
      type: 'file',
      fileType: 'image',
      size: '2.1 MB',
      modified: '12/01/2024'
    },
    {
      id: 'dl3',
      name: 'Curso_Español.zip',
      type: 'file',
      fileType: 'archive',
      size: '45.8 MB',
      modified: '08/01/2024'
    }
  ],
  images: [
    {
      id: 'img1',
      name: 'vacaciones_2023.jpg',
      type: 'file',
      fileType: 'image',
      size: '3.2 MB',
      modified: '20/12/2023'
    },
    {
      id: 'img2',
      name: 'familia.jpg',
      type: 'file',
      fileType: 'image',
      size: '2.8 MB',
      modified: '15/12/2023'
    },
    {
      id: 'img3',
      name: 'documento_escaneado.png',
      type: 'file',
      fileType: 'image',
      size: '1.5 MB',
      modified: '10/12/2023'
    }
  ]
}

export function FileExplorer({ windowId }: WithWindowIdProps) {
  const [currentPath, setCurrentPath] = useState<string[]>(['root'])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [language, setLanguage] = useState<'es' | 'pt'>('es')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get current folder contents based on path
  const getCurrentContents = (): FileItem[] => {
    if (currentPath.length === 1 && currentPath[0] === 'root') {
      return fileSystem.root
    }
    
    let contents: FileItem[] = fileSystem.root
    for (let i = 1; i < currentPath.length; i++) {
      const folder = contents.find(f => f.id === currentPath[i])
      if (folder?.children) {
        contents = folder.children
      }
    }
    
    return contents || []
  }
  
  const currentContents = getCurrentContents()
  
  // Filter by search
  const filteredContents = searchQuery
    ? currentContents.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentContents
  
  const navigateTo = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.id])
      setSelectedItem(null)
    }
  }
  
  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedItem(null)
    }
  }
  
  const navigateHome = () => {
    setCurrentPath(['root'])
    setSelectedItem(null)
  }
  
  const t = language === 'es' ? {
    title: 'Explorador de archivos',
    search: 'Buscar en esta carpeta',
    name: 'Nombre',
    dateModified: 'Fecha de modificación',
    type: 'Tipo',
    size: 'Tamaño',
    noItems: 'Esta carpeta está vacía',
    items: 'elementos',
    selected: 'seleccionado',
    newFolder: 'Nueva carpeta',
    quickAccess: 'Acceso rápido',
    thisPC: 'Este equipo',
    network: 'Red',
    drives: 'Unidades'
  } : {
    title: 'Explorador de arquivos',
    search: 'Pesquisar nesta pasta',
    name: 'Nome',
    dateModified: 'Data de modificação',
    type: 'Tipo',
    size: 'Tamanho',
    noItems: 'Esta pasta está vazia',
    items: 'itens',
    selected: 'selecionado',
    newFolder: 'Nova pasta',
    quickAccess: 'Acesso rápido',
    thisPC: 'Este computador',
    network: 'Rede',
    drives: 'Unidades'
  }

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return selectedItem === item.id ? (
        <FolderOpen size={viewMode === 'grid' ? 40 : 18} className="text-yellow-500" />
      ) : (
        <Folder size={viewMode === 'grid' ? 40 : 18} className="text-yellow-500" />
      )
    }
    
    switch (item.fileType) {
      case 'pdf':
        return <FileText size={viewMode === 'grid' ? 40 : 18} className="text-red-500" />
      case 'image':
        return <FileImage size={viewMode === 'grid' ? 40 : 18} className="text-green-500" />
      case 'video':
        return <FileVideo size={viewMode === 'grid' ? 40 : 18} className="text-purple-500" />
      case 'audio':
        return <Music size={viewMode === 'grid' ? 40 : 18} className="text-pink-500" />
      case 'archive':
        return <Archive size={viewMode === 'grid' ? 40 : 18} className="text-orange-500" />
      default:
        return <FileText size={viewMode === 'grid' ? 40 : 18} className="text-gray-500" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button 
            onClick={navigateUp}
            disabled={currentPath.length <= 1}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              currentPath.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={navigateHome}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          >
            <Home size={16} />
          </button>
        </div>
        
        {/* Path Bar */}
        <div className="flex-1 flex items-center h-8 px-3 bg-white border border-gray-200 rounded-lg text-sm">
          {currentPath.map((segment, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight size={14} className="mx-1 text-gray-400" />}
              <button
                onClick={() => {
                  setCurrentPath(currentPath.slice(0, index + 1))
                  setSelectedItem(null)
                }}
                className={`hover:text-blue-600 ${
                  index === currentPath.length - 1 ? 'font-medium text-gray-800' : 'text-gray-600'
                }`}
              >
                {segment === 'root' 
                  ? (language === 'es' ? 'Este equipo' : 'Este computador')
                  : fileSystem.root.find(f => f.id === segment)?.name || segment
                }
              </button>
            </React.Fragment>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-48 h-8 pl-7 pr-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <List size={16} />
          </button>
        </div>
        
        {/* Language */}
        <button 
          onClick={() => setLanguage(language === 'es' ? 'pt' : 'es')}
          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          {language.toUpperCase()}
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r border-gray-200 bg-gray-50 p-3 overflow-y-auto shrink-0">
          {/* Quick Access */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              {t.quickAccess}
            </h3>
            <div className="space-y-0.5">
              <SidebarItem 
                icon={<Monitor size={16} />}
                label={language === 'es' ? 'Escritorio' : 'Área de trabalho'}
                active={false}
              />
              <SidebarItem 
                icon={<Download size={16} />}
                label={language === 'es' ? 'Descargas' : 'Downloads'}
                active={false}
              />
              <SidebarItem 
                icon={<FileText size={16} />}
                label={language === 'es' ? 'Documentos' : 'Documentos'}
                active={true}
              />
              <SidebarItem 
                icon={<FileImage size={16} />}
                label={language === 'es' ? 'Imágenes' : 'Imagens'}
                active={false}
              />
              <SidebarItem 
                icon={<Star size={16} />}
                label={language === 'es' ? 'Favoritos' : 'Favoritos'}
                active={false}
              />
              <SidebarItem 
                icon={<Clock size={16} />}
                label={language === 'es' ? 'Reciente' : 'Recente'}
                active={false}
              />
            </div>
          </div>
          
          {/* This PC */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              {t.thisPC}
            </h3>
            <div className="space-y-0.5">
              <SidebarItem 
                icon={<HardDrive size={16} />}
                label="Disco local (C:)"
                active={false}
                badge="128 GB"
              />
              <SidebarItem 
                icon={<Usb size={16} />}
                label="USB Drive (D:)"
                active={false}
                badge="32 GB"
              />
            </div>
          </div>
          
          {/* Network */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              {t.network}
            </h3>
            <SidebarItem 
              icon={<Grid3X3 size={16} />}
              label={t.network}
              active={false}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
              {filteredContents.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedItem(item.id)
                    if (item.type === 'folder') navigateTo(item)
                  }}
                  onDoubleClick={() => navigateTo(item)}
                  className={`
                    flex flex-col items-center p-3 rounded-lg transition-colors
                    ${selectedItem === item.id 
                      ? 'bg-blue-100 ring-1 ring-blue-300' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="mb-2">
                    {getFileIcon(item)}
                  </div>
                  <span className="text-xs text-center text-gray-700 line-clamp-2 leading-tight break-all">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 border-b border-gray-200">
                <div className="flex-1">{t.name}</div>
                <div className="w-24">{t.dateModified}</div>
                <div className="w-20">{t.type}</div>
                <div className="w-20 text-right">{t.size}</div>
              </div>
              
              {/* Rows */}
              {filteredContents.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedItem(item.id)}
                  onDoubleClick={() => navigateTo(item)}
                  className={`
                    flex items-center px-3 py-2 cursor-pointer transition-colors
                    ${selectedItem === item.id 
                      ? 'bg-blue-100' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex-1 flex items-center gap-2 truncate">
                    {getFileIcon(item)}
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="w-24 text-sm text-gray-500">{item.modified || '-'}</div>
                  <div className="w-20 text-sm text-gray-500 capitalize">
                    {item.type === 'folder' 
                      ? (language === 'es' ? 'Carpeta' : 'Pasta')
                      : item.fileType || '-'
                    }
                  </div>
                  <div className="w-20 text-sm text-gray-500 text-right">
                    {item.size || '-'}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {filteredContents.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Folder size={48} className="mb-3 opacity-50" />
              <p>{t.noItems}</p>
            </div>
          )}
          
          {/* Status Bar */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <span>
              {filteredContents.length} {t.items}
              {selectedItem && ` • 1 ${t.selected}`}
            </span>
            <span>
              {filteredContents.filter(i => i.type === 'folder').length} {language === 'es' ? 'carpetas' : 'pastas'},{' '}
              {filteredContents.filter(i => i.type === 'file').length} {language === 'es' ? 'archivos' : 'arquivos'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ 
  icon, 
  label, 
  active, 
  badge 
}: { 
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string
}) {
  return (
    <button className={`
      w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors
      ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}
    `}>
      <div className="flex items-center gap-2 truncate">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className="text-xs text-gray-500 shrink-0 ml-2">{badge}</span>
      )}
    </button>
  )
}
