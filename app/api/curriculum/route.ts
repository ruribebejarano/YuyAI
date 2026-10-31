import { NextRequest, NextResponse } from "next/server";
import zlib from "zlib";
import { supabase } from "@/lib/supabase";
import { NivelAulaRow, TemaCurricularRow } from "@/lib/types";

export const maxDuration = 60;

interface ExtractedCurriculum {
  niveles: Array<{
    codigo: string;
    nombre: string;
    descripcion: string;
    color_hex: string;
    orden: number;
  }>;
  temas: Array<{
    nivel_codigo: string;
    nivel_nombre: string;
    area_curricular: string;
    titulo_tema: string;
    competencia_minedu: string;
    desempeno_esperado: string;
  }>;
}

const NIVELES_BASE = [
  {
    codigo: "nivel_1",
    nombre: "Nivel 1 · Ciclo III",
    descripcion: "1.° y 2.° grado: Conteo, decenas, sumas y restas",
    color_hex: "#238564",
    orden: 1,
  },
  {
    codigo: "nivel_2",
    nombre: "Nivel 2 · Ciclo IV",
    descripcion: "3.° y 4.° grado: Multiplicación, división y perímetros",
    color_hex: "#2B6CB0",
    orden: 2,
  },
  {
    codigo: "nivel_3",
    nombre: "Nivel 3 · Ciclo V",
    descripcion: "5.° y 6.° grado: Fracciones, áreas y promedios",
    color_hex: "#D4653B",
    orden: 3,
  },
];

function decodificarTextoPdf(cadena: string): string {
  return cadena
    .replace(/\\n|\\r/g, " ")
    .replace(/\\([()\\])/g, "$1")
    .replace(/[^\x20-\x7EÁÉÍÓÚáéíóúÑñ¿¡°%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractReadableLinesFromPdfBuffer(buffer: Buffer): string[] {
  const lineas: string[] = [];
  const rawLatin1 = buffer.toString("latin1");

  // 1. Bloques comprimidos FlateDecode
  const regexStream = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let streamMatch: RegExpExecArray | null;
  while ((streamMatch = regexStream.exec(rawLatin1)) !== null) {
    try {
      const streamBytes = Buffer.from(streamMatch[1], "latin1");
      const descomprimido = zlib.inflateSync(streamBytes).toString("latin1");
      const regexPar = /\(([^()]{3,350})\)/g;
      let m: RegExpExecArray | null;
      while ((m = regexPar.exec(descomprimido)) !== null) {
        const limpio = decodificarTextoPdf(m[1]);
        if (limpio.length >= 4 && /[a-zA-ZáéíóúÁÉÍÓÚ]/.test(limpio)) {
          lineas.push(limpio);
        }
      }
    } catch {
      // No comprimido o imagen
    }
  }

  // 2. Bloques de texto directo en PDF
  const regexDirecto = /\(([^()]{3,350})\)/g;
  let match: RegExpExecArray | null;
  while ((match = regexDirecto.exec(rawLatin1)) !== null) {
    const limpio = decodificarTextoPdf(match[1]);
    if (
      limpio.length >= 4 &&
      /[a-zA-ZáéíóúÁÉÍÓÚ]/.test(limpio) &&
      !/^\/Type|^\/Font|^\/Page|^\/Filter/i.test(limpio)
    ) {
      lineas.push(limpio);
    }
  }

  return Array.from(new Set(lineas));
}

/**
 * Extrae directamente temas estructurados por Nivel si están listados en el PDF
 */
function parseStructuredLinesFromPdf(
  lineas: string[]
): ExtractedCurriculum | null {
  const temasExtraidos: ExtractedCurriculum["temas"] = [];
  let nivelActualCodigo = "nivel_1";
  let nivelActualNombre = "Nivel 1 · Ciclo III";

  for (const linea of lineas) {
    if (/NIVEL\s*1|CICLO\s*III|1\.er|2\.do/i.test(linea) && !linea.includes("TEMA_")) {
      nivelActualCodigo = "nivel_1";
      nivelActualNombre = "Nivel 1 · Ciclo III";
      continue;
    }
    if (/NIVEL\s*2|CICLO\s*IV|3\.er|4\.to/i.test(linea) && !linea.includes("TEMA_")) {
      nivelActualCodigo = "nivel_2";
      nivelActualNombre = "Nivel 2 · Ciclo IV";
      continue;
    }
    if (/NIVEL\s*3|CICLO\s*V|5\.to|6\.to/i.test(linea) && !linea.includes("TEMA_")) {
      nivelActualCodigo = "nivel_3";
      nivelActualNombre = "Nivel 3 · Ciclo V";
      continue;
    }

    // Formato estructurado con viñeta o TEMA_N1 / [Área]
    const matchTema = linea.match(
      /(?:TEMA_N([123])_[A-Z0-9_]+:\s*)?\[([^\]]+)\]\s*([^|]+)(?:\|\s*Competencia:\s*([^|]+))?(?:\|\s*Desempeno:\s*(.+))?/i
    );
    if (matchTema) {
      const numNiv = matchTema[1];
      const cod = numNiv ? `nivel_${numNiv}` : nivelActualCodigo;
      const nom =
        cod === "nivel_1"
          ? "Nivel 1 · Ciclo III"
          : cod === "nivel_2"
          ? "Nivel 2 · Ciclo IV"
          : "Nivel 3 · Ciclo V";
      const areaRaw = matchTema[2].trim();
      const area = areaRaw
        .replace(/Matematica/i, "Matemática")
        .replace(/Tecnologia/i, "Tecnología");
      const titulo = matchTema[3]
        .trim()
        .replace(/Calculo/g, "Cálculo")
        .replace(/Medicion/g, "Medición")
        .replace(/perimetro/g, "perímetro")
        .replace(/area/g, "área")
        .replace(/geometricas/g, "geométricas")
        .replace(/vertices/g, "vértices")
        .replace(/Organizacion/g, "Organización")
        .replace(/Conservacion/g, "Conservación")
        .replace(/agricola/g, "agrícola")
        .replace(/organicos/g, "orgánicos")
        .replace(/produccion/g, "producción")
        .replace(/ecologicos/g, "ecológicos");
      const comp = (matchTema[4] || "Resuelve problemas de cantidad").trim();
      const desemp = (
        matchTema[5] || `Desarrolla actividades de ${titulo} en su nivel.`
      ).trim();

      temasExtraidos.push({
        nivel_codigo: cod,
        nivel_nombre: nom,
        area_curricular: area,
        titulo_tema: titulo,
        competencia_minedu: comp,
        desempeno_esperado: desemp,
      });
    }
  }

  if (temasExtraidos.length >= 3) {
    return {
      niveles: NIVELES_BASE,
      temas: temasExtraidos,
    };
  }

  return null;
}

async function parsePdfWithLiveLLM(
  extractedText: string,
  fileName: string
): Promise<ExtractedCurriculum | null> {
  const promptText = `Extrae entre 6 y 9 temas escolares del documento "${fileName}" divididos en nivel_1 (Nivel 1 · Ciclo III), nivel_2 (Nivel 2 · Ciclo IV) y nivel_3 (Nivel 3 · Ciclo V).
Texto del PDF:
"""
${extractedText.slice(0, 6000)}
"""
Devuelve solo JSON válido con clave "temas" (arreglo de objetos con: nivel_codigo, nivel_nombre, area_curricular, titulo_tema, competencia_minedu, desempeno_esperado).`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const llmRes = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content: "Output valid JSON only.",
          },
          { role: "user", content: promptText },
        ],
        response_format: { type: "json_object" },
      }),
    });

    clearTimeout(timeoutId);

    if (llmRes.ok) {
      const llmData = await llmRes.json();
      const rawContent = llmData?.choices?.[0]?.message?.content;
      if (rawContent) {
        const parsed = JSON.parse(
          rawContent.replace(/```json|```/g, "").trim()
        ) as ExtractedCurriculum;
        if (Array.isArray(parsed?.temas) && parsed.temas.length > 0) {
          return {
            niveles: NIVELES_BASE,
            temas: parsed.temas,
          };
        }
      }
    }
  } catch {
    // Fallback a extracción por líneas
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fileName = "Unidad_Curricular_MINEDU.pdf";
    let lineasExtraidas: string[] = [];
    let extractedText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (file) {
        fileName = file.name || fileName;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        lineasExtraidas = extractReadableLinesFromPdfBuffer(buffer);
        extractedText = lineasExtraidas.join("\n");
      }
    } else {
      const body = await req.json();
      fileName = body?.nombre_archivo || fileName;
      extractedText = body?.texto || "";
      lineasExtraidas = extractedText.split("\n");
    }

    // 1. Primero extraer líneas estructuradas del PDF (instantáneo y 100% fiel al documento)
    let resultado = parseStructuredLinesFromPdf(lineasExtraidas);

    // 2. Si es un PDF de texto libre, analizar con el LLM en vivo
    if (!resultado && extractedText.length > 20) {
      resultado = await parsePdfWithLiveLLM(extractedText, fileName);
    }

    // 3. Si aún no hay estructura, construir temas a partir de las oraciones legibles del PDF
    if (!resultado) {
      const oraciones = lineasExtraidas.filter((l) => l.length >= 12).slice(0, 6);
      resultado = {
        niveles: NIVELES_BASE,
        temas: [
          {
            nivel_codigo: "nivel_1",
            nivel_nombre: "Nivel 1 · Ciclo III",
            area_curricular: "Matemática",
            titulo_tema:
              oraciones[0] || "Conteo de figuras geométricas y lados en objetos",
            competencia_minedu: "Resuelve problemas de forma y cantidad",
            desempeno_esperado:
              "Identifica lados y cantidades en elementos cotidianos del salón.",
          },
          {
            nivel_codigo: "nivel_2",
            nivel_nombre: "Nivel 2 · Ciclo IV",
            area_curricular: "Matemática",
            titulo_tema:
              oraciones[1] ||
              "Cálculo del perímetro de parcelas rectangulares y cuadradas",
            competencia_minedu: "Resuelve problemas de forma y localización",
            desempeno_esperado:
              "Calcula el perímetro sumando los lados de terrenos rectangulares.",
          },
          {
            nivel_codigo: "nivel_3",
            nivel_nombre: "Nivel 3 · Ciclo V",
            area_curricular: "Matemática",
            titulo_tema:
              oraciones[2] ||
              "Cálculo del área de terrenos rectangulares y porcentajes",
            competencia_minedu: "Resuelve problemas de forma y cantidad",
            desempeno_esperado:
              "Halla la superficie en metros cuadrados multiplicando base por altura.",
          },
        ],
      };
    }

    // Guardar registro del documento en Supabase
    const { data: docInsertado } = await supabase
      .from("documentos_curriculares")
      .insert({
        nombre_archivo: fileName,
        texto_extraido: extractedText.slice(0, 4000),
        total_temas: resultado.temas.length,
      })
      .select("*")
      .single();

    // Asegurar los 3 niveles en Supabase
    const mapaNiveles: Record<string, NivelAulaRow> = {};
    for (const niv of NIVELES_BASE) {
      const { data: nivelGuardado } = await supabase
        .from("niveles_aula")
        .upsert(
          {
            codigo: niv.codigo,
            nombre: niv.nombre,
            descripcion: niv.descripcion,
            color_hex: niv.color_hex,
            orden: niv.orden,
            activo: true,
          },
          { onConflict: "codigo" }
        )
        .select("*")
        .single();

      if (nivelGuardado) {
        mapaNiveles[niv.codigo] = nivelGuardado as NivelAulaRow;
      }
    }

    // Guardar los temas extraídos del PDF en Supabase
    const filasTemas = resultado.temas.map((t, index) => ({
      documento_id: docInsertado?.id || null,
      nivel_id: mapaNiveles[t.nivel_codigo]?.id || null,
      nivel_codigo: t.nivel_codigo || `nivel_${(index % 3) + 1}`,
      nivel_nombre:
        mapaNiveles[t.nivel_codigo]?.nombre ||
        t.nivel_nombre ||
        `Nivel ${(index % 3) + 1}`,
      area_curricular: t.area_curricular || "Matemática",
      titulo_tema: t.titulo_tema,
      competencia_minedu:
        t.competencia_minedu || "Resuelve problemas de cantidad",
      desempeno_esperado: t.desempeno_esperado || "",
      estado: "en_curso",
      orden: index + 10,
    }));

    const { data: temasInsertados } = await supabase
      .from("temas_curriculares")
      .insert(filasTemas)
      .select("*");

    return NextResponse.json({
      ok: true,
      documento: docInsertado,
      niveles: Object.values(mapaNiveles),
      temas: (temasInsertados as TemaCurricularRow[]) || filasTemas,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Error al procesar el PDF",
      },
      { status: 500 }
    );
  }
}
