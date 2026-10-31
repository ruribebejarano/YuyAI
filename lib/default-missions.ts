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
  "Ilustrando la escena del capítulo en vivo...",
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

  return [
    limpia || "Opción correcta",
    "El tallo de la planta",
    "La energía mecánica",
    "Ninguna de las anteriores",
  ];
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
    area_curricular: "Ciencia y Tecnología",
    titulo_tema: "Los seres vivos, las plantas y sus partes",
    competencia_minedu: "Explica el mundo físico",
    desempeno_esperado:
      "Reconoce la función de la raíz, el tallo, las hojas y la flor en el crecimiento de las plantas.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-2",
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
    area_curricular: "Comunicación",
    titulo_tema: "Comprensión de cuentos: personajes e idea principal",
    competencia_minedu: "Lee diversos tipos de textos escritos",
    desempeno_esperado:
      "Identifica a los personajes principales, la secuencia de hechos y el mensaje de un relato corto.",
    estado: "en_curso",
    orden: 2,
  },
  {
    id: "tem-3",
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
    area_curricular: "Matemática",
    titulo_tema: "Sumas y restas agrupando decenas y unidades",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Agrupa cantidades en decenas y unidades para resolver adiciones y sustracciones de dos cifras.",
    estado: "en_curso",
    orden: 3,
  },
  {
    id: "tem-4",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    area_curricular: "Ciencia y Tecnología",
    titulo_tema: "Los estados del agua y el cuidado del medio ambiente",
    competencia_minedu: "Explica el mundo físico",
    desempeno_esperado:
      "Diferencia los estados líquido, sólido y gaseoso del agua y propone acciones para su cuidado.",
    estado: "en_curso",
    orden: 4,
  },
  {
    id: "tem-5",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    area_curricular: "Personal Social",
    titulo_tema: "Convivencia escolar, responsabilidades y trabajo en equipo",
    competencia_minedu: "Convive y participa democráticamente",
    desempeno_esperado:
      "Practica acuerdos de convivencia, escucha activa y distribución justa de responsabilidades.",
    estado: "en_curso",
    orden: 5,
  },
  {
    id: "tem-6",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    area_curricular: "Matemática",
    titulo_tema: "Multiplicación por grupos iguales y cálculo de perímetros",
    competencia_minedu: "Resuelve problemas de cantidad y forma",
    desempeno_esperado:
      "Resuelve problemas organizando filas iguales y calcula el perímetro de figuras rectangulares.",
    estado: "en_curso",
    orden: 6,
  },
  {
    id: "tem-7",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    area_curricular: "Ciencia y Tecnología",
    titulo_tema: "El sistema solar, las fuentes de energía y los ecosistemas",
    competencia_minedu: "Explica el mundo físico",
    desempeno_esperado:
      "Relaciona los movimientos de la Tierra, la energía solar y el equilibrio de las cadenas alimenticias.",
    estado: "en_curso",
    orden: 7,
  },
  {
    id: "tem-8",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    area_curricular: "Personal Social",
    titulo_tema: "La biodiversidad, el relieve y la prevención de riesgos",
    competencia_minedu: "Gestiona responsablemente el espacio y el ambiente",
    desempeno_esperado:
      "Identifica las características de los ecosistemas y las medidas de prevención ante fenómenos naturales.",
    estado: "en_curso",
    orden: 8,
  },
  {
    id: "tem-9",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    area_curricular: "Matemática",
    titulo_tema: "Fracciones, porcentajes y área de figuras planas",
    competencia_minedu: "Resuelve problemas de cantidad y forma",
    desempeno_esperado:
      "Calcula la fracción de una cantidad total y halla el área de superficies rectangulares y triangulares.",
    estado: "en_curso",
    orden: 9,
  },
];

export const ALUMNOS_DEMO: AlumnoRow[] = [
  {
    id: "alum-1",
    nombre_completo: "Mateo Rojas Paredes",
    grado_actual: 1,
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
    competencias: {
      logica_matematica: 86,
      comprension_lectora: 84,
      resolucion_problemas: 80,
      trabajo_colaborativo: 92,
      expresion_oral: 85,
      pensamiento_creativo: 90,
    },
  },
  {
    id: "alum-2",
    nombre_completo: "Valentina Flores Castro",
    grado_actual: 2,
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
    competencias: {
      logica_matematica: 82,
      comprension_lectora: 88,
      resolucion_problemas: 81,
      trabajo_colaborativo: 90,
      expresion_oral: 86,
      pensamiento_creativo: 89,
    },
  },
  {
    id: "alum-3",
    nombre_completo: "Santiago Mendoza Silva",
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
    nombre_completo: "Camila Vargas Torres",
    grado_actual: 4,
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    competencias: {
      logica_matematica: 91,
      comprension_lectora: 89,
      resolucion_problemas: 88,
      trabajo_colaborativo: 94,
      expresion_oral: 87,
      pensamiento_creativo: 92,
    },
  },
  {
    id: "alum-5",
    nombre_completo: "Lucas Herrera Gómez",
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
    nombre_completo: "Sofía Medina Salazar",
    grado_actual: 6,
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    competencias: {
      logica_matematica: 89,
      comprension_lectora: 91,
      resolucion_problemas: 90,
      trabajo_colaborativo: 92,
      expresion_oral: 90,
      pensamiento_creativo: 91,
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

  // CIENCIA: Seres vivos, plantas y sus partes
  if (
    t.includes("planta") ||
    t.includes("seres vivos") ||
    t.includes("raíz") ||
    t.includes("raiz") ||
    t.includes("hoja")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "La raíz crece debajo de la tierra: su función principal es sostener la planta y absorber el agua y las sales minerales del suelo.",
        ejemplo_corto: "Idea clave: La raíz absorbe el agua que necesita la planta.",
        instruccion: `Al comenzar ${contextoCorto}, Mateo y Valentina preparan las macetas del salón. ¿Qué parte de la planta se encarga de absorber el agua y los nutrientes bajo la tierra?`,
        opciones: ["La raíz", "La flor", "El fruto", "La semilla"],
        respuesta_correcta: "La raíz",
        feedback_error:
          "Piensa en la parte de la planta que crece debajo de la tierra para tomar agua.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Las hojas captan la luz del sol y el aire para elaborar el alimento de la planta (fotosíntesis), mientras el tallo transporta el agua hacia ellas.",
        ejemplo_corto:
          "Idea clave: Las hojas usan la luz solar para fabricar el alimento.",
        instruccion: `Al mediodía durante ${contextoCorto}, colocamos las plantas cerca de la ventana soleada. ¿En qué parte de la planta se utiliza la luz del sol para elaborar su alimento?`,
        opciones: ["En las hojas", "En las piedras", "En la maceta", "En la cáscara"],
        respuesta_correcta: "En las hojas",
        feedback_error:
          "Recuerda qué parte verde de la planta recibe los rayos del sol para hacer la fotosíntesis.",
      };
    }
    return {
      explicacion_previa:
        "Las flores dan origen a los frutos, y dentro de los frutos se encuentran las semillas que permiten que nazcan nuevas plantas.",
      ejemplo_corto: "Idea clave: Flor → Fruto → Semilla para germinar.",
      instruccion: `Al finalizar ${contextoCorto}, el grupo quiere sembrar nuevas plantas el próximo mes. ¿Qué parte que se encuentra dentro del fruto deben guardar para germinar?`,
      opciones: ["Las semillas", "Las hojas secas", "Las ramas", "La corteza"],
      respuesta_correcta: "Las semillas",
      feedback_error:
        "Dentro del fruto están los pequeños granos que germinan cuando los sembramos en tierra húmeda.",
    };
  }

  // CIENCIA: Sistema solar, energía y ecosistemas (Nivel 3)
  if (
    t.includes("solar") ||
    t.includes("energía") ||
    t.includes("energia") ||
    t.includes("planeta") ||
    t.includes("ecosistema")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El Sol es la estrella central de nuestro sistema solar y nos brinda energía luminosa y térmica indispensable para la vida en la Tierra.",
        ejemplo_corto:
          "Idea clave: La rotación de la Tierra sobre su eje dura 24 horas y produce el día y la noche.",
        instruccion: `En la primera etapa de ${contextoCorto}, Lucas explica por qué tenemos luz por la mañana y oscuridad por la noche. ¿Qué movimiento de la Tierra dura 24 horas y origina el día y la noche?`,
        opciones: [
          "El movimiento de rotación sobre su propio eje",
          "El movimiento de traslación de 365 días",
          "El eclipse lunar de cada mes",
          "La caída de meteoritos",
        ],
        respuesta_correcta: "El movimiento de rotación sobre su propio eje",
        feedback_error:
          "Recuerda cómo se llama el giro que da la Tierra sobre sí misma cada 24 horas.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Las fuentes de energía renovables (como la energía solar y la eólica del viento) se obtienen de la naturaleza sin agotarse ni contaminar el aire.",
        ejemplo_corto:
          "Idea clave: Los paneles solares transforman la luz del Sol en electricidad limpia.",
        instruccion: `Al mediodía en ${contextoCorto}, probamos una maqueta que funciona con la luz del Sol. ¿Qué tipo de fuente de energía es la radiación solar?`,
        opciones: [
          "Energía renovable y limpia",
          "Energía fósil contaminante",
          "Combustible derivado del petróleo",
          "Energía no renovable agotable",
        ],
        respuesta_correcta: "Energía renovable y limpia",
        feedback_error:
          "La luz del Sol no se agota al usarla ni produce humo contaminante.",
      };
    }
    return {
      explicacion_previa:
        "En todo ecosistema, los organismos productores (plantas y algas) captan la energía solar para iniciar la cadena alimenticia.",
      ejemplo_corto:
        "Idea clave: Productores (plantas) → Consumidores → Descomponedores.",
      instruccion: `Para el cierre de ${contextoCorto}, armamos la pirámide de un ecosistema. ¿Qué seres vivos ocupan el primer nivel como productores porque fabrican su propio alimento con la luz solar?`,
      opciones: [
        "Las plantas y las algas",
        "Los animales carnívoros",
        "Las rocas y los minerales",
        "Las aves rapaces",
      ],
      respuesta_correcta: "Las plantas y las algas",
      feedback_error:
        "Los productores son los seres vivos capaces de realizar la fotosíntesis.",
    };
  }

  // CIENCIA: Estados del agua, ciclo hidrológico y medio ambiente
  if (
    t.includes("agua") ||
    t.includes("ambiente") ||
    t.includes("suelo") ||
    t.includes("recicl") ||
    area.includes("ciencia")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El agua en la naturaleza se presenta en tres estados físicos: líquido (ríos y lluvia), sólido (hielo y nieve) y gaseoso (vapor de agua).",
        ejemplo_corto:
          "Idea clave: Al calentarse con el Sol, el agua líquida se evapora y pasa a estado gaseoso.",
        instruccion: `Durante la mañana en ${contextoCorto}, Camila observa cómo el agua de un recipiente al sol se convierte poco a poco en vapor. ¿Cómo se llama el paso del agua de estado líquido a gaseoso?`,
        opciones: ["Evaporación", "Congelación", "Solidificación", "Fusión"],
        respuesta_correcta: "Evaporación",
        feedback_error:
          "Piensa en la palabra que viene de 'vapor' cuando el agua líquida se calienta.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Cuando el vapor de agua sube a la atmósfera y se enfría, forma pequeñas gotas que crean las nubes; a este proceso se le llama condensación.",
        ejemplo_corto:
          "Idea clave: Vapor que se enfría en el cielo → Nubes (condensación).",
        instruccion: `En la demostración del mediodía en ${contextoCorto}, explicamos cómo se forman las nubes en el cielo cuando el vapor se enfría. ¿Qué nombre recibe esa etapa del ciclo del agua?`,
        opciones: ["Condensación", "Filtración", "Combustión", "Oxidación"],
        respuesta_correcta: "Condensación",
        feedback_error:
          "Es el proceso en el que el vapor de agua se enfría y se agrupa formando las nubes.",
      };
    }
    return {
      explicacion_previa:
        "Clasificar los residuos sólidos (orgánicos, papel, plástico y vidrio) y reutilizar materiales reduce la contaminación del agua y del suelo.",
      ejemplo_corto:
        "Idea clave: Las 3R (Reducir, Reutilizar y Reciclar) protegen nuestro entorno.",
      instruccion: `Al terminar ${contextoCorto}, los equipos limpian las mesas del salón. ¿Qué acción ayuda directamente a cuidar el medio ambiente y reducir la basura?`,
      opciones: [
        "Separar botellas, papeles y restos orgánicos para reciclar",
        "Mezclar todos los desechos y arrojarlos al patio",
        "Dejar los caños de agua abiertos toda la tarde",
        "Quemar plásticos dentro de la escuela",
      ],
      respuesta_correcta:
        "Separar botellas, papeles y restos orgánicos para reciclar",
      feedback_error:
        "Recuerda cómo aplicamos las 3R clasificando los materiales reciclables.",
    };
  }

  // PERSONAL SOCIAL: Convivencia escolar, responsabilidades y ciudadanía (Nivel 2)
  if (
    t.includes("convivencia") ||
    t.includes("equipo") ||
    t.includes("responsabilidad") ||
    t.includes("derecho") ||
    t.includes("acuerdo")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Los acuerdos de convivencia son normas que construimos entre todos en el aula para tratarnos con respeto, escucharnos y aprender en armonía.",
        ejemplo_corto:
          "Idea clave: Levantar la mano y escuchar las ideas de los demás fortalece al grupo.",
        instruccion: `Al iniciar ${contextoCorto}, dos compañeros tienen ideas distintas sobre cómo armar el proyecto. ¿Cuál es la mejor manera de tomar una decisión justa en equipo?`,
        opciones: [
          "Escuchar ambas propuestas con respeto y llegar a un acuerdo",
          "Imponer una sola idea gritando más fuerte",
          "Excluir del grupo a quien piense diferente",
          "Dejar el proyecto sin hacer",
        ],
        respuesta_correcta:
          "Escuchar ambas propuestas con respeto y llegar a un acuerdo",
        feedback_error:
          "En una buena convivencia escolar siempre practicamos el diálogo y la escucha activa.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El trabajo colaborativo funciona cuando cada integrante asume una responsabilidad clara y apoya a sus compañeros para alcanzar una meta común.",
        ejemplo_corto:
          "Idea clave: Cuando nos repartimos las tareas con equidad, todos aprendemos mejor.",
        instruccion: `Al mediodía durante ${contextoCorto}, hay varias tareas por completar. ¿Cómo debe organizarse el grupo para terminar a tiempo?`,
        opciones: [
          "Distribuir las responsabilidades entre todos los integrantes y ayudarse",
          "Dejar que una sola persona haga todo el trabajo",
          "Esconder los materiales de los otros equipos",
          "Criticar sin colaborar en ninguna tarea",
        ],
        respuesta_correcta:
          "Distribuir las responsabilidades entre todos los integrantes y ayudarse",
        feedback_error:
          "El trabajo en equipo consiste en repartir las tareas de forma equitativa y solidaria.",
      };
    }
    return {
      explicacion_previa:
        "Cuidar los espacios y materiales compartidos de la escuela es una responsabilidad ciudadana que beneficia a todos los estudiantes.",
      ejemplo_corto:
        "Idea clave: Dejar el aula ordenada demuestra respeto por nuestra comunidad educativa.",
      instruccion: `Para cerrar ${contextoCorto}, ya terminamos las exposiciones del día. ¿Qué responsabilidad tenemos con el salón antes de salir?`,
      opciones: [
        "Ordenar los materiales en su lugar y dejar limpio el espacio compartido",
        "Salir corriendo dejando los libros tirados en el piso",
        "Rayar las carpetas del salón",
        "Llevarse los materiales que pertenecen al aula",
      ],
      respuesta_correcta:
        "Ordenar los materiales en su lugar y dejar limpio el espacio compartido",
      feedback_error:
        "Cuidar los bienes comunes del colegio permite que todos podamos seguir usándolos.",
    };
  }

  // PERSONAL SOCIAL: Biodiversidad, relieve y prevención de riesgos (Nivel 3 / General)
  if (
    t.includes("biodiversidad") ||
    t.includes("prevenci") ||
    t.includes("riesgo") ||
    t.includes("relieve") ||
    t.includes("regi") ||
    area.includes("social")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "La biodiversidad es la gran variedad de seres vivos (flora y fauna) y ecosistemas que existen en nuestro país gracias a sus diversos climas y relieves.",
        ejemplo_corto:
          "Idea clave: Cuidar los bosques, mares y montañas protege las especies de nuestro territorio.",
        instruccion: `En la primera parte de ${contextoCorto}, Sofía presenta un mapa sobre la riqueza natural de nuestro país. ¿Qué significa que un territorio tenga una alta biodiversidad?`,
        opciones: [
          "Que posee una gran variedad de plantas, animales y ecosistemas",
          "Que no tiene ningún árbol ni río en su territorio",
          "Que todas sus ciudades tienen exactamente el mismo clima",
          "Que solo existe una especie de planta en todo el país",
        ],
        respuesta_correcta:
          "Que posee una gran variedad de plantas, animales y ecosistemas",
        feedback_error:
          "Recuerda que 'bio' significa vida y 'diversidad' significa variedad de especies y ambientes.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "La prevención de riesgos consiste en identificar las zonas seguras, las rutas de evacuación y participar con seriedad en los simulacros escolares.",
        ejemplo_corto:
          "Idea clave: Mantener la calma y conocer las zonas seguras salva vidas ante un sismo.",
        instruccion: `Al mediodía durante ${contextoCorto}, repasamos el plan de seguridad del colegio. ¿Qué debemos hacer si ocurre un sismo mientras estamos en clase?`,
        opciones: [
          "Conservar la calma y desplazarnos en orden hacia la zona segura señalizada",
          "Correr empujando a los demás por las escaleras",
          "Quedarnos pegados a las ventanas de vidrio",
          "Ignorar las señales de evacuación",
        ],
        respuesta_correcta:
          "Conservar la calma y desplazarnos en orden hacia la zona segura señalizada",
        feedback_error:
          "En una emergencia siempre caminamos con calma siguiendo las flechas hacia el punto de reunión seguro.",
      };
    }
    return {
      explicacion_previa:
        "Una mochila de emergencia escolar o familiar debe contener agua potable, botiquín de primeros auxilios, linterna y alimentos no perecibles.",
      ejemplo_corto:
        "Idea clave: El botiquín, el agua y la linterna son esenciales en una emergencia.",
      instruccion: `Para concluir ${contextoCorto}, el salón revisa la mochila de emergencia del aula. ¿Qué elementos son indispensables dentro de ella?`,
      opciones: [
        "Agua embotellada, botiquín de primeros auxilios y linterna",
        "Videojuegos pesados y adornos de vidrio frágil",
        "Helados y comidas que necesitan refrigeradora",
        "Únicamente hojas en blanco",
      ],
      respuesta_correcta:
        "Agua embotellada, botiquín de primeros auxilios y linterna",
      feedback_error:
        "Piensa en los artículos que nos ayudan a hidratarnos, curar heridas e iluminar si se corta la luz.",
    };
  }

  // COMUNICACIÓN: Lectura, personajes e idea principal
  if (
    area.includes("comunicaci") ||
    t.includes("cuento") ||
    t.includes("relato") ||
    t.includes("texto") ||
    t.includes("lectura")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "En toda narración, los personajes principales son quienes realizan las acciones más importantes desde el inicio de la historia.",
        ejemplo_corto: "Idea clave: ¿Quiénes protagonizan el inicio del cuento?",
        instruccion: `Según lo que leímos en el Capítulo 1 sobre ${contextoCorto}, ¿para qué se reunieron temprano Mateo, Valentina y Lucas en el salón?`,
        opciones: [
          "Para organizar los materiales e iniciar juntos la actividad escolar",
          "Porque habían suspendido las clases toda la semana",
          "Para irse de vacaciones a otro país",
          "Porque habían olvidado que hoy tenían escuela",
        ],
        respuesta_correcta:
          "Para organizar los materiales e iniciar juntos la actividad escolar",
        feedback_error:
          "Vuelve a leer el inicio del capítulo: llegaron temprano para preparar la primera parte del proyecto.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Los conectores de secuencia (como 'primero', 'luego al mediodía', 'finalmente') nos ayudan a ordenar los hechos del relato en el tiempo.",
        ejemplo_corto:
          "Idea clave: Inicio (mañana) → Desarrollo (mediodía) → Desenlace (tarde).",
        instruccion: `En este segundo capítulo de ${contextoCorto}, ¿qué hicieron los estudiantes después de dejar todo organizado por la mañana?`,
        opciones: [
          "Pusieron en marcha la etapa central del proyecto al mediodía",
          "Guardaron todo y se fueron a dormir",
          "Dejaron el salón vacío sin hacer nada",
          "Rompieron los carteles que habían preparado",
        ],
        respuesta_correcta:
          "Pusieron en marcha la etapa central del proyecto al mediodía",
        feedback_error:
          "Observa cómo avanza la historia cuando llega el mediodía.",
      };
    }
    return {
      explicacion_previa:
        "La idea principal o enseñanza de un cuento resume el mensaje más importante que aprendieron los personajes al resolver el reto.",
      ejemplo_corto:
        "Idea clave: Colaborando entre todos logramos nuestras metas.",
      instruccion: `Al llegar al desenlace de ${contextoCorto}, ¿cuál es la enseñanza principal que nos deja la historia de hoy?`,
      opciones: [
        "Que al colaborar y aportar lo que cada nivel aprende, todo el salón sale adelante",
        "Que es mejor no compartir ideas con ningún compañero",
        "Que solo un grado puede participar en la escuela",
        "Que no sirve preparar los proyectos con orden",
      ],
      respuesta_correcta:
        "Que al colaborar y aportar lo que cada nivel aprende, todo el salón sale adelante",
      feedback_error:
        "Piensa en cómo lograron completar la actividad sumando el esfuerzo de los tres niveles.",
    };
  }

  // MATEMÁTICA: Perímetro y multiplicación (Nivel 2)
  if (
    t.includes("perímetro") ||
    t.includes("perimetro") ||
    t.includes("multiplic") ||
    t.includes("fila") ||
    t.includes("reparto")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Cuando ordenamos elementos en filas con la misma cantidad en cada una, multiplicamos el número de filas por los elementos de cada fila.",
        ejemplo_corto: "Ejemplo: 4 mesas × 6 libros en cada mesa = 24 libros.",
        instruccion: `Para iniciar ${contextoCorto}, Santiago organizó 5 mesas de exhibición con 8 proyectos en cada mesa. ¿Cuántos proyectos colocó en total?`,
        opciones: ["32", "36", "40", "45"],
        respuesta_correcta: "40",
        feedback_error: "Multiplica 5 mesas por 8 proyectos en cada una: 5 × 8.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El perímetro de un rectángulo es la suma de todos sus lados: dos veces el largo más dos veces el ancho.",
        ejemplo_corto:
          "Ejemplo: Un cartel de 6 m de largo y 4 m de ancho tiene perímetro 6 + 6 + 4 + 4 = 20 m.",
        instruccion: `Al mediodía en ${contextoCorto}, decoramos con cinta el borde de un panel rectangular que mide 10 metros de largo y 5 metros de ancho. ¿Cuántos metros mide todo su perímetro?`,
        opciones: ["20", "25", "30", "35"],
        respuesta_correcta: "30",
        feedback_error:
          "Suma los dos largos (10 + 10 = 20) más los dos anchos (5 + 5 = 10).",
      };
    }
    return {
      explicacion_previa:
        "Repartir una cantidad en partes iguales entre varios equipos consiste en dividir el total entre el número de equipos.",
      ejemplo_corto: "Ejemplo: 36 fichas entre 6 equipos → 36 ÷ 6 = 6 fichas.",
      instruccion: `Para cerrar ${contextoCorto}, repartimos 54 medallas en partes iguales entre 6 equipos participantes. ¿Cuántas medallas recibe cada equipo?`,
      opciones: ["7", "8", "9", "10"],
      respuesta_correcta: "9",
      feedback_error:
        "Busca qué número multiplicado por 6 da exactamente 54.",
    };
  }

  // MATEMÁTICA: Fracciones, porcentajes y áreas (Nivel 3)
  if (
    t.includes("fracci") ||
    t.includes("porcentaje") ||
    t.includes("área") ||
    t.includes("area")
  ) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Para hallar una fracción de una cantidad total (como 2/3), dividimos el total entre el denominador y multiplicamos el resultado por el numerador.",
        ejemplo_corto: "Ejemplo: 2/3 de 30 → (30 ÷ 3 = 10) × 2 = 20.",
        instruccion: `Al comenzar ${contextoCorto}, el salón preparó 60 invitaciones y ya entregó las dos terceras partes (2/3). ¿Cuántas invitaciones ya se entregaron?`,
        opciones: ["20", "30", "40", "45"],
        respuesta_correcta: "40",
        feedback_error:
          "Divide 60 entre 3 (= 20) y multiplica ese resultado por 2.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El área de una superficie rectangular se calcula multiplicando la medida de su base (largo) por su altura (ancho).",
        ejemplo_corto: "Ejemplo: Base 8 m × Ancho 5 m = 40 m².",
        instruccion: `Al mediodía en ${contextoCorto}, habilitamos un espacio rectangular en el patio de 9 metros de largo por 6 metros de ancho. ¿Cuál es su área en metros cuadrados (m²)?`,
        opciones: ["45", "54", "60", "63"],
        respuesta_correcta: "54",
        feedback_error: "Multiplica el largo por el ancho: 9 × 6.",
      };
    }
    return {
      explicacion_previa:
        "Para calcular las tres quintas partes (3/5) de un total, dividimos el total entre 5 y multiplicamos por 3.",
      ejemplo_corto: "Ejemplo: 3/5 de 50 → (50 ÷ 5 = 10) × 3 = 30.",
      instruccion: `En el cierre de ${contextoCorto}, de los 100 asistentes registrados, las tres quintas partes (3/5) participaron en los talleres prácticos. ¿Cuántas personas participaron?`,
      opciones: ["40", "50", "60", "75"],
      respuesta_correcta: "60",
      feedback_error: "Divide 100 entre 5 (= 20) y multiplícalo por 3.",
    };
  }

  // MATEMÁTICA: Sumas y restas de dos cifras (Nivel 1)
  if (capitulo === 1) {
    return {
      explicacion_previa:
        "Para sumar dos números de dos cifras, agrupamos primero las decenas (grupos de 10) y luego sumamos las unidades sueltas.",
      ejemplo_corto: "Ejemplo: 14 + 13 → (10 + 10 = 20) y (4 + 3 = 7) → 27.",
      instruccion: `Al comenzar ${contextoCorto}, Mateo colocó 15 cartulinas en la mesa y Valentina trajo 14 más. ¿Cuántas cartulinas reunieron en total?`,
      opciones: ["25", "27", "29", "31"],
      respuesta_correcta: "29",
      feedback_error:
        "Suma primero las decenas (10 + 10 = 20) y luego las unidades (5 + 4 = 9).",
    };
  }
  if (capitulo === 2) {
    return {
      explicacion_previa:
        "Para saber cuántos elementos quedan después de utilizar una parte, restamos las decenas con las decenas y las unidades con las unidades.",
      ejemplo_corto: "Ejemplo: 38 - 14 → (30 - 10 = 20) y (8 - 4 = 4) → 24.",
      instruccion: `Al mediodía en ${contextoCorto}, teníamos 36 plumones en la caja y repartimos 14 para pintar los carteles. ¿Cuántos plumones quedaron en la caja?`,
      opciones: ["20", "22", "24", "26"],
      respuesta_correcta: "22",
      feedback_error: "Resta 30 menos 10 (= 20) y 6 menos 4 (= 2).",
    };
  }
  return {
    explicacion_previa:
      "Cuando las unidades sueltas suman 10 o más, formamos una nueva decena completa.",
    ejemplo_corto: "Ejemplo: 18 + 15 → (18 + 2 = 20) + 13 = 33.",
    instruccion: `Al terminar ${contextoCorto}, juntamos 18 estrellas doradas del primer grupo con 17 del segundo grupo. ¿Cuántas estrellas reunimos en total?`,
    opciones: ["31", "33", "35", "37"],
    respuesta_correcta: "35",
    feedback_error:
      "Suma 10 + 10 = 20, y luego suma las unidades 8 + 7 = 15 (20 + 15 = 35).",
  };
}

export function construirMisionMultinivelContextual(
  _temaGeneral: string,
  contextoComunidad: string,
  selecciones?: SeleccionNivelTema[]
): MisionYuyAI {
  const escenario =
    contextoComunidad.trim() ||
    "La feria de ciencias y experimentos de nuestra escuela";
  const escenarioMinuscula =
    escenario.charAt(0).toLowerCase() + escenario.slice(1);

  const nivelesUsados: SeleccionNivelTema[] =
    selecciones && selecciones.length > 0
      ? selecciones
      : [
          {
            nivel_codigo: "nivel_1",
            nivel_nombre: "Nivel 1 · Ciclo III",
            tema_titulo: "Los seres vivos, las plantas y sus partes",
            area_curricular: "Ciencia y Tecnología",
          },
          {
            nivel_codigo: "nivel_2",
            nivel_nombre: "Nivel 2 · Ciclo IV",
            tema_titulo:
              "Multiplicación por grupos iguales y cálculo de perímetros",
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_3",
            nivel_nombre: "Nivel 3 · Ciclo V",
            tema_titulo:
              "El sistema solar, las fuentes de energía y los ecosistemas",
            area_curricular: "Ciencia y Tecnología",
          },
        ];

  const armarRetosCapitulo = (capitulo: 1 | 2 | 3): RetoGrado[] =>
    nivelesUsados.map((sel, idx) => {
      const prog = generarProgresionPorTemaYCapitulo(
        sel.tema_titulo,
        sel.area_curricular || "Ciencia y Tecnología",
        capitulo,
        escenarioMinuscula
      );
      return {
        grado: idx + 1,
        nivel_codigo: sel.nivel_codigo,
        nivel_nombre: sel.nivel_nombre,
        tema_curricular: sel.tema_titulo,
        area_curricular: sel.area_curricular || "Ciencia y Tecnología",
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
    prompt_sdxl_base: `Modern colorful children storybook illustration of friendly primary school students Mateo, Valentina and Lucas working together on ${escenario}, bright cheerful school setting, Pixar and Ghibli style`,
    fases: [
      {
        numero_fase: 1,
        titulo_fase: "Capítulo 1: Preparando el Proyecto por la Mañana",
        prompt_sdxl: `Modern colorful children storybook illustration of primary school kids arriving in the morning to organize ${escenario} in a bright classroom, books, science models and plants, warm morning light`,
        narrativa_fase: `Por la mañana, Mateo, Valentina y Lucas llegaron entusiasmados al salón junto a su profesor para organizar ${escenarioMinuscula}. Antes de abrir las mesas de trabajo, cada nivel revisó su tema del día para preparar la primera parte en equipo.`,
        explicacion_general:
          "En este primer capítulo repasamos las ideas base del tema de cada nivel.",
        retos_grados: armarRetosCapitulo(1),
      },
      {
        numero_fase: 2,
        titulo_fase: "Capítulo 2: Demostración en Equipo al Mediodía",
        prompt_sdxl: `Modern colorful children storybook illustration of the same primary school kids at midday presenting experiments and posters during ${escenario}, bright school courtyard, teamwork`,
        narrativa_fase: `Con todas las mesas listas tras el trabajo de la mañana en el Capítulo 1, al llegar el mediodía comenzaron las demostraciones prácticas de ${escenarioMinuscula}. Ahora Mateo, Valentina y Lucas deben resolver el segundo paso de cada nivel para que toda la clase avance.`,
        explicacion_general:
          "En el segundo capítulo aplicamos lo aprendido a la actividad central del mediodía.",
        retos_grados: armarRetosCapitulo(2),
      },
      {
        numero_fase: 3,
        titulo_fase: "Capítulo 3: Gran Cierre por la Tarde",
        prompt_sdxl: `Modern colorful children storybook illustration of happy primary school students celebrating the successful completion of ${escenario} in the afternoon with their teacher and classmates`,
        narrativa_fase: `Al llegar la tarde, después de superar con éxito las pruebas del mediodía, Mateo, Valentina y Lucas se reúnen con todo el salón para presentar las conclusiones finales y cerrar ${escenarioMinuscula}.`,
        explicacion_general:
          "En el capítulo final completamos la última actividad de cada nivel.",
        retos_grados: armarRetosCapitulo(3),
      },
    ],
    narrativa_victoria: `¡Felicitaciones a todo el salón! Desde la organización de la mañana hasta la presentación de la tarde, los tres niveles resolvieron sus temas y completaron con éxito ${escenarioMinuscula}.`,
    prompt_sdxl_victoria: `Modern colorful children storybook illustration of happy primary school students celebrating together in their classroom after completing ${escenario}`,
    imagen_base_url: "/fallbacks/andes-bg.svg",
    imagen_victoria_url: "/fallbacks/andes-victory.svg",
  };
}

export const MISION_PUENTE_INCA: MisionYuyAI = construirMisionMultinivelContextual(
  "Ciencia, Matemática y Comprensión",
  "La feria de ciencias y experimentos de nuestra escuela"
);

export const MISION_INICIAL_DEMO = MISION_PUENTE_INCA;
