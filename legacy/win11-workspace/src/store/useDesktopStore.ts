import { create } from 'zustand'

export interface WindowState {
  id: string
  appId: string
  title: string
  icon: string
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

export interface DesktopApp {
  id: string
  name: string
  namePt?: string
  icon: string
  component: string
  defaultWidth: number
  defaultHeight: number
  minWidth: number
  minHeight: number
  color: string
}

interface DesktopStore {
  // Windows
  windows: WindowState[]
  activeWindowId: string | null
  nextZIndex: number
  
  // UI State
  isStartMenuOpen: boolean
  language: 'es' | 'pt'
  
  // Actions
  openWindow: (appId: string, app: DesktopApp) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  
  // Start Menu
  toggleStartMenu: () => void
  closeStartMenu: () => void
  
  // Language
  toggleLanguage: () => void
  setLanguage: (lang: 'es' | 'pt') => void
}

// Calculate initial window position with offset to prevent overlap
const calculateInitialPosition = (
  index: number,
  width: number,
  height: number
): { x: number; y: number } => {
  const offsetX = (index % 5) * 30
  const offsetY = Math.floor(index / 5) * 30
  const baseX = 100 + offsetX
  const baseY = 50 + offsetY
  
  return {
    x: Math.min(baseX, window.innerWidth - width - 50),
    y: Math.min(baseY, window.innerHeight - height - 100)
  }
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,
  isStartMenuOpen: false,
  language: 'es',
  
  openWindow: (appId, app) => {
    const state = get()
    
    // Check if window already exists
    const existingWindow = state.windows.find(w => w.appId === appId)
    if (existingWindow) {
      // Focus existing window and restore if minimized
      get().focusWindow(existingWindow.id)
      if (existingWindow.isMinimized) {
        set({ windows: state.windows.map(w => 
          w.id === existingWindow.id ? { ...w, isMinimized: false } : w
        )})
      }
      return
    }
    
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const position = calculateInitialPosition(
      state.windows.length,
      app.defaultWidth,
      app.defaultHeight
    )
    
    const newWindow: WindowState = {
      id,
      appId,
      title: app.name,
      icon: app.icon,
      x: position.x,
      y: position.y,
      width: app.defaultWidth,
      height: app.defaultHeight,
      minWidth: app.minWidth,
      minHeight: app.minHeight,
      isMinimized: false,
      isMaximized: false,
      zIndex: state.nextZIndex
    }
    
    set({
      windows: [...state.windows, newWindow],
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
      isStartMenuOpen: false
    })
  },
  
  closeWindow: (id) => {
    const state = get()
    const newWindows = state.windows.filter(w => w.id !== id)
    const newActiveId = state.activeWindowId === id 
      ? newWindows.length > 0 
        ? newWindows.reduce((prev, curr) => prev.zIndex > curr.zIndex ? prev : curr).id
        : null
      : state.activeWindowId
    
    set({
      windows: newWindows,
      activeWindowId: newActiveId
    })
  },
  
  minimizeWindow: (id) => {
    set({
      windows: get().windows.map(w =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: get().activeWindowId === id ? null : get().activeWindowId
    })
  },
  
  maximizeWindow: (id) => {
    set({
      windows: get().windows.map(w =>
        w.id === id ? { ...w, isMaximized: true } : w
      )
    })
  },
  
  restoreWindow: (id) => {
    set({
      windows: get().windows.map(w =>
        w.id === id ? { ...w, isMaximized: false } : w
      )
    })
  },
  
  focusWindow: (id) => {
    const state = get()
    set({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1
    })
  },
  
  updateWindowPosition: (id, x, y) => {
    set({
      windows: get().windows.map(w =>
        w.id === id ? { ...w, x, y } : w
      )
    })
  },
  
  updateWindowSize: (id, width, height) => {
    set({
      windows: get().windows.map(w =>
        w.id === id ? { ...w, width, height } : w
      )
    })
  },
  
  toggleStartMenu: () => {
    set({ isStartMenuOpen: !get().isStartMenuOpen })
  },
  
  closeStartMenu: () => {
    set({ isStartMenuOpen: false })
  },
  
  toggleLanguage: () => {
    set({ language: get().language === 'es' ? 'pt' : 'es' })
  },
  
  setLanguage: (lang) => {
    set({ language: lang })
  }
}))

// Available apps registry
export const availableApps: DesktopApp[] = [
  {
    id: 'course-explorer',
    name: 'Aprende IA',
    namePt: 'Aprender IA',
    icon: 'GraduationCap',
    component: 'CourseExplorer',
    defaultWidth: 900,
    defaultHeight: 600,
    minWidth: 600,
    minHeight: 400,
    color: '#0078d4'
  },
  {
    id: 'cv-creator',
    name: 'Creador CV',
    namePt: 'Criador CV',
    icon: 'FileText',
    component: 'CVCreator',
    defaultWidth: 800,
    defaultHeight: 650,
    minWidth: 500,
    minHeight: 450,
    color: '#107c10'
  },
  {
    id: 'pdf-converter',
    name: 'Conversor PDF',
    namePt: 'Conversor PDF',
    icon: 'FileOutput',
    component: 'PDFConverter',
    defaultWidth: 700,
    defaultHeight: 550,
    minWidth: 450,
    minHeight: 350,
    color: '#d83b01'
  },
  {
    id: 'file-explorer',
    name: 'Explorador',
    namePt: 'Explorador',
    icon: 'FolderOpen',
    component: 'FileExplorer',
    defaultWidth: 850,
    defaultHeight: 550,
    minWidth: 500,
    minHeight: 350,
    color: '#ff8c00'
  },
  {
    id: 'notepad',
    name: 'Bloc de notas',
    namePt: 'Bloco de notas',
    icon: 'FileEdit',
    component: 'Notepad',
    defaultWidth: 650,
    defaultHeight: 500,
    minWidth: 400,
    minHeight: 300,
    color: '#5c5c5c'
  },
  {
    id: 'settings',
    name: 'Configuración',
    namePt: 'Configurações',
    icon: 'Settings',
    component: 'Settings',
    defaultWidth: 700,
    defaultHeight: 550,
    minWidth: 500,
    minHeight: 400,
    color: '#0078d4'
  }
]
