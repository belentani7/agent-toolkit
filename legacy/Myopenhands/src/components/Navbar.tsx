import React, { useState } from 'react';
import { NodeId, Language, MainSection } from '../types';
import { NODES_LIST } from '../data/nodesMetadata';
import { TRANSLATIONS } from '../data/i18n';
import { VOCES_39 } from '../data/voiceConfig';
import {
  Sparkles,
  BookOpen,
  Mic,
  Moon,
  Sun,
  Award,
  Globe,
  Download,
  Upload,
  Search,
  CheckCircle,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  Compass,
  FileText,
  HelpCircle,
  Layers,
  Home
} from 'lucide-react';

interface NavbarProps {
  currentSection: MainSection;
  onSelectSection: (section: MainSection) => void;
  currentNode: NodeId;
  onSelectNode: (id: NodeId) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  xp: number;
  onOpenVoiceCompanion: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenHealthCheck?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  currentNode,
  onSelectNode,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  xp,
  onOpenVoiceCompanion,
  onExportData,
  onImportData,
  onOpenHealthCheck,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[language];

  const currentMetadata = NODES_LIST.find((n) => n.id === currentNode);

  const filteredNodes = searchQuery.trim()
    ? NODES_LIST.filter(
        (n) =>
          n.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.subtitle[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(n.number).includes(searchQuery)
      )
    : NODES_LIST;

  const currentLevel = Math.floor(xp / 100) + 1;
  const currentXPInLevel = xp % 100;

  const mainNavItems: Array<{
    id: MainSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'aprender', label: 'Aprender', icon: BookOpen },
    { id: 'carrera', label: 'Carrera', icon: Briefcase },
    { id: 'recursos', label: 'Recursos', icon: Compass },
    { id: 'herramientas', label: 'Herramientas', icon: FileText },
    { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
    { id: 'nodos', label: '15 Nodos', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/50 dark:border-white/10 transition-colors">
      {/* Top Banner: Free & Open Source Sovereignty */}
      <div className="bg-gradient-to-r from-orange-500/90 via-amber-500/90 to-orange-500/90 backdrop-blur-md text-white text-[11px] py-1 px-4 text-center font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-white/20">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Manos Abiertas v2.5 · {t.freeAndOpenSource}</span>
        <span className="hidden md:inline opacity-80">· {t.noTracking}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => onSelectSection('inicio')}
              className="flex items-center gap-2.5 text-left group"
              aria-label="Ir al inicio de Manos Abiertas"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform font-bold text-lg font-heading">
                MA
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                  Manos Abiertas
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/50 dark:bg-white/10 text-orange-700 dark:text-orange-300 border border-white/60 dark:border-white/15 backdrop-blur-sm">
                    v2.5
                  </span>
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs">
                  {t.tagline}
                </p>
              </div>
            </button>

            {/* Desktop Primary Nav Pillars */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* XP & Level Badge */}
            <div
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-400 cursor-pointer hover:opacity-80 transition-opacity bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 dark:border-white/10 shadow-xs"
              onClick={() => onSelectNode('skills-passport')}
              title="Ver Pasaporte de Competencias y XP"
            >
              <Award className="w-4 h-4 text-orange-500" />
              <span>
                Niv. {currentLevel} ({xp} XP)
              </span>
              <div className="w-12 bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${currentXPInLevel}%` }}
                ></div>
              </div>
            </div>

            {/* Voice Companion Shortcut */}
            <button
              onClick={onOpenVoiceCompanion}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
              title="Hablar con el tutor Manos (con voz)"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Manos IA</span>
            </button>

            {/* Language Selector */}
            <div className="relative inline-block">
              <label htmlFor="language-select" className="sr-only">
                {t.languageSelect}
              </label>
              <div className="flex items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-2 py-1.5 border border-white/60 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Globe className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-transparent text-xs font-bold cursor-pointer focus:outline-none dark:text-slate-200 max-w-[100px] sm:max-w-[130px]"
                >
                  {(Object.keys(VOCES_39) as Language[]).map((code) => (
                    <option key={code} value={code} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      {code.toUpperCase()} — {VOCES_39[code].nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/60 backdrop-blur-md transition-colors border border-white/50 dark:border-white/10"
              aria-label={isDarkMode ? t.lightTheme : t.darkTheme}
              title={isDarkMode ? t.lightTheme : t.darkTheme}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* System Health / Self-Fix Audit */}
            {onOpenHealthCheck && (
              <button
                onClick={onOpenHealthCheck}
                className="p-2 rounded-xl text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 backdrop-blur-md transition-all hover:scale-105"
                title="Auditoría de Integridad & Protocolo Self-Fix"
                aria-label="Auditoría y Auto-Reparación"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}

            {/* Backup / Export Menu */}
            <button
              onClick={onExportData}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/60 backdrop-blur-md transition-colors border border-white/50 dark:border-white/10 hidden sm:inline-flex"
              title={t.downloadData}
              aria-label={t.downloadData}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/60 backdrop-blur-md transition-colors border border-white/50 dark:border-white/10 md:hidden"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 15 Nodes Horizontal Scrollable Bar on Desktop (Visible in Nodos view or always accessible) */}
        {(currentSection === 'nodos' || currentSection === 'inicio') && (
          <div className="hidden md:flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-white/40 dark:border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              15 Nodos:
            </span>
            {NODES_LIST.map((node) => {
              const isActive = currentNode === node.id && currentSection === 'nodos';
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node.id);
                    onSelectSection('nodos');
                  }}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 backdrop-blur-md shrink-0 ${
                    isActive
                      ? 'bg-orange-500 text-white border border-orange-400 shadow-sm font-bold scale-105'
                      : 'bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-white/65 dark:hover:bg-slate-700/60 border border-white/50 dark:border-white/10'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75 font-bold">N{node.number}</span>
                  <span>{node.title[language].split('.')[1]?.trim() || node.title[language]}</span>
                  {node.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/30 text-white'
                        : 'bg-orange-100/80 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300'
                    }`}>
                      {node.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/50 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 space-y-4">
          {/* Main Pillars in Mobile */}
          <div className="grid grid-cols-2 gap-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search nodes */}
          <div className="relative pt-2 border-t border-slate-200 dark:border-slate-800">
            <Search className="w-4 h-4 absolute left-3 top-5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchNodes}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              15 Nodos Especializados
            </p>
            {filteredNodes.map((node) => {
              const isActive = currentNode === node.id && currentSection === 'nodos';
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node.id);
                    onSelectSection('nodos');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-orange-500 text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] opacity-80 font-bold">
                      N{node.number}
                    </span>
                    <span>{node.title[language]}</span>
                  </div>
                  {node.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                      {node.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Backup & Tools in Drawer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 flex-wrap gap-2">
            {onOpenHealthCheck && (
              <button
                onClick={() => {
                  onOpenHealthCheck();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Auditoría & Self-Fix</span>
              </button>
            )}
            <button
              onClick={() => {
                onExportData();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 hover:text-orange-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadData}</span>
            </button>
            <label className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{t.restoreData}</span>
              <input type="file" accept=".json" onChange={onImportData} className="hidden" />
            </label>
          </div>
        </div>
      )}
    </header>
  );
};
