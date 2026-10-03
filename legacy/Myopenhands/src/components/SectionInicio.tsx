import React from 'react';
import { MainSection, NodeId, Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  BookOpen,
  Compass,
  FileText,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  Heart,
  Globe2,
  Lock,
  Smartphone,
  Award,
  Calendar,
  Layers
} from 'lucide-react';

interface SectionInicioProps {
  language: Language;
  onNavigateSection: (section: MainSection) => void;
  onSelectNode: (nodeId: NodeId) => void;
}

export const SectionInicio: React.FC<SectionInicioProps> = ({
  language,
  onNavigateSection,
  onSelectNode,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-12">
      {/* Hero Welcome Presentation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white p-8 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase border border-white/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plataforma Social de Inclusión & Formación Digital</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
            Manos Abiertas
          </h1>

          <p className="text-base sm:text-xl text-white/90 leading-relaxed font-normal">
            El ecosistema gratuito, libre y sin registro diseñado para acompañar a personas migrantes, en proceso de arraigo, búsqueda de empleo o formación continua en España.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateSection('aprender')}
              className="px-6 py-3.5 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm shadow-lg shadow-black/10 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Empezar a Aprender</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateSection('herramientas')}
              className="px-6 py-3.5 rounded-2xl bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-bold text-sm border border-white/30 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Crear CV & Herramientas</span>
            </button>
          </div>

          {/* Core Guarantees Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/20 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>100% Gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white shrink-0" />
              <span>Privacidad Local</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-white shrink-0" />
              <span>39 Idiomas & Voz</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-white shrink-0" />
              <span>Offline PWA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: ¿Qué es, Para quién es y Cómo empezar? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: ¿Qué es? */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            ¿Qué es Manos Abiertas?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Una plataforma digital integral de acceso libre que reúne cursos formativos oficiales (IA, ofimática, desarrollo web), orientación laboral, generador de CV compatible con ATS, guía jurídica y directorio de servicios sociales en España.
          </p>
        </div>

        {/* Card 2: ¿Para quién es? */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            ¿Para quién es?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Para cualquier persona que necesite orientación clara y digna: personas recién llegadas a España, solicitantes de asilo, personas en procesos de arraigo social o laboral, o quienes buscan reciclar sus competencias digitales.
          </p>
        </div>

        {/* Card 3: ¿Cómo empezar? */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            ¿Cómo empezar?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            No necesitas registrarte ni pagar nada. Puedes cambiar el idioma arriba en cualquier momento, activar el modo de lectura fácil, rellenar tu currículum o seguir los niveles educativos a tu propio ritmo.
          </p>
        </div>
      </div>

      {/* Section 2: Las 6 Áreas Principales de la Plataforma */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-heading">
            Áreas de la Plataforma
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explora los 6 módulos principales diseñados para darte autonomía formativa y social.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Aprender */}
          <div
            onClick={() => onNavigateSection('aprender')}
            className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border hover:border-orange-500/40 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>1. Aprender & Cursos</span>
                <ArrowRight className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Currículo interactivo en 4 niveles: alfabetización digital, ofimática Microsoft 365, 26 niveles de IA, desarrollo web y ciberseguridad.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-bold text-orange-600 dark:text-orange-400">
              6 Áreas Formativas · Progresión XP
            </div>
          </div>

          {/* 2. Carrera */}
          <div
            onClick={() => onNavigateSection('carrera')}
            className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border hover:border-amber-500/40 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>2. Carrera & Empleabilidad</span>
                <ArrowRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rutas profesionales completas (Ciberseguridad, IA, Web, Administración), procedimiento Acredita para validar tu experiencia y simulador de entrevistas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              4 Carreras · Salarios en España
            </div>
          </div>

          {/* 3. Recursos */}
          <div
            onClick={() => onNavigateSection('recursos')}
            className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border hover:border-emerald-500/40 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>3. Directorio de Recursos</span>
                <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Biblioteca filtrable y verificada: Cruz Roja, Cáritas, CEAR, asistencia jurídica, comedores, salud mental, vivienda y teléfonos de apoyo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Buscador en Tiempo Real · Filtros
            </div>
          </div>

          {/* 4. Herramientas */}
          <div
            onClick={() => onNavigateSection('herramientas')}
            className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border hover:border-sky-500/40 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>4. Herramientas Prácticas</span>
                <ArrowRight className="w-4 h-4 text-sky-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Creador de CV ATS con 4 plantillas e impresión A4, gestor de citas con exportación a .ics, simulador DELE/CCSE y tutor de voz 'Manos'.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-bold text-sky-600 dark:text-sky-400">
              Exportación A4 · Calendario .ICS
            </div>
          </div>

          {/* 5. Ayuda & Emergencias */}
          <div
            onClick={() => onNavigateSection('ayuda')}
            className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border hover:border-rose-500/40 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>5. Centro de Ayuda & FAQ</span>
                <ArrowRight className="w-4 h-4 text-rose-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Respuestas legales sobre padrón sin domicilio, sanidad universal, cuenta básica sin comisiones y líneas telefónicas oficiales gratuitas 24 horas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-bold text-rose-600 dark:text-rose-400">
              Teléfonos 24h · Normativa BOE
            </div>
          </div>

          {/* 6. Pasaporte de Competencias & Nodos */}
          <div
            onClick={() => onSelectNode('skills-passport')}
            className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border hover:border-violet-500/40 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>6. Pasaporte Digital & Respaldo</span>
                <ArrowRight className="w-4 h-4 text-violet-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Revisa tus puntos de experiencia (XP), insignias desbloqueadas, exporta una copia de seguridad segura de tus datos o restáurala en otro equipo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-bold text-violet-600 dark:text-violet-400">
              Copia JSON Segura · 15 Nodos
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to Specific Functional Nodes */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm space-y-4 border border-white/60 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Acceso Directo a los 15 Nodos Especializados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Puedes entrar directamente al módulo que necesites hoy:
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('nodos')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0"
          >
            <span>Ver Catálogo Completo de Nodos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2">
          <button
            onClick={() => onSelectNode('ai-curriculum')}
            className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all text-left group"
          >
            <span className="text-[10px] font-bold text-orange-600 block">N1</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 line-clamp-1">
              Currículo de IA
            </span>
          </button>

          <button
            onClick={() => onSelectNode('cv-builder')}
            className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all text-left group"
          >
            <span className="text-[10px] font-bold text-orange-600 block">N3</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 line-clamp-1">
              Creador CV ATS
            </span>
          </button>

          <button
            onClick={() => onSelectNode('legal-rights')}
            className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all text-left group"
          >
            <span className="text-[10px] font-bold text-orange-600 block">N5</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 line-clamp-1">
              Leyes & Arraigos
            </span>
          </button>

          <button
            onClick={() => onSelectNode('dele-exam')}
            className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all text-left group"
          >
            <span className="text-[10px] font-bold text-orange-600 block">N6</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 line-clamp-1">
              Examen DELE CCSE
            </span>
          </button>

          <button
            onClick={() => onSelectNode('appointments-citas')}
            className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent transition-all text-left group"
          >
            <span className="text-[10px] font-bold text-orange-600 block">N7</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 line-clamp-1">
              Citas & Trámites
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
