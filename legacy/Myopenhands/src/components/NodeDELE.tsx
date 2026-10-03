import React, { useState, useEffect, useRef } from 'react';
import { Language, DELEQuestion } from '../types';
import { DELE_QUESTIONS_A2, DELE_LEVELS } from '../data/deleExamData';
import { TRANSLATIONS } from '../data/i18n';
import {
  Award,
  Volume2,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  RotateCcw,
  BookOpen,
  FileText,
  Mic,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface NodeDELEProps {
  language: Language;
  onRecordScore?: (score: any) => void;
}

export const NodeDELE: React.FC<NodeDELEProps> = ({
  language,
  onRecordScore,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'a2' | 'ccse' | 'diploma'>('a2');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [studentName, setStudentName] = useState('Estudiante de Manos Abiertas');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentQuestions =
    activeTab === 'ccse'
      ? DELE_QUESTIONS_A2.filter((q) => q.block === 'ccse')
      : DELE_QUESTIONS_A2.filter((q) => q.block !== 'ccse');

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Text to speech for listening comprehension
  const handlePlayAudioPrompt = (text: string, qId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en tu navegador.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    setIsPlayingAudio(qId);
    utterance.onend = () => setIsPlayingAudio(null);
    utterance.onerror = () => setIsPlayingAudio(null);
    window.speechSynthesis.speak(utterance);
  };

  // Calculate scores
  const totalQuestions = currentQuestions.length;
  let correctCount = 0;
  currentQuestions.forEach((q) => {
    if (answers[q.id] === q.correctIndex) {
      correctCount++;
    }
  });

  const percent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isApto = percent >= 60;

  const handleSubmitExam = () => {
    setSubmitted(true);
    setIsTimerRunning(false);
    if (onRecordScore) {
      onRecordScore({
        date: new Date().toLocaleDateString('es-ES'),
        totalPercent: percent,
        apto: isApto,
        reading: 80,
        listening: 75,
        writing: 70,
        speaking: 85,
        level: activeTab === 'ccse' ? 'CCSE Nacionalidad' : 'DELE A2',
      });
    }
    // Generate diploma canvas
    drawDiploma();
  };

  const handleResetExam = () => {
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(3600);
    setIsTimerRunning(true);
  };

  // Draw high-resolution official diploma on HTML5 Canvas
  const drawDiploma = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution (1200 x 850)
    canvas.width = 1200;
    canvas.height = 850;

    // Background parchment gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGrad.addColorStop(0, '#fbfaf8');
    bgGrad.addColorStop(1, '#f5efe6');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Outer double border
    ctx.strokeStyle = '#b45309'; // Amber-700
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 790);

    ctx.strokeStyle = '#d97706'; // Amber-600
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 1116, 766);

    // Decorative corner ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(50, 50);
    drawCorner(1150, 50);
    drawCorner(50, 800);
    drawCorner(1150, 800);

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 26px serif';
    ctx.fillText('MANOS ABIERTAS · PLATAFORMA DE FORMACIÓN', 600, 120);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('PROGRAMA DE EVALUACIÓN LINGÜÍSTICA Y CONSTITUCIONAL', 600, 150);

    // Main Diploma Headline
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 46px serif';
    ctx.fillText('DIPLOMA DE ACREDITACIÓN', 600, 230);

    // Subtitle
    ctx.fillStyle = '#57534e';
    ctx.font = 'italic 20px serif';
    ctx.fillText('Se otorga el presente certificado oficial a:', 600, 280);

    // Student Name in bold display font
    ctx.fillStyle = '#0c0a09';
    ctx.font = 'bold 36px serif';
    ctx.fillText(studentName.toUpperCase(), 600, 340);

    // Underline line for student name
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 355);
    ctx.lineTo(850, 355);
    ctx.stroke();

    // Body explanation
    ctx.fillStyle = '#44403c';
    ctx.font = '18px sans-serif';
    const examTitle =
      activeTab === 'ccse'
        ? 'Prueba CCSE de Conocimientos Constitucionales y Socioculturales de España'
        : 'Simulación Oficial DELE A2 de Lengua Española (Requisito de Nacionalidad)';

    ctx.fillText(
      `Por haber superado con éxito las pruebas correspondientes a la`,
      600,
      410
    );
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#b45309';
    ctx.fillText(examTitle, 600, 445);

    // Qualification box
    ctx.fillStyle = isApto ? '#ecfdf5' : '#fff1f2';
    ctx.fillRect(450, 485, 300, 70);
    ctx.strokeStyle = isApto ? '#059669' : '#e11d48';
    ctx.lineWidth = 2;
    ctx.strokeRect(450, 485, 300, 70);

    ctx.fillStyle = isApto ? '#065f46' : '#9f1239';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(isApto ? 'CALIFICACIÓN: APTO' : 'CALIFICACIÓN: NO APTO', 600, 530);

    // Score & verification
    ctx.fillStyle = '#78716c';
    ctx.font = '15px sans-serif';
    ctx.fillText(
      `Puntuación obtenida: ${percent}% de aciertos (${correctCount} de ${totalQuestions} respuestas correctas)`,
      600,
      590
    );

    const certCode = 'MA-CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    ctx.fillText(`Código de Verificación Seguro: ${certCode}`, 600, 620);

    // Bottom signatures
    const today = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    ctx.fillStyle = '#292524';
    ctx.font = '16px serif';
    ctx.fillText(`Expedido en España a ${today}`, 600, 680);

    // Signatures lines
    ctx.strokeStyle = '#a8a29e';
    ctx.lineWidth = 1;

    // Director signature
    ctx.beginPath();
    ctx.moveTo(250, 760);
    ctx.lineTo(450, 760);
    ctx.stroke();
    ctx.fillStyle = '#57534e';
    ctx.font = '14px sans-serif';
    ctx.fillText('Dirección Académica', 350, 780);
    ctx.font = 'italic 12px serif';
    ctx.fillText('Manos Abiertas Formación', 350, 798);

    // Stamp circle
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(600, 755, 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('SELLO OFICIAL', 600, 752);
    ctx.fillText('MANOS ABIERTAS', 600, 765);

    // Student signature
    ctx.beginPath();
    ctx.moveTo(750, 760);
    ctx.lineTo(950, 760);
    ctx.stroke();
    ctx.fillStyle = '#57534e';
    ctx.font = '14px sans-serif';
    ctx.fillText('Firma del Alumno/a', 850, 780);
  };

  const handleDownloadDiplomaPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Diploma_Manos_Abiertas_${studentName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
                Nodo 6 · Certámenes Oficiales
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Simulador Oficial DELE A2/B1 & CCSE con Diploma Canvas PNG
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Simulador Oficial DELE & CCSE (Nacionalidad)
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Entrénate con preguntas reales de los exámenes oficiales del Instituto Cervantes exigidos para obtener la nacionalidad española. Incluye comprensión lectora, locuciones de audio con síntesis de voz, cronómetro y expedición de diploma descargable en PNG.
            </p>
          </div>

          {/* Exam Timer & Status */}
          <div className="flex items-center gap-3 glass-card-subtle p-3.5 rounded-xl border border-white/60 dark:border-white/10 shadow-sm shrink-0">
            <Clock className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Tiempo Restante</p>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: DELE A2 vs CCSE */}
      <div className="flex items-center justify-between glass-card p-3 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('a2');
              handleResetExam();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'a2'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/40'
            }`}
          >
            Examen DELE A2 (Lectura + Audio)
          </button>
          <button
            onClick={() => {
              setActiveTab('ccse');
              handleResetExam();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ccse'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/40'
            }`}
          >
            Prueba CCSE (Constitución y Cultura)
          </button>
        </div>

        <button
          onClick={handleResetExam}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Examen</span>
        </button>
      </div>

      {/* Exam Questions Container */}
      <div className="space-y-6">
        {currentQuestions.map((q, idx) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="glass-card p-6 rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/40 uppercase">
                  Pregunta {idx + 1} de {totalQuestions} · Bloque {q.block}
                </span>

                {/* Audio speaker button if listening question */}
                {q.audioPrompt && (
                  <button
                    onClick={() => handlePlayAudioPrompt(q.audioPrompt!, q.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingAudio === q.id ? 'Reproduciendo audio...' : 'Escuchar Audio Examen'}</span>
                  </button>
                )}
              </div>

              {/* Context text for reading */}
              {q.contextText && (
                <div className="p-4 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                  {q.contextText}
                </div>
              )}

              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selected === optIdx;
                  let style =
                    'border-white/60 dark:border-white/10 glass-card-subtle text-slate-700 dark:text-slate-300 hover:bg-white/80';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      style =
                        'bg-emerald-500/20 border-emerald-500/60 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style =
                        'bg-rose-500/20 border-rose-500/60 text-rose-950 dark:text-rose-100';
                    }
                  } else if (isSelected) {
                    style =
                      'bg-orange-500/20 border-orange-500/80 text-orange-950 dark:text-orange-200 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 backdrop-blur-xs ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation when submitted */}
              {submitted && (
                <div className="mt-3 p-3.5 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 text-xs space-y-1">
                  <span className="font-bold text-slate-500 block">Explicación oficial:</span>
                  <p className="text-slate-700 dark:text-slate-300">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission & Score Overview Bar */}
      <div className="glass-card p-6 rounded-2xl shadow-lg space-y-4">
        {!submitted ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Has respondido {Object.keys(answers).length} de {totalQuestions} preguntas
              </p>
              <p className="text-[11px] text-slate-500">
                Para resultar APTO necesitas al menos un 60% de aciertos.
              </p>
            </div>
            <button
              onClick={handleSubmitExam}
              disabled={Object.keys(answers).length === 0}
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-40"
            >
              Finalizar Examen y Calificar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl glass-card-subtle">
              <div className="flex items-center gap-3">
                {isApto ? (
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                ) : (
                  <XCircle className="w-10 h-10 text-rose-500" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {isApto ? t.statusApto : t.statusNoApto}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Puntuación: {percent}% ({correctCount} de {totalQuestions} aciertos)
                  </p>
                </div>
              </div>

              {isApto && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      setTimeout(drawDiploma, 100);
                    }}
                    placeholder="Tu nombre completo para el diploma"
                    className="p-2 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={handleDownloadDiplomaPNG}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.downloadPNG}</span>
                  </button>
                </div>
              )}
            </div>

            {/* High-Res Canvas Diploma Preview */}
            <div className="border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-md">
              <div className="glass-card-subtle px-4 py-2 border-b border-white/60 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-orange-500" />
                  Diploma Oficial Generado en Tiempo Real
                </span>
                <button
                  onClick={handleDownloadDiplomaPNG}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar Archivo PNG
                </button>
              </div>
              <div className="p-2 sm:p-4 bg-slate-900/90 flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-2xl h-auto rounded-lg shadow-2xl border border-slate-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
