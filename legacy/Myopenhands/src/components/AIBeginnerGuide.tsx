import React, { useState } from 'react';
import { Language } from '../types';
import {
  Sparkles,
  BookOpen,
  Send,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  ArrowRight,
  MessageSquare,
  Compass,
  Layers,
  FileText,
  ThumbsUp,
  RefreshCw,
  Eye
} from 'lucide-react';

interface AIBeginnerGuideProps {
  language: Language;
  onSendToSandbox?: (promptText: string) => void;
}

export const AIBeginnerGuide: React.FC<AIBeginnerGuideProps> = ({
  language,
  onSendToSandbox,
}) => {
  const [activeTab, setActiveTab] = useState<'formula' | 'comparativa' | 'constructor' | 'afinador' | 'seguridad' | 'ejemplos'>('formula');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Interactive Prompt Builder State
  const [builderRol, setBuilderRol] = useState('un orientador laboral especializado en el mercado de trabajo en España');
  const [builderContexto, setBuilderContexto] = useState('tengo 4 años de experiencia en hostelería y comercio en mi país, y busco mi primer empleo formal con NIE en Madrid');
  const [builderTarea, setBuilderTarea] = useState('redactar una breve carta de presentación profesional de 3 párrafos destacando puntualidad, trato al público y capacidad de aprendizaje rápido');
  const [builderFormato, setBuilderFormato] = useState('tono educado, español formal y claro, listo para enviar en un correo');
  const [builderPreviewOutput, setBuilderPreviewOutput] = useState<string | null>(null);
  const [isSimulatingBuilder, setIsSimulatingBuilder] = useState(false);

  // Interactive Refinement State
  const [refinementOriginal, setRefinementOriginal] = useState(
    'En virtud del Real Decreto 19/2017, las entidades bancarias están compelidas a proveer una cuenta de pago básica a cualquier usuario en territorio de la Unión, independientemente de su situación regular, con una tarifa mensual tasada.'
  );
  const [refinementModifier, setRefinementModifier] = useState<'normal' | 'sencillo' | 'ejemplo' | 'resumen'>('normal');

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Build full prompt string
  const fullConstructedPrompt = `Actúa como ${builderRol}. Mi situación es la siguiente: ${builderContexto}. Tu tarea es: ${builderTarea}. Por favor, entrégame el resultado en este formato: ${builderFormato}.`;

  const handleSimulateBuilder = () => {
    setIsSimulatingBuilder(true);
    setBuilderPreviewOutput(null);
    setTimeout(() => {
      setBuilderPreviewOutput(
        `Estimado/a responsable de selección:\n\nLe escribo con entusiasmo para presentar mi candidatura a las vacantes de dependiente/a o atención al público en su empresa. Cuento con más de cuatro años de experiencia contrastada en atención al cliente, manejo de cobros y organización en tienda, además de disponer de autorización de residencia y trabajo en vigor.\n\nMe caracterizo por mi puntualidad estricta, alta capacidad de aprendizaje y una actitud positiva orientada a resolver las necesidades de cada cliente de forma empática y eficiente. Me adapto con rapidez a turnos rotativos y al trabajo dinámico en equipo.\n\nEstaría muy agradecido/a de poder mantener una entrevista para detallar cómo mi experiencia y dedicación pueden aportar valor inmediato a su equipo. Agradeciendo de antemano su tiempo, le saluda cordialmente.\n\n[Tu Nombre Completo]\nTeléfono: [Tu Teléfono] | Email: [Tu Correo]`
      );
      setIsSimulatingBuilder(false);
    }, 700);
  };

  const getRefinedText = () => {
    switch (refinementModifier) {
      case 'sencillo':
        return '👉 En palabras muy claras: Por ley, cualquier banco en España tiene que abrirte una cuenta básica aunque no tengas papeles de residencia. Solo necesitas tu pasaporte original y cuesta como máximo 3 euros al mes (o es gratis si no tienes ingresos).';
      case 'ejemplo':
        return '👉 Ejemplo real: Vas a una oficina bancaria con tu pasaporte de tu país de origen. Solicitas por escrito la "Cuenta de Pago Básica según el Real Decreto 19/2017". El banco no puede rechazarte diciendo "aquí solo atendemos con DNI".';
      case 'resumen':
        return '👉 Resumen en 1 línea: Tienes derecho legal a una cuenta bancaria básica en España usando solo tu pasaporte.';
      default:
        return refinementOriginal;
    }
  };

  const readyToUseExamples = [
    {
      id: 'ex-1',
      title: 'Pedir cita formal con Trabajador/a Social',
      category: 'Servicios Sociales',
      prompt:
        'Actúa como un redactor administrativo formal. Mi situación: Vivo en el distrito de Usera (Madrid) y necesito solicitar una cita con los servicios sociales para tramitar el informe de inserción social y empadronamiento. Redacta una solicitud educada de 150 palabras solicitando día y hora, adjuntando mis datos de contacto.',
    },
    {
      id: 'ex-2',
      title: 'Simular preguntas de entrevista de trabajo',
      category: 'Empleo & Trabajo',
      prompt:
        'Actúa como un seleccionador de personal de un supermercado en España. Hazme una primera pregunta típica de entrevista de trabajo para el puesto de reposición y caja. Espera a que yo responda para darme consejos constructivos de mejora según el método STAR.',
    },
    {
      id: 'ex-3',
      title: 'Explicar contrato de alquiler sin trampas',
      category: 'Vivienda',
      prompt:
        'Actúa como un asesor en derechos de los inquilinos en España. Te voy a copiar una cláusula de un contrato de alquiler de habitación. Explícame en lenguaje muy sencillo qué significa, si es legal según la Ley de Arrendamientos Urbanos (LAU) y si me conviene firmarla.',
    },
    {
      id: 'ex-4',
      title: 'Practicar español oral para examen DELE A2',
      category: 'Español & DELE',
      prompt:
        'Actúa como un examinador oficial del Instituto Cervantes para la prueba oral del DELE A2. Salúdame brevemente y pídeme que me describa a mí mismo y a mi familia, corrigiéndome con amabilidad los errores gramaticales o de vocabulario.',
    },
    {
      id: 'ex-5',
      title: 'Planificar compras semanales con presupuesto limitado',
      category: 'Economía Doméstica',
      prompt:
        'Actúa como un nutricionista y experto en ahorro familiar. Mi presupuesto semanal para alimentación es de 45 euros para 2 personas en España. Elabora un menú equilibrado de lunes a domingo y la lista exacta de ingredientes para comprar en supermercados habituales.',
    },
    {
      id: 'ex-6',
      title: 'Reclamar cobro indebido de telefonía o suministros',
      category: 'Derechos del Consumidor',
      prompt:
        'Actúa como un experto en consumo. Me han cobrado 35 euros de más en la factura de la luz sin explicación. Redacta una carta de reclamación formal citando la Ley General para la Defensa de los Consumidores y Usuarios solicitando la devolución inmediata a mi cuenta.',
    },
  ];

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-6">
      {/* Header of Guide */}
      <div className="border-b border-white/40 dark:border-white/10 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-400/40 text-slate-900 dark:text-slate-100 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Guía de Inicio Rápido · Para Principiantes</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Cómo Hablar e Interactuar con una Inteligencia Artificial
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
          La IA no es un buscador de Google ni una máquina mágica: funciona como un colega de trabajo inteligente pero distraído que necesita <strong>contexto claro, un objetivo concreto y un rol definido</strong> para darte la respuesta perfecta.
        </p>

        {/* Navigation Tabs inside Guide */}
        <div className="flex flex-wrap gap-1.5 pt-4">
          {[
            { id: 'formula', label: '1. La Fórmula del Prompt (RCTF)', icon: BookOpen },
            { id: 'comparativa', label: '2. Prompt Malo vs Excelente', icon: ThumbsUp },
            { id: 'constructor', label: '3. Constructor Interactivo', icon: Layers },
            { id: 'afinador', label: '4. Cómo Afinar Respuestas', icon: RefreshCw },
            { id: 'seguridad', label: '5. Seguridad & Privacidad', icon: ShieldCheck },
            { id: 'ejemplos', label: '6. Prompts Listos para Usar', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'glass-card-subtle text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: LA FÓRMULA RCTF */}
      {activeTab === 'formula' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-300/40 dark:border-orange-700/40 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-orange-500" />
              La Regla de Oro: Método R-C-T-F
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Si recuerdas estas 4 letras antes de pulsar enviar, obtendrás respuestas 10 veces más útiles que el 90% de los usuarios:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                R
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">ROL (¿Quién es?)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Dile qué sombrero ponerse: <em>"Actúa como un abogado de extranjería"</em> o <em>"Actúa como un profesor de español paciente"</em>.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                C
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">CONTEXTO (¿Cuál es tu situación?)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Dale los datos clave sin compartir secretos: <em>"Llevo 2 años viviendo en Valencia y no tengo contrato formal todavía"</em>.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                T
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">TAREA (¿Qué debe hacer?)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Usa verbos de acción precisos: <em>"Redacta una carta"</em>, <em>"Explica en 3 pasos"</em>, <em>"Compara estas dos opciones"</em>.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                F
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">FORMATO (¿Cómo lo quieres?)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Indica la forma del resultado: <em>"En una tabla con 2 columnas"</em>, <em>"En viñetas cortas"</em> o <em>"En lenguaje muy simple"</em>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/60 border border-white/60 dark:border-white/10 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-slate-700 dark:text-slate-300">
              ¿Quieres probar esta fórmula ahora mismo con un generador automático?
            </p>
            <button
              onClick={() => setActiveTab('constructor')}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Abrir Constructor Interactivo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PROMPT MALO VS EXCELENTE */}
      {activeTab === 'comparativa' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Compara cómo cambia radicalmente la calidad de la respuesta según la precisión de tu instrucción:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bad Prompt Card */}
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-300/60 dark:border-rose-800/60 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 text-xs font-black uppercase">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Prompt Pobre (Vago y sin contexto)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 font-mono text-xs text-slate-900 dark:text-slate-100 border border-rose-200 dark:border-rose-900">
                "Dime cosas del arraigo en España."
              </div>
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-slate-100">¿Por qué falla?</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>No indica qué tipo de arraigo (hay 4: social, sociolaboral, formación, familiar).</li>
                  <li>No menciona el tiempo que lleva en España ni su situación.</li>
                  <li>La IA dará un texto genérico de 5 páginas aburrido y poco útil.</li>
                </ul>
              </div>
            </div>

            {/* Good Prompt Card */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-300/60 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 text-xs font-black uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prompt Excelente (Estructurado RCTF)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 font-mono text-xs text-slate-900 dark:text-slate-100 border border-emerald-200 dark:border-emerald-900">
                "Actúa como asesor de extranjería. Llevo 2 años seguidos empadronado en Madrid y una empresa de limpieza me ofrece un contrato de 30 horas semanales. Explícame en 3 viñetas si puedo pedir el Arraigo Sociolaboral y qué 4 documentos me exigirá la oficina de extranjería."
              </div>
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-bold text-emerald-800 dark:text-emerald-200">¿Por qué triunfa?</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Define el rol exacto (asesor).</li>
                  <li>Aporta datos concretos (2 años, Madrid, 30 horas, limpieza).</li>
                  <li>Exige un formato preciso (3 viñetas + 4 documentos).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONSTRUCTOR INTERACTIVO DE PROMPTS */}
      {activeTab === 'constructor' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-300/40 space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              Generador Asistido de Prompts Paso a Paso
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Personaliza cada bloque. El resultado final se generará abajo listo para copiar o probar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Rol */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>¿Quién debe ser la IA? (Rol)</span>
              </label>
              <select
                value={builderRol}
                onChange={(e) => setBuilderRol(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              >
                <option value="un orientador laboral especializado en el mercado de trabajo en España">Orientador Laboral (CV y Empleo en España)</option>
                <option value="un abogado especializado en extranjería y regularización">Abogado de Extranjería (Leyes y Arraigos)</option>
                <option value="un profesor paciente de español que explica con ejemplos sencillos">Profesor de Español (Vocabulario y DELE)</option>
                <option value="un mediador social en centros de salud y ayuntamientos">Mediador Social (Padrón y Sanidad Pública)</option>
                <option value="un asesor financiero para presupuestos familiares y cuentas bancarias">Asesor Financiero (Ahorro y Bancos)</option>
              </select>
            </div>

            {/* 2. Contexto */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>¿Cuál es tu situación? (Contexto)</span>
              </label>
              <input
                type="text"
                value={builderContexto}
                onChange={(e) => setBuilderContexto(e.target.value)}
                placeholder="Ej: Llevo 1 año en España, busco empleo..."
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* 3. Tarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                <span>¿Qué tarea exacta quieres que realice?</span>
              </label>
              <input
                type="text"
                value={builderTarea}
                onChange={(e) => setBuilderTarea(e.target.value)}
                placeholder="Ej: Redactar una carta formal, explicar los pasos..."
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* 4. Formato */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                <span>¿En qué formato lo quieres?</span>
              </label>
              <select
                value={builderFormato}
                onChange={(e) => setBuilderFormato(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              >
                <option value="tono educado, español formal y claro, listo para enviar en un correo">Carta / Correo formal listo para copiar</option>
                <option value="lista de 4 pasos numerados y explicados sin tecnicismos">Lista ordenada paso a paso (1, 2, 3)</option>
                <option value="en una tabla comparativa con ventajas y requisitos">Tabla comparativa</option>
                <option value="en un solo párrafo breve y contundente">Resumen ultra-corto en 1 párrafo</option>
              </select>
            </div>
          </div>

          {/* Generated Result Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 space-y-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-orange-400">
                Tu Prompt Resultante:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(fullConstructedPrompt, 'builder')}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1 transition-colors text-white"
                >
                  {copiedKey === 'builder' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'builder' ? 'Copiado' : 'Copiar'}</span>
                </button>
                {onSendToSandbox && (
                  <button
                    onClick={() => onSendToSandbox(fullConstructedPrompt)}
                    className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-bold flex items-center gap-1 transition-colors text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Llevar al Laboratorio</span>
                  </button>
                )}
                <button
                  onClick={handleSimulateBuilder}
                  disabled={isSimulatingBuilder}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors text-white disabled:opacity-50"
                >
                  {isSimulatingBuilder ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Simular Respuesta</span>
                </button>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
              {fullConstructedPrompt}
            </p>

            {builderPreviewOutput && (
              <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/40 text-xs text-slate-200 space-y-1.5 animate-in fade-in">
                <span className="text-[11px] font-bold text-emerald-400 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resultado de la Simulación con IA:
                </span>
                <p className="whitespace-pre-wrap font-sans text-slate-100 leading-relaxed">
                  {builderPreviewOutput}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CÓMO AFINAR Y REPREGUNTAR */}
      {activeTab === 'afinador' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-300/40 space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-500" />
              El Diálogo: ¡Nunca te quedes con la primera respuesta!
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              La IA aprende de la conversación. Si te responde con palabras difíciles o muy largo, puedes ordenarle que lo cambie con un solo clic:
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Prueba estos 3 botones de refinamiento sobre este texto jurídico difícil:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRefinementModifier('sencillo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  refinementModifier === 'sencillo'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'glass-card-subtle text-slate-800 dark:text-slate-200 hover:bg-white/80'
                }`}
              >
                "Explícalo más sencillo sin tecnicismos"
              </button>
              <button
                onClick={() => setRefinementModifier('ejemplo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  refinementModifier === 'ejemplo'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'glass-card-subtle text-slate-800 dark:text-slate-200 hover:bg-white/80'
                }`}
              >
                "Ponme un ejemplo de la vida real"
              </button>
              <button
                onClick={() => setRefinementModifier('resumen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  refinementModifier === 'resumen'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'glass-card-subtle text-slate-800 dark:text-slate-200 hover:bg-white/80'
                }`}
              >
                "Resúmelo en 1 sola línea"
              </button>
              <button
                onClick={() => setRefinementModifier('normal')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:underline"
              >
                Ver texto original
              </button>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/60 dark:border-white/10 text-xs leading-relaxed transition-all">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {refinementModifier === 'normal' ? 'Respuesta inicial de la IA:' : 'Respuesta tras tu repregunta de ajuste:'}
              </span>
              <p className="text-slate-900 dark:text-slate-100 font-medium">
                {getRefinedText()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEGURIDAD Y PRIVACIDAD */}
      {activeTab === 'seguridad' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-300/40 space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Semáforo de Privacidad: Protege tus Datos
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Los modelos comerciales de IA pueden almacenar tus conversaciones para entrenar. Sigue este semáforo estricto:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Verde */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-300/60 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>VERDE: Totalmente Seguro</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Preguntas sobre leyes públicas (ej: "¿Qué es el RDL 19/2017?").</li>
                <li>Simulaciones ficticias de entrevistas.</li>
                <li>Traducciones de textos públicos o menús.</li>
                <li>Pedir explicaciones de gramática o informática.</li>
              </ul>
            </div>

            {/* Amarillo */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/60 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>AMARILLO: Con Prudencia</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Borradores de tu CV (usa un nombre ficticio hasta el final).</li>
                <li>Tu sector profesional o ciudad sin dar la dirección exacta de tu casa.</li>
                <li>Casos reales cambiando los nombres de las personas implicadas.</li>
              </ul>
            </div>

            {/* Rojo */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-300/60 dark:border-rose-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 text-xs font-bold">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>ROJO: ¡NUNCA Compartir!</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Número de NIE, DNI, Pasaporte o Seguridad Social.</li>
                <li>Contraseñas de correo, Cl@ve PIN o certificados digitales.</li>
                <li>Números de tarjeta de crédito, cuentas bancarias o nóminas con tus datos.</li>
                <li>Informes médicos con diagnósticos o historiales de salud.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PROMPTS LISTOS PARA USAR */}
      {activeTab === 'ejemplos' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Hemos preparado 6 plantillas de prompts de alta utilidad probadas para trámites en España. Puedes copiarlas con un clic o llevarlas al laboratorio:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyToUseExamples.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                      {ex.category}
                    </span>
                    <button
                      onClick={() => handleCopy(ex.prompt, ex.id)}
                      className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === ex.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === ex.id ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {ex.title}
                  </h4>
                  <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-white/50 dark:border-white/10">
                    {ex.prompt}
                  </p>
                </div>

                {onSendToSandbox && (
                  <div className="pt-2 border-t border-white/40 dark:border-white/10 flex justify-end">
                    <button
                      onClick={() => onSendToSandbox(ex.prompt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Probar en el Laboratorio</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
