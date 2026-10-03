export const SUPPORTED_LOCALES = ['es', 'en', 'pt'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  pt: 'PT',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
};

export const messages = {
  es: {
    'nav.home': 'Inicio',
    'nav.quantum': 'Experiencia Cuántica',
    'nav.omni': 'OMNI',
    'nav.pricing': 'Precios',
    'nav.about': 'Acerca de',
    'action.subscribe': 'Suscribirse',
    'action.logout': 'Salir',
    'action.openMenu': 'Abrir menú',
    'action.closeMenu': 'Cerrar menú',
    'language.label': 'Idioma',
    'language.change': 'Cambiar idioma',
    'runtime.ready': 'Runtime local preparado.',
    'runtime.active': 'Activo',
  },
  en: {
    'nav.home': 'Home',
    'nav.quantum': 'Quantum Experience',
    'nav.omni': 'OMNI',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'action.subscribe': 'Subscribe',
    'action.logout': 'Log out',
    'action.openMenu': 'Open menu',
    'action.closeMenu': 'Close menu',
    'language.label': 'Language',
    'language.change': 'Change language',
    'runtime.ready': 'Local runtime ready.',
    'runtime.active': 'Active',
  },
  pt: {
    'nav.home': 'Início',
    'nav.quantum': 'Experiência Quântica',
    'nav.omni': 'OMNI',
    'nav.pricing': 'Preços',
    'nav.about': 'Sobre',
    'action.subscribe': 'Assinar',
    'action.logout': 'Sair',
    'action.openMenu': 'Abrir menu',
    'action.closeMenu': 'Fechar menu',
    'language.label': 'Idioma',
    'language.change': 'Mudar idioma',
    'runtime.ready': 'Runtime local pronto.',
    'runtime.active': 'Ativo',
  },
} as const;

export type TranslationKey = keyof typeof messages.es;
export type TranslationMessages = typeof messages.es;

export const detectLocale = (): Locale => {
  if (typeof window === 'undefined') return 'es';
  const persisted = window.localStorage.getItem('belentani_locale');
  if (SUPPORTED_LOCALES.includes(persisted as Locale)) return persisted as Locale;
  const browserLanguage = navigator.language.toLowerCase().split('-')[0] as Locale;
  return SUPPORTED_LOCALES.includes(browserLanguage) ? browserLanguage : 'es';
};
