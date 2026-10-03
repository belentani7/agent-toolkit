import React, { useState } from 'react';
import { LegalArticle, Language } from '../types';
import { LEGAL_ARTICLES } from '../data/legalRightsData';
import { TRANSLATIONS } from '../data/i18n';
import {
  Scale,
  CheckCircle,
  FileCheck,
  ListOrdered,
  AlertTriangle,
  BookOpen,
  Calendar,
  Search
} from 'lucide-react';

interface NodeLegalProps {
  language: Language;
}

export const NodeLegal: React.FC<NodeLegalProps> = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(LEGAL_ARTICLES[0].id);
  const [searchTerm, setSearchTerm] = useState('');

  const currentArticle =
    LEGAL_ARTICLES.find((a) => a.id === selectedArticleId) || LEGAL_ARTICLES[0];

  const filteredArticles = searchTerm.trim()
    ? LEGAL_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.requirements.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : LEGAL_ARTICLES;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
            Nodo 5 · Asesoría Legal
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Legislación de Extranjería, Arraigos & Derechos en España
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Guía Jurídica & Extranjería en España
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Información rigurosa sobre las vías legales de regularización (Arraigo Social, Laboral y Formación), empadronamiento sin domicilio fijo por resolución del INE, protección internacional y derechos laborales inalienables.
        </p>
      </div>

      {/* Search & Topic Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Legal Topics */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por trámite legal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            {filteredArticles.map((art) => {
              const isSelected = art.id === selectedArticleId;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.01]'
                      : 'glass-card border-white/60 dark:border-white/10 hover:border-orange-300 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold opacity-80 uppercase">
                    <span>{art.category}</span>
                    <span>Actualizado {art.updatedDate}</span>
                  </div>
                  <h3 className="text-xs font-bold leading-snug">{art.title}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Article Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            {/* Header info */}
            <div className="space-y-2 border-b border-white/40 dark:border-white/10 pb-4">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/40 uppercase">
                {currentArticle.category} · Marco Legal Vigente
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentArticle.title}
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Base legal: {currentArticle.legalBasis}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Resumen del Procedimiento
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentArticle.summary}
              </p>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-orange-500" /> Requisitos Imprescindibles
              </h3>
              <div className="space-y-2">
                {currentArticle.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Roadmap */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-orange-500" /> Pasos a Seguir
              </h3>
              <div className="space-y-2">
                {currentArticle.stepByStep.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl glass-card-subtle border border-orange-200/40 dark:border-orange-900/40 text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Advice Callout */}
            <div className="p-4 rounded-xl glass-card border border-amber-300/50 dark:border-amber-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Consejo Clave de Orientación Jurídica</span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                {currentArticle.keyAdvice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
