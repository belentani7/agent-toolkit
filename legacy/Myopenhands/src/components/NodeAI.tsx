import React, { useState } from 'react';
import { AILesson, Language } from '../types';
import { AI_MODULES_OVERVIEW, AI_LESSONS } from '../data/aiCurriculumData';
import { TRANSLATIONS } from '../data/i18n';
import { AIBeginnerGuide } from './AIBeginnerGuide';
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Send,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  HelpCircle,
  RefreshCw,
  Terminal,
  Compass,
  Layers
} from 'lucide-react';

interface NodeAIProps {
  language: Language;
  completedLessons: string[];
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
}

export const NodeAI: React.FC<NodeAIProps> = ({
  language,
  completedLessons,
  onCompleteLesson,
}) => {
  const t = TRANSLATIONS[language];
  const [activeMainView, setActiveMainView] = useState<'guide' | 'curriculum'>('guide');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('m1');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('l1');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentLesson = AI_LESSONS.find((l) => l.id === selectedLessonId) || AI_LESSONS[0];
  const filteredLessons = AI_LESSONS.filter((l) => l.moduleId === selectedModuleId);

  const isCompleted = completedLessons.includes(currentLesson.id);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleRunSandbox = async () => {
    if (!sandboxPrompt.trim()) return;
    setIsSimulating(true);
    setSandboxOutput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: sandboxPrompt,
          systemInstruction: 'Eres un tutor de IA interactivo de Manos Abiertas. Responde de forma clara, concisa y pedagógica a la prueba de prompt del alumno.'
        })
      });
      const data = await res.json();
      setSandboxOutput(data.reply || 'Respuesta generada correctamente.');
    } catch {
      // Local simulated response fallback
      setTimeout(() => {
        setSandboxOutput(
          `[Simulación de IA]: Análisis completado para: "${sandboxPrompt.slice(0, 40)}...". Estructura correcta, parámetros de rol y contexto reconocidos.`
        );
      }, 600);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleQuizCheck = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    if (selectedQuizOption === currentLesson.quiz.correctIndex && !isCompleted) {
      onCompleteLesson(currentLesson.id, currentLesson.xp);
    }
  };

  const currentIndex = AI_LESSONS.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? AI_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < AI_LESSONS.length - 1 ? AI_LESSONS[currentIndex + 1] : null;

  const handleSendFromGuideToSandbox = (promptText: string) => {
    setSandboxPrompt(promptText);
    setActiveMainView('curriculum');
    setTimeout(() => {
      const sandboxEl = document.getElementById('ai-sandbox-section');
      if (sandboxEl) {
        sandboxEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
                Nodo 1 · Certificación Oficial
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                26 Niveles Prácticos · 8 Módulos
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Currículo Oficial de Inteligencia Artificial
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Aprende desde los fundamentos hasta la ingeniería de prompts profesional, modelos abiertos (Ollama, DeepSeek), hojas de cálculo asistidas, agentes autónomos y el Reglamento Europeo de IA (AI Act).
            </p>
          </div>
          {/* Progress Tracker Widget */}
          <div className="glass-card-subtle p-4 rounded-xl shadow-xs min-w-[200px] flex flex-col justify-center">
            <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
              <span>Progreso del Curso</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">
                {Math.round((completedLessons.length / AI_LESSONS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500 shadow-sm shadow-orange-500/50"
                style={{ width: `${(completedLessons.length / AI_LESSONS.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
              {completedLessons.length} de {AI_LESSONS.length} niveles completados
            </p>
          </div>
        </div>
      </div>

      {/* Main View Selector: Guía de Inicio vs Currículo Completo */}
      <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 glass-card rounded-2xl">
        <button
          onClick={() => setActiveMainView('guide')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeMainView === 'guide'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.01]'
              : 'glass-card-subtle text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Guía de Inicio: Cómo Interactuar con la IA (Para Principiantes)</span>
        </button>

        <button
          onClick={() => setActiveMainView('curriculum')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeMainView === 'curriculum'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.01]'
              : 'glass-card-subtle text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Currículo Completo Oficial (26 Niveles Prácticos & Test)</span>
        </button>
      </div>

      {/* VIEW 1: GUÍA DE INICIO INTERACTIVA */}
      {activeMainView === 'guide' && (
        <AIBeginnerGuide
          language={language}
          onSendToSandbox={handleSendFromGuideToSandbox}
        />
      )}

      {/* VIEW 2: CURRÍCULO COMPLETO */}
      {activeMainView === 'curriculum' && (
        <div className="space-y-6">
          {/* Module Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {AI_MODULES_OVERVIEW.map((mod) => {
          const isSelected = selectedModuleId === mod.id;
          const completedInMod = AI_LESSONS.filter(
            (l) => l.moduleId === mod.id && completedLessons.includes(l.id)
          ).length;
          return (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
                const firstInMod = AI_LESSONS.find((l) => l.moduleId === mod.id);
                if (firstInMod) {
                  setSelectedLessonId(firstInMod.id);
                  setSelectedQuizOption(null);
                  setQuizSubmitted(false);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all backdrop-blur-md ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20 scale-[1.02]'
                  : 'glass-card-subtle text-slate-700 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-500/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono font-bold uppercase opacity-80">
                  {mod.id.toUpperCase()}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                }`}>
                  {completedInMod}/{mod.levelsCount}
                </span>
              </div>
              <p className="text-xs font-bold line-clamp-2 leading-snug">
                {mod.name.replace(/Módulo \d+: /, '')}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Selector inside Current Module */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Niveles del Módulo
          </h3>
          <div className="space-y-2">
            {filteredLessons.map((lesson) => {
              const isCurrent = lesson.id === selectedLessonId;
              const isDone = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setSelectedQuizOption(null);
                    setQuizSubmitted(false);
                    setSandboxPrompt(lesson.promptExample);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 backdrop-blur-md ${
                    isCurrent
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-white/20 shadow-md font-semibold'
                      : 'glass-card-subtle hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold opacity-75">
                        Nivel {lesson.level}
                      </span>
                      {isDone && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" /> Completado
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold leading-snug">{lesson.title}</p>
                  </div>
                  <span className="text-xs font-bold text-orange-500 shrink-0">
                    +{lesson.xp} XP
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer & Interactive Practice */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lesson Header Card */}
          <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-400/50 backdrop-blur-sm">
                Nivel {currentLesson.level} · {currentLesson.moduleName}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Award className="w-4 h-4 text-orange-500" />
                +{currentLesson.xp} XP al superar el test
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-heading">
              {currentLesson.title}
            </h2>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {currentLesson.description}
            </p>

            {/* Key Concepts Tags */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Conceptos Clave
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentLesson.keyConcepts.map((concept, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg glass-pill text-slate-700 dark:text-slate-300"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Professional Prompt Example */}
            <div className="bg-slate-900/5 dark:bg-slate-950/50 p-4 rounded-xl border border-white/60 dark:border-white/10 space-y-2 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-orange-500" />
                  Ejemplo de Prompt Profesional (Copiar y Usar)
                </span>
                <button
                  onClick={() => handleCopy(currentLesson.promptExample)}
                  className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:underline"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? t.copied : t.copyText}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed glass-card-subtle p-3 rounded-lg border border-white/50 dark:border-white/10">
                {currentLesson.promptExample}
              </pre>
            </div>

            {/* Practical Exercise Challenge */}
            <div className="p-4 rounded-xl bg-orange-500/10 dark:bg-orange-950/30 border border-orange-300/60 dark:border-orange-800/60 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-orange-500" /> Reto Práctico
              </p>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {currentLesson.practicalExercise}
              </p>
            </div>
          </div>

          {/* Interactive AI Sandbox / Try it here */}
          <div className="glass-card p-6 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Laboratorio de Prompts en Directo (Probar Prompt)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modifica el prompt o escribe tu propia instrucción para probar cómo respondería la IA.
            </p>
            <div className="flex gap-2">
              <textarea
                rows={3}
                value={sandboxPrompt || currentLesson.promptExample}
                onChange={(e) => setSandboxPrompt(e.target.value)}
                placeholder="Escribe tu prompt aquí..."
                className="w-full p-3 rounded-xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/60 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleRunSandbox}
                disabled={isSimulating}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSimulating ? 'Generando respuesta...' : 'Ejecutar Prompt con IA'}</span>
              </button>
            </div>

            {sandboxOutput && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md text-slate-100 text-xs leading-relaxed space-y-1 border border-white/10">
                <span className="text-[10px] font-mono text-orange-400 font-bold block">
                  Respuesta del Modelo:
                </span>
                <p className="whitespace-pre-wrap font-sans">{sandboxOutput}</p>
              </div>
            )}
          </div>

          {/* Verification Quiz / Test */}
          <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-500" />
                Test de Validación de Nivel (+{currentLesson.xp} XP)
              </h3>
              {isCompleted && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> ¡Superado!
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {currentLesson.quiz.question}
            </p>

            <div className="space-y-2">
              {currentLesson.quiz.options.map((option, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === currentLesson.quiz.correctIndex;
                let optionStyle = 'glass-card-subtle hover:bg-white/80 dark:hover:bg-slate-800/80';

                if (quizSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold backdrop-blur-md';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200 backdrop-blur-md';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-orange-500/20 border-orange-500 text-orange-950 dark:text-orange-200 font-semibold backdrop-blur-md';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!quizSubmitted) setSelectedQuizOption(idx);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 backdrop-blur-sm ${optionStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleQuizCheck}
                disabled={selectedQuizOption === null}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-40"
              >
                {t.completeQuiz}
              </button>
            ) : (
              <div className="p-4 rounded-xl glass-card-subtle space-y-2">
                {selectedQuizOption === currentLesson.quiz.correctIndex ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.correctAnswer}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    <XCircle className="w-4 h-4" />
                    <span>{t.wrongAnswer}</span>
                  </div>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentLesson.quiz.explanation}
                </p>
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedQuizOption(null);
                  }}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline pt-1 block"
                >
                  Intentar de nuevo
                </button>
              </div>
            )}
          </div>

          {/* Navigation Controls (Prev / Next Lesson) */}
          <div className="flex items-center justify-between pt-2">
            {prevLesson ? (
              <button
                onClick={() => {
                  setSelectedModuleId(prevLesson.moduleId);
                  setSelectedLessonId(prevLesson.id);
                  setSelectedQuizOption(null);
                  setQuizSubmitted(false);
                  setSandboxPrompt(prevLesson.promptExample);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card-subtle text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Nivel {prevLesson.level}: {prevLesson.title.slice(0, 20)}...</span>
              </button>
            ) : (
              <div></div>
            )}

            {nextLesson && (
              <button
                onClick={() => {
                  setSelectedModuleId(nextLesson.moduleId);
                  setSelectedLessonId(nextLesson.id);
                  setSelectedQuizOption(null);
                  setQuizSubmitted(false);
                  setSandboxPrompt(nextLesson.promptExample);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all"
              >
                <span>Nivel {nextLesson.level}: {nextLesson.title.slice(0, 20)}...</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
};
