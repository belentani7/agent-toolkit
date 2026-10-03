import React, { useState } from 'react';
import { CVData, Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  FileText,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Layout,
  Briefcase,
  GraduationCap,
  Languages,
  User,
  Check
} from 'lucide-react';

interface NodeCVBuilderProps {
  language: Language;
  cvData: CVData;
  onChangeCVData: (data: CVData) => void;
  onOpenPrintModal: () => void;
}

export const NodeCVBuilder: React.FC<NodeCVBuilderProps> = ({
  language,
  cvData,
  onChangeCVData,
  onOpenPrintModal,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'cover-letter'>('editor');
  const [newSkill, setNewSkill] = useState('');
  const [coverJobTitle, setCoverJobTitle] = useState('Personal de Atención al Cliente / Hostelería');
  const [coverCompanyName, setCoverCompanyName] = useState('Empresa Seleccionadora');
  const [generatedLetter, setGeneratedLetter] = useState('');

  // Calculate ATS Optimization Score
  const calculateATS = () => {
    let score = 0;
    if (cvData.fullName.trim().length > 3) score += 15;
    if (cvData.email.includes('@') && cvData.phone.length > 8) score += 20;
    if (cvData.summary.trim().length > 50) score += 20;
    if (cvData.experience.length > 0) score += 25;
    if (cvData.education.length > 0) score += 10;
    if (cvData.skills.length >= 4) score += 10;
    return Math.min(score, 100);
  };

  const atsScore = calculateATS();

  const handleAddExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: 'Empresa S.L.',
      role: 'Puesto Laboral',
      startDate: '2023',
      endDate: '2024',
      current: false,
      description: 'Gestión de tareas operativas, atención a clientes y cumplimiento de objetivos.',
    };
    onChangeCVData({
      ...cvData,
      experience: [newExp, ...cvData.experience],
    });
  };

  const handleRemoveExperience = (id: string) => {
    onChangeCVData({
      ...cvData,
      experience: cvData.experience.filter((e) => e.id !== id),
    });
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: 'Centro de Formación / Universidad',
      degree: 'Título o Certificado de Profesionalidad',
      year: '2022',
      homologated: true,
    };
    onChangeCVData({
      ...cvData,
      education: [newEdu, ...cvData.education],
    });
  };

  const handleRemoveEducation = (id: string) => {
    onChangeCVData({
      ...cvData,
      education: cvData.education.filter((e) => e.id !== id),
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || cvData.skills.includes(newSkill.trim())) return;
    onChangeCVData({
      ...cvData,
      skills: [...cvData.skills, newSkill.trim()],
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChangeCVData({
      ...cvData,
      skills: cvData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleGenerateCoverLetter = () => {
    const letter = `A la atención del Departamento de Recursos Humanos de ${coverCompanyName}:

Me dirijo a ustedes con gran entusiasmo para presentar mi candidatura al puesto de ${coverJobTitle}. A través de mi trayectoria, he desarrollado sólidas competencias en trabajo en equipo, capacidad de resolución y adaptabilidad en entornos dinámicos.

Cuento con residencia y disponibilidad laboral en ${cvData.location || 'España'}, con plena motivación para incorporarme de manera inmediata y contribuir positivamente al crecimiento de su equipo. Agradezco de antemano el tiempo dedicado a revisar mi perfil adjunto y quedo a su entera disposición para mantener una entrevista personal.

Atentamente,
${cvData.fullName || 'Candidato/a'}
Teléfono: ${cvData.phone || '+34 600 000 000'} | Correo: ${cvData.email || 'correo@ejemplo.com'}`;
    setGeneratedLetter(letter);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
                Nodo 3 · Herramienta Laboral
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                4 Plantillas ATS en Vivo · Exportador PDF A4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Creador de Currículum ATS & Carta de Presentación
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Diseña un currículum adaptado al mercado laboral español que supera los filtros automáticos de los departamentos de Recursos Humanos (sistemas ATS), optimiza tus datos de contacto y expórtalo a formato A4 con un clic.
            </p>
          </div>

          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all self-start sm:self-auto shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printCV}</span>
          </button>
        </div>
      </div>

      {/* Template Selector & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-xl shadow-sm">
        {/* Template switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Layout className="w-3.5 h-3.5" /> Plantilla:
          </span>
          {(['classic', 'modern', 'tech', 'executive'] as const).map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => onChangeCVData({ ...cvData, template: tmpl })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all backdrop-blur-md ${
                cvData.template === tmpl
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 border border-orange-400'
                  : 'glass-card-subtle text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
              }`}
            >
              {tmpl === 'classic'
                ? 'Clásica Europea'
                : tmpl === 'modern'
                ? 'Moderna'
                : tmpl === 'tech'
                ? 'Tecnológica'
                : 'Ejecutiva'}
            </button>
          ))}
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 glass-card-subtle p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-white/90 dark:bg-white/20 text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Formulario Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-white/90 dark:bg-white/20 text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Vista Previa en Vivo
          </button>
          <button
            onClick={() => {
              setActiveTab('cover-letter');
              if (!generatedLetter) handleGenerateCoverLetter();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cover-letter'
                ? 'bg-white/90 dark:bg-white/20 text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Carta de Presentación
          </button>
        </div>
      </div>

      {/* ATS Score Meter */}
      <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm font-mono shadow-xs ${
              atsScore >= 80
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                : atsScore >= 50
                ? 'bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/30'
                : 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30'
            }`}
          >
            {atsScore}%
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Puntuación de Compatibilidad ATS (Robots de RRHH)
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {atsScore >= 80
                ? '¡Excelente! Tu CV contiene los campos críticos requeridos por los portales de empleo.'
                : 'Añade más detalles de contacto, resumen profesional y al menos 4 habilidades para mejorar tu visibilidad.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPrintModal}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
        >
          <Printer className="w-3.5 h-3.5" /> Ver diseño final para imprimir A4
        </button>
      </div>

      {/* Editor Tab */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Data */}
            <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                Datos Personales & Contacto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={cvData.fullName}
                    onChange={(e) => onChangeCVData({ ...cvData, fullName: e.target.value })}
                    placeholder="Ej. María Elena González"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Puesto o Perfil Deseado *
                  </label>
                  <input
                    type="text"
                    value={cvData.jobTitle}
                    onChange={(e) => onChangeCVData({ ...cvData, jobTitle: e.target.value })}
                    placeholder="Ej. Administrativo / Dependiente de Comercio"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={cvData.email}
                    onChange={(e) => onChangeCVData({ ...cvData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Teléfono Móvil (con prefijo español) *
                  </label>
                  <input
                    type="tel"
                    value={cvData.phone}
                    onChange={(e) => onChangeCVData({ ...cvData, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Ciudad de Residencia
                  </label>
                  <input
                    type="text"
                    value={cvData.location}
                    onChange={(e) => onChangeCVData({ ...cvData, location: e.target.value })}
                    placeholder="Ej. Madrid, España"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Disponibilidad Laboral / Permiso
                  </label>
                  <input
                    type="text"
                    value={cvData.permitStatus}
                    onChange={(e) => onChangeCVData({ ...cvData, permitStatus: e.target.value })}
                    placeholder="Ej. Permiso de trabajo en vigor / NIE disponible"
                    className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Resumen Profesional (Perfil en 3-4 líneas)
                </label>
                <textarea
                  rows={3}
                  value={cvData.summary}
                  onChange={(e) => onChangeCVData({ ...cvData, summary: e.target.value })}
                  placeholder="Profesional responsable y dinámico con experiencia demostrable en..."
                  className="w-full p-3 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Work Experience */}
            <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  Experiencia Laboral
                </h3>
                <button
                  onClick={handleAddExperience}
                  className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Puesto
                </button>
              </div>

              <div className="space-y-4">
                {cvData.experience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl glass-card-subtle space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Experiencia #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Eliminar puesto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                          Puesto Desempeñado
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = cvData.experience.map((it) =>
                              it.id === exp.id ? { ...it, role: e.target.value } : it
                            );
                            onChangeCVData({ ...cvData, experience: updated });
                          }}
                          className="w-full p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                          Empresa o Empleador
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = cvData.experience.map((it) =>
                              it.id === exp.id ? { ...it, company: e.target.value } : it
                            );
                            onChangeCVData({ ...cvData, experience: updated });
                          }}
                          className="w-full p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                          Fecha de Inicio
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = cvData.experience.map((it) =>
                              it.id === exp.id ? { ...it, startDate: e.target.value } : it
                            );
                            onChangeCVData({ ...cvData, experience: updated });
                          }}
                          placeholder="Mes / Año"
                          className="w-full p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                          Fecha de Fin
                        </label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => {
                            const updated = cvData.experience.map((it) =>
                              it.id === exp.id ? { ...it, endDate: e.target.value } : it
                            );
                            onChangeCVData({ ...cvData, experience: updated });
                          }}
                          placeholder="Mes / Año (o 'Actual')"
                          className="w-full p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Responsabilidades y Logros
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = cvData.experience.map((it) =>
                            it.id === exp.id ? { ...it, description: e.target.value } : it
                          );
                          onChangeCVData({ ...cvData, experience: updated });
                        }}
                        className="w-full p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Studies */}
            <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-orange-500" />
                  Formación Académica & Certificados
                </h3>
                <button
                  onClick={handleAddEducation}
                  className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Formación
                </button>
              </div>

              <div className="space-y-3">
                {cvData.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-3 rounded-xl glass-card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                      <input
                        type="text"
                        value={edu.degree}
                        placeholder="Título / Carrera / Certificado"
                        onChange={(e) => {
                          const updated = cvData.education.map((it) =>
                            it.id === edu.id ? { ...it, degree: e.target.value } : it
                          );
                          onChangeCVData({ ...cvData, education: updated });
                        }}
                        className="p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        placeholder="Institución / Universidad"
                        onChange={(e) => {
                          const updated = cvData.education.map((it) =>
                            it.id === edu.id ? { ...it, institution: e.target.value } : it
                          );
                          onChangeCVData({ ...cvData, education: updated });
                        }}
                        className="p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={edu.year}
                          placeholder="Año"
                          onChange={(e) => {
                            const updated = cvData.education.map((it) =>
                              it.id === edu.id ? { ...it, year: e.target.value } : it
                            );
                            onChangeCVData({ ...cvData, education: updated });
                          }}
                          className="w-20 p-2 rounded-lg border border-white/60 dark:border-white/10 glass-card-subtle text-xs"
                        />
                        <button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Live Mini-Preview */}
          <div className="lg:col-span-4 space-y-6">
            {/* Skills manager */}
            <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Habilidades & Competencias
              </h3>
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ej. Excel, Atención al cliente..."
                  className="w-full p-2 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {cvData.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass-pill text-orange-800 dark:text-orange-300 text-xs font-medium"
                  >
                    {s}
                    <button
                      onClick={() => handleRemoveSkill(s)}
                      className="hover:text-rose-600 text-slate-400 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Print Action Card */}
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Printer className="w-4 h-4 text-orange-500" />
                ¿Listo para Enviar tu CV?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Nuestras plantillas están optimizadas con márgenes estándar y tipografía de alta legibilidad para que encajen perfectamente en 1 hoja de papel A4 sin cortes de página indeseados.
              </p>
              <button
                onClick={onOpenPrintModal}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all"
              >
                Abrir Vista de Impresión / Guardar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Tab */}
      {activeTab === 'preview' && (
        <div className="max-w-4xl mx-auto glass-card p-8 rounded-2xl shadow-xl space-y-6 font-sans">
          {/* Header depending on Template */}
          <div
            className={`border-b pb-4 ${
              cvData.template === 'executive'
                ? 'bg-slate-900 text-white p-6 rounded-xl -m-4 mb-4'
                : cvData.template === 'modern'
                ? 'border-l-4 border-l-orange-500 pl-4 border-b-slate-200 dark:border-b-slate-700'
                : 'border-b-slate-200 dark:border-b-slate-700'
            }`}
          >
            <h1 className="text-2xl font-black tracking-tight">{cvData.fullName || 'Nombre y Apellidos'}</h1>
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-0.5">
              {cvData.jobTitle || 'Puesto Deseado'}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>{cvData.email}</span>
              <span>·</span>
              <span>{cvData.phone}</span>
              {cvData.location && (
                <>
                  <span>·</span>
                  <span>{cvData.location}</span>
                </>
              )}
              {cvData.permitStatus && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-orange-700 dark:text-orange-400">
                    {cvData.permitStatus}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {cvData.summary && (
            <div className="space-y-1">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Perfil Profesional
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {cvData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Experiencia Laboral
            </h2>
            <div className="space-y-3">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{exp.role}</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                    {exp.company}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Formación & Certificaciones
            </h2>
            <div className="space-y-2">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{edu.degree}</span>
                    <span className="text-slate-500 ml-1">· {edu.institution}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Competencias & Habilidades
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full glass-pill text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cover Letter Tab */}
      {activeTab === 'cover-letter' && (
        <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/40 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Generador de Carta de Presentación Laboral
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personaliza la empresa y el puesto para obtener una carta formal lista para adjuntar en correos e inscripciones.
              </p>
            </div>
            <button
              onClick={handleGenerateCoverLetter}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
            >
              Regenerar Carta
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Puesto al que Postulas
              </label>
              <input
                type="text"
                value={coverJobTitle}
                onChange={(e) => setCoverJobTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={coverCompanyName}
                onChange={(e) => setCoverCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl glass-card-subtle">
            <textarea
              rows={12}
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedLetter);
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Copiar Carta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
