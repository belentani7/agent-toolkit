import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  Briefcase,
  Award,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Search,
  Building,
  UserCheck
} from 'lucide-react';

interface NodeJobsProps {
  language: Language;
}

export const NodeJobs: React.FC<NodeJobsProps> = () => {
  const [selectedInterviewQuestion, setSelectedInterviewQuestion] = useState<number>(0);
  const [userPracticeAnswer, setUserPracticeAnswer] = useState('');
  const [showTip, setShowTip] = useState(false);

  const portals = [
    {
      name: 'Programa Incorpora (Fundación "la Caixa")',
      desc: 'Red de intermediación laboral para personas en situación o riesgo de exclusión con técnicos de inserción dedicados.',
      url: 'https://www.incorpora.org/',
      tag: 'Inserción Social',
    },
    {
      name: 'Cruz Roja Empleo (Plan de Empleo)',
      desc: 'Orientación laboral gratuita, itinerarios personalizados de inserción, cursos con prácticas en empresas colaboradoras.',
      url: 'https://www2.cruzroja.es/que-hacemos/empleo',
      tag: 'Acompañamiento ONG',
    },
    {
      name: 'Cáritas Empleo y Formación',
      desc: 'Talleres formativos en oficios, agencias de colocación autorizadas y empresas de inserción social en toda España.',
      url: 'https://www.caritas.es/que-hacemos/empleo-y-economia-social/',
      tag: 'Inserción Social',
    },
    {
      name: 'Portal Empléate (Ministerio de Trabajo / SEPE)',
      desc: 'Portal oficial del Estado donde empresas publican vacantes con contratos indefinidos y garantías del Estatuto de los Trabajadores.',
      url: 'https://www.empleate.gob.es/empleo/',
      tag: 'Oficial Estatal',
    },
    {
      name: 'Fundación Secretariado Gitano (Programa Acceder)',
      desc: 'Modelo de referencia europea en formación, empleo e igualdad de trato en el mercado laboral.',
      url: 'https://www.gitanos.org/que-hacemos/areas/empleo/',
      tag: 'Orientación Integral',
    },
  ];

  const interviewSimulator = [
    {
      q: '1. Cuéntame sobre ti y tu experiencia previa en tu país de origen o en España.',
      tip: 'Estructura tu respuesta en 3 partes: quién eres profesionalmente, 2-3 fortalezas clave demostrables con ejemplos, y por qué te interesa específicamente esta empresa. No hables de tu vida personal salvo que refuerce tu compromiso.',
      sampleGood:
        'Soy una persona dinámica y orientada a resultados, con más de 4 años de experiencia en atención al cliente y gestión de inventarios. Me caracterizo por mi puntualidad, rapidez de aprendizaje y capacidad de trabajar bajo presión en equipo.',
    },
    {
      q: '2. ¿Cuál es tu situación legal o disponibilidad horaria para incorporarte?',
      tip: 'Sé honesto y directo. Si tienes permiso de trabajo, indícalo con orgullo ("Tengo NIE y permiso de trabajo en vigor con plena disponibilidad"). Si estás en proceso de arraigo o protección, resalta tu disponibilidad para tramitar la oferta formal.',
      sampleGood:
        'Cuento con permiso de trabajo en regla y disponibilidad inmediata para adaptarme a turnos rotativos, incluidos fines de semana.',
    },
    {
      q: '3. ¿Cómo reaccionas ante una situación de conflicto con un cliente o compañero?',
      tip: 'Usa el método STAR (Situación, Tarea, Acción, Resultado). Muestra que escuchas activamente sin tomarlo de forma personal, buscando siempre la solución más constructiva.',
      sampleGood:
        'Escucho con calma a la persona para entender su inquietud, valido su molestia y propongo inmediatamente una alternativa viable que respete las normas de la empresa.',
    },
    {
      q: '4. ¿Por qué quieres trabajar con nosotros y no en otra empresa?',
      tip: 'Menciona un detalle real de la empresa (sus valores, su expansión, la calidad de su servicio). Demuestra que te has informado antes de la entrevista.',
      sampleGood:
        'He seguido el crecimiento de su empresa y valoro especialmente el ambiente de trabajo en equipo y las oportunidades de estabilidad laboral que ofrecen.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
            Nodo 11 · Inserción Laboral
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Procedimiento Acredita · Red de Empleo Digno · Simulador de Entrevistas
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Empleo Digno, Acreditación & Entrevistas
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          El procedimiento oficial <strong>Acredita</strong> te permite transformar tus años de experiencia laboral y cursos no reglados en un <em>Certificado de Profesionalidad Oficial</em> emitido por el Estado español, sin necesidad de cursar de nuevo los estudios.
        </p>
      </div>

      {/* Procedimiento Acredita Deep-Dive */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-white/40 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              ¿Cómo Funciona el Procedimiento Acredita?
            </h2>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-orange-500/20 text-slate-900 dark:text-slate-100 border border-orange-400/40">
            Abierto de forma permanente
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Si has trabajado en tu país de origen o en España (como cocinero, electricista, auxiliar de enfermería, conductor, dependiente, fontanero, camarero, etc.) durante al menos <strong>2 o 3 años</strong> (o 2.000 horas), puedes solicitar la evaluación de tus competencias profesionales. El proceso cuenta con 3 fases oficiales:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-1.5">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
              FASE 1
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Asesoramiento Personalizado
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Un asesor oficial revisa tu historial de vida laboral, contratos, cartas de recomendación o certificados y elabora un informe orientativo gratuito.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-1.5">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
              FASE 2
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Evaluación de Competencias
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Una comisión técnica evalúa tus habilidades mediante entrevista profesional y observación directa o simulación de tareas del oficio.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-1.5">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
              FASE 3
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Acreditación y Título Oficial
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Recibes una certificación oficial expedida por el Ministerio de Educación y Formación Profesional con validez en toda la Unión Europea.
            </p>
          </div>
        </div>
      </div>

      {/* Portales de Empleo Verificados */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Building className="w-4 h-4 text-orange-500" />
          Portales & Agencias de Colocación Verificadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portals.map((p, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg glass-pill text-slate-700 dark:text-slate-300">
                  {p.tag}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{p.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline pt-2 border-t border-white/40 dark:border-white/10"
              >
                <span>Acceder a Ofertas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Simulator Interactive Playground */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Simulador Interactivo de Preguntas de Entrevista Laboral
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Practica tus respuestas frente al seleccionador. Recibe consejos sobre qué destacar y qué evitar.
        </p>

        {/* Question Selector */}
        <div className="flex flex-wrap gap-2">
          {interviewSimulator.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedInterviewQuestion(idx);
                setShowTip(false);
                setUserPracticeAnswer('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedInterviewQuestion === idx
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'glass-pill text-slate-700 dark:text-slate-300 hover:bg-white/60'
              }`}
            >
              Pregunta #{idx + 1}
            </button>
          ))}
        </div>

        {/* Active Question Box */}
        <div className="p-4 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-3">
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            {interviewSimulator[selectedInterviewQuestion].q}
          </p>

          <textarea
            rows={3}
            value={userPracticeAnswer}
            onChange={(e) => setUserPracticeAnswer(e.target.value)}
            placeholder="Escribe cómo responderías a esta pregunta en una entrevista real..."
            className="w-full p-3 rounded-xl border border-white/60 dark:border-white/10 glass-card text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTip(!showTip)}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showTip ? 'Ocultar Consejo' : 'Ver Consejo y Respuesta Modelo'}</span>
            </button>
          </div>

          {showTip && (
            <div className="p-4 rounded-xl glass-card border border-orange-200/50 dark:border-orange-900/50 space-y-2 text-xs">
              <p className="text-slate-900 dark:text-slate-100 font-semibold">
                💡 <strong>Consejo del seleccionador:</strong>{' '}
                {interviewSimulator[selectedInterviewQuestion].tip}
              </p>
              <div className="p-3 rounded-lg glass-card-subtle border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-200">
                <span className="font-bold text-[11px] block text-slate-500 dark:text-slate-400 mb-0.5">
                  Ejemplo de respuesta recomendada:
                </span>
                <p className="italic">
                  "{interviewSimulator[selectedInterviewQuestion].sampleGood}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
