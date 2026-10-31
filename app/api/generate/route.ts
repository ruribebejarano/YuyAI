import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  construirMisionMultinivelContextual,
  SeleccionNivelTema,
} from "@/lib/default-missions";
import { MisionYuyAI } from "@/lib/types";

// Forzar ejecución al máximo tiempo permitido en Vercel Hobby Tier
export const maxDuration = 60;

function buildDynamicSystemPrompt(selecciones: SeleccionNivelTema[]): string {
  const detalleNiveles = selecciones
    .map(
      (s, idx) =>
        `- Nivel ${idx + 1}: código="${s.nivel_codigo}", nombre="${s.nivel_nombre}", área="${s.area_curricular || "Matemática"}", tema específico del día="${s.tema_titulo}"`
    )
    .join("\n");

  return `Eres un sabio amauta y pedagogo especialista en educación rural multinivel del Perú (Currículo Nacional MINEDU).
Tu misión es transformar los temas curriculares seleccionados para cada Nivel del aula en una aventura gamificada compartida.

NIVELES Y TEMAS QUE DEBES INCLUIR EN CADA FASE:
${detalleNiveles}

REGLAS ESTRICTAS:
1. NUNCA uses lenguaje robótico ni menciones que eres una IA. El tono debe ser cálido, narrativo y pedagógico.
2. Genera exactamente 3 fases progresivas ("numero_fase": 1, 2 y 3).
3. En cada fase incluye "retos_grados" con ${selecciones.length} objetos exactos (uno por cada Nivel listado arriba), respetando su "nivel_codigo", "nivel_nombre" y su "tema_curricular".
4. "tipo_mecanica" debe ser siempre "input_numerico" y "respuesta_correcta" debe ser únicamente el número en texto (ejemplo: "27").
5. "feedback_error" es leído en voz alta por síntesis de voz (TTS) a los niños cuando se equivocan: redacta una pista pedagógica amorosa, sin dar la respuesta directa.
6. Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
{
  "titulo_mision": "string",
  "prompt_sdxl_base": "Warm storybook illustration of ...",
  "fases": [
    {
      "numero_fase": 1,
      "narrativa_fase": "string",
      "retos_grados": [
        {
          "grado": 1,
          "nivel_codigo": "nivel_1",
          "nivel_nombre": "string",
          "tema_curricular": "string",
          "area_curricular": "string",
          "instruccion": "string",
          "tipo_mecanica": "input_numerico",
          "respuesta_correcta": "string",
          "feedback_error": "string"
        }
      ]
    }
  ],
  "narrativa_victoria": "string",
  "prompt_sdxl_victoria": "Warm storybook illustration of ..."
}`;
}

async function callGeminiAPI(
  promptUsuario: string,
  selecciones: SeleccionNivelTema[],
  apiKey: string
): Promise<MisionYuyAI | null> {
  if (!apiKey) return null;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${buildDynamicSystemPrompt(selecciones)}\n\nCONTEXTO DE LA SESIÓN DEL DÍA: ${promptUsuario}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  };

  const endpoints = apiKey.startsWith("AQ.")
    ? [
        `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      ]
    : [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned) as MisionYuyAI;
      if (
        parsed?.titulo_mision &&
        Array.isArray(parsed?.fases) &&
        parsed.fases.length > 0
      ) {
        return parsed;
      }
    } catch {
      // Continúa al respaldo pedagógico multinivel
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tema = (
      body?.tema || "Saberes de la comunidad y resolución de problemas"
    ).trim();
    const contexto = (body?.contexto || "Valle del Urubamba").trim();
    const selecciones: SeleccionNivelTema[] = Array.isArray(body?.selecciones)
      ? body.selecciones
      : [];

    const apiKey = process.env.GEMINI_API_KEY || "";

    let mision = await callGeminiAPI(
      `Propósito general: ${tema}. Escenario cultural: ${contexto}.`,
      selecciones,
      apiKey
    );

    if (!mision) {
      mision = construirMisionMultinivelContextual(tema, contexto, selecciones);
    }

    const { data: inserted, error: dbError } = await supabase
      .from("misiones_plantillas")
      .insert({
        titulo: mision.titulo_mision,
        fases_json: mision,
      })
      .select("id, fecha_creacion")
      .single();

    if (!dbError && inserted) {
      mision.id = inserted.id;
      mision.fecha_creacion = inserted.fecha_creacion;
    }

    return NextResponse.json({
      mision,
      guardado_en_supabase: !dbError,
    });
  } catch {
    const fallback = construirMisionMultinivelContextual(
      "Equilibrio de cargas en el puente comunal",
      "Comunidad de Huinchiri"
    );
    return NextResponse.json({ mision: fallback, guardado_en_supabase: false });
  }
}
