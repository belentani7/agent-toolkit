import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Heart,
  X,
  CheckCircle2,
  Smile,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Language } from '../types';
import { hablarTexto } from '../data/voiceConfig';

interface CognitiveAccessibilityBarProps {
  language: Language;
  nodeTitle: string;
  nodeDescription: string;
  fontScale: 'normal' | 'large' | 'xlarge';
  onChangeFontScale: (scale: 'normal' | 'large' | 'xlarge') => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  isHighLegibility: boolean;
  onToggleHighLegibility: () => void;
}

export const CognitiveAccessibilityBar: React.FC<CognitiveAccessibilityBarProps> = ({
  language,
  nodeTitle,
  nodeDescription,
  fontScale,
  onChangeFontScale,
  isFocusMode,
  onToggleFocusMode,
  isHighLegibility,
  onToggleHighLegibility,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCalmModalOpen, setIsCalmModalOpen] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [isBarExpanded, setIsBarExpanded] = useState(false);

  // Speech synthesis for dual-coding cognitive reinforcement (audio + visual)
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${nodeTitle}. ${nodeDescription}`;
    setIsSpeaking(true);
    hablarTexto(textToRead, language, () => {
      setIsSpeaking(false);
    });
  };

  // Stop audio on unmount or node change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [nodeTitle]);

  // Breathing Loop (4-7-8 rhythm) when modal is open
  useEffect(() => {
    if (!isCalmModalOpen) return;

    let timer: NodeJS.Timeout;
    const runCycle = () => {
      // Inhale: 4s
      setBreathingPhase('inhale');
      setBreathingSeconds(4);

      timer = setTimeout(() => {
        // Hold: 7s
        setBreathingPhase('hold');
        setBreathingSeconds(7);

        timer = setTimeout(() => {
          // Exhale: 8s
          setBreathingPhase('exhale');
          setBreathingSeconds(8);

          timer = setTimeout(runCycle, 8000);
        }, 7000);
      }, 4000);
    };

    runCycle();
    return () => clearTimeout(timer);
  }, [isCalmModalOpen]);

  return (
    <>
      {/* Top Ergonomics & Cognitive Care Bar */}
      <aside aria-label="Barra de Ergonomía Cognitiva" className="bg-white/55 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/60 dark:border-white/10 px-4 py-2 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Scientific indicator */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="p-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-semibold hidden sm:inline">
              Ergonomía Cognitiva & Accesibilidad:
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Diseño basado en reducción de sobrecarga mental (Teoría Sweller)
            </span>
          </div>

          {/* Right: Cognitive controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Audio Reader (Dual-coding effect) */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                isSpeaking
                  ? 'bg-orange-500 text-white border-orange-600 shadow-md animate-pulse'
                  : 'glass-pill text-slate-700 dark:text-slate-300 border-white/60 dark:border-white/10 hover:bg-white/80'
              }`}
              title="Escuchar resumen de este módulo en audio para afianzar retención"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-orange-500" />}
              <span>{isSpeaking ? 'Pausar Audio' : 'Lector de Voz'}</span>
            </button>

            {/* Font Scaling (Aa) */}
            <div className="flex items-center glass-pill rounded-xl px-1.5 py-0.5 border border-white/60 dark:border-white/10">
              <Type className="w-3.5 h-3.5 mr-1 text-slate-400 ml-1" />
              <button
                onClick={() => onChangeFontScale('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                  fontScale === 'normal'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Tamaño de letra estándar"
              >
                100%
              </button>
              <button
                onClick={() => onChangeFontScale('large')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                  fontScale === 'large'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Tamaño de letra ampliado (+12%)"
              >
                112%
              </button>
              <button
                onClick={() => onChangeFontScale('xlarge')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                  fontScale === 'xlarge'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Tamaño de letra máxima legibilidad (+25%)"
              >
                125%
              </button>
            </div>

            {/* Focus Mode Toggle (Clutter reduction) */}
            <button
              onClick={onToggleFocusMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                isFocusMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                  : 'glass-pill text-slate-700 dark:text-slate-300 border-white/60 dark:border-white/10 hover:bg-white/80'
              }`}
              title="Atenúa distracciones perimetrales para concentrarte en una sola tarea"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isFocusMode ? 'Modo Enfoque Activo' : 'Modo Enfoque'}</span>
            </button>

            {/* Neuro-Calm Breathing Break Modal Button */}
            <button
              onClick={() => setIsCalmModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold glass-pill text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all shadow-xs"
              title="Pausa anti-estrés: respiración guiada 4-7-8 para reducir ansiedad de trámites y exámenes"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span className="hidden md:inline">Pausa de Calma (4-7-8)</span>
              <span className="md:hidden">Calma</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Breathing 4-7-8 Guided Calm Modal */}
      {isCalmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/70 dark:border-white/15 text-center space-y-6 relative overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setIsCalmModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full glass-card-subtle text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Cerrar pausa de calma"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                Regulación del Sistema Nervioso (Técnica 4-7-8)
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">
                Pausa de Serenidad Cognitiva
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Los trámites de extranjería, entrevistas y exámenes generan tensión. Dedica 1 minuto a sincronizar tu respiración:
              </p>
            </div>

            {/* Breathing Visual Orb */}
            <div className="relative py-6 flex items-center justify-center">
              <div
                className={`rounded-full flex items-center justify-center transition-all duration-[4000ms] shadow-2xl ${
                  breathingPhase === 'inhale'
                    ? 'w-48 h-48 bg-gradient-to-tr from-teal-400 to-emerald-300 text-teal-950 scale-110 shadow-teal-400/40'
                    : breathingPhase === 'hold'
                    ? 'w-48 h-48 bg-gradient-to-tr from-amber-300 to-orange-400 text-amber-950 scale-105 shadow-amber-400/40 duration-[7000ms]'
                    : 'w-40 h-40 bg-gradient-to-tr from-indigo-400 to-sky-300 text-indigo-950 scale-90 shadow-indigo-400/40 duration-[8000ms]'
                }`}
              >
                <div className="text-center p-4">
                  <span className="text-2xl font-black block font-heading uppercase tracking-wide">
                    {breathingPhase === 'inhale' && 'Inhala (4s)'}
                    {breathingPhase === 'hold' && 'Mantén (7s)'}
                    {breathingPhase === 'exhale' && 'Exhala (8s)'}
                  </span>
                  <span className="text-xs font-bold opacity-80">
                    {breathingPhase === 'inhale' && 'Llena tus pulmones de calma'}
                    {breathingPhase === 'hold' && 'Conserva la serenidad interior'}
                    {breathingPhase === 'exhale' && 'Suelta toda la preocupación'}
                  </span>
                </div>
              </div>
            </div>

            {/* Affirmations */}
            <div className="p-3.5 rounded-2xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-semibold flex items-center justify-center gap-1.5 text-orange-600 dark:text-orange-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Afirmación de Seguridad Psicológica</span>
              </p>
              <p className="italic text-[11px]">
                "Estás avanzando paso a paso. Tu experiencia y tu dignidad son valiosas. Tienes derecho a un futuro en paz."
              </p>
            </div>

            <button
              onClick={() => setIsCalmModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              Listo, me siento mejor y quiero continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
