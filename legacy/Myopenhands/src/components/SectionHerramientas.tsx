import React, { useState } from 'react';
import { Language, NodeId } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  FileText,
  Calendar,
  Award,
  Mic,
  Scale,
  Landmark,
  HeartHandshake,
  Home,
  ArrowRight,
  Sparkles,
  Lock,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Shield,
  PhoneCall,
  Calculator,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface SectionHerramientasProps {
  language: Language;
  onSelectNode: (nodeId: NodeId) => void;
  onOpenPrintModal?: () => void;
}

export const SectionHerramientas: React.FC<SectionHerramientasProps> = ({
  language,
  onSelectNode,
  onOpenPrintModal,
}) => {
  const t = TRANSLATIONS[language];

  // Interactive Live Calculator 1: Salario Mínimo Legal (SMI)
  const [weeklyHours, setWeeklyHours] = useState<number>(40);
  const [payInstallments, setPayInstallments] = useState<12 | 14>(14);

  // SMI 2025/2026 oficial en España: 1.184 € en 14 pagas (16.576 €/año) o 1.381,33 € en 12 pagas
  const smiAnnualTotal = 16576;
  const smiFullMonthly14 = 1184;
  const smiFullMonthly12 = 1381.33;
  const smiHourlyLegal = 9.26; // por hora efectiva según normativa

  const calculatedMonthlySMI =
    payInstallments === 14
      ? ((smiFullMonthly14 * weeklyHours) / 40).toFixed(2)
      : ((smiFullMonthly12 * weeklyHours) / 40).toFixed(2);
  const calculatedAnnualSMI = ((smiAnnualTotal * weeklyHours) / 40).toFixed(2);

  // Interactive Live Calculator 2: Asistente de Tipo de Arraigo
  const [stayMonths, setStayMonths] = useState<number>(24);
  const [hasJobOffer, setHasJobOffer] = useState<boolean>(true);
  const [hasSpanishFamily, setHasSpanishFamily] = useState<boolean>(false);
  const [enrolledTraining, setEnrolledTraining] = useState<boolean>(false);

  const getArraigoDiagnosis = () => {
    if (hasSpanishFamily) {
      return {
        tipo: 'Arraigo Familiar',
        tiempoRequerido: 'Sin permanencia mínima obligatoria previa',
        valido: true,
        motivo: 'Al tener vínculo familiar directo (hijo/a español/a, cónyuge o pareja de hecho registrada), puedes solicitar el Arraigo Familiar inmediatamente con concesión de autorización de residencia y trabajo de 5 años.',
        docs: ['Certificado de nacimiento o matrimonio legalizado', 'Pasaporte en vigor', 'Certificado de antecedentes penales de tu país de origen'],
      };
    }
    if (stayMonths >= 36 && hasJobOffer) {
      return {
        tipo: 'Arraigo Social',
        tiempoRequerido: '3 años de permanencia continuada demostrable',
        valido: true,
        motivo: 'Cumples los 3 años de permanencia y cuentas con propuesta de contrato laboral. Podrás solicitar el informe de arraigo social en tu Comunidad Autónoma o Ayuntamiento.',
        docs: ['Contrato o precontrato de trabajo firmado', 'Certificado de empadronamiento histórico', 'Informe de inserción social', 'Antecedentes penales apostillados'],
      };
    }
    if (stayMonths >= 24 && hasJobOffer) {
      return {
        tipo: 'Arraigo Sociolaboral',
        tiempoRequerido: '2 años de permanencia continuada',
        valido: true,
        motivo: 'Cumples los 2 años continuados. Si acreditas relaciones laborales de al menos 6 meses o contrato formal, puedes solicitar la vía sociolaboral.',
        docs: ['Prueba de permanencia 2 años (padrón, envíos, médicos)', 'Contrato de trabajo', 'Antecedentes penales del país de origen'],
      };
    }
    if (stayMonths >= 24 && enrolledTraining) {
      return {
        tipo: 'Arraigo para la Formación',
        tiempoRequerido: '2 años de permanencia continuada',
        valido: true,
        motivo: 'Puedes solicitar permiso de 1 año comprometiéndote a realizar una formación reglada para el empleo (Certificado de Profesionalidad).',
        docs: ['Matrícula o compromiso de matrícula en curso oficial', 'Padrón histórico de 2 años', 'Antecedentes penales apostillados'],
      };
    }
    return {
      tipo: 'En periodo de permanencia',
      tiempoRequerido: stayMonths < 24 ? `Te faltan ${24 - stayMonths} meses para cumplir los 2 años` : 'Requiere oferta de empleo o matrícula oficial',
      valido: false,
      motivo: stayMonths < 24
        ? `Llevas ${stayMonths} meses acumulados. Mantén tu empadronamiento activo y recopila facturas, abonos de transporte y visitas médicas como pruebas de permanencia continua.`
        : 'Ya cumples los 2 años de permanencia. Para solicitar el permiso necesitas o bien una oferta laboral formal o inscribirte en una formación homologada (Arraigo para la Formación).',
      docs: ['Mantener empadronamiento continuado sin ausencias', 'Pasaporte en vigor', 'Solicitar cita de orientación social'],
    };
  };

  const arraigoDiagnosis = getArraigoDiagnosis();

  const allTools = [
    {
      id: 'cv-builder' as NodeId,
      title: 'Creador de CV ATS & Impresión A4',
      description: 'Genera un currículum optimizado para filtros ATS con 4 plantillas adaptadas al mercado español, exportable en A4 listo para ofertas de empleo.',
      icon: FileText,
      badge: 'Exportación A4',
      actionText: 'Abrir Creador de CV',
    },
    {
      id: 'appointments-citas' as NodeId,
      title: 'Gestor de Citas & Exportador .ICS',
      description: 'Organiza citas de huellas (TIE), asilo, empadronamiento o salud con checklist documental (tasa 790, fotos) y descarga el archivo .ics para Google Calendar.',
      icon: Calendar,
      badge: 'Calendario .ICS',
      actionText: 'Gestionar Mis Citas',
    },
    {
      id: 'dele-exam' as NodeId,
      title: 'Simulador DELE & CCSE con Diploma',
      description: 'Prueba interactiva oficial con cronómetro y evaluación por bloques (comprensión lectora, auditiva y constitucional) que genera un Diploma descargable en PNG.',
      icon: Award,
      badge: 'Diploma PNG',
      actionText: 'Iniciar Simulador DELE',
    },
    {
      id: 'ai-curriculum' as NodeId,
      title: 'Academia & Guía de Inicio de IA',
      description: 'Aprende a comunicarte con la inteligencia artificial desde cero con el método RCTF, generador interactivo de prompts y 26 niveles oficiales.',
      icon: Sparkles,
      badge: 'Guía Principiantes & 26 Niveles',
      actionText: 'Abrir Academia IA',
    },
    {
      id: 'companion-manos' as NodeId,
      title: 'Tutor de Voz & Asistente "Manos"',
      description: 'Acompañante por voz interactivo con reconocimiento vocal en el navegador, síntesis en 39 idiomas y respuestas locales con motor de inteligencia artificial.',
      icon: Mic,
      badge: 'Voz & IA Offline',
      actionText: 'Hablar con Manos',
    },
    {
      id: 'legal-rights' as NodeId,
      title: 'Guía Jurídica & Asesor de Extranjería',
      description: 'Conoce los plazos y requisitos exactos para arraigo social, sociolaboral, para la formación o familiar con la normativa vigente.',
      icon: Scale,
      badge: 'Leyes Extranjería',
      actionText: 'Consultar Requisitos',
    },
    {
      id: 'financial-inclusion' as NodeId,
      title: 'Verificador de Cuenta Bancaria Gratuita',
      description: 'Aprende tus derechos bajo el Real Decreto-ley 19/2017: todos los bancos deben abrirte una cuenta básica sin comisiones con solo tu pasaporte.',
      icon: Landmark,
      badge: 'RD 19/2017',
      actionText: 'Ver Guía Bancaria',
    },
    {
      id: 'labor-rights' as NodeId,
      title: 'Simulador de Entrevista Laboral & Acredita',
      description: 'Practica preguntas reales frente al seleccionador y homologa tus competencias previas sin cursar estudios con el procedimiento oficial Acredita.',
      icon: Briefcase,
      badge: 'Acredita & STAR',
      actionText: 'Simular Entrevistas',
    },
    {
      id: 'housing-rent' as NodeId,
      title: 'Guía de Vivienda & Contratos de Alquiler',
      description: 'Conoce tus derechos como inquilino bajo la Ley de Arrendamientos Urbanos (LAU), límites de fianza, empadronamiento sin domicilio fijo y cómo evitar estafas.',
      icon: Home,
      badge: 'LAU Inquilinos',
      actionText: 'Revisar Derechos Alquiler',
    },
    {
      id: 'health-sanidad' as NodeId,
      title: 'Asistente de Tarjeta Sanitaria (TSI)',
      description: 'Pasos exactos para obtener la tarjeta sanitaria pública en tu centro de salud (CAP/ambulatorio) independientemente de tu situación administrativa.',
      icon: Stethoscope,
      badge: 'Sanidad Universal',
      actionText: 'Solicitar Asistencia Médica',
    },
    {
      id: 'asylum-protection' as NodeId,
      title: 'Guía de Asilo & Protección Internacional',
      description: 'Derechos del solicitante de asilo, renovación de hoja blanca, tarjeta roja, plazos para autorización de trabajo y recursos de acogida.',
      icon: Shield,
      badge: 'Asilo & Tarjeta Roja',
      actionText: 'Ver Información de Asilo',
    },
    {
      id: 'culture-spain' as NodeId,
      title: 'Guía de Convivencia, Padrón & Cultura',
      description: 'Costumbres, horarios en España, gestión de residuos, trámites municipales y derechos fundamentales en la sociedad de acogida.',
      icon: HeartHandshake,
      badge: 'Padrón & Ciudadanía',
      actionText: 'Explorar Convivencia',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-slate-900 dark:text-slate-100 text-xs font-bold mb-1">
          <Calculator className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Herramientas Prácticas y Utilitarios Reales</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Herramientas de Autonomía, Simulación & Trámites
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
          Generadores de CV ATS, simuladores de exámenes oficiales, gestor de citas con exportación .ics, asistentes jurídicos y calculadoras interactivas para defender tus derechos con datos exactos.
        </p>
      </div>

      {/* TWO LIVE INTERACTIVE CALCULATORS RIGHT HERE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator 1: SMI Calculadora de Salario Mínimo Legal */}
        <div className="glass-card p-6 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-slate-900 dark:text-slate-100 text-xs font-bold">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Calculadora Oficial SMI España</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 px-2 py-0.5 rounded">
                Normativa 2025/2026
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              ¿Cuál es tu Salario Mínimo Legal Obligatorio?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              En España ninguna empresa o empleador puede pagarte por debajo del Salario Mínimo Interprofesional (SMI), sea cual sea tu sector.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Horas Semanales de Contrato:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={1}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="flex-1 accent-orange-500"
                  />
                  <span className="w-12 text-center text-xs font-bold px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-white/10 text-slate-900 dark:text-slate-100">
                    {weeklyHours}h
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Número de Pagas al Año:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setPayInstallments(14)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      payInstallments === 14
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'glass-card-subtle text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    14 Pagas (con extras)
                  </button>
                  <button
                    onClick={() => setPayInstallments(12)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      payInstallments === 12
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'glass-card-subtle text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    12 Pagas (prorrateadas)
                  </button>
                </div>
              </div>
            </div>

            {/* Results Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-300/50 dark:border-emerald-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Salario Bruto Mínimo Mensual:
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                  {calculatedMonthlySMI} € / mes
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 pt-1 border-t border-emerald-200/40 dark:border-emerald-800/40">
                <span>Total Bruto Anual: <strong>{calculatedAnnualSMI} €</strong></span>
                <span>Precio hora legal: <strong>{smiHourlyLegal} €/h</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Si te ofrecen una cifra inferior en tu contrato o nómina, están vulnerando la ley.</span>
          </div>
        </div>

        {/* Calculator 2: Asistente Interactivo de Arraigo */}
        <div className="glass-card p-6 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-400/30 text-slate-900 dark:text-slate-100 text-xs font-bold">
                <Scale className="w-3.5 h-3.5 text-orange-600" />
                <span>Diagnóstico de Arraigos</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 px-2 py-0.5 rounded">
                LO 4/2000
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Comprueba a qué Vía de Regularización Puedes Optar
            </h3>

            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                  <span>Meses continuos en España:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{stayMonths} meses ({Math.floor(stayMonths / 12)} años y {stayMonths % 12} m)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={48}
                  value={stayMonths}
                  onChange={(e) => setStayMonths(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => setHasJobOffer(!hasJobOffer)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    hasJobOffer
                      ? 'bg-orange-500 text-white border-orange-400'
                      : 'glass-card-subtle text-slate-700 dark:text-slate-300'
                  }`}
                >
                  💼 Oferta de trabajo: {hasJobOffer ? 'Sí' : 'No'}
                </button>

                <button
                  onClick={() => setHasSpanishFamily(!hasSpanishFamily)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    hasSpanishFamily
                      ? 'bg-orange-500 text-white border-orange-400'
                      : 'glass-card-subtle text-slate-700 dark:text-slate-300'
                  }`}
                >
                  👨‍👩‍👧 Familia española: {hasSpanishFamily ? 'Sí' : 'No'}
                </button>

                <button
                  onClick={() => setEnrolledTraining(!enrolledTraining)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    enrolledTraining
                      ? 'bg-orange-500 text-white border-orange-400'
                      : 'glass-card-subtle text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🎓 Curso/Formación: {enrolledTraining ? 'Sí' : 'No'}
                </button>
              </div>
            </div>

            {/* Diagnosis Result Card */}
            <div className={`p-4 rounded-2xl border space-y-1.5 ${
              arraigoDiagnosis.valido
                ? 'bg-emerald-500/10 border-emerald-300/50 dark:border-emerald-800/50'
                : 'bg-amber-500/10 border-amber-300/50 dark:border-amber-800/50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {arraigoDiagnosis.tipo}
                </span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {arraigoDiagnosis.tiempoRequerido}
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {arraigoDiagnosis.motivo}
              </p>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>¿Quieres ver la documentación completa?</span>
            <button
              onClick={() => onSelectNode('legal-rights')}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              Ir a Nodo Legal →
            </button>
          </div>
        </div>
      </div>

      {/* FULL SUITE OF 12 SPECIALIZED TOOLS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Suite Completa de Herramientas Especializadas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allTools.map((tool) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                className="glass-card p-5 sm:p-6 rounded-3xl shadow-sm border border-white/60 dark:border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    {/* High contrast badge where text color does not match balloon tint */}
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => onSelectNode(tool.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{tool.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Guarantee Footer Note */}
      <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-white/60 dark:border-white/10 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
        <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Garantía de Soberanía Local:</strong> Ninguna de las herramientas envía tus datos (CV, nombre, citas médicas o pasaporte) a servidores externos. Todo el procesamiento se realiza en tu navegador de forma segura.
        </span>
      </div>
    </div>
  );
};
