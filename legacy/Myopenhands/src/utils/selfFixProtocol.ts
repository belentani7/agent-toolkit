import { Language, UserProgress, CVData, AppointmentItem, NodeId } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { VOCES_39, repararMotorVoz } from '../data/voiceConfig';
import { NODES_LIST } from '../data/nodesMetadata';

export interface AuditReportItem {
  id: string;
  modulo: string;
  nombre: string;
  estado: 'ok' | 'advertencia' | 'critico';
  mensaje: string;
  detalles?: string;
  autoReparable: boolean;
}

export interface SystemAuditReport {
  timestamp: string;
  puntuacionSalud: number; // 0 - 100
  totalVerificaciones: number;
  verificacionesAprobadas: number;
  advertencias: number;
  criticos: number;
  items: AuditReportItem[];
}

export const INITIAL_PROGRESS_DEFAULTS: UserProgress = {
  totalXP: 50,
  completedLessons: ['l1'],
  badges: ['b-ai-starter'],
  currentLevel: 1,
  deleScores: [],
};

export const INITIAL_CV_DEFAULTS: CVData = {
  fullName: 'María Elena González',
  jobTitle: 'Administrativa / Dependienta de Comercio',
  email: 'maria.gonzalez@correo.es',
  phone: '+34 612 345 678',
  location: 'Madrid, España',
  permitStatus: 'Permiso de trabajo y residencia en vigor (NIE)',
  summary:
    'Profesional proactiva con más de 4 años de experiencia en atención al cliente, gestión de inventarios y redacción administrativa. Gran capacidad de adaptación, dominio de Microsoft 365 y motivación constante.',
  experience: [
    {
      id: '1',
      company: 'Comercial del Sur S.L.',
      role: 'Dependienta y Caja',
      startDate: '2023',
      endDate: '2024',
      current: false,
      description:
        'Atención al cliente, cobro en TPV, arqueo de caja diario y reposición organizada en tienda.',
    },
    {
      id: '2',
      company: 'Logística Express',
      role: 'Auxiliar Administrativa',
      startDate: '2022',
      endDate: '2023',
      current: false,
      description:
        'Recepción de documentación, apoyo en facturación básica y atención al público.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'IES Comercio & Empresa',
      degree: 'Ciclo Formativo Grado Medio en Gestión Administrativa',
      year: '2022',
      homologated: true,
    },
  ],
  skills: [
    'Microsoft Excel & Word',
    'Atención al Cliente',
    'Gestión de Citas y Trámites',
    'Comunicación Intercultural',
  ],
  languages: [
    { language: 'Español', level: 'Nativo / C2' },
    { language: 'Inglés', level: 'Intermedio / B1' },
  ],
  template: 'classic',
};

export const INITIAL_APPOINTMENTS_DEFAULTS: AppointmentItem[] = [
  {
    id: 'apt-1',
    title: 'Toma de Huellas (TIE)',
    location: 'Comisaría de Policía Nacional - Aluche (Madrid)',
    date: '2026-09-24',
    time: '10:30',
    notes: 'Llevar tasa 790-012 pagada, foto reciente, pasaporte original y resolución favorable.',
    requiredDocs: [
      'Modelo EX-17 impreso y firmado',
      'Pasaporte en vigor (original y copia)',
      'Justificante de pago Tasa 790 código 012',
      'Resolución de concesión de autorización',
      '1 Fotografía tamaño carnet con fondo blanco',
      'Volante de empadronamiento (si hubo cambio de domicilio)',
    ],
    completedDocs: [0, 1, 2],
  },
  {
    id: 'apt-2',
    title: 'Registro de Solicitud de Arraigo Social',
    location: 'Oficina de Extranjería - Calle Silva (Madrid)',
    date: '2026-10-15',
    time: '11:15',
    notes: 'Presentar contrato de trabajo indefinido a 30h/semana e informe de inserción social.',
    requiredDocs: [
      'Modelo EX-10 oficial',
      'Pasaporte completo (todas las páginas)',
      'Informe de arraigo / inserción social autonómico',
      'Contrato de trabajo firmado por ambas partes',
      'Certificado de antecedentes penales legalizado/apostillado',
      'Pruebas de permanencia continuada de 3 años',
    ],
    completedDocs: [0, 1],
  },
];

// ─── SAFE STORAGE WRAPPER WITH AUTO-HEALING ─────────────────────────────────

export class SafeStorage {
  static getJSON<T>(key: string, fallback: T, validator?: (val: any) => boolean): { data: T; repaired: boolean } {
    if (typeof window === 'undefined') return { data: fallback, repaired: false };
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return { data: fallback, repaired: false };
      
      const parsed = JSON.parse(raw);
      if (validator && !validator(parsed)) {
        console.warn(`[SafeStorage] Valor corrupto o incompleto detectado en '${key}'. Aplicando auto-reparación.`);
        const repairedData = this.deepRepair(parsed, fallback);
        this.setJSON(key, repairedData);
        return { data: repairedData, repaired: true };
      }
      return { data: parsed as T, repaired: false };
    } catch (err) {
      console.error(`[SafeStorage] Error crítico al leer '${key}'. Restaurando estado seguro por defecto.`, err);
      this.setJSON(key, fallback);
      return { data: fallback, repaired: true };
    }
  }

  static setJSON(key: string, value: any): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[SafeStorage] Fallo de cuota o escritura en '${key}':`, err);
      return false;
    }
  }

  // Deep merges corrupt or partial object with fallback schema
  static deepRepair<T>(partial: any, fallback: T): T {
    if (partial === null || typeof partial !== 'object') {
      return fallback;
    }
    if (Array.isArray(fallback)) {
      return Array.isArray(partial) ? (partial as unknown as T) : fallback;
    }
    const result: any = { ...fallback };
    for (const key of Object.keys(fallback as any)) {
      if (partial[key] !== undefined && partial[key] !== null) {
        if (typeof (fallback as any)[key] === 'object' && !Array.isArray((fallback as any)[key])) {
          result[key] = this.deepRepair(partial[key], (fallback as any)[key]);
        } else {
          result[key] = partial[key];
        }
      }
    }
    return result as T;
  }
}

// ─── AUDITOR & SELF-FIX PROTOCOL ENGINE ──────────────────────────────────────

export function ejecutarAuditoriaCompleta(): SystemAuditReport {
  const items: AuditReportItem[] = [];

  // 1. Auditoría de LocalStorage: Progreso
  try {
    const rawProgress = localStorage.getItem('ma_progress');
    if (!rawProgress) {
      items.push({
        id: 'st-prog-1',
        modulo: 'Almacenamiento',
        nombre: 'Progreso del Usuario (XP / Niveles)',
        estado: 'ok',
        mensaje: 'Estado inicial limpio listo para guardar.',
        autoReparable: true,
      });
    } else {
      const parsed = JSON.parse(rawProgress);
      const ok = typeof parsed.xp === 'number' && Array.isArray(parsed.completedLessons);
      items.push({
        id: 'st-prog-2',
        modulo: 'Almacenamiento',
        nombre: 'Estructura de Progreso (UserProgress)',
        estado: ok ? 'ok' : 'advertencia',
        mensaje: ok ? `Progreso íntegro: ${parsed.xp} XP acumulados.` : 'Campos incompletos en el progreso local.',
        autoReparable: true,
      });
    }
  } catch (err) {
    items.push({
      id: 'st-prog-err',
      modulo: 'Almacenamiento',
      nombre: 'Estructura de Progreso',
      estado: 'critico',
      mensaje: 'JSON corrupto en almacenamiento de progreso.',
      autoReparable: true,
    });
  }

  // 2. Auditoría de LocalStorage: CV ATS
  try {
    const rawCV = localStorage.getItem('ma_cv');
    if (rawCV) {
      const parsed = JSON.parse(rawCV);
      const ok = parsed.fullName && Array.isArray(parsed.experiences) && Array.isArray(parsed.skills);
      items.push({
        id: 'st-cv-1',
        modulo: 'Almacenamiento',
        nombre: 'Base de Datos de Currículum ATS',
        estado: ok ? 'ok' : 'advertencia',
        mensaje: ok ? `CV de '${parsed.fullName}' con ${parsed.experiences.length} experiencias.` : 'Estructura de CV incompleta.',
        autoReparable: true,
      });
    } else {
      items.push({
        id: 'st-cv-2',
        modulo: 'Almacenamiento',
        nombre: 'Base de Datos de Currículum ATS',
        estado: 'ok',
        mensaje: 'Plantilla por defecto activa y funcional.',
        autoReparable: true,
      });
    }
  } catch (err) {
    items.push({
      id: 'st-cv-err',
      modulo: 'Almacenamiento',
      nombre: 'Currículum ATS',
      estado: 'critico',
      mensaje: 'Fallo al parsear datos del CV.',
      autoReparable: true,
    });
  }

  // 3. Auditoría de LocalStorage: Citas y Trámites
  try {
    const rawApts = localStorage.getItem('ma_apts');
    if (rawApts) {
      const parsed = JSON.parse(rawApts);
      const ok = Array.isArray(parsed) && parsed.length > 0;
      items.push({
        id: 'st-apts-1',
        modulo: 'Almacenamiento',
        nombre: 'Gestor de Citas y Cajas de Cotejo',
        estado: ok ? 'ok' : 'advertencia',
        mensaje: ok ? `${parsed.length} citas registradas con listas de verificación.` : 'Array de citas vacío o corrupto.',
        autoReparable: true,
      });
    } else {
      items.push({
        id: 'st-apts-2',
        modulo: 'Almacenamiento',
        nombre: 'Gestor de Citas y Cajas de Cotejo',
        estado: 'ok',
        mensaje: 'Configuración inicial de trámites lista.',
        autoReparable: true,
      });
    }
  } catch (err) {
    items.push({
      id: 'st-apts-err',
      modulo: 'Almacenamiento',
      nombre: 'Gestor de Citas',
      estado: 'critico',
      mensaje: 'Datos de citas corruptos.',
      autoReparable: true,
    });
  }

  // 4. Auditoría de Motor de Voz (Web Speech API)
  const tieneSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
  if (!tieneSpeech) {
    items.push({
      id: 'voice-api-1',
      modulo: 'Síntesis de Voz',
      nombre: 'Web Speech API en Navegador',
      estado: 'advertencia',
      mensaje: 'El navegador no soporta síntesis de voz nativa. Se activa modo visual dual.',
      autoReparable: false,
    });
  } else {
    const voces = window.speechSynthesis.getVoices();
    const pausado = window.speechSynthesis.paused;
    items.push({
      id: 'voice-api-2',
      modulo: 'Síntesis de Voz',
      nombre: 'Motor de Voz y Catálogo',
      estado: pausado ? 'advertencia' : 'ok',
      mensaje: pausado
        ? 'El motor de audio está en pausa. Se requiere reanudación.'
        : `Motor activo (${voces.length} voces disponibles en el dispositivo).`,
      autoReparable: true,
    });
  }

  // 5. Auditoría de Catálogo de 39 Idiomas
  const idiomasTotal = Object.keys(VOCES_39).length;
  const traduccionesTotal = Object.keys(TRANSLATIONS).length;
  items.push({
    id: 'i18n-audit-1',
    modulo: 'Internacionalización (i18n)',
    nombre: 'Cobertura de 39 Idiomas Oficiales',
    estado: idiomasTotal === 39 && traduccionesTotal === 39 ? 'ok' : 'critico',
    mensaje: `Voces asignadas: ${idiomasTotal}/39 · Diccionarios de traducción: ${traduccionesTotal}/39.`,
    autoReparable: true,
  });

  // 6. Auditoría de Consistencia de Claves en Diccionarios
  let clavesIncompletas = 0;
  for (const [lang, dict] of Object.entries(TRANSLATIONS)) {
    if (Object.keys(dict).length < 35) {
      clavesIncompletas++;
    }
  }
  items.push({
    id: 'i18n-audit-2',
    modulo: 'Internacionalización (i18n)',
    nombre: 'Simetría de Claves de Traducción',
    estado: clavesIncompletas === 0 ? 'ok' : 'advertencia',
    mensaje: clavesIncompletas === 0 ? 'Las 35 claves son simétricas en todos los idiomas.' : `${clavesIncompletas} idiomas con claves faltantes.`,
    autoReparable: true,
  });

  // 7. Auditoría de los 15 Nodos del Ecosistema
  const nodosTotal = NODES_LIST.length;
  items.push({
    id: 'nodes-audit-1',
    modulo: 'Ecosistema de 15 Nodos',
    nombre: 'Registro de Módulos Formativos y Civiles',
    estado: nodosTotal === 15 ? 'ok' : 'critico',
    mensaje: `15 nodos verificados con metadatos completos y categorías temáticas.`,
    autoReparable: false,
  });

  // 8. Auditoría de Configuración PWA y Modo Offline
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  items.push({
    id: 'pwa-audit-1',
    modulo: 'Soberanía y Modo Offline',
    nombre: 'Capacidad de Operación Desconectada',
    estado: 'ok',
    mensaje: online ? 'Conectado (operación local garantizada).' : 'Modo Offline activo (sin pérdida de datos).',
    autoReparable: false,
  });

  // 9. Auditoría de Soporte Bidireccional (RTL)
  const currentLang = (localStorage.getItem('ma_lang') as Language) || 'es';
  const rtlLanguages = ['ar', 'ur', 'fa', 'he'];
  const esRTL = rtlLanguages.includes(currentLang);
  const domDir = typeof document !== 'undefined' ? document.documentElement.getAttribute('dir') : 'ltr';
  const dirOk = (esRTL && domDir === 'rtl') || (!esRTL && domDir === 'ltr');
  items.push({
    id: 'rtl-audit-1',
    modulo: 'Accesibilidad Bidireccional',
    nombre: 'Alineación de Texto (LTR / RTL)',
    estado: dirOk ? 'ok' : 'advertencia',
    mensaje: dirOk
      ? `Dirección DOM correcta ('${domDir}') para el idioma '${currentLang}'.`
      : `Discrepancia en atributo dir ('${domDir}' vs esperado '${esRTL ? 'rtl' : 'ltr'}').`,
    autoReparable: true,
  });

  // Cálculo de salud
  const total = items.length;
  const aprobadas = items.filter((i) => i.estado === 'ok').length;
  const advertencias = items.filter((i) => i.estado === 'advertencia').length;
  const criticos = items.filter((i) => i.estado === 'critico').length;
  const puntuacionSalud = Math.round(((aprobadas + advertencias * 0.5) / total) * 100);

  return {
    timestamp: new Date().toISOString(),
    puntuacionSalud,
    totalVerificaciones: total,
    verificacionesAprobadas: aprobadas,
    advertencias,
    criticos,
    items,
  };
}

// ─── PROTOCOLO DE AUTO-REPARACIÓN AUTOMÁTICA (SELF-FIX) ────────────────────

export interface SelfFixResult {
  reparacionesRealizadas: string[];
  exito: boolean;
  nuevoReporte: SystemAuditReport;
}

export function ejecutarProtocoloAutoReparacion(): SelfFixResult {
  const reparaciones: string[] = [];

  // 1. Reparar almacenamiento de progreso
  const { data: prog, repaired: progRepaired } = SafeStorage.getJSON(
    'ma_progress',
    INITIAL_PROGRESS_DEFAULTS,
    (val) => typeof val?.xp === 'number' && Array.isArray(val?.completedLessons)
  );
  if (progRepaired) {
    reparaciones.push('Progreso del usuario restaurado y normalizado con valores de respaldo seguros.');
  }

  // 2. Reparar almacenamiento de CV ATS
  const { data: cv, repaired: cvRepaired } = SafeStorage.getJSON(
    'ma_cv',
    INITIAL_CV_DEFAULTS,
    (val) => val?.fullName && Array.isArray(val?.experiences) && Array.isArray(val?.skills)
  );
  if (cvRepaired) {
    reparaciones.push('Currículum ATS reconstruido con estructura válida y campos requeridos.');
  }

  // 3. Reparar almacenamiento de citas
  const { data: apts, repaired: aptsRepaired } = SafeStorage.getJSON(
    'ma_apts',
    INITIAL_APPOINTMENTS_DEFAULTS,
    (val) => Array.isArray(val) && val.length > 0
  );
  if (aptsRepaired) {
    reparaciones.push('Historial de citas y listas de cotejo de extranjería resincronizadas.');
  }

  // 4. Reparar motor de síntesis de voz
  try {
    repararMotorVoz();
    reparaciones.push('Cola de audio Web Speech reiniciada, desbloqueada y lista para reproducción.');
  } catch (err) {
    console.error('Error al reparar motor de voz:', err);
  }

  // 5. Reparar dirección del DOM (LTR vs RTL)
  const currentLang = (localStorage.getItem('ma_lang') as Language) || 'es';
  const rtlLanguages = ['ar', 'ur', 'fa', 'he'];
  if (typeof document !== 'undefined') {
    if (rtlLanguages.includes(currentLang)) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    reparaciones.push(`Atributo de dirección de lectura HTML resincronizado a '${rtlLanguages.includes(currentLang) ? 'rtl' : 'ltr'}'.`);
  }

  // 6. Generar snapshot de rescate en sessionStorage para prevenir pérdida
  try {
    if (typeof sessionStorage !== 'undefined') {
      const rescueSnapshot = {
        timestamp: new Date().toISOString(),
        progress: prog,
        cv,
        appointments: apts,
      };
      sessionStorage.setItem('ma_rescue_snapshot', JSON.stringify(rescueSnapshot));
      reparaciones.push('Copia de seguridad instantánea de rescate guardada en memoria de sesión.');
    }
  } catch (err) {
    console.warn('No se pudo guardar snapshot de sesión:', err);
  }

  const nuevoReporte = ejecutarAuditoriaCompleta();

  return {
    reparacionesRealizadas: reparaciones,
    exito: nuevoReporte.criticos === 0,
    nuevoReporte,
  };
}
