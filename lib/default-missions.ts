import {
  AlumnoRow,
  MisionYuyAI,
  NivelAulaRow,
  RetoGrado,
  TemaCurricularRow,
} from "./types";

export const FRASES_CARGA_PEDAGOGICAS = [
  "Preparando el relato y las actividades de la sesión...",
  "Organizando la explicación práctica para cada nivel...",
  "Ilustrando el escenario del cuento para el aula...",
  "Armando los ejemplos y ejercicios de cada grupo...",
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
  return candidatas.slice(0, 4).sort((a, b) => Number(a) - Number(b));
}

export const NIVELES_INICIALES: NivelAulaRow[] = [
  {
    id: "niv-1",
    codigo: "nivel_1",
    nombre: "Nivel 1 · Ciclo III",
    descripcion: "1.° y 2.° grado: Conteo, decenas, sumas y restas",
    color_hex: "#238564",
    orden: 1,
    activo: true,
  },
  {
    id: "niv-2",
    codigo: "nivel_2",
    nombre: "Nivel 2 · Ciclo IV",
    descripcion: "3.° y 4.° grado: Multiplicación, división y medidas",
    color_hex: "#2B6CB0",
    orden: 2,
    activo: true,
  },
  {
    id: "niv-3",
    codigo: "nivel_3",
    nombre: "Nivel 3 · Ciclo V",
    descripcion: "5.° y 6.° grado: Fracciones, proporciones y promedios",
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
      "Agrupa cantidades en decenas y unidades para resolver adiciones y sustracciones.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-2",
    nivel_codigo: "nivel_1",
    nivel_nombre: "Nivel 1 · Ciclo III",
    area_curricular: "Matemática",
    titulo_tema: "Medición de longitudes con pasos y objetos",
    competencia_minedu: "Resuelve problemas de forma, movimiento y localización",
    desempeno_esperado:
      "Compara y mide distancias cotidianas usando unidades sencillas.",
    estado: "pendiente",
    orden: 2,
  },
  {
    id: "tem-3",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    area_curricular: "Matemática",
    titulo_tema: "Multiplicación por filas y reparto en partes iguales",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Resuelve problemas multiplicativos organizando elementos en filas y columnas.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-4",
    nivel_codigo: "nivel_2",
    nivel_nombre: "Nivel 2 · Ciclo IV",
    area_curricular: "Ciencia y Tecnología",
    titulo_tema: "El recorrido del agua y el cuidado de los cultivos",
    competencia_minedu:
      "Explica el mundo físico basándose en conocimientos sobre los seres vivos",
    desempeno_esperado:
      "Comprende cómo se distribuye el agua en las chacras y su importancia.",
    estado: "pendiente",
    orden: 2,
  },
  {
    id: "tem-5",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    area_curricular: "Matemática",
    titulo_tema: "Fracciones de un total y reparto proporcional",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Calcula la fracción de una cantidad total en situaciones cotidianas.",
    estado: "en_curso",
    orden: 1,
  },
  {
    id: "tem-6",
    nivel_codigo: "nivel_3",
    nivel_nombre: "Nivel 3 · Ciclo V",
    area_curricular: "Matemática",
    titulo_tema: "Cálculo de promedios y tablas de cosecha",
    competencia_minedu: "Resuelve problemas de gestión de datos e incertidumbre",
    desempeno_esperado:
      "Encuentra el valor promedio de un conjunto de datos de producción.",
    estado: "pendiente",
    orden: 2,
  },
];

export const MISION_PUENTE_INCA: MisionYuyAI = {
  id: "default-qeswachaka",
  titulo_mision: "El Puente Colgante de Q'eswachaka",
  prompt_sdxl_base:
    "Warm children storybook illustration of an ancient Incan rope bridge over a turquoise Andean river canyon at sunrise, golden sunlight, green terraces, Studio Ghibli style",
  fases: [
    {
      numero_fase: 1,
      titulo_fase: "Reuniendo las Cuerdas de Ichu",
      prompt_sdxl:
        "Warm children storybook illustration of Andean villagers and school children weaving golden ichu grass ropes by a mountain river canyon at sunrise, vibrant colors",
      narrativa_fase:
        "Cada año, las familias se reúnen junto al río Apurímac para renovar el puente de fibra vegetal. Antes de empezar a tejer, los tres niveles del aula revisarán cómo calcular los materiales que trajo cada familia.",
      explicacion_general:
        "En esta primera parte aprenderemos a juntar cantidades grandes: Nivel 1 sumará separando decenas y unidades; Nivel 2 usará la multiplicación para grupos iguales; y Nivel 3 calculará una fracción del largo total del puente.",
      retos_grados: [
        {
          grado: 1,
          nivel_codigo: "nivel_1",
          nivel_nombre: "Nivel 1 · Ciclo III",
          tema_curricular: "Sumas agrupando decenas y unidades",
          area_curricular: "Matemática",
          explicacion_previa:
            "Para sumar dos números de dos cifras sin confundirnos, primero sumamos las decenas (grupos de 10) y luego sumamos las unidades sueltas.",
          ejemplo_corto: "Ejemplo: 14 + 13 → (10 + 10 = 20) y (4 + 3 = 7) → 20 + 7 = 27.",
          instruccion:
            "La familia Quispe trajo 15 cuerdas largas y la familia Mamani trajo 12 cuerdas cortas. ¿Cuántas cuerdas reunimos en total?",
          tipo_mecanica: "input_numerico",
          opciones: ["22", "25", "27", "31"],
          respuesta_correcta: "27",
          feedback_error:
            "Suma primero las decenas: 10 más 10 son 20. Luego suma las unidades: 5 más 2 son 7.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV",
          tema_curricular: "Multiplicación por filas y reparto en partes iguales",
          area_curricular: "Matemática",
          explicacion_previa:
            "Cuando varios objetos tienen exactamente la misma cantidad de elementos, multiplicamos el número de grupos por la cantidad en cada grupo.",
          ejemplo_corto: "Ejemplo: 5 vigas con 4 nudos cada una → 5 × 4 = 20 nudos.",
          instruccion:
            "Para asegurar la base necesitamos 4 nudos firmes en cada una de las 8 vigas de piedra. ¿Cuántos nudos debemos atar en total?",
          tipo_mecanica: "input_numerico",
          opciones: ["24", "28", "32", "36"],
          respuesta_correcta: "32",
          feedback_error:
            "Recuerda la tabla del 4: multiplica 4 nudos por las 8 vigas de piedra.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V",
          tema_curricular: "Fracciones de un total y reparto proporcional",
          area_curricular: "Matemática",
          explicacion_previa:
            "Para hallar una fracción de un número total, primero dividimos el total entre el denominador (abajo) y luego multiplicamos por el numerador (arriba).",
          ejemplo_corto: "Ejemplo: 2/3 de 30 m → (30 ÷ 3 = 10) y luego (10 × 2 = 20 m).",
          instruccion:
            "El puente mide 60 metros de largo y ya hemos tejido las dos terceras partes (2/3). ¿Cuántos metros ya están tejidos?",
          tipo_mecanica: "input_numerico",
          opciones: ["20", "30", "40", "45"],
          respuesta_correcta: "40",
          feedback_error:
            "Divide primero 60 entre 3 para hallar un tercio (20 m), y luego multiplícalo por 2.",
        },
      ],
    },
    {
      numero_fase: 2,
      titulo_fase: "El Paso de las Canastas hacia la Feria",
      prompt_sdxl:
        "Warm children storybook illustration of friendly llamas carrying colorful woven baskets of potatoes and corn across an Incan rope bridge over a bright river canyon",
      narrativa_fase:
        "Con la base firme, comienzan a cruzar los alimentos cosechados hacia la escuela. Ahora aplicaremos restas, multiplicaciones y cuartos para organizar la carga.",
      explicacion_general:
        "En esta segunda etapa veremos qué ocurre cuando una parte de la carga ya cruzó el puente: Nivel 1 practicará la resta por decenas; Nivel 2 calculará la carga total en grupos iguales; y Nivel 3 restará una cuarta parte (1/4) del total.",
      retos_grados: [
        {
          grado: 1,
          nivel_codigo: "nivel_1",
          nivel_nombre: "Nivel 1 · Ciclo III",
          tema_curricular: "Sumas agrupando decenas y unidades",
          area_curricular: "Matemática",
          explicacion_previa:
            "Para saber cuántos objetos faltan pasar, restamos las decenas con las decenas y las unidades con las unidades.",
          ejemplo_corto: "Ejemplo: 35 - 12 → (30 - 10 = 20) y (5 - 2 = 3) → 23.",
          instruccion:
            "En la orilla había 38 sacos de papa y ya cruzaron 14 sacos. ¿Cuántos sacos faltan cruzar?",
          tipo_mecanica: "input_numerico",
          opciones: ["20", "22", "24", "28"],
          respuesta_correcta: "24",
          feedback_error:
            "Resta primero las decenas: 30 menos 10 es 20. Luego resta las unidades: 8 menos 4 es 4.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV",
          tema_curricular: "Multiplicación por filas y reparto en partes iguales",
          area_curricular: "Matemática",
          explicacion_previa:
            "Si cada animal de carga lleva el mismo número de canastas, multiplicamos la cantidad de llamas por las canastas que lleva cada una.",
          ejemplo_corto: "Ejemplo: 5 llamas × 6 canastas = 30 canastas.",
          instruccion:
            "Si 6 llamas cargan 7 canastas de quinua cada una para la escuela, ¿cuántas canastas cruzarán el puente?",
          tipo_mecanica: "input_numerico",
          opciones: ["36", "40", "42", "48"],
          respuesta_correcta: "42",
          feedback_error:
            "Piensa en 6 grupos de 7: si 6 × 6 es 36, súmale 6 más.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V",
          tema_curricular: "Fracciones de un total y reparto proporcional",
          area_curricular: "Matemática",
          explicacion_previa:
            "Hallar la cuarta parte (1/4) significa dividir entre 4. Si separamos esa cuarta parte, restamos ese valor al total inicial para saber cuánto queda.",
          ejemplo_corto: "Ejemplo: De 80 kg separamos 1/4 (80 ÷ 4 = 20 kg) → Quedan 80 - 20 = 60 kg.",
          instruccion:
            "Reunimos 120 kilos de maíz morado y separamos la cuarta parte (1/4) para el comedor escolar. ¿Cuántos kilos quedan para la feria?",
          tipo_mecanica: "input_numerico",
          opciones: ["60", "80", "90", "100"],
          respuesta_correcta: "90",
          feedback_error:
            "Divide 120 entre 4 para obtener la cuarta parte (30 kg), y luego réstala de los 120 kg iniciales.",
        },
      ],
    },
    {
      numero_fase: 3,
      titulo_fase: "Terminando las Barandas Protectoras",
      prompt_sdxl:
        "Warm children storybook illustration of a completed Incan rope bridge decorated with festive colorful Andean flags and flowers, children celebrating under a sunny sky",
      narrativa_fase:
        "Para cerrar la jornada, colocamos las barandas laterales y comparamos lo que tejió cada grupo.",
      explicacion_general:
        "En el cierre de la clase: Nivel 1 sumará completando decenas; Nivel 2 hará un reparto exacto con división; y Nivel 3 hallará el promedio sumando los datos y dividiendo entre la cantidad de grupos.",
      retos_grados: [
        {
          grado: 1,
          nivel_codigo: "nivel_1",
          nivel_nombre: "Nivel 1 · Ciclo III",
          tema_curricular: "Sumas agrupando decenas y unidades",
          area_curricular: "Matemática",
          explicacion_previa:
            "Cuando las unidades suman más de 10, formamos una nueva decena completa.",
          ejemplo_corto: "Ejemplo: 18 + 14 → 18 + 2 es 20, más los 12 restantes = 32.",
          instruccion:
            "Colocamos 19 banderines rojos a la izquierda y 16 banderines dorados a la derecha. ¿Cuántos banderines hay en total?",
          tipo_mecanica: "input_numerico",
          opciones: ["31", "33", "35", "39"],
          respuesta_correcta: "35",
          feedback_error:
            "Pásale 1 unidad al 19 para formar 20, y súmale los 15 que quedan.",
        },
        {
          grado: 2,
          nivel_codigo: "nivel_2",
          nivel_nombre: "Nivel 2 · Ciclo IV",
          tema_curricular: "Multiplicación por filas y reparto en partes iguales",
          area_curricular: "Matemática",
          explicacion_previa:
            "Repartir en partes iguales es dividir el total entre el número de partes buscando en la tabla de multiplicar.",
          ejemplo_corto: "Ejemplo: 40 metros entre 5 tramos → 40 ÷ 5 = 8 metros.",
          instruccion:
            "Tenemos 45 metros de soga fina para repartir en partes iguales entre 5 tramos del barandal. ¿Cuántos metros mide cada tramo?",
          tipo_mecanica: "input_numerico",
          opciones: ["7", "8", "9", "11"],
          respuesta_correcta: "9",
          feedback_error:
            "Busca en la tabla del 5 qué número multiplicado por 5 da 45.",
        },
        {
          grado: 3,
          nivel_codigo: "nivel_3",
          nivel_nombre: "Nivel 3 · Ciclo V",
          tema_curricular: "Cálculo de promedios y tablas de cosecha",
          area_curricular: "Matemática",
          explicacion_previa:
            "El promedio de varios valores se calcula sumando todas las cantidades y dividiendo el resultado entre el número de datos.",
          ejemplo_corto: "Ejemplo: Promedio de 10, 20 y 30 → (10 + 20 + 30) ÷ 3 = 60 ÷ 3 = 20.",
          instruccion:
            "Tres grupos tejieron 24, 30 y 36 metros de barandal respectivamente. ¿Cuál fue el promedio de metros tejidos por grupo?",
          tipo_mecanica: "input_numerico",
          opciones: ["26", "28", "30", "34"],
          respuesta_correcta: "30",
          feedback_error:
            "Suma 24 + 30 + 36 para obtener 90 metros, y divide 90 entre los 3 grupos.",
        },
      ],
    },
  ],
  narrativa_victoria:
    "¡Excelente trabajo! Los tres niveles del aula comprendieron los temas de hoy y resolvieron juntos todas las etapas de la historia.",
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

export function construirMisionMultinivelContextual(
  temaGeneral: string,
  contextoComunidad: string,
  selecciones?: SeleccionNivelTema[]
): MisionYuyAI {
  const limpio = temaGeneral.trim() || "Saberes de la Cosecha";
  const lugar = contextoComunidad.trim() || "la comunidad";

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
            tema_titulo: "Multiplicación por filas y reparto en partes iguales",
            area_curricular: "Matemática",
          },
          {
            nivel_codigo: "nivel_3",
            nivel_nombre: "Nivel 3 · Ciclo V",
            tema_titulo: "Fracciones de un total y reparto proporcional",
            area_curricular: "Matemática",
          },
        ];

  const baseMision = MISION_PUENTE_INCA;
  return {
    ...baseMision,
    titulo_mision: `Historia en ${lugar}`,
    fases: baseMision.fases.map((f) => ({
      ...f,
      retos_grados: nivelesUsados.map((sel, idx) => {
        const rb = f.retos_grados[idx % f.retos_grados.length];
        return {
          ...rb,
          nivel_codigo: sel.nivel_codigo,
          nivel_nombre: sel.nivel_nombre,
          tema_curricular: sel.tema_titulo,
        };
      }),
    })),
  };
}
