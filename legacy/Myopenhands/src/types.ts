export type Language =
  | 'es' | 'en' | 'pt' | 'ca' | 'ar'
  | 'fr' | 'de' | 'it' | 'ru' | 'zh'
  | 'ja' | 'ko' | 'hi' | 'bn' | 'ur'
  | 'fa' | 'tr' | 'nl' | 'pl' | 'uk'
  | 'ro' | 'el' | 'cs' | 'sv' | 'da'
  | 'fi' | 'no' | 'hu' | 'bg' | 'sk'
  | 'sl' | 'lt' | 'lv' | 'et' | 'he'
  | 'th' | 'vi' | 'id' | 'sw';

export type MainSection =
  | 'inicio'
  | 'aprender'
  | 'carrera'
  | 'recursos'
  | 'herramientas'
  | 'ayuda'
  | 'nodos';

export type NodeId =
  | 'ai-curriculum'
  | 'office-productivity'
  | 'cv-ats'
  | 'cv-builder'
  | 'resources-directory'
  | 'legal-rights'
  | 'dele-ccse'
  | 'dele-exam'
  | 'appointments-manager'
  | 'appointments-citas'
  | 'voice-companion'
  | 'companion-manos'
  | 'open-academy'
  | 'finance-banking'
  | 'financial-inclusion'
  | 'jobs-acredita'
  | 'jobs-skills'
  | 'health-sanidad'
  | 'health-wellness'
  | 'housing-rights'
  | 'community-network'
  | 'skills-passport';

export type EducationLevel = 'inicial' | 'basico' | 'intermedio' | 'avanzado';

export type EducationAreaId =
  | 'alfabetizacion-digital'
  | 'informatica'
  | 'ia'
  | 'ciberseguridad'
  | 'web'
  | 'ux'
  | 'herramientas'
  | 'empleabilidad';

export interface EducationLesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  level: EducationLevel;
  durationMinutes: number;
  xp: number;
  keyTakeaways: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'doc' | 'video' | 'official' | 'exercise';
  }>;
  exercise: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface EducationModule {
  id: string;
  title: string;
  description: string;
  lessons: EducationLesson[];
}

export interface EducationCourse {
  id: string;
  areaId: EducationAreaId;
  title: string;
  description: string;
  level: EducationLevel;
  icon: string;
  badge: string;
  modules: EducationModule[];
}

export interface EducationArea {
  id: EducationAreaId;
  title: string;
  description: string;
  icon: string;
  coursesCount: number;
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  targetRoles: string[];
  avgSalarySpain: string;
  demandLevel: 'Alta' | 'Muy Alta' | 'En Crecimiento';
  icon: string;
  color: string;
  milestones: Array<{
    phase: string;
    title: string;
    topics: string[];
    certifications: string[];
  }>;
  prerequisites: string[];
  keySkills: string[];
  acreditaLink?: string;
}

export interface HelpFAQItem {
  id: string;
  category: 'documentacion' | 'salud' | 'empleo' | 'vivienda' | 'banca' | 'plataforma';
  question: string;
  answer: string;
  legalNote?: string;
  relatedNode?: NodeId;
}

export interface EmergencyContact {
  name: string;
  number: string;
  hours: string;
  free: boolean;
  description: string;
  badge: string;
}

export interface NodeMetadata {
  id: NodeId;
  number: number;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  icon: string;
  category: 'education' | 'tools' | 'legal' | 'integration' | 'future';
  badge?: string;
}

export interface UserProgress {
  totalXP: number;
  xp?: number;
  completedLessons: string[];
  completedQuizzes?: string[];
  currentLevel?: number;
  deleScores: DELEScore[];
  badges: string[];
  cvData?: CVData;
  savedResources?: string[];
  appointments?: AppointmentItem[];
}

export interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  nationality?: string;
  permitStatus: string;
  nieStatus?: string;
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
    homologated: boolean;
  }>;
  skills: string[];
  languages?: Array<{
    language: string;
    level: string;
  }>;
  template: 'classic' | 'modern' | 'tech' | 'executive';
}

export interface AppointmentItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  requiredDocs: string[];
  completedDocs: number[];
}

export interface DELEScore {
  date: string;
  totalPercent: number;
  apto: boolean;
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
  level: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  content?: string;
  timestamp: string;
}

export interface AILesson {
  id: string;
  moduleId: string;
  moduleName: string;
  level: number;
  title: string;
  description: string;
  promptExample: string;
  keyConcepts: string[];
  practicalExercise: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  xp: number;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'official' | 'ong' | 'legal' | 'health' | 'housing' | 'finance' | 'employment' | 'education';
  description: string;
  url: string;
  phone?: string;
  location: string;
  freeService: boolean;
  languages: string[];
  tags: string[];
}

export interface LegalArticle {
  id: string;
  title: string;
  category: 'arraigo' | 'asilo' | 'nacionalidad' | 'laboral' | 'padron' | 'homologacion' | 'sanidad';
  summary: string;
  legalBasis: string;
  requirements: string[];
  stepByStep: string[];
  keyAdvice: string;
  updatedDate: string;
}

export interface DELEQuestion {
  id: string;
  block: 'reading' | 'listening' | 'writing' | 'speaking' | 'ccse';
  question: string;
  contextText?: string;
  audioPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademicCourse {
  id: string;
  title: string;
  institution: string;
  platform: string;
  category: 'cs' | 'ai' | 'business' | 'languages' | 'employment';
  description: string;
  duration: string;
  language: string;
  freeCertification: boolean;
  scholarshipInfo: string;
  url: string;
  skills: string[];
}

export interface CommunityAssociation {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  services: string[];
  phone?: string;
  email?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  type: string;
  cost: string;
  description: string;
}
