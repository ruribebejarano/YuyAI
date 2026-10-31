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

function decodificarTextoPdf(cadena: string): string {
  return cadena
    .replace(/\\n|\\r/g, " ")
    .replace(/\\([()\\])/g, "$1")
    .replace(/[^\x20-\x7EÁÉÍÓÚáéíóúÑñ¿¡°]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractReadableTextFromPdfBuffer(buffer: Buffer): string {
  const fragmentos: string[] = [];
  const rawLatin1 = buffer.toString("latin1");

  // 1. Descomprimir bloques stream...endstream (FlateDecode) donde están los textos reales del PDF
  const regexStream = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let streamMatch: RegExpExecArray | null;
  while ((streamMatch = regexStream.exec(rawLatin1)) !== null) {
    try {
      const streamBytes = Buffer.from(streamMatch[1], "latin1");
      const descomprimido = zlib.inflateSync(streamBytes).toString("latin1");
      const regexPar = /\(([^()]{2,250})\)/g;
      let m: RegExpExecArray | null;
      while ((m = regexPar.exec(descomprimido)) !== null) {
        const limpio = decodificarTextoPdf(m[1]);
        if (limpio.length >= 3 && /[a-zA-ZáéíóúÁÉÍÓÚ]/.test(limpio)) {
          fragmentos.push(limpio);
        }
      }
    } catch {
      // No todos los streams son FlateDecode (ej. imágenes)
    }
  }

  // 2. También extraer texto directo sin comprimir
  const regexDirecto = /\(([^()\\]{3,200})\)/g;
  let match: RegExpExecArray | null;
  while ((match = regexDirecto.exec(rawLatin1)) !== null) {
    const limpio = decodificarTextoPdf(match[1]);
    if (
      limpio.length >= 4 &&
      /[a-zA-ZáéíóúÁÉÍÓÚ]/.test(limpio) &&
      !/Type|Font|Page|Filter|FlateDecode|Obj/i.test(limpio)
    ) {
      fragmentos.push(limpio);
    }
  }

  const textoUnido = fragmentos.join(" ").slice(0, 18000);
  return textoUnido;
}

const PROMPT_EXTRACCION = (fileName: string, extractedText: string) => `Eres un docente coordinador de educación primaria rural del Perú (MINEDU).
Analiza el contenido extraído del documento PDF "${fileName}" y extrae los temas de clase organizados en 3 niveles del aula:
- "nivel_1": Nivel 1 · Ciclo III (1.° y 2.° grado)
- "nivel_2": Nivel 2 · Ciclo IV (3.° y 4.° grado)
- "nivel_3": Nivel 3 · Ciclo V (5.° y 6.° grado)

Contenido del documento PDF:
"""
${extractedText.slice(0, 10000) || `Programación curricular: ${fileName}`}
"""

Extrae entre 6 y 9 temas concretos basados fielmente en el documento (al menos 2 temas para cada nivel).
Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta:
{
  "niveles": [
    {
      "codigo": "nivel_1",
      "nombre": "Nivel 1 · Ciclo III",
      "descripcion": "1.° y 2.° grado",
      "color_hex": "#238564",
      "orden": 1
    },
    {
      "codigo": "nivel_2",
      "nombre": "Nivel 2 · Ciclo IV",
      "descripcion": "3.° y 4.° grado",
      "color_hex": "#2B6CB0",
      "orden": 2
    },
    {
      "codigo": "nivel_3",
      "nombre": "Nivel 3 · Ciclo V",
      "descripcion": "5.° y 6.° grado",
      "color_hex": "#D4653B",
      "orden": 3
    }
  ],
  "temas": [
    {
      "nivel_codigo": "nivel_1",
      "nivel_nombre": "Nivel 1 · Ciclo III",
      "area_curricular": "Matemática",
      "titulo_tema": "Título concreto extraído del PDF",
      "competencia_minedu": "Competencia asociada",
      "desempeno_esperado": "Qué aprenderá el niño en este tema"
    }
  ]
}`;

async function parsePdfWithLiveLLM(
  base64Pdf: string,
  extractedText: string,
  fileName: string,
  apiKey: string
): Promise<ExtractedCurriculum | null> {
  const promptText = PROMPT_EXTRACCION(fileName, extractedText);

  // 1. Intentar con Gemini API si la clave está activa
  if (apiKey) {
    const parts: Array<Record<string, unknown>> = [{ text: promptText }];
    if (base64Pdf && base64Pdf.length < 3_500_000) {
      parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf,
        },
      });
    }

    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json",
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(
              rawText.replace(/```json|```/g, "").trim()
            ) as ExtractedCurriculum;
            if (Array.isArray(parsed?.temas) && parsed.temas.length > 0) {
              return parsed;
            }
          }
        }
      } catch {
        // Pasa al motor LLM en vivo de respaldo
      }
    }
  }

  // 2. Motor LLM en vivo (OpenAI / Pollinations JSON) para leer el texto real del PDF
  try {
    const llmRes = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content:
              "Eres un especialista curricular escolar. Devuelve únicamente JSON válido sin bloques markdown.",
          },
          { role: "user", content: promptText },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (llmRes.ok) {
      const llmData = await llmRes.json();
      const rawContent = llmData?.choices?.[0]?.message?.content;
      if (rawContent) {
        const parsed = JSON.parse(
          rawContent.replace(/```json|```/g, "").trim()
        ) as ExtractedCurriculum;
        if (Array.isArray(parsed?.temas) && parsed.temas.length > 0) {
          return parsed;
        }
      }
    }
  } catch {
    // Fallback local
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fileName = "Programacion_Curricular.pdf";
    let base64Pdf = "";
    let extractedText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const textoManual = (formData.get("texto") as string | null) || "";

      if (file) {
        fileName = file.name || fileName;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        base64Pdf = buffer.toString("base64");
        extractedText = extractReadableTextFromPdfBuffer(buffer);
      }
      if (textoManual) {
        extractedText = `${textoManual}\n${extractedText}`;
      }
    } else {
      const body = await req.json();
      fileName = body?.nombre_archivo || fileName;
      extractedText = body?.texto || "";
      base64Pdf = body?.base64Pdf || "";
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    const resultado = await parsePdfWithLiveLLM(
      base64Pdf,
      extractedText,
      fileName,
      apiKey
    );

    if (!resultado || !Array.isArray(resultado.temas)) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudieron identificar temas en el archivo subido.",
        },
        { status: 400 }
      );
    }

    // 1. Registrar el documento PDF en Supabase
    const { data: docInsertado } = await supabase
      .from("documentos_curriculares")
      .insert({
        nombre_archivo: fileName,
        texto_extraido: extractedText.slice(0, 4000),
        total_temas: resultado.temas.length,
      })
      .select("*")
      .single();

    // 2. Asegurar niveles en Supabase
    const mapaNiveles: Record<string, NivelAulaRow> = {};
    const nivelesBase =
      Array.isArray(resultado.niveles) && resultado.niveles.length > 0
        ? resultado.niveles
        : [
            {
              codigo: "nivel_1",
              nombre: "Nivel 1 · Ciclo III",
              descripcion: "1.° y 2.° grado",
              color_hex: "#238564",
              orden: 1,
            },
            {
              codigo: "nivel_2",
              nombre: "Nivel 2 · Ciclo IV",
              descripcion: "3.° y 4.° grado",
              color_hex: "#2B6CB0",
              orden: 2,
            },
            {
              codigo: "nivel_3",
              nombre: "Nivel 3 · Ciclo V",
              descripcion: "5.° y 6.° grado",
              color_hex: "#D4653B",
              orden: 3,
            },
          ];

    for (const niv of nivelesBase) {
      const { data: nivelGuardado } = await supabase
        .from("niveles_aula")
        .upsert(
          {
            codigo: niv.codigo,
            nombre: niv.nombre,
            descripcion: niv.descripcion,
            color_hex: niv.color_hex || "#238564",
            orden: niv.orden || 1,
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

    // 3. Guardar los temas recién extraídos en Supabase
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
      orden: index + 1,
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
      texto_muestra: extractedText.slice(0, 300),
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
