import React, { useState } from 'react';
import { Language, CareerTrack } from '../types';
import { CAREER_TRACKS } from '../data/careerData';
import { TRANSLATIONS } from '../data/i18n';
import {
  Briefcase,
  ShieldAlert,
  Brain,
  Code,
  FileSpreadsheet,
  ArrowRight,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

interface SectionCarreraProps {
  language: Language;
  onSelectNode: (nodeId: any) => void;
}

export const SectionCarrera: React.FC<SectionCarreraProps> = ({
  language,
  onSelectNode,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedTrackId, setSelectedTrackId] = useState<string>(CAREER_TRACKS[0].id);

  const currentTrack = CAREER_TRACKS.find((ct) => ct.id === selectedTrackId) || CAREER_TRACKS[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Orientación Profesional & Empleabilidad en España</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Arquitectura de Carreras Profesionales
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Rutas formativas estructuradas paso a paso desde los fundamentos hasta la especialización, con salarios orientativos y competencias requeridas en el mercado laboral español.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectNode('jobs-skills')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Procedimiento Acredita (N11)</span>
            </button>
            <button
              onClick={() => onSelectNode('cv-builder')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Optimizar mi CV ATS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Track Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CAREER_TRACKS.map((track) => {
          const isSelected = track.id === selectedTrackId;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrackId(track.id)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xl shadow-amber-500/20'
                  : 'glass-card border-white/60 dark:border-white/10 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600'
                }`}>
                  {track.id === 'career-cybersecurity' && <ShieldAlert className="w-5 h-5" />}
                  {track.id === 'career-ai' && <Brain className="w-5 h-5" />}
                  {track.id === 'career-web' && <Code className="w-5 h-5" />}
                  {track.id === 'career-admin' && <FileSpreadsheet className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                }`}>
                  Demanda {track.demandLevel}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold leading-snug">
                  {track.title}
                </h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {track.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Track Comprehensive Blueprint */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-8">
        {/* Track Title & Quick Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/40 dark:border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
              Itinerario Formativo Profesional
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              {currentTrack.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {currentTrack.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Rango Salarial</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                {currentTrack.avgSalarySpain}
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Demanda Laboral</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {currentTrack.demandLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Roles & Key Competencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Perfiles Laborales Objetivo</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {currentTrack.targetRoles.map((role, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-semibold">{role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Habilidades Técnicas Clave</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentTrack.keySkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Phases / Milestones */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <span>Ruta Formativa por Etapas (Hitos de Crecimiento)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentTrack.milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 inline-block">
                    {m.phase}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {m.title}
                  </h4>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                    {m.topics.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">
                    Certificaciones recomendadas:
                  </span>
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {m.certifications.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accreditation & Acredita Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>¿Tienes experiencia laboral en este sector pero no un título oficial en España?</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              El <strong>Procedimiento Acredita</strong> oficial te permite convalidar años de trabajo o cursos informales para obtener un Certificado de Profesionalidad homologado.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectNode('jobs-skills')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Simulador Acredita (N11)
            </button>
            <a
              href="https://www.todofp.es/acreditacion-de-competencias.html"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white/50 text-xs font-semibold"
              title="Portal oficial TodoFP"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
