// ─── MAPA DE VOCES POR IDIOMA (39 idiomas, voces humanas únicas) ───────────────
import { Language } from '../types';

export interface VozConfig {
  vozPrincipal: string;
  alternativa: string;
  genero: 'femenino' | 'masculino';
  velocidad: number;
  tono: number;
  rtl?: boolean;
  nombre: string;
}

export const VOCES_39: Record<Language, VozConfig> = {
  es: { vozPrincipal: 'Google español', alternativa: 'Microsoft Helena', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Español' },
  en: { vozPrincipal: 'Google US English', alternativa: 'Microsoft Aria', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'English' },
  pt: { vozPrincipal: 'Google português do Brasil', alternativa: 'Microsoft Francisca', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Português' },
  ca: { vozPrincipal: 'Google català', alternativa: 'Microsoft Montserrat', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Català' },
  ar: { vozPrincipal: 'Google العربية', alternativa: 'Microsoft Salma', genero: 'femenino', velocidad: 0.9, tono: 1.0, rtl: true, nombre: 'العربية' },
  fr: { vozPrincipal: 'Google français', alternativa: 'Microsoft Denise', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Français' },
  de: { vozPrincipal: 'Google Deutsch', alternativa: 'Microsoft Katja', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Deutsch' },
  it: { vozPrincipal: 'Google italiano', alternativa: 'Microsoft Elsa', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Italiano' },
  ru: { vozPrincipal: 'Google русский', alternativa: 'Microsoft Svetlana', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Русский' },
  zh: { vozPrincipal: 'Google 中文', alternativa: 'Microsoft Xiaoxiao', genero: 'femenino', velocidad: 0.9, tono: 1.0, nombre: '中文' },
  ja: { vozPrincipal: 'Google 日本語', alternativa: 'Microsoft Nanami', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: '日本語' },
  ko: { vozPrincipal: 'Google 한국어', alternativa: 'Microsoft SunHi', genero: 'femenino', velocidad: 0.9, tono: 1.0, nombre: '한국어' },
  hi: { vozPrincipal: 'Google हिन्दी', alternativa: 'Microsoft Swara', genero: 'femenino', velocidad: 0.9, tono: 1.0, nombre: 'हिन्दी' },
  bn: { vozPrincipal: 'Google বাংলা', alternativa: 'Microsoft Tanishaa', genero: 'femenino', velocidad: 0.9, tono: 1.0, nombre: 'বাংলা' },
  ur: { vozPrincipal: 'Google اردو', alternativa: 'Microsoft Uzma', genero: 'femenino', velocidad: 0.9, tono: 1.0, rtl: true, nombre: 'اردو' },
  fa: { vozPrincipal: 'Google فارسی', alternativa: 'Microsoft Dilara', genero: 'femenino', velocidad: 0.9, tono: 1.0, rtl: true, nombre: 'فارسی' },
  tr: { vozPrincipal: 'Google Türkçe', alternativa: 'Microsoft Emel', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Türkçe' },
  nl: { vozPrincipal: 'Google Nederlands', alternativa: 'Microsoft Colette', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Nederlands' },
  pl: { vozPrincipal: 'Google polski', alternativa: 'Microsoft Paulina', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Polski' },
  uk: { vozPrincipal: 'Google українська', alternativa: 'Microsoft Polina', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Українська' },
  ro: { vozPrincipal: 'Google română', alternativa: 'Microsoft Alina', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Română' },
  el: { vozPrincipal: 'Google Ελληνικά', alternativa: 'Microsoft Athina', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Ελληνικά' },
  cs: { vozPrincipal: 'Google čeština', alternativa: 'Microsoft Vlasta', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Čeština' },
  sv: { vozPrincipal: 'Google svenska', alternativa: 'Microsoft Hillevi', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Svenska' },
  da: { vozPrincipal: 'Google dansk', alternativa: 'Microsoft Naja', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Dansk' },
  fi: { vozPrincipal: 'Google suomi', alternativa: 'Microsoft Noora', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Suomi' },
  no: { vozPrincipal: 'Google norsk', alternativa: 'Microsoft Nora', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Norsk' },
  hu: { vozPrincipal: 'Google magyar', alternativa: 'Microsoft Szabolcs', genero: 'masculino', velocidad: 0.95, tono: 1.0, nombre: 'Magyar' },
  bg: { vozPrincipal: 'Google български', alternativa: 'Microsoft Kalina', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Български' },
  sk: { vozPrincipal: 'Google slovenčina', alternativa: 'Microsoft Viktoria', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Slovenčina' },
  sl: { vozPrincipal: 'Google slovenščina', alternativa: 'Microsoft Mojca', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Slovenščina' },
  lt: { vozPrincipal: 'Google lietuvių', alternativa: 'Microsoft Ona', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Lietuvių' },
  lv: { vozPrincipal: 'Google latviešu', alternativa: 'Microsoft Everita', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Latviešu' },
  et: { vozPrincipal: 'Google eesti', alternativa: 'Microsoft Anu', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Eesti' },
  he: { vozPrincipal: 'Google עברית', alternativa: 'Microsoft Hila', genero: 'femenino', velocidad: 0.95, tono: 1.0, rtl: true, nombre: 'עברית' },
  th: { vozPrincipal: 'Google ไทย', alternativa: 'Microsoft Premwadee', genero: 'femenino', velocidad: 0.9, tono: 1.0, nombre: 'ไทย' },
  vi: { vozPrincipal: 'Google Tiếng Việt', alternativa: 'Microsoft HoaiMy', genero: 'femenino', velocidad: 0.95, tono: 1.0, nombre: 'Tiếng Việt' },
  id: { vozPrincipal: 'Google Bahasa Indonesia', alternativa: 'Microsoft Ardi', genero: 'masculino', velocidad: 1.0, tono: 1.0, nombre: 'Bahasa Indonesia' },
  sw: { vozPrincipal: 'Google Kiswahili', alternativa: 'Microsoft Rehema', genero: 'femenino', velocidad: 1.0, tono: 1.0, nombre: 'Kiswahili' },
};

// Cache local de voces del sistema
let vocesDisponiblesCache: SpeechSynthesisVoice[] = [];
let antiStallTimer: any = null;

// Inicialización resiliente del catálogo de voces
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const cargarVoces = () => {
    try {
      vocesDisponiblesCache = window.speechSynthesis.getVoices();
    } catch {
      vocesDisponiblesCache = [];
    }
  };

  cargarVoces();
  if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }
}

export function repararMotorVoz(): { soportado: boolean; totalVoces: number; reanudado: boolean } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { soportado: false, totalVoces: 0, reanudado: false };
  }

  try {
    if (antiStallTimer) {
      clearInterval(antiStallTimer);
      antiStallTimer = null;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    vocesDisponiblesCache = window.speechSynthesis.getVoices();
    return {
      soportado: true,
      totalVoces: vocesDisponiblesCache.length,
      reanudado: true,
    };
  } catch (err) {
    console.error('Fallo en repararMotorVoz:', err);
    return { soportado: true, totalVoces: 0, reanudado: false };
  }
}

export function seleccionarVozPorIdioma(idioma: Language): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voces = vocesDisponiblesCache.length > 0 ? vocesDisponiblesCache : window.speechSynthesis.getVoices();
  const config = VOCES_39[idioma];
  if (!config) return null;

  // 1. Intentar voz principal exacta
  const exacta = voces.find((v) => v.name === config.vozPrincipal);
  if (exacta) return exacta;

  // 2. Intentar alternativa
  const alternativa = voces.find((v) => v.name === config.alternativa);
  if (alternativa) return alternativa;

  // 3. Fallback: primera voz que coincida con el código de idioma
  const porIdioma = voces.find((v) => v.lang.toLowerCase().startsWith(idioma.toLowerCase()));
  if (porIdioma) return porIdioma;

  return voces[0] || null;
}

export function hablarTexto(texto: string, idioma: Language, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    if (antiStallTimer) {
      clearInterval(antiStallTimer);
      antiStallTimer = null;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(texto);
    const voz = seleccionarVozPorIdioma(idioma);
    if (voz) {
      utterance.voice = voz;
    }
    utterance.lang = idioma;
    utterance.rate = VOCES_39[idioma]?.velocidad ?? 1.0;
    utterance.pitch = VOCES_39[idioma]?.tono ?? 1.0;

    const cleanup = () => {
      if (antiStallTimer) {
        clearInterval(antiStallTimer);
        antiStallTimer = null;
      }
      if (onEnd) onEnd();
    };

    utterance.onend = cleanup;
    utterance.onerror = cleanup;

    // Chrome anti-stall keeper: resume periodically if talking
    antiStallTimer = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        if (antiStallTimer) {
          clearInterval(antiStallTimer);
          antiStallTimer = null;
        }
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 5000);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Error en hablarTexto:', err);
    if (onEnd) onEnd();
  }
}

