import React, { useState } from 'react';
import { AppointmentItem, Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Download,
  CheckCircle,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface NodeAppointmentsProps {
  language: Language;
  appointments: AppointmentItem[];
  onAddAppointment: (appointment: AppointmentItem) => void;
  onRemoveAppointment: (id: string) => void;
  onToggleDocChecked: (appointmentId: string, docIndex: number) => void;
}

export const NodeAppointments: React.FC<NodeAppointmentsProps> = ({
  language,
  appointments,
  onAddAppointment,
  onRemoveAppointment,
  onToggleDocChecked,
}) => {
  const t = TRANSLATIONS[language];
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('Toma de Huellas (Expedición TIE)');
  const [date, setDate] = useState('2025-05-15');
  const [time, setTime] = useState('10:30');
  const [location, setLocation] = useState('Comisaría de Policía / Oficina de Extranjería');
  const [notes, setNotes] = useState('Llevar tasa 790-012 pagada en el banco y foto reciente.');

  const officialPortals = [
    {
      name: 'Sede Administraciones Públicas (Cita Extranjería)',
      url: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
      desc: 'Portal oficial del Ministerio para huellas TIE, recogida de tarjeta, asilo y renovaciones.',
    },
    {
      name: 'SEPE (Cita Previa Prestaciones y Desempleo)',
      url: 'https://sede.sepe.gob.es/portalSede/procedimientos-y-servicios/personas/proteccion-por-desempleo/cita-previa',
      desc: 'Solicitud de prestaciones, subsidios por desempleo e inscripción como demandante.',
    },
    {
      name: 'Seguridad Social (INSS - IMV y Afiliación)',
      url: 'https://sede.seg-social.gob.es/',
      desc: 'Ingreso Mínimo Vital, informe de vida laboral, número de afiliación a la Seguridad Social.',
    },
    {
      name: 'Agencia Tributaria (AEAT - NIF y Renta)',
      url: 'https://sede.agenciatributaria.gob.es/',
      desc: 'Cita previa para asignación de NIF, certificados de estar al corriente y declaración del IRPF.',
    },
  ];

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: AppointmentItem = {
      id: Date.now().toString(),
      title,
      date,
      time,
      location,
      notes,
      requiredDocs: [
        'Pasaporte original en vigor y fotocopia completa',
        'Justificante de cita previa impreso',
        'Modelo oficial de tasa (790-012) abonado en entidad bancaria',
        'Certificado de empadronamiento reciente (menos de 3 meses si cambió domicilio)',
        'Una fotografía reciente tamaño carné en color y fondo blanco',
      ],
      completedDocs: [],
    };
    onAddAppointment(newApt);
    setShowAddForm(false);
  };

  // Generate .ICS Calendar File
  const handleExportICS = (apt: AppointmentItem) => {
    const cleanDate = apt.date.replace(/-/g, '');
    const [h, m] = apt.time.split(':');
    const startHour = h.padStart(2, '0');
    const startMin = (m || '00').padStart(2, '0');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Manos Abiertas//Gestor de Citas Extranjeria//ES
BEGIN:VEVENT
UID:${apt.id}@manosabiertas.org
DTSTAMP:${cleanDate}T090000Z
DTSTART:${cleanDate}T${startHour}${startMin}00Z
DTEND:${cleanDate}T${String(Number(startHour) + 1).padStart(2, '0')}${startMin}00Z
SUMMARY:${apt.title}
DESCRIPTION:${apt.notes}\\nDocumentos: ${apt.requiredDocs.join(', ')}
LOCATION:${apt.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Cita_${apt.title.replace(/\s+/g, '_')}_${apt.date}.ics`;
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
                Nodo 7 · Trámites & Extranjería
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Gestor de Citas Previas · Listas de Cotejo · Exportador .ICS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Gestor de Citas Previas & Trámites Públicos
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Organiza tus citas en Comisarías, Oficinas de Extranjería, SEPE y Seguridad Social. Lleva el control exacto de las tasas pagadas y documentos requeridos, y sincroniza tus avisos con tu calendario móvil.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Official Sede Portals */}
      <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-orange-500" />
          Enlaces Directos a Sedes Electrónicas Oficiales (Para Pedir Cita)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {officialPortals.map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle hover:border-orange-400/80 transition-all space-y-1 block group backdrop-blur-md"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition-colors">
                  {portal.name}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{portal.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Add Appointment Modal / Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveAppointment}
          className="glass-card p-6 rounded-2xl border-2 border-orange-500/80 shadow-xl space-y-4 animate-in slide-in-from-top-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Registrar Nueva Cita de Extranjería o Administración
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tipo de Trámite
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Fecha de la Cita
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Hora Asignada
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Lugar / Comisaría
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Notas Adicionales / Instrucciones
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Guardar Cita y Generar Lista de Documentos
            </button>
          </div>
        </form>
      )}

      {/* User's Active Appointments */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          Mis Citas Programadas ({appointments.length})
        </h3>

        {appointments.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-2xl text-slate-500 space-y-2">
            <p className="text-xs">No tienes citas registradas actualmente.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
            >
              Haz clic aquí para añadir tu primera cita
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="glass-card p-5 rounded-2xl shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {apt.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-mono font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-semibold">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        {apt.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportICS(apt)}
                      className="p-2 rounded-xl bg-orange-500/10 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 border border-orange-300/40 transition-colors text-xs font-bold flex items-center gap-1"
                      title="Descargar archivo para Google Calendar / iPhone"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">.ICS</span>
                    </button>
                    <button
                      onClick={() => onRemoveAppointment(apt.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Eliminar cita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{apt.location}</span>
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 glass-card-subtle p-2.5 rounded-xl">
                    💡 {apt.notes}
                  </p>
                )}

                {/* Documents Checklist for this appointment */}
                <div className="space-y-1.5 pt-2 border-t border-white/40 dark:border-white/10">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-orange-500" />
                    Lista de Cotejo de Documentación ({apt.completedDocs.length} de{' '}
                    {apt.requiredDocs.length})
                  </p>

                  <div className="space-y-1">
                    {apt.requiredDocs.map((doc, docIdx) => {
                      const isChecked = apt.completedDocs.includes(docIdx);
                      return (
                        <button
                          key={docIdx}
                          onClick={() => onToggleDocChecked(apt.id, docIdx)}
                          className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition-all backdrop-blur-xs ${
                            isChecked
                              ? 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 line-through border border-emerald-500/30'
                              : 'glass-card-subtle text-slate-700 dark:text-slate-300 hover:bg-white/70'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                                : 'border-slate-300'
                            }`}
                          >
                            {isChecked && '✓'}
                          </span>
                          <span className="leading-tight">{doc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
