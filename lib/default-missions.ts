import {
  AlumnoRow,
  MisionYuyAI,
  NivelAulaRow,
  RetoGrado,
  TemaCurricularRow,
} from "./types";

export const FRASES_CARGA_PEDAGOGICAS = [
  "Tejiendo la historia junto a los sabios de la comunidad...",
  "Consultando a los Apus para armonizar los retos de cada nivel...",
  "Entrelazando hilos de quipu para nuestra sesión multinivel...",
  "Preparando los cántaros de sabiduría en el telar de la escuela...",
  "Escuchando el murmullo del río para afinar los desafíos del día...",
];

export const MENSAJES_CARGA_HUMANOS = FRASES_CARGA_PEDAGOGICAS;


export const NIVELES_INICIALES: NivelAulaRow[] = [
  {
    id: "niv-1",
    codigo: "nivel_1",
    nombre: "Nivel 1 · Ciclo III (Semillas)",
    descripcion:
      "Iniciación en conteo concreto, sumas con decenas y comprensión de relatos cortos",
    color_hex: "#C85A32",
    orden: 1,
    activo: true,
  },
  {
    id: "niv-2",
    codigo: "nivel_2",
    nombre: "Nivel 2 · Ciclo IV (Tejedores)",
    descripcion:
      "Multiplicación, reparto equitativo, medición de terrenos y lectura inferencial",
    color_hex: "#1F7A5C",
    orden: 2,
    activo: true,
  },
  {
    id: "niv-3",
    codigo: "nivel_3",
    nombre: "Nivel 3 · Ciclo V (Amautas)",
    descripcion:
      "Fracciones, proporcionalidad en cosechas, geometría de andenes y argumentación",
    color_hex: "#2B6CB0",
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
  titulo_mision: "El rescate del puente Q'eswachaka",
  prompt_sdxl_base:
    "Warm storybook illustration of an ancient Incan rope bridge over an Andean river canyon at sunrise, golden light, green terraces, vibrant primary school art style",
  fases: [
    {
      numero_fase: 1,
      narrativa_fase:
        "El puente de ichu que une a nuestras comunidades necesita nuevas sogas trenzadas tras la lluvia de anoche. Cada nivel del aula aportará su saber para tensar la estructura.",
      retos_grados: [
        {
          grado: 1,
          nivel_codigo: "nivel_1",
          nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
          tema_curricular: "Agrupación por decenas y unidades en la cosecha",
          area_curricular: "Matemática",
          instruccion:
            "La comunidad de Huinchiri trajo 15 cuerdas largas de ichu y Chaupibanda trajo 12 cuerdas cortas. ¿Cuántas cuerdas reunimos en total?",
          tipo_mecanica: "input_numerico",
          respuesta_correcta: "27",
          feedback_error:
            "Casi lo logras. Intenta sumar primero los dos grupos de diez para tener veinte, y luego súmale las cinco y las dos cuerdas sueltas.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
          tema_curricular: "Multiplicación por filas y reparto equitativo en chacras",
          area_curricular: "Matemática",
          instruccion:
            "Para asegurar la base necesitamos 4 nudos firmes en cada una de las 8 vigas de piedra. ¿Cuántos nudos debemos atar en total?",
          tipo_mecanica: "input_numerico",
          respuesta_correcta: "32",
          feedback_error:
            "Recuerda la tabla del cuatro: cuatro veces ocho es apenas dos pasitos más después del treinta.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
          tema_curricular: "Fracciones equivalentes y reparto de tierras comunales",
          area_curricular: "Matemática",
          instruccion:
            "El puente mide 60 metros de largo y ya hemos tejido las dos terceras partes (2/3) de la pasarela. ¿Cuántos metros ya están tejidos?",
          tipo_mecanica: "input_numerico",
          respuesta_correcta: "40",
          feedback_error:
            "Divide primero los sesenta metros en tres partes iguales para hallar un tercio, y luego toma dos de esas partes.",
        },
      ],
    },
    {
      numero_fase: 2,
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
          respuesta_correcta: "24",
          feedback_error:
            "Resta primero las decenas: a treinta quítale diez y te quedan veinte; luego a las ocho papas sueltas quítales cuatro.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
          tema_curricular: "Multiplicación por filas y reparto equitativo en chacras",
          area_curricular: "Matemática",
          instruccion:
            "Si 6 llamas cargan 7 canastas de quinua cada una para la escuela, ¿cuántas canastas cruzarán el puente?",
          tipo_mecanica: "input_numerico",
          respuesta_correcta: "42",
          feedback_error:
            "Piensa en seis grupos de siete: si seis por seis es treinta y seis, súmale seis canastas más.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
          tema_curricular: "Fracciones equivalentes y reparto de tierras comunales",
          area_curricular: "Matemática",
          instruccion:
            "Reunimos 120 kilos de maíz morado y destinamos la cuarta parte (1/4) para la olla escolar. ¿Cuántos kilos quedan para el trueque comunal?",
          tipo_mecanica: "input_numerico",
          respuesta_correcta: "90",
          feedback_error:
            "La cuarta parte de ciento veinte es treinta kilos. Si separamos esos treinta kilos, ¿cuántos kilos nos quedan de los ciento veinte?",
        },
      ],
    },
    {
      numero_fase: 3,
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
          respuesta_correcta: "35",
          feedback_error:
            "Si al diecinueve le prestas uno del dieciséis formas veinte, y al sumarle los quince que quedan llegas a la respuesta.",
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
          respuesta_correcta: "9",
          feedback_error:
            "Recuerda la tabla del cinco: busca qué número multiplicado por cinco nos da cuarenta y cinco.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
          tema_curricular: "Registro estadístico de producción agrícola en tablas",
          area_curricular: "Matemática",
          instruccion:
            "Tres comunidades tejieron 24, 30 y 36 metros de barandal respectivamente. ¿Cuál fue el promedio de metros tejidos por comunidad?",
          tipo_mecanica: "input_numerico",
          respuesta_correcta: "30",
          feedback_error:
            "Suma los tres tramos para obtener el total de noventa metros y divídelo entre las tres comunidades participantes.",
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
  const lugar = contextoComunidad.trim() || "el Valle Sagrado de los Andes";

  const nivelesUsados: SeleccionNivelTema[] =
    selecciones && selecciones.length > 0
      ? selecciones
      : [
          {
            nivel_codigo: "nivel_1",
            nivel_nombre: "Nivel 1 · Ciclo III (Semillas)",
            tema_titulo: `Conteo y agrupación por decenas en ${limpio}`,
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_2",
            nivel_nombre: "Nivel 2 · Ciclo IV (Tejedores)",
            tema_titulo: `Multiplicación y reparto equitativo en ${limpio}`,
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_3",
            nivel_nombre: "Nivel 3 · Ciclo V (Amautas)",
            tema_titulo: `Fracciones y proporcionalidad en ${limpio}`,
            area_curricular: "Matemática",
          },
        ];

  const bancoFase1 = [
    {
      instruccion: (t: string) =>
        `Para iniciar "${t}", reunimos 16 atados de semillas en la primera manta y 13 atados en la segunda manta. ¿Cuántos atados tenemos en total?`,
      respuesta: "29",
      feedback:
        "Recuerda juntar primero las dos decenas para formar veinte, y luego sumar las seis y las tres semillas sueltas.",
    },
    {
      instruccion: (t: string) =>
        `Aplicando "${t}", organizamos 6 hileras en la chacra escolar con 8 plantas nativas en cada hilera. ¿Cuántas plantas sembramos en total?`,
      respuesta: "48",
      feedback:
        "Piensa en la tabla del seis: si seis por siete es cuarenta y dos, súmale seis plantas más para llegar al resultado.",
    },
    {
      instruccion: (t: string) =>
        `En el reto de "${t}", cosechamos 90 canastas comunales y destinamos las dos terceras partes (2/3) para las familias del ayllu. ¿Cuántas canastas se entregaron?`,
      respuesta: "60",
      feedback:
        "Divide primero las noventa canastas entre tres para conocer un tercio, que es treinta, y luego multiplica ese valor por dos.",
    },
    {
      instruccion: (t: string) =>
        `Para "${t}", registramos 4 parcelas de 125 metros cuadrados cada una. ¿Cuál es la superficie total trabajada por la comunidad?`,
      respuesta: "500",
      feedback:
        "Suma cuatro veces cien para tener cuatrocientos, y luego suma cuatro veces veinticinco para formar otros cien metros.",
    },
  ];

  const bancoFase2 = [
    {
      instruccion: (t: string) =>
        `Avanzando en "${t}", teníamos 45 cántaros de agua fresca y usamos 22 para regar los almácigos. ¿Cuántos cántaros quedan llenos?`,
      respuesta: "23",
      feedback:
        "Resta primero las decenas: cuarenta menos veinte es veinte; luego a los cinco cántaros sueltos quítales dos.",
    },
    {
      instruccion: (t: string) =>
        `Para "${t}", cada canal de piedra alimenta 7 terrazas. Si abrimos 8 canales al mismo tiempo, ¿cuántas terrazas reciben agua?`,
      respuesta: "56",
      feedback:
        "Recuerda que siete veces ocho es un número par que está justo después del cincuenta y cinco.",
    },
    {
      instruccion: (t: string) =>
        `Durante "${t}", un reservorio almacena 160 litros de agua y consume el 25% (la cuarta parte) en la mañana. ¿Cuántos litros quedan disponibles?`,
      respuesta: "120",
      feedback:
        "La cuarta parte de ciento sesenta es cuarenta litros. Si restas esos cuarenta litros al total inicial obtendrás lo que queda.",
    },
    {
      instruccion: (t: string) =>
        `En "${t}", repartimos 360 semillas en partes iguales entre 9 surcos circulares. ¿Cuántas semillas van en cada surco?`,
      respuesta: "40",
      feedback:
        "Piensa en la tabla del nueve: nueve por cuatro es treinta y seis, así que al agregar el cero de las decenas hallarás la respuesta.",
    },
  ];

  const bancoFase3 = [
    {
      instruccion: (t: string) =>
        `Para culminar "${t}", atamos 24 nudos en las cuerdas claras del quipu y 18 nudos en las cuerdas terracota. ¿Cuántos nudos registramos?`,
      respuesta: "42",
      feedback:
        "Si juntas veinte más diez tienes treinta, y al sumar cuatro más ocho formas otra decena con dos unidades.",
    },
    {
      instruccion: (t: string) =>
        `Cerrando "${t}", cosechamos 54 canastas de aguaymanto para repartir en partes iguales entre 6 familias. ¿Cuántas canastas recibe cada familia?`,
      respuesta: "9",
      feedback:
        "Recuerda la tabla del seis: busca qué número multiplicado por seis nos da exactamente cincuenta y cuatro.",
    },
    {
      instruccion: (t: string) =>
        `En el cierre de "${t}", tres sectores comunales recolectaron 35, 40 y 45 sacos de quinua. ¿Cuál es el promedio de sacos por sector?`,
      respuesta: "40",
      feedback:
        "Suma las tres cantidades para obtener ciento veinte sacos en total y divídelo entre los tres sectores de la comunidad.",
    },
    {
      instruccion: (t: string) =>
        `Para sellar "${t}", un terreno rectangular mide 15 metros de largo por 8 metros de ancho. ¿Cuál es su área total en metros cuadrados?`,
      respuesta: "120",
      feedback:
        "Multiplica diez por ocho para obtener ochenta, luego cinco por ocho que es cuarenta, y junta ambos resultados.",
    },
  ];

  const armarRetos = (
    banco: typeof bancoFase1
  ): RetoGrado[] =>
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
        respuesta_correcta: plantilla.respuesta,
        feedback_error: plantilla.feedback,
      };
    });

  return {
    titulo_mision: `Misión en ${lugar}: ${limpio}`,
    prompt_sdxl_base: `Warm storybook illustration of an Andean rural school community gathering in ${lugar}, terraced green mountains, sunny sky, friendly colors`,
    fases: [
      {
        numero_fase: 1,
        narrativa_fase: `En ${lugar}, nos reunimos junto a los sabios de la comunidad para iniciar la jornada sobre "${limpio}". Cada nivel del aula resolverá su desafío para abrir el primer camino.`,
        retos_grados: armarRetos(bancoFase1),
      },
      {
        numero_fase: 2,
        narrativa_fase: `El sol ilumina los andenes superiores mientras avanzamos unidos en "${limpio}". Ahora debemos equilibrar el agua y los recursos entre todas las parcelas.`,
        retos_grados: armarRetos(bancoFase2),
      },
      {
        numero_fase: 3,
        narrativa_fase: `¡Estamos en la cumbre de nuestra misión en ${lugar}! Registremos los últimos cálculos en los quipus del salón para celebrar juntos.`,
        retos_grados: armarRetos(bancoFase3),
      },
    ],
    narrativa_victoria: `¡Felicitaciones a todos los niveles del aula! Con el esfuerzo unido de cada grupo en ${lugar}, completamos con éxito la jornada sobre "${limpio}".`,
    prompt_sdxl_victoria: `Warm storybook illustration of a joyful Andean school celebration in ${lugar}, sunny golden afternoon, green terraces, children smiling`,
    imagen_base_url: "/fallbacks/andes-bg.svg",
    imagen_victoria_url: "/fallbacks/andes-victory.svg",
  };
}
