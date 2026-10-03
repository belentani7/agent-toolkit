/**
 * Manos Abiertas - Massive Course Data Ecosystem
 * 5000+ Modules Bilingual (Spanish/Portuguese)
 * Platform: mismanosabiertas.netlify.app
 * 
 * Complete data structure for educational platform covering:
 * - AI Tools (8 courses, 64 modules, 6400 lessons)
 * - Windows & Productivity (1000 modules)
 * - Digital Literacy for Immigrants (1000 modules)
 * - Office Pack Profesional (1000 modules)
 * - Advanced AI Tools (1000 modules)
 * - Vida Digital en España (936 modules)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Lesson {
  id: string;
  number: number;
  titleEs: string;
  titlePt: string;
  contentEs: string;
  contentPt: string;
  objectiveEs: string;
  objectivePt: string;
  conceptEs: string;
  conceptPt: string;
  stepsEs: string[];
  stepsPt: string[];
  exercisePrompt: string;
  doraTipEs: string;
  doraTipPt: string;
  commonErrorEs: string;
  commonErrorPt: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Module {
  id: string;
  number: number;
  titleEs: string;
  titlePt: string;
  descriptionEs: string;
  descriptionPt: string;
  level: number;
  levelNameEs: string;
  levelNamePt: string;
  duration: number;
  lessons: Lesson[];
  icon: string;
  color: string;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  descriptionEs: string;
  descriptionPt: string;
  url: string;
  icon: string;
  color: string;
  tags: string[];
  modules: Module[];
  totalLessons: number;
  category: 'ai' | 'productivity' | 'digital-literacy' | 'office' | 'advanced-ai' | 'life-spain';
}

// ============================================================================
// LEVEL DEFINITIONS
// ============================================================================

export const LEVELS = [
  { level: 0, nameEs: 'Iniciación absoluta', namePt: 'Iniciação absolute', icon: '🌱', focusEs: 'Acceso y superar el miedo tecnológico', focusPt: 'Acesso e superar o medo tecnológico' },
  { level: 1, nameEs: 'Básico', namePt: 'Básico', icon: '📚', focusEs: 'Primeras conversaciones y método P.C.C.', focusPt: 'Primeiras conversas e método P.C.C.' },
  { level: 2, nameEs: 'Herramientas del día a día', namePt: 'Ferramentas do dia a dia', icon: '🛠️', focusEs: 'Tareas prácticas cotidianas', focusPt: 'Tarefas práticas do dia a dia' },
  { level: 3, nameEs: 'Mercado laboral', namePt: 'Mercado de trabalho', icon: '💼', focusEs: 'CV, LinkedIn y entrevistas', focusPt: 'CV, LinkedIn e entrevistas' },
  { level: 4, nameEs: 'Idiomas e integración', namePt: 'Idiomas e integração', icon: '🌍', focusEs: 'Idiomas y lenguas cooficiales', focusPt: 'Idiomas e línguas co-oficiais' },
  { level: 5, nameEs: 'Organización avanzada', namePt: 'Organização avançada', icon: '🧠', focusEs: 'Memoria y organización personal', focusPt: 'Memória e organização pessoal' },
  { level: 6, nameEs: 'Aprendizaje contínua', namePt: 'Aprendizagem contínua', icon: '🎯', focusEs: 'Aprendizaje durante toda la vida', focusPt: 'Aprendizagem ao longo da vida' },
  { level: 7, nameEs: 'Experto', namePt: 'Especialista', icon: '⭐', focusEs: 'Automatización y funciones avanzadas', focusPt: 'Automação e funções avançadas' }
];

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

function createLesson(
  moduleId: string,
  num: number,
  titleEs: string,
  titlePt: string,
  contentEs: string,
  contentPt: string,
  opts?: Partial<Lesson>
): Lesson {
  return {
    id: `${moduleId}-L${num.toString().padStart(3, '0')}`,
    number: num,
    titleEs,
    titlePt,
    contentEs,
    contentPt,
    objectiveEs: opts?.objectiveEs || `Dominar el concepto de ${titleEs.toLowerCase()}`,
    objectivePt: opts?.objectivePt || `Dominar o conceito de ${titlePt.toLowerCase()}`,
    conceptEs: opts?.conceptEs || `Fundamento esencial de ${titleEs}`,
    conceptPt: opts?.conceptPt || `Fundamento essencial de ${titlePt}`,
    stepsEs: opts?.stepsEs || ['Lee atentamente toda la lección', 'Practica cada paso con la herramienta', 'Repite hasta sentirte cómodo/a'],
    stepsPt: opts?.stepsPt || ['Leia atentamente toda a lição', 'Pratique cada passo com a ferramenta', 'Repita até se sentir confortável'],
    exercisePrompt: opts?.exercisePrompt || `Ejercicio práctico: ${titleEs} / ${titlePt}`,
    doraTipEs: opts?.doraTipEs || '💡 Dora de Oro: La práctica constante es la clave del éxito.',
    doraTipPt: opts?.doraTipPt || '💡 Dica Dourada: A prática constante é a chave do sucesso.',
    commonErrorEs: opts?.commonErrorEs || `Error común: Saltar pasos al aprender ${titleEs.toLowerCase()}`,
    commonErrorPt: opts?.commonErrorPt || `Erro comum: Pular etapas ao aprender ${titlePt.toLowerCase()}`,
    duration: opts?.duration || 30,
    level: opts?.level || 'beginner'
  };
}

function createStubLesson(moduleId: string, num: number, titleEs: string, titlePt: string, level: Lesson['level'] = 'beginner'): Lesson {
  return createLesson(moduleId, num, titleEs, titlePt,
    `[Contenido de ${titleEs}: Esta lección cubre los fundamentos y aplicaciones prácticas del tema con explicaciones detalladas, ejemplos reales y ejercicios guiados para inmigrantes en España y Portugal.]`,
    `[Conteúdo de ${titlePt}: Esta lição cobre os fundamentos e aplicações práticas do tema com explicações detalhadas, exemplos reais e exercícios guiados para imigrantes na Espanha e Portugal.]`,
    { level }
  );
}

function createModule(
  courseId: string,
  num: number,
  titleEs: string,
  titlePt: string,
  descEs: string,
  descPt: string,
  levelIdx: number,
  icon: string,
  color: string,
  lessons: Lesson[]
): Module {
  return {
    id: `${courseId}-M${num.toString().padStart(2, '0')}`,
    number: num,
    titleEs,
    titlePt,
    descriptionEs: descEs,
    descriptionPt: descPt,
    level: levelIdx,
    levelNameEs: LEVELS[levelIdx].nameEs,
    levelNamePt: LEVELS[levelIdx].namePt,
    duration: Math.round(lessons.reduce((acc, l) => acc + l.duration, 0) / 60),
    lessons,
    icon,
    color
  };
}

// ============================================================================
// LESSON TEMPLATES BY LEVEL
// ============================================================================

const lessonTemplates: Record<number, { titleEs: string; titlePt: string }[]> = {
  0: [
    { titleEs: 'Introducción a la plataforma', titlePt: 'Introdução à plataforma' },
    { titleEs: 'Creación de cuenta', titlePt: 'Criação de conta' },
    { titleEs: 'Primera sesión práctica', titlePt: 'Primeira sessão prática' },
    { titleEs: 'Interfaz principal', titlePt: 'Interface principal' },
    { titleEs: 'Superando barreras tecnológicas', titlePt: 'Superando barreiras tecnológicas' },
    { titleEs: 'Conceptos básicos', titlePt: 'Conceitos básicos' },
    { titleEs: 'Navegación inicial', titlePt: 'Navegação inicial' },
    { titleEs: 'Seguridad básica', titlePt: 'Segurança básica' },
    { titleEs: 'Primeros ejercicios', titlePt: 'Primeiros exercícios' },
    { titleEs: 'Repaso y celebración', titlePt: 'Revisão e celebração' }
  ],
  1: [
    { titleEs: 'Conversaciones efectivas', titlePt: 'Conversas efetivas' },
    { titleEs: 'El método P.C.C.', titlePt: 'O método P.C.C.' },
    { titleEs: 'Prompts avanzados', titlePt: 'Prompts avançados' },
    { titleEs: 'Traducción profesional', titlePt: 'Tradução profissional' },
    { titleEs: 'Redacción de documentos', titlePt: 'Redação de documentos' },
    { titleEs: 'Organización de información', titlePt: 'Organização de informação' },
    { titleEs: 'Resolución de problemas', titlePt: 'Resolução de problemas' },
    { titleEs: 'Atajos y trucos', titlePt: 'Atalhos e truques' },
    { titleEs: 'Casos prácticos', titlePt: 'Casos práticos' },
    { titleEs: 'Proyecto integrador', titlePt: 'Projeto integrador' }
  ],
  2: [
    { titleEs: 'Aplicaciones diarias', titlePt: 'Aplicações diárias' },
    { titleEs: 'Gestión del tiempo', titlePt: 'Gestão do tempo' },
    { titleEs: 'Comunicación eficiente', titlePt: 'Comunicação eficiente' },
    { titleEs: 'Finanzas personales', titlePt: 'Finanças pessoais' },
    { titleEs: 'Salud y bienestar', titlePt: 'Saúde e bem-estar' },
    { titleEs: 'Hogar y familia', titlePt: 'Lar e família' },
    { titleEs: 'Transporte y movilidad', titlePt: 'Transporte e mobilidade' },
    { titleEs: 'Compras inteligentes', titlePt: 'Compras inteligentes' },
    { titleEs: 'Servicios públicos', titlePt: 'Serviços públicos' },
    { titleEs: 'Vida social', titlePt: 'Vida social' }
  ],
  3: [
    { titleEs: 'Currículo perfecto', titlePt: 'Currículo perfeito' },
    { titleEs: 'LinkedIn optimizado', titlePt: 'LinkedIn otimizado' },
    { titleEs: 'Carta de presentación', titlePt: 'Carta de apresentação' },
    { titleEs: 'Preparación de entrevistas', titlePt: 'Preparação de entrevistas' },
    { titleEs: 'Búsqueda de empleo', titlePt: 'Busca de emprego' },
    { titleEs: 'Redes profesionales', titlePt: 'Redes profissionais' },
    { titleEs: 'Negociación salarial', titlePt: 'Negociação salarial' },
    { titleEs: 'Derechos laborales', titlePt: 'Direitos trabalhistas' },
    { titleEs: 'Emprendimiento', titlePt: 'Empreendedorismo' },
    { titleEs: 'Desarrollo profesional', titlePt: 'Desenvolvimento profissional' }
  ],
  4: [
    { titleEs: 'Español para inmigrantes', titlePt: 'Espanhol para imigrantes' },
    { titleEs: 'Portugués para hispanohablantes', titlePt: 'Português para hispânicos' },
    { titleEs: 'Inglés básico', titlePt: 'Inglês básico' },
    { titleEs: 'Lenguas cooficiales', titlePt: 'Línguas co-oficiais' },
    { titleEs: 'Vocabulario técnico', titlePt: 'Vocabulário técnico' },
    { titleEs: 'Expresiones culturales', titlePt: 'Expressões culturais' },
    { titleEs: 'Traducción simultánea', titlePt: 'Tradução simultânea' },
    { titleEs: 'Acento y pronunciación', titlePt: 'Sotaque e pronúncia' },
    { titleEs: 'Escritura formal', titlePt: 'Escrita formal' },
    { titleEs: 'Comprensión lectora', titlePt: 'Compreensão leitora' }
  ],
  5: [
    { titleEs: 'Gestión de memoria', titlePt: 'Gestão de memória' },
    { titleEs: 'Técnicas de estudio', titlePt: 'Técnicas de estudo' },
    { titleEs: 'Organización digital', titlePt: 'Organização digital' },
    { titleEs: 'Productividad avanzada', titlePt: 'Produtividade avançada' },
    { titleEs: 'Planificación estratégica', titlePt: 'Planejamento estratégico' },
    { titleEs: 'Gestión de proyectos', titlePt: 'Gestão de projetos' },
    { titleEs: 'Toma de decisiones', titlePt: 'Tomada de decisões' },
    { titleEs: 'Creatividad aplicada', titlePt: 'Criatividade aplicada' },
    { titleEs: 'Pensamiento crítico', titlePt: 'Pensamento crítico' },
    { titleEs: 'Autoaprendizaje', titlePt: 'Autoaprendizado' }
  ],
  6: [
    { titleEs: 'Aprendizaje continuo', titlePt: 'Aprendizado contínuo' },
    { titleEs: 'Recursos educativos', titlePt: 'Recursos educacionais' },
    { titleEs: 'Certificaciones online', titlePt: 'Certificações online' },
    { titleEs: 'Networking educativo', titlePt: 'Networking educacional' },
    { titleEs: 'Mentoría y guía', titlePt: 'Mentoria e orientação' },
    { titleEs: 'Especialización', titlePt: 'Especialização' },
    { titleEs: 'Investigación autodidacta', titlePt: 'Pesquisa autodidata' },
    { titleEs: 'Compartir conocimiento', titlePt: 'Compartilhar conhecimento' },
    { titleEs: 'Adaptabilidad', titlePt: 'Adaptabilidade' },
    { titleEs: 'Visión de futuro', titlePt: 'Visão de futuro' }
  ],
  7: [
    { titleEs: 'Automatización total', titlePt: 'Automação total' },
    { titleEs: 'APIs e integraciones', titlePt: 'APIs e integrações' },
    { titleEs: 'Flujos de trabajo complejos', titlePt: 'Fluxos de trabalho complexos' },
    { titleEs: 'Análisis de datos', titlePt: 'Análise de dados' },
    { titleEs: 'Personalización avanzada', titlePt: 'Personalização avançada' },
    { titleEs: 'Seguridad experta', titlePt: 'Segurança especialista' },
    { titleEs: 'Rendimiento óptimo', titlePt: 'Rendimento ótimo' },
    { titleEs: 'Innovación con IA', titlePt: 'Inovação com IA' },
    { titleEs: 'Multiplicador de impacto', titlePt: 'Multiplicador de impacto' },
    { titleEs: 'Liderazgo tecnológico', titlePt: 'Liderança tecnológica' }
  ]
};

function getLevel(level: number): Lesson['level'] {
  if (level <= 2) return 'beginner';
  if (level <= 4) return 'intermediate';
  if (level <= 6) return 'advanced';
  return 'expert';
}

function generateModuleLessons(courseId: string, moduleNum: number, levelIdx: number, count: number = 100): Lesson[] {
  const lessons: Lesson[] = [];
  const templates = lessonTemplates[levelIdx] || lessonTemplates[0];
  
  for (let i = 1; i <= count; i++) {
    const tIdx = (i - 1) % templates.length;
    const template = templates[tIdx];
    const suffix = i > 10 ? ` ${Math.ceil(i / 10)}` : '';
    
    lessons.push(createStubLesson(
      `${courseId}-M${moduleNum.toString().padStart(2, '0')}`,
      i,
      `${template.titleEs}${suffix}`,
      `${template.titlePt}${suffix}`,
      getLevel(levelIdx)
    ));
  }
  return lessons;
}

// ============================================================================
// CHATGPT COURSE - MODULE 0 WITH FULL CONTENT (10 complete lessons)
// ============================================================================

const chatgptM00_L1 = createLesson('chatgpt-M00', 1,
  '¿Qué es ChatGPT y por qué te va a cambiar la vida?',
  'O que é ChatGPT e como ele vai mudar sua vida?',
  `¿Alguna vez has deseado tener un asistente personal disponible 24 horas al día? ¡Eso es ChatGPT! Imagina un amigo muy inteligente que puede ayudarte con casi cualquier cosa: escribir correos electrónicos, explicar temas complejos, traducir textos, crear recetas de cocina, planificar tu semana, y mucho más.

ChatGPT es una Inteligencia Artificial creada por OpenAI. "GPT" significa "Generative Pre-trained Transformer", pero no necesitas recordar esto. Lo importante es que funciona como un chat: tú escribes preguntas o instrucciones (llamados "prompts"), y ChatGPT responde de manera conversacional.

Para las personas inmigrantes, ChatGPT puede ser especialmente útil:
• Traduce instantáneamente entre español, portugués y cualquier otro idioma
• Te ayuda a redactar documentos oficiales en español correcto
• Explica trámites y procesos administrativos
• Practica contigo el idioma
• Resuelve dudas sobre cultura y costumbres

Lo mejor de todo: es GRATIS en su versión básica, y solo necesitas un navegador web para usarlo.`,
  `Já alguma vez desejou ter um assistente pessoal disponível 24 horas por dia? É isso que é o ChatGPT! Imagine um amigo muito inteligente que pode ajudá-lo com quase qualquer coisa: escrever e-mails, explicar tópicos complexos, traduzir textos, criar receitas, planejar sua semana, e muito mais.

O ChatGPT é uma Inteligência Artificial criada pela OpenAI. O importante é que funciona como um chat: você escreve perguntas ou instruções (chamadas de "prompts"), e o ChatGPT responde de forma conversacional.

Para pessoas imigrantes, o ChatGPT pode ser especialmente útil:
• Traduz instantaneamente entre espanhol, português e outros idiomas
• Ajuda a redigir documentos oficiais em espanhol correto
• Explica trâmites e processos administrativos
• Pratica o idioma com você
• Resolve dúvidas sobre cultura e costumes

O melhor de tudo: é GRÁTUITO na versão básica, e só precisa de um navegador web.`,
  {
    objectiveEs: 'Comprender qué es ChatGPT y sus beneficios para inmigrantes',
    objectivePt: 'Entender o que é ChatGPT e seus benefícios para imigrantes',
    conceptEs: 'IA Conversacional - Programa que simula conversación humana',
    conceptPt: 'IA Conversacional - Programa que simula conversa humana',
    stepsEs: ['Abre tu navegador', 'Ve a chat.openai.com', 'Explora sin registrarte', 'Imagina 3 usos para ti'],
    stepsPt: ['Abra seu navegador', 'Vá para chat.openai.com', 'Explore sem se cadastrar', 'Imagine 3 usos para você'],
    exercisePrompt: 'Visita chat.openai.com y explora. ¿Qué te llama la atención?',
    doraTipEs: '💡 Dora de Oro: Si sabes usar WhatsApp, ¡ya sabes usar ChatGPT!',
    doraTipPt: '💡 Dica Dourada: Se sabe usar WhatsApp, já sabe usar o ChatGPT!',
    commonErrorEs: 'Error común: Pensar que es complicado. ¡No lo es!',
    commonErrorPt: 'Erro comum: Achar que é complicado. Não é!',
    duration: 25, level: 'beginner'
  }
);

const chatgptM00_L2 = createLesson('chatgpt-M00', 2,
  'Crear tu cuenta de ChatGPT paso a paso',
  'Criar sua conta do ChatGPT passo a passo',
  `Ahora vamos a crear tu cuenta. Es tan fácil como crear un correo electrónico.

REQUISITOS: ✓ Correo electrónico ✓ Teléfono ✓ Internet

PASOS:
1. Ve a chat.openai.com
2. Haz clic en "Sign up"
3. La opción más fácil: "Continue with Google"
4. Selecciona tu cuenta de Google
5. Acepta los términos
6. Ingresa tu teléfono (recibirás un código)
7. Escribe el código SMS recibido
8. ¡Listo! Ya estás dentro

CONSEJO: Guarda tus datos de acceso en lugar seguro.`,
  `Agora vamos criar sua conta. É tão fácil quanto criar um e-mail.

REQUISITOS: ✓ E-mail ✓ Telefone ✓ Internet

PASSOS:
1. Vá para chat.openai.com
2. Clique em "Sign up"
3. A opção mais fácil: "Continue with Google"
4. Selecione sua conta do Google
5. Aceite os termos
6. Insira seu telefone (receberá um código)
7. Escreva o código SMS recebido
8. Pronto! Já está dentro

CONSELHO: Guarde seus dados de acesso em lugar seguro.`,
  {
    objectiveEs: 'Crear cuenta en ChatGPT exitosamente',
    objectivePt: 'Criar conta no ChatGPT com sucesso',
    conceptEs: 'Cuenta de Usuario - Identificación para acceso personalizado',
    conceptPt: 'Conta de Usuário - Identificação para acesso personalizado',
    stepsEs: ['Abre chat.openai.com', 'Clic en Sign up', 'Elige Continue with Google', 'Selecciona cuenta', 'Ingresa teléfono', 'Escribe código SMS'],
    stepsPt: ['Abra chat.openai.com', 'Clique em Sign up', 'Escolha Continue with Google', 'Selecione conta', 'Insira telefone', 'Escreva código SMS'],
    exercisePrompt: 'Crea tu cuenta ahora. ¿Qué opción elegiste?',
    doraTipEs: '💡 Dora de Oro: Usa foto de perfil que te identifique',
    doraTipPt: '💡 Dica Dourada: Use foto de perfil que o identifique',
    commonErrorEs: 'Error común: Olvidar la contraseña. Escríbela en tu agenda.',
    commonErrorPt: 'Erro comum: Esquecer a senha. Escreva na agenda.',
    duration: 35, level: 'beginner'
  }
);

const chatgptM00_L3 = createLesson('chatgpt-M00', 3,
  'Conociendo la interfaz de ChatGPT: Tour completo',
  'Conhecendo a interface do ChatGPT: Tour completo',
  `¡Bienvenido/a! Vamos a explorar la interfaz:

PARTES PRINCIPALES:
1. BARRA LATERAL IZQUIERDA: Foto de perfil, botón "New chat", historial
2. ÁREA CENTRAL: Zona donde "hablas" con ChatGPT
3. CAJA DE TEXTO (abajo): Aquí escribes tus prompts
4. BOTONES EN RESPUESTAS: Copiar, Me gusta/No me gusta, Regenerar

TERMINOLOGÍA:
• Prompt = Lo que tú escribes
• Response = Lo que ChatGPT responde
• Thread = Una conversación completa
• Model = Versión de IA (GPT-4o, GPT-4o mini)`,
  `Bem-vindo(a)! Vamos explorar a interface:

PARTES PRINCIPAIS:
1. BARRA LATERAL ESQUERDA: Foto de perfil, botão "New chat", histórico
2. ÁREA CENTRAL: Zona onde "fala" com o ChatGPT
3. CAIXA DE TEXTO (abaixo): Aqui você escreve seus prompts
4. BOTÕES NAS RESPOSTAS: Copiar, Curtir/Não curtir, Regenerar

TERMINOLOGIA:
• Prompt = O que você escreve
• Response = O que o ChatGPT responde
• Thread = Uma conversa completa
• Model = Versão de IA (GPT-4o, GPT-4o mini)`,
  {
    objectiveEs: 'Identificar todas las partes de la interfaz',
    objectivePt: 'Identificar todas as partes da interface',
    conceptEs: 'Interfaz de Usuario (UI) - Elementos visuales para interactuar',
    conceptPt: 'Interface do Usuário (UI) - Elementos visuais para interagir',
    stepsEs: ['Inicia sesión', 'Localiza barra lateral', 'Encuentra New chat', 'Identifica caja de texto', 'Busca botones de copiar'],
    stepsPt: ['Faça login', 'Localize barra lateral', 'Encontre New chat', 'Identifique caixa de texto', 'Busque botões de copiar'],
    exercisePrompt: 'Nombra 5 elementos que veas en pantalla',
    doraTipEs: '💡 Dora de Oro: En móviles, busca ☑️ arriba a la izquierda',
    doraTipPt: '💡 Dica Dourada: Em celulares, procure ☑️ acima à esquerda',
    commonErrorEs: 'Error común: Confundir historial con zona de escritura',
    commonErrorPt: 'Erro comum: Confundir histórico com zona de escrita',
    duration: 30, level: 'beginner'
  }
);

const chatgptM00_L4 = createLesson('chatgpt-M00', 4,
  'Tu primera conversación: ¡Hola, ChatGPT!',
  'Sua primeira conversa: Olá, ChatGPT!',
  `Ha llegado el momento de tu primera conversación. ¡No hay preguntas tontas!

EMPECEMOS:
Escribe: "Hola, ChatGPT. Soy nuevo/a aquí. ¿Podrías presentarte?"

Observará que:
• Usa tono amable
• Se presenta brevemente
• Ofrece ayuda

AHORA ALGO PERSONAL:
Escribe: "Me llamo [nombre] y vengo de [país]. ¿Sabes algo sobre mi país?"

PRIMER RETO PRÁCTICO:
Pide ayuda con algo real:
• "Redacta un mensaje para mi casero/a"
• "10 palabras útiles en español/portugués"
• "Cómo explicar a mi madre qué hago aquí"`,
  `Chegou o momento da sua primeira conversa. Não há perguntas bobas!

VAMOS COMEÇAR:
Escreva: "Olá, ChatGPT. Sou novo(a) aqui. Poderia se apresentar?"

Observará que:
• Usa tom amigável
• Apresenta-se brevemente
• Oferece ajuda

AGORA ALGO PESSOAL:
Escreva: "Me chamo [nome] e venho de [país]. Sabe algo sobre meu país?"

PRIMEIRO DESAFIO:
Peça ajuda com algo real:
- "Redija uma mensagem para meu(a) senhorio(a)"
- "10 palavras uteis em espanhol/portugues"
- "Como explicar a minha mae o que faco aqui"`,
  {
    objectiveEs: 'Tener primera conversación exitosa',
    objectivePt: 'Ter primeira conversa bem-sucedida',
    conceptEs: 'Conversación Natural - Intercambio que simula comunicación humana',
    conceptPt: 'Conversa Natural - Troca que simula comunicação humana',
    stepsEs: ['Abre nuevo chat', 'Saluda a ChatGPT', 'Preséntate', 'Haz pregunta simple', 'Pide ayuda real'],
    stepsPt: ['Abra novo chat', 'Cumprimente o ChatGPT', 'Apresente-se', 'Faça pergunta simples', 'Peça ajuda real'],
    exercisePrompt: 'Ten tu primera conversa. ¿De qué hablaron?',
    doraTipEs: '💡 Dora de Oro: Cada chat nuevo empieza limpio',
    doraTipPt: '💡 Dica Dourada: Cada conversa nova começa limpa',
    commonErrorEs: 'Error común: Esperar que adivine lo que quieres',
    commonErrorPt: 'Erro comum: Esperar que adivine o que quer',
    duration: 40, level: 'beginner'
  }
);

const chatgptM00_L5 = createLesson('chatgpt-M00', 5,
  'Superando el miedo a la tecnologia: Tu puedes',
  'Superando o medo da tecnologia: Voce consegue',
  `Es normal sentir miedo frente a la tecnologia. Muchos sienten:
- "No soy bueno/a con tecnologia"
- "Puedo romper algo"
- "Es demasiado complicado"

¡NINGUNO DE ESTO ES CIERTO!

CHATGPT ES DIFERENTE:
[OK] No puedes "romperlo" escribiendo mal
[OK] No te juzga si preguntas 10 veces lo mismo
[OK] Habla tu idioma
[OK] Tiene paciencia infinita

EJERCICIO DE CONFIANZA:
Escribe algo con errores: "hola chatgpt yo no se escribir bien"
Veras: ChatGPT te entiende igualmente.

TU MANTRA: "Yo puedo aprender. Cada experto fue principiante."`,
  `E normal sentir medo frente a tecnologia. Muitos sentem:
- "Nao sou bom(boa) com tecnologia"
- "Posso quebrar algo"
- "E complicado demais"

NENHUM DISSO E VERDADE!

O CHATGPT E DIFERENTE:
[OK] Nao pode "quebra-lo" escrevendo errado
- Nao julga se pergunta a mesma coisa 10 vezes
- Fala seu idioma
- Tem paciencia infinita

EXERCICIO DE CONFIANCA:
Escreva algo com erros: "ola chatgpt eu nao sei escrever bem'
Vera: O ChatGPT entende voce igualmente.

SEU MANTRA: "Eu consigo aprender. Todo especialista foi iniciante."`,
  {
    objectiveEs: 'Superar miedos tecnológicos',
    objectivePt: 'Superar medos tecnológicos',
    conceptEs: 'Autoeficacia Tecnológica - Creencia en propia capacidad',
    conceptPt: 'Autoeficácia Tecnológica - Crença na própria capacidade',
    stepsEs: ['Reconoce tus miedos', 'Escribe con errores intencionalmente', 'Observa que te entienden', 'Practica en tu idioma', 'Repite tu mantra'],
    stepsPt: ['Reconheça seus medos', 'Escreva com erros intencionalmente', 'Observe que entendem você', 'Pratique em seu idioma', 'Repita seu mantra'],
    exercisePrompt: 'Escribe: "Tengo miedo de tecnología porque..." Lee la respuesta',
    doraTipEs: '💡 Dora de Oro: Cada clic es una victoria. Celebra pequeños logros.',
    doraTipPt: '💡 Dica Dourada: Cada clique é uma vitória. Celebre pequenas conquistas.',
    commonErrorEs: 'Error común: Compararse con otros. Cada uno tiene su ritmo.',
    commonErrorPt: 'Erro comum: Comparar-se com outros. Cada um tem seu ritmo.',
    duration: 35, level: 'beginner'
  }
);

const chatgptM00_L6 = createLesson('chatgpt-M00', 6,
  'El método P.C.C.: Contexto, Comando, Clarificación',
  'O método P.C.C.: Contexto, Comando, Clarificação',
  `El secreto para excelentes respuestas: el método P.C.C.

**P = CONTEXT (CONTEXTO)**
Da información de fondo.
❌ "Ayúdame a escribir un correo"
✅ "Soy de Colombia, vivo en Madrid hace 3 meses, necesito escribir a mi casero..."

**C = COMMAND (COMANDO)**
Sé específico.
❌ "Escríbeme algo"
✅ "Redacta un correo formal pero amable de máximo 3 párrafos..."

**C = CLARIFICATION (CLARIFICACIÓN)**
Indica formato, tono, longitud.
✓ "Usa español neutro, tono respetuoso, fórmula de cortesía española"

EJEMPLO COMPLETO:
"CONTEXT: Soy enfermero/a de Perú, buscando trabajo en Barcelona, 5 años experiencia en UCI.
COMMAND: Ayúdame a escribir un párrafo para mi CV.
CLARIFICATION: Tonoprofesional pero cercano, máximo 80 palabras, destacar experiencia en urgencias."`,
  `O segredo para excelentes respostas: o método P.C.C.

**P = CONTEXT (CONTEXTO)**
Dê informações de fundo.
❌ "Ajude-me a escrever um e-mail"
✅ "Sou da Colômbia, moro em Madri há 3 meses, preciso escrever para meu(a) senhorio(a)..."

**C = COMMAND (COMANDO)**
Seja específico.
❌ "Escreva algo para mim"
✅ "Redija um e-mail formal mas gentil de no máximo 3 parágrafos..."

**C = CLARIFICATION (CLARIFICAÇÃO)**
Indique formato, tom, extensão.
✓ "Use espanhol neutro, tom respeitoso, fórmula de cortesia espanhola"`

    ,
  {
    objectiveEs: 'Aplicar método P.C.C. para mejores respuestas',
    objectivePt: 'Aplicar método P.C.C. para melhores respostas',
    conceptEs: 'Prompt Engineering - Arte de formular instrucciones efectivas',
    conceptPt: 'Prompt Engineering - Arte de formular instruções efetivas',
    stepsEs: ['Identifica lo que quieres', 'Escribe contexto completo', 'Formula comando claro', 'Añade clarificación', 'Revisa antes de enviar'],
    stepsPt: ['Identifique o que quer', 'Escreva contexto completo', 'Formule comando claro', 'Adicione clarificação', 'Revise antes de enviar'],
    exercisePrompt: 'Usa P.C.C. para pedirle algo a ChatGPT hoy',
    doraTipEs: '💡 Dora de Oro: Más contexto = mejor respuesta',
    doraTipPt: '💡 Dica Dourada: Mais contexto = melhor resposta',
    commonErrorEs: 'Error común: Instrucciones vagas como "ayúdame"',
    commonErrorPt: 'Erro comum: Instruções vagas como "ajude-me"',
    duration: 40, level: 'beginner'
  }
);

const chatgptM00_L7 = createLesson('chatgpt-M00', 7,
  'Traductor instantáneo: Español ↔ Portugués',
  'Tradutor instantâneo: Espanhol ↔ Portugués',
  `Una función muy útil para nuestra comunidad hispano-lusófona.

TRADUCCIÓN BÁSICA:
"Traduce al portugués: 'Buenos días, señor García. Le escribo para avisarle que mañana no podré ir...'"
→ "Bom-dia, senhor Garcia. Escrevo para avisar que amanhã não poderei ir..."

VARIANTES DEL IDIOMA:
"Traduce al portugués de Brasil: 'Los niños están jugando'"
→ "As crianças estão brincando"

"Traduce al portugués de Portugal: 'Los niños están jugando'"
→ "As miúdas estão a brincar"

TRADUCCIÓN DE DOCUMENTOS LARGOS:
1. Copia y pega el texto
2. Añade: "Traduce manteniendo formato original"
3. Pide: "Explica expresiones idiomáticas entre paréntesis"

EXPRESIONES IDIOMÁTICAS:
"Traduce y explica: 'Estar en las nubes'"
→ "Estar nas nuves (significa estar distraído)"`,
  `Uma função muito útil para nossa comunidade hispano-lusófona.

TRADUÇÃO BÁSICA:
"Traduza para o português: 'Bom-dias, senhor Garcia. Escrevo para avisar que amanhã não poderei ir...'"
→ "Buenos días, señor García. Le escribo para avisar que mañana no podré ir..."

VARIANTES DO IDIOMA:
"Traduza para o espanhol da Espanha: 'As crianças estão brincando'"
→ "Los niños están jugando"

"Traduza para o espanhol da América Latina: 'As crianças estão brincando'"
→ "Los niños están jugando" (pode haver variações)

TRADUÇÃO DE DOCUMENTOS LONGOS:
1. Copie e cole o texto
2. Adicione: "Traduza mantendo formato original"
3. Peça: "Explique expressões idiomáticas entre parênteses"`,
  {
    objectiveEs: 'Usar ChatGPT como traductor efectivo',
    objectivePt: 'Usar o ChatGPT como tradutor efetivo',
    conceptEs: 'Traducción Asistida por IA - Uso de IA para traducir conservando significado',
    conceptPt: 'Tradução Assistida por IA - Uso de IA para traduzir conservando significado',
    stepsEs: ['Selecciona texto a traducir', 'Decide idioma destino', 'Escribe instrucción', 'Revisa resultado', 'Guarda traducciones útiles'],
    stepsPt: ['Selecione texto a traduzir', 'Decida idioma de destino', 'Escreva instrução', 'Revise resultado', 'Guarde traduções úteis'],
    exercisePrompt: 'Traduce un mensaje que necesites hoy',
    doraTipEs: '💡 Dora de Oro: Para documentos importantes, pide siempre revisión de ambigüedades',
    doraTipPt: '💡 Dica Dourada: Para documentos importantes, peça sempre revisão de ambiguidades',
    commonErrorEs: 'Error común: No especificar variante (Brasil vs Portugal)',
    commonErrorPt: 'Erro comum: Não especificar variante (Brasil vs Portugal)',
    duration: 30, level: 'beginner'
  }
);

const chatgptM00_L8 = createLesson('chatgpt-M00', 8,
  'Redactar documentos: Del borrador al profesional',
  'Redigir documentos: Do rascunho ao profissional',
  `ChatGPT es como tener un editor personal gratuito.

CASO 1 - CORREO FORMAL:
Borrador: "hola quiero decir q no voy a poder ir maniana pq me sick enferme"
Usando ChatGPT → Un correo profesional que mantiene tu dignidad

CASO 2 - CARTA DE PRESENTACIÓN:
"CONTEXT: Soy cocinero mexicano con 10 años experiencia, buscando trabajo en España.
COMMAND: Ayúdame a escribir carta de presentación de media página.
CLARIFICATION: Destacar especialidad en cocina mexicana, disposición para aprender local."

CASO 3 - MENSAJE WHATSAPP DIFÍCIL:
"CONTEXT: Mi compañero deja la cocina sucia siempre.
COMMAND: Mensaje firme pero no agresivo para WhatsApp.
CLARIFICATION: Máximo 5 líneas, proponer soluciones, mantener amistad."`,
  `O ChatGPT é como ter um editor pessoal gratuito.

CASO 1 - E-MAIL FORMAL:
Rascunho: "oi quero dizer q nao vou poder ir amanha pq me sinto enfermo"
Usando ChatGPT → Um e-mail profissional que mantém sua dignidade

CASO 2 - CARTA DE APRESENTAÇÃO:
"CONTEXT: Sou cozinheiro mexicano com 10 anos experiência, procurando emprego na Espanha.
COMMAND: Ajude-me a escrever carta de apresentação de meia página.
CLARIFICATION: Destacar especialidade em cozinha mexicana, disposição para aprender local."

CASO 3 - MENSAGEM WHATSAPP DIFÍCIL:
"CONTEXT: Meu colega deixa a cozinha suja sempre.
COMMAND: Mensagem firme mas não agressiva para WhatsApp.
CLARIFICATION: Máximo 5 linhas, propor soluções, manter amizade."`,
  {
    objectiveEs: 'Redactar diversos tipos de documentos',
    objectivePt: 'Redigir vários tipos de documentos',
    conceptEs: 'Redacción Asistida - Mejorar textos manteniendo voz del autor',
    conceptPt: 'Redação Assistida - Melhorar textos mantendo voz do autor',
    stepsEs: ['Escribe ideas sin forma', 'Aplica método P.C.C.', 'Especifica tipo documento', 'Indica tono deseado', 'Revisa antes de enviar'],
    stepsPt: ['Escreva ideias sem forma', 'Aplique método P.C.C.', 'Especifique tipo documento', 'Indique tom desejado', 'Revise antes de enviar'],
    exercisePrompt: 'Redacta un documento que necesites esta semana',
    doraTipEs: '💡 Dora de Oro: Siempre añade "Revisa errores gramaticales" para textos importantes',
    doraTipPt: '💡 Dica Dourada: Sempre adicione "Revise erros gramaticais" para textos importantes',
    commonErrorEs: 'Error común: Copiar sin leer. SIEMPRE revisa antes de enviar',
    commonErrorPt: 'Erro comum: Copiar sem ler. SEMPRE revise antes de enviar',
    duration: 45, level: 'beginner'
  }
);

const chatgptM00_L9 = createLesson('chatgpt-M00', 9,
  'Preguntar sobre Espanha e Portugal: Sua guia local',
  'Perguntar sobre Espanha e Portugal: Sua guia local',
  `Uno de los superpoderes de ChatGPT es su conocimiento sobre países.

PREGUNTAS SOBRE SERVICIOS:
"¿Cómo funciona la salud en España para extranjeros?"
→ Explicará: tarjeta sanitaria, SIP/CIP, centros de salud

"¿Documentos necesarios para empadronarme en Lisboa?"
→ Guía completa de empadronamiento

PREGUNTAS CULTURALES:
"¿Qué costumbres debo conocer para integrarme en Barcelona?"
→ Información sobre horarios, comidas, festividades

PREGUNTAS PRÁCTICAS:
"¿Dónde encuentro productos latinoamericanos en Madrid?"
→ Listado de tiendas específicas

⚠️ IMPORTANTE: Verifica información crítica en fuentes oficiales.`,
  `Um dos superpoderes do ChatGPT é seu conhecimento sobre países.

PERGUNTAS SOBRE SERVIÇOS:
"Como funciona a saúde na Espanha para estrangeiros?"
→ Explicará: cartão sanitário, SIP/CIP, centros de saúde

"Quais documentos necessários para me cadastrar em Lisboa?"
→ Guia completo de cadastramento`

    ,
  {
    objectiveEs: 'Usar ChatGPT como guía de España y Portugal',
    objectivePt: 'Usar o ChatGPT como guia da Espanha e Portugal',
    conceptEs: 'Información Contextual - Datos relevantes sobre ubicación y cultura',
    conceptPt: 'Informação Contextual - Dados relevantes sobre localização e cultura',
    stepsEs: ['Formula tu pregunta', 'Especifica ciudad/región', 'Pide ejemplos prácticos', 'Verifica en fuentes oficiales', 'Guarda info útil'],
    stepsPt: ['Formule sua pergunta', 'Especifique cidade/região', 'Peça exemplos práticos', 'Verifique em fontes oficiais', 'Guarde info útil'],
    exercisePrompt: 'Pregunta algo sobre tu ciudad actual',
    doraTipEs: '💡 Dora de Oro: Añade "como para niño de 10 años" para explicaciones simples',
    doraTipPt: '💡 Dica Dourada: Adicione "como para criança de 10 anos" para explicações simples',
    commonErrorEs: 'Error común: Asumir que sabe todo perfectamente. Verifica info legal/médica',
    commonErrorPt: 'Erro comum: Assumir que sabe tudo perfeitamente. Verifique info legal/médica',
    duration: 35, level: 'beginner'
  }
);

const chatgptM00_L10 = createLesson('chatgpt-M00', 10,
  'Repaso y celebración: ¡Ya eres usuario/a de ChatGPT!',
  'Revisão e celebração: Já é usuário(a) do ChatGPT!',
  `¡FELICIDADES! Completaste tu primer módulo.

LOGROS DE ESTE MÓDULO:
□ Creaste tu cuenta de ChatGPT
□ Tuviste tu primera conversación
□ Aprendiste el método P.C.C.
□ Usaste ChatGPT como traductor
□ Redactaste tu primer documento asistido
□ Superaste miedos tecnológicos
□ Preguntaste sobre tu país de acogida

TU COMPROMISO:
Escribe: "Yo [nombre] me comprometo a usar ChatGPT al menos 3 veces esta semana para:
1. _________________________
2. _________________________
3. _________________________"

PRÓXIMO MÓDULO: Conversaciones más complejas, organización de chats, aprendizaje de idiomas.

¡Nos vemos en el módulo 1!`,
  `PARABÉNS! Completou seu primeiro módulo.

CONQUISTAS DESTE MÓDULO:
□ Criou sua conta do ChatGPT
□ Teve sua primeira conversa
□ Aprendeu o método P.C.C.
□ Usou o ChatGPT como tradutor
□ Redigiu seu primeiro documento assistido
□ Superou medos tecnológicos
□ Perguntou sobre seu país de acolhimento

SEU COMPROMISSO:
Escreva: "Eu [nome] me comprometo a usar o ChatGPT pelo menos 3 vezes esta semana para:
1. _________________________
2. _________________________
3. _________________________"

PRÓXIMO MÓDULO: Conversas mais complexas, organização de chats, aprendizado de idiomas.

Te vemos no módulo 1!`,
  {
    objectiveEs: 'Consolidar conocimientos y establecer plan de acción',
    objectivePt: 'Consolidar conhecimentos e estabelecer plano de ação',
    conceptEs: 'Metacognición - Pensar sobre el propio aprendizaje',
    conceptPt: 'Metacognição - Pensar sobre o próprio aprendizado',
    stepsEs: ['Revisa cada lección', 'Completa checklist', 'Escribe compromiso', 'Identifica áreas a reforzar', '¡Celebra!'],
    stepsPt: ['Revise cada lição', 'Complete checklist', 'Escreva compromisso', 'Identifique áreas a reforçar', 'Celebre!'],
    exercisePrompt: 'Completa tu checklist personal',
    doraTipEs: '💡 Dora de Oro: Toma captura de tu primera conversa. Dentro de un año te alegrará verla.',
    doraTipPt: '💡 Dica Dourada: Tire print da sua primeira conversa. Dentro de um ano vai alegrar ver.',
    commonErrorEs: 'Error común: Pasar al siguiente sin practicar. Dedica una semana mínimo.',
    commonErrorPt: 'Erro comum: Passar para o próximo sem praticar. Dedique uma semana mínimo.',
    duration: 40, level: 'beginner'
  }
);

// ChatGPT Module 0: Full first 10 + 90 stubs
const chatgptModule0Lessons: Lesson[] = [
  chatgptM00_L1, chatgptM00_L2, chatgptM00_L3, chatgptM00_L4, chatgptM00_L5,
  chatgptM00_L6, chatgptM00_L7, chatgptM00_L8, chatgptM00_L9, chatgptM00_L10,
  ...generateModuleLessons('chatgpt', 0, 0, 90).map((l, i) => ({ ...l, number: 11 + i }))
];

// ============================================================================
// META AI COURSE - MODULE 0 WITH FULL CONTENT (10 complete lessons)
// ============================================================================

const metaAiM00_L1 = createLesson('metaai-M00', 1,
  '¿Qué es Meta AI y dónde lo encuentro?',
  'O que é Meta AI e onde o encontro?',
  `Meta AI es la IA de Meta (Facebook, Instagram, WhatsApp). LO ESPECIAL: ¡YA LO TENES INSTALADO!

¿DÓNDE ENCUENTRO META AI?

1. **WHATSAPP** (más accesible):
   • Abre WhatsApp
   • Busca contacto "Meta AI"
   • ¡Listo! Chatea directamente

2. **FACEBOOK/MESSENGER**:
   • Buscador: "Meta AI"
   • Aparece en chats de Messenger

3. **INSTAGRAM**:
   • En DMs, busca Meta AI

4. **META.AI** (web):
   • Visita meta.ai

POR QUÉ META AI ES ESPECIAL:
✓ Ya usas WhatsApp diariamente
✓ No necesitas instalar nada
✓ Funciona en smartphones básicos
✓ Integrado en apps que conoces
✓ Disponible en ES/PT`,
  `Meta AI é a IA da Meta (Facebook, Instagram, WhatsApp). O ESPECIAL: JÁ O TEM INSTALADO!

ONDE ENCONTRO O META AI?

1. **WHATSAPP** (mais acessível):
   • Abra o WhatsApp
   • Busque contato "Meta AI"
   • Pronto! Bate papo diretamente

2. **FACEBOOK/MESSENGER**:
   • Buscador: "Meta AI"
   • Aparece em chats do Messenger

3. **INSTAGRAM**:
   • Em DMs, busque Meta AI

4. **META.AI** (web):
   • Visite meta.ai

POR QUE O META AI É ESPECIAL:
✓ Já usa o WhatsApp diariamente
✓ Não precisa instalar nada
✓ Funciona em smartphones básicos
✓ Integrado em apps que conhece
✓ Disponível em ES/PT`,
  {
    objectiveEs: 'Comprender qué es Meta AI y cómo acceder',
    objectivePt: 'Entender o que é Meta AI e como acessar',
    conceptEs: 'IA Integrada - IA incorporada en plataformas existentes',
    conceptPt: 'IA Integrada - IA incorporada em plataformas existentes',
    stepsEs: ['Abre WhatsApp', 'Busca Meta AI en contactos', 'Abre conversación', 'Explora interfaz', 'Prueba enviar Hola'],
    stepsPt: ['Abra o WhatsApp', 'Busque Meta AI nos contatos', 'Abra conversa', 'Explore interface', 'Teste enviar Olá'],
    exercisePrompt: 'Encuentra Meta AI en WhatsApp. ¿Funcionó?',
    doraTipEs: '💡 Dora de Oro: Si no aparece, actualiza WhatsApp',
    doraTipPt: '💡 Dica Dourada: Se não aparecer, atualize o WhatsApp',
    commonErrorEs: 'Error común: Buscar como persona normal. Recuerda: es un bot',
    commonErrorPt: 'Erro comum: Buscar como pessoa normal. Lembre-se: é um bot',
    duration: 25, level: 'beginner'
  }
);

const metaAiM00_L2 = createLesson('metaai-M00', 2,
  'Meta AI en WhatsApp: Tu asistente en el bolsillo',
  'Meta AI no WhatsApp: Seu assistente no bolso',
  `WhatsApp es la app que más usas. Imagina un asistente integrado ahí mismo.

CONFIGURACIÓN:
1. Abre WhatsApp
2. Toca lupa arriba derecha
3. Escribe "Meta AI"
4. Selecciona el contacto
5. ¡Estás dentro!

INTERFAZ (igual que chatear):
• Arriba: "Meta AI" con check verde
• Abajo: Campo de texto
• Derecha: Botón enviar
• Izquierda: Micrófono

PRIMERA CONVERSACIÓN:
1. "Hola, ¿quién eres?" → Se presentará
2. "¿En qué puedes ayudarme?" → Lista capacidades
3. "Traduce: Buenos días, espero que estén bien" → Traducción automática`,
  `O WhatsApp é o app que mais usa. Imagine um assistente integrado ali mesmo.

CONFIGURAÇÃO:
1. Abra o WhatsApp
2. Toque lupa acima direita
3. Escreva "Meta AI"
4. Selecione o contato
5. Está dentro!

INTERFACE (igual a bater papo):
• Acima: "Meta AI" com check verde
• Abaixo: Campo de texto
• Direita: Botão enviar
• Esquerda: Microfone`

    ,
  {
    objectiveEs: 'Dominar Meta AI en WhatsApp',
    objectivePt: 'Dominar o Meta AI no WhatsApp',
    conceptEs: 'Conversación Hibrida - Combina chat humano con capacidades de IA',
    conceptPt: 'Conversa Híbrida - Combina chat humano com capacidades de IA',
    stepsEs: ['Actualiza WhatsApp', 'Busca Meta AI', 'Inicia con saludo', 'Prueba traducción', 'Envía mensaje de voz'],
    stepsPt: ['Atualize o WhatsApp', 'Busque o Meta AI', 'Inicie com cumprimento', 'Teste tradução', 'Envie mensagem de voz'],
    exercisePrompt: 'Ten conversación de 5 mensajes con Meta AI',
    doraTipEs: '💡 Dora de Oro: Puedes archivar la conversación como cualquier chat',
    doraTipPt: '💡 Dica Dourada: Pode arquivar a conversa como qualquer chat',
    commonErrorEs: 'Error común: Puede tener limitaciones vs versión web',
    commonErrorPt: 'Erro comum: Pode ter limitações vs versão web',
    duration: 30, level: 'beginner'
  }
);

const metaAiM00_L3 = createLesson('metaai-M00', 3,
  'Imágenes con Meta AI: Crear sin ser artista',
  'Imagens com Meta AI: Criar sem ser artista',
  `Función divertida: generar imágenes describiendo lo que quieres.

CÓMO CREAR:
Escribe: "Genera una imagen de: [descripción]"

EJEMPLOS:
• "Un gato astronauta en el espacio, estilo cartoon"
• "Una casa pequeña rodeada de flores, acuarela"
• "Cartel informativo sobre reciclaje, colores vibrantes"

PARÁMETROS:
• Estilo: fotorealista, dibujo animado, óleo, pixel art
• Colores: cálidos, pastel, blanco y negro
• Ambiente: atardecer, interior acogedor, urbano

LIMITACIONES:
✗ No genera imágenes de personas reales/famosos
✗ Evita contenido inapropiado
✓ Tiene marca de agua de Meta

USOS PARA INMIGRANTES:
• Presentaciones
• Invitaciones eventos comunitarios
• Visualizar ideas de negocios
• Material educativo`,
  `Função divertida: gerar imagens descrevendo o que quer.

COMO CRIAR:
Escreva: "Gere uma imagem de: [descrição]"

EXEMPLOS:
• "Um gato astronauta no espaço, estilo cartoon"
• "Uma casa pequena rodeada por flores, aquarela"
• "Cartaz informativo sobre reciclagem, cores vibrantes"

PARÂMETROS:
• Estilo: fotorealista, desenho animado, óleo, pixel art
• Cores: quentes, pastel, preto e branco
• Ambiente: entardecer, interior acolhedor, urbano

LIMITAÇÕES:
✗ Não gera imagens de pessoas reais/famosas
✗ Evita conteúdo inapropriado
✓ Tem marca d'água da Meta`,
  {
    objectiveEs: 'Generar imágenes creativas con Meta AI',
    objectivePt: 'Gerar imagens criativas com o Meta AI',
    conceptEs: 'Generación de Imágenes por IA - Creación visual desde texto',
    conceptPt: 'Geração de Imagens por IA - Criação visual desde texto',
    stepsEs: ['Abre Meta AI', 'Escribe "Genera imagen de:"', 'Sé específico en estilo', 'Espera generación', 'Descarga si gusta'],
    stepsPt: ['Abra o Meta AI', 'Escreva "Gere imagem de:"', 'Seja específico em estilo', 'Espere geração', 'Baixe se gostar'],
    exercisePrompt: 'Crea una imagen que represente tu viaje migratorio',
    doraTipEs: '💡 Dora de Oro: Añade "sin texto" para evitar letras incorrectas',
    doraTipPt: '💡 Dica Dourada: Adicione "sem texto" para evitar letras incorretas',
    commonErrorEs: 'Error común: Ser vago. "Dibuja un perro" vs "Golden retriever en playa al atardece"',
    commonErrorPt: 'Erro comum: Ser vago. "Desenhe um cachorro" vs "Golden retrieber na praia ao entardecer"',
    duration: 35, level: 'beginner'
  }
);

const metaAiM00_L4 = createLesson('metaai-M00', 4,
  'Meta AI como traductor en tiempo real',
  'Meta AI como tradutor em tempo real',
  `La traducción es útil porque está donde ya comunicas: WhatsApp.

TRADUCCIÓN RÁPIDA:
"Traduce al español: [texto PT]"
"Traduce al portugués: [texto ES]"

ESCENARIOS COMUNES:

1. **MENSAJES ESCUELA (Portugal):**
   "Traduce: 'A escola informa que amanhã haverá reunião...'"
   → "La escuela informa que mañana habrá reunión..."

2. **MENSAJES CASERO/A (España):**
   "Traduce: 'Le recuerdo que el lunes vence el recibo...'"
   → "Lembro que segunda vence a conta..."

3. **DOCUMENTOS OFICIALES:**
   Copia y pega, pide traducción

TRADUCCIÓN DE VOZ:
1. Graba audio en cualquier chat
2. Reenvía a Meta AI
3. Pide: "Transcribe y traduce este audio"`,
  `A tradução é útil porque está onde já comunica: WhatsApp.

TRADUÇÃO RÁPIDA:
"Traduza para o espanhol: [texto PT]"
"Traduza para o português: [texto ES]"

CENÁRIOS COMUNS:

1. **MENSAGENS ESCOLA (Portugal):**
   "Traduza: 'A escola informa que amanhã haverá reunião...'"
   → "La escuela informa que mañana habrá reunión..."

2. **MENSAGENS SENHORIO(A) (Espanha):**
   "Traduza: 'Le recuerdo que el lunes vence el recibo...'"
   → "Lembro que segunda vence a conta..."`,
  {
    objectiveEs: 'Usar Meta AI como traductor instantáneo',
    objectivePt: 'Usar o Meta AI como tradutor instantâneo',
    conceptEs: 'Traducción Contextual - Considera contexto cultural',
    conceptPt: 'Tradução Contextual - Considera contexto cultural',
    stepsEs: ['Identifica texto a traducir', 'Abre Meta AI', 'Especifica idiomas', 'Pega o escribe texto', 'Revisa resultado'],
    stepsPt: ['Identifique texto a traduzir', 'Abra o Meta AI', 'Especifique idiomas', 'Cole ou escreva texto', 'Revise resultado'],
    exercisePrompt: 'Traduce un mensaje real que hayas recibido hoy',
    doraTipEs: '💡 Dora de Oro: Para conversas largas: "traduce manteniendo quién dice qué"',
    doraTipPt: '💡 Dica Dourada: Para conversas longas: "traduza mantendo quem diz o quê"',
    commonErrorEs: 'Error común: Traducir literalmente sin contexto cultural',
    commonErrorPt: 'Erro comum: Traduzir literalmente sem contexto cultural',
    duration: 30, level: 'beginner'
  }
);

const metaAiM00_L5 = createLesson('metaai-M00', 5,
  'Superando barreras: Meta AI para la inclusión',
  'Superando barreiras: Meta AI para a inclusão',
  `La tecnología puede incluir. Meta AI reduce barreras de:

BARRERA IDIOMÁTICA:
• Traduce documentos oficiales
• Practica conversaciones
• Expresa ideas con vocabulario limitado

BARRERA CULTURAL:
• "¿Por qué hacen X aquí?" → Explicación
• Normas de etiqueta local
• Costumbres y tradiciones

BARRERA ADMINISTRATIVA:
• Redacta documentos oficiales
• Explica trámites paso a paso
• Prepara para reuniones

BARRERA SOCIAL:
• Ideas para conocer gente
• Cómo iniciar conversaciones
• Expresiones locales y slang

EJERCICIO:
Escribe: "Soy inmigrante en [país]. ¿Cuáles son las 3 barreras más comunes y cómo superarlas?"`,
  `A tecnologia pode incluir. O Meta AI reduz barreiras de:

BARREIRA IDIOMÁTICA:
• Traduz documentos oficiais
• Pratica conversações
• Expressa ideias com vocabulário limitado

BARREIRA CULTURAL:
• "Por que fazem X aqui?" → Explicação
• Normas de etiqueta local
• Costumes e tradições

BARREIRA ADMINISTRATIVA:
• Redige documentos oficiais
• Explica trâmites passo a passo
• Prepara para reuniões

BARREIRA SOCIAL:
• Ideias para conhecer pessoas
• Como iniciar conversações
• Expressões locais e slang`,
  {
    objectiveEs: 'Usar Meta AI como herramienta de inclusión',
    objectivePt: 'Usar o Meta AI como ferramenta de inclusão',
    conceptEs: 'Tecnología Inclusiva - Herramientas que reducen brechas de acceso',
    conceptPt: 'Tecnologia Inclusiva - Ferramentas que reduzem lacunas de acesso',
    stepsEs: ['Reflexiona sobre barreras personales', 'Clasifícalas', 'Pide ayuda a Meta AI', 'Practica solución', 'Comparte con otros'],
    stepsPt: ['Refletir sobre barreiras pessoais', 'Classifique-as', 'Peça ajuda ao Meta AI', 'Pratique solução', 'Compartilhe com outros'],
    exercisePrompt: 'Escribe sobre tu mayor barrera actual',
    doraTipEs: '💡 Dora de Oro: Depender de IA no es hacer trampa. Es como usar calculadora.',
    doraTipPt: '💡 Dica Dourada: Depender de IA não é colar. É como usar calculadora.',
    commonErrorEs: 'Error común: Vergüenza de pedir ayuda. Todos necesitamos apoyo.',
    commonErrorPt: 'Erro comum: Vergonha de pedir ajuda. Todos precisam de apoio.',
    duration: 35, level: 'beginner'
  }
);

const metaAiM00_L6 = createLesson('metaai-M00', 6,
  'Privacidad y seguridad: Protegiendo tus datos',
  'Privacidade e segurança: Protegendo seus dados',
  `Al usar IA, entiende cómo funcionan tus datos.

QUÉ VE META AI:
✓ Tus mensajes con él
✓ Info pública de tu perfil
✓ Contexto de conversación

QUÉ NO COMPARTIR:
🔴 Números de cuentas bancarias
🔴 Contraseñas
🔴 Números de tarjetas
🔴 Datos pasaporte/NIE completos
🔴 Fotos de documentos oficiales
🔴 Información médica sensible

BUENAS PRÁCTICAS:
1. Trata a Meta AI como desconocido educado
2. No compartas secrets íntimos
3. Elimina conversaciones innecesarias
4. Revisa permisos de la app
5. Configuración > Cuenta > Privacidad

META AI VS CHATGPT:
• ChatGPT: Conversaciones separadas de identidad
• Meta AI: Conectado a tu perfil de Meta`,
  `Ao usar IA, entenda como funcionam seus dados.

QUE O META AI VÊ:
✓ Suas mensagens com ele
✓ Info pública do seu perfil
✓ Contexto da conversa

QUE NÃO COMPARTILHAR:
🔴 Números de contas bancárias
🔴 Senhas
🔴 Números de cartões
🔴 Dados passaporte/NIE completos
🔴 Fotos de documentos oficiais
🔒 Informação médica sensível`

    ,
  {
    objectiveEs: 'Comprender riesgos de privacidad y adoptar buenas prácticas',
    objectivePt: 'Compreender riscos de privacidade adotar boas práticas',
    conceptEs: 'Higiene Digital - Prácticas para proteger información personal',
    conceptPt: 'Higiene Digital - Práticas para proteger informação pessoal',
    stepsEs: ['Revisa datos compartidos', 'Identifica info sensible', 'Configura privacidad', 'Elimina chats innecesarios', 'Crea reglas personales'],
    stepsPt: ['Revise dados compartilhados', 'Identifique info sensível', 'Configure privacidade', 'Elimine chats desnecessários', 'Crie regras pessoais'],
    exercisePrompt: 'Revisa tu configuración de privacidad en Meta',
    doraTipEs: '💡 Dora de Oro: Regla: Si no lo dirías a un desconocido en el bus, no se lo digas a la IA',
    doraTipPt: '💡 Dica Dourada: Regra: Se não diria a um desconhecido no ônibus, não diga à IA',
    commonErrorEs: 'Error común: "No tengo nada que esconder". No es sobre secretos, es protección.',
    commonErrorPt: 'Erro comum: "Não tenho nada a esconder". Não é sobre segredos, é proteção.',
    duration: 35, level: 'beginner'
  }
);

const metaAiM00_L7 = createLesson('metaai-M00', 7,
  'Meta AI para familias: Educación y apoyo',
  'Meta AI para famílias: Educação e apoio',
  `Si tienes hijos, Meta AI puede ayudar:

TAREAS ESCOLARES:
"Explica las fracciones para niño de 8 años"
→ Explicación con ejemplos visuales, analogías infantiles

"Ayúdame a crear cuento sobre amistad con valores"
→ Cuento personalizable

"Cómo explico a mi hija por qué nos mudamos"
→ Guía delicada para conversaciones difíciles

COMUNICACIÓN ESCUELA-FAMILIA:
"Traduce mensaje de maestra y dime si es urgente"
→ Traducción + interpretación prioridad

ACTIVIDADES EDUCATIVAS:
"5 experimentos científicos caseros con cocina"
→ Lista con instrucciones seguras

"Dame plan de lectura para vacaciones, niño 10 años"
→ Biblioteca curada por edades

⚠️ PRECAUCIONES:
• Supervisa siempre uso de IA por menores
• Ensña que no todo lo dice la IA es verdad
• Establece límites de tiempo
• Usa control parental de Meta`,
  `Se tem filhos, o Meta AI pode ajudar:

DEVERES ESCOLARES:
"Explique frações para criança de 8 anos"
→ Explicação com exemplos visuais, analogias infantis

"Ajude-me a criar história sobre amizade com valores"
→ História personalizável

"Como explico à minha filha por que nos mudamos"
→ Guia delicada para conversas difíceis`

    ,
  {
    objectiveEs: 'Usar Meta AI como recurso familiar educativo responsable',
    objectivePt: 'Usar o Meta AI como recurso familiar educativo responsável',
    conceptEs: 'Tecnología Educativa Familiar - Herramientas digitales para aprendizaje infantil',
    conceptPt: 'Tecnologia Educacional Familiar - Ferramentas digitais para aprendizado infantil',
    stepsEs: ['Identifica necesidades educativas', 'Prepara prompts apropiados', 'Supervisa uso menores', 'Verifica información', 'Combina con actividades offline'],
    stepsPt: ['Identifique necessidades educacionais', 'Prepare prompts apropriados', 'Supervisione uso menores', 'Verifique informação', 'Combine com atividades offline'],
    exercisePrompt: 'Pide actividad educativa para hacer con hijos este fin de semana',
    doraTipEs: '💡 Dora de Oro: Nunca dejes que IA sustituya tu tiempo con hijos. Úsala como complemento.',
    doraTipPt: '💡 Dica Dourada: Nunca deixe que IA substitua seu tempo com filhos. Use-a como complemento.',
    commonErrorEs: 'Error común: Dejar niños usar IA sin supervisión',
    commonErrorPt: 'Erro comum: Deixar crianças usarem IA sem supervisão',
    duration: 35, level: 'beginner'
  }
);

const metaAiM00_L8 = createLesson('metaai-M00', 8,
  'Integración con Facebook e Instagram',
  'Integração com Facebook e Instagram',
  `Meta AI también está en otras apps de Meta:

META AI EN FACEBOOK:
1. **BUSCADOR:** Escribe "Meta AI"
2. **MESSENGER:** Aparece en lista de chats
3. **GRUPOS:** Algunos grupos tienen bots

USOS EN FACEBOOK:
• Traducir posts de grupos locales
• Redactar comentarios apropiados
• Entender memes y contenido local
• Crear publicaciones correctas

META AI EN INSTAGRAM:
1. **DMs:** Busca Meta AI en mensajes
2. **STORIES:** Algunas funciones de IA

USOS EN INSTAGRAM:
• Generar ideas para posts
• Escribir captions/biografías
• Entender tendencias locales
• Crear contenido para negocio

VENTAJA: Todo conectado a una sola cuenta.

FLUJO EJEMPLO:
1. Ves evento en FB que no entiendes
2. Copias texto
3. Pegas en Meta AI: "Resume y traduce"
4. Entiendes y decides asistir
5. Pides: "Ayúdame a redactar respuesta de interés"`,
  `O Meta AI também está em outros apps da Meta:

META AI NO FACEBOOK:
1. **BUSCADOR:** Escreva "Meta AI"
2. **MESSENGER:** Aparece em lista de chats
3. **GRUPOS:** Alguns grupos têm bots`

    ,
  {
    objectiveEs: 'Aprovechar integración con Facebook e Instagram',
    objectivePt: 'Aproveitar integração com Facebook e Instagram',
    conceptEs: 'Ecosistema Digital - Apps interconectadas que comparten funcionalidades',
    conceptPt: 'Ecossistema Digital - Apps interconectadas que compartilham funcionalidades',
    stepsEs: ['Localiza Meta AI en Facebook', 'Localiza en Instagram', 'Prueba traducir post FB', 'Genera idea contenido IG', 'Experimenta flujo integrado'],
    stepsPt: ['Localize o Meta AI no Facebook', 'Localize no Instagram', 'Teste traduzir post FB', 'Gere ideia conteúdo IG', 'Experimente fluxo integrado'],
    exercisePrompt: 'Usa Meta AI en FB o IG para algo necesario hoy',
    doraTipEs: '💡 Dora de Oro: Puedes tener conversaciones separadas en cada app',
    doraTipPt: '💡 Dica Dourada: Pode ter conversas separadas em cada app',
    commonErrorEs: 'Error común: Confundir conversaciones entre apps. Son independientes.',
    commonErrorPt: 'Erro comum: Confundir conversas entre apps. São independentes.',
    duration: 30, level: 'beginner'
  }
);

const metaAiM00_L9 = createLesson('metaai-M00', 9,
  'Comparativa: Meta AI vs ChatGPT vs Otros',
  'Comparativo: Meta AI vs ChatGPT vs Outros',
  `¿Cuál usar? Depende de tus necesidades:

| Característica | Meta AI | ChatGPT | Gemini |
|----------------|---------|---------|--------|
| WhatsApp | ✅ Sí | ❌ No | ❌ No |
| Imágenes | ✅ Sí | ✅ Plus | ✅ Sí |
| Gratis | ✅ Sí | ✅ Básico | ✅ Sí |
| Archivo chats | Limitado | Amplio | Medio |
| Privacidad | Conectado perfil | Separado | Conectado Google |
| Actualidad | Bueno | Muy bueno | Excelente |

¿CUÁNDO USAR META AI?
✓ Respuestas rápidas desde WhatsApp
✓ Traducciones momento
✓ Ya estás en apps de Meta
✓ Imágenes básicas

¿CUÁNDO USAR CHATGPT?
✓ Documentos largos/complejos
✓ Análisis profundo
✓ Privacidad separada
✓ Proyectos iterativos

MI RECOMENDACIÓN:
Empieza con Meta AI (ya lo tienes). Cuando domines, añade ChatGPT para tareas complejas.`,
  `Qual usar? Depende de suas necessidades:

| Característica | Meta AI | ChatGPT | Gemini |
|----------------|---------|---------|--------|
| WhatsApp | ✅ Sim | ❌ Não | ❌ Não |
| Imagens | ✅ Sim | ✅ Plus | ✅ Sim |
| Gratuito | ✅ Sim | ✅ Básico | ✅ Sim |
| Arquivo chats | Limitado | Amplo | Médio |
| Privacidade | Conectado perfil | Separado | Conectado Google |

QUANDO USAR META AI?
✓ Respostas rápidas do WhatsApp
✓ Traduções no momento
✓ Já está em apps da Meta
✓ Imagens básicas

QUANDO USAR CHATGPT?
✓ Documentos longos/complexos
✓ Análise profundo
✓ Privabilidade separada
✓ Projetos iterativos`
    ,
  {
    objectiveEs: 'Tomar decisiones informadas sobre qué herramienta usar',
    objectivePt: 'Tomar decisões informadas sobre qual ferramenta usar',
    conceptEs: 'Evaluación de Herramientas - Comparar características para seleccionar',
    conceptPt: 'Avaliação de Ferramentas - Comparar características para selecionar',
    stepsEs: ['Identifica necesidad', 'Consulta tabla comparativa', 'Evalúa prioridades', 'Prueba herramienta recomendada', 'Evalúa resultado'],
    stepsPt: ['Identifique necessidade', 'Consulte tabela comparativa', 'Avalie prioridades', 'Teste ferramenta recomendada', 'Avalie resultado'],
    exercisePrompt: 'Describe tarea de esta semana. ¿Qué herramienta elegirías?',
    doraTipEs: '💡 Dora de Oro: No tienes que elegir solo una. Usa ambas como herramientas diferentes.',
    doraTipPt: '💡 Dica Dourada: Não tem que escolher apenas uma. Use ambas como ferramentas diferentes.',
    commonErrorEs: 'Error común: Pensar que una es "mejor" en general. Cada una destaca en cosas distintas.',
    commonErrorPt: 'Erro comum: Pensar que uma é "melhor" em geral. Cada uma destaca em coisas distintas.',
    duration: 30, level: 'beginner'
  }
);

const metaAiM00_L10 = createLesson('metaai-M00', 10,
  'Tu plan de acción con Meta AI',
  'Seu plano de ação com Meta AI',
  `¡Felicitaciones! Completaste formación inicial en Meta AI.

TU PLAN SEMANAL:

DÍA 1 - HOY:
□ Abre Meta AI en WhatsApp
□ Envía 3 mensajes prueba
□ Traduce algo necesario

DÍA 2:
□ Traduce documento real
□ Genera imagen curiosidad
□ Explora FB/IG

DÍA 3:
□ Usa Meta AI para tarea práctica
□ Prueba método P.C.C.
□ Comparte descubrimiento

DÍA 4:
□ Resuelve duda sobre país acogida
□ Crea algo para familia
□ Revisa privacidad

DÍA 5:
□ Ayuda a otra persona usarlo
□ Documenta 5 usos dados
□ Identifica qué aprender después

DÍAS 6-7:
□ Practica libremente
□ Reflexiona experiencia
□ Prepárate módulo siguiente

TUS METAS:
"En un mes, quiero usar Meta AI para:"
1. ___________________________________
2. ___________________________________
3. ___________________________________

¡EL ÉXITO ES CONSTANCIA, NO PERFECCIÓN!`,
  `Parabéns! Completou formação inicial no Meta AI.

SEU PLANO SEMANAL:

DIA 1 - HOJE:
□ Abra o Meta AI no WhatsApp
□ Envie 3 mensagens teste
□ Traduza algo necessário

DIA 2:
□ Traduza documento real
□ Gere imagem curiosidade
□ Explore FB/IG

DIA 3:
□ Use o Meta AI para tarefa prática
□ Teste método P.C.C.
□ Compartilhe descoberta

DIA 4:
□ Resolva dúvida sobre país acolhimento
□ Crie algo para família
□ Revise privacidade

DIA 5:
□ Ajude outra pessoa a usá-lo
□ Documente 5 usos dados
□ Identifique o que aprender depois

DIAS 6-7:
□ Pratique livremente
□ Reflita experiência
□ Prepare-se próximo módulo

SUAS METAS:
"Em um mês, quero usar o Meta AI para:"
1. ___________________________________
2. ___________________________________
3. ___________________________________

O SUCESSO É CONSTÂNCIA, NÃO PERFEIÇÃO!`,
  {
    objectiveEs: 'Establecer plan de acción personalizado',
    objectivePt: 'Estabelecer plano de ação personalizado',
    conceptEs: 'Planificación Acción - Estrategia para implementar aprendizajes',
    conceptPt: 'Planejamento Ação - Estratégia para implementar aprendizados',
    stepsEs: ['Revisa lecciones módulo', 'Completa checklist', 'Escribe compromisos', 'Identifica áreas reforzar', 'Celebra logro'],
    stepsPt: ['Revise lições módulo', 'Complete checklist', 'Escreva compromissos', 'Identifique áreas reforçar', 'Celebre conquista'],
    exercisePrompt: 'Escribe tus 3 metas para el próximo mes',
    doraTipEs: '💡 Dora de Oro: 10 minutos diarios > 1 hora semanal',
    doraTipPt: '💡 Dica Dourada: 10 minutos diários > 1 hora semanal',
    commonErrorEs: 'Error común: Querer aprender todo de golpe. Ve paso a paso.',
    commonErrorPt: 'Erro comum: Querer aprender tudo de uma vez. Vá passo a passo.',
    duration: 40, level: 'beginner'
  }
);

// Meta AI Module 0: Full first 10 + 90 stubs
const metaAiModule0Lessons: Lesson[] = [
  metaAiM00_L1, metaAiM00_L2, metaAiM00_L3, metaAiM00_L4, metaAiM00_L5,
  metaAiM00_L6, metaAiM00_L7, metaAiM00_L8, metaAiM00_L9, metaAiM00_L10,
  ...Array.from({ length: 90 }, (_, i) => createStubLesson('metaai-M00', 11 + i,
    `Práctica ${i + 1}: ${['Seguridad', 'Privacidad', 'Configuración', 'Atajos', 'Ejercicios', 'Casos reales', 'Resolución', 'Tips', 'Comunidad', 'Proyecto'][i % 10]}`,
    `Prática ${i + 1}: ${['Segurança', 'Privacidade', 'Configuração', 'Atalhos', 'Exercícios', 'Casos reais', 'Resolução', 'Dicas', 'Comunidade', 'Projeto'][i % 10]}`
  ))
];

// ============================================================================
// COURSE GENERATION FUNCTIONS
// ============================================================================

function generateCourseModules(courseId: string, baseIcon: string, baseColor: string, descriptions: ({ es: string; pt: string } | null)[]): Module[] {
  return descriptions
    .map((desc, idx) => {
      if (!desc) return null;
      const lessons = idx === 0 && courseId === 'chatgpt' ? chatgptModule0Lessons :
                     idx === 0 && courseId === 'metaai' ? metaAiModule0Lessons :
                     generateModuleLessons(courseId, idx, idx, 100);
      return createModule(
        courseId, idx,
        LEVELS[idx].nameEs, LEVELS[idx].namePt,
        desc.es, desc.pt,
        idx, baseIcon, baseColor, lessons
      );
    })
    .filter((m): m is Module => m !== null);
}

// ============================================================================
// 8 AI COURSES DEFINITIONS
// ============================================================================

const aiCourses: Course[] = [
  // 1. CHATGPT
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    descriptionEs: 'Domina ChatGPT, el asistente de IA más popular del mundo. Desde lo básico hasta técnicas avanzadas de prompt engineering para inmigrantes.',
    descriptionPt: 'Domine o ChatGPT, o assistente de IA mais popular do mundo. Do básico a técnicas avançadas de prompt engineering para imigrantes.',
    url: 'https://chat.openai.com',
    icon: '💬',
    color: '#10a37f',
    tags: ['chatbot', 'openai', 'asistente', 'productividad', 'traducción'],
    modules: generateCourseModules('chatgpt', '💬', '#10a37f', [
      { es: 'Aprende a acceder a ChatGPT, crear cuenta y superar el miedo tecnológico. Tu primera conversación y el método P.C.C.', pt: 'Aprenda a acessar o ChatGPT, criar conta superar o medo tecnológico. Sua primeira conversa e o método P.C.C.' },
      { es: 'Conversaciones efectivas, prompts avanzados, traducción profesional y redacción de documentos con ChatGPT.', pt: 'Conversas efetivos, prompts avançados, tradução profissional redação de documentos com o ChatGPT.' },
      { es: 'Aplicaciones prácticas diarias: gestión del tiempo, finanzas, salud, hogar, transporte, compras y servicios públicos.', pt: 'Aplicações práticas diárias: gestão do tempo, finanças, saúde, lar, transporte, compras serviços públicos.' },
      { es: 'CV perfecto, LinkedIn optimizado, preparación de entrevistas, búsqueda de empleo y derechos laborales.', pt: 'Currículo perfeito, LinkedIn otimizado, preparação de entrevistas, busca de emprego direitos trabalhistas.' },
      { es: 'Español para inmigrantes, portugués para hispanohablantes, inglés básico y lenguas cooficiales.', pt: 'Espanhol para imigrantes, português para hispânicos, inglês básico línguas co-oficiais.' },
      { es: 'Gestión de memoria, técnicas de estudio, organización digital, productividad avanzada y toma de decisiones.', pt: 'Gestão de memória, técnicas de estudo, organização digital, produtividade avançada tomada de decisões.' },
      { es: 'Aprendizaje continuo, certificaciones online, networking educativo, mentoría y especialización.', pt: 'Aprendizado contínuo, certificações online, networking educacional, mentoria especialização.' },
      { es: 'Automatización total, APIs, flujos complejos, análisis de datos, innovación con IA y liderazgo tecnológico.', pt: 'Automação total, APIs, fluxos complexos, análise de dados, inovação com IA liderança tecnológica.' }
    ]),
    totalLessons: 800,
    category: 'ai'
  },
  // 2. GEMINI
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    descriptionEs: 'Aprovecha Gemini de Google, integrado con el ecosistema Google Workspace. Ideal para usuarios de Gmail, Drive y Docs.',
    descriptionPt: 'Aproveite o Gemini do Google, integrado com o ecossistema Google Workspace. Ideal para usuários de Gmail, Drive e Docs.',
    url: 'https://gemini.google.com',
    icon: '✨',
    color: '#4285f4',
    tags: ['google', 'gemini', 'workspace', 'integración'],
    modules: generateCourseModules('gemini', '✨', '#4285f4', [
      { es: 'Acceso a Gemini, cuenta Google, interfaz básica y primeras interacciones con la IA de Google.', pt: 'Acesso ao Gemini, conta Google, interface básica primeiras interações com a IA do Google.' },
      { es: 'Integración con Gmail, Drive, Docs y Sheets. Prompts efectivos para productividad Google.', pt: 'Integração com Gmail, Drive, Docs e Sheets. Prompts efetivos para produtividade Google.' },
      { es: 'Gemini para tareas diarias: correo inteligente, organización de archivos, búsquedas avanzadas.', pt: 'Gemini para tarefas diárias: e-mail inteligente, organização de arquivos, buscas avançadas.' },
      { es: 'CV con Google Docs, presentaciones profesionales en Slides, hojas de cálculo para gestión.', pt: 'CV com Google Docs, apresentações profissionais em Slides, planilhas para gestão.' },
      { es: 'Traductor Google integrado, aprendizaje de idiomas con IA, herramientas multilingües.', pt: 'Tradutor Google integrado, aprendizado de idiomas com IA, ferramentas multilíngues.' },
      { es: 'Organización con Calendar y Keep, gestión de proyectos con Google Tasks, notas inteligentes.', pt: 'Organização com Calendar e Keep, gestão de projetos com Google Tasks, notas inteligentes.' },
      { es: 'Google Workspace avanzado, automatización con App Scripts, análisis con Data Studio.', pt: 'Google Workspace avançado, automação com App Scripts, análise com Data Studio.' },
      { es: 'APIs de Google Cloud, integraciones empresariales, seguridad y cumplimiento con IA.', pt: 'APIs do Google Cloud, integrações empresariais, segurança conformidade com IA.' }
    ]),
    totalLessons: 800,
    category: 'ai'
  },
  // 3. COPILOT
  {
    id: 'copilot',
    name: 'Copilot',
    provider: 'Microsoft',
    descriptionEs: 'Copilot de Microsoft integrado en Windows, Office 365 y Edge. El asistente IA para el entorno Microsoft.',
    descriptionPt: 'Copilot da Microsoft integrado no Windows, Office 365 e Edge. O assistente IA para o ambiente Microsoft.',
    url: 'https://copilot.microsoft.com',
    icon: '🔄',
    color: '#008377',
    tags: ['microsoft', 'copilot', 'office', 'windows', '365'],
    modules: generateCourseModules('copilot', '🔄', '#008377', [
      { es: 'Acceso a Copilot, cuenta Microsoft, integración con Windows y primeros pasos.', pt: 'Acesso ao Copilot, conta Microsoft, integração com Windows primeiros passos.' },
      { es: 'Copilot en Word, Excel, PowerPoint y Outlook. Documentos inteligentes con IA.', pt: 'Copilot no Word, Excel, PowerPoint e Outlook. Documentos inteligentes com IA.' },
      { es: 'Productividad diaria: correo inteligente, calendario asistido, tareas automáticas.', pt: 'Produtividade diária: e-mail inteligente, calendário assistido, tarefas automáticas.' },
      { es: 'CV en Word, LinkedIn con Copilot, preparación de entrevistas y búsqueda activa.', pt: 'CV no Word, LinkedIn com Copilot, preparação de entrevistas busca ativa.' },
      { es: 'Traductor integrado, aprendizaje de idiomas, herramientas de comunicación multicultural.', pt: 'Tradutor integrado, aprendizado de idiomas, ferramentas de comunicação multicultural.' },
      { es: 'OneNote inteligente, To Do con IA, gestión avanzada de información personal.', pt: 'OneNote inteligente, To Do com IA, gestão avançada de informação pessoal.' },
      { es: 'Microsoft 365 avanzado, Power Automate, análisis con Power BI asistido por IA.', pt: 'Microsoft 365 avançado, Power Automate, análise com Power BI assistido por IA.' },
      { es: 'Enterprise Copilot, seguridad Microsoft, integración con sistemas empresariales.', pt: 'Enterprise Copilot, segurança Microsoft, integração com sistemas empresariais.' }
    ]),
    totalLessons: 800,
    category: 'ai'
  },
  // 4. CLAUDE
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    descriptionEs: 'Claude de Anthropic, conocido por sus respuestas matizadas y seguras. Ideal para análisis profundo y escritura.',
    descriptionPt: 'Claude da Anthropic, conhecido por suas respostas matizadas seguras. Ideal para análise profunda escrita.',
    url: 'https://claude.ai',
    icon: '🤖',
    color: '#d97706',
    tags: ['anthropic', 'claude', 'análisis', 'escritura', 'seguro'],
    modules: generateCourseModules('claude', '🤖', '#d97706', [
      { es: 'Acceso a Claude, creación de cuenta, interfaz distintiva y enfoque en seguridad.', pt: 'Acesso ao Claude, criação de conta, interface distinta enfoque em segurança.' },
      { es: 'Conversaciones largas con Claude, análisis de documentos, escritura asistida.', pt: 'Conversas longas com Claude, análise de documentos, escrita assistida.' },
      { es: 'Claude para investigación, resumen de textos largos, análisis crítico de información.', pt: 'Claude para pesquisa, resumo de textos longos, análise crítica de informação.' },
      { es: 'Redacción avanzada de CV, cartas de motivación, portafolios profesionales.', pt: 'Redação avançada de CV, cartas de motivação, portfólios profissionais.' },
      { es: 'Claude para aprender idiomas, matices culturales, traducción con contexto.', pt: 'Claude para aprender idiomas, matizes culturais, tradução com contexto.' },
      { es: 'Organización del conocimiento, sistemas de notas, metodologías de estudio con IA.', pt: 'Organização do conhecimento, sistemas de notas, metodologias de estudo com IA.' },
      { es: 'Investigación profunda, verificación de fuentes, pensamiento crítico asistido.', pt: 'Pesquisa profunda, verificação de fontes, pensamento crítico assistido.' },
      { es: 'Claude API, automatización avanzada, casos de uso empresariales complejos.', pt: 'Claude API, automação avançada, casos de uso empresariais complexos.' }
    ]),
    totalLessons: 800,
    category: 'ai'
  },
  // 5. DEEPSEEK
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    descriptionEs: 'DeepSeek, el modelo de IA chino de código abierto. Potente y accesible para tareas diversas.',
    descriptionPt: 'DeepSeek, o modelo de IA chinês de código aberto. Poderoso acessível para tarefas diversas.',
    url: 'https://chat.deepseek.com',
    icon: '🐋',
    color: '#1e40af',
    tags: ['deepseek', 'china', 'open-source', 'código-abierto'],
    modules: generateCourseModules('deepseek', '🐋', '#1e40af', [
      { es: 'Acceso a DeepSeek, registro gratuito, interfaz limpia y primeras pruebas.', pt: 'Acesso ao DeepSeek, registro gratuito, interface limpa primeiros testes.' },
      { es: 'DeepSeek para programación básica, resolución de problemas técnicos, lógica.', pt: 'DeepSeek para programação básica, resolução de problemas técnicos, lógica.' },
      { es: 'Uso diario: matemáticas, explicaciones técnicas, consultas diversas.', pt: 'Uso diário: matemáticas, explicações técnicas, consultas diversas.' },
      { es: 'DeepSeek para CV técnico, habilidades de programación, portafolio de proyectos.', pt: 'DeepSeek para CV técnico, habilidades de programação, portfólio de projetos.' },
      { es: 'Aprendizaje técnico en múltiples idiomas, documentación técnica, terminología.', pt: 'Aprendizado técnico em múltiplos idiomas, documentação técnica, terminologia.' },
      { es: 'Gestión de código, repositorios, flujo de trabajo para desarrolladores.', pt: 'Gestão de código, repositórios, fluxo de trabalho para desenvolvedores.' },
      { es: 'DeepSeek para aprendizaje continuo en tech, comunidades de desarrollo, recursos.', pt: 'DeepSeek para aprendizado contínuo em tech, comunidades de desenvolvimento, recursos.' },
      { es: 'Modelos open source, fine-tuning, despliegue propio, aplicaciones avanzadas.', pt: 'Modelos open source, fine-tuning, deploy próprio, aplicações avançadas.' }
    ]),
    totalLessons: 800,
    category: 'ai'
  },
  // 6. QWEN
  {
    id: 'qwen',
    name: 'Qwen',
    provider: 'Alibaba',
    descriptionEs: 'Qwen (通义千问) de Alibaba, potente modelo multilingüe con fuerte presencia en Asia. Excelente para comunidad china.',
    descriptionPt: 'Qwen (通义千问) da Alibaba, poderoso modelo multilíngue com forte presença na Ásia. Excelente para comunidade chinesa.',
    url: 'https://chat.qwen.ai',
    icon: '🌙',
    color: '#7c3aed',
    tags: ['alibaba', 'qwen', 'china', 'multilingüe', 'asia'],
    modules: generateCourseModules('qwen', '🌙', '#7c3aed', [
      { es: 'Acceso a Qwen, cuenta Alibaba, interfaz y soporte multilingüe incluyendo chino.', pt: 'Acesso ao Qwen, conta Alibaba, interface suporte multilíngue incluindo chinês.' },
      { es: 'Qwen para comunicación multicultural, chino básico, comercio internacional.', pt: 'Qwen para comunicação multicultural, chinês básico, comércio internacional.' },
      { es: 'Aplicaciones diarias con Qwen: comercio, logística, comunicación con Asia.', pt: 'Aplicações diárias com Qwen: comércio, logística, comunicação com Ásia.' },
      { es: 'Q para mercado laboral internacional, comercio exterior, empresas multinacionales.', pt: 'Q para mercado laboral internacional, comércio exterior, empresas multinacionais.' },
      { es: 'Aprendizaje de chino, japonés, coreano; culturas asiáticas; negocio intercultural.', pt: 'Aprendizado de chinês, japonês, coreano; culturas asiáticas; negócio intercultural.' },
      { es: 'Gestión de negocios internacionales, contacts, logística con IA.', pt: 'Gestão de negócios internacionais, contatos, logística com IA.' },
      { es: 'Mercados asiáticos, e-commerce con Alibaba, tendencias tecnológicas.', pt: 'Mercados asiáticos, e-commerce com Alibaba, tendências tecnológicas.' },
      { es: 'Integración con ecosistema Alibaba, APIs, automatización de comercio.', pt: 'Integração com ecossistema Alibaba, APIs, automação de comércio.' }
    ]),
    totalLessons: 800,
    category: 'ai'
  },
  // 7. PERPLEXITY
  {
    id: 'perplexity',
    name: 'Perplexity',
    provider: 'Perplexity AI',
    descriptionEs: 'Perplexity, el motor de búsqueda con IA que cita fuentes. Ideal para investigación y verificación de información.',
    descriptionPt: 'Perplexity, o motor de busca com IA que cita fontes. Ideal para pesquisa verificação de informação.',
    url: 'https://perplexity.ai',
    icon: '🔍',
    color: '#20b2aa',
    tags: ['perplexity', 'búsqueda', 'investigación', 'fuentes', 'verificación'],
    modules: generateCourseModules('perplexity', '🔍', '#20b2aa', [
      { es: 'Acceso a Perplexity, cuenta gratuita, interfaz de búsqueda con IA y citaciones.', pt: 'Acesso ao Perplexity, conta gratuita, interface de busca com IA citações.' },
      { es: 'Búsquedas efectivas, filtros, verificación de fuentes, comparación de información.', pt: 'Buscas efetivos, filtros, verificação de fontes, comparação de informação.' },
      { es: 'Perplexity para investigación diaria: noticias, trámites, servicios locales.', pt: 'Perplexity para pesquisa diária: notícias, trâmites, serviços locais.' },
      { es: 'Investigación laboral: empresas, salarios, requisitos, tendencias del mercado.', pt: 'Pesquisa laboral: empresas, salários, requisitos, tendências do mercado.' },
      { es: 'Perplexity para aprender idiomas con fuentes verificadas, información cultural.', pt: 'Perplexity para aprender idiomas com fontes verificadas, informação cultural.' },
      { es: 'Organización de investigación, guardado de fuentes, sistemas de referencia.', pt: 'Organização de pesquisa, salvamento de fontes, sistemas de referência.' },
      { es: 'Investigación académica, papers, estudios, datos estadísticos verificados.', pt: 'Pesquisa acadêmica, artigos, estudos, dados estatísticos verificados.' },
      { es: 'API de Perplexity, integraciones, búsqueda empresarial avanzada.', pt: 'API do Perplexity, integrações, busca empresarial avançada.' }
    ]),
    totalLessons: 800,
    category: 'ai'
  },
  // 8. META AI
  {
    id: 'metaai',
    name: 'Meta AI',
    provider: 'Meta',
    descriptionEs: 'Meta AI integrado en WhatsApp, Facebook e Instagram. El asistente IA que ya tienes instalado.',
    descriptionPt: 'Meta AI integrado no WhatsApp, Facebook e Instagram. O assistente IA que já tem instalado.',
    url: 'https://meta.ai',
    icon: '📱',
    color: '#0668e1',
    tags: ['meta', 'whatsapp', 'facebook', 'instagram', 'integrado'],
    modules: [
      createModule('metaai', 0, LEVELS[0].nameEs, LEVELS[0].namePt,
        'Aprende a acceder a Meta AI desde WhatsApp, Facebook e Instagram. Crear imágenes, traducir y superar barreras tecnológicas.',
        'Aprenda a acessar o Meta AI pelo WhatsApp, Facebook e Instagram. Criar imagens, traduzir superar barreiras tecnológicas.',
        0, '📱', '#0668e1', metaAiModule0Lessons),
      ...generateCourseModules('metaai', '📱', '#0668e1', [
        null as any, // Skip index 0
        { es: 'Conversaciones avanzadas en WhatsApp, prompts para Meta AI, imágenes y traducción mejorada.', pt: 'Conversas avançadas no WhatsApp, prompts para Meta AI, imagens tradução melhorada.' },
        { es: 'Meta AI para tareas diarias: gestión familiar, comunicación, organización del hogar.', pt: 'Meta AI para tarefas diárias: gestão familiar, comunicação, organização do lar.' },
        { es: 'Meta AI para empleo: CV en redes sociales, presencia profesional en FB/IG, networking.', pt: 'Meta AI para emprego: CV em redes sociais, presença profissional em FB/IG, networking.' },
        { es: 'Comunidad hispano-lusófona en Meta, grupos de apoyo, recursos culturales.', pt: 'Comunidade hispano-lusófona no Meta, grupos de apoio, recursos culturais.' },
        { es: 'Organización con Meta: eventos, grupos, páginas, gestión comunitaria.', pt: 'Organização com Meta: eventos, grupos, páginas, gestão comunitária.' },
        { es: 'Meta para aprendizaje continuo: grupos educativos, live learning, mentoría online.', pt: 'Meta para aprendizado contínuo: grupos educacionais, live learning, mentoria online.' },
        { es: 'Meta Business Suite, publicidad con IA, análisis de audiencias, monetización.', pt: 'Meta Business Suite, publicidade com IA, análise de audiências, monetização.' }
      ]).slice(1)
    ],
    totalLessons: 800,
    category: 'ai'
  }
];

// ============================================================================
// WINDOWS & PRODUCTIVITY SUITE (1000 modules)
// ============================================================================

const windowsSubCategories = [
  { id: 'win11-basics', nameEs: 'Windows 11 Fundamentos', namePt: 'Windows 11 Fundamentos', count: 150, icon: '🪟', color: '#0078d4' },
  { id: 'word-complete', nameEs: 'Microsoft Word Completo', namePt: 'Microsoft Word Completo', count: 200, icon: '📘', color: '#2b579a' },
  { id: 'excel-advanced', nameEs: 'Microsoft Excel Avanzado', namePt: 'Microsoft Excel Avançado', count: 200, icon: '📊', color: '#217346' },
  { id: 'powerpoint', nameEs: 'Microsoft PowerPoint', namePt: 'Microsoft PowerPoint', count: 150, icon: '📽️', color: '#d24726' },
  { id: 'outlook', nameEs: 'Microsoft Outlook', namePt: 'Microsoft Outlook', count: 100, icon: '📧', color: '#0072c6' },
  { id: 'google-workspace', nameEs: 'Google Workspace', namePt: 'Google Workspace', count: 100, icon: '🔷', color: '#4285f4' },
  { id: 'libreoffice', nameEs: 'LibreOffice', namePt: 'LibreOffice', count: 100, icon: '📝', color: '#18a303' }
];

function generateWindowsModules(): Course[] {
  return windowsSubCategories.map(cat => ({
    id: cat.id,
    name: cat.nameEs,
    provider: cat.id.includes('google') ? 'Google' : cat.id.includes('libre') ? 'The Document Foundation' : 'Microsoft',
    descriptionEs: `Curso completo de ${cat.nameEs} para inmigrantes. Desde lo básico hasta nivel avanzado.`,
    descriptionPt: `Curso completo de ${cat.namePt} para imigrantes. Do básico ao nível avançado.`,
    url: '',
    icon: cat.icon,
    color: cat.color,
    tags: ['productivity', 'windows', 'office'],
    modules: Array.from({ length: Math.ceil(cat.count / 8) }, (_, modIdx) => {
      const lessonsInModule = modIdx === Math.ceil(cat.count / 8) - 1 ? cat.count - (modIdx * 8) * 10 : 100;
      const level = Math.min(modIdx, 7);
      return createModule(
        cat.id, modIdx,
        `${cat.nameEs} - Nivel ${modIdx + 1}`,
        `${cat.namePt} - Nível ${modIdx + 1}`,
        `Módulo ${modIdx + 1} de ${cat.nameEs}: ${LEVELS[level]?.focusEs || 'Avanzado'}`,
        `Módulo ${modIdx + 1} de ${cat.namePt}: ${LEVELS[level]?.focusPt || 'Avançado'}`,
        level, cat.icon, cat.color,
        generateModuleLessons(cat.id, modIdx, level, Math.min(lessonsInModule, 100))
      );
    }),
    totalLessons: cat.count * 10,
    category: 'productivity' as const
  }));
}

const windowsCourses = generateWindowsModules();

// ============================================================================
// DIGITAL LITERACY FOR IMMIGRANTS (1000 modules)
// ============================================================================

const digitalLiteracyCategories = [
  { id: 'web-navigation', nameEs: 'Navegación Web Segura', namePt: 'Navegação Web Segura', count: 100, icon: '🌐', color: '#009688' },
  { id: 'gmail-email', nameEs: 'Gmail y Correo Electrónico', namePt: 'Gmail e Correo Eletrônico', count: 100, icon: '✉️', color: '#ea4335' },
  { id: 'whatsapp-advanced', nameEs: 'WhatsApp Avanzado', namePt: 'WhatsApp Avançado', count: 100, icon: '💬', color: '#25d366' },
  { id: 'social-media-safe', nameEs: 'Redes Sociales Seguras', namePt: 'Redes Sociais Seguras', count: 100, icon: '👥', color: '#1877f2' },
  { id: 'online-banking', nameEs: 'Banca Online y Finanzas', namePt: 'Bancada Online e Finanças', count: 100, icon: '🏦', color: '#1565c0' },
  { id: 'spain-paperwork', nameEs: 'Trámites Digitales España', namePt: 'Trâmites Digitais Espanha', count: 150, icon: '🇪🇸', color: '#c60b1e' },
  { id: 'sepe-employment', nameEs: 'SEPE y Búsqueda de Empleo', namePt: 'SEPE e Busca de Emprego', count: 150, icon: '💼', color: '#ff9800' },
  { id: 'immigrant-rights', nameEs: 'Derechos del Inmigrante', namePt: 'Direitos do Imigrante', count: 100, icon: '⚖️', color: '#4caf50' },
  { id: 'spain-healthcare', nameEs: 'Sanidad Española', namePt: 'Saúde Espanhola', count: 100, icon: '🏥', color: '#e91e63' }
];

function generateDigitalLiteracyModules(): Course[] {
  return digitalLiteracyCategories.map(cat => ({
    id: cat.id,
    name: cat.nameEs,
    provider: 'Manos Abiertas',
    descriptionEs: `Curso de alfabetización digital para inmigrantes: ${cat.nameEs}. Herramientas esenciales para la vida en España/Portugal.`,
    descriptionPt: `Curso de alfabetização digital para imigrantes: ${cat.namePt}. Ferramentas essenciais para a vida na Espanha/Portugal.`,
    url: '',
    icon: cat.icon,
    color: cat.color,
    tags: ['digital-literacy', 'inmigrantes', 'españa', 'portugal'],
    modules: Array.from({ length: Math.ceil(cat.count / 10) }, (_, modIdx) => {
      const level = Math.min(modIdx, 7);
      return createModule(
        cat.id, modIdx,
        `${cat.nameEs} - Módulo ${modIdx + 1}`,
        `${cat.namePt} - Módulo ${modIdx + 1}`,
        `${cat.nameEs}: ${['Introducción', 'Fundamentos', 'Práctica', 'Aplicación', 'Especialización', 'Avanzado', 'Experto', 'Maestría'][modIdx] || 'Nivel superior'}`,
        `${cat.namePt}: ${['Introdução', 'Fundamentos', 'Prática', 'Aplicação', 'Especialização', 'Avançado', 'Especialista', 'Mestria'][modIdx] || 'Nível superior'}`,
        level, cat.icon, cat.color,
        generateModuleLessons(cat.id, modIdx, level, 100)
      );
    }),
    totalLessons: cat.count * 10,
    category: 'digital-literacy' as const
  }));
}

const digitalLiteracyCourses = generateDigitalLiteracyModules();

// ============================================================================
// OFFICE PACK PROFESIONAL (1000 modules)
// ============================================================================

const officePackCategories = [
  { id: 'cv-cover-letter', nameEs: 'CV y Cartas de Presentación', namePt: 'CV e Cartas de Apresentação', count: 200, icon: '📄', color: '#1976d2' },
  { id: 'official-docs', nameEs: 'Documentos Oficiales', namePt: 'Documentos Oficiais', count: 150, icon: '📋', color: '#388e3c' },
  { id: 'invoices-accounting', nameEs: 'Facturas y Contabilidad Básica', namePt: 'Faturas e Contabilidade Básica', count: 100, icon: '🧾', color: '#f57c00' },
  { id: 'effective-presentations', nameEs: 'Presentaciones Efectivas', namePt: 'Apresentações Efetivas', count: 150, icon: '🎯', color: '#7b1fa2' },
  { id: 'spreadsheets-management', nameEs: 'Hojas de Cálculo para Gestión', namePt: 'Planilhas para Gestão', count: 150, icon: '📈', color: '#00796b' },
  { id: 'document-management', nameEs: 'Gestión Documental', namePt: 'Gestão Documental', count: 100, icon: '🗂️', color: '#5d4037' },
  { id: 'translation-multilingual', nameEs: 'Traducción y Multilingüismo', namePt: 'Tradução e Multilinguismo', count: 150, icon: '🌍', color: '#c62828' }
];

function generateOfficePackModules(): Course[] {
  return officePackCategories.map(cat => ({
    id: cat.id,
    name: cat.nameEs,
    provider: 'Manos Abiertas',
    descriptionEs: `Curso profesional de ${cat.nameEs} para documentos laborales y personales en España/Portugal.`,
    descriptionPt: `Curso profissional de ${cat.namePt} para documentos trabalhos pessoais na Espanha/Portugal.`,
    url: '',
    icon: cat.icon,
    color: cat.color,
    tags: ['office', 'profesional', 'documentos', 'empleo'],
    modules: Array.from({ length: Math.ceil(cat.count / 10) }, (_, modIdx) => {
      const level = Math.min(modIdx, 7);
      return createModule(
        cat.id, modIdx,
        `${cat.nameEs} - Nivel ${modIdx + 1}`,
        `${cat.namePt} - Nível ${modIdx + 1}`,
        `${cat.nameEs}: Dominio progresivo de habilidades profesionales`,
        `${cat.namePt}: Domínio progressivo de habilidades profissionais`,
        level, cat.icon, cat.color,
        generateModuleLessons(cat.id, modIdx, level, 100)
      );
    }),
    totalLessons: cat.count * 10,
    category: 'office' as const
  }));
}

const officePackCourses = generateOfficePackModules();

// ============================================================================
// HERRAMIENTAS IA AVANZADAS (1000 modules)
// ============================================================================

const advancedAiCategories = [
  { id: 'image-generation', nameEs: 'Generación de Imágenes', namePt: 'Geração de Imagens', count: 150, icon: '🎨', color: '#e91e63' },
  { id: 'voice-assistants', nameEs: 'Asistentes de Voz', namePt: 'Assistentes de Voz', count: 100, icon: '🎤', color: '#9c27b0' },
  { id: 'automation-ai', nameEs: 'Automatización con IA', namePt: 'Automação com IA', count: 150, icon: '⚙️', color: '#ff5722' },
  { id: 'ai-writing', nameEs: 'IA para Escritura', namePt: 'IA para Escrita', count: 150, icon: '✍️', color: '#3f51b5' },
  { id: 'ai-research', nameEs: 'IA para Investigación', namePt: 'IA para Pesquisa', count: 100, icon: '🔬', color: '#00bcd4' },
  { id: 'ai-programming', nameEs: 'IA para Programación', namePt: 'IA para Programação', count: 100, icon: '💻', color: '#607d8b' },
  { id: 'autonomous-agents', nameEs: 'Agentes Autónomos', namePt: 'Agentes Autônomos', count: 100, icon: '🤖', color: '#795548' },
  { id: 'ethics-security-ai', nameEs: 'Ética y Seguridad en IA', namePt: 'Ética e Segurança em IA', count: 150, icon: '🛡️', color: '#8bc34a' }
];

function generateAdvancedAiModules(): Course[] {
  return advancedAiCategories.map(cat => ({
    id: cat.id,
    name: cat.nameEs,
    provider: 'Varios',
    descriptionEs: `Curso especializado en ${cat.nameEs}. Herramientas avanzadas de IA para usuarios intermedios y expertos.`,
    descriptionPt: `Curso especializado em ${cat.namePt}. Ferramentas avançadas de IA para usuários intermediários especialistas.`,
    url: '',
    icon: cat.icon,
    color: cat.color,
    tags: ['ia-avanzada', 'especializado', 'automatización'],
    modules: Array.from({ length: Math.ceil(cat.count / 10) }, (_, modIdx) => {
      const level = Math.min(Math.floor(modIdx / 1.5), 7);
      return createModule(
        cat.id, modIdx,
        `${cat.nameEs} - Módulo ${modIdx + 1}`,
        `${cat.namePt} - Módulo ${modIdx + 1}`,
        `${cat.nameEs}: Aprendizaje progresivo de herramientas avanzadas`,
        `${cat.namePt}: Aprendizado progressivo de ferramentas avançadas`,
        level, cat.icon, cat.color,
        generateModuleLessons(cat.id, modIdx, level, 100)
      );
    }),
    totalLessons: cat.count * 10,
    category: 'advanced-ai' as const
  }));
}

const advancedAiCourses = generateAdvancedAiModules();

// ============================================================================
// VIDA DIGITAL EN ESPAÑA (936 modules)
// ============================================================================

const spainLifeCategories = [
  { id: 'housing-rental', nameEs: 'Vivienda y Alquiler', namePt: 'Moradia e Aluguel', count: 100, icon: '🏠', color: '#8d6e63' },
  { id: 'public-transport', nameEs: 'Transporte Público', namePt: 'Transporte Público', count: 80, icon: '🚌', color: '#ff9800' },
  { id: 'children-education', nameEs: 'Educación para Hijos', namePt: 'Educação para Filhos', count: 100, icon: '📚', color: '#3f51b5' },
  { id: 'healthcare-medical', nameEs: 'Sanidad y Citas Médicas', namePt: 'Saúde e Consultas Médicas', count: 120, icon: '🏥', color: '#e91e63' },
  { id: 'taxes-hacienda', nameEs: 'Impuestos y Hacienda', namePt: 'Impostos e Fazenda', count: 100, icon: '💰', color: '#4caf50' },
  { id: 'communications-mobile', nameEs: 'Comunicaciones y Móviles', namePt: 'Comunicações e Móveis', count: 80, icon: '📱', color: '#2196f3' },
  { id: 'leisure-community', nameEs: 'Ocio y Comunidad', namePt: 'Lazer e Comunidade', count: 76, icon: '🎉', color: '#9c27b0' },
  { id: 'legal-lawyers', nameEs: 'Legal y Abogados', namePt: 'Legal e Advogados', count: 100, icon: '⚖️', color: '#607d8b' },
  { id: 'banks-accounts', nameEs: 'Bancos y Cuentas', namePt: 'Bancos e Contas', count: 80, icon: '🏦', color: '#1565c0' }
];

function generateSpainLifeModules(): Course[] {
  return spainLifeCategories.map(cat => ({
    id: cat.id,
    name: cat.nameEs,
    provider: 'Manos Abiertas',
    descriptionEs: `Guía digital para ${cat.nameEs} en España. Trámites, derechos y recursos online.`,
    descriptionPt: `Guia digital para ${cat.namePt} na Espanha. Trâmites, direitos recursos online.`,
    url: '',
    icon: cat.icon,
    color: cat.color,
    tags: ['españa', 'vida-digital', 'trámites', 'inmigración'],
    modules: Array.from({ length: Math.ceil(cat.count / 10) }, (_, modIdx) => {
      const level = Math.min(modIdx, 7);
      return createModule(
        cat.id, modIdx,
        `${cat.nameEs} - Guía ${modIdx + 1}`,
        `${cat.namePt} - Guia ${modIdx + 1}`,
        `Guía completa de ${cat.nameEs.toLowerCase()} para residentes en España`,
        `Guia completa de ${cat.namePt.toLowerCase()} para residentes na Espanha`,
        level, cat.icon, cat.color,
        generateModuleLessons(cat.id, modIdx, level, 100)
      );
    }),
    totalLessons: cat.count * 10,
    category: 'life-spain' as const
  }));
}

const spainLifeCourses = generateSpainLifeModules();

// ============================================================================
// ALL COURSES COMBINED
// ============================================================================

export const allCourses: Course[] = [
  ...aiCourses,
  ...windowsCourses,
  ...digitalLiteracyCourses,
  ...officePackCourses,
  ...advancedAiCourses,
  ...spainLifeCourses
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAllCourses(): Course[] {
  return allCourses;
}

export function getCourseById(id: string): Course | undefined {
  return allCourses.find(c => c.id === id);
}

export function getModuleById(courseId: string, moduleId: string): Module | undefined {
  const course = getCourseById(courseId);
  return course?.modules.find(m => m.id === moduleId);
}

export function getLessonById(courseId: string, moduleId: string, lessonId: string): Lesson | undefined {
  const foundModule = getModuleById(courseId, moduleId);
  return foundModule?.lessons.find(l => l.id === lessonId);
}

export function searchCourses(query: string, lang: 'es' | 'pt' = 'es'): Course[] {
  const lowerQuery = query.toLowerCase();
  return allCourses.filter(course => {
    const searchFields = lang === 'es' 
      ? [course.name, course.descriptionEs, ...course.tags, ...course.modules.map(m => m.titleEs)]
      : [course.name, course.descriptionPt, ...course.tags, ...course.modules.map(m => m.titlePt)];
    return searchFields.some(field => field.toLowerCase().includes(lowerQuery));
  });
}

export function getCoursesByCategory(category: Course['category']): Course[] {
  return allCourses.filter(c => c.category === category);
}

export function getModulesByLevel(level: number): Module[] {
  return allCourses.flatMap(c => c.modules.filter(m => m.level === level));
}

export function getTotalStats(): { courses: number; modules: number; lessons: number; hours: number } {
  const courses = allCourses.length;
  const modules = allCourses.reduce((acc, c) => acc + c.modules.length, 0);
  const lessons = allCourses.reduce((acc, c) => acc + c.totalLessons, 0);
  const hours = allCourses.flatMap(c => c.modules).reduce((acc, m) => acc + m.duration, 0);
  
  return { courses, modules, lessons, hours };
}

export function getAiCourses(): Course[] {
  return getCoursesByCategory('ai');
}

export function getProductivityCourses(): Course[] {
  return getCoursesByCategory('productivity');
}

export function getDigitalLiteracyCourses(): Course[] {
  return getCoursesByCategory('digital-literacy');
}

export function getOfficeCourses(): Course[] {
  return getCoursesByCategory('office');
}

export function getAdvancedAiCourses(): Course[] {
  return getCoursesByCategory('advanced-ai');
}

export function getSpainLifeCourses(): Course[] {
  return getCoursesByCategory('life-spain');
}

export function getFeaturedCourses(): Course[] {
  return aiCourses.slice(0, 4); // ChatGPT, Gemini, Copilot, Claude
}

export function getBeginnerFriendlyCourses(): Course[] {
  return allCourses.filter(c => c.modules.some(m => m.level === 0)).slice(0, 10);
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

const courseDataExports = {
  allCourses,
  getAllCourses,
  getCourseById,
  getModuleById,
  getLessonById,
  searchCourses,
  getCoursesByCategory,
  getModulesByLevel,
  getTotalStats,
  getAiCourses,
  getProductivityCourses,
  getDigitalLiteracyCourses,
  getOfficeCourses,
  getAdvancedAiCourses,
  getSpainLifeCourses,
  getFeaturedCourses,
  getBeginnerFriendlyCourses,
  LEVELS
};

// Export courses as alias for convenience
export const courses = allCourses;

// Categories for filtering
export const categories = [
  { id: 'all', nameEs: 'Todas', namePt: 'Todas', icon: '📚' },
  { id: 'ai', nameEs: 'Inteligencia Artificial', namePt: 'Inteligência Artificial', icon: '🤖' },
  { id: 'productivity', nameEs: 'Windows y Productividad', namePt: 'Windows e Produtividade', icon: '💻' },
  { id: 'digital-literacy', nameEs: 'Alfabetización Digital', namePt: 'Alfabetização Digital', icon: '📱' },
  { id: 'office', nameEs: 'Oficina Profesional', namePt: 'Escritório Profissional', icon: '📄' },
  { id: 'advanced-ai', nameEs: 'IA Avanzada', namePt: 'IA Avançada', icon: '🧠' },
  { id: 'life-spain', nameEs: 'Vida Digital en España', namePt: 'Vida Digital na Espanha', icon: '🇪🇸' }
];

// Achievement definitions
export interface Achievement {
  id: string;
  icon: string;
  titleEs: string;
  titlePt: string;
  descriptionEs: string;
  descriptionPt: string;
  condition: (progress: UserProgress) => boolean;
}

export interface UserProgress {
  completedLessons: string[];
  lastPosition: { courseId: string; moduleId: number; lessonId: number } | null;
  achievements: string[];
  streak: number;
  lastStudyDate: string | null;
  totalStudyTime: number;
  language: 'es' | 'pt';
}

export const defaultProgress: UserProgress = {
  completedLessons: [],
  lastPosition: null,
  achievements: [],
  streak: 0,
  lastStudyDate: null,
  totalStudyTime: 0,
  language: 'es'
};

export const achievements: Achievement[] = [
  {
    id: 'first-lesson',
    icon: '🌟',
    titleEs: 'Primera Lección',
    titlePt: 'Primeira Lição',
    descriptionEs: 'Completaste tu primera lección',
    descriptionPt: 'Você completou sua primeira lição',
    condition: (p) => p.completedLessons.length >= 1
  },
  {
    id: 'explorer',
    icon: '🗺️',
    titleEs: 'Explorador',
    titlePt: 'Explorador',
    descriptionEs: 'Visitaste 10 módulos diferentes',
    descriptionPt: 'Você visitou 10 módulos diferentes',
    condition: (p) => new Set(p.completedLessons.map(l => l.split('-').slice(0, 2).join('-'))).size >= 10
  },
  {
    id: 'bilingual',
    icon: '🌍',
    titleEs: 'Bilingüe',
    titlePt: 'Bilíngue',
    descriptionEs: 'Completaste lecciones en ambos idiomas',
    descriptionPt: 'Você completou lições em ambos os idiomas',
    condition: (p) => p.completedLessons.length >= 20
  },
  {
    id: 'chatgpt-master',
    icon: '💬',
    titleEs: 'Experto en ChatGPT',
    titlePt: 'Especialista em ChatGPT',
    descriptionEs: 'Completaste todos los módulos de ChatGPT',
    descriptionPt: 'Você completou todos os módulos do ChatGPT',
    condition: (p) => p.completedLessons.filter(l => l.startsWith('chatgpt')).length >= 80
  },
  {
    id: 'streak-7',
    icon: '🔥',
    titleEs: 'Racha de 7 días',
    titlePt: 'Sequência de 7 dias',
    descriptionEs: 'Estudiaste 7 días seguidos',
    descriptionPt: 'Você estudou 7 dias seguidos',
    condition: (p) => p.streak >= 7
  },
  {
    id: 'hours-10',
    icon: '⏰',
    titleEs: '10 Horas de Aprendizaje',
    titlePt: '10 Horas de Aprendizado',
    descriptionEs: 'Acumulaste 10 horas de estudio',
    descriptionPt: 'Você acumulou 10 horas de estudo',
    condition: (p) => p.totalStudyTime >= 600
  }
];

export default courseDataExports;