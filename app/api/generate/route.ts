import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  construirMisionMultinivelContextual,
  generarOpcionesParaRespuesta,
  SeleccionNivelTema,
} from "@/lib/default-missions";
import { MisionYuyAI } from "@/lib/types";

export const maxDuration = 60;

function buildDynamicSystemPrompt(
  selecciones: SeleccionNivelTema[],
  contexto: string
): string {
  const detalleNiveles = selecciones
    .map(
      (s, idx) =>
        `- Nivel ${idx + 1}: nivel_codigo="${s.nivel_codigo}", nivel_nombre="${s.nivel_nombre}", area_curricular="${s.area_curricular || "General"}", tema_curricular="${s.tema_titulo}"`
    )
    .join("\n");

  return `Crea una sesión de clase escolar interactiva con UNA SOLA HISTORIA CONTINUA en 3 capítulos ("numero_fase": 1, 2 y 3) sobre "${contexto}" con los niños Illari, Amaru y Qori.

CONTINUIDAD OBLIGATORIA:
- Capítulo 1: Inicio por la mañana.
- Capítulo 2: Continuación al mediodía de lo ocurrido en el Capítulo 1.
- Capítulo 3: Desenlace por la tarde concluyendo la misma historia.

TEMAS ESPECÍFICOS DE CADA NIVEL (¡RESPETA EL ÁREA Y TEMA EXACTO DE CADA NIVEL!):
${detalleNiveles}

REGLA CLAVE POR ÁREA:
- Si el tema de un nivel es de Ciencia y Tecnología, Personal Social, Comunicación u otra área NO matemática, la explicación, ejemplo, pregunta ("instruccion"), las 4 "opciones" y la "respuesta_correcta" DEBEN SER DE ESE TEMA (respuestas en texto, NO de matemática).
- Si el tema de un nivel es de Matemática, entonces sí incluye cálculo matemático y opciones numéricas.
- "respuesta_correcta" debe ser idéntica a una de las 4 cadenas dentro de "opciones".

Devuelve SOLO JSON válido con esta estructura:
{
  "titulo_mision": "${contexto}",
  "prompt_sdxl_base": "Warm children storybook illustration of ...",
  "fases": [
    {
      "numero_fase": 1,
      "titulo_fase": "Capítulo 1: ...",
      "prompt_sdxl": "Warm children storybook illustration of ...",
      "narrativa_fase": "Relato del Capítulo 1...",
      "retos_grados": [
        {
          "grado": 1,
          "nivel_codigo": "nivel_1",
          "nivel_nombre": "Nivel 1 · Ciclo III",
          "tema_curricular": "Tema del nivel",
          "area_curricular": "Área",
          "explicacion_previa": "Teoría breve del tema...",
          "ejemplo_corto": "Idea clave o ejemplo...",
          "instruccion": "Pregunta sobre el tema...",
          "tipo_mecanica": "opcion_multiple",
          "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
          "respuesta_correcta": "Opción 1",
          "feedback_error": "Pista..."
        }
      ]
    }
  ],
  "narrativa_victoria": "Desenlace final...",
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

  if (!Array.isArray(misionCruda.fases) || misionCruda.fases.length < 3) {
    return respaldo;
  }

  const fasesNormalizadas = [0, 1, 2].map((fIdx) => {
    const faseCruda = misionCruda.fases[fIdx];
    const faseRespaldo = respaldo.fases[fIdx];
    if (!faseCruda) return faseRespaldo;

    const retosCompletos = faseRespaldo.retos_grados.map((retoResp, nIdx) => {
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

      const opcionesFinales = generarOpcionesParaRespuesta(
        respStr,
        retoEncontrado.opciones
      );

      return {
        ...retoResp,
        ...retoEncontrado,
        nivel_codigo: retoResp.nivel_codigo,
        nivel_nombre: retoResp.nivel_nombre,
        tema_curricular: retoResp.tema_curricular,
        area_curricular: retoResp.area_curricular,
        explicacion_previa:
          retoEncontrado.explicacion_previa || retoResp.explicacion_previa,
        ejemplo_corto:
          retoEncontrado.ejemplo_corto || retoResp.ejemplo_corto,
        respuesta_correcta: respStr,
        opciones: opcionesFinales,
      };
    });

    return {
      numero_fase: fIdx + 1,
      titulo_fase: faseCruda.titulo_fase || faseRespaldo.titulo_fase,
      prompt_sdxl:
        faseCruda.prompt_sdxl ||
        faseRespaldo.prompt_sdxl ||
        misionCruda.prompt_sdxl_base,
      narrativa_fase:
        faseCruda.narrativa_fase || faseRespaldo.narrativa_fase,
      explicacion_general:
        faseCruda.explicacion_general || faseRespaldo.explicacion_general,
      retos_grados: retosCompletos,
    };
  });

  return {
    ...respaldo,
    ...misionCruda,
    titulo_mision: misionCruda.titulo_mision || respaldo.titulo_mision,
    fases: fasesNormalizadas,
  };
}

async function generateMissionWithLiveLLM(
  selecciones: SeleccionNivelTema[],
  contexto: string,
  apiKey: string
): Promise<MisionYuyAI | null> {
  const systemPrompt = buildDynamicSystemPrompt(selecciones, contexto);

  // 1. Si hay clave de Google AI Studio activa
  if (apiKey && !apiKey.startsWith("AQ.")) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.6,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(
            rawText.replace(/```json|```/g, "").trim()
          ) as MisionYuyAI;
          if (parsed?.titulo_mision && Array.isArray(parsed?.fases)) {
            return parsed;
          }
        }
      }
    } catch {
      // Continúa al LLM en vivo
    }
  }

  // 2. Motor LLM en vivo con reasoning_effort="low" y timeout de 28 segundos para que siempre complete
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);

    const llmRes = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai-fast",
        reasoning_effort: "low",
        messages: [
          {
            role: "system",
            content:
              "Responde únicamente con JSON válido. Genera preguntas reales del área de cada tema (Ciencia, Personal Social, Comunicación o Matemática).",
          },
          { role: "user", content: systemPrompt },
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
        ) as MisionYuyAI;
        if (
          parsed?.titulo_mision &&
          Array.isArray(parsed?.fases) &&
          parsed.fases.length >= 3
        ) {
          return parsed;
        }
      }
    }
  } catch {
    // Usa el motor multitemático por área
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tema = (body?.tema || "Aprendizaje integrado").trim();
    const contexto = (
      body?.contexto || "El tejido cooperativo del puente colgante sobre el río"
    ).trim();
    const selecciones: SeleccionNivelTema[] =
      Array.isArray(body?.selecciones) && body.selecciones.length > 0
        ? body.selecciones
        : [
            {
              nivel_codigo: "nivel_1",
              nivel_nombre: "Nivel 1 · Ciclo III",
              tema_titulo: "Las partes de las plantas nativas y su crecimiento",
              area_curricular: "Ciencia y Tecnología",
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
              tema_titulo:
                "Las regiones naturales y pisos ecológicos de los Andes",
              area_curricular: "Personal Social",
            },
          ];

    const apiKey = process.env.GEMINI_API_KEY || "";

    const misionCruda = await generateMissionWithLiveLLM(
      selecciones,
      contexto,
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
      fuente_generacion: misionCruda ? "ia_en_vivo" : "motor_multitematico",
      guardado_en_supabase: !dbError,
    });
  } catch {
    const fallback = construirMisionMultinivelContextual(
      "Saberes de la escuela",
      "El tejido cooperativo del puente colgante sobre el río"
    );
    return NextResponse.json({ mision: fallback, guardado_en_supabase: false });
  }
}
