export const CONTACT_EMAIL = "uleamieee@gmail.com";
export const IEEE_WEB_URL = "https://edu.ieee.org/ec-uleam/";

export const ORGANIZER = {
  branch: "Rama Estudiantil IEEE ULEAM",
  university: "Universidad Laica Eloy Alfaro de Manabí",
  shortUniversity: "ULEAM",
  city: "Manta",
  email: "uleamieee@gmail.com",
  web: "https://edu.ieee.org/ec-uleam/",
} as const;

export const EVENT = {
  presentationDate: "Miércoles 11 de noviembre de 2026",
  presentationLocation: "ULEAM, Manta",
  arrivalDate: "Martes 10 de noviembre de 2026",
  registrationOpen: "25 de mayo de 2026",
  registrationClose: "11 de octubre de 2026 a las 23:59",
  ieeeCost: "Gratis",
  nonIeeeCost: "$15.00 USD por equipo",
} as const;

export const BANK_DETAILS = {
  amount: "$15.00 USD",
  bank: "Banco Pichincha",
  accountType: "Ahorro transaccional",
  accountNumber: "2209748595",
  holder: "Muñoz Delgado Jordy Josué",
} as const;

export const EXPERIENCE_NODES = [
  {
    id: "mission",
    code: "01",
    title: "Misión",
    description: "Conoce el propósito del concurso y el impacto IoT que buscamos.",
    href: "/experiencia",
  },
  {
    id: "categories",
    code: "02",
    title: "Nodos",
    description: "Explora las 5 categorías de impacto tecnológico.",
    href: "/experiencia#categorias",
  },
  {
    id: "protocol",
    code: "03",
    title: "Protocolo",
    description: "Requisitos, cronograma, evaluación y bases oficiales.",
    href: "/bases",
  },
  {
    id: "register",
    code: "04",
    title: "Conexión",
    description: "Inscribe tu equipo y envía tu proyecto.",
    href: "/inscripcion",
  },
  {
    id: "alliance",
    code: "05",
    title: "Alianza",
    description: "Organizadores, sponsors y oportunidades de patrocinio.",
    href: "/organizacion",
  },
] as const;

export const CATEGORIES = [
  {
    id: "smart-cities",
    name: "Smart Cities e Infraestructura Urbana Autónoma",
    shortName: "Smart Cities",
    description:
      "IoT para ciudades inteligentes, infraestructura urbana autónoma, movilidad y servicios conectados.",
    icon: "building",
  },
  {
    id: "economia-azul-agrotech",
    name: "Economía Azul, Acuicultura de Precisión y AgroTech 5.0",
    shortName: "Economía Azul & AgroTech",
    description:
      "Soluciones para océanos, acuicultura de precisión, agricultura inteligente y cadenas productivas.",
    icon: "sprout",
  },
  {
    id: "industria-aiot",
    name: "Industria 4.0, AIoT (Inteligencia Artificial de las Cosas) y Gemelos",
    shortName: "Industria 4.0 & AIoT",
    description:
      "Automatización industrial, AIoT, gemelos digitales, logística y procesos inteligentes.",
    icon: "factory",
  },
  {
    id: "iomt-salud",
    name: "IoMT (Internet of Medical Things) y Salud Predictiva",
    shortName: "IoMT & Salud Predictiva",
    description:
      "Dispositivos médicos conectados, monitoreo predictivo y soluciones de salud digital.",
    icon: "heart-pulse",
  },
  {
    id: "economia-circular",
    name: "Economía Circular, Minería Urbana e Internet de los Residuos",
    shortName: "Economía Circular",
    description:
      "Residuos conectados, minería urbana, reciclaje inteligente y economía circular con IoT.",
    icon: "leaf",
  },
] as const;

/** Instituciones / ramas del formulario oficial de inscripción */
export const INSTITUTIONS = [
  "Otra institución",
  "Otra Rama Estudiantil IEEE",
  "Rama Estudiantil IEEE EPN",
  "Rama Estudiantil IEEE ESPOCH",
  "Rama Estudiantil IEEE ESPE",
  "Rama Estudiantil IEEE ESPOL",
  "Rama Estudiantil IEEE UCACUE",
  "Rama Estudiantil IEEE UCuenca",
  "Rama Estudiantil IEEE UDLA",
  "Rama Estudiantil IEEE UDA",
  "Rama Estudiantil IEEE UIDE",
  "Rama Estudiantil IEEE ULEAM",
  "Rama Estudiantil IEEE UPS Quito",
  "Rama Estudiantil IEEE UPS Cuenca",
  "Rama Estudiantil IEEE UPS Guayaquil",
  "Rama Estudiantil IEEE USFQ",
  "Rama Estudiantil IEEE UTA",
  "Rama Estudiantil IEEE UTC",
  "Rama Estudiantil IEEE UTN",
  "Rama Estudiantil IEEE UTE",
  "Rama Estudiantil IEEE UCE",
  "Rama Estudiantil IEEE UTPL",
  "Rama Estudiantil IEEE UG",
  "Rama Estudiantil IEEE UPSE",
  "Rama Estudiantil IEEE ITO",
  "Rama Estudiantil IEEE Yachay Tech",
  "Rama Estudiantil IEEE UNACH",
  "Rama Estudiantil IEEE UTEQ",
] as const;

export const HEAR_ABOUT_OPTIONS = [
  "Sitio web",
  "Amigo",
  "Boletín informativo",
  "Anuncio",
] as const;

export const TEAM_SIZES = [2, 3, 4] as const;

export const TIMELINE = [
  {
    date: "25 mayo 2026",
    start: "2026-05-25T00:00:00-05:00",
    end: "2026-05-25T23:59:59-05:00",
    title: "Apertura de inscripciones",
    description: "Inicia el periodo de registro y desarrollo.",
    action: "El portal recibe oficialmente las primeras inscripciones.",
  },
  {
    date: "25 mayo – 11 oct",
    start: "2026-05-25T00:00:00-05:00",
    end: "2026-10-11T23:59:59-05:00",
    title: "Desarrollo del proyecto",
    description: "Construcción del prototipo e informe técnico IEEE.",
    action: "Diseña, prueba y documenta tu solución IoT. Esta es la fase de trabajo activo.",
  },
  {
    date: "11 oct 2026, 23:59",
    start: "2026-10-11T00:00:00-05:00",
    end: "2026-10-11T23:59:59-05:00",
    title: "Cierre de inscripción",
    description: "Fecha límite para enviar inscripción e informe.",
    action: "Todos los campos y archivos deben quedar enviados antes de las 23:59.",
  },
  {
    date: "12 – 25 oct 2026",
    start: "2026-10-12T00:00:00-05:00",
    end: "2026-10-25T23:59:59-05:00",
    title: "Evaluación del informe",
    description: "Rúbrica A — hasta 20 puntos.",
    action: "El comité evaluador revisa los informes técnicos y selecciona finalistas.",
  },
  {
    date: "26 oct 2026",
    start: "2026-10-26T00:00:00-05:00",
    end: "2026-10-26T23:59:59-05:00",
    title: "Publicación de finalistas",
    description: "Equipos seleccionados para la defensa presencial.",
    action: "Los resultados se comunicarán por los canales oficiales y al correo del equipo.",
  },
  {
    date: "10 nov 2026",
    start: "2026-11-10T00:00:00-05:00",
    end: "2026-11-10T23:59:59-05:00",
    title: "Llegada a Manta",
    description: "Llegada sugerida para finalistas.",
    action: "Día recomendado para llegada, instalación y preparación de la defensa.",
  },
  {
    date: "11 nov 2026",
    start: "2026-11-11T00:00:00-05:00",
    end: "2026-11-11T23:59:59-05:00",
    title: "Presentación y premiación",
    description: "Defensa presencial y ceremonia de premiación en ULEAM.",
    action: "Demostración del prototipo, evaluación final y premiación por categoría.",
  },
] as const;

export const PRIZE_PLACES = [
  {
    place: "1° lugar",
    rank: 1,
    accent: "gold",
    items: ["$300 USD", "Trofeo", "Certificado oficial", "Membresía IEEE"],
  },
  {
    place: "2° lugar",
    rank: 2,
    accent: "silver",
    items: ["$200 USD", "Certificado de excelencia", "Reconocimiento oficial", "Mención en ceremonia"],
  },
  {
    place: "3° lugar",
    rank: 3,
    accent: "bronze",
    items: ["$100 USD", "Certificado de mérito", "Reconocimiento oficial", "Mención en ceremonia"],
  },
] as const;

export const PRIZES = [
  { place: "1° lugar", perCategory: true, items: ["$300 USD", "Trofeo", "Certificado", "Membresía IEEE"] },
] as const;

export const BASES_SECTIONS = [
  {
    title: "1. Objetivo",
    items: [
      "Impulsar el desarrollo de proyectos IoT con impacto real en Ecuador.",
      "Fomentar la cultura IEEE, la investigación aplicada y el trabajo en equipo.",
      "Seleccionar prototipos funcionales con informe técnico en formato IEEE.",
    ],
  },
  {
    title: "2. Participantes",
    items: [
      "Estudiantes de pregrado de universidades e institutos técnicos de todo Ecuador.",
      "Equipos de 2 a 4 integrantes con matrícula vigente.",
      "Tutor académico obligatorio con carta de aceptación firmada.",
      "Máximo 2 equipos por institución en cada categoría.",
    ],
  },
  {
    title: "3. Categorías",
    items: [
      "Smart Cities e Infraestructura Urbana Autónoma",
      "Economía Azul, Acuicultura de Precisión y AgroTech 5.0",
      "Industria 4.0, AIoT (Inteligencia Artificial de las Cosas) y Gemelos",
      "IoMT (Internet of Medical Things) y Salud Predictiva",
      "Economía Circular, Minería Urbana e Internet de los Residuos",
    ],
  },
  {
    title: "4. Documentación obligatoria",
    items: [
      "Nombre del proyecto, categoría, institución y resumen ejecutivo (máx. 250 palabras).",
      "Datos de integrantes: nombre, cédula, correo institucional, universidad, carrera y semestre.",
      "Certificado de matrícula vigente por cada integrante.",
      "Datos del tutor y carta de aceptación firmada.",
      "Informe técnico IEEE en PDF (6 a 10 páginas).",
      "Autorización de uso de imagen.",
      "Declaración de originalidad o relación con tesis/trabajo previo.",
    ],
  },
  {
    title: "5. Inscripción y costos",
    items: [
      "Miembros IEEE vigentes: inscripción gratuita (número de membresía obligatorio).",
      "Equipos sin miembros IEEE: $15.00 USD por equipo.",
      "Pago a Banco Pichincha, cuenta ahorro 2209748595, titular Muñoz Delgado Jordy Josué.",
      "Sin comprobante de pago (cuando aplique), la inscripción no será validada.",
      "Cierre de inscripciones: 11 de octubre de 2026 a las 23:59.",
    ],
  },
  {
    title: "6. Evaluación",
    items: [
      "Rúbrica A (informe técnico): 20 puntos — 12 al 25 de octubre de 2026.",
      "Publicación de finalistas: 26 de octubre de 2026.",
      "Rúbrica B (defensa presencial): 10 puntos — 11 de noviembre de 2026.",
      "Puntaje total máximo: 30 puntos.",
    ],
  },
  {
    title: "7. Premios (por categoría)",
    items: [
      "1° lugar: $300.00 USD + trofeo + certificado oficial + membresía IEEE.",
      "2° lugar: $200.00 USD + certificado de excelencia + reconocimiento oficial + mención en ceremonia.",
      "3° lugar: $100.00 USD + certificado de mérito + reconocimiento oficial + mención en ceremonia.",
      "Los tres lugares se otorgan en cada una de las 5 categorías.",
    ],
  },
  {
    title: "8. Evento final",
    items: [
      "Llegada sugerida de finalistas: martes 10 de noviembre de 2026.",
      "Presentación, defensa y premiación: miércoles 11 de noviembre de 2026.",
      "Sede: Universidad Laica Eloy Alfaro de Manabí (ULEAM), Manta.",
    ],
  },
] as const;

export const ORGANIZING_TEAM = [
  {
    role: "Organización",
    name: "Rama Estudiantil IEEE ULEAM",
    detail: "Coordinación, convocatoria, gestión académica y ejecución del concurso.",
  },
  {
    role: "Organización",
    name: "WIE ULEAM",
    detail: "Participación, liderazgo y articulación de la comunidad tecnológica.",
  },
  {
    role: "Organización académica",
    name: "Facultad de Ciencias de la Vida y Tecnologías",
    detail: "Respaldo académico y tecnológico para el desarrollo del concurso.",
  },
  {
    role: "Universidad sede",
    name: "Universidad Laica Eloy Alfaro de Manabí",
    detail: "Institución anfitriona de la presentación y premiación en Manta.",
  },
] as const;

export const SPONSORS = [
  {
    tier: "Partner institucional",
    name: "ULEAM",
    description: "Universidad sede del I Concurso Nacional IoT.",
  },
  {
    tier: "Comunidad técnica",
    name: "IEEE ULEAM",
    description: "Rama estudiantil organizadora de la experiencia.",
  },
] as const;

export const SPONSOR_TIERS = [
  {
    id: "oro",
    name: "Nodo Oro",
    type: "Patrocinio principal",
    investment: "Inversión alta — máxima visibilidad",
    prizeAmount: "$300 USD",
    prizePlace: "1° lugar",
    prizeNote: "Adjunta el valor del premio de 1° lugar por categoría",
    color: "gold",
    benefits: [
      "Financia el premio de 1° lugar ($300 USD) en una categoría",
      "Logo destacado en web, afiche y materiales oficiales",
      "Mención prioritaria en ceremonia de premiación",
      "Stand / activación en el evento final en Manta",
      "Campaña en redes de IEEE ULEAM y WIE ULEAM",
      "Entrega del premio junto al comité (opcional)",
    ],
  },
  {
    id: "plata",
    name: "Nodo Plata",
    type: "Patrocinio estratégico",
    investment: "Inversión media — alta exposición",
    prizeAmount: "$200 USD",
    prizePlace: "2° lugar",
    prizeNote: "Adjunta el valor del premio de 2° lugar por categoría",
    color: "silver",
    benefits: [
      "Financia el premio de 2° lugar ($200 USD) en una categoría",
      "Logo en web y afiche digital",
      "Mención en redes sociales del concurso",
      "Inclusión en piezas de difusión oficial",
      "Agradecimiento en ceremonia",
    ],
  },
  {
    id: "cian",
    name: "Nodo Cian",
    type: "Patrocinio de apoyo",
    investment: "Inversión accesible — presencia digital",
    prizeAmount: "$100 USD",
    prizePlace: "3° lugar",
    prizeNote: "Adjunta el valor del premio de 3° lugar por categoría",
    color: "cyan",
    benefits: [
      "Financia el premio de 3° lugar ($100 USD) en una categoría",
      "Logo en sección de aliados de la web",
      "Agradecimiento oficial en canal digital",
      "Certificado de patrocinio",
      "Mención en boletines del concurso",
    ],
  },
] as const;

export const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"] as const;
