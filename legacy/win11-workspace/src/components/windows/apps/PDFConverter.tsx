'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileDown,
  FileUp,
  FileText,
  Image,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  ArrowRightLeft,
  FileImage,
  File,
  Download,
  Plus,
  Trash2,
  GripVertical,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Settings,
  FileSignature,
  Building2,
  CalendarClock,
  Users,
  Plane,
  IdCard,
  Briefcase,
  PenTool,
  Eye,
  ChevronRight,
  Languages,
  FolderOpen,
  RefreshCw,
  Merge,
  Scissors,
  Archive
} from 'lucide-react'
import { WithWindowIdProps } from '../Window'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// ============== TYPES & INTERFACES ==============
interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  preview?: string
  order: number
}

interface ConversionTool {
  id: string
  icon: React.ElementType
  labelEs: string
  labelPt: string
  descEs: string
  descPt: string
  color: string
  acceptTypes: string[]
}

interface DocumentTemplate {
  id: string
  category: string
  icon: React.ElementType
  titleEs: string
  titlePt: string
  descEs: string
  descPt: string
  contentEs: string
  contentPt: string
  fields: TemplateField[]
}

interface TemplateField {
  name: string
  labelEs: string
  labelPt: string
  placeholderEs: string
  placeholderPt: string
  type: 'text' | 'textarea' | 'date' | 'select'
  options?: { value: string; labelEs: string; labelPt: string }[]
}

interface EditorSettings {
  fontFamily: string
  fontSize: number
  alignment: 'left' | 'center' | 'right' | 'justify'
  pageSize: 'A4' | 'Letter' | 'Legal'
  margins: number
  showHeader: boolean
  showFooter: boolean
  headerText: string
  footerText: string
}

// ============== TRANSLATIONS ==============
const translations = {
  es: {
    title: 'PDF Converter Pro',
    subtitle: 'Herramienta profesional de conversión de documentos',
    tools: 'Herramientas',
    uploadFiles: 'Subir archivos',
    dragDrop: 'Arrastra y suelta archivos aquí',
    orClick: 'o haz clic para seleccionar',
    supportedFormats: 'Formatos soportados',
    convert: 'Convertir',
    converting: 'Convirtiendo...',
    complete: '¡Conversión completada!',
    download: 'Descargar PDF',
    addMore: 'Añadir más',
    clearAll: 'Limpiar todo',
    files: 'archivos',
    preview: 'Vista previa',
    editor: 'Editor de texto',
    templates: 'Plantillas',
    settings: 'Configuración',
    recentFiles: 'Archivos recientes',
    noFiles: 'Ningún archivo seleccionado',
    processing: 'Procesando...',
    success: '¡Éxito!',
    error: 'Error',
    fontSize: 'Tamaño fuente',
    fontFamily: 'Tipo de letra',
    alignment: 'Alineación',
    pageSize: 'Tamaño página',
    margins: 'Márgenes',
    header: 'Encabezado',
    footer: 'Pie de página',
    bold: 'Negrita',
    italic: 'Cursiva',
    underline: 'Subrayado',
    bulletList: 'Lista viñetas',
    numberList: 'Lista numerada',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    fitWidth: 'Ajustar ancho',
    fitPage: 'Ajustar página',
    page: 'Página',
    of: 'de',
    print: 'Imprimir',
    copyText: 'Copiar texto',
    newDocument: 'Nuevo documento',
    saveDraft: 'Guardar borrador',
    templateCategories: {
      employment: 'Empleo',
      administrative: 'Administrativo',
      travel: 'Viajes',
      official: 'Oficial'
    },
    useTemplate: 'Usar plantilla',
    fillFields: 'Completa los campos',
    generateDoc: 'Generar documento',
    mergeTitle: 'Combinar PDFs',
    mergeDesc: 'Une varios PDF en uno solo',
    splitTitle: 'Dividir PDF',
    splitDesc: 'Extrae páginas específicas',
    compressTitle: 'Comprimir PDF',
    compressDesc: 'Reduce el tamaño del archivo',
    wordToPdfTitle: 'Word a PDF',
    wordToPdfDesc: 'Convierte documentos Word',
    imageToPdfTitle: 'Imagen a PDF',
    imageToPdfDesc: 'Crea PDF desde imágenes',
    textToPdfTitle: 'Texto a PDF',
    textToPdfDesc: 'Escribe o usa plantillas',
    selectPages: 'Selecciona páginas (ej: 1-3, 5, 7-9)',
    compressionLevel: 'Nivel de compresión',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    maximum: 'Máximo',
    estimatedSize: 'Tamaño estimado',
    originalSize: 'Tamaño original',
    quality: 'Calidad',
    fileOrder: 'Orden de archivos',
    dragToReorder: 'Arrastra para reordenar',
    totalPages: 'Total páginas',
    removeFile: 'Eliminar archivo',
    language: 'Idioma',
    immigrantTools: 'Herramientas para inmigrantes',
    quickTemplates: 'Plantillas rápidas',
    popularDocs: 'Documentos populares'
  },
  pt: {
    title: 'PDF Converter Pro',
    subtitle: 'Ferramenta profissional de conversão de documentos',
    tools: 'Ferramentas',
    uploadFiles: 'Enviar arquivos',
    dragDrop: 'Arraste e solte arquivos aqui',
    orClick: 'ou clique para selecionar',
    supportedFormats: 'Formatos suportados',
    convert: 'Converter',
    converting: 'Convertendo...',
    complete: 'Conversão concluída!',
    download: 'Baixar PDF',
    addMore: 'Adicionar mais',
    clearAll: 'Limpar tudo',
    files: 'arquivos',
    preview: 'Visualização',
    editor: 'Editor de texto',
    templates: 'Modelos',
    settings: 'Configurações',
    recentFiles: 'Arquivos recentes',
    noFiles: 'Nenhum arquivo selecionado',
    processing: 'Processando...',
    success: 'Sucesso!',
    error: 'Erro',
    fontSize: 'Tamanho fonte',
    fontFamily: 'Tipo de letra',
    alignment: 'Alinhamento',
    pageSize: 'Tamanho página',
    margins: 'Margens',
    header: 'Cabeçalho',
    footer: 'Rodapé',
    bold: 'Negrito',
    italic: 'Itálico',
    underline: 'Sublinhado',
    bulletList: 'Lista marcadores',
    numberList: 'Lista numerada',
    zoomIn: 'Ampliar',
    zoomOut: 'Reduzir',
    fitWidth: 'Ajustar largura',
    fitPage: 'Ajustar página',
    page: 'Página',
    of: 'de',
    print: 'Imprimir',
    copyText: 'Copiar texto',
    newDocument: 'Novo documento',
    saveDraft: 'Salvar rascunho',
    templateCategories: {
      employment: 'Emprego',
      administrative: 'Administrativo',
      travel: 'Viagens',
      official: 'Oficial'
    },
    useTemplate: 'Usar modelo',
    fillFields: 'Preencha os campos',
    generateDoc: 'Gerar documento',
    mergeTitle: 'Combinar PDFs',
    mergeDesc: 'Junte vários PDF em um só',
    splitTitle: 'Dividir PDF',
    splitDesc: 'Extraia páginas específicas',
    compressTitle: 'Comprimir PDF',
    compressDesc: 'Reduza o tamanho do arquivo',
    wordToPdfTitle: 'Word para PDF',
    wordToPdfDesc: 'Converta documentos Word',
    imageToPdfTitle: 'Imagem para PDF',
    imageToPdfDesc: 'Crie PDF a partir de imagens',
    textToPdfTitle: 'Texto para PDF',
    textToPdfDesc: 'Escreva ou use modelos',
    selectPages: 'Selecione páginas (ex: 1-3, 5, 7-9)',
    compressionLevel: 'Nível de compressão',
    low: 'Baixo',
    medium: 'Médio',
    high: 'Alto',
    maximum: 'Máximo',
    estimatedSize: 'Tamanho estimado',
    originalSize: 'Tamanho original',
    quality: 'Qualidade',
    fileOrder: 'Ordem dos arquivos',
    dragToReorder: 'Arraste para reordenar',
    totalPages: 'Total de páginas',
    removeFile: 'Remover arquivo',
    language: 'Idioma',
    immigrantTools: 'Ferramentas para imigrantes',
    quickTemplates: 'Modelos rápidos',
    popularDocs: 'Documentos populares'
  }
}

// ============== CONVERSION TOOLS ==============
const conversionTools: ConversionTool[] = [
  {
    id: 'word-to-pdf',
    icon: FileText,
    labelEs: 'Word a PDF',
    labelPt: 'Word para PDF',
    descEs: 'Convertir documentos Word a PDF',
    descPt: 'Converter documentos Word para PDF',
    color: 'from-blue-500 to-blue-600',
    acceptTypes: ['.doc', '.docx']
  },
  {
    id: 'image-to-pdf',
    icon: Image,
    labelEs: 'Imagen a PDF',
    labelPt: 'Imagem para PDF',
    descEs: 'Combinar imágenes en un PDF',
    descPt: 'Combinar imagens em um PDF',
    color: 'from-green-500 to-emerald-600',
    acceptTypes: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  },
  {
    id: 'text-to-pdf',
    icon: Type,
    labelEs: 'Texto a PDF',
    labelPt: 'Texto para PDF',
    descEs: 'Escribir texto y convertirlo',
    descPt: 'Escrever texto e converter',
    color: 'from-purple-500 to-violet-600',
    acceptTypes: []
  },
  {
    id: 'pdf-merge',
    icon: Merge,
    labelEs: 'Combinar PDFs',
    labelPt: 'Combinar PDFs',
    descEs: 'Unir múltiples PDFs en uno',
    descPt: 'Juntar múltiplos PDFs em um',
    color: 'from-orange-500 to-amber-600',
    acceptTypes: ['.pdf']
  },
  {
    id: 'pdf-split',
    icon: Scissors,
    labelEs: 'Dividir PDF',
    labelPt: 'Dividir PDF',
    descEs: 'Extraer páginas del PDF',
    descPt: 'Extrair páginas do PDF',
    color: 'from-red-500 to-rose-600',
    acceptTypes: ['.pdf']
  },
  {
    id: 'compress-pdf',
    icon: Archive,
    labelEs: 'Comprimir PDF',
    labelPt: 'Comprimir PDF',
    descEs: 'Reducir tamaño del archivo',
    descPt: 'Reduzir tamanho do arquivo',
    color: 'from-cyan-500 to-teal-600',
    acceptTypes: ['.pdf']
  }
]

// ============== DOCUMENT TEMPLATES ==============
const documentTemplates: DocumentTemplate[] = [
  // Employment Templates
  {
    id: 'carta-solicitud-empleo',
    category: 'employment',
    icon: Briefcase,
    titleEs: 'Carta de Solicitud de Empleo',
    titlePt: 'Carta de Solicitação de Emprego',
    descEs: 'Solicitar un puesto de trabajo formal',
    descPt: 'Solicitar um emprego formal',
    contentEs: `{fecha}\n\n{nombre_completo}\n{direccion}\n{ciudad}, {codigo_postal}\n{telefono} | {email}\n\n{empresa_nombre}\nDepartamento de Recursos Humanos\n{empresa_direccion}\n{empresa_ciudad}\n\nAsunto: Solicitud de empleo - Puesto de {puesto_solicitado}\n\nEstimados señores:\n\nPor medio de la presente, tengo el honor de dirigirme a ustedes con el fin de manifestar mi interés en formar parte de su prestigiosa empresa como {puesto_solicitado}.\n\n{experiencia_texto}\n\nConsidero que mi perfil profesional se ajusta perfectamente a las necesidades de su organización. Poseeo habilidades en {habilidades} y disponibilidad inmediata para incorporarme.\n\nQuedo a su disposición para concertar una entrevista personal en la fecha que estimen conveniente.\n\nAgradezco de antemano su atención y quedo a la espera de sus noticias.\n\nAtentamente,\n\n__________________________\n{nombre_completo}\n{dni/nie}`,
    contentPt: `{data}\n\n{nome_completo}\n{endereco}\n{cidade}, {cep}\n{telefone} | {email}\n\n{empresa_nome}\nDepartamento de Recursos Humanos\n{empresa_endereco}\n{empresa_cidade}\n\nAssunto: Solicitação de emprego - Cargo de {cargo_solicitado}\n\nPrezados Senhores:\n\nPor meio da presente, tenho a honra de me dirigir a vocês para manifestar meu interesse em fazer parte de sua prestigiada empresa como {cargo_solicitado}.\n\n{experiencia_texto}\n\nConsidero que meu perfil profissional se ajusta perfeitamente às necessidades de sua organização. Possuo habilidades em {habilidades} e disponibilidade imediata para me incorporar.\n\nFico à disposição para agendar uma entrevista pessoal na data que julgarem conveniente.\n\nAgradeço antecipadamente sua atenção e fico no aguardo de suas notícias.\n\nAtenciosamente,\n\n__________________________\n{nome_completo}\n{documento_identidade}`,
    fields: [
      { name: 'nombre_completo', labelEs: 'Nombre completo', labelPt: 'Nome completo', placeholderEs: 'Juan García López', placeholderPt: 'João Silva Santos', type: 'text' },
      { name: 'direccion', labelEs: 'Dirección', labelPt: 'Endereço', placeholderEs: 'Calle Mayor, 25, 3º A', placeholderPt: 'Rua Principal, 25, 3º A', type: 'text' },
      { name: 'ciudad', labelEs: 'Ciudad', labelPt: 'Cidade', placeholderEs: 'Madrid', placeholderPt: 'Lisboa', type: 'text' },
      { name: 'codigo_postal', labelEs: 'Código Postal', labelPt: 'CEP', placeholderEs: '28001', placeholderPt: '1000-001', type: 'text' },
      { name: 'telefono', labelEs: 'Teléfono', labelPt: 'Telefone', placeholderEs: '+34 612 345 678', placeholderPt: '+351 912 345 678', type: 'text' },
      { name: 'email', labelEs: 'Email', labelPt: 'Email', placeholderEs: 'correo@ejemplo.com', placeholderPt: 'email@exemplo.com', type: 'text' },
      { name: 'empresa_nombre', labelEs: 'Nombre de la empresa', labelPt: 'Nome da empresa', placeholderEs: 'Empresa S.A.', placeholderPt: 'Empresa S.A.', type: 'text' },
      { name: 'empresa_direccion', labelEs: 'Dirección empresa', labelPt: 'Endereço empresa', placeholderEs: 'Av. Central, 100', placeholderPt: 'Av. Central, 100', type: 'text' },
      { name: 'empresa_ciudad', labelEs: 'Ciudad empresa', labelPt: 'Cidade empresa', placeholderEs: 'Barcelona', placeholderPt: 'Porto', type: 'text' },
      { name: 'puesto_solicitado', labelEs: 'Puesto solicitado', labelPt: 'Cargo solicitado', placeholderEs: 'Auxiliar Administrativo', placeholderPt: 'Auxiliar Administrativo', type: 'text' },
      { name: 'experiencia_texto', labelEs: 'Experiencia relevante', labelPt: 'Experiência relevante', placeholderEs: 'Cuento con 5 años de experiencia...', placeholderPt: 'Tenho 5 anos de experiência...', type: 'textarea' },
      { name: 'habilidades', labelEs: 'Habilidades principales', labelPt: 'Habilidades principais', placeholderEs: 'atención al cliente, informática, idiomas', placeholderPt: 'atenção ao cliente, informática, idiomas', type: 'text' },
      { name: 'dni/nie', labelEs: 'DNI/NIE', labelPt: 'Documento identidade', placeholderEs: 'Y12345678X', placeholderPt: '12345678', type: 'text' }
    ]
  },
  {
    id: 'curriculum-vitae',
    category: 'employment',
    icon: FileText,
    titleEs: 'Curriculum Vitae Básico',
    titlePt: 'Currículo Básico',
    descEs: 'Modelo de CV estándar europeo',
    descPt: 'Modelo de CV padrão europeu',
    contentEs: `CURRICULUM VITAE\n\nDATOS PERSONALES\n─────────────────\nNombre: {nombre_completo}\nFecha de nacimiento: {fecha_nacimiento}\nDirección: {direccion}\nTeléfono: {telefono}\nEmail: {email}\nNIE/DNI: {nie_dni}\nNacionalidad: {nacionalidad}\n\nFORMACIÓN ACADÉMICA\n─────────────────\n{formacion_academica}\n\nEXPERIENCIA LABORAL\n─────────────────\n{experiencia_laboral}\n\nIDIOMAS\n─────────────────\n{idiomas}\n\nHABILIDADES INFORMÁTICAS\n─────────────────\n{habilidades_informaticas}\n\nOTROS DATOS DE INTERÉS\n─────────────────\n{otros_intereses}`,
    contentPt: `CURRICULUM VITAE\n\nDADOS PESSOAIS\n─────────────────\nNome: {nome_completo}\nData de nascimento: {data_nascimento}\nEndereço: {endereco}\nTelefone: {telefone}\nEmail: {email}\nNIE/BI: {nie_bi}\nNacionalidade: {nacionalidade}\n\nFORMAÇÃO ACADÊMICA\n─────────────────\n{formacao_academica}\n\nEXPERIÊNCIA PROFISSIONAL\n─────────────────\n{experiencia_profissional}\n\nÍDIOMAS\n─────────────────\n{idiomas}\n\nHABILIDADES INFORMÁTICAS\n─────────────────\n{habilidades_informaticas}\n\nOUTROS DADOS DE INTERESSE\n─────────────────\n{outros_interesses}`,
    fields: [
      { name: 'nombre_completo', labelEs: 'Nombre completo', labelPt: 'Nome completo', placeholderEs: 'María González Ruiz', placeholderPt: 'Maria Gonçalves Silva', type: 'text' },
      { name: 'fecha_nacimiento', labelEs: 'Fecha de nacimiento', labelPt: 'Data de nascimento', placeholderEs: '15/03/1985', placeholderPt: '15/03/1985', type: 'text' },
      { name: 'direccion', labelEs: 'Dirección', labelPt: 'Endereço', placeholderEs: 'Calle Ejemplo, 10', placeholderPt: 'Rua Exemplo, 10', type: 'text' },
      { name: 'telefono', labelEs: 'Teléfono', labelPt: 'Telefone', placeholderEs: '+34 600 000 000', placeholderPt: '+351 900 000 000', type: 'text' },
      { name: 'email', labelEs: 'Email', labelPt: 'Email', placeholderEs: 'email@ejemplo.com', placeholderPt: 'email@exemplo.com', type: 'text' },
      { name: 'nie_dni', labelEs: 'NIE/DNI', labelPt: 'NIE/BI', placeholderEs: 'Z01234567X', placeholderPt: '123456789', type: 'text' },
      { name: 'nacionalidad', labelEs: 'Nacionalidad', labelPt: 'Nacionalidade', placeholderEs: 'Colombiana', placeholderPt: 'Brasileira', type: 'text' },
      { name: 'formacion_academica', labelEs: 'Formación académica', labelPt: 'Formação acadêmica', placeholderEs: '2010-2014: Grado en Administración', placeholderPt: '2010-2014: Graduação em Administração', type: 'textarea' },
      { name: 'experiencia_laboral', labelEs: 'Experiencia laboral', labelPt: 'Experiência profissional', placeholderEs: '2018-actualidad: Auxiliar en Empresa X', placeholderPt: '2018-atualidade: Auxiliar na Empresa X', type: 'textarea' },
      { name: 'idiomas', labelEs: 'Idiomas', labelPt: 'Idiomas', placeholderEs: 'Español: Nativo | Inglés: B1 | Portugués: C1', placeholderPt: 'Português: Nativo | Inglês: B1 | Espanhol: C1', type: 'text' },
      { name: 'habilidades_informaticas', labelEs: 'Habilidades informáticas', labelPt: 'Habilidades informáticas', placeholderEs: 'Office, Internet, Gestión ERP', placeholderPt: 'Office, Internet, Gestão ERP', type: 'text' },
      { name: 'otros_intereses', labelEs: 'Otros intereses', labelPt: 'Outros interesses', placeholderEs: 'Permiso de conducción B, Disponibilidad para viajar', placeholderPt: 'Carta de condução B, Disponibilidade para viajar', type: 'textarea' }
    ]
  },
  // Administrative Templates
  {
    id: 'cita-previa-sepe',
    category: 'administrative',
    icon: CalendarClock,
    titleEs: 'Solicitud Cita Previa SEPE',
    titlePt: 'Pedido Marcação SEPE',
    descEs: 'Cita en el Servicio Público de Empleo',
    descPt: 'Marcação no Serviço Público de Emprego',
    contentEs: `SOLICITUD DE CITA PREVIA\nSERVICIO PÚBLICO DE EMPLEO ESTATAL (SEPE)\n\nDatos del solicitante:\n───────────────────────\nNombre y Apellidos: {nombre_completo}\nNIE/NIF: {nie_nif}\nDirección: {direccion}\nCiudad: {ciudad}\nCódigo Postal: {codigo_postal}\nTeléfono: {telefono}\nEmail: {email}\n\nMotivo de la solicitud:\n───────────────────────\n{motivo_solicitud}\n\nTrámite solicitado:\n─────────────────\n☐ Inscripción como demandante de empleo\n☐ Renovación de demanda\n☐ Certificado de vida labora\n☐ Tarjeta de demandante de empleo\n☐ Informe de vida laboral\n☐ Otros: {otros_tramite}\n\nDisponibilidad horaria:\n────────────────────\nPreferencia de fecha: {fecha_preferida}\nFranja horaria: {franja_horaria}\n\nFecha: {fecha_actual}\n\nFirma: ________________________`,
    contentPt: `PEDIDO DE MARCAÇÃO PRÉVIA\nSERVIÇO PÚBLICO DE EMPREGO (SEPE)\n\nDados do requerente:\n─────────────────────\nNome Completo: {nome_completo}\nNIE/NIF: {nie_nif}\nEndereço: {endereco}\nCidade: {cidade}\nCódigo Postal: {codigo_postal}\nTelefone: {telefone}\nEmail: {email}\n\nMotivo do pedido:\n─────────────────\n{motivo_pedido}\n\nTramite solicitado:\n─────────────────\n☐ Inscrição como demandante de emprego\n☐ Renovação de demanda\n☐ Certificado de vida laboral\n☐ Cartão de demandante de emprego\n☐ Relatório de vida laboral\n☐ Outros: {outros_tramite}\n\nDisponibilidade horária:\n─────────────────────\nPreferência de data: {data_preferida}\nFaixa horária: {faixa_horaria}\n\nData: {data_atual}\n\nAssinatura: ________________________`,
    fields: [
      { name: 'nombre_completo', labelEs: 'Nombre completo', labelPt: 'Nome completo', placeholderEs: 'Carlos Mendoza Pérez', placeholderPt: 'Carlos Mendoza Pérez', type: 'text' },
      { name: 'nie_nif', labelEs: 'NIE/NIF', labelPt: 'NIE/NIF', placeholderEs: 'Y12345678X', placeholderPt: 'Y12345678X', type: 'text' },
      { name: 'direccion', labelEs: 'Dirección', labelPt: 'Endereço', placeholderEs: 'Calle Principal, 15', placeholderPt: 'Rua Principal, 15', type: 'text' },
      { name: 'ciudad', labelEs: 'Ciudad', labelPt: 'Cidade', placeholderEs: 'Sevilla', placeholderPt: 'Sevilha', type: 'text' },
      { name: 'codigo_postal', labelEs: 'Código Postal', labelPt: 'Código Postal', placeholderEs: '41001', placeholderPt: '41001', type: 'text' },
      { name: 'telefono', labelEs: 'Teléfono', labelPt: 'Telefone', placeholderEs: '+34 611 222 333', placeholderPt: '+34 611 222 333', type: 'text' },
      { name: 'email', labelEs: 'Email', labelPt: 'Email', placeholderEs: 'correo@email.com', placeholderPt: 'correo@email.com', type: 'text' },
      { name: 'motivo_solicitud', labelEs: 'Motivo de solicitud', labelPt: 'Motivo do pedido', placeholderEs: 'Necesito certificado para tramitar prestación', placeholderPt: 'Preciso de certificado para pedir prestação', type: 'textarea' },
      { name: 'otros_tramite', labelEs: 'Otros (especificar)', labelPt: 'Outros (especificar)', placeholderEs: '', placeholderPt: '', type: 'text' },
      { name: 'fecha_preferida', labelEs: 'Fecha preferida', labelPt: 'Data preferida', placeholderEs: 'DD/MM/YYYY', placeholderPt: 'DD/MM/AAAA', type: 'text' },
      { name: 'franja_horaria', labelEs: 'Franja horaria', labelPt: 'Faixa horária', placeholderEs: 'Mañana (9:00-14:00)', placeholderPt: 'Manhã (9:00-14:00)', type: 'select', options: [
        { value: 'manana', labelEs: 'Mañana (9:00-14:00)', labelPt: 'Manhã (9:00-14:00)' },
        { value: 'tarde', labelEs: 'Tarde (16:00-18:00)', labelPt: 'Tarde (16:00-18:00)' }
      ]}
    ]
  },
  {
    id: 'empadronamiento',
    category: 'administrative',
    icon: Building2,
    titleEs: 'Solicitud Empadronamiento',
    titlePt: 'Pedido de Atestado de Morada',
    descEs: 'Certificado de empadronamiento en el Ayuntamiento',
    descPt: 'Atestado de morada na Câmara Municipal',
    contentEs: `SOLICITUD DE CERTIFICADO DE EMPADRONAMIENTO\n\nAYUNTAMIENTO DE {ayuntamiento}\n\nDatos del solicitante:\n───────────────────────\nNombre y Apellidos: {nombre_completo}\nNIE/Pasaporte: {nie_pasaporte}\nFecha de nacimiento: {fecha_nacimiento}\nNacionalidad: {nacionalidad}\n\nDirección de empadronamiento:\n────────────────────────────\nCalle/Avenida: {calle_avenido}\nNúmero y Piso: {numero_piso}\nPuerta: {puerta}\nCiudad: {ciudad}\nCódigo Postal: {codigo_postal}\n\nTipo de vivienda:\n───────────────\n☐ Vivienda propia\n☐ Vivienda alquilada\n☐ Vivienda familiar/compartida\n☐ Otra: {otra_vivienda}\n\nTipo de certificado solicitado:\n──────────────────────────\n☐ Ordinario (gratuito)\n☐ Histórico\n☐ Con convivientes\n☐ Para fines administrativos específicos\n\nDeclaro bajo responsabilidad que los datos facilitados son ciertos y que resido efectivamente en la dirección indicada.\n\nEn {ciudad}, a {fecha_actual}\n\n_________________________________\nFirma del solicitante`,
    contentPt: `PEDIDO DE ATESTADO DE MORADA\n\nCÂMARA MUNICIPAL DE {camara_municipal}\n\nDados do requerente:\n─────────────────────\nNome Completo: {nome_completo}\nNIE/Passaporte: {nie_passaporte}\nData de nascimento: {data_nascimento}\nNacionalidade: {nacionalidade}\n\nEndereço de morada:\n──────────────────\nRua/Avenida: {rua_avenida}\nNúmero e Andar: {numero_andar}\nPorta: {porta}\nCidade: {cidade}\nCódigo Postal: {codigo_postal}\n\nTipo de habitação:\n─────────────────\n☐ Habitação própria\n☐ Habitação arrendada\n☐ Habitação familiar/partilhada\n☐ Outra: {outra_habitacao}\n\nTipo de atestado solicitado:\n─────────────────────────\n☐ Ordinário (gratuito)\n☐ Histórico\n☐ Com coabitantes\n☐ Para fins administrativos específicos\n\nDeclaro sob responsabilidade que os dados fornecidos são verdadeiros e que resido efetivamente no endereço indicado.\n\nEm {cidade}, em {data_atual}\n\n_________________________________\nAssinatura do requerente`,
    fields: [
      { name: 'ayuntamiento', labelEs: 'Ayuntamiento', labelPt: 'Câmara Municipal', placeholderEs: 'Madrid', placeholderPt: 'Lisboa', type: 'text' },
      { name: 'nombre_completo', labelEs: 'Nombre completo', labelPt: 'Nome completo', placeholderEs: 'Ana Rodríguez Martín', placeholderPt: 'Ana Rodríguez Martín', type: 'text' },
      { name: 'nie_pasaporte', labelEs: 'NIE/Pasaporte', labelPt: 'NIE/Passaporte', placeholderEs: 'X98765432Y', placeholderPt: 'X98765432Y', type: 'text' },
      { name: 'fecha_nacimiento', labelEs: 'Fecha de nacimiento', labelPt: 'Data de nascimento', placeholderEs: '20/06/1990', placeholderPt: '20/06/1990', type: 'text' },
      { name: 'nacionalidad', labelEs: 'Nacionalidad', labelPt: 'Nacionalidade', placeholderEs: 'Argentina', placeholderPt: 'Argentina', type: 'text' },
      { name: 'calle_avenido', labelEs: 'Calle/Avenida', labelPt: 'Rua/Avenida', placeholderEs: 'Gran Vía', placeholderPt: 'Avenida da Liberdade', type: 'text' },
      { name: 'numero_piso', labelEs: 'Nº y Piso', labelPt: 'Nº e Andar', placeholderEs: '45, 2º A', placeholderPt: '45, 2º A', type: 'text' },
      { name: 'puerta', labelEs: 'Puerta', labelPt: 'Porta', placeholderEs: '1ª', placeholderPt: '1ª', type: 'text' },
      { name: 'ciudad', labelEs: 'Ciudad', labelPt: 'Cidade', placeholderEs: 'Madrid', placeholderPt: 'Lisboa', type: 'text' },
      { name: 'codigo_postal', labelEs: 'Código Postal', labelPt: 'Código Postal', placeholderEs: '28013', placeholderPt: '1250-096', type: 'text' },
      { name: 'otra_vivienda', labelEs: 'Otro tipo (especificar)', labelPt: 'Outro tipo (especificar)', placeholderEs: '', placeholderPt: '', type: 'text' }
    ]
  },
  // Travel Templates
  {
    id: 'autorizacion-viaje-menores',
    category: 'travel',
    icon: Plane,
    titleEs: 'Autorización Viaje Menores',
    titlePt: 'Autorização Viagem Menores',
    descEs: 'Permiso para que menores viajen solos',
    descPt: 'Permissão para menores viajarem sozinhos',
    contentEs: `AUTORIZACIÓN PARA VIAJE DE MENORES\n\nDATOS DEL MENOR\n───────────────\nNombre completo: {menor_nombre}\nFecha de nacimiento: {menor_fecha_nac}\nPasaporte/DNI: {menor_documento}\nNacionalidad: {menor_nacionalidad}\n\nDATOS DEL PADRE/MADRE/TUTOR QUE AUTORIZA\n─────────────────────────────────────────\nNombre completo: {padre_nombre}\nDNI/NIE/Pasaporte: {padre_documento}\nDirección: {padre_direccion}\nTeléfono: {padre_telefono}\nParentesco: {parentesco}\n\nDATOS DEL ACOMPAÑANTE (si procede)\n─────────────────────────────────\nNombre: {acompanante_nombre}\nDNI/Pasaporte: {acompanante_documento}\nParentesco con el menor: {acompanante_parentesco}\n\nDETALLE DEL VIAJE\n────────────────\nPaís(es) de destino: {pais_destino}\nCiudad destino: {ciudad_destino}\nFecha de salida: {fecha_salida}\nFecha de regreso: {fecha_regreso}\nMotivo del viaje: {motivo_viaje}\n\nDECLARACIÓN\n───────────\nYo, {padre_nombre}, con DNI/NIE {padre_documento}, en calidad de {parentesco} de {menor_nombre}, AUTORIZO expresamente al menor a realizar el viaje descrito, así como a ser acompañado por {acompanante_nombre || "sí mismo/a"} durante el trayecto.\n\nEsta autorización es válida exclusivamente para el viaje y fechas indicados.\n\nLugar y fecha: {ciudad_salida}, {fecha_firma}\n\n_________________________________\nFirma del padre/madre/tutor`,
    contentPt: `AUTORIZAÇÃO PARA VIAGEM DE MENORES\n\nDADOS DO MENOR\n──────────────\nNome completo: {menor_nome}\nData de nascimento: {menor_data_nasc}\nPassaporte/BI: {menor_documento}\nNacionalidade: {menor_nacionalidade}\n\nDADOS DO PAI/MÃE/TUTOR QUE AUTORIZA\n─────────────────────────────────────\nNome completo: {pai_nome}\nBI/NIE/Passaporte: {pai_documento}\nEndereço: {pai_endereco}\nTelefone: {pai_telefone}\nParentesco: {parentesco}\n\nDADOS DO ACOMPANHANTE (se aplicável)\n───────────────────────────────────\nNome: {acompanhante_nome}\nBI/Passaporte: {acompanhante_documento}\nParentesco com o menor: {acompanhante_parentesco}\n\nDETALHE DA VIAGEM\n─────────────────\nPaís(es) de destino: {pais_destino}\nCidade destino: {cidade_destino}\nData de saída: {data_saida}\nData de regresso: {data_regresso}\nMotivo da viagem: {motivo_viagem}\n\nDECLARAÇÃO\n──────────\nEu, {pai_nome}, com BI/NIE {pai_documento}, na qualidade de {parentesco} de {menor_nome}, AUTORIZO expressamente o menor a realizar a viagem descrita, bem como a ser acompanhado por {acompanhante_nome || "mim mesmo(a)"} durante o trajeto.\n\nEsta autorização é válida exclusivamente para a viagem e datas indicados.\n\nLocal e data: {cidade_saida}, {data_assinatura}\n\n_________________________________\nAssinatura do pai/mãe/tutor`,
    fields: [
      { name: 'menor_nombre', labelEs: 'Nombre del menor', labelPt: 'Nome do menor', placeholderEs: 'Sofía Martínez García', placeholderPt: 'Sofia Martinez Garcia', type: 'text' },
      { name: 'menor_fecha_nac', labelEs: 'Fecha nacimiento menor', labelPt: 'Data nascimento menor', placeholderEs: '12/05/2015', placeholderPt: '12/05/2015', type: 'text' },
      { name: 'menor_documento', labelEs: 'Documento del menor', labelPt: 'Documento do menor', placeholderEs: 'Pasaporte AB1234567', placeholderPt: 'Passaporte AB1234567', type: 'text' },
      { name: 'menor_nacionalidad', labelEs: 'Nacionalidad del menor', labelPt: 'Nacionalidade do menor', placeholderEs: 'Española', placeholderPt: 'Espanhola', type: 'text' },
      { name: 'padre_nombre', labelEs: 'Nombre del padre/tutor', labelPt: 'Nome do pai/tutor', placeholderEs: 'Roberto Martínez López', placeholderPt: 'Roberto Martinez Lopez', type: 'text' },
      { name: 'padre_documento', labelEs: 'Documento del padre/tutor', labelPt: 'Documento do pai/tutor', placeholderEs: 'Y12345678X', placeholderPt: 'Y12345678X', type: 'text' },
      { name: 'padre_direccion', labelEs: 'Dirección', labelPt: 'Endereço', placeholderEs: 'Calle Falsa, 123', placeholderPt: 'Rua Falsa, 123', type: 'text' },
      { name: 'padre_telefono', labelEs: 'Teléfono', labelPt: 'Telefone', placeholderEs: '+34 600 111 222', placeholderPt: '+34 600 111 222', type: 'text' },
      { name: 'parentesco', labelEs: 'Parentesco', labelPt: 'Parentesco', placeholderEs: 'Padre', placeholderPt: 'Pai', type: 'select', options: [
        { value: 'padre', labelEs: 'Padre', labelPt: 'Pai' },
        { value: 'madre', labelEs: 'Madre', labelPt: 'Mãe' },
        { value: 'tutor', labelEs: 'Tutor legal', labelPt: 'Tutor legal' }
      ]},
      { name: 'acompanante_nombre', labelEs: 'Nombre acompañante', labelPt: 'Nome acompanhante', placeholderEs: '(opcional)', placeholderPt: '(opcional)', type: 'text' },
      { name: 'acompanante_documento', labelEs: 'Documento acompañante', labelPt: 'Documento acompanhante', placeholderEs: '', placeholderPt: '', type: 'text' },
      { name: 'pais_destino', labelEs: 'País de destino', labelPt: 'País de destino', placeholderEs: 'Colombia', placeholderPt: 'Brasil', type: 'text' },
      { name: 'ciudad_destino', labelEs: 'Ciudad destino', labelPt: 'Cidade destino', placeholderEs: 'Bogotá', placeholderPt: 'Rio de Janeiro', type: 'text' },
      { name: 'fecha_salida', labelEs: 'Fecha de salida', labelPt: 'Data de saída', placeholderEs: '15/07/2024', placeholderPt: '15/07/2024', type: 'text' },
      { name: 'fecha_regreso', labelEs: 'Fecha de regreso', labelPt: 'Data de regresso', placeholderEs: '30/08/2024', placeholderPt: '30/08/2024', type: 'text' },
      { name: 'motivo_viaje', labelEs: 'Motivo del viaje', labelPt: 'Motivo da viagem', placeholderEs: 'Vacaciones familiares', placeholderPt: 'Férias familiares', type: 'text' },
      { name: 'ciudad_salida', labelEs: 'Ciudad de salida', labelPt: 'Cidade de saída', placeholderEs: 'Madrid', placeholderPt: 'Madri', type: 'text' }
    ]
  },
  // Official Templates
  {
    id: 'renovacion-nie',
    category: 'official',
    icon: IdCard,
    titleEs: 'Solicitud Renovación NIE/TIE',
    titlePt: 'Pedido Renovação NIE/TIE',
    descEs: 'Tarjeta de extranjero renovación',
    descPt: 'Cartão de estrangeiro renovação',
    contentEs: `SOLICITUD DE RENOVACIÓN DE NIE/TIE\n\nEXPTE. Nº: {numero_expediente}\n\nDATOS PERSONALES DEL SOLICITANTE\n──────────────────────────────\nNombre: {nombre}\nPrimer Apellido: {primer_apellido}\nSegundo Apellido: {segundo_apellido}\nFecha de nacimiento: {fecha_nacimiento}\nSexo: {sexo}\nNacionalidad: {nacionalidad}\nNIE actual: {nie_actual}\nFecha de caducidad: {fecha_caducidad}\n\nDOMICILIO EN ESPAÑA\n──────────────────\nTipo de vía: {tipo_via}\nNombre vía: {nombre_via}\nNúmero: {numero}\nPiso: {piso}\nPuerta: {puerta}\nCódigo Postal: {codigo_postal}\nMunicipio: {municipio}\nProvincia: {provincia}\n\nDATOS DE CONTACTO\n────────────────\nTeléfono: {telefono}\nEmail: {email}\n\nTIPO DE RENOVACIÓN SOLICITADA\n───────────────────────────\n☐ Renovación ordinaria (5 años)\n☐ Renovación por arraigo social\n☐ Renovación por cuenta ajena\n☐ Renovación por cuenta propia\n☐ Renovación como estudiante\n☐ Tarjeta de residencia de larga duración\n\nDOCUMENTACIÓN ADJUNTA\n────────────────────\n☐ Pasaporte en vigor\n☐ Certificado de empadronamiento\n☐ Contrato de trabajo / Vida laboral\n☐ Seguro médico\n☐ Modelo 790 (tasa pagada)\n☐ Otros: {otros_documentos}\n\nFECHA Y FIRMA\n────────────\nLugar: {lugar}\nFecha: {fecha_solicitud}\n\n___________________________________\nFirma del solicitante`,
    contentPt: `PEDIDO DE RENOVAÇÃO NIE/TIE\n\nPROCESSO Nº: {numero_processo}\n\nDADOS PESSOAIS DO REQUERENTE\n────────────────────────────\nNome: {nome}\nPrimeiro Sobrenome: {primeiro_sobrenome}\nSegundo Sobrenome: {segundo_sobrenome}\nData de nascimento: {data_nascimento}\nSexo: {sexo}\nNacionalidade: {nacionalidade}\nNIE atual: {nie_atual}\nData de validade: {data_validade}\n\nDOMICÍLIO EM ESPANHA\n───────────────────\nTipo de via: {tipo_via}\nNome via: {nome_via}\nNúmero: {numero}\nAndar: {andar}\nPorta: {porta}\nCódigo Postal: {codigo_postal}\nMunicípio: {municipio}\nProvíncia: {provincia}\n\nDADOS DE CONTACTO\n────────────────\nTelefone: {telefone}\nEmail: {email}\n\nTIPO DE RENOVAÇÃO SOLICITADA\n──────────────────────────\n☐ Renovação ordinária (5 anos)\n☐ Renovação por arraigamento social\n☐ Renovação por conta alheia\n☐ Renovação por conta própria\n☐ Renovação como estudante\n☐ Cartão de residência de longa duração\n\nDOCUMENTAÇÃO ANEXA\n──────────────────\n☐ Passaporte válido\n☐ Certificado de empadronamento\n☐ Contrato de trabalho / Vida laboral\n☐ Seguro médico\n☐ Modelo 790 (taxa paga)\n☐ Outros: {outros_documentos}\n\nDATA E ASSINATURA\n────────────────\nLocal: {local}\nData: {data_pedido}\n\n___________________________________\nAssinatura do requerente`,
    fields: [
      { name: 'numero_expediente', labelEs: 'Nº Expediente', labelPt: 'Nº Processo', placeholderEs: '(si lo tiene)', placeholderPt: '(se tiver)', type: 'text' },
      { name: 'nombre', labelEs: 'Nombre', labelPt: 'Nome', placeholderEs: 'JUAN CARLOS', placeholderPt: 'JUAN CARLOS', type: 'text' },
      { name: 'primer_apellido', labelEs: 'Primer apellido', labelPt: 'Primeiro sobrenome', placeholderEs: 'GARCÍA', placeholderPt: 'GARCIA', type: 'text' },
      { name: 'segundo_apellido', labelEs: 'Segundo apellido', labelPt: 'Segundo sobrenome', placeholderEs: 'LOPEZ', placeholderPt: 'LOPEZ', type: 'text' },
      { name: 'fecha_nacimiento', labelEs: 'Fecha nacimiento', labelPt: 'Data nascimento', placeholderEs: '15/03/1985', placeholderPt: '15/03/1985', type: 'text' },
      { name: 'sexo', labelEs: 'Sexo', labelPt: 'Sexo', placeholderEs: 'Hombre/Mujer', placeholderPt: 'Homem/Mulher', type: 'select', options: [
        { value: 'hombre', labelEs: 'Hombre', labelPt: 'Homem' },
        { value: 'mujer', labelEs: 'Mujer', labelPt: 'Mulher' }
      ]},
      { name: 'nacionalidad', labelEs: 'Nacionalidad', labelPt: 'Nacionalidade', placeholderEs: 'Colombiana', placeholderPt: 'Colombiana', type: 'text' },
      { name: 'nie_actual', labelEs: 'NIE actual', labelPt: 'NIE atual', placeholderEs: 'Y12345678X', placeholderPt: 'Y12345678X', type: 'text' },
      { name: 'fecha_caducidad', labelEs: 'Fecha caducidad', labelPt: 'Data validade', placeholderEs: '31/12/2024', placeholderPt: '31/12/2024', type: 'text' },
      { name: 'tipo_via', labelEs: 'Tipo de vía', labelPt: 'Tipo de via', placeholderEs: 'Calle', placeholderPt: 'Rua', type: 'text' },
      { name: 'nombre_via', labelEs: 'Nombre vía', labelPt: 'Nome via', placeholderEs: 'Mayor', placeholderPt: 'Principal', type: 'text' },
      { name: 'numero', labelEs: 'Número', labelPt: 'Número', placeholderEs: '25', placeholderPt: '25', type: 'text' },
      { name: 'piso', labelEs: 'Piso', labelPt: 'Andar', placeholderEs: '3º', placeholderPt: '3º', type: 'text' },
      { name: 'puerta', labelEs: 'Puerta', labelPt: 'Porta', placeholderEs: 'A', placeholderPt: 'A', type: 'text' },
      { name: 'codigo_postal', labelEs: 'CP', labelPt: 'CP', placeholderEs: '28001', placeholderPt: '28001', type: 'text' },
      { name: 'municipio', labelEs: 'Municipio', labelPt: 'Município', placeholderEs: 'Madrid', placeholderPt: 'Madri', type: 'text' },
      { name: 'provincia', labelEs: 'Provincia', labelPt: 'Província', placeholderEs: 'Madrid', placeholderPt: 'Madri', type: 'text' },
      { name: 'telefono', labelEs: 'Teléfono', labelPt: 'Telefone', placeholderEs: '+34 600 000 000', placeholderPt: '+34 600 000 000', type: 'text' },
      { name: 'email', labelEs: 'Email', labelPt: 'Email', placeholderEs: 'correo@email.com', placeholderPt: 'correo@email.com', type: 'text' },
      { name: 'otros_documentos', labelEs: 'Otros documentos', labelPt: 'Outros documentos', placeholderEs: '', placeholderPt: '', type: 'text' },
      { name: 'lugar', labelEs: 'Lugar', labelPt: 'Local', placeholderEs: 'Madrid', placeholderPt: 'Madri', type: 'text' },
      { name: 'fecha_solicitud', labelEs: 'Fecha solicitud', labelPt: 'Data pedido', placeholderEs: 'DD/MM/YYYY', placeholderPt: 'DD/MM/AAAA', type: 'text' }
    ]
  },
  {
    id: 'carta-ayuntamiento',
    category: 'administrative',
    icon: Building2,
    titleEs: 'Carta al Ayuntamiento',
    titlePt: 'Carta à Câmara Municipal',
    descEs: 'Comunicación oficial con el ayuntamiento',
    descPt: 'Comunicação oficial com a câmara municipal',
    contentEs: `{fecha}\n\nA LA ATENCIÓN DEL\nAYUNTAMIENTO DE {ayuntamiento}\nRegistro General\n\nDATOS DEL REMITENTE\n───────────────────\nNombre: {nombre_completo}\nDNI/NIE: {dni_nie}\nDirección: {direccion}\nCódigo Postal: {codigo_postal}\nCiudad: {ciudad}\nTeléfono: {telefono}\nEmail: {email}\n\nASUNTO: {asunto}\n\nEstimado Sr./Sra.:\n\nPor medio de la presente dirijo a esta Ayuntamiento para {motivo_carta}.\n\n{cuerpo_carta}\n\nPara cualquier aclaración o información adicional, pueden ponerse en contacto conmigo a través de los datos consignados en este escrito.\n\nAgradeciendo de antemano su atención, quedo a la espera de respuesta.\n\nAtentamente,\n\n_________________________________\nFirma\n\n{nombre_completo}\nDNI/NIE: {dni_nie}`,
    contentPt: `{data}\n\nÀ ATENÇÃO DA\nCÂMARA MUNICIPAL DE {camara_municipal}\nRegistro Geral\n\nDADOS DO REMETENTE\n─────────────────\nNome: {nome_completo}\nBI/NIE: {bi_nie}\nEndereço: {endereco}\nCódigo Postal: {codigo_postal}\nCidade: {cidade}\nTelefone: {telefone}\nEmail: {email}\n\nASSUNTO: {assunto}\n\nEstimado Sr./Sra.:\n\nPor meio da presente dirijo-me a esta Câmara Municipal para {motivo_carta}.\n\n{corpo_carta}\n\nPara qualquer esclarecimento ou informação adicional, podem entrar em contacto comigo através dos dados indicados neste escrito.\n\nAgradecendo antecipadamente a vossa atenção, fico à espera de resposta.\n\nAtenciosamente,\n\n_________________________________\nAssinatura\n\n{nome_completo}\nBI/NIE: {bi_nie}`,
    fields: [
      { name: 'ayuntamiento', labelEs: 'Ayuntamiento', labelPt: 'Câmara Municipal', placeholderEs: 'Valencia', placeholderPt: 'Valença', type: 'text' },
      { name: 'nombre_completo', labelEs: 'Nombre completo', labelPt: 'Nome completo', placeholderEs: 'Laura Fernández Díaz', placeholderPt: 'Laura Fernandez Diaz', type: 'text' },
      { name: 'dni_nie', labelEs: 'DNI/NIE', labelPt: 'BI/NIE', placeholderEs: 'Y87654321X', placeholderPt: 'Y87654321X', type: 'text' },
      { name: 'direccion', labelEs: 'Dirección', labelPt: 'Endereço', placeholderEs: 'Calle Nueva, 40', placeholderPt: 'Rua Nova, 40', type: 'text' },
      { name: 'codigo_postal', labelEs: 'Código Postal', labelPt: 'Código Postal', placeholderEs: '46001', placeholderPt: '4600-000', type: 'text' },
      { name: 'ciudad', labelEs: 'Ciudad', labelPt: 'Cidade', placeholderEs: 'Valencia', placeholderPt: 'Valença', type: 'text' },
      { name: 'telefono', labelEs: 'Teléfono', labelPt: 'Telefone', placeholderEs: '+34 655 444 333', placeholderPt: '+34 655 444 333', type: 'text' },
      { name: 'email', labelEs: 'Email', labelPt: 'Email', placeholderEs: 'correo@email.com', placeholderPt: 'correo@email.com', type: 'text' },
      { name: 'asunto', labelEs: 'Asunto', labelPt: 'Assunto', placeholderEs: 'Solicitud de certificado...', placeholderPt: 'Pedido de certificado...', type: 'text' },
      { name: 'motivo_carta', labelEs: 'Motivo de la carta', labelPt: 'Motivo da carta', placeholderEs: 'solicitar el certificado de empadronamiento', placeholderPt: 'solicitar o atestado de morada', type: 'text' },
      { name: 'cuerpo_carta', labelEs: 'Cuerpo de la carta', labelPt: 'Corpo da carta', placeholderEs: 'Explico detalladamente el motivo de mi solicitud...', placeholderPt: 'Explico detalhadamente o motivo do meu pedido...', type: 'textarea' }
    ]
  }
]

// ============== HELPER FUNCTIONS ==============
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2)

const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', month: 'long', year: 'numeric' 
  })
}

// ============== MAIN COMPONENT ==============
export function PDFConverter({ windowId }: WithWindowIdProps) {
  const [language, setLanguage] = useState<'es' | 'pt'>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('pdf-converter-lang') : null
      return (saved === 'es' || saved === 'pt') ? saved : 'es'
    } catch {
      return 'es'
    }
  })
  const [activeTab, setActiveTab] = useState<string>('word-to-pdf')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  
  // Text Editor State
  const [editorContent, setEditorContent] = useState('')
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    fontFamily: 'Arial',
    fontSize: 12,
    alignment: 'left',
    pageSize: 'A4',
    margins: 20,
    showHeader: false,
    showFooter: false,
    headerText: '',
    footerText: ''
  })
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({})
  
  // Split/Compress specific state
  const [pageSelection, setPageSelection] = useState('')
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high' | 'maximum'>('medium')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const t = translations[language]
  const activeTool = conversionTools.find(t => t.id === activeTab) || conversionTools[0]

  // Save language preference
  useEffect(() => {
    try {
      localStorage.setItem('pdf-converter-lang', language)
    } catch (e) {}
  }, [language])

  // ============== TEMPLATE HANDLING (defined early for use in callbacks) ==============
  const applyTemplateFields = useCallback((template: DocumentTemplate, fields: Record<string, string>, lang: 'es' | 'pt'): string => {
    let content = lang === 'es' ? template.contentEs : template.contentPt
    
    Object.entries(fields).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value || `[${key}]`)
    })

    // Replace date placeholders
    content = content.replace(/\{fecha\}/gi, getCurrentDate())
    content = content.replace(/\{data\}/gi, getCurrentDate())

    return content
  }, [])

  // ============== FILE HANDLING ==============
  const processFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      if (file.size <= 50 * 1024 * 1024) { // 50MB limit
        const reader = new FileReader()
        reader.onload = (e) => {
          const newFile: UploadedFile = {
            id: generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            preview: e.target?.result as string,
            order: files.length
          }
          setFiles(prev => [...prev, newFile])
        }
        
        reader.readAsDataURL(file)
      }
    })
  }, [files.length])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const clearAllFiles = useCallback(() => {
    setFiles([])
    setIsComplete(false)
    setShowPreview(false)
  }, [])

  // ============== CONVERSION PROCESSING ==============
  const handleConvert = useCallback(async () => {
    if (activeTab === 'text-to-pdf' && !editorContent.trim()) return
    if (!['text-to-pdf'].includes(activeTab) && files.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setIsComplete(false)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Simulate processing time based on tool
    const processingTime = activeTab === 'pdf-merge' ? 3000 : 
                          activeTab === 'compress-pdf' ? 2500 :
                          activeTab === 'text-to-pdf' ? 2000 : 1500

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setIsProcessing(false)
      setIsComplete(true)
      setShowPreview(true)
    }, processingTime)
  }, [activeTab, files.length, editorContent])

  const handleDownload = useCallback(() => {
    let content = ''
    
    if (activeTab === 'text-to-pdf') {
      content = selectedTemplate 
        ? applyTemplateFields(selectedTemplate, templateFields, language)
        : editorContent
    } else {
      content = `PDF Generated - ${activeTool.labelEs}\n\nFiles converted: ${files.map(f => f.name).join(', ')}\n\nGenerated at: ${new Date().toISOString()}`
    }

    const blob = new Blob([content], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `documento_${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [activeTab, files, editorContent, selectedTemplate, templateFields, language, activeTool, applyTemplateFields])

  // ============== TEMPLATE SELECTION ==============
  const handleSelectTemplate = useCallback((template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setTemplateFields({})
    
    const content = language === 'es' ? template.contentEs : template.contentPt
    setEditorContent(content)
  }, [language])

  const handleTemplateFieldChange = useCallback((fieldName: string, value: string) => {
    setTemplateFields(prev => ({ ...prev, [fieldName]: value }))
    
    if (selectedTemplate) {
      const updatedFields = { ...templateFields, [fieldName]: value }
      const content = applyTemplateFields(selectedTemplate, updatedFields, language)
      setEditorContent(content)
    }
  }, [selectedTemplate, templateFields, language, applyTemplateFields])

  // ============== EDITOR FUNCTIONS ==============
  const insertFormatting = useCallback((format: string) => {
    if (!editorRef.current) return
    
    const start = editorRef.current.selectionStart
    const end = editorRef.current.selectionEnd
    const selectedText = editorContent.substring(start, end)
    
    let formatted = ''
    switch (format) {
      case 'bold':
        formatted = `**${selectedText || 'texto en negrita'}**`
        break
      case 'italic':
        formatted = `*${selectedText || 'texto en cursiva'}*`
        break
      case 'underline':
        formatted = `__${selectedText || 'texto subrayado'}__`
        break
      case 'list':
        formatted = `\n- ${selectedText || 'Elemento de lista'}`
        break
      case 'numbered-list':
        formatted = `\n1. ${selectedText || 'Elemento numerado'}`
        break
      default:
        formatted = selectedText
    }

    const newContent = editorContent.substring(0, start) + formatted + editorContent.substring(end)
    setEditorContent(newContent)
  }, [editorContent])

  // ============== RENDER HELPERS ==============
  const renderFileSizeInfo = () => {
    if (files.length === 0) return null
    const totalSize = files.reduce((acc, f) => acc + f.size, 0)
    return (
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{files.length} {t.files}</span>
        <span>•</span>
        <span>{formatFileSize(totalSize)} total</span>
      </div>
    )
  }

  const renderPreview = () => {
    if (!showPreview || !isComplete) return null

    const previewContent = activeTab === 'text-to-pdf' 
      ? editorContent 
      : `Documento PDF Generado\n\nHerramienta utilizada: ${activeTool.labelEs}\n\nArchivos procesados:\n${files.map(f => `- ${f.name} (${formatFileSize(f.size)})`).join('\n')}\n\nFecha de generación: ${new Date().toLocaleString()}`

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold">{t.preview}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 min-w-[50px] text-center">{zoomLevel}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button variant="ghost" size="sm" onClick={() => setZoomLevel(100)}>
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-100">
            <div 
              className="bg-white shadow-lg mx-auto transition-all"
              style={{ 
                width: editorSettings.pageSize === 'A4' ? '210mm' : editorSettings.pageSize === 'Letter' ? '8.5in' : '8.5in',
                minHeight: editorSettings.pageSize === 'A4' ? '297mm' : editorSettings.pageSize === 'Letter' ? '11in' : '14in',
                padding: `${editorSettings.margins}mm`,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                fontSize: `${editorSettings.fontSize}px`,
                fontFamily: editorSettings.fontFamily,
                textAlign: editorSettings.alignment as any,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6
              }}
            >
              {editorSettings.showHeader && (
                <div className="text-center text-gray-400 text-xs mb-4 border-b pb-2">
                  {editorSettings.headerText}
                </div>
              )}
              
              <div className="whitespace-pre-wrap">
                {previewContent}
              </div>

              {editorSettings.showFooter && (
                <div className="text-center text-gray-400 text-xs mt-4 border-t pt-2">
                  {editorSettings.footerText}
                </div>
              )}
            </div>
          </div>

          {/* Preview Footer */}
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Página 1 de 1</span>
            <div className="flex gap-2">
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                {t.download}
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============== MAIN RENDER ==============
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header - Windows 11 Style */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200">
                <FileDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{t.title}</h1>
                <p className="text-xs text-gray-500">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === 'es' ? 'pt' : 'es')}
                    className="gap-2"
                  >
                    <Languages className="w-4 h-4" />
                    {language.toUpperCase()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.language}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Tool Selection */}
          <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto shrink-0 hidden md:block">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t.tools}
            </h2>
            
            <nav className="space-y-1">
              {conversionTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTab(tool.id)
                    setIsComplete(false)
                    setShowPreview(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    activeTab === tool.id
                      ? 'bg-gradient-to-r ' + tool.color + ' text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <tool.icon className={`w-5 h-5 ${activeTab === tool.id ? 'text-white' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${activeTab === tool.id ? 'text-white' : ''}`}>
                      {language === 'es' ? tool.labelEs : tool.labelPt}
                    </p>
                    <p className={`text-xs truncate ${activeTab === tool.id ? 'text-white/80' : 'text-gray-400'}`}>
                      {language === 'es' ? tool.descEs : tool.descPt}
                    </p>
                  </div>
                </button>
              ))}
            </nav>

            <Separator className="my-4" />

            {/* Immigrant Quick Tools Section */}
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t.immigrantTools}
              </h2>
              
              <div className="space-y-2">
                {documentTemplates.slice(0, 4).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setActiveTab('text-to-pdf')
                      handleSelectTemplate(template)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-left group transition-colors"
                  >
                    <template.icon className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                    <span className="text-xs text-gray-600 group-hover:text-blue-700 truncate">
                      {language === 'es' ? template.titleEs : template.titlePt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Mobile Tool Selector */}
            <div className="md:hidden mb-4">
              <Select value={activeTab} onValueChange={(v) => setActiveTab(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conversionTools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {language === 'es' ? tool.labelEs : tool.labelPt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tool Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeTool.color} flex items-center justify-center shadow-lg`}>
                  <activeTool.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {language === 'es' ? activeTool.labelEs : activeTool.labelPt}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {language === 'es' ? activeTool.descEs : activeTool.descPt}
                  </p>
                </div>
              </div>
            </div>

            {/* TEXT TO PDF - Special Layout with Editor and Templates */}
            {activeTab === 'text-to-pdf' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates Panel */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-purple-500" />
                        {t.templates}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                      {/* Category Filters */}
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(t.templateCategories).map(([key, label]) => (
                          <Badge key={key} variant="outline" className="text-xs cursor-pointer hover:bg-purple-50">
                            {label}
                          </Badge>
                        ))}
                      </div>

                      {documentTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            selectedTemplate?.id === template.id
                              ? 'border-purple-500 bg-purple-50 shadow-sm'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                              <template.icon className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {language === 'es' ? template.titleEs : template.titlePt}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {language === 'es' ? template.descEs : template.descPt}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Template Fields Form */}
                  {selectedTemplate && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <PenTool className="w-5 h-5 text-blue-500" />
                          {t.fillFields}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                        {selectedTemplate.fields.map((field) => (
                          <div key={field.name}>
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                              {language === 'es' ? field.labelEs : field.labelPt}
                            </label>
                            {field.type === 'textarea' ? (
                              <Textarea
                                placeholder={language === 'es' ? field.placeholderEs : field.placeholderPt}
                                value={templateFields[field.name] || ''}
                                onChange={(e) => handleTemplateFieldChange(field.name, e.target.value)}
                                className="text-sm min-h-[60px]"
                              />
                            ) : field.type === 'select' ? (
                              <Select 
                                value={templateFields[field.name] || ''}
                                onValueChange={(v) => handleTemplateFieldChange(field.name, v)}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder={language === 'es' ? field.placeholderEs : field.placeholderPt} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {language === 'es' ? opt.labelEs : opt.labelPt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type={field.type}
                                placeholder={language === 'es' ? field.placeholderEs : field.placeholderPt}
                                value={templateFields[field.name] || ''}
                                onChange={(e) => handleTemplateFieldChange(field.name, e.target.value)}
                                className="text-sm"
                              />
                            )}
                          </div>
                        ))}
                        
                        <Button 
                          className="w-full mt-4" 
                          onClick={() => {
                            if (selectedTemplate) {
                              const content = applyTemplateFields(selectedTemplate, templateFields, language)
                              setEditorContent(content)
                            }
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Actualizar vista previa
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Editor Panel */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Editor Toolbar */}
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Font Family */}
                        <Select 
                          value={editorSettings.fontFamily} 
                          onValueChange={(v) => setEditorSettings(s => ({ ...s, fontFamily: v }))}
                        >
                          <SelectTrigger className="w-32 h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Font Size */}
                        <Select 
                          value={editorSettings.fontSize.toString()} 
                          onValueChange={(v) => setEditorSettings(s => ({ ...s, fontSize: parseInt(v) }))}
                        >
                          <SelectTrigger className="w-16 h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[10, 11, 12, 14, 16, 18, 20, 24].map(size => (
                              <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Separator orientation="vertical" className="h-6" />

                        {/* Formatting Buttons */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => insertFormatting('bold')}>
                              <Bold className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t.bold}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => insertFormatting('italic')}>
                              <Italic className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t.italic}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => insertFormatting('underline')}>
                              <Underline className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t.underline}</TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-6" />

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => insertFormatting('list')}>
                              <List className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t.bulletList}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => insertFormatting('numbered-list')}>
                              <ListOrdered className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t.numberList}</TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-6" />

                        {/* Alignment */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 w-9 p-0"
                              onClick={() => setEditorSettings(s => ({ ...s, alignment: 'left' }))}
                            >
                              <AlignLeft className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Izquierda</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 w-9 p-0"
                              onClick={() => setEditorSettings(s => ({ ...s, alignment: 'center' }))}
                            >
                              <AlignCenter className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Centrado</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 w-9 p-0"
                              onClick={() => setEditorSettings(s => ({ ...s, alignment: 'right' }))}
                            >
                              <AlignRight className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Derecha</TooltipContent>
                        </Tooltip>

                        <div className="flex-1" />

                        {/* Page Size */}
                        <Select 
                          value={editorSettings.pageSize} 
                          onValueChange={(v) => setEditorSettings(s => ({ ...s, pageSize: v as any }))}
                        >
                          <SelectTrigger className="w-24 h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A4">A4</SelectItem>
                            <SelectItem value="Letter">Letter</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Editor Textarea */}
                  <Card className="flex-1">
                    <CardContent className="p-0">
                      <Textarea
                        ref={editorRef}
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        placeholder={
                          selectedTemplate 
                            ? (language === 'es' ? 'Edita el contenido de la plantilla...' : 'Edite o conteúdo do modelo...')
                            : (language === 'es' ? 'Escribe aquí tu documento...' : 'Escreva aqui seu documento...')
                        }
                        className="min-h-[350px] border-0 resize-none focus-visible:ring-0 text-sm leading-relaxed"
                        style={{
                          fontFamily: editorSettings.fontFamily,
                          fontSize: `${editorSettings.fontSize}px`,
                          lineHeight: 1.8
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Advanced Settings */}
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 py-2">
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                      <Settings className="w-4 h-4" />
                      {t.settings}
                    </summary>
                
                    <div className="grid grid-cols-2 gap-4 mt-3 pl-6">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">{t.margins} (mm)</label>
                        <Input
                          type="number"
                          value={editorSettings.margins}
                          onChange={(e) => setEditorSettings(s => ({ ...s, margins: parseInt(e.target.value) || 20 }))}
                          className="h-8 text-sm"
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editorSettings.showHeader}
                            onChange={(e) => setEditorSettings(s => ({ ...s, showHeader: e.target.checked }))}
                            className="rounded"
                          />
                          <span className="text-xs text-gray-600">{t.header}</span>
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editorSettings.showFooter}
                            onChange={(e) => setEditorSettings(s => ({ ...s, showFooter: e.target.checked }))}
                            className="rounded"
                          />
                          <span className="text-xs text-gray-600">{t.footer}</span>
                        </label>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* FILE-BASED TOOLS - Upload Area */}
            {!['text-to-pdf'].includes(activeTab) && (
              <>
                {/* Drag and Drop Zone */}
                <motion.div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  animate={{
                    borderColor: dragActive ? '#f97316' : '#e5e7eb',
                    backgroundColor: dragActive ? '#fff7ed' : '#ffffff',
                    scale: dragActive ? 1.01 : 1
                  }}
                  onClick={() => !isComplete && fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-2xl p-8 cursor-pointer
                    transition-all ${!isComplete ? 'hover:border-orange-300 hover:bg-orange-50/30' : ''}
                    ${isComplete ? 'border-green-300 bg-green-50' : ''}
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={['pdf-merge'].includes(activeTab)}
                    onChange={handleFileInput}
                    className="hidden"
                    accept={activeTool.acceptTypes.join(',')}
                  />

                  <div className="text-center">
                    <motion.div
                      animate={dragActive ? { scale: 1.1, y: -8 } : {}}
                      className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center"
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      ) : (
                        <Upload className="w-10 h-10 text-orange-500" />
                      )}
                    </motion.div>

                    {isComplete ? (
                      <>
                        <h3 className="text-xl font-bold text-green-700 mb-2">{t.complete}</h3>
                        <p className="text-sm text-green-600">
                          {language === 'es' 
                            ? 'Tu documento está listo para descargar' 
                            : 'Seu documento está pronto para baixar'}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{t.dragDrop}</h3>
                        <p className="text-sm text-gray-500 mb-3">{t.orClick}</p>
                        <p className="text-xs text-gray-400">
                          {t.supportedFormats}: {activeTool.acceptTypes.join(', ').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Máx. 50MB por archivo</p>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Tool-Specific Options */}
                {activeTab === 'pdf-split' && (
                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        <Scissors className="w-4 h-4 inline mr-2" />
                        {t.selectPages}
                      </label>
                      <Input
                        value={pageSelection}
                        onChange={(e) => setPageSelection(e.target.value)}
                        placeholder="1-3, 5, 7-10"
                        className="font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {language === 'es' 
                          ? 'Ejemplo: 1-3 extrae páginas 1, 2 y 3'
                          : 'Exemplo: 1-3 extrai páginas 1, 2 e 3'
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'compress-pdf' && (
                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <label className="text-sm font-medium text-gray-700 block mb-3">
                        <Archive className="w-4 h-4 inline mr-2" />
                        {t.compressionLevel}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['low', 'medium', 'high', 'maximum'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setCompressionLevel(level)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              compressionLevel === level
                                ? 'bg-cyan-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {t[level]}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">{t.originalSize}</p>
                          <p className="font-semibold">{files[0] ? formatFileSize(files[0].size) : '- MB'}</p>
                        </div>
                        <div className="p-3 bg-cyan-50 rounded-lg">
                          <p className="text-xs text-cyan-600">{t.estimatedSize}</p>
                          <p className="font-semibold text-cyan-700">
                            {files[0] ? formatFileSize(files[0].size * [1, 0.7, 0.5, 0.3][['low', 'medium', 'high', 'maximum'].indexOf(compressionLevel)]) : '- MB'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* File List */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <FolderOpen className="w-5 h-5 text-gray-500" />
                              {t.fileOrder}
                              <Badge variant="secondary" className="ml-2">{files.length}</Badge>
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={clearAllFiles} className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t.clearAll}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-[250px] overflow-y-auto">
                          {files.map((file) => (
                            <motion.div
                              key={file.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                              
                              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                {file.type.startsWith('image/') ? (
                                  <img src={file.preview} alt="" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <File className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                          
                          {renderFileSizeInfo()}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Processing Indicator */}
            <AnimatePresence mode="wait">
              {isProcessing && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{t.processing}</p>
                          <p className="text-sm text-gray-500">
                            {language === 'es' ? 'Por favor, espera mientras procesamos tus archivos...' : 'Por favor, aguarde enquanto processamos seus arquivos...'}
                          </p>
                          <Progress value={progress} className="mt-3 h-2" />
                          <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Footer / Action Bar */}
        <footer className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {renderFileSizeInfo()}
            </div>
            
            <div className="flex items-center gap-3">
              {isComplete ? (
                <>
                  <Button variant="outline" onClick={() => { setIsComplete(false); setShowPreview(false); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addMore}
                  </Button>
                  <Button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Download className="w-4 h-4 mr-2" />
                    {t.download}
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreview(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {t.preview}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConvert}
                  disabled={
                    (['text-to-pdf'].includes(activeTab) && !editorContent.trim()) ||
                    (!['text-to-pdf'].includes(activeTab) && files.length === 0)
                  }
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.converting}
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      {t.convert}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </footer>

        {/* Preview Modal */}
        <AnimatePresence>
          {renderPreview()}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}

export default PDFConverter
