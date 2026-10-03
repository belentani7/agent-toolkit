'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, Star, Clock, Users, BookOpen, PlayCircle, CheckCircle2,
  ArrowRight, ArrowLeft, GraduationCap, Sparkles, TrendingUp, Heart,
  Home, Grid3X3, List, ChevronDown, ChevronRight, Copy, Printer,
  ZoomIn, ZoomOut, RotateCcw, Trophy, Flame, Target, Award, Share2,
  Download, X, Menu, LayoutGrid, Settings, User as UserIcon, BarChart3,
  Bookmark, Check, AlertCircle, Lightbulb, PenTool, Gem, AlertTriangle,
  Globe, Volume2, VolumeX, Eye, EyeOff, RefreshCw, ChevronLeft,
  FolderOpen, FileText, Layers, Calendar, Medal, Zap, BookMarked
} from 'lucide-react'
import { WithWindowIdProps } from '../Window'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  courses, categories, defaultProgress, achievements, 
  type Course, type Modulo, type Lesson, type UserProgress, type Achievement,
  type Category 
} from '@/data/courseData'

// Types for view states
type ViewState = 'home' | 'catalog' | 'course-detail' | 'module-view' | 'lesson-view' | 'search'
type SortOption = 'popular' | 'newest' | 'alphabetical' | 'progress'
type ViewMode = 'grid' | 'list'

// LocalStorage keys
const STORAGE_KEY = 'manos-abiertas-progress'
const SEARCH_HISTORY_KEY = 'manos-abiertas-search-history'

// Helper functions
const loadProgress = (): UserProgress => {
  if (typeof window === 'undefined') return defaultProgress
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultProgress
  } catch {
    return defaultProgress
  }
}

const saveProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.error('Error saving progress:', e)
  }
}

const loadSearchHistory = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveSearchHistory = (history: string[]) => {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, 10)))
  } catch (e) {
    console.error('Error saving search history:', e)
  }
}

// Translations
const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    catalog: 'Catálogo',
    search: 'Buscar',
    back: 'Volver',
    
    // Header
    title: 'Manos Abiertas',
    subtitle: 'Plataforma de Aprendizaje para Todos',
    welcome: 'Bienvenido/a',
    searchPlaceholder: 'Buscar cursos, lecciones, conceptos...',
    
    // Dashboard stats
    coursesStarted: 'Cursos iniciados',
    lessonsCompleted: 'Lecciones completadas',
    hoursLearned: 'Horas aprendidas',
    continueLearning: 'Continuar Aprendiendo',
    noProgress: 'Aún no has empezado. ¡Elige un curso!',
    
    // Featured
    featured: 'Destacados',
    recommendedForTi: 'Recomendado para ti',
    recentActivity: 'Actividad Reciente',
    noActivity: 'Sin actividad reciente',
    
    // Catalog
    allCourses: 'Todos los Cursos',
    filterBy: 'Filtrar por',
    sortBy: 'Ordenar por',
    category: 'Categoría',
    difficulty: 'Dificultad',
    duration: 'Duración',
    language: 'Idioma',
    allCategories: 'Todas las categorías',
    allLevels: 'Todos los niveles',
    allDurations: 'Todas las duraciones',
    popular: 'Popular',
    newest: 'Más recientes',
    alphabetical: 'Alfabético',
    byProgress: 'Por progreso',
    grid: 'Cuadrícula',
    list: 'Lista',
    coursesFound: 'cursos encontrados',
    noResults: 'No se encontraron resultados',
    
    // Difficulty levels
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    expert: 'Experto',
    
    // Course detail
    modules: 'Módulos',
    lessons: 'lecciones',
    startCourse: 'Comenzar Curso',
    continueCourse: 'Continuar Curso',
    shareCourse: 'Compartir',
    downloadMaterials: 'Descargar Materiales',
    courseOverview: 'Resumen del Curso',
    provider: 'Proveedor',
    estimatedTime: 'Tiempo estimado',
    certificateAvailable: 'Certificado disponible al completar',
    
    // Module/Lesson
    lesson: 'Lección',
    of: 'de',
    markComplete: 'Marcar como completada',
    completed: 'Completada',
    inProgress: 'En progreso',
    notStarted: 'No comenzada',
    nextLesson: 'Siguiente Lección',
    previousLesson: 'Lección Anterior',
    
    // Lesson blocks
    objetivo: 'OBJETIVO',
    conceptoClave: 'CONCEPTO CLAVE',
    pasoAPaso: 'PASO A PASO',
    ejercicioPractico: 'EJERCICIO PRÁCTICO',
    doraDeOro: 'DORA DE ORO',
    errorComun: 'ERROR COMÚN',
    copyPrompt: 'Copiar prompt',
    copied: '¡Copiado!',
    printLesson: 'Imprimir lección',
    
    // Accessibility
    increaseFont: 'Aumentar texto',
    decreaseFont: 'Disminuir texto',
    resetFont: 'Restablecer texto',
    
    // Achievements
    achievements: 'Logros',
    newAchievement: '¡Nuevo Logro!',
    streakDays: 'días seguidos',
    
    // Download modal
    downloadTitle: 'Descargar Materiales del Curso',
    downloadDescription: 'Selecciona qué materiales deseas descargar:',
    downloadAll: 'Todo el curso',
    downloadModule: 'Módulo actual',
    downloadPDF: 'Guía en PDF',
    downloadChecklist: 'Lista de verificación',
    
    // Empty states
    selectLesson: 'Selecciona una lección para comenzar',
    keepLearning: '¡Sigue aprendiendo!',
    
    // Edit name
    editName: 'Editar nombre',
    yourName: 'Tu nombre',
    save: 'Guardar',
    cancel: 'Cancelar'
  },
  pt: {
    // Navigation
    home: 'Início',
    catalog: 'Catálogo',
    search: 'Pesquisar',
    back: 'Voltar',
    
    // Header
    title: 'Manos Abertas',
    subtitle: 'Plataforma de Aprendizado para Todos',
    welcome: 'Bem-vindo(a)',
    searchPlaceholder: 'Pesquisar cursos, lições, conceitos...',
    
    // Dashboard stats
    coursesStarted: 'Cursos iniciados',
    lessonsCompleted: 'Lições concluídas',
    hoursLearned: 'Horas aprendidas',
    continueLearning: 'Continuar Aprendendo',
    noProgress: 'Ainda não começou. Escolha um curso!',
    
    // Featured
    featured: 'Destaques',
    recommendedForTi: 'Recomendado para você',
    recentActivity: 'Atividade Recente',
    noActivity: 'Sem atividade recente',
    
    // Catalog
    allCourses: 'Todos os Cursos',
    filterBy: 'Filtrar por',
    sortBy: 'Ordenar por',
    category: 'Categoria',
    difficulty: 'Dificuldade',
    duration: 'Duração',
    language: 'Idioma',
    allCategories: 'Todas as categorias',
    allLevels: 'Todos os níveis',
    allDurations: 'Todas as durações',
    popular: 'Popular',
    newest: 'Mais recentes',
    alphabetical: 'Alfabético',
    byProgress: 'Por progresso',
    grid: 'Grade',
    list: 'Lista',
    coursesFound: 'cursos encontrados',
    noResults: 'Nenhum resultado encontrado',
    
    // Difficulty levels
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    expert: 'Especialista',
    
    // Course detail
    modules: 'Módulos',
    lessons: 'lições',
    startCourse: 'Começar Curso',
    continueCourse: 'Continuar Curso',
    shareCourse: 'Compartilhar',
    downloadMaterials: 'Baixar Materiais',
    courseOverview: 'Resumo do Curso',
    provider: 'Fornecedor',
    estimatedTime: 'Tempo estimado',
    certificateAvailable: 'Certificado disponível ao concluir',
    
    // Module/Lesson
    lesson: 'Lição',
    of: 'de',
    markComplete: 'Marcar como concluída',
    completed: 'Concluída',
    inProgress: 'Em andamento',
    notStarted: 'Não começada',
    nextLesson: 'Próxima Lição',
    previousLesson: 'Lição Anterior',
    
    // Lesson blocks
    objetivo: 'OBJETIVO',
    conceptoClave: 'CONCEITO-CHAVE',
    pasoAPasso: 'PASSO A PASSO',
    ejercicioPractico: 'EXERCÍCIO PRÁTICO',
    doraDeOro: 'DOURADA DICA',
    errorComum: 'ERRO COMUM',
    copyPrompt: 'Copiar prompt',
    copied: 'Copiado!',
    printLesson: 'Imprimir lição',
    
    // Accessibility
    increaseFont: 'Aumentar texto',
    decreaseFont: 'Diminuir texto',
    resetFont: 'Restaurar texto',
    
    // Achievements
    achievements: 'Conquistas',
    newAchievement: 'Nova Conquista!',
    streakDays: 'dias seguidos',
    
    // Download modal
    downloadTitle: 'Baixar Materiais do Curso',
    downloadDescription: 'Selecione quais materiais deseja baixar:',
    downloadAll: 'Curso completo',
    downloadModule: 'Módulo atual',
    downloadPDF: 'Guia em PDF',
    downloadChecklist: 'Lista de verificação',
    
    // Empty states
    selectLesson: 'Selecione uma lição para começar',
    keepLearning: 'Continue aprendendo!',
    
    // Edit name
    editName: 'Editar nome',
    yourName: 'Seu nome',
    save: 'Salvar',
    cancel: 'Cancelar'
  }
}

// Level color mapping
const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  principiante: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  intermedio: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  avanzado: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  expert: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
}

// Main Component
export function CourseExplorer({ windowId }: WithWindowIdProps) {
  // Core state (lazy initialization from localStorage)
  const [view, setView] = useState<ViewState>('home')
  const [language, setLanguage] = useState<'es' | 'pt'>(() => {
    if (typeof window === 'undefined') return 'es'
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved).language || 'es') : 'es'
    } catch { return 'es' }
  })
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window === 'undefined') return defaultProgress
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultProgress
    } catch { return defaultProgress }
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ course: Course; modulo?: Modulo; lesson?: Lesson }[]>([])
  
  // Catalog state
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedDuration, setSelectedDuration] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  // Course/Module/Lesson state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [expandedModules, setExpandedModules] = useState<number[]>([])
  
  // UI state
  const [fontSize, setFontSize] = useState(16)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showEditNameModal, setShowEditNameModal] = useState(false)
  const [tempUserName, setTempUserName] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showSearchInContent, setShowSearchInContent] = useState(false)
  const [copiedText, setCopiedText] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get current translation
  const t = useMemo(() => translations[language], [language])

  // Save progress when it changes
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // Search function (defined before the useEffect that uses it)
  const performSearch = useCallback((query: string) => {
    const results: { course: Course; modulo?: Modulo; lesson?: Lesson }[] = []
    const lowerQuery = query.toLowerCase()
    
    courses.forEach(course => {
      // Search in course title
      const courseTitle = language === 'es' ? course.titulo : course.tituloPt
      const courseDesc = language === 'es' ? course.descripcion : course.descripcionPt
      
      if (courseTitle.toLowerCase().includes(lowerQuery) || 
          courseDesc.toLowerCase().includes(lowerQuery)) {
        results.push({ course })
      }
      
      // Search in modules and lessons if content search enabled
      if (showSearchInContent && course.modulosData) {
        course.modulosData.forEach(modulo => {
          const modTitle = language === 'es' ? modulo.titulo : modulo.tituloPt
          
          if (modTitle.toLowerCase().includes(lowerQuery)) {
            results.push({ course, modulo })
          }
          
          modulo.lessons.forEach(lesson => {
            const lesTitle = language === 'es' ? lesson.titulo : lesson.tituloPt
            const contenido = language === 'es' ? lesson.contenido : (lesson as any).contenidoPt
            
            if (lesTitle.toLowerCase().includes(lowerQuery) ||
                contenido.objetivo.toLowerCase().includes(lowerQuery) ||
                contenido.conceptoClave.toLowerCase().includes(lowerQuery)) {
              results.push({ course, modulo, lesson })
            }
          })
        })
      }
    })
    
    setSearchResults(results)
    
    // Update search history
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory].slice(0, 10)
      setSearchHistory(newHistory)
      saveSearchHistory(newHistory)
    }
  }, [language, showSearchInContent, searchHistory])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, showSearchInContent, performSearch])

  // Calculate course progress (defined before filteredCourses which uses it)
  const getCourseProgress = useCallback((courseId: string): number => {
    const courseLessons = progress.completedLessons.filter(l => l.startsWith(courseId))
    const course = courses.find(c => c.id === courseId)
    if (!course || !course.leccionesTotales) return 0
    const totalLessons = parseInt(course.leccionesTotales)
    return Math.round((courseLessons.length / totalLessons) * 100)
  }, [progress.completedLessons])

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let filtered = [...courses]
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.categoria === selectedCategory)
    }
    
    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(c => c.nivel === selectedDifficulty)
    }
    
    // Duration filter
    if (selectedDuration !== 'all') {
      const hours = parseInt(selectedDuration)
      filtered = filtered.filter(c => {
        const courseHours = parseInt(c.duracionTotal)
        if (selectedDuration === 'short') return courseHours <= 10
        if (selectedDuration === 'medium') return courseHours > 10 && courseHours <= 20
        if (selectedDuration === 'long') return courseHours > 20
        return true
      })
    }
    
    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.popularidad - a.popularidad)
        break
      case 'alphabetical':
        filtered.sort((a, b) => 
          (language === 'es' ? a.titulo : a.tituloPt).localeCompare(
            language === 'es' ? b.titulo : b.tituloPt
          )
        )
        break
      case 'progress':
        filtered.sort((a, b) => {
          const progressA = getCourseProgress(a.id)
          const progressB = getCourseProgress(b.id)
          return progressB - progressA
        })
        break
    }
    
    return filtered
  }, [selectedCategory, selectedDifficulty, selectedDuration, sortBy, language, getCourseProgress])

  // Get last viewed course for "continue learning"
  const lastCourse = useMemo(() => {
    if (!progress.lastPosition) return null
    return courses.find(c => c.id === progress.lastPosition.courseId) || null
  }, [progress.lastPosition])

  // Mark lesson as complete
  const markLessonComplete = useCallback((courseId: string, moduleId: number, lessonId: number) => {
    const lessonKey = `${courseId}-${moduleId}-${lessonId}`
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonKey)) return prev
      
      const newCompleted = [...prev.completedLessons, lessonKey]
      const newAchievementsList = [...prev.achievements]
      
      // Check for new achievements
      achievements.forEach(achievement => {
        if (!newAchievementsList.includes(achievement.id)) {
          const testProgress = { ...prev, completedLessons: newCompleted }
          if (achievement.condicion(testProgress)) {
            newAchievementsList.push(achievement.id)
            setNewAchievement(achievement)
            setTimeout(() => setNewAchievement(null), 5000)
          }
        }
      })
      
      return {
        ...prev,
        completedLessons: newCompleted,
        lastPosition: { courseId, moduleId, lessonId },
        timeSpent: prev.timeSpent + 10, // Estimate 10 min per lesson
        achievements: newAchievementsList,
        lastActiveDate: new Date().toISOString().split('T')[0],
        coursesStarted: prev.coursesStarted.includes(courseId) 
          ? prev.coursesStarted 
          : [...prev.coursesStarted, courseId]
      }
    })
  }, [])

  // Navigate to lesson
  const openLesson = useCallback((course: Course, modulo: Modulo, lesson: Lesson) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedCourse(course)
      setSelectedModulo(modulo)
      setSelectedLesson(lesson)
      setView('lesson-view')
      setIsLoading(false)
    }, 300)
  }, [])

  // Navigation handlers
  const goToHome = () => setView('home')
  const goToCatalog = () => setView('catalog')
  const goToCourseDetail = (course: Course) => {
    setSelectedCourse(course)
    setView('course-detail')
  }
  const goToModuleView = (course: Course, modulo: Modulo) => {
    setSelectedCourse(course)
    setSelectedModulo(modulo)
    setView('module-view')
  }

  // Toggle module expansion
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(true)
      setTimeout(() => setCopiedText(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Print lesson
  const printLesson = () => {
    window.print()
  }

  // Update username
  const updateUserName = () => {
    if (tempUserName.trim()) {
      setProgress(prev => ({ ...prev, userName: tempUserName.trim() }))
      setShowEditNameModal(false)
    }
  }

  // Render header
  const renderHeader = () => (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 md:p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"
            >
              <GraduationCap size={28} />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t.title}</h1>
              <p className="text-sm text-white/80 hidden sm:block">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newLang = language === 'es' ? 'pt' : 'es'
                setLanguage(newLang)
                setProgress(prev => ({ ...prev, language: newLang }))
              }}
              className="text-white hover:bg-white/20 font-medium"
            >
              <Globe size={16} className="mr-1" />
              {language === 'es' ? 'ES' : 'PT'}
            </Button>
            
            {/* User name & settings */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTempUserName(progress.userName)
                      setShowEditNameModal(true)
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <UserIcon size={18} className="mr-1" />
                    <span className="hidden md:inline max-w-[100px] truncate">
                      {progress.userName}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.editName}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Achievements button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 relative"
                  >
                    <Trophy size={18} />
                    {progress.achievements.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-yellow-900 text-xs rounded-full flex items-center justify-center font-bold">
                        {progress.achievements.length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.achievements}: {progress.achievements.length}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-gray-800 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-white/30 text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          )}
          
          {/* Search results dropdown */}
          {searchQuery.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96"
            >
              {/* Search in content toggle */}
              <div className="p-3 border-b flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <Checkbox
                    checked={showSearchInContent}
                    onCheckedChange={(checked) => setShowSearchInContent(checked as boolean)}
                  />
                  Buscar también en contenido
                </label>
                <span className="text-xs text-gray-400">{searchResults.length} resultados</span>
              </div>
              
              <ScrollArea className="max-h-80">
                {searchResults.slice(0, 10).map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (result.lesson) {
                        openLesson(result.course, result.modulo!, result.lesson)
                      } else if (result.modulo) {
                        goToModuleView(result.course, result.modulo)
                      } else {
                        goToCourseDetail(result.course)
                      }
                      setSearchQuery('')
                    }}
                    className="w-full p-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-0"
                  >
                    <BookOpen size={16} className="mt-1 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {language === 'es' ? result.course.titulo : result.course.tituloPt}
                      </p>
                      {result.modulo && (
                        <p className="text-sm text-gray-500 truncate">
                          → {language === 'es' ? result.modulo.titulo : result.modulo.tituloPt}
                        </p>
                      )}
                      {result.lesson && (
                        <p className="text-sm text-blue-600 truncate">
                          → {language === 'es' ? result.lesson.titulo : result.lesson.tituloPt}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
                
                {searchResults.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                    <p>{t.noResults}</p>
                  </div>
                )}
              </ScrollArea>
              
              {/* Recent searches */}
              {!showSearchInContent && searchHistory.length > 0 && searchResults.length === 0 && (
                <div className="p-3 border-t bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Búsquedas recientes</p>
                  <div className="flex flex-wrap gap-1">
                    {searchHistory.slice(0, 5).map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchQuery(term)}
                        className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 hover:bg-gray-100 border"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )

  // Render navigation tabs
  const renderNavigation = () => (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs value={view} onValueChange={(v) => setView(v as ViewState)}>
          <TabsList className="bg-transparent h-auto p-0 gap-1">
            <TabsTrigger
              value="home"
              className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none rounded-none"
            >
              <Home size={16} className="mr-2" />
              {t.home}
            </TabsTrigger>
            <TabsTrigger
              value="catalog"
              className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none rounded-none"
            >
              <LayoutGrid size={16} className="mr-2" />
              {t.catalog}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </nav>
  )

  // Render dashboard/home view
  const renderDashboard = () => (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {t.welcome}, {progress.userName}! 👋
            </h2>
            <p className="text-gray-600 mt-1">
              {t.continueLearning} • {progress.streakDays} {t.streakDays} 🔥
            </p>
          </div>
          
          {/* Continue learning button */}
          {lastCourse && (
            <Button
              onClick={() => goToCourseDetail(lastCourse)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <PlayCircle size={24} className="mr-2" />
              {t.continueLearning}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: t.coursesStarted, value: progress.coursesStarted.length, color: 'from-blue-500 to-cyan-500' },
          { icon: CheckCircle2, label: t.lessonsCompleted, value: progress.completedLessons.length, color: 'from-green-500 to-emerald-500' },
          { icon: Clock, label: t.hoursLearned, value: Math.round(progress.timeSpent / 60), color: 'from-orange-500 to-amber-500' },
          { icon: Flame, label: t.streakDays, value: progress.streakDays, color: 'from-red-500 to-pink-500' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className={`p-4 bg-gradient-to-br ${stat.color}`}>
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm opacity-90">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon size={40} className="opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Featured courses carousel */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Star size={22} className="text-yellow-500 fill-yellow-500" />
            {t.featured}
          </h3>
          <Button variant="ghost" onClick={goToCatalog}>
            Ver todos <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {courses.filter(c => c.destacado).map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -5 }}
                className="flex-shrink-0 w-72 md:w-80"
              >
                <CourseCard
                  course={course}
                  language={language}
                  progress={getCourseProgress(course.id)}
                  onSelect={() => goToCourseDetail(course)}
                  t={t}
                />
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Recent activity & Quick access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              {t.recentActivity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.completedLessons.length > 0 ? (
              <div className="space-y-3">
                {progress.completedLessons.slice(-5).reverse().map((lessonKey, idx) => {
                  const [courseId, moduleId, lessonId] = lessonKey.split('-').map(Number)
                  const course = courses.find(c => c.id === courseId.toString())
                  if (!course?.modulosData) return null
                  const modulo = course.modulosData.find(m => m.numero === moduleId)
                  const lesson = modulo?.lessons.find(l => l.numero === lessonId)
                  
                  return (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {lesson ? (language === 'es' ? lesson.titulo : lesson.tituloPt) : 'Lección'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course ? (language === 'es' ? course.titulo : course.tituloPt) : ''}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                <p>{t.noActivity}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories quick access */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen size={18} className="text-purple-500" />
              {t.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id)
                    goToCatalog()
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{cat.icono}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'es' ? cat.nombre : cat.nombrePt}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements preview */}
      {progress.achievements.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy size={18} className="text-yellow-600" />
              {t.achievements}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {progress.achievements.map((achId) => {
                const achievement = achievements.find(a => a.id === achId)
                if (!achievement) return null
                return (
                  <motion.div
                    key={achId}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"
                  >
                    <span className="text-xl">{achievement.icono}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'es' ? achievement.titulo : achievement.tituloPt}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Render catalog view
  const renderCatalog = () => (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t.category} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCategories}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="mr-2">{cat.icono}</span>
                  {language === 'es' ? cat.nombre : cat.nombrePt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty filter */}
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.difficulty} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allLevels}</SelectItem>
              <SelectItem value="principiante">{t.beginner}</SelectItem>
              <SelectItem value="intermedio">{t.intermediate}</SelectItem>
              <SelectItem value="avanzado">{t.advanced}</SelectItem>
              <SelectItem value="experto">{t.expert}</SelectItem>
            </SelectContent>
          </Select>

          {/* Duration filter */}
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t.duration} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allDurations}</SelectItem>
              <SelectItem value="short">≤ 10h</SelectItem>
              <SelectItem value="medium">10-20h</SelectItem>
              <SelectItem value="long">&gt; 20h</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{t.popular}</SelectItem>
              <SelectItem value="newest">{t.newest}</SelectItem>
              <SelectItem value="alphabetical">{t.alphabetical}</SelectItem>
              <SelectItem value="progress">{t.byProgress}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="px-3"
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="px-3"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-800">{filteredCourses.length}</span> {t.coursesFound}
        </p>
        
        {/* Clear filters button */}
        {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedDuration !== 'all') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('all')
              setSelectedDifficulty('all')
              setSelectedDuration('all')
            }}
          >
            <RefreshCw size={14} className="mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Course grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CourseCard
                course={course}
                language={language}
                progress={getCourseProgress(course.id)}
                onSelect={() => goToCourseDetail(course)}
                t={t}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <CourseListItem
                course={course}
                language={language}
                progress={getCourseProgress(course.id)}
                onSelect={() => goToCourseDetail(course)}
                t={t}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* No results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <Search size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{t.noResults}</h3>
          <p className="text-gray-500">Intenta cambiar los filtros o buscar otro término</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedCategory('all')
              setSelectedDifficulty('all')
              setSelectedDuration('all')
              setSearchQuery('')
            }}
          >
            Limpiar todo
          </Button>
        </div>
      )}
    </div>
  )

  // Render course detail view
  const renderCourseDetail = () => {
    if (!selectedCourse) return null
    
    const courseProgress = getCourseProgress(selectedCourse.id)
    const courseTitle = language === 'es' ? selectedCourse.titulo : selectedCourse.tituloPt
    const courseDesc = language === 'es' ? selectedCourse.descripcion : selectedCourse.descripcionPt
    
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={goToCatalog}
          className="mb-4 -ml-2"
        >
          <ChevronLeft size={18} className="mr-1" />
          {t.back}
        </Button>

        {/* Course header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`bg-gradient-to-br ${selectedCourse.colorGradiente} rounded-2xl p-6 md:p-8 text-white mb-6`}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl">{selectedCourse.icono}</span>
                  <Badge 
                    className={`${levelColors[selectedCourse.nivel].bg} ${levelColors[selectedCourse.nivel].text} border ${levelColors[selectedCourse.nivel].border}`}
                  >
                    {t[selectedCourse.nivel]}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3">{courseTitle}</h1>
                <p className="text-white/90 mb-4">{courseDesc}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {selectedCourse.modulos} {t.modules}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText size={16} />
                    {selectedCourse.leccionesTotales} {t.lessons}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {selectedCourse.duracionTotal}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {selectedCourse.proveedor}
                  </span>
                </div>
              </div>
              
              {/* Progress circle */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="white" 
                      strokeWidth="8" 
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - courseProgress / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{courseProgress}%</span>
                    <span className="text-xs opacity-80">Completado</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/20">
              <Button
                size="lg"
                onClick={() => {
                  if (selectedCourse.modulosData?.length) {
                    goToModuleView(selectedCourse, selectedCourse.modulosData[0])
                  }
                }}
                className="bg-white text-gray-800 hover:bg-gray-100 font-semibold px-8"
              >
                {courseProgress > 0 ? t.continueCourse : t.startCourse}
                <PlayCircle size={20} className="ml-2" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white/10"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                <Share2 size={18} className="mr-2" />
                {t.shareCourse}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white/10"
                onClick={() => setShowDownloadModal(true)}
              >
                <Download size={18} className="mr-2" />
                {t.downloadMaterials}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Modules accordion */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Layers size={22} className="text-blue-500" />
            {t.modules} ({selectedCourse.modulos})
          </h2>
          
          {selectedCourse.modulosData && selectedCourse.modulosData.length > 0 ? (
            <Accordion type="multiple" value={expandedModules.map(String)} onValueChange={(vals) => setExpandedModules(vals.map(Number))}>
              {selectedCourse.modulosData.map((modulo) => {
                const modTitle = language === 'es' ? modulo.titulo : modulo.tituloPt
                const modDesc = language === 'es' ? modulo.descripcion : modulo.descripcionPt
                const modProgress = modulo.lessons.filter(l => 
                  progress.completedLessons.includes(`${selectedCourse.id}-${modulo.id}-${l.id}`)
                ).length
                
                return (
                  <AccordionItem key={modulo.id} value={String(modulo.id)} className="border rounded-xl mb-2 px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-10 h-10 rounded-lg ${levelColors[modulo.nivel].bg} flex items-center justify-center`}>
                          <span className={`font-bold ${levelColors[modulo.nivel].text}`}>{modulo.numero}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{modTitle}</h3>
                          <p className="text-sm text-gray-500">{modDesc}</p>
                        </div>
                        <div className="flex items-center gap-3 mr-4">
                          <span className="text-sm text-gray-500">
                            {modProgress}/{modulo.lecciones}
                          </span>
                          <Badge variant="outline" className={`${levelColors[modulo.nivel].text} ${levelColors[modulo.nivel].border}`}>
                            {t[modulo.nivel]}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pl-14 space-y-2">
                        {modulo.lessons.map((lesson) => {
                          const isCompleted = progress.completedLessons.includes(
                            `${selectedCourse.id}-${modulo.id}-${lesson.id}`
                          )
                          const lesTitle = language === 'es' ? lesson.titulo : lesson.tituloPt
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => openLesson(selectedCourse, modulo, lesson)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                              }`}>
                                {isCompleted ? <Check size={16} /> : <BookOpen size={16} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                                  {lesTitle}
                                </p>
                                <p className="text-xs text-gray-500">{lesson.duracion}</p>
                              </div>
                              <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          )
                        })}
                        
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => goToModuleView(selectedCourse, modulo)}
                        >
                          Ver todas las lecciones del módulo
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Layers size={48} className="mx-auto mb-3 opacity-30" />
                <p>Los módulos de este curso estarán disponibles pronto</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Render module view (all lessons in a module)
  const renderModuleView = () => {
    if (!selectedCourse || !selectedModulo) return null
    
    const modTitle = language === 'es' ? selectedModulo.titulo : selectedModulo.tituloPt
    const courseTitle = language === 'es' ? selectedCourse.titulo : selectedCourse.tituloPt
    
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Button variant="ghost" size="sm" onClick={goToCatalog}>{t.catalog}</Button>
          <ChevronRight size={14} />
          <Button variant="ghost" size="sm" onClick={() => goToCourseDetail(selectedCourse)}>
            {courseTitle}
          </Button>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium">{modTitle}</span>
        </div>

        {/* Module header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl ${levelColors[selectedModulo.nivel].bg} flex items-center justify-center`}>
              <span className={`text-2xl font-bold ${levelColors[selectedModulo.nivel].text}`}>
                M{selectedModulo.numero}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{modTitle}</h1>
              <p className="text-gray-600 mt-1">
                {language === 'es' ? selectedModulo.descripcion : selectedModulo.descripcionPt}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FileText size={16} />
                  {selectedModulo.lecciones} {t.lessons}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {selectedModulo.duracionEstimada}
                </span>
                <Badge className={`${levelColors[selectedModulo.nivel].bg} ${levelColors[selectedModulo.nivel].text} border ${levelColors[selectedModulo.nivel].border}`}>
                  {t[selectedModulo.nivel]}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons list */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {t.lessons} ({selectedModulo.lessons.length})
          </h2>
          
          {selectedModulo.lessons.map((lesson, idx) => {
            const isCompleted = progress.completedLessons.includes(
              `${selectedCourse.id}-${selectedModulo.id}-${lesson.id}`
            )
            const lesTitle = language === 'es' ? lesson.titulo : lesson.tituloPt
            
            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => openLesson(selectedCourse, selectedModulo, lesson)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                  isCompleted 
                    ? 'bg-green-50 border border-green-200 hover:border-green-300' 
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : `bg-gradient-to-br ${selectedCourse.colorGradiente} text-white`
                }`}>
                  {isCompleted ? <Check size={24} /> : <span className="font-bold">{lesson.numero}</span>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                    {lesTitle}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {lesson.duracion}
                    </span>
                    <Badge variant="outline" className={`text-xs ${levelColors[lesson.nivel].text} ${levelColors[lesson.nivel].border}`}>
                      {t[lesson.nivel]}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <CheckCircle2 size={24} className="text-green-500" />
                  )}
                  <ArrowRight size={20} className="text-gray-400" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  // Render lesson view (THE CORE FEATURE)
  const renderLessonView = () => {
    if (!selectedCourse || !selectedModulo || !selectedLesson) return null
    
    const contenido = language === 'es' ? selectedLesson.contenido : (selectedLesson.contenido as any).contenidoPt
    const isCompleted = progress.completedLessons.includes(
      `${selectedCourse.id}-${selectedModulo.id}-${selectedLesson.id}`
    )
    
    // Find previous and next lessons
    const currentIdx = selectedModulo.lessons.findIndex(l => l.id === selectedLesson.id)
    const prevLesson = currentIdx > 0 ? selectedModulo.lessons[currentIdx - 1] : null
    const nextLesson = currentIdx < selectedModulo.lessons.length - 1 ? selectedModulo.lessons[currentIdx + 1] : null
    
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/95 backdrop-blur z-30 py-2 -mx-4 px-4 md:-mx-6 md:px-6">
          <Button
            variant="ghost"
            onClick={() => goToModuleView(selectedCourse, selectedModulo)}
          >
            <ChevronLeft size={18} className="mr-1" />
            {t.back}
          </Button>
          
          {/* Font controls */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    disabled={fontSize <= 12}
                    className="h-8 w-8 p-0"
                  >
                    <ZoomOut size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.decreaseFont}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <span className="px-2 text-sm text-gray-600 min-w-[40px] text-center">{fontSize}px</span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    disabled={fontSize >= 24}
                    className="h-8 w-8 p-0"
                  >
                    <ZoomIn size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.increaseFont}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFontSize(16)}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.resetFont}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={printLesson}
                  >
                    <Printer size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.printLesson}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Lesson header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen size={16} />
              <span>{t.lesson} {selectedLesson.numero} {t.of} {selectedModulo.lessons.length}</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-medium">{language === 'es' ? selectedModulo.titulo : selectedModulo.tituloPt}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`${levelColors[selectedLesson.nivel].bg} ${levelColors[selectedLesson.nivel].text} border ${levelColors[selectedLesson.nivel].border}`}>
                {t[selectedLesson.nivel]}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />
                {selectedLesson.duracion}
              </span>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {language === 'es' ? selectedLesson.titulo : selectedLesson.tituloPt}
          </h1>
          
          {/* Complete checkbox */}
          <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => markLessonComplete(
                selectedCourse.id,
                selectedModulo.id,
                selectedLesson.id
              )}
              className="w-6 h-6"
            />
            <span className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
              {isCompleted ? (
                <>
                  <CheckCircle2 size={18} className="inline mr-2 text-green-500" />
                  {t.completed}
                </>
              ) : (
                <>
                  <Target size={18} className="inline mr-2 text-gray-400" />
                  {t.markComplete}
                </>
              )}
            </span>
          </label>
        </motion.div>

        {/* 6-BLOCK LESSON STRUCTURE */}
        <div className="space-y-4">
          {/* Block 1: OBJETIVO */}
          <LessonBlock
            emoji="🎯"
            title={t.objetivo}
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
            iconColor="text-blue-600"
            fontSize={fontSize}
          >
            <p style={{ fontSize: `${fontSize}px` }} className="text-gray-700 leading-relaxed">
              {contenido.objetivo}
            </p>
          </LessonBlock>

          {/* Block 2: CONCEPTO CLAVE */}
          <LessonBlock
            emoji="💡"
            title={t.conceptoClave}
            bgColor="bg-indigo-50"
            borderColor="border-indigo-200"
            iconColor="text-indigo-600"
            fontSize={fontSize}
          >
            <p style={{ fontSize: `${fontSize}px` }} className="text-gray-700 leading-relaxed">
              {contenido.conceptoClave}
            </p>
          </LessonBlock>

          {/* Block 3: PASO A PASO */}
          <LessonBlock
            emoji="📝"
            title={t.pasoAPaso}
            bgColor="bg-emerald-50"
            borderColor="border-emerald-200"
            iconColor="text-emerald-600"
            fontSize={fontSize}
          >
            <ol style={{ fontSize: `${fontSize}px` }} className="list-decimal list-inside space-y-3 text-gray-700">
              {contenido.pasos.map((paso, idx) => (
                <li key={idx} className="leading-relaxed pl-2">
                  <span className="font-medium text-emerald-800">{paso}</span>
                </li>
              ))}
            </ol>
          </LessonBlock>

          {/* Block 4: EJERCICIO PRÁCTICO */}
          <LessonBlock
            emoji="✏️"
            title={t.ejercicioPractico}
            bgColor="bg-slate-800"
            borderColor="border-slate-700"
            iconColor="text-slate-300"
            textColor="text-white"
            fontSize={fontSize}
          >
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm md:text-base mb-3">
              <p style={{ fontSize: `${Math.max(fontSize - 2, 12)}px` }} className="text-green-400 whitespace-pre-wrap">
                {contenido.ejercicioPractico}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(contenido.ejercicioPractico)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {copiedText ? (
                <>
                  <Check size={16} className="mr-2" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  {t.copyPrompt}
                </>
              )}
            </Button>
          </LessonBlock>

          {/* Block 5: DORA DE ORO */}
          <LessonBlock
            emoji="⭐"
            title={t.doraDeOro}
            bgColor="bg-amber-50"
            borderColor="border-amber-300"
            iconColor="text-amber-600"
            fontSize={fontSize}
          >
            <div className="flex gap-3">
              <Gem size={24} className="text-amber-500 flex-shrink-0 mt-1" />
              <p style={{ fontSize: `${fontSize}px` }} className="text-amber-900 leading-relaxed font-medium">
                {contenido.doraDeOro}
              </p>
            </div>
          </LessonBlock>

          {/* Block 6: ERROR COMÚN */}
          <LessonBlock
            emoji="⚠️"
            title={t.errorComun}
            bgColor="bg-red-50"
            borderColor="border-red-200"
            iconColor="text-red-600"
            fontSize={fontSize}
          >
            <div className="flex gap-3">
              <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-1" />
              <p style={{ fontSize: `${fontSize}px` }} className="text-red-800 leading-relaxed">
                {contenido.errorComun}
              </p>
            </div>
          </LessonBlock>
        </div>

        {/* Navigation between lessons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            size="lg"
            disabled={!prevLesson}
            onClick={() => prevLesson && openLesson(selectedCourse, selectedModulo, prevLesson)}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            {t.previousLesson}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {selectedLesson.numero} / {selectedModulo.lessons.length}
            </p>
            <Progress 
              value={(selectedLesson.numero / selectedModulo.lessons.length) * 100} 
              className="w-32 mt-1 h-2"
            />
          </div>
          
          <Button
            size="lg"
            disabled={!nextLesson}
            onClick={() => nextLesson && openLesson(selectedCourse, selectedModulo, nextLesson)}
            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {t.nextLesson}
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    )
  }

  // Main render
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* New achievement toast */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-3xl"
            >
              {newAchievement.icono}
            </motion.span>
            <div>
              <p className="font-bold">{t.newAchievement}</p>
              <p className="text-sm opacity-90">
                {language === 'es' ? newAchievement.titulo : newAchievement.tituloPt}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewAchievement(null)}
              className="text-white hover:bg-white/20 ml-2"
            >
              <X size={16} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      {renderHeader()}
      
      {/* Navigation (only show on main views) */}
      {(view === 'home' || view === 'catalog') && renderNavigation()}
      
      {/* Content area */}
      <main className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderDashboard()}
              </motion.div>
            )}
            
            {view === 'catalog' && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderCatalog()}
              </motion.div>
            )}
            
            {view === 'course-detail' && (
              <motion.div
                key="course-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderCourseDetail()}
              </motion.div>
            )}
            
            {view === 'module-view' && (
              <motion.div
                key="module-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderModuleView()}
              </motion.div>
            )}
            
            {view === 'lesson-view' && (
              <motion.div
                key="lesson-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderLessonView()}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Edit Name Modal */}
      <Dialog open={showEditNameModal} onOpenChange={setShowEditNameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editName}</DialogTitle>
            <DialogDescription>{t.yourName}</DialogDescription>
          </DialogHeader>
          <div className="space-4">
            <Input
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              placeholder={t.yourName}
              onKeyDown={(e) => e.key === 'Enter' && updateUserName()}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEditNameModal(false)}>
                {t.cancel}
              </Button>
              <Button onClick={updateUserName}>{t.save}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.downloadTitle}</DialogTitle>
            <DialogDescription>{t.downloadDescription}</DialogDescription>
          </DialogHeader>
          <div className="space-3">
            {[
              { icon: Download, label: t.downloadAll, desc: 'PDF completo con todos los módulos' },
              { icon: FolderOpen, label: t.downloadModule, desc: 'Solo el módulo actual' },
              { icon: FileText, label: t.downloadPDF, desc: 'Guía resumen en PDF' },
              { icon: CheckSquare, label: t.downloadChecklist, desc: 'Lista de tareas completadas' }
            ].map((item, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 transition-colors text-left"
              >
                <item.icon size={24} className="text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Course Card Component
function CourseCard({ 
  course, 
  language, 
  progress, 
  onSelect, 
  t 
}: { 
  course: Course
  language: 'es' | 'pt'
  progress: number
  onSelect: () => void
  t: Record<string, string>
}) {
  const title = language === 'es' ? course.titulo : course.tituloPt
  const description = language === 'es' ? course.descripcion : course.descripcionPt
  
  return (
    <Card 
      className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group"
      onClick={onSelect}
    >
      {/* Gradient header */}
      <div className={`h-32 bg-gradient-to-br ${course.colorGradiente} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform">{course.icono}</span>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.destacado && (
            <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
              <Star size={12} className="mr-1 fill-current" />
              Destacado
            </Badge>
          )}
        </div>
        
        {/* Progress overlay */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {progress >= 100 && (
          <div className="absolute bottom-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 size={18} className="text-white" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Layers size={12} />
            {course.modulos} {t.modules}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {course.duracionTotal}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${levelColors[course.nivel].text} ${levelColors[course.nivel].border}`}>
            {t[course.nivel]}
          </Badge>
          
          <div className="flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {progress > 0 ? t.continueCourse : t.startCourse}
            <ArrowRight size={14} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Course List Item Component
function CourseListItem({ 
  course, 
  language, 
  progress, 
  onSelect, 
  t 
}: { 
  course: Course
  language: 'es' | 'pt'
  progress: number
  onSelect: () => void
  t: Record<string, string>
}) {
  const title = language === 'es' ? course.titulo : course.tituloPt
  
  return (
    <Card 
      className="overflow-hidden border shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${course.colorGradiente} flex items-center justify-center flex-shrink-0`}>
            <span className="text-3xl">{course.icono}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Layers size={12} />
                {course.modulos} {t.modules}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {course.duracionTotal}
              </span>
              <Badge variant="outline" className={`${levelColors[course.nivel].text} ${levelColors[course.nivel].border} text-xs`}>
                {t[course.nivel]}
              </Badge>
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-32 hidden sm:block">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
}

// Lesson Block Component (for the 6-block structure)
function LessonBlock({
  emoji,
  title,
  bgColor,
  borderColor,
  iconColor,
  textColor = 'text-gray-700',
  fontSize,
  children
}: {
  emoji: string
  title: string
  bgColor: string
  borderColor: string
  iconColor: string
  textColor?: string
  fontSize: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} border ${borderColor} rounded-2xl p-5 md:p-6`}
    >
      <h3 className={`flex items-center gap-2 font-bold ${iconColor} mb-4`} style={{ fontSize: `${fontSize + 2}px` }}>
        <span className="text-2xl">{emoji}</span>
        {title}
      </h3>
      <div className={textColor}>
        {children}
      </div>
    </motion.div>
  )
}
