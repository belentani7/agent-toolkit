import React, { useState } from 'react';
import { AcademicCourse, Language } from '../types';
import { ACADEMIC_COURSES } from '../data/academicData';
import { TRANSLATIONS } from '../data/i18n';
import {
  GraduationCap,
  ExternalLink,
  Search,
  BookOpen,
  Award,
  Globe,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface NodeAcademyProps {
  language: Language;
}

export const NodeAcademy: React.FC<NodeAcademyProps> = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [search, setSearch] = useState('');

  const platforms = [
    'all',
    'Harvard University',
    'Coursera & ACNUR / UNHCR',
    'MIT OpenCourseWare',
    'UNED Abierta',
    'Fundación Telefónica',
    'Universidad de Helsinki',
    'OpenLearn (The Open University)',
    'The Linux Foundation',
  ];

  const filtered = ACADEMIC_COURSES.filter((c) => {
    const matchesPlat = selectedPlatform === 'all' || c.institution === selectedPlatform;
    const q = search.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q));
    return matchesPlat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
            Nodo 9 · Educación Abierta Global
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Harvard · MIT · Coursera · UNED · Formación Universitaria 100% Gratuita
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Academia Global de Educación Abierta
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Accede a los mejores programas formativos de las principales universidades del mundo y becas directas para personas refugiadas y migrantes. Cursos con opción de certificado gratuito y materiales didácticos de libre acceso.
        </p>
      </div>

      {/* Search & Platform Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por curso, tecnología (Python, IA, Ciberseguridad), universidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Platform tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {platforms.map((plat) => {
            const isSelected = selectedPlatform === plat;
            return (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'glass-pill text-slate-700 dark:text-slate-300 hover:bg-white/80'
                }`}
              >
                {plat === 'all' ? 'Todas las Universidades' : plat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="glass-card p-5 rounded-2xl shadow-sm hover:border-orange-400/80 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/40">
                  {course.institution}
                </span>
                {course.freeCertification && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Certificado Gratuito
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {course.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {course.description}
              </p>

              {course.scholarshipInfo && (
                <div className="p-2.5 rounded-xl glass-card-subtle bg-orange-500/10 text-[11px] text-orange-950 dark:text-orange-200 border border-orange-300/40">
                  🎓 <strong>Beca:</strong> {course.scholarshipInfo}
                </div>
              )}

              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-orange-500" />
                  {course.language}
                </span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {course.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-lg glass-pill text-slate-600 dark:text-slate-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                100% Gratuito
              </span>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
              >
                <span>Ir al Curso Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
