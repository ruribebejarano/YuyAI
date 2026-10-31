import {
  AlumnoRow,
  MisionYuyAI,
  NivelAulaRow,
  RetoGrado,
  TemaCurricularRow,
} from "./types";

export const FRASES_CARGA_PEDAGOGICAS = [
  "Creando la historia conectada de los 3 capítulos...",
  "Redactando la explicación teórica del tema de cada nivel...",
  "Diseñando las preguntas de Ciencia, Personal Social, Comunicación o Matemática...",
  "Ilustrando el escenario del capítulo en vivo...",
];

export const MENSAJES_CARGA_HUMANOS = FRASES_CARGA_PEDAGOGICAS;

export function generarOpcionesParaRespuesta(
  respuestaCorrecta: string,
  opcionesExistentes?: string[]
): string[] {
  const limpia = String(respuestaCorrecta || "").trim();
  if (
    Array.isArray(opcionesExistentes) &&
    opcionesExistentes.length >= 3
  ) {
    const lista = opcionesExistentes.map((o) => String(o).trim());
    const yaEsta = lista.some(
      (o) => o.toLowerCase() === limpia.toLowerCase()
    );
    if (!yaEsta && limpia) {
      lista[0] = limpia;
    }
    return lista.slice(0, 4);
  }

  const num = Number(limpia.replace(",", "."));
  if (limpia !== "" && !Number.isNaN(num)) {
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
    return candidatas.slice(0, 4).sort((a, b) => Number(a) - Number(b));
  }

  return [limpia || "Opción correcta", "El tallo", "El aire", "La roca"];
}

export const NIVELES_INICIALES: NivelAulaRow[] = [
  {
    id: "niv-1",
    codigo: "nivel_1",
    nombre: "Nivel 1 · Ciclo III",
    descripcion: "1.° y 2.° grado de Primaria",
    color_hex: "#238564",
    orden: 1,
    activo: true,
  },
  {
    id: "niv-2",
    codigo: "nivel_2",
    nombre: "Nivel 2 · Ciclo IV",
    descripcion: "3.° y 4.° grado de Primaria",
    color_hex: "#2B6CB0",
    orden: 2,
    activo: true,
  },
  {
    id: "niv-3",
    codigo: "nivel_3",
    nombre: "Nivel 3 · Ciclo V",
    descripcion: "5.° y 6.° grado de Primaria",
    color_hex: "#D4653B",
    orden: 3,
    activo: true,
  },
];

export const TEMAS_INICIALES: TemaCurricularRow[] = [
  {
    id: "tem-1",
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
    area_curricular: "Matemática",
    titulo_tema: "Sumas agrupando decenas y unidades",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Agrupa cantidades en decenas y unidades para resolver adiciones de dos cifras.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-2",
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
    area_curricular: "Ciencia y Tecnología",
    titulo_tema: "Las partes de las plantas nativas y su crecimiento",
    competencia_minedu: "Explica el mundo físico",
    desempeno_esperado:
      "Reconoce la función de la raíz, el tallo, las hojas y la flor en las plantas.",
    estado: "pendiente",
    orden: 2,
  },
  {
    id: "tem-3",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    area_curricular: "Matemática",
    titulo_tema: "Multiplicación por filas y grupos iguales",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Resuelve problemas multiplicativos organizando elementos en filas y columnas.",
    estado: "en_curso",
    orden: 3,
  },
  {
    id: "tem-4",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    area_curricular: "Ciencia y Tecnología",
    titulo_tema: "Conservación del suelo agrícola y abonos orgánicos",
    competencia_minedu: "Explica el mundo físico",
    desempeno_esperado:
      "Explica cómo el compost y la rotación de cultivos protegen la tierra.",
    estado: "pendiente",
    orden: 4,
  },
  {
    id: "tem-5",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    area_curricular: "Matemática",
    titulo_tema: "Fracciones de una cantidad total",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Calcula qué parte representa una fracción (1/4, 2/3 o 3/5) de un total.",
    estado: "en_curso",
    orden: 5,
  },
  {
    id: "tem-6",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    area_curricular: "Personal Social",
    titulo_tema: "Las regiones naturales y pisos ecológicos de los Andes",
    competencia_minedu: "Gestiona responsablemente el espacio y el ambiente",
    desempeno_esperado:
      "Relaciona la altitud de Quechua, Suni y Puna con su clima y cultivos.",
    estado: "pendiente",
    orden: 6,
  },
];

export const ALUMNOS_DEMO: AlumnoRow[] = [
  {
    id: "alum-1",
    nombre_completo: "Illari Quispe Mamani",
    grado_actual: 1,
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
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
    nivel_nombre: "Nivel 1 · Ciclo III",
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
    nivel_nombre: "Nivel 2 · Ciclo IV",
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
    nivel_nombre: "Nivel 2 · Ciclo IV",
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
    nivel_nombre: "Nivel 3 · Ciclo V",
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
    nivel_nombre: "Nivel 3 · Ciclo V",
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

interface ContenidoTemaPorCapitulo {
  explicacion_previa: string;
  ejemplo_corto: string;
  instruccion: string;
  opciones: string[];
  respuesta_correcta: string;
  feedback_error: string;
}

function generarProgresionPorTemaYCapitulo(
  temaTitulo: string,
  areaCurricular: string,
  capitulo: 1 | 2 | 3,
  contextoCorto: string
): ContenidoTemaPorCapitulo {
  const t = temaTitulo.toLowerCase();
  const area = (areaCurricular || "").toLowerCase();

  // CIENCIA: Partes de la planta y crecimiento
  if (t.includes("planta") || t.includes("raíz") || t.includes("raiz") || t.includes("hoja")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "La raíz crece bajo la tierra: su función es fijar la planta al suelo y absorber el agua y los minerales.",
        ejemplo_corto: "Idea clave: Sin la raíz, la planta no podría tomar agua de la tierra.",
        instruccion: `Al iniciar ${contextoCorto}, Illari observa unas plantas recién sembradas. ¿Qué parte de la planta se encarga de absorber el agua y los nutrientes debajo de la tierra?`,
        opciones: ["La raíz", "La flor", "El fruto", "La semilla"],
        respuesta_correcta: "La raíz",
        feedback_error: "Piensa en la parte de la planta que está enterrada bajo el suelo tomando agua.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Las hojas reciben la luz del sol y el aire para fabricar el alimento de la planta (proceso llamado fotosíntesis), mientras el tallo transporta el agua.",
        ejemplo_corto: "Idea clave: Las hojas verdes usan la luz del sol para alimentar a la planta.",
        instruccion: `Al mediodía en ${contextoCorto}, el sol ilumina todo el huerto. ¿En qué parte de la planta se utiliza la luz del sol para elaborar su alimento?`,
        opciones: ["En las hojas", "En las piedras", "En la raíz seca", "En la cáscara"],
        respuesta_correcta: "En las hojas",
        feedback_error: "Recuerda qué parte verde de la planta recibe directamente los rayos del sol.",
      };
    }
    return {
      explicacion_previa:
        "Las flores se transforman en frutos, y dentro de los frutos se guardan las semillas que darán origen a nuevas plantas.",
      ejemplo_corto: "Idea clave: Flor → Fruto → Semilla para volver a sembrar.",
      instruccion: `Para cerrar ${contextoCorto}, los niños quieren guardar lo necesario para sembrar más plantas la próxima temporada. ¿Qué elemento que está dentro del fruto deben guardar?`,
      opciones: ["Las semillas", "Las hojas secas", "Las espinas", "El barro"],
      respuesta_correcta: "Las semillas",
      feedback_error: "Dentro del fruto se encuentran los granitos que germinan cuando los sembramos.",
    };
  }

  // CIENCIA: Suelo agrícola, compost, abonos y agua
  if (t.includes("suelo") || t.includes("abono") || t.includes("compost") || t.includes("agua") || area.includes("ciencia")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El suelo fértil necesita materia orgánica (como hojas secas, cáscaras de vegetales y guano natural) para nutrir los cultivos sin contaminar.",
        ejemplo_corto: "Idea clave: El compost es abono natural hecho con restos vegetales.",
        instruccion: `Al empezar ${contextoCorto}, el grupo de Amaru quiere enriquecer la tierra de manera natural. ¿Qué material deben mezclar con la tierra para formar abono orgánico (compost)?`,
        opciones: [
          "Cáscaras vegetales y hojas secas",
          "Bolsas de plástico y vidrio",
          "Piedras grandes y cemento",
          "Agua con detergente",
        ],
        respuesta_correcta: "Cáscaras vegetales y hojas secas",
        feedback_error: "El abono orgánico se forma con restos naturales de plantas y vegetales que se descomponen.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Los andenes y los surcos en contorno evitan que el agua de la lluvia arrastre la tierra fértil cuesta abajo (erosión del suelo).",
        ejemplo_corto: "Idea clave: Sembrar en terrazas o andenes protege la tierra de las lluvias fuertes.",
        instruccion: `Durante el trabajo del mediodía en ${contextoCorto}, empieza a correr agua por la ladera. ¿Para qué sirven los muros de los andenes en las montañas?`,
        opciones: [
          "Evitan que el agua lave y arrastre la tierra fértil",
          "Hacen que llueva menos en el valle",
          "Secan por completo las raíces de las plantas",
          "Impiden que llegue la luz del sol",
        ],
        respuesta_correcta: "Evitan que el agua lave y arrastre la tierra fértil",
        feedback_error: "Los escalones de los andenes frenan la fuerza del agua para cuidar el suelo agrícola.",
      };
    }
    return {
      explicacion_previa:
        "La rotación de cultivos consiste en alternar diferentes plantas (por ejemplo, papa un año y habas o tarwi al siguiente) para que el suelo recupere sus nutrientes.",
      ejemplo_corto: "Idea clave: Cambiar de cultivo cada temporada descansa y nutre la tierra.",
      instruccion: `Para planificar el final de ${contextoCorto}, si este año cosechamos papa en la parcela, ¿qué práctica ayuda a que la tierra recupere sus nutrientes el próximo año?`,
      opciones: [
        "Rotar sembrando legumbres como habas o tarwi",
        "Quemar toda la parcela con fuego",
        "Dejar basura sintética sobre el terreno",
        "Echar sal sobre los surcos",
      ],
      respuesta_correcta: "Rotar sembrando legumbres como habas o tarwi",
      feedback_error: "Alternar cultivos como las habas devuelve nitrógeno y vida a la tierra.",
    };
  }

  // PERSONAL SOCIAL: Regiones naturales y pisos ecológicos
  if (t.includes("piso") || t.includes("ecológic") || t.includes("ecologic") || t.includes("regi") || area.includes("social")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Según el geógrafo Javier Pulgar Vidal, la región Quechua (entre 2300 y 3500 metros de altitud) tiene un clima templado ideal para cultivar maíz, calabaza y árboles frutales.",
        ejemplo_corto: "Idea clave: Región Quechua = Clima templado de valles interandinos (maíz).",
        instruccion: `En el primer capítulo de ${contextoCorto}, Qori observa los valles templados donde crece muy bien el maíz. ¿Cómo se llama este piso ecológico situado entre los 2300 y 3500 m s. n. m.?`,
        opciones: ["Región Quechua", "Región Chala o Costa", "Región Janca o Cordillera", "Región Omagua"],
        respuesta_correcta: "Región Quechua",
        feedback_error: "Es el piso ecológico de los valles interandinos templados que lleva el mismo nombre de nuestro idioma ancestral.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Más arriba, en la región Suni (3500 a 4000 m) y Puna (4000 a 4800 m), el clima es frío; allí se cultivan papas nativas resistentes a las heladas, quinua, cañihua y pastan las alpacas.",
        ejemplo_corto: "Idea clave: En la Puna (más de 4000 m) viven las alpacas y vicuñas.",
        instruccion: `Al subir por el camino al mediodía en ${contextoCorto}, llegamos a las mesetas altas a más de 4100 metros donde crecen el ichu y pastan las alpacas. ¿En qué región natural nos encontramos?`,
        opciones: ["Región Puna", "Región Yunga", "Región Costa", "Región Rupa Rupa"],
        respuesta_correcta: "Región Puna",
        feedback_error: "Recuerda cómo se llaman las mesetas altoandinas frías ubicadas por encima de los 4000 metros.",
      };
    }
    return {
      explicacion_previa:
        "El intercambio o trueque entre comunidades de distintos pisos ecológicos permite que las familias de altura obtengan maíz y frutas del valle, y las del valle reciban papa, chuño y lana.",
      ejemplo_corto: "Idea clave: Los pisos ecológicos se complementan compartiendo sus productos.",
      instruccion: `Para cerrar ${contextoCorto}, las familias de la zona alta llevan chuño y lana de alpaca para intercambiar con las familias del valle templado. ¿Qué producto típico del valle Quechua recibirán a cambio?`,
      opciones: ["Maíz y frutas del valle", "Peces del mar profundo", "Bloques de hielo glaciar", "Cocos tropicales"],
      respuesta_correcta: "Maíz y frutas del valle",
      feedback_error: "Recuerda qué cultivo principal crece en el clima templado del valle Quechua.",
    };
  }

  // COMUNICACIÓN: Lectura y expresión
  if (area.includes("comunicaci") || t.includes("relato") || t.includes("texto") || t.includes("lectura")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "En toda narración, los personajes principales son quienes realizan las acciones más importantes desde el inicio de la historia.",
        ejemplo_corto: "Idea clave: ¿Quiénes participan en el inicio del relato?",
        instruccion: `Según lo que acabamos de leer en el Capítulo 1 sobre ${contextoCorto}, ¿por qué se reunieron temprano Illari, Amaru y Qori con su maestro?`,
        opciones: [
          "Para organizarse en equipo e iniciar el proyecto escolar",
          "Porque habían suspendido las clases toda la semana",
          "Para viajar a otra ciudad lejos de la escuela",
          "Porque querían dormir toda la mañana",
        ],
        respuesta_correcta: "Para organizarse en equipo e iniciar el proyecto escolar",
        feedback_error: "Vuelve a leer la primera oración del capítulo: llegaron temprano para dar inicio a la actividad.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Los conectores de secuencia (como 'primero', 'luego al mediodía', 'después') nos ayudan a ordenar los hechos en el tiempo.",
        ejemplo_corto: "Idea clave: Mañana (inicio) → Mediodía (nudo) → Tarde (desenlace).",
        instruccion: `En este segundo capítulo de ${contextoCorto}, ¿qué hicieron los niños después de haber reunido los materiales en la mañana?`,
        opciones: [
          "Avanzaron con la parte central del trabajo al mediodía",
          "Abandonaron las herramientas en el río",
          "Regresaron a sus casas sin empezar",
          "Rompieron los materiales reunidos",
        ],
        respuesta_correcta: "Avanzaron con la parte central del trabajo al mediodía",
        feedback_error: "Observa cómo continúa la historia al llegar el mediodía.",
      };
    }
    return {
      explicacion_previa:
        "La enseñanza o mensaje principal de un relato comunitario destaca el valor de la cooperación entre todos los niveles.",
      ejemplo_corto: "Idea clave: El trabajo unido logra metas que uno solo no podría.",
      instruccion: `Al llegar al desenlace de ${contextoCorto}, ¿cuál es la enseñanza principal que nos deja la historia de hoy?`,
      opciones: [
        "Que trabajando unidos cada nivel aporta para lograr la meta común",
        "Que es mejor trabajar solos sin hablar con nadie",
        "Que solo los niños mayores pueden participar",
        "Que no hace falta planificar antes de actuar",
      ],
      respuesta_correcta: "Que trabajando unidos cada nivel aporta para lograr la meta común",
      feedback_error: "Piensa en cómo lograron terminar la actividad entre los tres niveles del aula.",
    };
  }

  // MATEMÁTICA: Lados y figuras geométricas
  if (t.includes("lado") || t.includes("figura") || t.includes("vertice") || t.includes("vértice")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Cada figura geométrica tiene un número exacto de lados rectos: el triángulo tiene 3 lados y el cuadrado o rectángulo tiene 4 lados.",
        ejemplo_corto: "Ejemplo: 2 mesas cuadradas tienen 4 + 4 = 8 lados en total.",
        instruccion: `Al iniciar ${contextoCorto}, Illari dibujó 3 carteles rectangulares para señalizar el camino. Si cada rectángulo tiene 4 lados, ¿cuántos lados dibujó en total?`,
        opciones: ["8", "10", "12", "15"],
        respuesta_correcta: "12",
        feedback_error: "Suma 4 lados por cada uno de los 3 rectángulos: 4 + 4 + 4.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Los vértices son las esquinas donde se unen dos lados. Un triángulo tiene 3 esquinas y un cuadrado tiene 4 esquinas.",
        ejemplo_corto: "Ejemplo: 1 cuadrado (4 esquinas) + 1 triángulo (3 esquinas) = 7 esquinas.",
        instruccion: `Con los carteles ya listos en ${contextoCorto}, Amaru armó 2 marcos cuadrados de madera y 1 banderín triangular. ¿Cuántas esquinas (vértices) hay sumando las 3 figuras?`,
        opciones: ["9", "10", "11", "14"],
        respuesta_correcta: "11",
        feedback_error: "Suma las 4 esquinas del primer cuadrado + 4 del segundo cuadrado + 3 del triángulo.",
      };
    }
    return {
      explicacion_previa:
        "Para saber cuántos listones necesitamos al juntar varias figuras iguales, sumamos los lados de todas ellas.",
      ejemplo_corto: "Ejemplo: 3 cuadrados → 4 + 4 + 4 = 12 lados.",
      instruccion: `Para terminar ${contextoCorto}, colocamos 4 ventanas cuadradas iguales. ¿Cuántos lados de madera contamos entre las 4 ventanas?`,
      opciones: ["12", "14", "16", "20"],
      respuesta_correcta: "16",
      feedback_error: "Cada ventana cuadrada tiene 4 lados. Suma 4 + 4 + 4 + 4.",
    };
  }

  // MATEMÁTICA: Perímetro
  if (t.includes("perímetro") || t.includes("perimetro")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El perímetro de un cuadrado es la suma de sus 4 lados iguales (o multiplicar la medida de un lado por 4).",
        ejemplo_corto: "Ejemplo: Un cuadrado de 6 m de lado tiene perímetro 6 × 4 = 24 m.",
        instruccion: `En la primera parte de ${contextoCorto}, delimitamos un terreno cuadrado donde cada lado mide 8 metros. ¿Cuántos metros mide todo su perímetro?`,
        opciones: ["24", "28", "32", "36"],
        respuesta_correcta: "32",
        feedback_error: "Suma los 4 lados iguales de 8 metros: 8 × 4.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El perímetro de un rectángulo se calcula sumando sus dos largos más sus dos anchos: largo + largo + ancho + ancho.",
        ejemplo_corto: "Ejemplo: Largo 10 m y ancho 4 m → 10 + 10 + 4 + 4 = 28 m.",
        instruccion: `Avanzando con ${contextoCorto}, cercaremos una zona rectangular que mide 12 metros de largo y 6 metros de ancho. ¿Cuántos metros mide todo su perímetro?`,
        opciones: ["24", "30", "36", "42"],
        respuesta_correcta: "36",
        feedback_error: "Suma los dos largos (12 + 12 = 24) más los dos anchos (6 + 6 = 12).",
      };
    }
    return {
      explicacion_previa:
        "Si conocemos el perímetro total de un cuadrado, dividimos entre 4 para saber cuánto mide cada lado.",
      ejemplo_corto: "Ejemplo: Perímetro de 40 m en un cuadrado → 40 ÷ 4 = 10 m cada lado.",
      instruccion: `Para culminar ${contextoCorto}, usamos una cuerda de 48 metros exactos para rodear un jardín cuadrado. ¿Cuántos metros mide cada lado del jardín?`,
      opciones: ["10", "12", "14", "16"],
      respuesta_correcta: "12",
      feedback_error: "Divide los 48 metros del perímetro entre los 4 lados iguales.",
    };
  }

  // MATEMÁTICA: Área
  if (t.includes("área") || t.includes("area") || t.includes("superficie")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El área de un rectángulo mide su superficie interior y se calcula multiplicando la base (largo) por la altura (ancho).",
        ejemplo_corto: "Ejemplo: Base 8 m × Altura 5 m = 40 m².",
        instruccion: `Al iniciar ${contextoCorto}, Qori limpió un terreno rectangular de 9 metros de largo por 6 metros de ancho. ¿Cuál es el área total en metros cuadrados?`,
        opciones: ["45", "54", "60", "64"],
        respuesta_correcta: "54",
        feedback_error: "Multiplica el largo por el ancho: 9 × 6.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El área de un triángulo es la mitad de un rectángulo: multiplicamos base por altura y dividimos entre 2.",
        ejemplo_corto: "Ejemplo: Base 10 m y altura 6 m → (10 × 6) ÷ 2 = 30 m².",
        instruccion: `Siguiendo con ${contextoCorto}, al costado preparamos una parcela triangular de 12 metros de base y 8 metros de altura. ¿Cuál es su área en m²?`,
        opciones: ["36", "42", "48", "56"],
        respuesta_correcta: "48",
        feedback_error: "Multiplica 12 × 8 (= 96) y divide el resultado entre 2.",
      };
    }
    return {
      explicacion_previa:
        "Para conocer el área total de dos terrenos juntos, sumamos las superficies de ambos.",
      ejemplo_corto: "Ejemplo: 30 m² + 25 m² = 55 m².",
      instruccion: `Al finalizar ${contextoCorto}, unimos el primer sector de 45 m² con el segundo de 35 m². ¿Cuántos metros cuadrados suma toda la obra?`,
      opciones: ["70", "75", "80", "90"],
      respuesta_correcta: "80",
      feedback_error: "Suma las dos superficies: 45 + 35.",
    };
  }

  // MATEMÁTICA: Multiplicación y división
  if (t.includes("multiplic") || t.includes("fila") || t.includes("reparto") || t.includes("divisi")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Cuando organizamos elementos en filas iguales, multiplicamos el número de filas por la cantidad en cada fila.",
        ejemplo_corto: "Ejemplo: 5 filas × 6 elementos = 30 elementos.",
        instruccion: `Para empezar ${contextoCorto}, Amaru ordenó 6 filas con 7 materiales en cada fila. ¿Cuántos materiales preparó en total?`,
        opciones: ["36", "40", "42", "48"],
        respuesta_correcta: "42",
        feedback_error: "Multiplica 6 filas por 7 materiales: 6 × 7.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Repartir en partes iguales es dividir el total entre el número de equipos.",
        ejemplo_corto: "Ejemplo: 36 entre 4 equipos → 36 ÷ 4 = 9.",
        instruccion: `Al mediodía en ${contextoCorto}, repartimos 48 herramientas en partes iguales entre 6 grupos del aula. ¿Cuántas recibe cada grupo?`,
        opciones: ["6", "7", "8", "9"],
        respuesta_correcta: "8",
        feedback_error: "Busca qué número multiplicado por 6 nos da 48.",
      };
    }
    return {
      explicacion_previa:
        "Para calcular el total en varias cajas iguales, multiplicamos el número de cajas por las unidades de cada caja.",
      ejemplo_corto: "Ejemplo: 6 cajas × 8 unidades = 48 unidades.",
      instruccion: `Para culminar ${contextoCorto}, guardamos 7 canastas con 8 productos en cada una. ¿Cuántos productos reunimos en total?`,
      opciones: ["48", "54", "56", "64"],
      respuesta_correcta: "56",
      feedback_error: "Multiplica 7 canastas por 8 productos: 7 × 8.",
    };
  }

  // MATEMÁTICA: Fracciones y porcentajes
  if (t.includes("fracci") || t.includes("porcentaje") || t.includes("%")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Para hallar una fracción de un total (como 2/3), dividimos el total entre el denominador y multiplicamos por el numerador.",
        ejemplo_corto: "Ejemplo: 2/3 de 30 → (30 ÷ 3 = 10) × 2 = 20.",
        instruccion: `Al iniciar ${contextoCorto}, necesitamos 60 materiales y ya reunimos las dos terceras partes (2/3). ¿Cuántos materiales ya tenemos?`,
        opciones: ["20", "30", "40", "45"],
        respuesta_correcta: "40",
        feedback_error: "Divide 60 entre 3 (= 20) y multiplícalo por 2.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "La cuarta parte (1/4 o 25%) se obtiene dividiendo el total entre 4.",
        ejemplo_corto: "Ejemplo: 1/4 de 80 → 80 ÷ 4 = 20.",
        instruccion: `Al mediodía en ${contextoCorto}, de los 120 elementos disponibles usamos la cuarta parte (1/4). ¿Cuántos elementos utilizamos?`,
        opciones: ["20", "25", "30", "40"],
        respuesta_correcta: "30",
        feedback_error: "Divide 120 entre 4 para hallar la cuarta parte.",
      };
    }
    return {
      explicacion_previa:
        "Para hallar las tres quintas partes (3/5), dividimos el total entre 5 y multiplicamos por 3.",
      ejemplo_corto: "Ejemplo: 3/5 de 50 → (50 ÷ 5 = 10) × 3 = 30.",
      instruccion: `Para cerrar ${contextoCorto}, de 100 unidades producidas entregamos las tres quintas partes (3/5) a la comunidad. ¿Cuántas entregamos?`,
      opciones: ["40", "50", "60", "75"],
      respuesta_correcta: "60",
      feedback_error: "Divide 100 entre 5 (= 20) y multiplícalo por 3.",
    };
  }

  // MATEMÁTICA: Sumas y restas (Nivel 1 base)
  if (capitulo === 1) {
    return {
      explicacion_previa:
        "Para sumar dos cantidades de dos cifras, primero sumamos las decenas (grupos de 10) y luego las unidades sueltas.",
      ejemplo_corto: "Ejemplo: 14 + 13 → (10 + 10 = 20) y (4 + 3 = 7) → 27.",
      instruccion: `Al comenzar ${contextoCorto}, Illari reunió 16 materiales y Amaru trajo 13 más. ¿Cuántos reunieron en total?`,
      opciones: ["25", "27", "29", "32"],
      respuesta_correcta: "29",
      feedback_error: "Suma primero las decenas (10 + 10 = 20) y luego las unidades (6 + 3 = 9).",
    };
  }
  if (capitulo === 2) {
    return {
      explicacion_previa:
        "Para saber cuántos elementos quedan después de usar una parte, restamos decenas con decenas y unidades con unidades.",
      ejemplo_corto: "Ejemplo: 38 - 14 → (30 - 10 = 20) y (8 - 4 = 4) → 24.",
      instruccion: `Al mediodía en ${contextoCorto}, de los 37 materiales que teníamos en la mesa ya usamos 14. ¿Cuántos quedan disponibles?`,
      opciones: ["21", "23", "25", "27"],
      respuesta_correcta: "23",
      feedback_error: "Resta 30 menos 10 (= 20) y 7 menos 4 (= 3).",
    };
  }
  return {
    explicacion_previa:
      "Cuando las unidades sueltas suman más de 10, formamos una nueva decena completa.",
    ejemplo_corto: "Ejemplo: 18 + 15 → (18 + 2 = 20) + 13 = 33.",
    instruccion: `Para terminar ${contextoCorto}, juntamos 19 piezas de la mañana con 16 piezas de la tarde. ¿Cuántas piezas tenemos al final del día?`,
    opciones: ["31", "33", "35", "39"],
    respuesta_correcta: "35",
    feedback_error: "Pásale 1 del 16 al 19 para formar 20, y súmale los 15 restantes.",
  };
}

export function construirMisionMultinivelContextual(
  _temaGeneral: string,
  contextoComunidad: string,
  selecciones?: SeleccionNivelTema[]
): MisionYuyAI {
  const escenario =
    contextoComunidad.trim() ||
    "el proyecto comunitario de nuestra escuela";
  const escenarioMinuscula =
    escenario.charAt(0).toLowerCase() + escenario.slice(1);

  const nivelesUsados: SeleccionNivelTema[] =
    selecciones && selecciones.length > 0
      ? selecciones
      : [
          {
            nivel_codigo: "nivel_1",
            nivel_nombre: "Nivel 1 · Ciclo III",
            tema_titulo: "Sumas agrupando decenas y unidades",
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_2",
            nivel_nombre: "Nivel 2 · Ciclo IV",
            tema_titulo: "Multiplicación por filas y grupos iguales",
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_3",
            nivel_nombre: "Nivel 3 · Ciclo V",
            tema_titulo: "Fracciones de una cantidad total",
            area_curricular: "Matemática",
          },
        ];

  const armarRetosCapitulo = (capitulo: 1 | 2 | 3): RetoGrado[] =>
    nivelesUsados.map((sel, idx) => {
      const prog = generarProgresionPorTemaYCapitulo(
        sel.tema_titulo,
        sel.area_curricular || "Matemática",
        capitulo,
        escenarioMinuscula
      );
      return {
        grado: idx + 1,
        nivel_codigo: sel.nivel_codigo,
        nivel_nombre: sel.nivel_nombre,
        tema_curricular: sel.tema_titulo,
        area_curricular: sel.area_curricular || "Matemática",
        explicacion_previa: prog.explicacion_previa,
        ejemplo_corto: prog.ejemplo_corto,
        instruccion: prog.instruccion,
        tipo_mecanica: "opcion_multiple",
        opciones: prog.opciones,
        respuesta_correcta: prog.respuesta_correcta,
        feedback_error: prog.feedback_error,
      };
    });

  return {
    titulo_mision: escenario,
    prompt_sdxl_base: `Warm children storybook illustration of Andean primary school students Illari, Amaru and Qori working together on ${escenario}, sunny mountain valley, Ghibli style`,
    fases: [
      {
        numero_fase: 1,
        titulo_fase: "Capítulo 1: El Inicio por la Mañana",
        prompt_sdxl: `Warm children storybook illustration of Andean school children arriving in the morning to start ${escenario}, gathering tools and baskets, golden morning light`,
        narrativa_fase: `Muy temprano por la mañana, los niños Illari, Amaru y Qori llegaron junto a su maestro para dar inicio a ${escenarioMinuscula}. Antes de comenzar, cada nivel del salón revisó su tema del día para organizar la primera etapa.`,
        explicacion_general:
          "En este primer capítulo estudiamos los conceptos iniciales de cada nivel.",
        retos_grados: armarRetosCapitulo(1),
      },
      {
        numero_fase: 2,
        titulo_fase: "Capítulo 2: Avanzando al Mediodía",
        prompt_sdxl: `Warm children storybook illustration of the same Andean school children at midday actively working on the middle stage of ${escenario}, teamwork, bright sky`,
        narrativa_fase: `Con lo que Illari, Amaru y Qori organizaron en la mañana durante el Capítulo 1, al llegar el mediodía ya tenían la base lista en ${escenarioMinuscula}. Ahora deben resolver el reto intermedio para que toda la clase siga avanzando unida.`,
        explicacion_general:
          "En este segundo capítulo aplicamos lo aprendido en la mañana al reto del mediodía.",
        retos_grados: armarRetosCapitulo(2),
      },
      {
        numero_fase: 3,
        titulo_fase: "Capítulo 3: El Desenlace de la Tarde",
        prompt_sdxl: `Warm children storybook illustration of Andean school children celebrating at sunset after completing ${escenario} together with their community, festive flags`,
        narrativa_fase: `Al caer la tarde, después de superar juntos el reto del mediodía, Illari, Amaru y Qori dan el paso final para culminar ${escenarioMinuscula} frente a toda la comunidad escolar.`,
        explicacion_general:
          "En el capítulo final cerramos la historia resolviendo la última actividad de cada nivel.",
        retos_grados: armarRetosCapitulo(3),
      },
    ],
    narrativa_victoria: `¡Historia completada! Desde el inicio en la mañana hasta el cierre de la tarde, los tres niveles aplicaron sus temas y completaron ${escenarioMinuscula}.`,
    prompt_sdxl_victoria: `Warm children storybook illustration of happy Andean school children celebrating the completion of ${escenario}, golden afternoon`,
    imagen_base_url: "/fallbacks/andes-bg.svg",
    imagen_victoria_url: "/fallbacks/andes-victory.svg",
  };
}

export const MISION_PUENTE_INCA: MisionYuyAI = construirMisionMultinivelContextual(
  "Sumas, multiplicación y fracciones",
  "El tejido cooperativo del puente colgante sobre el río"
);

export const MISION_INICIAL_DEMO = MISION_PUENTE_INCA;
