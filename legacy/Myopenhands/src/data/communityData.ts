export interface Association {
  id: string;
  name: string;
  province: string;
  region: string;
  focus: string;
  address: string;
  contact: string;
  services: string[];
}

export const ASSOCIATIONS_DIRECTORY: Association[] = [
  {
    id: 'asoc-mad-1',
    name: 'Red Interlavapiés',
    province: 'Madrid',
    region: 'Comunidad de Madrid',
    focus: 'Apoyo vecinal, defensa de derechos de migrantes y acogida comunitaria',
    address: 'Barrio de Lavapiés, Madrid',
    contact: 'redinterlavapies@gmail.com',
    services: ['Acompañamiento a extranjería', 'Clases de español', 'Apoyo al empadronamiento', 'Asamblea abierta']
  },
  {
    id: 'asoc-mad-2',
    name: 'Asociación Sin Papeles de Madrid (ASPM)',
    province: 'Madrid',
    region: 'Comunidad de Madrid',
    focus: 'Autoorganización de trabajadores migrantes y defensa laboral',
    address: 'Calle del Calvario, Madrid',
    contact: 'aspmadrid@movimientos.org',
    services: ['Asesoría laboral sin coste', 'Talleres sobre arraigo', 'Campaña por la regularización']
  },
  {
    id: 'asoc-bcn-1',
    name: 'Espacio del Inmigrante Raval',
    province: 'Barcelona',
    region: 'Cataluña',
    focus: 'Salud comunitaria, defensa contra el racismo y empoderamiento',
    address: 'Carrer de l\'Hospital, El Raval, Barcelona',
    contact: 'espaciodelinmigrante@gmail.com',
    services: ['Punto de salud sin papeles', 'Acompañamiento CAP', 'Asesoría jurídica', 'Intercambio lingüístico']
  },
  {
    id: 'asoc-bcn-2',
    name: 'Federación de Colectivos de Inmigrantes de Cataluña (Fedelatina)',
    province: 'Barcelona',
    region: 'Cataluña',
    focus: 'Integración sociocultural, formación y bolsa de empleo',
    address: 'Carrer de Nàpols, Barcelona',
    contact: 'info@fedelatina.org',
    services: ['Orientación laboral', 'Cursos certificados', 'Trámites de extranjería', 'Actividades culturales']
  },
  {
    id: 'asoc-val-1',
    name: 'Valencia Acoge / València Acull',
    province: 'Valencia',
    region: 'Comunitat Valenciana',
    focus: 'Solidaridad, integración ciudadana y defensa jurídica',
    address: 'Carrer de San José de Calasanz, Valencia',
    contact: 'valencia.acoge@redacoge.org',
    services: ['Asesoría jurídica especializada', 'Clases de castellano y valenciano', 'Inserción sociolaboral']
  },
  {
    id: 'asoc-sev-1',
    name: 'Sevilla Acoge',
    province: 'Sevilla',
    region: 'Andalucía',
    focus: 'Atención integral a personas migrantes en Andalucía',
    address: 'Calle Pasaje Mallol, Sevilla',
    contact: 'sevilla.acoge@redacoge.org',
    services: ['Vivienda tutelada', 'Formación para el empleo', 'Atención psicológica', 'Traducción']
  },
  {
    id: 'asoc-bio-1',
    name: 'SOS Racismo Bizkaia / SOS Arrazakeria',
    province: 'Bizkaia',
    region: 'País Vasco',
    focus: 'Denuncia contra la discriminación, asesoría legal y acogida',
    address: 'Calle Henao, Bilbao',
    contact: 'bizkaia@sosracismo.eu',
    services: ['Oficina de denuncias de racismo', 'Asesoría de extranjería', 'Clases de euskera y castellano']
  },
  {
    id: 'asoc-mal-1',
    name: 'Málaga Acoge',
    province: 'Málaga',
    region: 'Andalucía',
    focus: 'Promoción de la convivencia ciudadana intercultural',
    address: 'Calle Bustamante, Málaga',
    contact: 'malaga.acoge@redacoge.org',
    services: ['Orientación a familias', 'Apoyo escolar a menores', 'Formación para empleo en hostelería']
  },
  {
    id: 'asoc-zar-1',
    name: 'Asociación de Inmigrantes Senegaleses en Aragón (AISA)',
    province: 'Zaragoza',
    region: 'Aragón',
    focus: 'Cohesión comunitaria, mediación y proyectos de desarrollo',
    address: 'Calle San Pablo, Casco Histórico, Zaragoza',
    contact: 'aisa.aragon@gmail.com',
    services: ['Mediación intercultural', 'Traducción wolof/francés', 'Talleres comunitarios']
  }
];

export const COMMUNITY_EVENTS = [
  {
    id: 'evt-1',
    title: 'Taller Práctico: Cómo preparar la documentación para Arraigo',
    date: 'Todos los martes, 18:00 h',
    format: 'Presencial y Streaming Online',
    organizer: 'Red Acoge & Manos Abiertas',
    cost: 'Gratuito',
    description: 'Revisión de carpetas de documentos: empadronamiento continuado, antecedentes penales, tasas y contrato de trabajo.'
  },
  {
    id: 'evt-2',
    title: 'Intercambio de Idiomas Español - Inglés - Árabe - Francés',
    date: 'Jueves y sábados, 17:30 h',
    format: 'Centros cívicos y salas virtuales',
    organizer: 'Espacio Abierto Intercultural',
    cost: 'Gratuito',
    description: 'Práctica de conversación informal para ganar fluidez en español de cara al examen DELE y la vida diaria.'
  },
  {
    id: 'evt-3',
    title: 'Café de Orientación Laboral y Revisión de CV en Directo',
    date: 'Primer viernes de cada mes, 16:00 h',
    format: 'Presencial / Online',
    organizer: 'Voluntarios de Recursos Humanos',
    cost: 'Gratuito',
    description: 'Profesionales de RRHH revisan tu currículum, te ayudan a mejorar tu perfil en LinkedIn y simulan entrevistas.'
  }
];
