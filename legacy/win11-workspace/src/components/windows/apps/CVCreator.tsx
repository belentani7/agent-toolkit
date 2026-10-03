'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Languages,
  Award,
  Download,
  Eye,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Sparkles,
  Camera,
  Save,
  FolderOpen,
  Copy,
  Check,
  Lightbulb,
  X,
  AlertCircle,
  Star,
  Target,
  Heart,
  Code2,
  Palette,
  LayoutTemplate,
  Upload,
  ZoomIn,
  Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { WithWindowIdProps } from '../Window'

// ============== TYPES ==============
interface PersonalInfo {
  fullName: string
  photo: string | null
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
}

interface ProfessionalSummary {
  objective: string
  profile: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

interface Skill {
  id: string
  name: string
  level: number
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string
  link: string
}

interface VolunteerWork {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
}

interface Reference {
  id: string
  name: string
  position: string
  company: string
  phone: string
  email: string
}

interface CVData {
  personalInfo: PersonalInfo
  professionalSummary: ProfessionalSummary
  experience: Experience[]
  education: Education[]
  skillCategories: SkillCategory[]
  projects: Project[]
  volunteerWork: VolunteerWork[]
  references: Reference[]
}

type TemplateType = 'profesional' | 'moderno' | 'creativo' | 'minimalista' | 'ejecutivo'
type LanguageType = 'es' | 'pt'

// ============== TRANSLATIONS ==============
const translations = {
  es: {
    // Main
    appTitle: 'Creador de CV Premium',
    appSubtitle: 'Crea currículos profesionales impactantes',
    next: 'Siguiente',
    previous: 'Anterior',
    finish: 'Finalizar',
    save: 'Guardar Borrador',
    load: 'Cargar Borrador',
    exportPdf: 'Exportar PDF',
    copyText: 'Copiar Texto',
    copied: '¡Copiado!',
    
    // Steps
    steps: [
      'Información Personal',
      'Resumen Profesional',
      'Experiencia Laboral',
      'Educación',
      'Habilidades',
      'Secciones Adicionales',
      'Vista Previa y Exportar'
    ],
    
    // Personal Info
    personalInfo: 'Información Personal',
    fullName: 'Nombre completo',
    photo: 'Foto de perfil',
    uploadPhoto: 'Subir foto',
    removePhoto: 'Eliminar foto',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    location: 'Ubicación',
    website: 'Sitio web (opcional)',
    linkedin: 'LinkedIn (opcional)',
    
    placeholders: {
      fullName: 'María García López',
      email: 'maria.garcia@email.com',
      phone: '+34 612 345 678',
      location: 'Madrid, España',
      website: 'https://tuweb.com',
      linkedin: 'linkedin.com/in/tuperfil',
      objective: 'Busco una posición desafiante donde pueda aplicar mi experiencia en gestión administrativa y mi capacidad de adaptación a entornos multiculturales...',
      profile: 'Profesional con más de 10 años de experiencia en administración y atención al cliente. Habilidades demostradas en gestión de equipos, resolución de problemas y comunicación intercultural. NIE vigente y plena disponibilidad.',
      company: 'Empresa Ejemplo SL',
      position: 'Asistente Administrativo/a',
      startDate: '01/2020',
      endDate: 'Actualidad',
      institution: 'SEPE - Servicio Público de Empleo Estatal',
      degree: 'Certificado de Profesionalidad',
      field: 'Gestión Administrativa',
      skillName: 'Microsoft Office',
      projectTitle: 'Proyecto de ejemplo',
      projectDesc: 'Descripción del proyecto...',
      technologies: 'Excel, Word, PowerPoint',
      orgName: 'Organización benéfica',
      role: 'Voluntario/a',
      refName: 'Ana Martínez',
      refPosition: 'Directora',
      refCompany: 'Empresa anterior'
    },
    
    // Summary
    professionalSummary: 'Resumen Profesional',
    objective: 'Objetivo Profesional',
    profile: 'Perfil Profesional',
    
    // Experience
    workExperience: 'Experiencia Laboral',
    addExperience: 'Añadir Experiencia',
    currentPosition: 'Trabajo actual',
    experienceDesc: 'Describe tus logros y responsabilidades principales...',
    
    // Education
    education: 'Educación y Formación',
    addEducation: 'Añadir Educación/Certificación',
    educationDesc: 'Incluye cursos del SEPE, homologaciones, certificados...',
    
    // Skills
    skills: 'Habilidades',
    technicalSkills: 'Habilidades Técnicas',
    languageSkills: 'Idiomas',
    softSkills: 'Habilidades Personales',
    addSkill: 'Añadir Habilidad',
    addCategory: 'Añadir Categoría',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    expert: 'Experto',
    
    // Additional Sections
    additionalSections: 'Secciones Adicionales',
    projects: 'Proyectos Destacados',
    addProject: 'Añadir Proyecto',
    volunteerWork: 'Trabajo Voluntario',
    addVolunteer: 'Añadir Voluntariado',
    references: 'Referencias',
    addReference: 'Añadir Referencia',
    
    // Preview
    preview: 'Vista Previa',
    selectTemplate: 'Seleccionar Plantilla',
    templates: {
      profesional: 'Profesional',
      moderno: 'Moderno',
      creativo: 'Creativo',
      minimalista: 'Minimalista',
      ejecutivo: 'Ejecutivo'
    },
    
    // Tips
    tips: 'Consejos de Oro',
    tipsContent: {
      photo: 'Usa una foto profesional. Evita selfies. Sonríe naturalmente y vístete de forma neutra.',
      summary: 'El resumen es lo primero que leen. Sé específico sobre tu valor y adapta cada CV al puesto.',
      experience: 'Usa verbos de acción: "Gestioné", "Implementé", "Coordiné". Incluye números cuando sea posible.',
      education: 'Menciona homologaciones de títulos y cursos del SEPE. Demuestra tu compromiso con la formación continua.',
      skills: 'Destaca idiomas (especialmente español) y habilidades digitales. Los empleadores valoran la adaptabilidad.',
      additional: 'Los proyectos y voluntariado demuestran iniciativa. Las referencias pueden ser clave para inmigrantes.'
    },
    
    // Suggestions
    suggestions: {
      positions: [
        'Asistente Administrativo/a',
        'Atención al Cliente',
        'Auxiliar de Oficina',
        'Recepcionista',
        'Técnico Comercial',
        'Operario/a de Producción',
        'Limpiador/a',
        'Cuidador/a',
        'Cocinero/a',
        'Camero/a',
        'Conductor/a',
        'Albañil/Pintor/a',
        'Dependiente/a',
        'Cajero/a'
      ],
      institutions: [
        'SEPE - Servicio Público de Empleo Estatal',
        'Ministerio de Inclusión, Seguridad Social y Migraciones',
        'Universidad Nacional de Educación a Distancia (UNED)',
        'Centro de Formación del Pueblo',
        'Cámara de Comercio',
        'Fundación La Caixa',
        'Cruz Roja - Escuela de Formación'
      ]
    },
    
    // Validation
    required: 'Campo obligatorio',
    invalidEmail: 'Email no válido',
    invalidPhone: 'Teléfono no válido',
    
    // Drafts
    draftSaved: 'Borrador guardado correctamente',
    draftLoaded: 'Borrador cargado correctamente',
    noDrafts: 'No hay borradores guardados',
    confirmLoad: 'Esto reemplazará los datos actuales. ¿Continuar?',
    
    // Progress
    completion: 'Completado',
    fillMore: 'Completa más campos para mejorar tu CV'
  },
  pt: {
    // Main
    appTitle: 'Criador de CV Premium',
    appSubtitle: 'Crie currículos profissionais impactantes',
    next: 'Próximo',
    previous: 'Anterior',
    finish: 'Finalizar',
    save: 'Salvar Rascunho',
    load: 'Carregar Rascunho',
    exportPdf: 'Exportar PDF',
    copyText: 'Copiar Texto',
    copied: 'Copiado!',
    
    // Steps
    steps: [
      'Informação Pessoal',
      'Resumo Profissional',
      'Experiência Profissional',
      'Educação',
      'Habilidades',
      'Seções Adicionais',
      'Visualização e Exportar'
    ],
    
    // Personal Info
    personalInfo: 'Informação Pessoal',
    fullName: 'Nome completo',
    photo: 'Foto de perfil',
    uploadPhoto: 'Enviar foto',
    removePhoto: 'Remover foto',
    email: 'E-mail',
    phone: 'Telefone',
    location: 'Localização',
    website: 'Site (opcional)',
    linkedin: 'LinkedIn (opcional)',
    
    placeholders: {
      fullName: 'Maria Garcia Santos',
      email: 'maria.garcia@email.com',
      phone: '+351 912 345 678',
      location: 'Lisboa, Portugal',
      website: 'https://seusite.com',
      linkedin: 'linkedin.com/in/seuperfil',
      objective: 'Busco uma posição desafiadora onde possa aplicar minha experiência em gestão administrativa e minha capacidade de adaptação a ambientes multiculturais...',
      profile: 'Profissional com mais de 10 anos de experiência em administração e atendimento ao cliente. Habilidades comprovadas em gestão de equipes, resolução de problemas e comunicação intercultural. Título de residência válido e plena disponibilidade.',
      company: 'Empresa Exemplo Lda',
      position: 'Assistente Administrativo/a',
      startDate: '01/2020',
      endDate: 'Atualidade',
      institution: 'IEFP - Instituto do Emprego e Formação Profissional',
      degree: 'Certificado de Profissionalidade',
      field: 'Gestão Administrativa',
      skillName: 'Microsoft Office',
      projectTitle: 'Projeto de exemplo',
      projectDesc: 'Descrição do projeto...',
      technologies: 'Excel, Word, PowerPoint',
      orgName: 'Organização beneficente',
      role: 'Voluntário/a',
      refName: 'Ana Martinez',
      refPosition: 'Diretora',
      refCompany: 'Empresa anterior'
    },
    
    // Summary
    professionalSummary: 'Resumo Profissional',
    objective: 'Objetivo Profissional',
    profile: 'Perfil Profissional',
    
    // Experience
    workExperience: 'Experiência Profissional',
    addExperience: 'Adicionar Experiência',
    currentPosition: 'Emprego atual',
    experienceDesc: 'Descreva suas conquistas e responsabilidades principais...',
    
    // Education
    education: 'Educação e Formação',
    addEducation: 'Adicionar Educação/Certificação',
    educationDesc: 'Inclua cursos do IEFP, equivalências, certificados...',
    
    // Skills
    skills: 'Habilidades',
    technicalSkills: 'Habilidades Técnicas',
    languageSkills: 'Idiomas',
    softSkills: 'Habilidades Pessoais',
    addSkill: 'Adicionar Habilidade',
    addCategory: 'Adicionar Categoria',
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    expert: 'Expert',
    
    // Additional Sections
    additionalSections: 'Seções Adicionais',
    projects: 'Projetos em Destaque',
    addProject: 'Adicionar Projeto',
    volunteerWork: 'Trabalho Voluntário',
    addVolunteer: 'Adicionar Voluntariado',
    references: 'Referências',
    addReference: 'Adicionar Referência',
    
    // Preview
    preview: 'Visualização',
    selectTemplate: 'Selecionar Modelo',
    templates: {
      profissional: 'Profissional',
      moderno: 'Moderno',
      creativo: 'Criativo',
      minimalista: 'Minimalista',
      executivo: 'Executivo'
    },
    
    // Tips
    tips: 'Dicas de Ouro',
    tipsContent: {
      photo: 'Use uma foto profissional. Evite selfies. Sorria naturalmente e vista-se de forma neutra.',
      summary: 'O resumo é o primeiro que leem. Seja específico sobre seu valor e adapte cada CV à vaga.',
      experience: 'Use verbos de ação: "Gerenciei", "Implementei", "Coordenei". Inclua números quando possível.',
      education: 'Mencione equivalências de títulos e cursos do IEFP. Demonstre seu compromisso com a formação contínua.',
      skills: 'Destaque idiomas (especialmente português) e habilidades digitais. Os empregadores valorizam a adaptabilidade.',
      additional: 'Projetos e voluntariado demonstram iniciativa. As referências podem ser chave para imigrantes.'
    },
    
    // Suggestions
    suggestions: {
      positions: [
        'Assistente Administrativo/a',
        'Atendimento ao Cliente',
        'Auxiliar de Escritório',
        'Recepcionista',
        'Técnico Comercial',
        'Operário/a de Produção',
        'Limpeza',
        'Cuidador/a',
        'Cozinheiro/a',
        'Empregado/a de Mesa',
        'Motorista/a',
        'Pedreiro/Pintor/a',
        'Caixa',
        'Vendedor/a'
      ],
      institutions: [
        'IEFP - Instituto do Emprego e Formação Profissional',
        'Ministério da Solidariedade e Segurança Social',
        'Universidade Aberta',
        'Centro de Formação do Povo',
        'Câmara do Comércio',
        'Fundação La Caixa',
        'Cruz Vermelha - Escola de Formação'
      ]
    },
    
    // Validation
    required: 'Campo obrigatório',
    invalidEmail: 'Email inválido',
    invalidPhone: 'Telefone inválido',
    
    // Drafts
    draftSaved: 'Rascunho salvo com sucesso',
    draftLoaded: 'Rascunho carregado com sucesso',
    noDrafts: 'Não há rascunhos salvos',
    confirmLoad: 'Isso substituirá os dados atuais. Continuar?',
    
    // Progress
    completion: 'Completo',
    fillMore: 'Preencha mais campos para melhorar seu CV'
  }
}

// ============== INITIAL DATA ==============
const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    photo: null,
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: ''
  },
  professionalSummary: {
    objective: '',
    profile: ''
  },
  experience: [],
  education: [],
  skillCategories: [
    {
      id: 'technical',
      name: 'technicalSkills',
      skills: []
    },
    {
      id: 'languages',
      name: 'languageSkills',
      skills: []
    },
    {
      id: 'soft',
      name: 'softSkills',
      skills: []
    }
  ],
  projects: [],
  volunteerWork: [],
  references: []
}

// ============== TEMPLATE STYLES ==============
const templateStyles: Record<TemplateType, { header: string; accent: string; layout: string }> = {
  profesional: {
    header: 'bg-gray-800 text-white',
    accent: 'text-blue-600 border-blue-600',
    layout: 'traditional'
  },
  moderno: {
    header: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
    accent: 'text-cyan-600 border-cyan-500',
    layout: 'sidebar'
  },
  creativo: {
    header: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white',
    accent: 'text-purple-600 border-purple-500',
    layout: 'creative'
  },
  minimalista: {
    header: 'bg-white text-gray-900 border-b-2 border-gray-200',
    accent: 'text-gray-700 border-gray-400',
    layout: 'minimal'
  },
  ejecutivo: {
    header: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white',
    accent: 'text-amber-500 border-amber-500',
    layout: 'executive'
  }
}

// ============== MAIN COMPONENT ==============
export function CVCreator({ windowId }: WithWindowIdProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useState<LanguageType>('es')
  const [template, setTemplate] = useState<TemplateType>('profesional')
  const [cvData, setCvData] = useState<CVData>(initialCVData)
  const [showTips, setShowTips] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsField, setSuggestionsField] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [savedDrafts, setSavedDrafts] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const t = translations[language]
  
  // Load saved drafts list on mount
  useEffect(() => {
    const drafts = Object.keys(localStorage).filter(key => key.startsWith('cv_draft_'))
    setSavedDrafts(drafts)
  }, [])
  
  // Calculate completion percentage
  const calculateCompletion = useCallback((): number => {
    let filled = 0
    let total = 0
    
    // Personal info
    total += 4 // name, email, phone, location are essential
    if (cvData.personalInfo.fullName) filled++
    if (cvData.personalInfo.email) filled++
    if (cvData.personalInfo.phone) filled++
    if (cvData.personalInfo.location) filled++
    
    // Summary
    total += 2
    if (cvData.professionalSummary.objective) filled++
    if (cvData.professionalSummary.profile) filled++
    
    // Experience
    total += Math.min(cvData.experience.length * 3, 6)
    cvData.experience.forEach(exp => {
      if (exp.company) filled++
      if (exp.position) filled++
      if (exp.description) filled++
    })
    
    // Education
    total += Math.min(cvData.education.length * 3, 6)
    cvData.education.forEach(edu => {
      if (edu.institution) filled++
      if (edu.degree) filled++
      if (edu.field) filled++
    })
    
    // Skills
    total += Math.min(cvData.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0), 5)
    cvData.skillCategories.forEach(cat => {
      cat.skills.forEach(() => filled++)
    })
    
    return Math.min(Math.round((filled / Math.max(total, 1)) * 100), 100)
  }, [cvData])
  
  const completionPercent = calculateCompletion()
  
  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('cv_autosave', JSON.stringify(cvData))
    }, 2000)
    return () => clearTimeout(timer)
  }, [cvData])
  
  // Handlers
  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }
  
  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }
  
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string | null) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }
  
  const updateProfessionalSummary = (field: keyof ProfessionalSummary, value: string) => {
    setCvData(prev => ({
      ...prev,
      professionalSummary: { ...prev.professionalSummary, [field]: value }
    }))
  }
  
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }))
  }
  
  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }
  
  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }
  
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }))
  }
  
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }
  
  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }
  
  const addSkill = (categoryId: string) => {
    setCvData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: [...cat.skills, { id: Date.now().toString(), name: '', level: 50 }] }
          : cat
      )
    }))
  }
  
  const updateSkill = (categoryId: string, skillId: string, field: keyof Skill, value: string | number) => {
    setCvData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              skills: cat.skills.map(skill =>
                skill.id === skillId ? { ...skill, [field]: value } : skill
              )
            }
          : cat
      )
    }))
  }
  
  const removeSkill = (categoryId: string, skillId: string) => {
    setCvData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: cat.skills.filter(skill => skill.id !== skillId) }
          : cat
      )
    }))
  }
  
  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now().toString(),
        title: '',
        description: '',
        technologies: '',
        link: ''
      }]
    }))
  }
  
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }))
  }
  
  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }))
  }
  
  const addVolunteer = () => {
    setCvData(prev => ({
      ...prev,
      volunteerWork: [...prev.volunteerWork, {
        id: Date.now().toString(),
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }))
  }
  
  const updateVolunteer = (id: string, field: keyof VolunteerWork, value: string) => {
    setCvData(prev => ({
      ...prev,
      volunteerWork: prev.volunteerWork.map(vol =>
        vol.id === id ? { ...vol, [field]: value } : vol
      )
    }))
  }
  
  const removeVolunteer = (id: string) => {
    setCvData(prev => ({
      ...prev,
      volunteerWork: prev.volunteerWork.filter(vol => vol.id !== id)
    }))
  }
  
  const addReference = () => {
    setCvData(prev => ({
      ...prev,
      references: [...prev.references, {
        id: Date.now().toString(),
        name: '',
        position: '',
        company: '',
        phone: '',
        email: ''
      }]
    }))
  }
  
  const updateReference = (id: string, field: keyof Reference, value: string) => {
    setCvData(prev => ({
      ...prev,
      references: prev.references.map(ref =>
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    }))
  }
  
  const removeReference = (id: string) => {
    setCvData(prev => ({
      ...prev,
      references: prev.references.filter(ref => ref.id !== id)
    }))
  }
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const removePhoto = () => {
    updatePersonalInfo('photo', null)
  }
  
  const saveDraft = () => {
    const draftName = `cv_draft_${Date.now()}`
    localStorage.setItem(draftName, JSON.stringify(cvData))
    setSavedDrafts(prev => [...prev, draftName])
    alert(t.draftSaved)
  }
  
  const loadDraft = (draftName: string) => {
    if (confirm(t.confirmLoad)) {
      const data = localStorage.getItem(draftName)
      if (data) {
        setCvData(JSON.parse(data))
        alert(t.draftLoaded)
      }
    }
  }
  
  const exportToPDF = () => {
    const printContent = document.getElementById('cv-preview-content')
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${cvData.personalInfo.fullName || 'CV'}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .cv-preview { max-width: 210mm; margin: 0 auto; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div class="cv-preview">${printContent.innerHTML}</div>
              <script>window.onload = () => window.print();</script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }
  
  const copyToClipboard = async () => {
    let text = `${cvData.personalInfo.fullName}\n`
    text += `${cvData.personalInfo.email} | ${cvData.personalInfo.phone}\n`
    text += `${cvData.personalInfo.location}\n\n`
    
    if (cvData.professionalSummary.profile) {
      text += `PERFIL PROFESIONAL\n${cvData.professionalSummary.profile}\n\n`
    }
    
    if (cvData.experience.length > 0) {
      text += `EXPERIENCIA LABORAL\n`
      cvData.experience.forEach(exp => {
        text += `${exp.position} - ${exp.company}\n`
        text += `${exp.startDate} - ${exp.endDate}\n`
        if (exp.description) text += `${exp.description}\n`
        text += '\n'
      })
    }
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50/50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">{t.appTitle}</h1>
              <p className="text-xs text-gray-500">{t.appSubtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'es' ? 'pt' : 'es')}
              className="text-xs font-medium"
            >
              <Languages size={14} className="mr-1" />
              {language === 'es' ? 'ES' : 'PT'}
            </Button>
            
            {/* Save Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={saveDraft}
              className="text-xs font-medium"
            >
              <Save size={14} className="mr-1" />
              {t.save}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">
              {t.completion}: {completionPercent}%
            </span>
            <span className="text-xs text-gray-400">
              Paso {currentStep + 1} de 7
            </span>
          </div>
          <Progress value={completionPercent} className="h-1.5" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-2">
            {t.steps.map((step, index) => (
              <button
                key={step}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center group ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  index === currentStep
                    ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? <Check size={12} /> : index + 1}
                </div>
                <span className="text-[9px] mt-1 hidden xl:block max-w-[60px] truncate text-center">
                  {step.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="flex-1 overflow-y-auto p-4 lg:w-1/2 lg:border-r border-gray-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Personal Info */}
              {currentStep === 0 && (
                <StepPersonalInfo
                  data={cvData.personalInfo}
                  onUpdate={updatePersonalInfo}
                  onPhotoUpload={handlePhotoUpload}
                  onRemovePhoto={removePhoto}
                  fileInputRef={fileInputRef}
                  t={t}
                  language={language}
                />
              )}
              
              {/* Step 2: Professional Summary */}
              {currentStep === 1 && (
                <StepSummary
                  data={cvData.professionalSummary}
                  onUpdate={updateProfessionalSummary}
                  t={t}
                />
              )}
              
              {/* Step 3: Work Experience */}
              {currentStep === 2 && (
                <StepExperience
                  data={cvData.experience}
                  onAdd={addExperience}
                  onUpdate={updateExperience}
                  onRemove={removeExperience}
                  t={t}
                  language={language}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  suggestionsField={suggestionsField}
                  setSuggestionsField={setSuggestionsField}
                  suggestions={t.suggestions.positions}
                />
              )}
              
              {/* Step 4: Education */}
              {currentStep === 3 && (
                <StepEducation
                  data={cvData.education}
                  onAdd={addEducation}
                  onUpdate={updateEducation}
                  onRemove={removeEducation}
                  t={t}
                  language={language}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  suggestionsField={suggestionsField}
                  setSuggestionsField={setSuggestionsField}
                  suggestions={t.suggestions.institutions}
                />
              )}
              
              {/* Step 5: Skills */}
              {currentStep === 4 && (
                <StepSkills
                  data={cvData.skillCategories}
                  onAddSkill={addSkill}
                  onUpdateSkill={updateSkill}
                  onRemoveSkill={removeSkill}
                  t={t}
                  language={language}
                />
              )}
              
              {/* Step 6: Additional Sections */}
              {currentStep === 5 && (
                <StepAdditional
                  projects={cvData.projects}
                  volunteerWork={cvData.volunteerWork}
                  references={cvData.references}
                  onAddProject={addProject}
                  onUpdateProject={updateProject}
                  onRemoveProject={removeProject}
                  onAddVolunteer={addVolunteer}
                  onUpdateVolunteer={updateVolunteer}
                  onRemoveVolunteer={removeVolunteer}
                  onAddReference={addReference}
                  onUpdateReference={updateReference}
                  onRemoveReference={removeReference}
                  t={t}
                />
              )}
              
              {/* Step 7: Preview & Export */}
              {currentStep === 6 && (
                <StepPreviewExport
                  template={template}
                  setTemplate={setTemplate}
                  savedDrafts={savedDrafts}
                  onLoadDraft={loadDraft}
                  onExportPDF={exportToPDF}
                  onCopyText={copyToClipboard}
                  copied={copied}
                  t={t}
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-gray-50/95 backdrop-blur-sm py-3 -mx-4 px-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              {t.previous}
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep < 6 ? (
                <Button onClick={handleNext} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  {t.next}
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button onClick={exportToPDF} className="gap-2 bg-green-600 hover:bg-green-700">
                  <Download size={16} />
                  {t.exportPdf}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Panel - Live Preview */}
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-gray-100 overflow-hidden">
          <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t.preview}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t.templates[template]}
            </Badge>
          </div>
          
          <div className="flex-1 overflow-auto p-4 flex justify-center">
            <CVPreview
              data={cvData}
              template={template}
              t={t}
              language={language}
            />
          </div>
        </div>
      </main>
      
      {/* Tips Panel */}
      {showTips && currentStep < 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 w-72 z-50 hidden xl:block"
        >
          <Card className="shadow-xl border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
                <Lightbulb size={16} className="text-amber-500" />
                {t.tips}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-amber-700 leading-relaxed">
                {(Object.values(t.tipsContent) as string[])[currentStep]}
              </p>
              <button
                onClick={() => setShowTips(false)}
                className="mt-2 text-xs text-amber-600 hover:text-amber-800 underline"
              >
                Ocultar consejos
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {!showTips && (
        <button
          onClick={() => setShowTips(true)}
          className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-colors hidden xl:flex items-center justify-center z-50"
        >
          <Lightbulb size={18} />
        </button>
      )}
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  )
}

// ============== STEP COMPONENTS ==============

// Step 1: Personal Info
function StepPersonalInfo({
  data,
  onUpdate,
  onPhotoUpload,
  onRemovePhoto,
  fileInputRef,
  t,
  language
}: {
  data: PersonalInfo
  onUpdate: (field: keyof PersonalInfo, value: string | null) => void
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemovePhoto: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  t: typeof translations.es
  language: LanguageType
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <User size={18} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t.personalInfo}</h2>
      </div>
      
      {/* Photo Upload */}
      <Card>
        <CardContent className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.photo}</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-24 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
                data.photo
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {data.photo ? (
                <img
                  src={data.photo}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <>
                  <Camera size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{t.uploadPhoto}</span>
                </>
              )}
            </button>
            
            <div className="flex-1 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload size={14} className="mr-2" />
                {data.photo ? t.uploadPhoto : t.uploadPhoto}
              </Button>
              {data.photo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRemovePhoto}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={14} className="mr-2" />
                  {t.removePhoto}
                </Button>
              )}
              <p className="text-xs text-gray-500">
                {language === 'es' 
                  ? 'Formato recomendado: 35x45mm, fondo blanco o claro'
                  : 'Formato recomendado: 35x45mm, fundo branco ou claro'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Basic Info */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.fullName} <span className="text-red-500">*</span>
            </label>
            <Input
              value={data.fullName}
              onChange={(e) => onUpdate('fullName', e.target.value)}
              placeholder={t.placeholders.fullName}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail size={14} className="text-gray-400" />
                {t.email} <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => onUpdate('email', e.target.value)}
                placeholder={t.placeholders.email}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone size={14} className="text-gray-400" />
                {t.phone} <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={data.phone}
                onChange={(e) => onUpdate('phone', e.target.value)}
                placeholder={t.placeholders.phone}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MapPin size={14} className="text-gray-400" />
              {t.location} <span className="text-red-500">*</span>
            </label>
            <Input
              value={data.location}
              onChange={(e) => onUpdate('location', e.target.value)}
              placeholder={t.placeholders.location}
            />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.website}
              </label>
              <Input
                type="url"
                value={data.website}
                onChange={(e) => onUpdate('website', e.target.value)}
                placeholder={t.placeholders.website}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.linkedin}
              </label>
              <Input
                value={data.linkedin}
                onChange={(e) => onUpdate('linkedin', e.target.value)}
                placeholder={t.placeholders.linkedin}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Step 2: Professional Summary
function StepSummary({
  data,
  onUpdate,
  t
}: {
  data: ProfessionalSummary
  onUpdate: (field: keyof ProfessionalSummary, value: string) => void
  t: typeof translations.es
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <Target size={18} className="text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t.professionalSummary}</h2>
      </div>
      
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Star size={16} className="text-amber-500" />
              {t.objective}
            </label>
            <Textarea
              value={data.objective}
              onChange={(e) => onUpdate('objective', e.target.value)}
              placeholder={t.placeholders.objective}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t.tipsContent.summary}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <User size={16} className="text-purple-500" />
              {t.profile}
            </label>
            <Textarea
              value={data.profile}
              onChange={(e) => onUpdate('profile', e.target.value)}
              placeholder={t.placeholders.profile}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t.tipsContent.summary}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Example Phrases */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            Frases de ejemplo
          </h3>
          <div className="space-y-2">
            {[
              'Gestión administrativa en entorno multicultural',
              'Capacidad de adaptación y aprendizaje rápido',
              'Experiencia en atención al cliente bilingüe',
              'Compromiso con la formación continua'
            ].map((phrase, i) => (
              <button
                key={i}
                onClick={() => onUpdate('profile', data.profile + (data.profile ? '. ' : '') + phrase)}
                className="w-full text-left text-xs bg-white px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                "{phrase}"
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Step 3: Work Experience
function StepExperience({
  data,
  onAdd,
  onUpdate,
  onRemove,
  t,
  language,
  showSuggestions,
  setShowSuggestions,
  suggestionsField,
  setSuggestionsField,
  suggestions
}: {
  data: Experience[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof Experience, value: string | boolean) => void
  onRemove: (id: string) => void
  t: typeof translations.es
  language: LanguageType
  showSuggestions: boolean
  setShowSuggestions: (val: boolean) => void
  suggestionsField: string
  setSuggestionsField: (val: string) => void
  suggestions: string[]
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Briefcase size={18} className="text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{t.workExperience}</h2>
        </div>
        <Button onClick={onAdd} size="sm" className="gap-1">
          <Plus size={14} />
          {t.addExperience}
        </Button>
      </div>
      
      {data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">
              {language === 'es' 
                ? 'Añade tu experiencia laboral. Incluye trabajos relevantes, incluso si fueron en tu país de origen.'
                : 'Adicione sua experiência profissional. Inclua trabalhos relevantes, mesmo que tenham sido no seu país de origem.'}
            </p>
            <Button onClick={onAdd} variant="outline">
              <Plus size={16} className="mr-2" />
              {t.addExperience}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <Card key={exp.id} className="relative">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mt-1">
                    {language === 'es' ? `Experiencia ${index + 1}` : `Experiência ${index + 1}`}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(exp.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.position}</label>
                    <Input
                      value={exp.position}
                      onChange={(e) => {
                        onUpdate(exp.id, 'position', e.target.value)
                        setSuggestionsField('position')
                      }}
                      onFocus={() => {
                        setShowSuggestions(true)
                        setSuggestionsField('position')
                      }}
                      placeholder={t.placeholders.position}
                    />
                    {showSuggestions && suggestionsField === 'position' && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-32 overflow-auto">
                        {suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              onUpdate(exp.id, 'position', suggestion)
                              setShowSuggestions(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.company}</label>
                    <Input
                      value={exp.company}
                      onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
                      placeholder={t.placeholders.company}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.startDate}</label>
                    <Input
                      value={exp.startDate}
                      onChange={(e) => onUpdate(exp.id, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.endDate}</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={exp.current ? t.placeholders.endDate : exp.endDate}
                        onChange={(e) => onUpdate(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        placeholder="MM/YYYY"
                        className={exp.current ? 'bg-gray-100' : ''}
                      />
                      <label className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => onUpdate(exp.id, 'current', e.target.checked)}
                          className="rounded"
                        />
                        {t.currentPosition}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t.experienceDesc}</label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => onUpdate(exp.id, 'description', e.target.value)}
                    placeholder={
                      language === 'es'
                        ? '• Gestioné un equipo de 5 personas\n• Implementé un nuevo sistema de archivo\n• Reduje tiempos de respuesta en un 30%'
                        : '• Gerenciei uma equipe de 5 pessoas\n• Implementei um novo sistema de arquivo\n• Reduzi tempos de resposta em 30%'
                    }
                    rows={3}
                    className="resize-none text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button onClick={onAdd} variant="outline" className="w-full gap-1 border-dashed">
            <Plus size={16} />
            {t.addExperience}
          </Button>
        </div>
      )}
    </div>
  )
}

// Step 4: Education
function StepEducation({
  data,
  onAdd,
  onUpdate,
  onRemove,
  t,
  language,
  showSuggestions,
  setShowSuggestions,
  suggestionsField,
  setSuggestionsField,
  suggestions
}: {
  data: Education[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof Education, value: string) => void
  onRemove: (id: string) => void
  t: typeof translations.es
  language: LanguageType
  showSuggestions: boolean
  setShowSuggestions: (val: boolean) => void
  suggestionsField: string
  setSuggestionsField: (val: string) => void
  suggestions: string[]
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <GraduationCap size={18} className="text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{t.education}</h2>
        </div>
        <Button onClick={onAdd} size="sm" className="gap-1">
          <Plus size={14} />
          {t.addEducation}
        </Button>
      </div>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <Lightbulb size={16} className="flex-shrink-0 mt-0.5" />
            {t.educationDesc}
          </p>
        </CardContent>
      </Card>
      
      {data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <GraduationCap size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">
              {language === 'es'
                ? 'Añade tu educación formal, cursos de capacitación y certificaciones.'
                : 'Adicione sua educação formal, cursos de capacitação e certificações.'}
            </p>
            <Button onClick={onAdd} variant="outline">
              <Plus size={16} className="mr-2" />
              {t.addEducation}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <Card key={edu.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mt-1">
                    {language === 'es' ? `Formación ${index + 1}` : `Formação ${index + 1}`}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(edu.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.institution}</label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => {
                      onUpdate(edu.id, 'institution', e.target.value)
                      setSuggestionsField('institution')
                    }}
                    onFocus={() => {
                      setShowSuggestions(true)
                      setSuggestionsField('institution')
                    }}
                    placeholder={t.placeholders.institution}
                  />
                  {showSuggestions && suggestionsField === 'institution' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-32 overflow-auto">
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            onUpdate(edu.id, 'institution', suggestion)
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.degree}</label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
                      placeholder={t.placeholders.degree}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.field}</label>
                    <Input
                      value={edu.field}
                      onChange={(e) => onUpdate(edu.id, 'field', e.target.value)}
                      placeholder={t.placeholders.field}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.startDate}</label>
                    <Input
                      value={edu.startDate}
                      onChange={(e) => onUpdate(edu.id, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.placeholders.endDate}</label>
                    <Input
                      value={edu.endDate}
                      onChange={(e) => onUpdate(edu.id, 'endDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t.educationDesc}</label>
                  <Textarea
                    value={edu.description}
                    onChange={(e) => onUpdate(edu.id, 'description', e.target.value)}
                    placeholder={
                      language === 'es'
                        ? 'Curso de 600 horas incluyendo módulos de ofimática, gestión documental y atención al público.'
                        : 'Curso de 600 horas incluindo módulos de informática, gestão documental e atendimento ao público.'
                    }
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button onClick={onAdd} variant="outline" className="w-full gap-1 border-dashed">
            <Plus size={16} />
            {t.addEducation}
          </Button>
        </div>
      )}
    </div>
  )
}

// Step 5: Skills
function StepSkills({
  data,
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill,
  t,
  language
}: {
  data: SkillCategory[]
  onAddSkill: (categoryId: string) => void
  onUpdateSkill: (categoryId: string, skillId: string, field: keyof Skill, value: string | number) => void
  onRemoveSkill: (categoryId: string, skillId: string) => void
  t: typeof translations.es
  language: LanguageType
}) {
  const getCategoryLabel = (name: string) => {
    switch (name) {
      case 'technicalSkills': return t.technicalSkills
      case 'languageSkills': return t.languageSkills
      case 'softSkills': return t.softSkills
      default: return name
    }
  }
  
  const getLevelLabel = (level: number) => {
    if (level <= 25) return t.beginner
    if (level <= 50) return t.intermediate
    if (level <= 75) return t.advanced
    return t.expert
  }
  
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'technical': return <Code2 size={16} />
      case 'languages': return <Languages size={16} />
      case 'soft': return <Heart size={16} />
      default: return <Award size={16} />
    }
  }
  
  const getCategoryColor = (id: string) => {
    switch (id) {
      case 'technical': return 'bg-blue-100 text-blue-600'
      case 'languages': return 'bg-green-100 text-green-600'
      case 'soft': return 'bg-pink-100 text-pink-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
          <Award size={18} className="text-rose-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t.skills}</h2>
      </div>
      
      <div className="space-y-6">
        {data.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryColor(category.id)}`}>
                    {getCategoryIcon(category.id)}
                  </span>
                  {getCategoryLabel(category.name)}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSkill(category.id)}
                  className="gap-1 text-xs"
                >
                  <Plus size={12} />
                  {t.addSkill}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.skills.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  {language === 'es' 
                    ? 'Sin habilidades añadidas en esta categoría'
                    : 'Sem habilidades adicionadas nesta categoria'}
                </p>
              ) : (
                category.skills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <Input
                      value={skill.name}
                      onChange={(e) => onUpdateSkill(category.id, skill.id, 'name', e.target.value)}
                      placeholder={t.placeholders.skillName}
                      className="flex-1 h-9"
                    />
                    
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="25"
                        value={skill.level}
                        onChange={(e) => onUpdateSkill(category.id, skill.id, 'level', parseInt(e.target.value))}
                        className="flex-1 h-1.5 accent-blue-600"
                      />
                      <span className="text-xs text-gray-500 w-16 text-right">
                        {getLevelLabel(skill.level)}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSkill(category.id, skill.id)}
                      className="text-red-400 hover:text-red-600 p-1 h-8 w-8"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick Add Common Skills */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="pt-4">
          <h3 className="text-sm font-medium text-violet-800 mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            {language === 'es' ? 'Habilidades frecuentes para añadir' : 'Habilidades frequentes para adicionar'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Microsoft Office', 'Español', 'Portugués', 'Inglés', 'Trabajo en equipo', 'Comunicación'].map(skill => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer hover:bg-violet-200 transition-colors"
                onClick={() => {
                  const targetCat = skill === 'Español' || skill === 'Português' || skill === 'Inglés' || skill === 'English' ? 'languages' : skill === 'Trabajo en equipo' || skill === 'Comunicación' ? 'soft' : 'technical'
                  onAddSkill(targetCat)
                  // Note: This is simplified - in production you'd want to add directly
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Step 6: Additional Sections
function StepAdditional({
  projects,
  volunteerWork,
  references,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
  onAddVolunteer,
  onUpdateVolunteer,
  onRemoveVolunteer,
  onAddReference,
  onUpdateReference,
  onRemoveReference,
  t
}: {
  projects: Project[]
  volunteerWork: VolunteerWork[]
  references: Reference[]
  onAddProject: () => void
  onUpdateProject: (id: string, field: keyof Project, value: string) => void
  onRemoveProject: (id: string) => void
  onAddVolunteer: () => void
  onUpdateVolunteer: (id: string, field: keyof VolunteerWork, value: string) => void
  onRemoveVolunteer: (id: string) => void
  onAddReference: () => void
  onUpdateReference: (id: string, field: keyof Reference, value: string) => void
  onRemoveReference: (id: string) => void
  t: typeof translations.es
}) {
  const [activeSection, setActiveSection] = useState<'projects' | 'volunteer' | 'references'>('projects')
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <LayoutTemplate size={18} className="text-amber-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t.additionalSections}</h2>
      </div>
      
      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as typeof activeSection)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects" className="gap-1 text-xs">
            <Palette size={14} />
            {t.projects}
          </TabsTrigger>
          <TabsTrigger value="volunteer" className="gap-1 text-xs">
            <Heart size={14} />
            {t.volunteerWork}
          </TabsTrigger>
          <TabsTrigger value="references" className="gap-1 text-xs">
            <User size={14} />
            {t.references}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4 mt-4">
          <Button onClick={onAddProject} size="sm" className="gap-1">
            <Plus size={14} />
            {t.addProject}
          </Button>
          
          {projects.map(project => (
            <Card key={project.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProject(project.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <Input
                  value={project.title}
                  onChange={(e) => onUpdateProject(project.id, 'title', e.target.value)}
                  placeholder={t.placeholders.projectTitle}
                />
                <Textarea
                  value={project.description}
                  onChange={(e) => onUpdateProject(project.id, 'description', e.target.value)}
                  placeholder={t.placeholders.projectDesc}
                  rows={2}
                  className="resize-none"
                />
                <Input
                  value={project.technologies}
                  onChange={(e) => onUpdateProject(project.id, 'technologies', e.target.value)}
                  placeholder={t.placeholders.technologies}
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="volunteer" className="space-y-4 mt-4">
          <Button onClick={onAddVolunteer} size="sm" className="gap-1">
            <Plus size={14} />
            {t.addVolunteer}
          </Button>
          
          {volunteerWork.map(vol => (
            <Card key={vol.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveVolunteer(vol.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={vol.organization}
                    onChange={(e) => onUpdateVolunteer(vol.id, 'organization', e.target.value)}
                    placeholder={t.placeholders.orgName}
                  />
                  <Input
                    value={vol.role}
                    onChange={(e) => onUpdateVolunteer(vol.id, 'role', e.target.value)}
                    placeholder={t.placeholders.role}
                  />
                </div>
                <Textarea
                  value={vol.description}
                  onChange={(e) => onUpdateVolunteer(vol.id, 'description', e.target.value)}
                  placeholder={t.experienceDesc}
                  rows={2}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="references" className="space-y-4 mt-4">
          <Button onClick={onAddReference} size="sm" className="gap-1">
            <Plus size={14} />
            {t.addReference}
          </Button>
          
          {references.map(ref => (
            <Card key={ref.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveReference(ref.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={ref.name}
                    onChange={(e) => onUpdateReference(ref.id, 'name', e.target.value)}
                    placeholder={t.placeholders.refName}
                  />
                  <Input
                    value={ref.position}
                    onChange={(e) => onUpdateReference(ref.id, 'position', e.target.value)}
                    placeholder={t.placeholders.refPosition}
                  />
                  <Input
                    value={ref.company}
                    onChange={(e) => onUpdateReference(ref.id, 'company', e.target.value)}
                    placeholder={t.placeholders.refCompany}
                  />
                  <Input
                    value={ref.email}
                    onChange={(e) => onUpdateReference(ref.id, 'email', e.target.value)}
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <Input
                  value={ref.phone}
                  onChange={(e) => onUpdateReference(ref.id, 'phone', e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Step 7: Preview & Export
function StepPreviewExport({
  template,
  setTemplate,
  savedDrafts,
  onLoadDraft,
  onExportPDF,
  onCopyText,
  copied,
  t
}: {
  template: TemplateType
  setTemplate: (template: TemplateType) => void
  savedDrafts: string[]
  onLoadDraft: (name: string) => void
  onExportPDF: () => void
  onCopyText: () => void
  copied: boolean
  t: typeof translations.es
}) {
  const templateIcons: Record<TemplateType, string> = {
    profesional: '📋',
    moderno: '🎨',
    creativo: '✨',
    minimalista: '⬜',
    ejecutivo: '👔'
  }
  
  const templateDescriptions: Record<TemplateType, string> = {
    profesional: 'Limpio y tradicional',
    moderno: 'Con barra lateral de color',
    creativo: 'Con colores de acento',
    minimalista: 'Mucho espacio en blanco',
    ejecutivo: 'Encabezado oscuro elegante'
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Eye size={18} className="text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t.steps[6]}</h2>
      </div>
      
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutTemplate size={18} className="text-blue-500" />
            {t.selectTemplate}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(Object.keys(templateStyles) as TemplateType[]).map(temp => (
              <button
                key={temp}
                onClick={() => setTemplate(temp)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  template === temp
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl block mb-1">{templateIcons[temp]}</span>
                <span className="text-xs font-medium text-gray-700 block">{t.templates[temp]}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{templateDescriptions[temp]}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download size={18} className="text-green-500" />
            Opciones de Exportación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onExportPDF} className="w-full gap-2 bg-red-600 hover:bg-red-700">
            <Printer size={18} />
            {t.exportPdf}
          </Button>
          
          <Button
            onClick={onCopyText}
            variant="outline"
            className="w-full gap-2"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            {copied ? t.copied : t.copyText}
          </Button>
        </CardContent>
      </Card>
      
      {/* Saved Drafts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FolderOpen size={18} className="text-amber-500" />
            {t.load}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedDrafts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">{t.noDrafts}</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-auto">
              {savedDrafts.map(draft => (
                <button
                  key={draft}
                  onClick={() => onLoadDraft(draft)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">
                    {new Date(parseInt(draft.replace('cv_draft_', ''))).toLocaleDateString()}
                  </span>
                  <FolderOpen size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ============== CV PREVIEW COMPONENT ==============
function CVPreview({
  data,
  template,
  t,
  language
}: {
  data: CVData
  template: TemplateType
  t: typeof translations.es
  language: LanguageType
}) {
  const style = templateStyles[template]
  
  const renderTemplate = () => {
    switch (template) {
      case 'profesional':
        return <ProfessionalTemplate data={data} t={t} language={language} />
      case 'moderno':
        return <ModernTemplate data={data} t={t} language={language} />
      case 'creativo':
        return <CreativeTemplate data={data} t={t} language={language} />
      case 'minimalista':
        return <MinimalistTemplate data={data} t={t} language={language} />
      case 'ejecutivo':
        return <ExecutiveTemplate data={data} t={t} language={language} />
      default:
        return <ProfessionalTemplate data={data} t={t} language={language} />
    }
  }
  
  return (
    <div id="cv-preview-content" className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ width: '210mm', minHeight: '297mm', fontSize: '10pt' }}>
      {renderTemplate()}
    </div>
  )
}

// ============== TEMPLATE: PROFESIONAL ==============
function ProfessionalTemplate({ data, t, language }: { data: CVData; t: typeof translations.es; language: LanguageType }) {
  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white p-6">
        <div className="flex items-start gap-4">
          {data.personalInfo.photo && (
            <img src={data.personalInfo.photo} alt="" className="w-20 h-20 rounded-lg object-cover border-2 border-white/30" />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {data.personalInfo.fullName || t.placeholders.fullName}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-300">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            </div>
            {(data.personalInfo.linkedin || data.personalInfo.website) && (
              <div className="flex gap-4 mt-1 text-xs text-gray-400">
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="p-6 space-y-5">
        {/* Profile */}
        {(data.professionalSummary.profile || data.professionalSummary.objective) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-2">
              {t.professionalSummary}
            </h2>
            {data.professionalSummary.profile && (
              <p className="text-gray-700 leading-relaxed text-sm">{data.professionalSummary.profile}</p>
            )}
            {data.professionalSummary.objective && (
              <p className="text-gray-600 italic text-sm mt-1">{data.professionalSummary.objective}</p>
            )}
          </section>
        )}
        
        {/* Experience */}
        {data.experience.some(e => e.company) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
              {t.workExperience}
            </h2>
            <div className="space-y-3">
              {data.experience.filter(e => e.company).map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-600 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {exp.startDate} - {exp.current ? t.placeholders.endDate : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {data.education.some(e => e.institution) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
              {t.education}
            </h2>
            <div className="space-y-2">
              {data.education.filter(e => e.institution).map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.field && ` en ${edu.field}`}</h3>
                      <p className="text-gray-600 text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-600 text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Skills */}
        {data.skillCategories.some(cat => cat.skills.length > 0) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
              {t.skills}
            </h2>
            <div className="space-y-2">
              {data.skillCategories.filter(cat => cat.skills.length > 0).map(cat => (
                <div key={cat.id}>
                  <h3 className="text-xs font-semibold text-gray-700 mb-1">
                    {cat.name === 'technicalSkills' ? t.technicalSkills :
                     cat.name === 'languageSkills' ? t.languageSkills :
                     cat.name === 'softSkills' ? t.softSkills : cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.filter(s => s.name).map(skill => (
                      <span key={skill.id} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {data.projects.some(p => p.title) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
              {t.projects}
            </h2>
            <div className="space-y-2">
              {data.projects.filter(p => p.title).map(proj => (
                <div key={proj.id}>
                  <h3 className="font-semibold text-gray-900 text-sm">{proj.title}</h3>
                  {proj.description && <p className="text-gray-600 text-sm">{proj.description}</p>}
                  {proj.technologies && <p className="text-xs text-gray-500">{proj.technologies}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* References */}
        {data.references.some(r => r.name) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3">
              {t.references}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {data.references.filter(r => r.name).map(ref => (
                <div key={ref.id} className="text-sm">
                  <span className="font-semibold text-gray-900">{ref.name}</span>
                  {ref.position && <span className="text-gray-600"> - {ref.position}</span>}
                  {ref.company && <span className="text-gray-500"> ({ref.company})</span>}
                  {(ref.email || ref.phone) && (
                    <div className="text-xs text-gray-500">
                      {[ref.email, ref.phone].filter(Boolean).join(' | ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ============== TEMPLATE: MODERNO ==============
function ModernTemplate({ data, t, language }: { data: CVData; t: typeof translations.es; language: LanguageType }) {
  return (
    <div className="flex min-h-full font-sans">
      {/* Sidebar */}
      <aside className="w-1/3 bg-gradient-to-b from-blue-600 to-cyan-500 text-white p-5">
        {data.personalInfo.photo && (
          <div className="mb-4">
            <img src={data.personalInfo.photo} alt="" className="w-24 h-24 rounded-full mx-auto object-cover border-3 border-white/30 shadow-lg" />
          </div>
        )}
        
        <h1 className="text-lg font-bold text-center leading-tight">
          {data.personalInfo.fullName || t.placeholders.fullName}
        </h1>
        
        <div className="mt-4 space-y-2 text-xs">
          {data.personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin size={12} />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone size={12} />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail size={12} />
              <span className="truncate">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <span className="text-[10px]">in</span>
              <span className="truncate text-[10px]">{data.personalInfo.linkedin}</span>
            </div>
          )}
        </div>
        
        {/* Skills in sidebar */}
        {data.skillCategories.some(cat => cat.skills.length > 0) && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-1">
              {t.skills}
            </h2>
            <div className="space-y-2">
              {data.skillCategories.filter(cat => cat.skills.length > 0).flatMap(cat =>
                cat.skills.filter(s => s.name).map(skill => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Languages */}
        {data.skillCategories.find(c => c.id === 'languages')?.skills.length && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-1">
              {t.languageSkills}
            </h2>
            <div className="space-y-1">
              {data.skillCategories.find(c => c.id === 'languages')?.skills.filter(s => s.name).map(skill => (
                <div key={skill.id} className="text-xs">
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded ${i < skill.level / 25 ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-5 bg-white">
        {/* Profile */}
        {(data.professionalSummary.profile || data.professionalSummary.objective) && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-600 border-b-2 border-cyan-500 pb-1 mb-2">
              Perfil
            </h2>
            {data.professionalSummary.profile && (
              <p className="text-gray-700 text-sm leading-relaxed">{data.professionalSummary.profile}</p>
            )}
          </section>
        )}
        
        {/* Experience */}
        {data.experience.some(e => e.company) && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-600 border-b-2 border-cyan-500 pb-1 mb-3">
              {t.workExperience}
            </h2>
            <div className="space-y-3">
              {data.experience.filter(e => e.company).map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-cyan-200">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-cyan-500" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{exp.position}</h3>
                      <p className="text-cyan-700 text-xs font-medium">{exp.company}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      {exp.startDate} - {exp.current ? t.placeholders.endDate : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-xs mt-1 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {data.education.some(e => e.institution) && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-600 border-b-2 border-cyan-500 pb-1 mb-3">
              {t.education}
            </h2>
            <div className="space-y-2">
              {data.education.filter(e => e.institution).map(edu => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.field && ` - ${edu.field}`}</h3>
                  <p className="text-gray-600 text-xs">{edu.institution}</p>
                  <p className="text-gray-500 text-[10px]">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {data.projects.some(p => p.title) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-600 border-b-2 border-cyan-500 pb-1 mb-3">
              {t.projects}
            </h2>
            <div className="space-y-2">
              {data.projects.filter(p => p.title).map(proj => (
                <div key={proj.id}>
                  <h3 className="font-semibold text-gray-900 text-sm">{proj.title}</h3>
                  {proj.description && <p className="text-gray-600 text-xs">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

// ============== TEMPLATE: CREATIVO ==============
function CreativeTemplate({ data, t, language }: { data: CVData; t: typeof translations.es; language: LanguageType }) {
  return (
    <div className="font-sans relative overflow-hidden">
      {/* Decorative Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-6 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-20 h-20 border-2 border-white rounded-full" />
          <div className="absolute bottom-2 right-10 w-16 h-16 border-2 border-white rotate-45" />
          <div className="absolute top-6 right-1/3 w-8 h-8 bg-white/20 rounded-full" />
        </div>
        <div className="relative flex items-center gap-4">
          {data.personalInfo.photo && (
            <div className="w-22 h-22 rounded-2xl overflow-hidden border-3 border-white/40 shadow-xl transform rotate-3">
              <img src={data.personalInfo.photo} alt="" className="w-full h-full object-cover -rotate-3 scale-110" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              {data.personalInfo.fullName || t.placeholders.fullName}
            </h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/90">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            </div>
          </div>
        </div>
      </header>
      
      <div className="p-6 space-y-5">
        {/* Profile with colored background */}
        {(data.professionalSummary.profile || data.professionalSummary.objective) && (
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
              {t.professionalSummary}
            </h2>
            <p className="text-gray-700 text-sm">{data.professionalSummary.profile || data.professionalSummary.objective}</p>
          </section>
        )}
        
        {/* Experience with colorful timeline */}
        {data.experience.some(e => e.company) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-[10px]">💼</span>
              {t.workExperience}
            </h2>
            <div className="space-y-3">
              {data.experience.filter(e => e.company).map((exp, i) => (
                <div key={exp.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-purple-500' : 'bg-pink-500'}`} />
                    {i < data.experience.filter(e => e.company).length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-300 to-pink-300 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-purple-600 text-sm font-medium">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {exp.startDate} - {exp.current ? t.placeholders.endDate : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {data.education.some(e => e.institution) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-[10px]">🎓</span>
              {t.education}
            </h2>
            <div className="grid gap-2">
              {data.education.filter(e => e.institution).map(edu => (
                <div key={edu.id} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.field && ` en ${edu.field}`}</h3>
                  <p className="text-orange-700 text-xs">{edu.institution}</p>
                  <p className="text-gray-500 text-[10px] mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Skills as tags */}
        {data.skillCategories.some(cat => cat.skills.length > 0) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-[10px]">⭐</span>
              {t.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skillCategories.flatMap(cat =>
                cat.skills.filter(s => s.name).map(skill => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{
                      background: `linear-gradient(135deg, hsl(${Math.random() * 60 + 250}, 70%, 55%), hsl(${Math.random() * 60 + 280}, 70%, 60%))`
                    }}
                  >
                    {skill.name}
                  </span>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ============== TEMPLATE: MINIMALISTA ==============
function MinimalistTemplate({ data, t, language }: { data: CVData; t: typeof translations.es; language: LanguageType }) {
  return (
    <div className="font-sans text-gray-800 p-8">
      {/* Minimal Header */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-light text-gray-900 tracking-wide">
          {data.personalInfo.fullName || t.placeholders.fullName}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-gray-500">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </header>
      
      <div className="space-y-8">
        {/* Profile */}
        {(data.professionalSummary.profile || data.professionalSummary.objective) && (
          <section>
            <p className="text-gray-600 leading-relaxed text-sm max-w-lg">
              {data.professionalSummary.profile || data.professionalSummary.objective}
            </p>
          </section>
        )}
        
        {/* Experience - Clean List */}
        {data.experience.some(e => e.company) && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
              {t.workExperience}
            </h2>
            <div className="space-y-4">
              {data.experience.filter(e => e.company).map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-normal text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {data.education.some(e => e.institution) && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
              {t.education}
            </h2>
            <div className="space-y-3">
              {data.education.filter(e => e.institution).map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-normal text-gray-900">{edu.degree}{edu.field && `, ${edu.field}`}</h3>
                    <span className="text-xs text-gray-400">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Skills - Simple List */}
        {data.skillCategories.some(cat => cat.skills.length > 0) && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
              {t.skills}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {data.skillCategories.flatMap(cat =>
                cat.skills.filter(s => s.name).map(skill => (
                  <span key={skill.id} className="text-sm text-gray-600">
                    {skill.name}
                  </span>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ============== TEMPLATE: EJECUTIVO ==============
function ExecutiveTemplate({ data, t, language }: { data: CVData; t: typeof translations.es; language: LanguageType }) {
  return (
    <div className="font-serif">
      {/* Dark Executive Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white p-8">
        <div className="flex items-end gap-5">
          {data.personalInfo.photo && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-amber-400/50 shadow-2xl">
              <img src={data.personalInfo.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 pb-1">
            <h1 className="text-2xl font-bold tracking-wide text-white">
              {data.personalInfo.fullName || t.placeholders.fullName}
            </h1>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-gray-300">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12} />{data.personalInfo.location}</span>}
            </div>
          </div>
        </div>
      </header>
      
      <div className="p-6 space-y-5 bg-stone-50 min-h-full">
        {/* Executive Summary */}
        {(data.professionalSummary.profile || data.professionalSummary.objective) && (
          <section className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <Star size={12} className="text-amber-500" />
              Resumen Ejecutivo
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed font-light">
              {data.professionalSummary.profile || data.professionalSummary.objective}
            </p>
          </section>
        )}
        
        {/* Experience - Executive Style */}
        {data.experience.some(e => e.company) && (
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Briefcase size={14} className="text-slate-500" />
              {t.workExperience}
            </h2>
            <div className="space-y-4">
              {data.experience.filter(e => e.company).map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900">{exp.position}</h3>
                      <p className="text-slate-600 text-sm font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {exp.startDate} – {exp.current ? 'Presente' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {data.education.some(e => e.institution) && (
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <GraduationCap size={14} className="text-slate-500" />
              {t.education}
            </h2>
            <div className="space-y-3">
              {data.education.filter(e => e.institution).map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{edu.degree}{edu.field && ` en ${edu.field}`}</h3>
                    <p className="text-slate-600 text-sm">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Core Competencies */}
        {data.skillCategories.some(cat => cat.skills.length > 0) && (
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Award size={14} className="text-slate-500" />
              Competencias Clave
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {data.skillCategories.flatMap(cat =>
                cat.skills.filter(s => s.name).map(skill => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-700">{skill.name}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
