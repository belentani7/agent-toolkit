import React, { useState } from 'react';
import { Language, UserProgress, CVData, AppointmentItem } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  Award,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Lock,
  RefreshCw,
  Trash2,
  FileCheck,
  Check
} from 'lucide-react';

interface NodePassportProps {
  language: Language;
  progress: UserProgress;
  cvData: CVData;
  appointments: AppointmentItem[];
  savedResources: string[];
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetAllData: () => void;
  onOpenHealthCheck?: () => void;
}

export const NodePassport: React.FC<NodePassportProps> = ({
  language,
  progress,
  cvData,
  appointments,
  savedResources,
  onExportData,
  onImportData,
  onResetAllData,
  onOpenHealthCheck,
}) => {
  const t = TRANSLATIONS[language];
  const [confirmReset, setConfirmReset] = useState(false);

  const level = Math.floor(progress.totalXP / 100) + 1;
  const xpCurrent = progress.totalXP % 100;

  const badgesList = [
    {
      id: 'b-ai-starter',
      name: 'Pionero de la IA',
      desc: 'Superaste tus primeros niveles del currículo de Inteligencia Artificial.',
      earned: progress.completedLessons.length >= 3,
      icon: '✨',
    },
    {
      id: 'b-ai-master',
      name: 'Ingeniero de Prompts',
      desc: 'Completaste más de 10 niveles avanzados de IA y modelos abiertos.',
      earned: progress.completedLessons.length >= 10,
      icon: '🧠',
    },
    {
      id: 'b-cv-builder',
      name: 'Currículum ATS Listo',
      desc: 'Completaste tu perfil profesional y habilidades laborales para contratación.',
      earned: cvData.fullName.length > 3 && cvData.experience.length > 0,
      icon: '📄',
    },
    {
      id: 'b-dele-pass',
      name: 'Apto Constitucional',
      desc: 'Aprobaste el simulador oficial de lengua DELE o conocimientos CCSE.',
      earned: progress.deleScores.some((s) => s.apto),
      icon: '🏛️',
    },
    {
      id: 'b-organized',
      name: 'Gestión Documental Activa',
      desc: 'Tienes registradas citas y cotejos de extranjería en tu gestor.',
      earned: appointments.length > 0,
      icon: '📅',
    },
    {
      id: 'b-community',
      name: 'Red Solidaria',
      desc: 'Guardaste recursos oficiales y asociaciones en tus marcadores de apoyo.',
      earned: savedResources.length >= 2,
      icon: '🤝',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
                Nodo 15 · Pasaporte de Competencias
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Acreditación Digital · Medallero · Privacidad Local 100%
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Pasaporte de Competencias Digitales & Respaldo
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Tu progreso, lecciones superadas y datos de currículum residen únicamente en tu dispositivo con máxima privacidad. Exporta tu copia de seguridad cifrada o restáurala en cualquier momento.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={onExportData}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadData}</span>
            </button>
            <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-card-subtle text-slate-800 dark:text-slate-200 border border-white/60 dark:border-white/10 text-xs font-bold hover:bg-white/80 cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span>{t.restoreData}</span>
              <input type="file" accept=".json" onChange={onImportData} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Visual Digital Passport Card */}
      <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Background watermark badge */}
        <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none text-9xl font-heading font-black">
          MA
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-lg font-heading">
                N{level}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                  Pasaporte Digital de Aprendizaje
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading">
                  {cvData.fullName || 'Estudiante de Manos Abiertas'}
                </h2>
                <p className="text-xs text-slate-400">
                  ID: MA-{progress.totalXP * 7 + 1042} · Estado: Activo en Formación
                </p>
              </div>
            </div>

            {/* Level & XP Meter */}
            <div className="space-y-1.5 max-w-md pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Nivel {level} ({progress.totalXP} XP Acumulados)</span>
                <span className="text-orange-400 font-bold">{xpCurrent} / 100 XP para Nivel {level + 1}</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${xpCurrent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[280px]">
            <div>
              <p className="text-lg font-bold text-orange-400 font-mono">
                {progress.completedLessons.length}
              </p>
              <p className="text-[10px] text-slate-400 uppercase">Lecciones IA</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-400 font-mono">
                {progress.deleScores.length}
              </p>
              <p className="text-[10px] text-slate-400 uppercase">Exámenes DELE</p>
            </div>
            <div>
              <p className="text-lg font-bold text-sky-400 font-mono">
                {appointments.length}
              </p>
              <p className="text-[10px] text-slate-400 uppercase">Citas Activas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges / Medallero Grid */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Medallero de Habilidades Conquistadas
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 backdrop-blur-md ${
                badge.earned
                  ? 'glass-card-subtle border-orange-300 dark:border-orange-500/30 bg-orange-500/10'
                  : 'glass-card-subtle opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  badge.earned
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {badge.icon}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {badge.name}
                  </h4>
                  {badge.earned && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                      Desbloqueada
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sovereignty & Safe Reset */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Soberanía de Datos & Privacidad Local
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Tus datos (CV, citas médicas o de extranjería, notas y respuestas) se almacenan exclusivamente en tu navegador (LocalStorage) y nunca son transmitidos a servidores de terceros ni utilizados para rastreo publicitario.
        </p>

        {/* System Health & Self-Fix Trigger */}
        {onOpenHealthCheck && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Protocolo de Autodiagnóstico y Auto-Reparación (Self-Fix)
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Verifica en tiempo real la integridad del almacenamiento, la síntesis de 39 voces, los diccionarios y las rutas sin conexión.
              </p>
            </div>
            <button
              onClick={onOpenHealthCheck}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Auditar Sistema
            </button>
          </div>
        )}

        <div className="pt-3 border-t border-white/40 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Reiniciar Datos y Empezar de Cero
            </p>
            <p className="text-[11px] text-slate-500">
              Elimina los registros locales de progreso en este dispositivo.
            </p>
          </div>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
            >
              Borrar Datos de Progreso
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetAllData();
                  setConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Confirmar Borrado Total
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 rounded-xl text-slate-500 text-xs font-semibold hover:bg-white/40"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
