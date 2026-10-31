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
        `- Nivel ${idx + 1}: nivel_codigo="${s.nivel_codigo}", nivel_nombre="${s.nivel_nombre}", area_curricular="${s.area_curricular || "Matemática"}", tema_curricular="${s.tema_titulo}"`
    )
    .join("\n");

  return `Eres un docente de primaria en una escuela del Perú.
Debes crear una sesión de clase interactiva dividida en 3 etapas ("numero_fase": 1, 2 y 3) ambientada en: "${contexto}".

NIVELES DEL AULA Y EL TEMA QUE TRABAJA CADA UNO HOY:
${detalleNiveles}

ESTRUCTURA PEDAGÓGICA OBLIGATORIA PARA CADA ETAPA:
1. Primero se cuenta un capítulo corto de la historia ("narrativa_fase", 2 a 3 oraciones naturales) acompañado de una descripción visual en inglés ("prompt_sdxl") para ilustrar esa escena.
2. En cada reto por nivel ("retos_grados", exactamente ${selecciones.length} objetos, uno por cada nivel), incluye:
   - "explicacion_previa": Una explicación breve y clara (1 a 2 oraciones) de la teoría o método para resolver el tema de ese nivel antes de ver la pregunta.
   - "ejemplo_corto": Un ejemplo numérico concreto resuelto paso a paso (1 línea).
   - "instruccion": La pregunta o problema conectado con la historia para que el niño resuelva.
   - "respuesta_correcta": Únicamente el número final en texto (ej: "24").
   - "opciones": Arreglo de 4 números en texto que incluya la respuesta correcta.
   - "feedback_error": Explicación breve de cómo calcularlo si el niño se equivoca.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
{
  "titulo_mision": "Título corto y natural de la clase",
  "prompt_sdxl_base": "Warm children storybook illustration of ...",
  "fases": [
    {
      "numero_fase": 1,
      "titulo_fase": "Título del capítulo 1",
      "prompt_sdxl": "Warm children storybook illustration of ...",
      "narrativa_fase": "Relato del capítulo 1...",
      "explicacion_general": "Resumen breve de lo que aprenderemos en este capítulo.",
      "retos_grados": [
        {
          "grado": 1,
          "nivel_codigo": "nivel_1",
          "nivel_nombre": "Nivel 1 · Ciclo III",
          "tema_curricular": "Tema del nivel",
          "area_curricular": "Matemática",
          "explicacion_previa": "Explicación clara y corta de cómo se resuelve este tema.",
          "ejemplo_corto": "Ejemplo: ...",
          "instruccion": "Pregunta práctica...",
          "tipo_mecanica": "input_numerico",
          "opciones": ["18", "24", "28", "32"],
          "respuesta_correcta": "24",
          "feedback_error": "Pista paso a paso..."
        }
      ]
    }
  ],
  "narrativa_victoria": "Mensaje final al terminar la clase",
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

  const fasesNormalizadas = [0, 1, 2].map((fIdx) => {
    const faseCruda = misionCruda.fases?.[fIdx];
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
      )
        .replace(/[^0-9.-]/g, "")
        .trim() || retoResp.respuesta_correcta;

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

  // 1. Intentar con Gemini API si está habilitada
  if (apiKey) {
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    ];

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        });

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
        // Pasa al motor LLM en vivo
      }
    }
  }

  // 2. Motor LLM en vivo (OpenAI / Pollinations JSON) para generar historia + teoría + preguntas reales al instante
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
              "Eres un docente de primaria experto en crear clases narrativas con explicación teórica breve y preguntas prácticas por nivel. Responde solo en JSON válido.",
          },
          { role: "user", content: systemPrompt },
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
        ) as MisionYuyAI;
        if (parsed?.titulo_mision && Array.isArray(parsed?.fases)) {
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
    const body = await req.json();
    const tema = (body?.tema || "Resolución de problemas").trim();
    const contexto = (body?.contexto || "La comunidad escolar").trim();
    const selecciones: SeleccionNivelTema[] =
      Array.isArray(body?.selecciones) && body.selecciones.length > 0
        ? body.selecciones
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
      guardado_en_supabase: !dbError,
    });
  } catch {
    const fallback = construirMisionMultinivelContextual(
      "Matemática en la comunidad",
      "Nuestra escuela"
    );
    return NextResponse.json({ mision: fallback, guardado_en_supabase: false });
  }
}
