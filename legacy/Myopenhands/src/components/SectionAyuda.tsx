import React, { useState } from 'react';
import { Language, NodeId } from '../types';
import { HELP_FAQS, EMERGENCY_CONTACTS } from '../data/helpData';
import { TRANSLATIONS } from '../data/i18n';
import {
  HelpCircle,
  Phone,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  BookOpen,
  Scale,
  Sparkles,
  Heart,
  Volume2,
  AlertTriangle
} from 'lucide-react';

interface SectionAyudaProps {
  language: Language;
  onSelectNode: (nodeId: NodeId) => void;
  onOpenHealthCheck?: () => void;
}

export const SectionAyuda: React.FC<SectionAyudaProps> = ({
  language,
  onSelectNode,
  onOpenHealthCheck,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(HELP_FAQS[0].id);

  const filteredFaqs = HELP_FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Centro de Ayuda & Orientación Social</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Preguntas Frecuentes, Derechos & Emergencias
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Respuestas oficiales claras a dudas cotidianas sobre empadronamiento, sanidad, cuentas bancarias, arraigos y teléfonos de asistencia gratuita 24h.
            </p>
          </div>

          {onOpenHealthCheck && (
            <button
              onClick={onOpenHealthCheck}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Diagnóstico & Self-Fix</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Assistance 24/7 Official Numbers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Líneas Telefónicas Oficiales Gratuitas en España (24h)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl shadow-sm border border-white/60 dark:border-white/10 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300">
                    {contact.badge}
                  </span>
                  <span className="text-[10px] text-slate-500">{contact.hours}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {contact.name}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {contact.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                  {contact.number}
                </span>
                <a
                  href={`tel:${contact.number.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3 h-3" />
                  <span>Llamar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Search & Category Filter */}
      <div className="glass-card p-6 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en preguntas frecuentes (ej: padrón, banco, sanidad, arraigo)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'documentacion', label: 'Padrón & Arraigo' },
              { id: 'salud', label: 'Sanidad' },
              { id: 'banca', label: 'Cuenta Bancaria' },
              { id: 'empleo', label: 'Empleo & Acredita' },
              { id: 'plataforma', label: 'Privacidad' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-6">
              No se encontraron preguntas que coincidan con la búsqueda.
            </p>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed border-t border-white/20 dark:border-white/5">
                      <p>{faq.answer}</p>
                      {faq.legalNote && (
                        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <Scale className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Base legal:</strong> {faq.legalNote}
                          </span>
                        </div>
                      )}
                      {faq.relatedNode && (
                        <button
                          onClick={() => onSelectNode(faq.relatedNode!)}
                          className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <span>Ir al nodo relacionado en Manos Abiertas</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
