import React, { useState } from 'react';
import { Language } from '../types';
import { ASSOCIATIONS_DIRECTORY, COMMUNITY_EVENTS, Association } from '../data/communityData';
import { TRANSLATIONS } from '../data/i18n';
import {
  Users,
  Calendar,
  MapPin,
  Mail,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface NodeCommunityProps {
  language: Language;
}

export const NodeCommunity: React.FC<NodeCommunityProps> = () => {
  const [activeTab, setActiveTab] = useState<'associations' | 'events'>('associations');
  const [search, setSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [proposedName, setProposedName] = useState('');
  const [proposedCity, setProposedCity] = useState('');
  const [proposedDesc, setProposedDesc] = useState('');
  const [proposeSuccess, setProposeSuccess] = useState(false);

  const provinces = ['all', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bizkaia', 'Málaga', 'Zaragoza'];

  const filteredAssociations = ASSOCIATIONS_DIRECTORY.filter((item) => {
    const matchesProv = provinceFilter === 'all' || item.province.toLowerCase() === provinceFilter.toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.focus.toLowerCase().includes(q) ||
      item.services.some((s) => s.toLowerCase().includes(q));
    return matchesProv && matchesSearch;
  });

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProposeSuccess(true);
    setTimeout(() => {
      setShowProposeModal(false);
      setProposeSuccess(false);
      setProposedName('');
      setProposedCity('');
      setProposedDesc('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
                Nodo 14 · Red Social & Comunitaria
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Asociaciones por Provincia · Talleres Gratuitos · Apoyo Mutuo
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Red Comunitaria, Asociaciones & Encuentros
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Nadie sale adelante solo. Conecta con colectivos migrantes autoorganizados, asociaciones de acogida vecinal, espacios de intercambio lingüístico y comedores comunitarios cerca de tu lugar de residencia.
            </p>
          </div>

          <button
            onClick={() => setShowProposeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Proponer Colectivo o Evento</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('associations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'associations'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/40'
            }`}
          >
            Directorio de Asociaciones ({ASSOCIATIONS_DIRECTORY.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/40'
            }`}
          >
            Calendario de Talleres & Encuentros ({COMMUNITY_EVENTS.length})
          </button>
        </div>

        {/* Province Filter Pills */}
        {activeTab === 'associations' && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {provinces.map((prov) => (
              <button
                key={prov}
                onClick={() => setProvinceFilter(prov)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                  provinceFilter === prov
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'glass-pill text-slate-600 dark:text-slate-300 hover:bg-white/60'
                }`}
              >
                {prov === 'all' ? 'Toda España' : prov}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      {activeTab === 'associations' && (
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar asociación por nombre, ámbito de apoyo (asesoría jurídica, clases de español, arraigo)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}

      {/* Associations Grid */}
      {activeTab === 'associations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssociations.map((assoc) => (
            <div
              key={assoc.id}
              className="glass-card p-5 rounded-2xl shadow-sm hover:border-orange-400/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/40">
                    {assoc.province} ({assoc.region})
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {assoc.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {assoc.focus}
                </p>

                <p className="text-[11px] text-slate-500 font-medium">📍 {assoc.address}</p>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {assoc.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-lg glass-pill text-slate-600 dark:text-slate-300 font-medium"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contacts info */}
              <div className="pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                {assoc.contact && (
                  <a
                    href={`mailto:${assoc.contact}`}
                    className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{assoc.contact}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events List */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMUNITY_EVENTS.map((event) => (
            <div
              key={event.id}
              className="glass-card p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/40">
                    {event.format}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                    {event.cost}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-white/40 dark:border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-[11px] text-slate-400">Org: {event.organizer}</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">Entrada Libre</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Propose Association Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleProposeSubmit}
            className="glass-card p-6 rounded-2xl max-w-md w-full border border-white/60 dark:border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Proponer Colectivo o Asociación
              </h3>
              <button
                type="button"
                onClick={() => setShowProposeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cerrar
              </button>
            </div>

            {proposeSuccess ? (
              <div className="p-4 rounded-xl glass-card-subtle bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Gracias! Tu propuesta ha sido registrada para verificación comunitaria.</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombre del Colectivo / Organización
                  </label>
                  <input
                    type="text"
                    value={proposedName}
                    onChange={(e) => setProposedName(e.target.value)}
                    required
                    placeholder="Ej. Red Solidaria Vecinal"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Provincia / Ciudad
                  </label>
                  <input
                    type="text"
                    value={proposedCity}
                    onChange={(e) => setProposedCity(e.target.value)}
                    required
                    placeholder="Ej. Valencia"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Servicios que prestan
                  </label>
                  <textarea
                    rows={3}
                    value={proposedDesc}
                    onChange={(e) => setProposedDesc(e.target.value)}
                    required
                    placeholder="Describe los apoyos que ofrecen: clases de español, ropero, alimentos, asesoría jurídica..."
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
                  >
                    Enviar Propuesta
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
