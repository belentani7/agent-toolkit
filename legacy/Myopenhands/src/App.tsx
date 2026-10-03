import React, { useState, useEffect } from 'react';
import {
  NodeId,
  Language,
  UserProgress,
  CVData,
  AppointmentItem,
  DELEScore,
  MainSection
} from './types';
import { NODES_LIST } from './data/nodesMetadata';
import { TRANSLATIONS } from './data/i18n';
import { Navbar } from './components/Navbar';
import { SectionInicio } from './components/SectionInicio';
import { SectionAprender } from './components/SectionAprender';
import { SectionCarrera } from './components/SectionCarrera';
import { SectionHerramientas } from './components/SectionHerramientas';
import { SectionAyuda } from './components/SectionAyuda';
import { NodeAI } from './components/NodeAI';
import { NodeOffice } from './components/NodeOffice';
import { NodeCVBuilder } from './components/NodeCVBuilder';
import { A4PrintModal } from './components/A4PrintModal';
import { NodeResources } from './components/NodeResources';
import { NodeLegal } from './components/NodeLegal';
import { NodeDELE } from './components/NodeDELE';
import { NodeAppointments } from './components/NodeAppointments';
import { NodeCompanion } from './components/NodeCompanion';
import { NodeAcademy } from './components/NodeAcademy';
import { NodeFinance } from './components/NodeFinance';
import { NodeJobs } from './components/NodeJobs';
import { NodeHealth } from './components/NodeHealth';
import { NodeHousing } from './components/NodeHousing';
import { NodeCommunity } from './components/NodeCommunity';
import { NodePassport } from './components/NodePassport';
import { CognitiveAccessibilityBar } from './components/CognitiveAccessibilityBar';
import { SystemHealthModal } from './components/SystemHealthModal';
import { SafeStorage } from './utils/selfFixProtocol';

import {
  Sparkles,
  Award,
  Phone,
  Shield,
  Heart,
  Globe,
  ExternalLink,
  ChevronRight,
  Home,
  BookOpen,
  Briefcase,
  Compass,
  FileText,
  HelpCircle,
  Layers
} from 'lucide-react';

const INITIAL_PROGRESS: UserProgress = {
  completedLessons: ['l1', 'les-alfa-101'],
  totalXP: 80,
  badges: ['b-ai-starter', 'b-alfa-init'],
  currentLevel: 1,
  deleScores: [],
};

const INITIAL_CV: CVData = {
  fullName: 'María Elena González',
  jobTitle: 'Administrativa / Dependienta de Comercio',
  email: 'maria.gonzalez@correo.es',
  phone: '+34 612 345 678',
  location: 'Madrid, España',
  permitStatus: 'Permiso de trabajo y residencia en vigor (NIE)',
  summary:
    'Profesional proactiva con más de 4 años de experiencia en atención al cliente, gestión de inventarios y redacción administrativa. Gran capacidad de adaptación, dominio de Microsoft 365 y motivación constante.',
  experience: [
    {
      id: '1',
      company: 'Comercial del Sur S.L.',
      role: 'Dependienta y Caja',
      startDate: '2023',
      endDate: '2024',
      current: false,
      description:
        'Atención al cliente, cobro en TPV, arqueo de caja diario y reposición organizada en tienda.',
    },
    {
      id: '2',
      company: 'Logística Express',
      role: 'Auxiliar Administrativa',
      startDate: '2022',
      endDate: '2023',
      current: false,
      description:
        'Registro de albaranes en hojas de cálculo Excel, resolución de incidencias y gestión de llamadas.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Centro de Formación Ocupacional',
      degree: 'Certificado de Profesionalidad: Actividades de Venta',
      year: '2023',
      homologated: true,
    },
  ],
  skills: [
    'Atención al Cliente',
    'Microsoft Excel & Word',
    'Resolución de Incidencias',
    'Trabajo en Equipo',
    'Puntualidad y Organización',
  ],
  template: 'classic',
};

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt-1',
    title: 'Toma de Huellas (Expedición de TIE)',
    date: '2025-06-10',
    time: '11:15',
    location: 'Comisaría de Policía de Extranjería (Calle Padre Piquer 18, Madrid)',
    notes: 'Llevar tasa 790 código 012 pagada en banco físico y foto tamaño carnet reciente.',
    requiredDocs: [
      'Pasaporte original en vigor y fotocopia completa',
      'Justificante de cita impreso',
      'Modelo 790-012 abonado (tasa de tarjeta)',
      'Certificado de empadronamiento reciente',
      'Foto tamaño carné color fondo blanco',
    ],
    completedDocs: [0, 1],
  },
];

export default function App() {
  // Navigation: 6 Architectural Pillars + 15 Specific Nodes
  const [currentSection, setCurrentSection] = useState<MainSection>(() => {
    return (localStorage.getItem('ma_section') as MainSection) || 'inicio';
  });

  const [currentNode, setCurrentNode] = useState<NodeId>(() => {
    return (localStorage.getItem('ma_node') as NodeId) || 'ai-curriculum';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('ma_lang') as Language) || 'es';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ma_theme') === 'dark';
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    return SafeStorage.getJSON('ma_progress', INITIAL_PROGRESS).data;
  });

  const [cvData, setCvData] = useState<CVData>(() => {
    return SafeStorage.getJSON('ma_cv', INITIAL_CV).data;
  });

  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    return SafeStorage.getJSON('ma_apts', INITIAL_APPOINTMENTS).data;
  });

  const [savedResources, setSavedResources] = useState<string[]>(() => {
    return SafeStorage.getJSON('ma_saved_res', ['res-1', 'res-2']).data;
  });

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Cognitive Ergonomics & Focus States
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('ma_font_scale') as 'normal' | 'large' | 'xlarge') || 'normal';
  });

  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    return localStorage.getItem('ma_focus_mode') === 'true';
  });

  const [isHighLegibility, setIsHighLegibility] = useState<boolean>(() => {
    return localStorage.getItem('ma_high_legibility') === 'true';
  });

  // Sync Theme with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ma_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ma_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist states
  useEffect(() => {
    localStorage.setItem('ma_section', currentSection);
  }, [currentSection]);

  useEffect(() => {
    localStorage.setItem('ma_node', currentNode);
  }, [currentNode]);

  useEffect(() => {
    localStorage.setItem('ma_lang', language);
    const rtlLanguages = ['ar', 'ur', 'fa', 'he'];
    if (rtlLanguages.includes(language)) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ma_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('ma_cv', JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem('ma_apts', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('ma_saved_res', JSON.stringify(savedResources));
  }, [savedResources]);

  useEffect(() => {
    localStorage.setItem('ma_font_scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('ma_focus_mode', String(isFocusMode));
  }, [isFocusMode]);

  useEffect(() => {
    localStorage.setItem('ma_high_legibility', String(isHighLegibility));
  }, [isHighLegibility]);

  // Progress Handlers
  const handleCompleteLesson = (lessonId: string, xpEarned: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalXP: prev.totalXP + xpEarned,
      };
    });
  };

  const handleRecordScore = (score: DELEScore) => {
    setProgress((prev) => ({
      ...prev,
      totalXP: prev.totalXP + 60,
      deleScores: [score, ...prev.deleScores],
    }));
  };

  // Appointment Handlers
  const handleAddAppointment = (newApt: AppointmentItem) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleRemoveAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleDocChecked = (appointmentId: string, docIndex: number) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;
        const exists = a.completedDocs.includes(docIndex);
        return {
          ...a,
          completedDocs: exists
            ? a.completedDocs.filter((i) => i !== docIndex)
            : [...a.completedDocs, docIndex],
        };
      })
    );
  };

  // Saved Resources
  const handleToggleSaveResource = (id: string) => {
    setSavedResources((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Full Data Export as JSON
  const handleExportData = () => {
    const fullBackup = {
      version: '2.5',
      exportDate: new Date().toISOString(),
      progress,
      cvData,
      appointments,
      savedResources,
      language,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Copia_Seguridad_Manos_Abiertas_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
  };

  // Full Data Import from JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.progress) setProgress(parsed.progress);
        if (parsed.cvData) setCvData(parsed.cvData);
        if (parsed.appointments) setAppointments(parsed.appointments);
        if (parsed.savedResources) setSavedResources(parsed.savedResources);
        if (parsed.language) setLanguage(parsed.language);
        alert('¡Copia de seguridad restaurada con éxito!');
      } catch (err) {
        alert('El archivo JSON no es válido o está dañado.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAllData = () => {
    setProgress(INITIAL_PROGRESS);
    setCvData(INITIAL_CV);
    setAppointments(INITIAL_APPOINTMENTS);
    setSavedResources([]);
    alert('Datos restablecidos a valores por defecto.');
  };

  const t = TRANSLATIONS[language];
  const currentNodeMeta = NODES_LIST.find((n) => n.id === currentNode) || NODES_LIST[0];

  const handleSelectNode = (nodeId: NodeId) => {
    setCurrentNode(nodeId);
    setCurrentSection('nodos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSection = (section: MainSection) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdf2e9] dark:bg-[#0c1015] text-slate-800 dark:text-slate-100 font-sans transition-colors flex flex-col relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Frosted Glass Ambient Gradient Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[450px] sm:w-[550px] h-[450px] sm:h-[550px] bg-orange-400/35 dark:bg-orange-600/20 rounded-full blur-[110px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-teal-400/30 dark:bg-teal-600/15 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="fixed top-[35%] right-[5%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-amber-300/25 dark:bg-amber-600/12 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed top-[65%] left-[5%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-indigo-300/20 dark:bg-indigo-600/12 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <Navbar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        currentNode={currentNode}
        onSelectNode={handleSelectNode}
        language={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        xp={progress.totalXP}
        onOpenVoiceCompanion={() => handleSelectNode('voice-companion')}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onOpenHealthCheck={() => setIsHealthModalOpen(true)}
      />

      {/* Cognitive Ergonomics & Neuro-Care Toolbar */}
      <CognitiveAccessibilityBar
        language={language}
        nodeTitle={
          currentSection === 'inicio'
            ? 'Bienvenida & Orientación'
            : currentSection === 'aprender'
            ? 'Centro de Aprendizaje & Cursos'
            : currentSection === 'carrera'
            ? 'Carreras & Empleabilidad'
            : currentSection === 'recursos'
            ? 'Directorio de Recursos & ONGs'
            : currentSection === 'herramientas'
            ? 'Herramientas de Autonomía'
            : currentSection === 'ayuda'
            ? 'Centro de Ayuda & Derechos'
            : `Nodo ${currentNodeMeta.number}: ${currentNodeMeta.title[language]}`
        }
        nodeDescription={
          currentSection === 'inicio'
            ? 'Plataforma comunitaria de inclusión social y digital en España.'
            : currentSection === 'aprender'
            ? 'Formación interactiva por niveles con validación práctica y recompensas XP.'
            : currentSection === 'carrera'
            ? 'Itinerarios formativos, sueldos orientativos y validación Acredita.'
            : currentSection === 'recursos'
            ? 'Buscador verificado de asistencia social, jurídica y humanitaria.'
            : currentSection === 'herramientas'
            ? 'Creadores de CV, gestor de citas y simuladores sin registro.'
            : currentSection === 'ayuda'
            ? 'Respuestas legales, preguntas frecuentes y teléfonos gratuitos 24h.'
            : currentNodeMeta.subtitle[language]
        }
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        isHighLegibility={isHighLegibility}
        onToggleHighLegibility={() => setIsHighLegibility(!isHighLegibility)}
      />

      {/* Breadcrumbs & Quick Sub-Nav */}
      <div className={`bg-white/40 dark:bg-stone-900/40 backdrop-blur-md border-b border-white/50 dark:border-white/10 py-2.5 relative z-10 transition-opacity ${
        isFocusMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <button
              onClick={() => handleSelectSection('inicio')}
              className="hover:text-orange-600 flex items-center gap-1 font-medium transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
              {currentSection === 'inicio' && 'Bienvenida'}
              {currentSection === 'aprender' && 'Aprender & Cursos'}
              {currentSection === 'carrera' && 'Carrera & Empleabilidad'}
              {currentSection === 'recursos' && 'Directorio de Recursos'}
              {currentSection === 'herramientas' && 'Herramientas Prácticas'}
              {currentSection === 'ayuda' && 'Centro de Ayuda & FAQ'}
              {currentSection === 'nodos' && `Nodo ${currentNodeMeta.number}: ${currentNodeMeta.title[language]}`}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Privacidad garantizada (Local)</span>
            <span>·</span>
            <span>Acceso 100% gratuito</span>
          </div>
        </div>
      </div>

      {/* Main Container with Cognitive Ergonomics */}
      <main
        className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 transition-all duration-300 ${
          fontScale === 'large'
            ? 'text-[1.08rem]'
            : fontScale === 'xlarge'
            ? 'text-[1.18rem]'
            : ''
        } ${isHighLegibility ? 'tracking-wide leading-relaxed' : ''} ${
          isFocusMode
            ? 'glass-card my-4 rounded-3xl ring-4 ring-orange-500/25 shadow-2xl p-4 sm:p-8 backdrop-blur-2xl'
            : ''
        }`}
      >
        {/* Section 1: Inicio */}
        {currentSection === 'inicio' && (
          <SectionInicio
            language={language}
            onNavigateSection={handleSelectSection}
            onSelectNode={handleSelectNode}
          />
        )}

        {/* Section 2: Aprender */}
        {currentSection === 'aprender' && (
          <SectionAprender
            language={language}
            progress={progress}
            onCompleteLesson={handleCompleteLesson}
            onSelectNode={handleSelectNode}
          />
        )}

        {/* Section 3: Carrera */}
        {currentSection === 'carrera' && (
          <SectionCarrera
            language={language}
            onSelectNode={handleSelectNode}
          />
        )}

        {/* Section 4: Recursos */}
        {currentSection === 'recursos' && (
          <NodeResources
            language={language}
            savedResources={savedResources}
            onToggleSaveResource={handleToggleSaveResource}
          />
        )}

        {/* Section 5: Herramientas */}
        {currentSection === 'herramientas' && (
          <SectionHerramientas
            language={language}
            onSelectNode={handleSelectNode}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
          />
        )}

        {/* Section 6: Ayuda */}
        {currentSection === 'ayuda' && (
          <SectionAyuda
            language={language}
            onSelectNode={handleSelectNode}
            onOpenHealthCheck={() => setIsHealthModalOpen(true)}
          />
        )}

        {/* Section 7: 15 Nodos Especializados */}
        {currentSection === 'nodos' && (
          <>
            {currentNode === 'ai-curriculum' && (
              <NodeAI
                language={language}
                completedLessons={progress.completedLessons}
                onCompleteLesson={handleCompleteLesson}
              />
            )}

            {currentNode === 'office-productivity' && <NodeOffice language={language} />}

            {(currentNode === 'cv-ats' || currentNode === 'cv-builder') && (
              <NodeCVBuilder
                language={language}
                cvData={cvData}
                onChangeCVData={setCvData}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
              />
            )}

            {currentNode === 'resources-directory' && (
              <NodeResources
                language={language}
                savedResources={savedResources}
                onToggleSaveResource={handleToggleSaveResource}
              />
            )}

            {currentNode === 'legal-rights' && <NodeLegal language={language} />}

            {(currentNode === 'dele-ccse' || currentNode === 'dele-exam') && (
              <NodeDELE language={language} onRecordScore={handleRecordScore} />
            )}

            {(currentNode === 'appointments-manager' || currentNode === 'appointments-citas') && (
              <NodeAppointments
                language={language}
                appointments={appointments}
                onAddAppointment={handleAddAppointment}
                onRemoveAppointment={handleRemoveAppointment}
                onToggleDocChecked={handleToggleDocChecked}
              />
            )}

            {(currentNode === 'voice-companion' || currentNode === 'companion-manos') && (
              <NodeCompanion language={language} />
            )}

            {currentNode === 'open-academy' && <NodeAcademy language={language} />}

            {(currentNode === 'finance-banking' || currentNode === 'financial-inclusion') && (
              <NodeFinance language={language} />
            )}

            {(currentNode === 'jobs-acredita' || currentNode === 'jobs-skills') && (
              <NodeJobs language={language} />
            )}

            {(currentNode === 'health-sanidad' || currentNode === 'health-wellness') && (
              <NodeHealth language={language} />
            )}

            {currentNode === 'housing-rights' && <NodeHousing language={language} />}

            {currentNode === 'community-network' && <NodeCommunity language={language} />}

            {currentNode === 'skills-passport' && (
              <NodePassport
                language={language}
                progress={progress}
                cvData={cvData}
                appointments={appointments}
                savedResources={savedResources}
                onExportData={handleExportData}
                onImportData={handleImportData}
                onResetAllData={handleResetAllData}
                onOpenHealthCheck={() => setIsHealthModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* A4 Print Modal */}
      <A4PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        cvData={cvData}
      />

      {/* System Health & Self-Fix Protocol Modal */}
      <SystemHealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        onDataRepaired={() => {
          setProgress(SafeStorage.getJSON('ma_progress', INITIAL_PROGRESS).data);
          setCvData(SafeStorage.getJSON('ma_cv', INITIAL_CV).data);
          setAppointments(SafeStorage.getJSON('ma_apts', INITIAL_APPOINTMENTS).data);
          setSavedResources(SafeStorage.getJSON('ma_saved_res', ['res-1', 'res-2']).data);
        }}
      />

      {/* Comprehensive Footer */}
      <footer className="bg-white/40 dark:bg-stone-900/60 backdrop-blur-xl border-t border-white/50 dark:border-white/10 transition-colors mt-12 relative z-10">
        {/* Emergency Assistance Bar */}
        <div className="bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-200 py-3 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold text-white">Teléfonos Gratuitos de Asistencia Inmediata en España:</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono font-bold">
              <a href="tel:024" className="hover:text-orange-400 transition-colors">
                024 (Salud Mental)
              </a>
              <span>·</span>
              <a href="tel:112" className="hover:text-orange-400 transition-colors">
                112 (Emergencias)
              </a>
              <span>·</span>
              <a href="tel:016" className="hover:text-orange-400 transition-colors">
                016 (Violencia Machista)
              </a>
              <span>·</span>
              <a href="tel:900221122" className="hover:text-orange-400 transition-colors">
                900 22 11 22 (Cruz Roja)
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-slate-100 font-heading">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/20">
                  MA
                </div>
                <span>Manos Abiertas</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Plataforma integral, gratuita y abierta para la inclusión social, lingüística y digital de la comunidad migrante y personas en proceso de arraigo o protección en España.
              </p>
              <p className="text-[11px] text-slate-400">
                Licencia Apache 2.0 · Open Source & Solidaridad
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Pilares de la Plataforma
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => handleSelectSection('inicio')} className="hover:text-orange-600 transition-colors">
                    Inicio & Orientación
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectSection('aprender')} className="hover:text-orange-600 transition-colors">
                    Aprender (Cursos por Niveles)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectSection('carrera')} className="hover:text-orange-600 transition-colors">
                    Carrera (Rutas & Salarios)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectSection('recursos')} className="hover:text-orange-600 transition-colors">
                    Recursos (Directorio ONGs)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectSection('herramientas')} className="hover:text-orange-600 transition-colors">
                    Herramientas (CV ATS & Citas)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectSection('ayuda')} className="hover:text-orange-600 transition-colors">
                    Ayuda (FAQ & Emergencias)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                15 Nodos Especializados
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => handleSelectNode('ai-curriculum')} className="hover:text-orange-600 transition-colors">
                    N1: Currículo de Inteligencia Artificial (26 Niveles)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectNode('cv-ats')} className="hover:text-orange-600 transition-colors">
                    N3: Generador de CV ATS & Impresión A4
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectNode('legal-rights')} className="hover:text-orange-600 transition-colors">
                    N5: Legislación, Padrón & Arraigos
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectNode('dele-ccse')} className="hover:text-orange-600 transition-colors">
                    N6: Simulador DELE & CCSE (Diploma)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectNode('appointments-manager')} className="hover:text-orange-600 transition-colors">
                    N7: Gestor de Citas & .ICS
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Soberanía & Respaldo
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => handleSelectNode('jobs-acredita')} className="hover:text-orange-600 transition-colors">
                    N11: Procedimiento Acredita & Empleo
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectNode('health-sanidad')} className="hover:text-orange-600 transition-colors">
                    N12: Sanidad Universal & Bienestar
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectNode('housing-rights')} className="hover:text-orange-600 transition-colors">
                    N13: Vivienda & Derechos del Inquilino
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectNode('skills-passport')} className="hover:text-orange-600 transition-colors">
                    N15: Pasaporte Digital & Respaldo JSON
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsHealthModalOpen(true)} className="hover:text-emerald-600 font-bold transition-colors flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Autodiagnóstico & Self-Fix</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/40 dark:border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© 2026 Manos Abiertas · Desarrollado con vocación comunitaria</p>
            <p>Datos 100% locales en tu navegador · Sin anuncios ni rastreo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
