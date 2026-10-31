import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  construirMisionMultinivelContextual,
  generarOpcionesParaRespuesta,
  SeleccionNivelTema,
} from "@/lib/default-missions";
import { MisionYuyAI } from "@/lib/types";

export const maxDuration = 60;

function buildDynamicSystemPrompt(selecciones: SeleccionNivelTema[]): string {
  const detalleNiveles = selecciones
    .map(
      (s, idx) =>
        `- Nivel ${idx + 1}: nivel_codigo="${s.nivel_codigo}", nivel_nombre="${s.nivel_nombre}", area_curricular="${s.area_curricular || "Matemática"}", tema_curricular="${s.tema_titulo}"`
    )
    .join("\n");

  return `Eres un sabio amauta y pedagogo especialista en educación rural multinivel del Perú (Currículo Nacional MINEDU).
Tu misión es transformar los temas curriculares seleccionados para cada Nivel del aula en una aventura gamificada e interactiva de 3 etapas.

NIVELES Y TEMAS QUE DEBES INCLUIR OBLIGATORIAMENTE EN CADA FASE (todos ellos, sin omitir ninguno):
${detalleNiveles}

REGLAS ESTRICTAS:
1. NUNCA uses lenguaje robótico ni menciones que eres una IA.
2. Genera exactamente 3 fases progresivas ("numero_fase": 1, 2 y 3). Cada fase debe tener un "titulo_fase" corto y un "prompt_sdxl" en inglés describiendo una escena ilustrada distinta para esa etapa.
3. En cada fase incluye "retos_grados" con EXACTAMENTE ${selecciones.length} objetos (uno para cada Nivel listado arriba).
4. "respuesta_correcta" debe ser únicamente el número en texto (ejemplo: "27"), y "opciones" un arreglo de 4 números en texto que incluya la respuesta correcta.
5. "feedback_error" es leído en voz alta por síntesis de voz (TTS) a los niños cuando se equivocan: redacta una pista pedagógica cálida, sin dar la respuesta directa.
6. Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
{
  "titulo_mision": "Título corto y atractivo de la aventura",
  "prompt_sdxl_base": "Warm children storybook illustration of ...",
  "fases": [
    {
      "numero_fase": 1,
      "titulo_fase": "Título de la etapa 1",
      "prompt_sdxl": "Warm children storybook illustration of ...",
      "narrativa_fase": "Relato breve y emocionante (máximo 2 oraciones) de lo que ocurre en esta etapa.",
      "retos_grados": [
        {
          "grado": 1,
          "nivel_codigo": "nivel_1",
          "nivel_nombre": "Nivel 1 · Ciclo III (Semillas)",
          "tema_curricular": "Título del tema",
          "area_curricular": "Matemática",
          "instruccion": "Pregunta matemática vivencial clara",
          "tipo_mecanica": "input_numerico",
          "opciones": ["22", "27", "30", "35"],
          "respuesta_correcta": "27",
          "feedback_error": "Pista amable hablada para guiar el cálculo"
        }
      ]
    }
  ],
  "narrativa_victoria": "Mensaje de celebración comunitaria",
  "prompt_sdxl_victoria": "Warm children storybook illustration of ..."
}`;
}

function normalizarMisionConTodosLosNiveles(
  misionCruda: MisionYuyAI,
  tema: string,
  contexto: string,
  selecciones: SeleccionNivelTema[]
): MisionYuyAI {
  const respaldo = construirMisionMultinivelContextual(
    tema,
    contexto,
    selecciones
  );

  // Acortar título si es excesivamente largo
  const tituloLimpio =
    misionCruda.titulo_mision && misionCruda.titulo_mision.length <= 68
      ? misionCruda.titulo_mision
      : respaldo.titulo_mision;

  const fasesNormalizadas = [0, 1, 2].map((fIdx) => {
    const faseCruda = misionCruda.fases?.[fIdx];
    const faseRespaldo = respaldo.fases[fIdx];
    if (!faseCruda) return faseRespaldo;

    // Asegurar que cada nivel seleccionado tenga su reto en esta fase
    const retosCompletos = faseRespaldo.retos_grados.map(
      (retoResp, nIdx) => {
        const retoEncontrado =
          faseCruda.retos_grados?.find(
            (r) => r.nivel_codigo === retoResp.nivel_codigo
          ) || faseCruda.retos_grados?.[nIdx];

        if (!retoEncontrado || !retoEncontrado.instruccion) {
          return retoResp;
        }

        const respStr = String(
          retoEncontrado.respuesta_correcta || retoResp.respuesta_correcta
        ).trim();
        const opcionesFinales =
          Array.isArray(retoEncontrado.opciones) &&
          retoEncontrado.opciones.length >= 3 &&
          retoEncontrado.opciones.includes(respStr)
            ? retoEncontrado.opciones.map(String)
            : generarOpcionesParaRespuesta(respStr);

        return {
          ...retoResp,
          ...retoEncontrado,
          nivel_codigo: retoResp.nivel_codigo,
          nivel_nombre: retoResp.nivel_nombre,
          tema_curricular:
            retoEncontrado.tema_curricular || retoResp.tema_curricular,
          respuesta_correcta: respStr,
          opciones: opcionesFinales,
        };
      }
    );

    return {
      numero_fase: fIdx + 1,
      titulo_fase: faseCruda.titulo_fase || faseRespaldo.titulo_fase,
      prompt_sdxl:
        faseCruda.prompt_sdxl ||
        faseRespaldo.prompt_sdxl ||
        misionCruda.prompt_sdxl_base,
      narrativa_fase:
        faseCruda.narrativa_fase || faseRespaldo.narrativa_fase,
      retos_grados: retosCompletos,
    };
  });

  return {
    ...respaldo,
    ...misionCruda,
    titulo_mision: tituloLimpio,
    fases: fasesNormalizadas,
  };
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
            text: `${buildDynamicSystemPrompt(selecciones)}\n\nESCENARIO DEL DÍA: ${promptUsuario}`,
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
    const contexto = (body?.contexto || "Nuestra Comunidad Andina").trim();
    const selecciones: SeleccionNivelTema[] =
      Array.isArray(body?.selecciones) && body.selecciones.length > 0
        ? body.selecciones
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

    const apiKey = process.env.GEMINI_API_KEY || "";

    const misionCruda = await callGeminiAPI(
      `Escenario cultural: ${contexto}. Propósito: ${tema}.`,
      selecciones,
      apiKey
    );

    const mision = misionCruda
      ? normalizarMisionConTodosLosNiveles(
          misionCruda,
          tema,
          contexto,
          selecciones
        )
      : construirMisionMultinivelContextual(tema, contexto, selecciones);

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
