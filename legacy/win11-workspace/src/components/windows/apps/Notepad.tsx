'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  FileEdit,
  Save,
  Copy,
  Scissors,
  Clipboard,
  Undo2,
  Redo2,
  Search,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Bold,
  Italic,
  Underline
} from 'lucide-react'
import { WithWindowIdProps } from '../Window'

export function Notepad({ windowId }: WithWindowIdProps) {
  const [content, setContent] = useState('')
  const [fileName, setFileName] = useState('Sin título')
  const [isModified, setIsModified] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [language, setLanguage] = useState<'es' | 'pt'>('es')
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  useEffect(() => {
    if (isModified) {
      document.title = `${fileName}* - Bloc de notas`
    }
  }, [isModified, fileName])
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsModified(true)
  }
  
  const handleSave = () => {
    // Simulate save
    setIsModified(false)
    // In a real app, this would trigger file download or API call
  }
  
  const handleNew = () => {
    if (isModified) {
      if (confirm(language === 'es' ? '¿Desea guardar los cambios?' : 'Deseja salvar as alterações?')) {
        handleSave()
      }
    }
    setContent('')
    setFileName('Sin título')
    setIsModified(false)
  }
  
  const t = language === 'es' ? {
    title: 'Bloc de notas',
    new: 'Nuevo',
    open: 'Abrir',
    save: 'Guardar',
    undo: 'Deshacer',
    redo: 'Rehacer',
    cut: 'Cortar',
    copy: 'Copiar',
    paste: 'Pegar',
    find: 'Buscar',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    wordWrap: 'Ajuste de línea',
    statusBar: 'Barra de estado',
    font: 'Fuente',
    line: 'Línea',
    column: 'Columna',
    chars: 'Caracteres',
    words: 'Palabras'
  } : {
    title: 'Bloco de notas',
    new: 'Novo',
    open: 'Abrir',
    save: 'Salvar',
    undo: 'Desfazer',
    redo: 'Refazer',
    cut: 'Cortar',
    copy: 'Copiar',
    paste: 'Colar',
    find: 'Pesquisar',
    zoomIn: 'Ampliar',
    zoomOut: 'Reduzir',
    wordWrap: 'Quebra de linha',
    statusBar: 'Barra de status',
    font: 'Fonte',
    line: 'Linha',
    column: 'Coluna',
    chars: 'Caracteres',
    words: 'Palavras'
  }

  // Calculate stats
  const lines = content.split('\n').length
  const charCount = content.length
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  
  // Update cursor position on selection change
  const handleCursorPositionChange = () => {
    if (!textareaRef.current) return
    const pos = textareaRef.current.selectionStart
    const textBeforeCursor = content.substring(0, pos)
    const linesBeforeCursor = textBeforeCursor.split('\n')
    setCursorPos({
      line: linesBeforeCursor.length,
      col: linesBeforeCursor[linesBeforeCursor.length - 1].length + 1
    })
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50">
        <button
          onClick={handleNew}
          className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors"
        >
          {t.new}
        </button>
        <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors">
          {t.open}
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 text-sm hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
        >
          <Save size={14} />
          {t.save}
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
          <Undo2 size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors opacity-50">
          <Redo2 size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-1.5 hover:bg-gray-200 rounded transition-colors ${showSearch ? 'bg-blue-100 text-blue-600' : ''}`}
        >
          <Search size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button 
          onClick={() => setFontSize(Math.max(10, fontSize - 2))}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs text-gray-600 min-w-[30px] text-center">{fontSize}</span>
        <button 
          onClick={() => setFontSize(Math.min(32, fontSize + 2))}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
        >
          <ZoomIn size={16} />
        </button>
        
        <div className="ml-auto flex items-center gap-2">
          <button 
            onClick={() => setLanguage(language === 'es' ? 'pt' : 'es')}
            className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            {language.toUpperCase()}
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border-b border-yellow-200">
          <Search size={16} className="text-yellow-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t.find}...`}
            className="flex-1 px-2 py-1 border border-yellow-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            autoFocus
          />
          <span className="text-xs text-gray-500">
            {searchTerm ? (
              content.toLowerCase().split(searchTerm.toLowerCase()).length - 1
            ) : 0}{' '}
            resultados
          </span>
          <button
            onClick={() => setShowSearch(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50">
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title={t.cut}>
          <Scissors size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title={t.copy}>
          <Copy size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title={t.paste}>
          <Clipboard size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Negrita">
          <Bold size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Cursiva">
          <Italic size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Subrayado">
          <Underline size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <select 
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="text-xs border border-gray-300 rounded px-1 py-0.5"
        >
          {[10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyUp={handleCursorPositionChange}
          onClick={handleCursorPositionChange}
          placeholder={language === 'es' ? 'Escribe aquí...' : 'Escreva aqui...'}
          spellCheck={false}
          className="
            absolute inset-0 w-full h-full p-4 resize-none outline-none
            font-mono text-gray-800 bg-[#ffffff]
            leading-relaxed
          "
          style={{ fontSize: `${fontSize}px`, tabSize: 4 }}
        />
        
        {/* Line Numbers Overlay */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-end pr-2 pt-4 select-none pointer-events-none overflow-hidden"
          style={{ fontSize: `${fontSize}px` }}
        >
          {Array.from({ length: Math.min(lines, 100) }, (_, i) => (
            <div key={i} className="text-gray-400 leading-relaxed text-right">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-100 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>{t.line}: {cursorPos.line}</span>
          <span>{t.column}: {cursorPos.col}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{t.words}: {wordCount}</span>
          <span>{t.chars}: {charCount}</span>
          <span>{language === 'es' ? 'UTF-8' : 'UTF-8'}</span>
          {isModified && (
            <span className="text-orange-500">● Modificado</span>
          )}
        </div>
      </div>
    </div>
  )
}
