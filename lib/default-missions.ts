import {
  AlumnoRow,
  MisionYuyAI,
  NivelAulaRow,
  RetoGrado,
  TemaCurricularRow,
} from "./types";

export const FRASES_CARGA_PEDAGOGICAS = [
  "Escribiendo los 3 capítulos conectados de la historia...",
  "Adaptando la explicación teórica y ejemplos al tema de cada nivel...",
  "Ilustrando el escenario del Capítulo 1 para el salón...",
  "Verificando las preguntas y respuestas de los 3 niveles...",
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
    descripcion: "3.° y 4.° grado: Multiplicación, división y perímetros",
    color_hex: "#2B6CB0",
    orden: 2,
    activo: true,
  },
  {
    id: "niv-3",
    codigo: "nivel_3",
    nombre: "Nivel 3 · Ciclo V",
    descripcion: "5.° y 6.° grado: Fracciones, áreas y promedios",
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
    area_curricular: "Matemática",
    titulo_tema: "Restas sencillas quitando decenas y unidades",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Calcula cuántos elementos quedan después de separar una parte del grupo.",
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
    area_curricular: "Matemática",
    titulo_tema: "Reparto equitativo con división exacta",
    competencia_minedu: "Resuelve problemas de cantidad",
    desempeno_esperado:
      "Divide una cantidad total en partes iguales sin que sobre ningún elemento.",
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
    area_curricular: "Matemática",
    titulo_tema: "Cálculo de promedios y áreas rectangulares",
    competencia_minedu: "Resuelve problemas de gestión de datos",
    desempeno_esperado:
      "Halla el promedio de varios registros y el área de terrenos rectangulares.",
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
  respuesta_correcta: string;
  feedback_error: string;
}

/**
 * Genera teoría, ejemplo y pregunta progresiva para el Capítulo 1, 2 y 3
 * adaptados tanto al tema curricular exacto del nivel como a la historia continua.
 */
function generarProgresionPorTemaYCapitulo(
  temaTitulo: string,
  capitulo: 1 | 2 | 3,
  contextoCorto: string
): ContenidoTemaPorCapitulo {
  const t = temaTitulo.toLowerCase();

  // Caso 1: Figuras geométricas, lados y vértices
  if (t.includes("lado") || t.includes("figura") || t.includes("vertice") || t.includes("vértice")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Cada figura geométrica tiene un número exacto de lados rectos: el triángulo tiene 3 lados y el cuadrado o rectángulo tiene 4 lados.",
        ejemplo_corto: "Ejemplo: 2 mesas cuadradas tienen 4 + 4 = 8 lados en total.",
        instruccion: `Al iniciar ${contextoCorto}, Illari dibujó 3 carteles rectangulares para señalizar el camino. Si cada rectángulo tiene 4 lados, ¿cuántos lados dibujó en total?`,
        respuesta_correcta: "12",
        feedback_error: "Suma 4 lados por cada uno de los 3 rectángulos: 4 + 4 + 4.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Los vértices son las esquinas donde se unen dos lados de una figura. Un triángulo tiene 3 esquinas y un cuadrado tiene 4 esquinas.",
        ejemplo_corto: "Ejemplo: 1 cuadrado (4 esquinas) + 1 triángulo (3 esquinas) = 7 esquinas.",
        instruccion: `Ya con los carteles listos en ${contextoCorto}, Amaru armó 2 marcos cuadrados de madera y 1 banderín triangular. ¿Cuántas esquinas (vértices) hay sumando las 3 figuras?`,
        respuesta_correcta: "11",
        feedback_error: "Suma las 4 esquinas del primer cuadrado + 4 del segundo cuadrado + 3 del triángulo.",
      };
    }
    return {
      explicacion_previa:
        "Para saber cuántos listones necesitamos al juntar varias figuras, sumamos los lados de todas las figuras construidas.",
      ejemplo_corto: "Ejemplo: 3 triángulos (3 + 3 + 3 = 9 lados) + 1 cuadrado (4 lados) = 13 lados.",
      instruccion: `Para terminar ${contextoCorto}, colocamos 4 ventanas cuadradas iguales. ¿Cuántos lados de madera contamos entre las 4 ventanas?`,
      respuesta_correcta: "16",
      feedback_error: "Cada ventana cuadrada tiene 4 lados. Suma 4 + 4 + 4 + 4.",
    };
  }

  // Caso 2: Medición con pasos, palmos o longitudes
  if (t.includes("paso") || t.includes("longitud") || t.includes("palmo") || t.includes("medici")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Podemos medir distancias largas contando cuántos pasos damos desde el inicio hasta el final y sumando los tramos.",
        ejemplo_corto: "Ejemplo: 12 pasos hasta el árbol + 10 pasos hasta la puerta = 22 pasos.",
        instruccion: `Al comenzar ${contextoCorto}, Illari caminó 15 pasos desde la entrada hasta la mesa y luego 12 pasos más hasta el almacén. ¿Cuántos pasos dio en total?`,
        respuesta_correcta: "27",
        feedback_error: "Suma primero las decenas (10 + 10 = 20) y luego las unidades (5 + 2 = 7).",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Para comparar dos caminos o saber cuánto falta caminar, restamos la distancia ya recorrida a la distancia total.",
        ejemplo_corto: "Ejemplo: Si el camino mide 36 pasos y ya dimos 14 pasos → 36 - 14 = 22 pasos.",
        instruccion: `Continuando con ${contextoCorto}, el sendero principal mide 38 pasos de largo. Si Amaru ya avanzó 15 pasos llevando las herramientas, ¿cuántos pasos le faltan?`,
        respuesta_correcta: "23",
        feedback_error: "Resta las decenas (30 - 10 = 20) y las unidades (8 - 5 = 3).",
      };
    }
    return {
      explicacion_previa:
        "Cuando medimos el borde de una mesa con palmos (cuartas de la mano), sumamos los palmos del largo y del ancho.",
      ejemplo_corto: "Ejemplo: 18 palmos en la primera mesa + 16 palmos en la segunda = 34 palmos.",
      instruccion: `Para cerrar ${contextoCorto}, medimos dos cuerdas: la primera mide 24 palmos y la segunda mide 15 palmos. ¿Cuántos palmos miden las dos cuerdas juntas?`,
      respuesta_correcta: "39",
      feedback_error: "Suma 20 + 10 = 30, y luego 4 + 5 = 9.",
    };
  }

  // Caso 3: Perímetro de parcelas rectangulares y cuadradas
  if (t.includes("perímetro") || t.includes("perimetro")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El perímetro de un cuadrado es la suma de sus 4 lados iguales (o multiplicar la medida de un lado por 4).",
        ejemplo_corto: "Ejemplo: Un cuadrado de 6 m de lado tiene perímetro 6 × 4 = 24 m.",
        instruccion: `En la primera parte de ${contextoCorto}, delimitamos un terreno cuadrado donde cada lado mide 8 metros. ¿Cuántos metros mide todo su perímetro?`,
        respuesta_correcta: "32",
        feedback_error: "Suma los 4 lados iguales de 8 metros: 8 × 4.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El perímetro de un rectángulo se calcula sumando sus dos largos más sus dos anchos: (2 × largo) + (2 × ancho).",
        ejemplo_corto: "Ejemplo: Largo 10 m y ancho 4 m → 10 + 10 + 4 + 4 = 28 m.",
        instruccion: `Avanzando con ${contextoCorto}, ahora cercaremos una zona rectangular que mide 12 metros de largo y 6 metros de ancho. ¿Cuántos metros de malla necesitamos para todo el borde?`,
        respuesta_correcta: "36",
        feedback_error: "Suma los dos largos (12 + 12 = 24) más los dos anchos (6 + 6 = 12).",
      };
    }
    return {
      explicacion_previa:
        "Si conocemos el perímetro total de un cuadrado y queremos hallar cuánto mide cada uno de sus 4 lados iguales, dividimos el perímetro entre 4.",
      ejemplo_corto: "Ejemplo: Perímetro de 40 m en un cuadrado → 40 ÷ 4 = 10 m cada lado.",
      instruccion: `Para culminar ${contextoCorto}, usamos una cuerda de 48 metros exactos para rodear un jardín cuadrado. ¿Cuántos metros mide cada lado del jardín?`,
      respuesta_correcta: "12",
      feedback_error: "Divide los 48 metros del perímetro entre los 4 lados iguales del cuadrado.",
    };
  }

  // Caso 4: Área de terrenos rectangulares y triangulares
  if (t.includes("área") || t.includes("area") || t.includes("superficie")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El área de un rectángulo mide toda su superficie interior y se calcula multiplicando la base (largo) por la altura (ancho).",
        ejemplo_corto: "Ejemplo: Base 8 m × Altura 5 m = 40 metros cuadrados (m²).",
        instruccion: `Al iniciar ${contextoCorto}, Qori limpió un terreno rectangular de 9 metros de largo por 6 metros de ancho. ¿Cuál es el área total en metros cuadrados?`,
        respuesta_correcta: "54",
        feedback_error: "Multiplica el largo por el ancho: 9 × 6.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El área de un triángulo es exactamente la mitad del área de un rectángulo: multiplicamos base por altura y dividimos entre 2.",
        ejemplo_corto: "Ejemplo: Base 10 m y altura 6 m → (10 × 6) ÷ 2 = 60 ÷ 2 = 30 m².",
        instruccion: `Siguiendo con ${contextoCorto}, al costado del terreno principal preparamos una parcela triangular de 12 metros de base y 8 metros de altura. ¿Cuál es su área en m²?`,
        respuesta_correcta: "48",
        feedback_error: "Multiplica 12 × 8 (= 96) y divide el resultado entre 2.",
      };
    }
    return {
      explicacion_previa:
        "Para conocer la superficie total de dos terrenos unidos, calculamos el área de cada uno y las sumamos.",
      ejemplo_corto: "Ejemplo: Un sector de 30 m² + otro sector de 25 m² = 55 m² en total.",
      instruccion: `Al finalizar ${contextoCorto}, juntamos el vivero de 45 m² con el almacén de 35 m². ¿Cuántos metros cuadrados suma toda la obra terminada?`,
      respuesta_correcta: "80",
      feedback_error: "Suma las dos superficies: 45 + 35.",
    };
  }

  // Caso 5: Porcentajes (10%, 25%, 50%)
  if (t.includes("porcentaje") || t.includes("%")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "El 50% de cualquier cantidad representa exactamente la mitad, por lo que basta con dividir el total entre 2.",
        ejemplo_corto: "Ejemplo: El 50% de 60 sacos → 60 ÷ 2 = 30 sacos.",
        instruccion: `En la primera etapa de ${contextoCorto}, reunimos 80 materiales de trabajo y el 50% se entregó al primer grupo. ¿Cuántos materiales recibió ese grupo?`,
        respuesta_correcta: "40",
        feedback_error: "El 50% es la mitad: divide 80 entre 2.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El 25% de un total equivale a la cuarta parte (1/4), así que se calcula dividiendo la cantidad total entre 4.",
        ejemplo_corto: "Ejemplo: El 25% de 80 → 80 ÷ 4 = 20.",
        instruccion: `Al avanzar a la segunda parte de ${contextoCorto}, cosechamos 120 kilos de productos y destinamos el 25% para las semillas del próximo año. ¿Cuántos kilos guardamos?`,
        respuesta_correcta: "30",
        feedback_error: "Para hallar el 25%, divide los 120 kilos entre 4.",
      };
    }
    return {
      explicacion_previa:
        "El 10% de un número que termina en cero se obtiene dividiendo entre 10 (quitando el último cero). Para el 30%, multiplicamos ese 10% por 3.",
      ejemplo_corto: "Ejemplo: De 200, el 10% es 20, y el 30% es 20 × 3 = 60.",
      instruccion: `Para cerrar con éxito ${contextoCorto}, de los 150 soles recaudados por el aula ahorramos el 30% para libros. ¿Cuántos soles ahorramos?`,
      respuesta_correcta: "45",
      feedback_error: "El 10% de 150 es 15. Multiplica 15 por 3 para obtener el 30%.",
    };
  }

  // Caso 6: Tablas de frecuencia y promedios
  if (t.includes("tabla") || t.includes("frecuencia") || t.includes("promedio") || t.includes("estad")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "En una tabla de frecuencias anotamos cuántos elementos hay de cada tipo y los sumamos para obtener el total registrado.",
        ejemplo_corto: "Ejemplo: Papa blanca (12) + Papa amarilla (15) + Papa morada (10) = 37.",
        instruccion: `Al iniciar el registro en ${contextoCorto}, anotamos en la tabla: 14 canastas del grupo A, 16 del grupo B y 12 del grupo C. ¿Cuántas canastas registramos en total?`,
        respuesta_correcta: "42",
        feedback_error: "Suma las tres cantidades de la tabla: 14 + 16 (= 30) más 12.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "El promedio (o media) se calcula sumando todos los datos de la tabla y dividiendo ese total entre la cantidad de grupos.",
        ejemplo_corto: "Ejemplo: Datos 10, 14 y 18 → Suma = 42 → Promedio = 42 ÷ 3 = 14.",
        instruccion: `Con la tabla que armamos en ${contextoCorto}, durante tres días seguidos recolectamos 20, 25 y 30 unidades. ¿Cuál fue el promedio diario?`,
        respuesta_correcta: "25",
        feedback_error: "Suma 20 + 25 + 30 (= 75) y divídelo entre los 3 días.",
      };
    }
    return {
      explicacion_previa:
        "Para saber la diferencia entre el dato mayor y el dato menor de una tabla (el rango), restamos ambos valores.",
      ejemplo_corto: "Ejemplo: Mayor registro (45) - Menor registro (28) = 17.",
      instruccion: `Al revisar el cuadro final de ${contextoCorto}, el equipo con mayor puntaje logró 54 puntos y el menor 36 puntos. ¿Cuál es la diferencia entre ambos?`,
      respuesta_correcta: "18",
      feedback_error: "Resta 54 menos 36.",
    };
  }

  // Caso 7: Multiplicación y división (Nivel 2 por defecto)
  if (t.includes("multiplic") || t.includes("fila") || t.includes("reparto") || t.includes("divisi")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Cuando organizamos elementos en filas con la misma cantidad en cada una, multiplicamos el número de filas por los elementos de cada fila.",
        ejemplo_corto: "Ejemplo: 5 filas × 6 elementos = 30 elementos en total.",
        instruccion: `Para empezar ${contextoCorto}, Amaru ordenó 6 filas con 7 herramientas en cada fila. ¿Cuántas herramientas preparó en total?`,
        respuesta_correcta: "42",
        feedback_error: "Multiplica 6 filas por 7 herramientas: 6 × 7.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Repartir en partes iguales significa dividir la cantidad total entre el número de grupos buscando en la tabla de multiplicar.",
        ejemplo_corto: "Ejemplo: 36 semillas entre 4 surcos → 36 ÷ 4 = 9 semillas por surco.",
        instruccion: `Ahora que ya tenemos los materiales en ${contextoCorto}, repartimos 48 plantas en partes iguales entre 6 equipos del salón. ¿Cuántas plantas recibe cada equipo?`,
        respuesta_correcta: "8",
        feedback_error: "Busca en la tabla del 6 qué número multiplicado por 6 da 48.",
      };
    }
    return {
      explicacion_previa:
        "En problemas de dos pasos con grupos iguales, primero multiplicamos cuántos elementos hay por caja y luego sumamos las unidades adicionales.",
      ejemplo_corto: "Ejemplo: 4 cajas de 8 (4 × 8 = 32) más 5 sueltos = 37.",
      instruccion: `Para culminar ${contextoCorto}, llenamos 7 canastas con 8 productos en cada una. ¿Cuántos productos logramos reunir en las 7 canastas?`,
      respuesta_correcta: "56",
      feedback_error: "Recuerda la tabla del 7: multiplica 7 × 8.",
    };
  }

  // Caso 8: Fracciones (Nivel 3 por defecto)
  if (t.includes("fracci") || t.includes("proporci") || t.includes("total")) {
    if (capitulo === 1) {
      return {
        explicacion_previa:
          "Para calcular una fracción de un total (como 2/3), primero dividimos el total entre el número de abajo (denominador) y luego multiplicamos por el de arriba (numerador).",
        ejemplo_corto: "Ejemplo: 2/3 de 30 → (30 ÷ 3 = 10) y luego (10 × 2 = 20).",
        instruccion: `Al iniciar ${contextoCorto}, necesitamos reunir 60 materiales y ya conseguimos las dos terceras partes (2/3). ¿Cuántos materiales ya tenemos listos?`,
        respuesta_correcta: "40",
        feedback_error: "Divide 60 entre 3 (= 20) y multiplica ese tercio por 2.",
      };
    }
    if (capitulo === 2) {
      return {
        explicacion_previa:
          "Si usamos una cuarta parte (1/4) de los recursos, dividimos el total entre 4 y restamos esa cantidad al total inicial para saber cuánto queda.",
        ejemplo_corto: "Ejemplo: De 80 usamos 1/4 (80 ÷ 4 = 20) → Quedan 80 - 20 = 60.",
        instruccion: `Continuando con el trabajo de ${contextoCorto}, de los 120 litros de agua reservados usamos la cuarta parte (1/4) al mediodía. ¿Cuántos litros quedan para la tarde?`,
        respuesta_correcta: "90",
        feedback_error: "La cuarta parte de 120 es 30 (120 ÷ 4). Réstale 30 a los 120 litros iniciales.",
      };
    }
    return {
      explicacion_previa:
        "Para hallar las tres quintas partes (3/5) de una cantidad, dividimos el total entre 5 para conocer un quinto y lo multiplicamos por 3.",
      ejemplo_corto: "Ejemplo: 3/5 de 50 → (50 ÷ 5 = 10) y luego (10 × 3 = 30).",
      instruccion: `En el cierre de ${contextoCorto}, obtuvimos 100 productos terminados y las tres quintas partes (3/5) son para las familias de la escuela. ¿Cuántos productos se entregaron?`,
      respuesta_correcta: "60",
      feedback_error: "Divide 100 entre 5 (= 20) y multiplícalo por 3.",
    };
  }

  // Caso por defecto (Nivel 1: Sumas y restas con decenas y unidades, o Ciencia/Personal Social cuantificado)
  if (capitulo === 1) {
    return {
      explicacion_previa:
        "Para sumar dos cantidades de dos cifras fácilmente, primero sumamos las decenas completas (grupos de 10) y después las unidades sueltas.",
      ejemplo_corto: "Ejemplo: 14 + 13 → (10 + 10 = 20) y (4 + 3 = 7) → 20 + 7 = 27.",
      instruccion: `Al comenzar ${contextoCorto} trabajando "${temaTitulo}", Illari reunió 16 elementos en la primera mesa y Amaru trajo 13 más. ¿Cuántos reunieron en total?`,
      respuesta_correcta: "29",
      feedback_error: "Suma primero las decenas (10 + 10 = 20) y luego las unidades (6 + 3 = 9).",
    };
  }
  if (capitulo === 2) {
    return {
      explicacion_previa:
        "Cuando utilizamos una parte de lo que habíamos reunido en el capítulo anterior, restamos decenas con decenas y unidades con unidades.",
      ejemplo_corto: "Ejemplo: Si teníamos 38 y usamos 14 → (30 - 10 = 20) y (8 - 4 = 4) → 24.",
      instruccion: `Siguiendo con ${contextoCorto} en "${temaTitulo}", de los 37 elementos que guardamos en la canasta ya colocamos 14 en su lugar. ¿Cuántos quedan en la canasta?`,
      respuesta_correcta: "23",
      feedback_error: "Resta las decenas (30 - 10 = 20) y luego las unidades (7 - 4 = 3).",
    };
  }
  return {
    explicacion_previa:
      "Cuando las unidades sueltas de dos grupos suman 10 o más, formamos una nueva decena completa.",
    ejemplo_corto: "Ejemplo: 18 + 15 → (18 + 2 = 20) más los 13 restantes = 33.",
    instruccion: `Para terminar ${contextoCorto} aplicando "${temaTitulo}", juntamos los 19 registros de la mañana con los 16 registros de la tarde. ¿Cuántos logramos en todo el día?`,
    respuesta_correcta: "35",
    feedback_error: "Pásale 1 del 16 al 19 para formar 20, y súmale los 15 que quedan.",
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
        tipo_mecanica: "input_numerico",
        opciones: generarOpcionesParaRespuesta(prog.respuesta_correcta),
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
        titulo_fase: "Capítulo 1: El Inicio y la Preparación",
        prompt_sdxl: `Warm children storybook illustration of Andean school children arriving in the morning to start ${escenario}, gathering tools and baskets, golden morning light`,
        narrativa_fase: `Muy temprano por la mañana, los niños Illari, Amaru y Qori llegaron junto a su maestro para dar inicio a ${escenarioMinuscula}. Antes de poner manos a la obra, los tres niveles del salón se organizaron para calcular y preparar los primeros materiales.`,
        explicacion_general:
          "En este primer capítulo aprenderemos la base del tema de cada nivel para organizar los materiales iniciales de la mañana.",
        retos_grados: armarRetosCapitulo(1),
      },
      {
        numero_fase: 2,
        titulo_fase: "Capítulo 2: Avanzando al Mediodía",
        prompt_sdxl: `Warm children storybook illustration of the same Andean school children at midday actively working on the middle stage of ${escenario}, teamwork, bright sky`,
        narrativa_fase: `Gracias a los materiales que Illari, Amaru y Qori lograron reunir en el Capítulo 1, al llegar el mediodía ya tenían la primera parte lista en ${escenarioMinuscula}. Sin embargo, ahora necesitan distribuir lo avanzado y medir el tramo central para que ningún grupo se detenga.`,
        explicacion_general:
          "En este segundo capítulo daremos un paso más usando los materiales que ya reunimos en la mañana.",
        retos_grados: armarRetosCapitulo(2),
      },
      {
        numero_fase: 3,
        titulo_fase: "Capítulo 3: El Gran Cierre de la Tarde",
        prompt_sdxl: `Warm children storybook illustration of Andean school children celebrating at sunset after completing ${escenario} together with their community, festive flags`,
        narrativa_fase: `Al caer la tarde, después de superar juntos el reto del mediodía, Illari, Amaru y Qori están a un solo paso de terminar por completo ${escenarioMinuscula}. Toda la comunidad se acerca para ver el resultado final de los tres niveles del aula.`,
        explicacion_general:
          "En el capítulo final aplicaremos lo aprendido para comprobar el resultado total de nuestra jornada.",
        retos_grados: armarRetosCapitulo(3),
      },
    ],
    narrativa_victoria: `¡Historia completada! Desde la preparación de la mañana en el Capítulo 1 hasta el cierre de la tarde en el Capítulo 3, los tres niveles resolvieron unidos ${escenarioMinuscula}.`,
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
