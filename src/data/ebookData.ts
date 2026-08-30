import { BonusResource, EbookChapter } from '../types';

export const EBOOK_CHAPTERS: EbookChapter[] = [
  {
    id: 'cap-1',
    chapterNumber: 1,
    title: 'El lenguaje antes de las palabras: La biología de la señal',
    readTime: '6 min de lectura',
    excerpt: 'Tu bebé no llora para manipularte ni para medir tu paciencia. Llora porque es su único canal de supervivencia.',
    keyTakeaways: [
      'Los bebés nacen altriciales (con solo el 25% de su cerebro desarrollado).',
      'El llanto no es la primera señal, es la última advertencia tras señales tempranas no atendidas.',
      'Aprender a leer los micromovimientos (lengua, puños, cejas) previene el 80% de los llantos desbordados.'
    ],
    fullText: [
      'Durante los primeros tres meses de vida (el llamado "cuarto trimestre"), el recién nacido se encuentra en un proceso de transición radical. Ha salido de un entorno oscuro, cálido, rítmico y constante para llegar a un mundo lleno de gravedad, luz, sonidos y temperaturas cambiantes.',
      'En el Método Vínculo entendemos que cada gesto de tu bebé es un intento biológico por recuperar la homeostasis (el equilibrio interno). Cuando un bebé llora, su cuerpo experimenta una cascada de señales neuroquímicas. Al responder con prontitud y sintonía, no solo estamos calmando un momento; estamos construyendo los circuitos neuronales de la autorregulación y la confianza básica en el mundo.',
      'El secreto radica en la observación sin prisa: en lugar de probar cinco soluciones en treinta segundos frenéticos, hacemos una pausa consciente de diez segundos para decodificar la combinación de gestos, respiración y sonido.'
    ]
  },
  {
    id: 'cap-2',
    chapterNumber: 2,
    title: 'Los 5 Sonidos Reflejos Universales',
    readTime: '9 min de lectura',
    excerpt: 'Descubre los sonidos anatómicos que todos los bebés del mundo emiten antes de que el llanto se convierta en una crisis.',
    keyTakeaways: [
      'NEH: El reflejo de succión activa la lengua contra el paladar = Hambre.',
      'OWH: La forma ovalada de los labios imita el bostezo = Sueño y fatiga.',
      'HEH: La piel reacciona a la humedad o temperatura = Incomodidad física.',
      'EAIRH: La contracción abdominal busca mover gases inferiores = Cólico o gas intestinal.',
      'EH: La burbuja sube por el esófago = Necesidad de eructar.'
    ],
    fullText: [
      'Basados en las investigaciones del lenguaje infantil y los reflejos orofaciales, descubrimos que los recién nacidos producen sonidos muy específicos determinados por la mecánica de su anatomía antes de que el llanto se desorganice.',
      '1. Sonido NEH (Hambre): Presta atención al inicio del quejido. Si escuchas una "N" clara provocada por la lengua subiendo al paladar duro, tu bebé te está indicando que su reflejo de succión se ha activado. Si lo alimentas aquí, comerá con tranquilidad y sin tragar aire.',
      '2. Sonido OWH (Sueño): Es un sonido más gutural y profundo. Si se combina con párpados pesados o cejas sonrosadas, la ventana de sueño está en su punto perfecto.',
      '3. Sonido HEH (Incomodidad): Es un sonido jadeante y superficial. Indica que la piel siente frío, exceso de calor, roce de una costura o pañal húmedo.',
      '4. Sonido EAIRH (Gases inferiores): Proviene de la tensión en el abdomen. Las piernas se recogen hacia el vientre.',
      '5. Sonido EH (Eructo): Sonido corto y repetido que busca liberar la burbuja atrapada en el esófago.'
    ]
  },
  {
    id: 'cap-3',
    chapterNumber: 3,
    title: 'El Mapa del Sueño Infantil: Ventanas de Vigilia y Presión de Sueño',
    readTime: '8 min de lectura',
    excerpt: 'El gran mito de "si lo canso más, dormirá mejor". Por qué el sobrecansancio es el enemigo número uno de las noches en calma.',
    keyTakeaways: [
      'El sobrecansancio activa adrenalina y cortisol, haciendo que dormir sea casi imposible.',
      'Respetar las ventanas de vigilia acordes a su edad biológica garantiza conciliaciones en menos de 15 minutos.',
      'El sueño de día protege el sueño de la noche: las siestas de calidad previenen despertares nocturnos continuos.'
    ],
    fullText: [
      'Uno de los errores más agotadores para las madres recientes es creer que mantener al bebé despierto durante horas garantizará que duerma toda la noche de un tirón. Biológicamente, ocurre exactamente lo contrario.',
      'Cuando un bebé supera su ventana de vigilia óptima, su organismo interpreta que se encuentra en una situación de alerta o peligro y segrega hormonas de estrés (adrenalina y cortisol). El resultado es el temido "bebé sobrecansado": llora con furia, rechaza el pecho, arquea la espalda y se resiste al sueño a pesar de estar exhausto.',
      'En este capítulo aprenderás a detectar las señales tempranas de sueño (las "señales verdes") para acostarlo en la zona dorada de relajación.'
    ]
  },
  {
    id: 'cap-4',
    chapterNumber: 4,
    title: 'Corregulación y Apego Seguro en la Matrescencia',
    readTime: '7 min de lectura',
    excerpt: 'El concepto transformador de la Matrescencia: cómo cambia tu propia biología y por qué tus brazos son el hogar de su sistema nervioso.',
    keyTakeaways: [
      'La matrescencia es la transición neurobiológica y emocional más intensa de la mujer.',
      'Los bebés no pueden autorregularse solos: se calman "en préstamo" a través de tu ritmo cardíaco y respiración.',
      'El mito de "no lo cargues que se acostumbra" carece de cualquier fundamento científico contemporáneo.'
    ],
    fullText: [
      'La matrescencia es el nacimiento de la madre. Al igual que la adolescencia, implica una reconfiguración cerebral completa guiada por un baño de oxitocina, prolactina y estrógenos.',
      'Cuando sostienes a tu bebé en contacto piel con piel, ocurre un fenómeno fascinante llamado sincronía biopsicosocial: la frecuencia cardíaca de ambos se estabiliza, la temperatura de tu pecho se ajusta térmicamente a las necesidades de tu cría y ambos niveles de cortisol descienden.',
      'Aceptar que eres su ancla y que pedir brazos es una necesidad biológica tan legítima como comer o dormir libera a la madre de la culpa y la presión social.'
    ]
  },
  {
    id: 'cap-5',
    chapterNumber: 5,
    title: 'Protocolo de Rescate para Noches Difíciles (Paso a Paso)',
    readTime: '6 min de lectura',
    excerpt: 'Tu plan de emergencia cuando son las 3:00 AM, nada parece funcionar y sientes que estás al límite de tu energía.',
    keyTakeaways: [
      'Paso 1: Respira hondo 3 veces antes de tocar al bebé (tu tensión se transmite al instante).',
      'Paso 2: Reset sensorial (habitación en penumbra, ruido blanco a volumen de ducha suave).',
      'Paso 3: Postura del perezoso / Porteo ergonómico.',
      'Paso 4: Validación verbal en susurro: "Estás seguro, mamá está contigo".'
    ],
    fullText: [
      'Las noches difíciles no significan que estés fallando como madre. Son parte del proceso de maduración neurológica de tu bebé.',
      'Cuando te encuentres en un episodio de llanto inconsolable a altas horas de la madrugada, ejecuta el Protocolo de Rescate del Método Vínculo:',
      '1. Si sientes que la desesperación te desborda, coloca a tu bebé en un lugar seguro (su cuna), aléjate dos pasos y respira profundamente contando hasta diez. Cuidar de tu propia regulación es el primer paso para poder regular a tu bebé.',
      '2. Vuelve con un abrazo firme y envolvente. Usa el sonido continuo "Shhh-shhh" imitando el flujo sanguíneo uterino que tu bebé escuchó durante 9 meses.',
      '3. Camina con balanceo rítmico suave (ritmo de caminata acompasada). Este estímulo vestibular le recuerda el movimiento en el vientre materno y activa el sistema parasimpático de calma.'
    ]
  }
];

export const BONUSES_DATA: BonusResource[] = [
  {
    id: 'bono-lactancia',
    number: 1,
    emoji: '🤱',
    title: 'Guía Completa de Lactancia Materna y Alimentación',
    subtitle: 'De las dudas del agarre a tomas en paz',
    description: 'Resuelve las dudas más comunes sobre lactancia en los primeros meses: agarre sin dolor, aumento de producción, crisis de lactancia y señales de saciedad.',
    bgClass: 'bg-[#d97c5f]/15 border-[#d97c5f]/30',
    highlights: [
      'Técnica del agarre asimétrico profundo para evitar grietas y dolor',
      'Cómo identificar las crisis o brotes de crecimiento (semana 3, semana 6, mes 3)',
      'Señales claras de que tu bebé está transfiriendo leche suficiente (pañales y deglución)',
      'Posturas biológicas recomendadas (Biological Nurturing / Crianza al pecho)',
      'Manejo respetuoso del biberón con método Kassing si ofreces leche diferida o fórmula'
    ]
  },
  {
    id: 'bono-vuelta-cuerpo',
    number: 2,
    emoji: '🌿',
    title: 'Guía Vuelta al Cuerpo & Autocuidado Postparto',
    subtitle: 'Recupera tu energía y vitalidad a tu propio ritmo',
    description: 'Autocuidado postparto real y sin exigencias irreales: recupera tu cuerpo, cuida tu suelo pélvico y nutre tu energía con calma.',
    bgClass: 'bg-[#dfa745]/20 border-[#dfa745]/35',
    highlights: [
      'Respiración diafragmática y reconexión suave con el suelo pélvico',
      'Nutrición densa y reconfortante para la recuperación hormonal postparto',
      'Gestión del sueño fragmentado y micropausas de recarga para mamás',
      'Validación emocional de la matrescencia y prevención del agotamiento materno (burnout)',
      'Límites amorosos con las visitas y el entorno familiar en el posparto temprano'
    ]
  },
  {
    id: 'bono-bitacora',
    number: 3,
    emoji: '📝',
    title: 'Bitácora Imprimible & Registro de Patrones',
    subtitle: 'Descubre los ritmos únicos de tu bebé semana a semana',
    description: 'Plantilla descargable y digital para registrar tomas, siestas, llantos y soluciones efectivas para descubrir la rutina natural de tu bebé.',
    bgClass: 'bg-[#c2d6bb]/40 border-[#c2d6bb]/60',
    highlights: [
      'Cuadrícula semanal de seguimiento de siestas y ventanas de vigilia',
      'Registro rápido de sonidos observados (Neh, Owh, Heh, Eairh, Eh)',
      'Control de tomas y pañales para seguimiento pediátrico',
      'Sección de notas de gratitud y logros de la mamá para mantener la motivación',
      'Formato listo para imprimir en PDF A4/Carta o usar interactivamente en la app'
    ]
  }
];
