import {
  AlumnoRow,
  MisionYuyAI,
  NivelAulaRow,
  RetoGrado,
  TemaCurricularRow,
} from "./types";

export const FRASES_CARGA_PEDAGOGICAS = [
  "Tejiendo la historia junto a los sabios de la comunidad...",
  "Armonizando los retos interactivos para cada nivel del aula...",
  "Pintando los paisajes de nuestra tierra con luz del amanecer...",
  "Preparando las semillas y quipus para la aventura de hoy...",
  "Afinando las pistas de voz para acompañar a cada niño...",
];

export const MENSAJES_CARGA_HUMANOS = FRASES_CARGA_PEDAGOGICAS;

export function generarOpcionesParaRespuesta(respuestaCorrecta: string): string[] {
  const num = Number(respuestaCorrecta);
  if (Number.isNaN(num)) {
    return [respuestaCorrecta, "12", "24", "36"];
  }
  const delta1 = Math.max(2, Math.round(num * 0.15));
  const delta2 = Math.max(4, Math.round(num * 0.28));
  const delta3 = Math.max(3, Math.round(num * 0.2));
  const candidatas = Array.from(
    new Set([
      String(num),
      String(Math.max(1, num - delta1)),
      String(num + delta3),
      String(num + delta2),
    ])
  );
  while (candidatas.length < 4) {
    candidatas.push(String(num + candidatas.length * 5));
  }
  // Orden determinístico ascendente para que los niños comparen cantidades
  return candidatas.slice(0, 4).sort((a, b) => Number(a) - Number(b));
}

export const NIVELES_INICIALES: NivelAulaRow[] = [
  {
    id: "niv-1",
    codigo: "nivel_1",
    nombre: "Nivel 1 · Ciclo III (Semillas)",
    descripcion:
      "1.° y 2.° grado: Conteo concreto, agrupación en decenas y sumas sencillas",
    color_hex: "#238564",
    orden: 1,
    activo: true,
  },
  {
    id: "niv-2",
    codigo: "nivel_2",
    nombre: "Nivel 2 · Ciclo IV (Tejedores)",
    descripcion:
      "3.° y 4.° grado: Multiplicación, reparto equitativo y medición de parcelas",
    color_hex: "#2B6CB0",
    orden: 2,
    activo: true,
  },
  {
    id: "niv-3",
    codigo: "nivel_3",
    nombre: "Nivel 3 · Ciclo V (Amautas)",
    descripcion:
      "5.° y 6.° grado: Fracciones, proporciones, promedios y gestión comunal",
    color_hex: "#D4653B",
    orden: 3,
    activo: true,
  },
];

export const TEMAS_INICIALES: TemaCurricularRow[] = [
  {
    id: "tem-1",
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
    area_curricular: "Matemática",
    titulo_tema: "Agrupación por decenas y unidades en la cosecha",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Expresa con material concreto y decenas la suma y resta de hasta dos cifras.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-2",
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
    area_curricular: "Matemática",
    titulo_tema: "Comparación de longitudes con pasos y cuerdas",
    competencia_minedu: "Resuelve problemas de forma, movimiento y localización",
    desempeno_esperado:
      "Mide objetos del aula y la chacra usando medidas arbitrarias.",
    estado: "pendiente",
    orden: 2,
  },
  {
    id: "tem-3",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
    area_curricular: "Matemática",
    titulo_tema: "Multiplicación por filas y reparto equitativo en chacras",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Emplea estrategias de cálculo mental con multiplicaciones y divisiones exactas.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-4",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
    area_curricular: "Ciencia y Tecnología",
    titulo_tema: "El ciclo del agua y los canales de riego en andenes",
    competencia_minedu:
      "Explica el mundo físico basándose en conocimientos sobre los seres vivos",
    desempeno_esperado:
      "Describe cómo el agua de los nevados recorre las cuencas hidrográficas.",
    estado: "pendiente",
    orden: 2,
  },
  {
    id: "tem-5",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
    area_curricular: "Matemática",
    titulo_tema: "Fracciones equivalentes y reparto de tierras comunales",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Resuelve problemas de reparto usando fracciones y proporciones.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-6",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
    area_curricular: "Personal Social",
    titulo_tema: "Gestión de cuencas y prevención de heladas",
    competencia_minedu: "Gestiona responsablemente el espacio y el ambiente",
    desempeno_esperado:
      "Propone acciones comunitarias frente a fenómenos climáticos en los Andes.",
    estado: "pendiente",
    orden: 2,
  },
];

export const MISION_PUENTE_INCA: MisionYuyAI = {
  id: "default-qeswachaka",
  titulo_mision: "El Rescate del Puente Q'eswachaka",
  prompt_sdxl_base:
    "Warm children storybook illustration of an ancient Incan rope bridge over a turquoise Andean river canyon at sunrise, golden sunlight, green agricultural terraces, children in colorful ponchos",
  fases: [
    {
      numero_fase: 1,
      titulo_fase: "Trenzado de las Sogas Maestras",
      prompt_sdxl:
        "Warm children storybook illustration of Andean villagers and school children weaving golden ichu grass ropes by a mountain river canyon at sunrise, vibrant colors, Ghibli style",
      narrativa_fase:
        "El puente colgante que une a nuestras comunidades necesita nuevas sogas trenzadas tras la lluvia. ¡Si los 3 niveles resolvemos nuestros cálculos, tensaremos la base del puente!",
      retos_grados: [
        {
          grado: 1,
          nivel_codigo: "nivel_1",
          nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
          tema_curricular: "Agrupación por decenas y unidades en la cosecha",
          area_curricular: "Matemática",
          instruccion:
            "Huinchiri trajo 15 cuerdas largas de ichu y Chaupibanda trajo 12 cuerdas cortas. ¿Cuántas cuerdas reunimos en total?",
          tipo_mecanica: "input_numerico",
          opciones: ["22", "25", "27", "31"],
          respuesta_correcta: "27",
          feedback_error:
            "Casi lo logras. Junta primero las dos decenas (10 + 10 = 20) y luego súmale las 5 y las 2 cuerdas sueltas.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
          tema_curricular:
            "Multiplicación por filas y reparto equitativo en chacras",
          area_curricular: "Matemática",
          instruccion:
            "Para asegurar la base necesitamos 4 nudos firmes en cada una de las 8 vigas de piedra. ¿Cuántos nudos debemos atar en total?",
          tipo_mecanica: "input_numerico",
          opciones: ["24", "28", "32", "36"],
          respuesta_correcta: "32",
          feedback_error:
            "Recuerda la tabla del cuatro: cuatro veces ocho es apenas dos pasitos más después del treinta.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
          tema_curricular:
            "Fracciones equivalentes y reparto de tierras comunales",
          area_curricular: "Matemática",
          instruccion:
            "El puente mide 60 metros de largo y ya hemos tejido las dos terceras partes (2/3). ¿Cuántos metros ya están tejidos?",
          tipo_mecanica: "input_numerico",
          opciones: ["20", "30", "40", "45"],
          respuesta_correcta: "40",
          feedback_error:
            "Divide primero los 60 metros en 3 partes iguales para hallar un tercio (20 m), y luego toma 2 de esas partes.",
        },
      ],
    },
    {
      numero_fase: 2,
      titulo_fase: "El Paso de las Llamas y la Cosecha",
      prompt_sdxl:
        "Warm children storybook illustration of friendly llamas carrying colorful woven baskets of potatoes and corn across an Incan rope bridge over a bright river canyon",
      narrativa_fase:
        "¡Los cables principales ya cruzan el cañón! Ahora debemos organizar las canastas de alimentos que pasarán hacia la feria escolar comunal.",
      retos_grados: [
        {
          grado: 1,
          nivel_codigo: "nivel_1",
          nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
          tema_curricular: "Agrupación por decenas y unidades en la cosecha",
          area_curricular: "Matemática",
          instruccion:
            "En la orilla había 38 sacos de papa nativa y ya cruzaron 14 sacos. ¿Cuántos sacos faltan cruzar?",
          tipo_mecanica: "input_numerico",
          opciones: ["20", "22", "24", "28"],
          respuesta_correcta: "24",
          feedback_error:
            "Resta primero las decenas: a 30 quítale 10 y te quedan 20; luego a las 8 papas sueltas quítales 4.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
          tema_curricular:
            "Multiplicación por filas y reparto equitativo en chacras",
          area_curricular: "Matemática",
          instruccion:
            "Si 6 llamas cargan 7 canastas de quinua cada una para la escuela, ¿cuántas canastas cruzarán el puente?",
          tipo_mecanica: "input_numerico",
          opciones: ["36", "40", "42", "48"],
          respuesta_correcta: "42",
          feedback_error:
            "Piensa en seis grupos de siete: si 6 por 6 es 36, súmale 6 canastas más.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
          tema_curricular:
            "Fracciones equivalentes y reparto de tierras comunales",
          area_curricular: "Matemática",
          instruccion:
            "Reunimos 120 kilos de maíz morado y destinamos la cuarta parte (1/4) para la olla escolar. ¿Cuántos kilos quedan para el trueque?",
          tipo_mecanica: "input_numerico",
          opciones: ["60", "80", "90", "100"],
          respuesta_correcta: "90",
          feedback_error:
            "La cuarta parte de 120 es 30 kilos. Si separamos esos 30 kilos de los 120, ¿cuántos kilos nos quedan?",
        },
      ],
    },
    {
      numero_fase: 3,
      titulo_fase: "Fiesta de Banderines en la Cumbre",
      prompt_sdxl:
        "Warm children storybook illustration of a completed Incan rope bridge decorated with festive colorful Andean flags and flowers, children celebrating under a rainbow",
      narrativa_fase:
        "Para terminar el barandal protector del puente, coloquemos los tejidos con símbolos de nuestra tierra para que todas las niñas y niños crucen seguros.",
      retos_grados: [
        {
          grado: 1,
          nivel_codigo: "nivel_1",
          nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
          tema_curricular: "Comparación de longitudes con pasos y cuerdas",
          area_curricular: "Matemática",
          instruccion:
            "Colocamos 19 banderines rojos a la izquierda y 16 banderines dorados a la derecha. ¿Cuántos banderines adornan el puente?",
          tipo_mecanica: "input_numerico",
          opciones: ["31", "33", "35", "39"],
          respuesta_correcta: "35",
          feedback_error:
            "Si al 19 le prestas 1 del 16 formas 20, y al sumarle los 15 que quedan llegas a la respuesta.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
          tema_curricular: "Perímetro y simetría en tejidos y andenes",
          area_curricular: "Matemática",
          instruccion:
            "Tenemos 45 metros de soga fina para repartir en partes iguales entre 5 tramos del barandal. ¿Cuántos metros mide cada tramo?",
          tipo_mecanica: "input_numerico",
          opciones: ["7", "8", "9", "11"],
          respuesta_correcta: "9",
          feedback_error:
            "Recuerda la tabla del cinco: busca qué número multiplicado por 5 nos da 45.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
          tema_curricular:
            "Registro estadístico de producción agrícola en tablas",
          area_curricular: "Matemática",
          instruccion:
            "Tres comunidades tejieron 24, 30 y 36 metros de barandal respectivamente. ¿Cuál fue el promedio de metros tejidos por comunidad?",
          tipo_mecanica: "input_numerico",
          opciones: ["26", "28", "30", "34"],
          respuesta_correcta: "30",
          feedback_error:
            "Suma los tres tramos para obtener el total de 90 metros y divídelo entre las 3 comunidades participantes.",
        },
      ],
    },
  ],
  narrativa_victoria:
    "¡El puente Q'eswachaka está firme y renovado! Gracias al aporte de cada nivel del aula, todas las comunidades pueden cruzar con alegría.",
  prompt_sdxl_victoria:
    "Warm storybook illustration of a repaired Incan rope bridge over an Andean river, sunny sky, happy Andean school children celebrating among green terraces",
  imagen_base_url: "/fallbacks/andes-bg.svg",
  imagen_victoria_url: "/fallbacks/andes-victory.svg",
};

export const MISION_INICIAL_DEMO = MISION_PUENTE_INCA;

export const ALUMNOS_DEMO: AlumnoRow[] = [
  {
    id: "alum-1",
    nombre_completo: "Illari Quispe Mamani",
    grado_actual: 2,
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
    competencias: {
      logica_matematica: 86,
      comprension_lectora: 82,
      resolucion_problemas: 78,
      trabajo_colaborativo: 92,
      expresion_oral: 84,
      pensamiento_creativo: 90,
    },
  },
  {
    id: "alum-2",
    nombre_completo: "Amaru Condori Huamán",
    grado_actual: 2,
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
    competencias: {
      logica_matematica: 79,
      comprension_lectora: 74,
      resolucion_problemas: 81,
      trabajo_colaborativo: 88,
      expresion_oral: 76,
      pensamiento_creativo: 85,
    },
  },
  {
    id: "alum-3",
    nombre_completo: "Sami Cjuno Apaza",
    grado_actual: 3,
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
    competencias: {
      logica_matematica: 88,
      comprension_lectora: 86,
      resolucion_problemas: 84,
      trabajo_colaborativo: 91,
      expresion_oral: 89,
      pensamiento_creativo: 87,
    },
  },
  {
    id: "alum-4",
    nombre_completo: "Kusi Yupanqui Flores",
    grado_actual: 4,
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
    competencias: {
      logica_matematica: 91,
      comprension_lectora: 85,
      resolucion_problemas: 88,
      trabajo_colaborativo: 94,
      expresion_oral: 86,
      pensamiento_creativo: 92,
    },
  },
  {
    id: "alum-5",
    nombre_completo: "Qori Huamán Quispe",
    grado_actual: 5,
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
    competencias: {
      logica_matematica: 92,
      comprension_lectora: 89,
      resolucion_problemas: 90,
      trabajo_colaborativo: 95,
      expresion_oral: 88,
      pensamiento_creativo: 93,
    },
  },
  {
    id: "alum-6",
    nombre_completo: "Inti Mamani Condori",
    grado_actual: 6,
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
    competencias: {
      logica_matematica: 89,
      comprension_lectora: 86,
      resolucion_problemas: 91,
      trabajo_colaborativo: 92,
      expresion_oral: 87,
      pensamiento_creativo: 90,
    },
  },
];

export interface SeleccionNivelTema {
  nivel_codigo: string;
  nivel_nombre: string;
  tema_titulo: string;
  area_curricular?: string;
  competencia_minedu?: string;
}

export function construirMisionMultinivelContextual(
  temaGeneral: string,
  contextoComunidad: string,
  selecciones?: SeleccionNivelTema[]
): MisionYuyAI {
  const limpio = temaGeneral.trim() || "Saberes de la Cosecha y el Agua";
  const lugar = contextoComunidad.trim() || "nuestra comunidad andina";

  const nivelesUsados: SeleccionNivelTema[] =
    selecciones && selecciones.length > 0
      ? selecciones
      : [
          {
            nivel_codigo: "nivel_1",
            nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
            tema_titulo: "Agrupación por decenas y unidades en la cosecha",
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_2",
            nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
            tema_titulo: "Multiplicación por filas y reparto equitativo",
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_3",
            nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
            tema_titulo: "Fracciones equivalentes y reparto comunal",
            area_curricular: "Matemática",
          },
        ];

  const bancoFase1 = [
    {
      instruccion: (t: string) =>
        `Para iniciar "${t}", reunimos 16 atados de semillas en la primera manta y 13 atados en la segunda manta. ¿Cuántos atados tenemos en total?`,
      respuesta: "29",
      feedback:
        "Recuerda juntar primero las dos decenas (10 + 10 = 20), y luego sumar las 6 y las 3 semillas sueltas.",
    },
    {
      instruccion: (t: string) =>
        `Aplicando "${t}", organizamos 6 hileras en la chacra escolar con 8 plantas nativas en cada hilera. ¿Cuántas plantas sembramos en total?`,
      respuesta: "48",
      feedback:
        "Piensa en la tabla del seis: si 6 por 7 es 42, súmale 6 plantas más para llegar al resultado.",
    },
    {
      instruccion: (t: string) =>
        `En el reto de "${t}", cosechamos 90 canastas comunales y destinamos las dos terceras partes (2/3) para las familias. ¿Cuántas canastas se entregaron?`,
      respuesta: "60",
      feedback:
        "Divide primero las 90 canastas entre 3 para conocer un tercio (30), y luego multiplica ese valor por 2.",
    },
  ];

  const bancoFase2 = [
    {
      instruccion: (t: string) =>
        `Avanzando en "${t}", teníamos 45 cántaros de agua fresca y usamos 22 para regar los almácigos. ¿Cuántos cántaros quedan llenos?`,
      respuesta: "23",
      feedback:
        "Resta primero las decenas: 40 menos 20 es 20; luego a los 5 cántaros sueltos quítales 2.",
    },
    {
      instruccion: (t: string) =>
        `Para "${t}", cada canal de piedra alimenta 7 terrazas. Si abrimos 8 canales al mismo tiempo, ¿cuántas terrazas reciben agua?`,
      respuesta: "56",
      feedback:
        "Recuerda que 7 veces 8 es un número par que está justo después del 55.",
    },
    {
      instruccion: (t: string) =>
        `Durante "${t}", un reservorio almacena 160 litros de agua y consume la cuarta parte (1/4) en la mañana. ¿Cuántos litros quedan disponibles?`,
      respuesta: "120",
      feedback:
        "La cuarta parte de 160 es 40 litros. Si restas esos 40 litros a los 160 iniciales obtendrás lo que queda.",
    },
  ];

  const bancoFase3 = [
    {
      instruccion: (t: string) =>
        `Para culminar "${t}", atamos 24 nudos en las cuerdas claras del quipu y 18 nudos en las cuerdas terracota. ¿Cuántos nudos registramos?`,
      respuesta: "42",
      feedback:
        "Si juntas 20 más 10 tienes 30, y al sumar 4 más 8 formas otra decena con dos unidades (12).",
    },
    {
      instruccion: (t: string) =>
        `Cerrando "${t}", cosechamos 54 canastas de aguaymanto para repartir en partes iguales entre 6 familias. ¿Cuántas canastas recibe cada familia?`,
      respuesta: "9",
      feedback:
        "Recuerda la tabla del seis: busca qué número multiplicado por 6 nos da exactamente 54.",
    },
    {
      instruccion: (t: string) =>
        `En el cierre de "${t}", tres sectores comunales recolectaron 35, 40 y 45 sacos de quinua. ¿Cuál es el promedio de sacos por sector?`,
      respuesta: "40",
      feedback:
        "Suma las tres cantidades para obtener 120 sacos en total y divídelo entre los 3 sectores.",
    },
  ];

  const armarRetos = (banco: typeof bancoFase1): RetoGrado[] =>
    nivelesUsados.map((sel, idx) => {
      const plantilla = banco[idx % banco.length];
      return {
        grado: idx + 1,
        nivel_codigo: sel.nivel_codigo,
        nivel_nombre: sel.nivel_nombre,
        tema_curricular: sel.tema_titulo,
        area_curricular: sel.area_curricular || "Matemática",
        instruccion: plantilla.instruccion(sel.tema_titulo),
        tipo_mecanica: "input_numerico",
        opciones: generarOpcionesParaRespuesta(plantilla.respuesta),
        respuesta_correcta: plantilla.respuesta,
        feedback_error: plantilla.feedback,
      };
    });

  return {
    titulo_mision: `Aventura en ${lugar}`,
    prompt_sdxl_base: `Warm children storybook illustration of an Andean rural community in ${lugar}, green terraced mountains, children and teachers working together, bright sunlight, Studio Ghibli art style`,
    fases: [
      {
        numero_fase: 1,
        titulo_fase: "Preparando las Semillas y Herramientas",
        prompt_sdxl: `Warm children storybook illustration of Andean school children gathering seeds and baskets in ${lugar}, morning golden sun, green terraces, vibrant colors`,
        narrativa_fase: `En ${lugar}, nos reunimos temprano para iniciar la jornada. Cada nivel del aula resolverá su estación para desbloquear la primera etapa de nuestra misión.`,
        retos_grados: armarRetos(bancoFase1),
      },
      {
        numero_fase: 2,
        titulo_fase: "Equilibrando el Agua y las Parcelas",
        prompt_sdxl: `Warm children storybook illustration of crystal clear water flowing through stone irrigation channels in Andean agricultural terraces in ${lugar}, llamas nearby, bright sky`,
        narrativa_fase: `¡El sol ilumina los andenes superiores! Ahora trabajemos en equipo para distribuir el agua y organizar las parcelas de toda la comunidad.`,
        retos_grados: armarRetos(bancoFase2),
      },
      {
        numero_fase: 3,
        titulo_fase: "El Gran Trueque y Fiesta Comunal",
        prompt_sdxl: `Warm children storybook illustration of a joyful harvest fair in ${lugar}, colorful woven blankets with potatoes, corn and quinoa, happy children celebrating`,
        narrativa_fase: `¡Llegamos a la cumbre de nuestra misión en ${lugar}! Registremos los últimos cálculos en el quipu del aula para celebrar la cosecha juntos.`,
        retos_grados: armarRetos(bancoFase3),
      },
    ],
    narrativa_victoria: `¡Felicitaciones a todos los niveles del aula! Con el esfuerzo unido de cada grupo en ${lugar}, completamos nuestra misión comunitaria.`,
    prompt_sdxl_victoria: `Warm children storybook illustration of a joyful Andean school celebration in ${lugar}, golden afternoon, rainbow over green mountains`,
    imagen_base_url: "/fallbacks/andes-bg.svg",
    imagen_victoria_url: "/fallbacks/andes-victory.svg",
  };
}
