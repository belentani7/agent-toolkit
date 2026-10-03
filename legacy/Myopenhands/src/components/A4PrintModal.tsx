import React from 'react';
import { CVData } from '../types';
import { Printer, X, Download } from 'lucide-react';

interface A4PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
}

export const A4PrintModal: React.FC<A4PrintModalProps> = ({
  isOpen,
  onClose,
  cvData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="glass-card rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none">
        {/* Modal Controls - Hidden during actual print */}
        <div className="p-4 glass-card-subtle border-b border-white/30 dark:border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Vista de Impresión Oficial A4 / Exportación PDF
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:bg-white/40 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable A4 Sheet */}
        <div className="p-8 sm:p-12 bg-white text-stone-900 font-sans print:p-8 text-[13px] leading-normal" id="printable-cv">
          {/* Header Banner according to template */}
          <div className="border-b-2 border-stone-800 pb-4 mb-5">
            <h1 className="text-2xl font-black uppercase tracking-tight text-stone-950 font-heading">
              {cvData.fullName || 'Nombre y Apellidos'}
            </h1>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">
              {cvData.jobTitle || 'Puesto Deseado'}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600 mt-2 font-medium">
              <span>{cvData.email}</span>
              <span>•</span>
              <span>{cvData.phone}</span>
              {cvData.location && (
                <>
                  <span>•</span>
                  <span>{cvData.location}</span>
                </>
              )}
              {cvData.permitStatus && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-stone-800">{cvData.permitStatus}</span>
                </>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {cvData.summary && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-1 mb-2">
                Perfil Profesional
              </h2>
              <p className="text-xs text-stone-800 leading-relaxed">
                {cvData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {cvData.experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-1 mb-3">
                Experiencia Laboral
              </h2>
              <div className="space-y-3">
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-stone-900 text-xs">{exp.role}</span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-emerald-800">{exp.company}</p>
                    <p className="text-xs text-stone-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-1 mb-2">
                Formación & Certificaciones
              </h2>
              <div className="space-y-2">
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{edu.degree}</span>
                      <span className="text-stone-600 ml-1">· {edu.institution}</span>
                    </div>
                    <span className="text-stone-500 font-mono text-[11px]">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-1 mb-2">
                Competencias Técnicas y Personales
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-semibold border border-stone-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
