import { SignalItem, WakeWindowGuide } from '../types';

export const SIGNALS_DATABASE: SignalItem[] = [
  {
    id: 'neh-hambre',
    name: 'Sonido "Neh" / Búsqueda activa',
    soundName: 'Sonido "Neh" (Reflejo de succión)',
    category: 'hambre',
    description: 'El sonido "N" se produce cuando la lengua del bebé sube al paladar por el reflejo de succión.',
    soundCue: 'Sonido "Neh-neh" rítmico, que va subiendo en intensidad si no se atiende pronto.',
    physicalCues: [
      'Lleva sus manitos a la boca o las chupa',
      'Reflejo de búsqueda (gira la cabeza buscando el pecho al rozar su mejilla)',
      'Abre la boca y saca la lengua repetidamente',
      'Manos con puños cerrados apretados (señal de tensión por hambre)'
    ],
    meaning: 'Hambre temprana o media. Es el momento ideal para alimentarlo antes del llanto desesperado.',
    confidence: 95,
    urgency: 'alta',
    actionSteps: [
      'Ofrece el pecho o biberón de inmediato con calma.',
      'Si ya está llorando intensamente, abrázalo contra tu pecho piel con piel durante 1-2 minutos para regularlo antes de acoplarlo.',
      'Observa cómo sus puñitos se van abriendo a medida que se sacia.'
    ],
    vinculoTip: 'Alimentar a demanda ante las primeras señales previene la deglución de aire y el agotamiento del bebé.',
    recommendedAgeMonths: '0 a 6 meses'
  },
  {
    id: 'owh-sueno',
    name: 'Sonido "Owh" / Mirada perdida',
    soundName: 'Sonido "Owh" (Reflejo de bostezo)',
    category: 'sueno',
    description: 'Se forma por la apertura de la boca similar a un bostezo con la forma ovalada de los labios.',
    soundCue: 'Sonido "Ooo-wh" gutural y suave, arrastrado, a veces entrecortado.',
    physicalCues: [
      'Bostezos repetidos y cejas ligeramente enrojecidas',
      'Mirada fija en un punto o evita el contacto visual',
      'Se frota los ojos, las mejillas o las orejas con torpeza',
      'Movimientos corporales más lentos y pesados'
    ],
    meaning: 'Ventana de sueño abierta. El bebé está listo para dormir antes de que se libere cortisol por sobrecansancio.',
    confidence: 92,
    urgency: 'media',
    actionSteps: [
      'Baja las luces de la habitación y reduce estímulos sonoros.',
      'Inicia tu ritual breve de calma (arrullo, ruido blanco suave, porteo o balanceo rítmico).',
      'Acuéstalo somnoliento pero no completamente dormido si deseas fomentar la autonomía, o acompaña con brazos y pecho sin culpa.'
    ],
    vinculoTip: 'En el Método Vínculo, los brazos y el contacto nunca "malacostumbran"; son el puente regulador indispensable.',
    recommendedAgeMonths: '0 a 12 meses'
  },
  {
    id: 'heh-incomodidad',
    name: 'Sonido "Heh" / Pañal o temperatura',
    soundName: 'Sonido "Heh" (Respuesta dérmica/sensorial)',
    category: 'cuerpo',
    description: 'Producido por una exhalación corta cuando la piel del bebé siente humedad, frío, calor o fricción.',
    soundCue: 'Sonido jadeante "Heh-heh", parecido a una respiración forzada con quejido.',
    physicalCues: [
      'Inquietud corporal sin llanto agudo continuo',
      'Mueve las piernas como si quisiera quitarse algo',
      'Nuca sudorosa (calor) o manos/pies fríos y moteados con pecho fresco (frío)',
      'Pañal pesado o ropa con etiquetas/costuras irritantes'
    ],
    meaning: 'Incomodidad física ambiental: pañal sucio, exceso o falta de ropa, o postura incómoda.',
    confidence: 88,
    urgency: 'media',
    actionSteps: [
      'Toca la nuca y el pechito del bebé para verificar su temperatura real (las manos y pies suelen estar fríos por inmadurez circulatoria).',
      'Revisa el pañal y límpialo suavemente.',
      'Revisa que la ropa no le apriete los deditos ni tenga hilos o pliegues tensos.'
    ],
    vinculoTip: 'Verificar primero lo físico despeja dudas rápidamente y le transmite seguridad.',
    recommendedAgeMonths: '0 a 12 meses'
  },
  {
    id: 'eairh-gases',
    name: 'Sonido "Eairh" / Piernas al pecho',
    soundName: 'Sonido "Eairh / Eerh" (Presión intestinal)',
    category: 'estres',
    description: 'Sonido grave y apretado originado en el bajo abdomen al intentar mover gases o evacuar.',
    soundCue: 'Quejido profundo "Eee-airgh" o "Ergghh" con tensión en la garganta.',
    physicalCues: [
      'Flexiona las piernas hacia el abdomen con fuerza',
      'Cara roja por el esfuerzo de pujar',
      'Abdomen duro o distendido al tacto suave',
      'Llanto intermitente que viene en olas espasmódicas'
    ],
    meaning: 'Gases en el intestino bajo o reflejo gastrocólico en proceso de maduración.',
    confidence: 90,
    urgency: 'alta',
    actionSteps: [
      'Coloca al bebé en posición de rana sobre tu antebrazo (postura del perezoso) o realiza porteo ergonómico.',
      'Haz ejercicios suaves de "bicicleta" con sus piernitas y círculos en sentido de las agujas del reloj en su tripita.',
      'Aplica calor piel con piel con tu propio pecho o abdomen.'
    ],
    vinculoTip: 'La inmadurez digestiva es temporal; la contención física reduce el dolor al relajar el esfínter anal.',
    recommendedAgeMonths: '0 a 4 meses'
  },
  {
    id: 'eh-eructo',
    name: 'Sonido "Eh" / Gas atrapado en esófago',
    soundName: 'Sonido "Eh" (Presión en el pecho/burbuja)',
    category: 'cuerpo',
    description: 'Producido cuando una burbuja de aire intenta subir desde el estómago y empuja la glotis.',
    soundCue: 'Sonido seco y repetitivo "Eh-eh-eh" durante o poco después de la toma.',
    physicalCues: [
      'Se aparta del pecho o biberón repentinamente llorando',
      'Cuerpo tenso y cuello estirado hacia atrás',
      'Gesticula con disgusto a mitad de su alimentación',
      'Se muestra molesto al estar acostado horizontalmente'
    ],
    meaning: 'Aire atrapado en el estómago tras la toma. Necesita expulsar un eructo.',
    confidence: 94,
    urgency: 'media',
    actionSteps: [
      'Levanta al bebé en posición vertical apoyando su barbilla en tu hombro.',
      'Da palmaditas suaves y firmes de abajo hacia arriba en su espalda media.',
      'Prueba inclinarlo suavemente hacia adelante sentado en tus piernas sosteniendo su mandíbula con tu mano en forma de C.'
    ],
    vinculoTip: 'Hacer una pausa para eructar a mitad de la toma evita que el aire acumulado desborde su estómago.',
    recommendedAgeMonths: '0 a 6 meses'
  },
  {
    id: 'sobreestimulacion',
    name: 'Llanto agudo / Sobreestimulación',
    soundName: 'Llanto de sobrecarga sensorial',
    category: 'estres',
    description: 'Ocurre cuando el sistema nervioso del bebé ha recibido demasiados estímulos (visitas, ruidos, luces, pantallas).',
    soundCue: 'Llanto continuo, chillón y desorganizado que no cede de inmediato con las técnicas habituales.',
    physicalCues: [
      'Gira la cabeza hacia el lado contrario de las personas y estímulos',
      'Arquea la espalda y empuja con las manos',
      'Ojos muy abiertos y pupilas dilatadas antes del colapso',
      'Sobresaltos frecuentes (reflejo de Moro exagerado)'
    ],
    meaning: 'Sobrecarga sensorial. El cerebro del bebé necesita silencio, oscuridad y contención firme para resetearse.',
    confidence: 89,
    urgency: 'alta',
    actionSteps: [
      'Muévanse a una habitación oscura, en silencio o con ruido blanco constante.',
      'Sujétalo en brazos bien pegado a ti o usa un fular/porteo para envolver su cuerpo.',
      'Evita hablarle en voz alta o balancearlo bruscamente; utiliza movimientos lentos y un "shhh" rítmico acompasado con tu respiración.'
    ],
    vinculoTip: 'Tu propia calma es contagiosa para el bebé (corregulación fisiológica a través del ritmo cardíaco).',
    recommendedAgeMonths: '0 a 12 meses'
  },
  {
    id: 'necesidad-contacto',
    name: 'Llamado de Apego / "Brazos"',
    soundName: 'Llanto de contacto y presencia',
    category: 'llanto',
    description: 'El llanto biológico de supervivencia que asegura la proximidad de su figura de apego.',
    soundCue: 'Quejido discontinuo que cesa casi instantáneamente al ser levantado en brazos.',
    physicalCues: [
      'Extiende los bracitos hacia arriba',
      'Busca con la mirada la figura de cuidado',
      'Se calma en cuanto escucha tu voz o siente el olor de tu piel',
      'Respira hondo y relaja hombros y piernas al ser alzado'
    ],
    meaning: 'Necesidad afectiva real de contacto y corregulación. No es un capricho ni manipulación.',
    confidence: 96,
    urgency: 'baja',
    actionSteps: [
      'Tómalo en brazos sin dudar. El contacto piel con piel libera oxitocina en ambos.',
      'Háblale con tono cálido y pausado: "Aquí estoy, estás seguro/a".',
      'Si necesitas tener las manos libres, usa un portabebé ergonómico.'
    ],
    vinculoTip: 'Los bebés humanos son seres altriciales (nacen inmaduros). Los brazos son su hábitat natural los primeros meses.',
    recommendedAgeMonths: '0 a 12 meses'
  }
];

export const WAKE_WINDOWS_DATA: WakeWindowGuide[] = [
  {
    ageRange: 'Recién nacido (0 - 4 semanas)',
    minAgeWeeks: 0,
    maxAgeWeeks: 4,
    wakeWindowMinutes: '35 - 60 minutos',
    napsPerDay: '4 - 6 siestas (sin horario fijo)',
    earlySleepCues: ['Mirada fija / perdida', 'Cejas rojas', 'Bostezo sutil', 'Disminución de movimientos'],
    lateSleepCues: ['Llanto descontrolado', 'Arqueo de espalda', 'Puños cerrados temblorosos'],
    expertAdvice: 'A esta edad su capacidad de estar despierto es mínima. Tras cambiar el pañal y comer, prácticamente vuelve a dormir.'
  },
  {
    ageRange: '1 a 2 meses (4 - 8 semanas)',
    minAgeWeeks: 4,
    maxAgeWeeks: 8,
    wakeWindowMinutes: '60 - 90 minutos',
    napsPerDay: '4 - 5 siestas',
    earlySleepCues: ['Gira la cabeza evitando contacto', 'Bostezos', 'Frotarse la cara con manos'],
    lateSleepCues: ['Irritabilidad súbita', 'Llanto que rechaza el pezón inicialmente', 'Hiperactividad motora'],
    expertAdvice: 'Empieza a haber mayor interacción visual. Presta atención al minuto 60 para no cruzar la línea del sobrecansancio.'
  },
  {
    ageRange: '3 a 4 meses (8 - 16 semanas)',
    minAgeWeeks: 8,
    maxAgeWeeks: 16,
    wakeWindowMinutes: '75 - 120 minutos',
    napsPerDay: '3 - 4 siestas',
    earlySleepCues: ['Pérdida de interés en juguetes/caras', 'Cejas y párpados sonrosados', 'Quejido suave'],
    lateSleepCues: ['Gritos agudos', 'Resistencia férrea a conciliar el sueño', 'Rigidez muscular'],
    expertAdvice: 'Ocurre la maduración de los ritmos circadianos y la regresión de los 4 meses. Establecer rutinas predecibles de siesta ayuda enormemente.'
  },
  {
    ageRange: '5 a 6 meses (20 - 26 semanas)',
    minAgeWeeks: 20,
    maxAgeWeeks: 26,
    wakeWindowMinutes: '2 a 2.5 horas',
    napsPerDay: '3 siestas',
    earlySleepCues: ['Bostezos claros', 'Ojos vidriosos', 'Tirarse de las orejitas', 'Menor sonrisa'],
    lateSleepCues: ['Frotado violento de ojos', 'Llanto inconsolable', 'Frustración extrema'],
    expertAdvice: 'Las siestas se vuelven más consolidadas. La última ventana antes de la noche suele ser la más larga.'
  },
  {
    ageRange: '7 a 9 meses (28 - 38 semanas)',
    minAgeWeeks: 28,
    maxAgeWeeks: 38,
    wakeWindowMinutes: '2.5 a 3.5 horas',
    napsPerDay: '2 - 3 siestas (transición a 2)',
    earlySleepCues: ['Torpeza motora en el suelo', 'Busca acurrucarse en ti', 'Bostezos'],
    lateSleepCues: ['Llantos por cualquier frustración mínima', 'Ojos muy abiertos con irritabilidad'],
    expertAdvice: 'Suelen consolidar dos siestas principales (mañana y tarde). El gateo y nuevos hitos motores aumentan su gasto de energía.'
  },
  {
    ageRange: '10 a 12 meses (40 - 52 semanas)',
    minAgeWeeks: 40,
    maxAgeWeeks: 52,
    wakeWindowMinutes: '3 a 4 horas',
    napsPerDay: '2 siestas',
    earlySleepCues: ['Pide brazos insistentemente', 'Se acuesta en el suelo o almohadas', 'Bostezo'],
    lateSleepCues: ['Hiperactividad nerviosa', 'Resistencia a la cuna/cama', 'Rabieta por cansancio'],
    expertAdvice: 'Mantén una ventana constante antes de la noche para asegurar que llegue con la presión de sueño adecuada sin estar sobrecansado.'
  }
];

export const METHOD_PILLARS = [
  {
    step: '1',
    title: 'Pausa y Observación',
    subtitle: 'El freno de 10 segundos',
    color: 'terracotta',
    description: 'Antes de reaccionar apresuradamente con 5 cosas a la vez, detente a mirar y escuchar la combinación de sonido y gesto corporal.',
    benefit: 'Evita la sobreestimulación de probar chupe, teta, biberón y paseo en 30 segundos caóticos.'
  },
  {
    step: '2',
    title: 'Decodificación de Señales',
    subtitle: 'Traducción anatómica y acústica',
    color: 'mustard',
    description: 'Aplica los 5 sonidos biológicos universales (Neh, Owh, Heh, Eairh, Eh) y el mapa de ventanas de sueño.',
    benefit: 'Saber exactamente qué necesita disuelve el 90% de la angustia materna de "no sé qué le pasa".'
  },
  {
    step: '3',
    title: 'Respuesta Ajustada',
    subtitle: 'Intervención precisa y calmada',
    color: 'pale-sage',
    description: 'Atiende la necesidad primaria detectada sin saltar etapas: alimentación si es hambre, postura si es gas, oscuridad si es sueño.',
    benefit: 'El bebé aprende que su comunicación es eficaz y correspondida, construyendo apego seguro.'
  },
  {
    step: '4',
    title: 'Corregulación Afectiva',
    subtitle: 'Tu calma es su medicina',
    color: 'warm-brown',
    description: 'El sistema nervioso del bebé no puede autorregularse solo; sincroniza sus latidos y respiración a través de tu pecho y contención.',
    benefit: 'Cero sentimientos de culpa: el contacto nunca malcría, es biología pura.'
  }
];
