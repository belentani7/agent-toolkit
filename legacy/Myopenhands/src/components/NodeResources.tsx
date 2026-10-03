import React, { useState } from 'react';
import { ResourceItem, Language } from '../types';
import { RESOURCES_LIST } from '../data/resourcesData';
import { TRANSLATIONS } from '../data/i18n';
import {
  Compass,
  Search,
  Phone,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Shield,
  Heart,
  Home,
  Briefcase,
  Landmark,
  GraduationCap
} from 'lucide-react';

interface NodeResourcesProps {
  language: Language;
  savedResources: string[];
  onToggleSaveResource: (id: string) => void;
}

export const NodeResources: React.FC<NodeResourcesProps> = ({
  language,
  savedResources,
  onToggleSaveResource,
}) => {
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos los Recursos', icon: Compass },
    { id: 'official', label: 'Organismos Oficiales', icon: Shield },
    { id: 'ong', label: 'ONGs & Acogida', icon: Heart },
    { id: 'legal', label: 'Asesoría Jurídica & Asilo', icon: Shield },
    { id: 'health', label: 'Salud & Salud Mental', icon: Heart },
    { id: 'housing', label: 'Vivienda & Inquilinos', icon: Home },
    { id: 'finance', label: 'Inclusión Bancaria', icon: Landmark },
    { id: 'employment', label: 'Empleo & Formación', icon: Briefcase },
  ];

  const filtered = RESOURCES_LIST.filter((res) => {
    const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      res.name.toLowerCase().includes(q) ||
      res.description.toLowerCase().includes(q) ||
      res.tags.some((t) => t.toLowerCase().includes(q)) ||
      res.location.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
            Nodo 4 · Red de Apoyo
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Directorio Exhaustivo de Recursos Oficiales, ONGs y Ayudas
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Directorio Oficial de Recursos & ONGs
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Acceso verificado a los servicios públicos estatales y autonómicos, organizaciones del tercer sector (Cruz Roja, Cáritas, CEAR, ACCEM), teléfonos 24 horas y entidades de mediación social en toda España.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, trámite (ej. empadronamiento, asilo, tarjeta sanitaria), teléfono o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-md"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 border border-orange-400'
                    : 'glass-card-subtle text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isBookmarked = savedResources.includes(item.id);
          return (
            <div
              key={item.id}
              className="glass-card p-5 rounded-2xl shadow-sm hover:border-orange-400/80 dark:hover:border-orange-500/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100/70 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-300/40 dark:border-orange-800/50 backdrop-blur-xs">
                    {item.category}
                  </span>
                  <button
                    onClick={() => onToggleSaveResource(item.id)}
                    className="text-slate-400 hover:text-orange-500 transition-colors p-1"
                    title={isBookmarked ? 'Guardado en favoritos' : 'Guardar recurso'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  📍 {item.location}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full glass-pill text-slate-600 dark:text-slate-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between gap-2">
                {item.phone ? (
                  <a
                    href={`tel:${item.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-bold hover:bg-orange-500/20 border border-orange-300/40 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{item.phone}</span>
                  </a>
                ) : (
                  <div></div>
                )}

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  <span>Web Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
