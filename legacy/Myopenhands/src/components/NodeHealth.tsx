import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  Heart,
  ShieldCheck,
  Phone,
  HelpCircle,
  FileCheck,
  AlertTriangle,
  Smile,
  Activity,
  MapPin
} from 'lucide-react';

interface NodeHealthProps {
  language: Language;
}

export const NodeHealth: React.FC<NodeHealthProps> = () => {
  const [selectedCA, setSelectedCA] = useState<string>('madrid');

  const communities = [
    {
      id: 'madrid',
      name: 'Comunidad de Madrid (SERMAS)',
      docName: 'Documento Asistencial para Personas Extranjeras sin Residencia (DAR / DASE)',
      process:
        'Presentar en el Centro de Salud correspondiente al domicilio: Pasaporte en vigor, volante de empadronamiento (de más de 3 meses de antigüedad o acreditación de arraigo) e informe de no exportación del derecho a la asistencia. Si se deniega de palabra, pedir hoja de reclamaciones oficial.',
    },
    {
      id: 'cataluna',
      name: 'Cataluña (CatSalut)',
      docName: 'Tarjeta Sanitaria Individual (TSI de Nivel 1 o Nivel 2)',
      process:
        'Acceso universal garantizado por la Ley 9/2017 del Parlament. Basta con presentar empadronamiento en cualquier municipio catalán y pasaporte en el CAP más cercano para obtener la TSI con cobertura completa.',
    },
    {
      id: 'valencia',
      name: 'Comunitat Valenciana (Sanitat)',
      docName: 'Documento Sanitario de Inclusión',
      process:
        'Instrucción de universalidad: Acudir al centro de salud con pasaporte y empadronamiento. Se asigna médico de familia y pediatra de forma inmediata.',
    },
    {
      id: 'andalucia',
      name: 'Andalucía (SAS)',
      docName: 'Tarjeta Sanitaria por Reconocimiento de Asistencia',
      process:
        'Solicitar mediante el formulario oficial en el centro de salud aportando pasaporte, empadronamiento y declaración de no tener recursos económicos suficientes.',
    },
    {
      id: 'pais_vasco',
      name: 'País Vasco (Osakidetza)',
      docName: 'TIS por razones humanitarias / universalidad',
      process:
        'Requisito general de empadronamiento y justificación de residencia efectiva en Euskadi. Cobertura farmacéutica y médica integral.',
    },
  ];

  const currentCADetails = communities.find((c) => c.id === selectedCA) || communities[0];

  const mentalHealthHotlines = [
    {
      name: 'Línea 024 (Atención a la Conducta Suicida y Crisis Emocional)',
      phone: '024',
      desc: 'Línea telefónica oficial, pública, gratuita, confidencial y disponible 24 horas al día los 365 días del año.',
    },
    {
      name: 'Cruz Roja Te Escucha (Apoyo Psicosocial)',
      phone: '900 107 917',
      desc: 'Atención psicológica y acompañamiento telefónico gratuito para situaciones de soledad, duelo migratorio o ansiedad.',
    },
    {
      name: 'Teléfono de la Esperanza',
      phone: '717 003 717',
      desc: 'Escucha activa y orientación en momentos de crisis vital o angustia.',
    },
    {
      name: 'Médicos del Mundo (Acceso Sanitario)',
      phone: '900 22 11 22',
      desc: 'Apoyo y mediación si un centro de salud te niega la atención médica por falta de papeles.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
            Nodo 12 · Salud & Bienestar
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Sanidad Universal (RDL 7/2018) · Tarjeta Sanitaria · Duelo Migratorio
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
          Sanidad Pública Universal & Salud Emocional
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          En España la salud es un derecho humano fundamental garantizado por ley: nadie puede ser rechazado en urgencias, ni las mujeres embarazadas, ni los menores de edad. Aprende cómo tramitar tu tarjeta sanitaria y accede a recursos para el cuidado de tu salud mental.
        </p>
      </div>

      {/* Emergency Law Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center font-bold">
            🚨
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Urgencias Médicas Gratuitas
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Cualquier persona tiene derecho a recibir asistencia sanitaria en los servicios de Urgencias de cualquier hospital público hasta el alta médica, sin que puedan emitir factura ni exigir fianza previa.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center font-bold">
            🤰
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Embarazo, Parto y Puerperio
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Las mujeres embarazadas tienen derecho a cobertura sanitaria completa durante todo el embarazo, el parto y el posparto, independientemente de su estatus administrativo.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center font-bold">
            👶
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Menores de 18 Años
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Todos los niños, niñas y adolescentes tienen derecho exactamente a la misma atención sanitaria y calendario vacunal que los nacionales españoles desde el primer día.
          </p>
        </div>
      </div>

      {/* Tarjeta Sanitaria por Comunidad Autónoma */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Cómo Solicitar la Tarjeta Sanitaria en tu Comunidad Autónoma
          </h3>
        </div>

        {/* Region selector buttons */}
        <div className="flex flex-wrap gap-1.5">
          {communities.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCA(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCA === c.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'glass-pill text-slate-700 dark:text-slate-300 hover:bg-white/60'
              }`}
            >
              {c.name.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Details box for active region */}
        <div className="p-4 rounded-xl glass-card-subtle border border-orange-200/40 dark:border-orange-900/40 space-y-2 text-xs">
          <h4 className="font-bold text-orange-900 dark:text-orange-200">
            {currentCADetails.name} · {currentCADetails.docName}
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentCADetails.process}
          </p>
        </div>
      </div>

      {/* Mental Health & Duelo Migratorio */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Salud Mental, Síndrome de Ulises & Duelo Migratorio
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Migrar implica separarse de los seres queridos, adaptarse a una nueva cultura y enfrentar la incertidumbre. El Síndrome de Ulises (estrés crónico del migrante) no es una enfermedad, es una respuesta humana natural ante dificultades extremas. No estás solo/a. Estos teléfonos son 100% gratuitos y atienden sin pedir papeles:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {mentalHealthHotlines.map((h, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl glass-card-subtle border border-white/60 dark:border-white/10 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{h.name}</span>
                <a
                  href={`tel:${h.phone.replace(/\s+/g, '')}`}
                  className="px-2.5 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-orange-500/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{h.phone}</span>
                </a>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
