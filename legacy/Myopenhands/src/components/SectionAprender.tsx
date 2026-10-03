import React, { useState } from 'react';
import { Language, UserProgress, EducationLevel, EducationAreaId, EducationLesson } from '../types';
import { EDUCATION_AREAS, EDUCATION_COURSES } from '../data/educationData';
import { TRANSLATIONS } from '../data/i18n';
import {
  BookOpen,
  CheckCircle,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Monitor,
  Smartphone,
  ShieldCheck,
  Code,
  FileSpreadsheet,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SectionAprenderProps {
  language: Language;
  progress: UserProgress;
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
  onSelectNode: (nodeId: any) => void;
}

export const SectionAprender: React.FC<SectionAprenderProps> = ({
  language,
  progress,
  onCompleteLesson,
  onSelectNode,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedArea, setSelectedArea] = useState<EducationAreaId>('alfabetizacion-digital');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | 'all'>('all');
  const [activeLesson, setActiveLesson] = useState<EducationLesson | null>(
    EDUCATION_COURSES[0].modules[0].lessons[0]
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const filteredCourses = EDUCATION_COURSES.filter((course) => {
    const matchesArea = course.areaId === selectedArea;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesArea && matchesLevel;
  });

  const handleSelectLesson = (lesson: EducationLesson) => {
    setActiveLesson(lesson);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !activeLesson) return;
    setQuizSubmitted(true);
    if (selectedAnswer === activeLesson.exercise.correctIndex) {
      if (!progress.completedLessons.includes(activeLesson.id)) {
        onCompleteLesson(activeLesson.id, activeLesson.xp);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Currículo Educativo Estructurado & Extensible</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Centro de Aprendizaje & Habilidades
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Formación estructurada por niveles (inicial a avanzado) para el trabajo y la autonomía digital.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectNode('ai-curriculum')}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Currículo de IA (26 Niveles)</span>
            </button>
            <button
              onClick={() => onSelectNode('open-academy')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Academia Harvard & MOOCs</span>
            </button>
          </div>
        </div>

        {/* Level Filter Tabs */}
        <div className="pt-4 border-t border-white/40 dark:border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">Filtrar por Nivel:</span>
          {(['all', 'inicial', 'basico', 'intermedio', 'avanzado'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                selectedLevel === lvl
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white'
              }`}
            >
              {lvl === 'all' ? 'Todos los Niveles' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Area Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {EDUCATION_AREAS.map((area) => {
          const isSelected = selectedArea === area.id;
          return (
            <button
              key={area.id}
              onClick={() => {
                setSelectedArea(area.id);
                // Switch default active lesson to first available in area if exists
                const firstCourse = EDUCATION_COURSES.find((c) => c.areaId === area.id);
                if (firstCourse && firstCourse.modules[0]?.lessons[0]) {
                  setActiveLesson(firstCourse.modules[0].lessons[0]);
                  setSelectedAnswer(null);
                  setQuizSubmitted(false);
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-32 ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'glass-card border-white/60 dark:border-white/10 hover:border-orange-500/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                isSelected ? 'bg-white/20 text-white' : 'bg-orange-500/10 text-orange-600'
              }`}>
                {area.id === 'alfabetizacion-digital' && <Smartphone className="w-4 h-4" />}
                {area.id === 'informatica' && <FileSpreadsheet className="w-4 h-4" />}
                {area.id === 'ia' && <Sparkles className="w-4 h-4" />}
                {area.id === 'ciberseguridad' && <ShieldCheck className="w-4 h-4" />}
                {area.id === 'web' && <Code className="w-4 h-4" />}
                {area.id === 'empleabilidad' && <Briefcase className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-xs font-bold leading-snug line-clamp-2">
                  {area.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Educational Workspace: Course Navigation & Interactive Lesson */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Modules & Lessons Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-5 rounded-2xl shadow-sm border border-white/60 dark:border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Módulos & Lecciones</span>
            </h3>

            {filteredCourses.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No hay cursos disponibles para este nivel en el área seleccionada.
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div key={course.id} className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/70">
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      {course.badge}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {course.title}
                    </h4>
                  </div>

                  {course.modules.map((mod) => (
                    <div key={mod.id} className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] font-bold text-slate-500">
                        {mod.title}
                      </p>
                      {mod.lessons.map((les) => {
                        const isCompleted = progress.completedLessons.includes(les.id);
                        const isCurrent = activeLesson?.id === les.id;

                        return (
                          <button
                            key={les.id}
                            onClick={() => handleSelectLesson(les)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 ${
                              isCurrent
                                ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isCompleted ? (
                                <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-emerald-500'}`} />
                              ) : (
                                <div className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600'}`} />
                              )}
                              <span className="truncate">{les.title}</span>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                              isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              +{les.xp} XP
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Interactive Lesson Content & Quiz */}
        <div className="lg:col-span-8 space-y-6">
          {activeLesson ? (
            <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-6">
              {/* Lesson Header */}
              <div className="space-y-2 pb-4 border-b border-white/40 dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 capitalize">
                    Nivel {activeLesson.level}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {activeLesson.durationMinutes} min
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Award className="w-3.5 h-3.5" />
                      +{activeLesson.xp} XP
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-heading">
                  {activeLesson.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Lesson Body Content */}
              <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-white/40 dark:border-white/10">
                {activeLesson.content}
              </div>

              {/* Key Takeaways */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ideas Clave para Recordar
                </h3>
                <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-100">
                  {activeLesson.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Official Resources */}
              {activeLesson.resources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Recursos y Enlaces Oficiales:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeLesson.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-orange-600 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{res.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Exercise / Quiz */}
              <div className="pt-6 border-t border-white/40 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Ejercicio Práctico de Validación
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {activeLesson.exercise.question}
                </p>

                <div className="space-y-2">
                  {activeLesson.exercise.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    let optionClasses = 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800';

                    if (quizSubmitted) {
                      if (idx === activeLesson.exercise.correctIndex) {
                        optionClasses = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isSelected) {
                        optionClasses = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200';
                      }
                    } else if (isSelected) {
                      optionClasses = 'border-orange-500 bg-orange-500/10 text-orange-900 dark:text-orange-200 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-3 ${optionClasses}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleAnswerSubmit}
                    className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Verificar Respuesta</span>
                  </button>
                ) : (
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    selectedAnswer === activeLesson.exercise.correctIndex
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
                  }`}>
                    <div className="font-bold flex items-center gap-2">
                      {selectedAnswer === activeLesson.exercise.correctIndex ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>¡Correcto! Has ganado +{activeLesson.xp} XP para tu Pasaporte Digital.</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-rose-600" />
                          <span>Respuesta incorrecta. Revisa la explicación a continuación:</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed">
                      {activeLesson.exercise.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl text-center text-slate-500">
              Selecciona una lección del menú lateral para comenzar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
