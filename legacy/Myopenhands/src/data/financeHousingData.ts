export interface BankGuideItem {
  id: string;
  title: string;
  category: 'account' | 'microloan' | 'remittance' | 'autonomo';
  summary: string;
  legalRights: string[];
  recommendedEntities: string[];
  actionSteps: string[];
}

export const FINANCIAL_GUIDES: BankGuideItem[] = [
  {
    id: 'cuenta-pago-basica',
    title: 'Cuenta de Pago Básica Gratuita por Ley (RD-ley 19/2017)',
    category: 'account',
    summary: 'En España, cualquier persona física que resida legalmente o sin permiso de residencia (incluso en situación irregular o solicitante de asilo) tiene derecho por ley a abrir una Cuenta Bancaria Básica sin comisión de mantenimiento.',
    legalRights: [
      'Los bancos NO pueden denegar la apertura alegando falta de NIE: el pasaporte original en vigor es un documento de identidad válido reconocido legalmente.',
      'Comisión máxima regulada por ley: 3 € al mes (y 0 € gratuita para personas en situación de vulnerabilidad económica o riesgo de exclusión).',
      'Incluye tarjeta de débito gratuita, retiradas de efectivo en cajeros de la entidad, transferencias SEPA ilimitadas y domiciliación de nóminas o subsidios.',
      'Si un banco rechaza la apertura, está obligado a entregar la denegación por escrito motivada en un plazo máximo de 10 días para poder reclamar ante el Banco de España.'
    ],
    recommendedEntities: ['CaixaBank', 'BBVA', 'Banco Santander', 'Triodos Bank', 'Fiare Banca Ética', 'Cajas Rurales'],
    actionSteps: [
      'Paso 1: Acudir a la sucursal bancaria con el pasaporte original en vigor.',
      'Paso 2: Solicitar expresamente la "Cuenta de Pago Básica" al amparo del Real Decreto-ley 19/2017.',
      'Paso 3: Si se solicitan condiciones gratuitas, aportar certificado de empadronamiento y vida laboral o declaración de ingresos.',
      'Paso 4: En caso de negativa verbal del empleado, solicitar la "Hoja Oficial de Reclamaciones" del banco y exigir respuesta por escrito.'
    ]
  },
  {
    id: 'microcreditos-emprendimiento',
    title: 'Microcréditos Sociales para Emprender sin Aval',
    category: 'microloan',
    summary: 'Financiación de hasta 30.000 € destinada a personas migrantes, autónomos y microempresas que tienen una idea de negocio viable pero carecen de avales patrimoniales o historial crediticio en España.',
    legalRights: [
      'No se exige aval personal ni garantía hipotecaria.',
      'Financiación hasta el 100% del proyecto de apertura de comercio, taller, servicio técnico o autoempleo.',
      'Tipo de interés social bonificado y período de carencia de hasta 6 meses.',
      'El requisito principal es presentar un Plan de Empresa validado por una entidad social colaboradora (Cáritas, Cruz Roja, Fundación Nantik Lum, CEAR o Cámara de Comercio).'
    ],
    recommendedEntities: ['MicroBank (Fundación "la Caixa")', 'Fundación Nantik Lum', 'Acción contra el Hambre (Vives Emprende)', 'Fiare Banca Ética'],
    actionSteps: [
      'Paso 1: Redactar la memoria del proyecto (producto/servicio, clientes potenciales y presupuesto estimado).',
      'Paso 2: Acudir a una ONG colaboradora para recibir asesoramiento técnico y elaborar el Plan de Viabilidad.',
      'Paso 3: La entidad emite el Informe Favorable de Viabilidad.',
      'Paso 4: Presentación en la entidad financiera para la formalización y desembolso del microcrédito.'
    ]
  },
  {
    id: 'remesas-transparentes',
    title: 'Envío Seguro de Remesas a Familiares',
    category: 'remittance',
    summary: 'Consejos para transferir dinero a tu país de origen evitando comisiones abusivas ocultas en el tipo de cambio y protegiendo tu dinero de operadores no registrados.',
    legalRights: [
      'Compara el Tipo de Cambio Real frente al oficial del mercado de divisas (interbancario) antes de enviar.',
      'Verifica que la empresa de transferencia esté autorizada como Entidad de Pago por el Banco de España.',
      'Conserva siempre el resguardo con el código único de transacción (MTCN o identificador de seguimiento).'
    ],
    recommendedEntities: ['Wise (TransferWise)', 'Remitly', 'Correos Pay', 'Ria Money Transfer', 'Western Union'],
    actionSteps: [
      'Paso 1: Evitar intermediarios informales o transferencias en mano sin recibo legal.',
      'Paso 2: Comprobar el coste total: Comisión fija + margen de cambio de divisa.',
      'Paso 3: Guardar el justificante para acreditar el envío de ayuda familiar si lo solicita Extranjería para reagrupación.'
    ]
  },
  {
    id: 'alta-autonomos-tarifa-plana',
    title: 'Alta de Autónomos y Tarifa Plana Reducida',
    category: 'autonomo',
    summary: 'Guía para iniciar actividad laboral por cuenta propia con la Tarifa Plana reducida de Seguridad Social durante los primeros 12 o 24 meses.',
    legalRights: [
      'Cuota reducida mensual bonificada durante el primer año (80 €/mes aproximadamente).',
      'Prórroga de otros 12 meses si los rendimientos netos no superan el SMI.',
      'Compatibilidad con facturación formal, deducción de gastos de actividad y cotización para jubilación y cese de actividad.'
    ],
    recommendedEntities: ['Seguridad Social (RETA)', 'Agencia Tributaria (Hacienda modelo 036/037)', 'Puntos PAE (Atención al Emprendedor)'],
    actionSteps: [
      'Paso 1: Darse de alta en el Censo de Empresarios de Hacienda (Modelo 036 o 037 telemático).',
      'Paso 2: Alta simultánea en el Régimen Especial de Trabajadores Autónomos (RETA) en Import@ss dentro de los 60 días naturales.',
      'Paso 3: Abrir cuenta bancaria específica para el negocio y llevar registro de facturas emitidas y recibidas.'
    ]
  }
];

export interface HousingGuideItem {
  id: string;
  title: string;
  summary: string;
  regulations: string[];
  depositRights: string[];
  warningSigns: string[];
}

export const HOUSING_GUIDES: HousingGuideItem[] = [
  {
    id: 'contrato-alquiler-lau',
    title: 'Derechos Básicos en el Alquiler de Vivienda (LAU)',
    summary: 'La Ley de Arrendamientos Urbanos (LAU) protege al inquilino otorgándole el derecho a permanecer en la vivienda durante un mínimo de 5 años (o 7 años si el arrendador es una empresa), prorrogables anualmente a voluntad del inquilino.',
    regulations: [
      'Duración obligatoria: Aunque firmes por 1 año, el contrato se prorroga obligatoriamente hasta 5 años (o 7 si es persona jurídica), salvo que el inquilino avise con 30 días de antelación que desea marcharse.',
      'Fianza legal máxima: La fianza obligatoria por ley para vivienda habitual es de SOLO 1 MES de renta (más un máximo adicional de 2 meses como garantía adicional pactada).',
      'Gastos de gestión inmobiliaria: Desde la Ley de Vivienda de 2023, los honorarios de la agencia inmobiliaria y gastos de formalización del contrato corren SIEMPRE a cargo del propietario, NUNCA del inquilino.',
      'Subida anual de renta: La actualización anual está desvinculada del IPC descontrolado y topada por ley según los índices oficiales del INE.'
    ],
    depositRights: [
      'El propietario está obligado por ley a depositar la fianza en el organismo público autonómico (IVIMA en Madrid, INCASÒL en Cataluña, AVRA en Andalucía, etc.).',
      'Exige el justificante oficial del depósito de fianza: es imprescindible para solicitar ayudas al alquiler y para desgravar el alquiler en la declaración de la Renta.',
      'Al finalizar el contrato, el arrendador tiene 30 días naturales para devolver la fianza íntegra si no hay desperfectos imputables al inquilino.'
    ],
    warningSigns: [
      'Propietarios que se niegan a firmar contrato o exigen pagar en efectivo sin emitir recibo o justificante bancario.',
      'Cláusulas que prohíben empadronarse (¡completamente ilegales y nulas de pleno derecho!).',
      'Agencias que intentan cobrarte "mes de agencia" camuflado bajo conceptos como "estudio de viabilidad" o "gestión administrativa".',
      'Exigencia de más de 3 meses de garantía entre fianza y depósitos extra.'
    ]
  },
  {
    id: 'alquiler-habitaciones-subarriendo',
    title: 'Alquiler de Habitaciones y Subarriendos',
    summary: 'Muchos migrantes comienzan alquilando una habitación. Conoce qué derechos tienes, cómo empadronarte y cómo evitar estafas en pisos compartidos.',
    regulations: [
      'El subarriendo de vivienda requiere siempre el consentimiento expreso y por escrito del propietario principal.',
      'El contrato de habitación se rige por el Código Civil: pacta por escrito el precio, qué suministros incluye (agua, luz, internet), normas de uso de zonas comunes y plazo de preaviso para marcharse.',
      'Tienes derecho inalienable a empadronarte en la habitación donde resides habitualmente aportando el contrato de habitación firmado o solicitando informe de servicios sociales.'
    ],
    depositRights: [
      'La fianza de una habitación suele ser de 1 mes de renta.',
      'Firma siempre un documento de entrega y comprobación del estado de la habitación al entrar (toma fotos con fecha).'
    ],
    warningSigns: [
      'Caseros que amenazan con llamar a la policía o a extranjería: la policía no desaloja sin orden judicial y no puede expulsar por un conflicto civil de inquilinato.',
      'Cortes intencionados de luz o agua: constituye un delito de coacciones castigado por el Código Penal.'
    ]
  }
];
