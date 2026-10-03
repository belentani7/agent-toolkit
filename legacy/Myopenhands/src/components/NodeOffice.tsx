import React, { useState } from 'react';
import { Language } from '../types';
import { OFFICE_MODULES, OfficeModule } from '../data/officeData';
import {
  FileSpreadsheet,
  FileText,
  Presentation,
  Mail,
  ShieldCheck,
  CheckCircle,
  Play,
  Calculator,
  Keyboard,
  ListOrdered
} from 'lucide-react';

interface NodeOfficeProps {
  language: Language;
}

export const NodeOffice: React.FC<NodeOfficeProps> = () => {
  const [selectedModule, setSelectedModule] = useState<OfficeModule>(OFFICE_MODULES[1]); // Excel by default
  const [calcSales, setCalcSales] = useState<number>(1500);
  const [calcTarget, setCalcTarget] = useState<number>(1000);

  // Formula simulator results
  const isTargetMet = calcSales >= calcTarget;
  const commission = isTargetMet ? calcSales * 0.05 : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
            Nodo 2 · Competencias Laborales
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Microsoft 365 · Google Workspace · SEPE Digital
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Suite Ofimática & Productividad Laboral
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Domina las herramientas requeridas en oficinas, comercios y administración en España: redacción oficial, fórmulas clave de Excel (BUSCARX, SI condicional), presentaciones ejecutivas y trámites telemáticos con Cl@ve y Certificado Digital.
        </p>
      </div>

      {/* Modules Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {OFFICE_MODULES.map((mod) => {
          const isSelected = selectedModule.id === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod)}
              className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'glass-card border-white/60 dark:border-white/10 hover:border-orange-300 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'glass-pill text-orange-600 dark:text-orange-300'
                }`}>
                  {mod.app}
                </span>
                <span className="text-[10px] font-bold opacity-75">{mod.duration}</span>
              </div>
              <h3 className="text-xs font-bold leading-snug">{mod.title}</h3>
              <div className="flex items-center gap-1.5 pt-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  isSelected ? 'bg-white/20 text-white' : 'glass-pill text-slate-700 dark:text-slate-300'
                }`}>
                  {mod.level}
                </span>
                <span className="text-[10px] opacity-75">{mod.skills.length} competencias</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Module Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Description & Practical Step-by-Step */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-orange-700 dark:text-orange-300 glass-card-subtle px-2.5 py-1 rounded-lg border border-orange-300/40">
                {selectedModule.app} · Nivel {selectedModule.level}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Duración: {selectedModule.duration}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {selectedModule.title}
            </h2>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {selectedModule.description}
            </p>

            {/* Competencies */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Habilidades Laborales que Adquirirás
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedModule.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by Step Guide */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-orange-500" />
                Guía Paso a Paso
              </p>
              <div className="space-y-2">
                {selectedModule.practicalGuide.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Formula Simulator & Keyboard Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Formula Playground (Active for Excel & Sheets) */}
          <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Simulador de Fórmulas en Vivo (Excel / Sheets)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prueba la fórmula condicional más usada: <code className="glass-card-subtle px-1.5 py-0.5 rounded text-[11px] font-mono text-orange-600 dark:text-orange-400">=SI(Ventas &gt;= Meta; Ventas * 5%; 0)</code>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Ventas Realizadas (€)
                </label>
                <input
                  type="number"
                  value={calcSales}
                  onChange={(e) => setCalcSales(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-white/60 dark:border-white/10 glass-card text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Meta del Mes (€)
                </label>
                <input
                  type="number"
                  value={calcTarget}
                  onChange={(e) => setCalcTarget(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-white/60 dark:border-white/10 glass-card text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Calculated Output Preview */}
            <div className="p-4 rounded-xl glass-card-subtle text-slate-900 dark:text-white border border-white/60 dark:border-white/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400 border-b border-white/20 dark:border-white/10 pb-1 text-[11px]">
                <span>Fórmula Evaluada:</span>
                <span>Resultado</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">¿Supera Meta?</span>
                <span className={isTargetMet ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                  {isTargetMet ? 'SÍ (OBJETIVO CUMPLIDO)' : 'NO (SIN BONUS)'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-white/20 dark:border-white/10">
                <span className="text-orange-600 dark:text-orange-400 font-bold">Comisión / Bonus (5%):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{commission.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Cheatsheet */}
          <div className="glass-card p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Atajos de Teclado Imprescindibles
              </h3>
            </div>
            <div className="space-y-2">
              {selectedModule.shortcutTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs"
                >
                  <span className="text-slate-600 dark:text-slate-400">{tip.description}</span>
                  <kbd className="px-2 py-1 rounded-lg glass-pill font-mono font-bold text-[10px] text-slate-800 dark:text-slate-200">
                    {tip.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
