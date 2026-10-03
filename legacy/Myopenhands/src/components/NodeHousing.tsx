import React, { useState } from 'react';
import { Language } from '../types';
import { HOUSING_GUIDES, HousingGuideItem } from '../data/financeHousingData';
import { TRANSLATIONS } from '../data/i18n';
import {
  Home,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';

interface NodeHousingProps {
  language: Language;
}

export const NodeHousing: React.FC<NodeHousingProps> = () => {
  const [selectedGuide, setSelectedGuide] = useState<HousingGuideItem>(HOUSING_GUIDES[0]);

  const abusiveClauses = [
    {
      title: 'Comisión / Honorarios de Agencia Inmobiliaria',
      law: 'Ley de Vivienda 12/2023 (Modificación de la LAU)',
      status: 'ILEGAL',
      desc: 'Los gastos de gestión inmobiliaria y de formalización del contrato corresponden SIEMPRE al arrendador (propietario). Ninguna inmobiliaria puede cobrarle un mes de comisión al inquilino.',
    },
    {
      title: 'Prohibición de Empadronarse en la Vivienda',
      law: 'Resolución del INE / Ley Reguladora de Bases de Régimen Local',
      status: 'NULA DE PLENO DERECHO',
      desc: 'Cualquier cláusula contractual que te prohíba empadronarte se tiene por no puesta. Tienes el derecho incondicional a empadronarte donde resides de forma habitual.',
    },
    {
      title: 'Exigencia de Más de 2 Meses de Garantía Adicional',
      law: 'Artículo 36.5 de la LAU',
      status: 'ILEGAL',
      desc: 'En contratos de vivienda de hasta 5 o 7 años de duración, el valor de las garantías adicionales (fianzas extra o avales) no puede exceder en ningún caso de 2 mensualidades de renta.',
    },
    {
      title: 'Entrada del Propietario Sin Tu Consentimiento',
      law: 'Artículo 18.2 de la Constitución Española',
      status: 'DELITO DE ALLANAMIENTO DE MORADA',
      desc: 'El domicilio es inviolable. El propietario no tiene llaves para entrar cuando quiera. Entrar sin tu permiso expreso o sin orden judicial es un delito penal castigado con prisión.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
            Nodo 13 · Vivienda Digna
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Ley de Arrendamientos Urbanos (LAU) · Ley 12/2023 · Cláusulas Abusivas
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Derechos del Inquilino & Vivienda Digna
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          El alquiler en España está fuertemente regulado para protegerte frente a abusos. Conoce tus derechos legales: duración mínima de contratos (5 años si es particular, 7 años si es empresa), prohibición de cobrarte honorarios de agencia y depósito obligatorio de fianza.
        </p>
      </div>

      {/* Abusive Clauses Warning Grid */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Detector de Cláusulas Abusivas e Ilegales en Alquiler
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Si tu contrato contiene alguna de estas cláusulas, la ley española las considera inexistentes o nulas. No estás obligado/a a cumplirlas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {abusiveClauses.map((clause, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle space-y-1.5"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {clause.title}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-500/30 shrink-0">
                  {clause.status}
                </span>
              </div>
              <p className="text-[11px] font-mono text-orange-600 dark:text-orange-400 font-semibold">
                {clause.law}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {clause.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Guides Grid & Selected Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Guías Esenciales de Vivienda
          </h3>
          <div className="space-y-2">
            {HOUSING_GUIDES.map((g) => {
              const isSelected = g.id === selectedGuide.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuide(g)}
                  className={`w-full p-4 rounded-xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.01]'
                      : 'glass-card hover:border-orange-400/80 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase opacity-80 block">
                    Guía Práctica
                  </span>
                  <h4 className="text-xs font-bold leading-snug">{g.title}</h4>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="space-y-2 border-b border-white/40 dark:border-white/10 pb-4">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/40 uppercase">
                Marco Legal LAU
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {selectedGuide.title}
              </h2>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Resumen de Protección
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedGuide.summary}
              </p>
            </div>

            {/* Regulations */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-orange-500" /> Regulaciones Clave
              </h3>
              <div className="space-y-2">
                {selectedGuide.regulations.map((reg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed"
                  >
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{reg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deposit Rights */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Depósito Legal de Fianza
              </h3>
              <div className="space-y-2">
                {selectedGuide.depositRights.map((dep, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card-subtle bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
                  >
                    {dep}
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signs */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Señales de Alerta y Estafas Frecuentes
              </h3>
              <div className="space-y-2">
                {selectedGuide.warningSigns.map((warn, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card-subtle bg-rose-500/10 border border-rose-500/30 text-xs text-rose-950 dark:text-rose-200 leading-relaxed"
                  >
                    ⚠️ {warn}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
