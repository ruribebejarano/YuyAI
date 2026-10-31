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

  return `Eres un docente de primaria experto en narración escolar.
Debes crear UNA SOLA HISTORIA CONTINUA dividida en 3 capítulos conectados ("numero_fase": 1, 2 y 3) sobre: "${contexto}".
Los protagonistas en los 3 capítulos son los niños Illari, Amaru y Qori junto a su maestro.

REGLA DE CONTINUIDAD DE LA HISTORIA (MUY IMPORTANTE):
- Capítulo 1 ("numero_fase": 1): Es el INICIO por la mañana. Illari, Amaru y Qori comienzan "${contexto}" y reúnen los primeros materiales.
- Capítulo 2 ("numero_fase": 2): Es la CONTINUACIÓN DIRECTA al mediodía. Debe mencionar lo que hicieron en el Capítulo 1 y presentar el reto intermedio de la misma historia.
- Capítulo 3 ("numero_fase": 3): Es el DESENLACE por la tarde. Concluye lo trabajado en el Capítulo 2 para terminar "${contexto}".

NIVELES DEL AULA Y EL TEMA QUE TRABAJA CADA UNO EN LOS 3 CAPÍTULOS:
${detalleNiveles}

En cada capítulo, "retos_grados" debe tener exactamente ${selecciones.length} objetos (uno para cada nivel) con:
- "explicacion_previa": Explicación teórica breve (1 a 2 oraciones) del tema de ese nivel.
- "ejemplo_corto": Ejemplo numérico resuelto en 1 línea.
- "instruccion": Problema conectado con lo que ocurre en ese capítulo de la historia.
- "respuesta_correcta": Solo el número final en texto (ej: "24").
- "opciones": 4 números en texto que incluyan la respuesta correcta.
- "feedback_error": Pista paso a paso.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
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
          "area_curricular": "Matemática",
          "explicacion_previa": "Explicación corta...",
          "ejemplo_corto": "Ejemplo: ...",
          "instruccion": "Pregunta conectada al Capítulo 1...",
          "tipo_mecanica": "input_numerico",
          "opciones": ["18", "24", "28", "32"],
          "respuesta_correcta": "24",
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

  // Si el LLM no devolvió las 3 fases completas, usar la historia conectada de 3 capítulos
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

      const respStr =
        String(
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
        tema_curricular: retoResp.tema_curricular,
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

  if (apiKey && !apiKey.startsWith("AQ.")) {
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    ];

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.6,
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
        // Continúa al generador conectado
      }
    }
  }

  // Intentar con motor LLM en vivo con límite de 6 segundos para no hacer esperar al profesor
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const llmRes = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content:
              "Output valid JSON only. Ensure all 3 chapters (fases 1, 2, 3) tell a single continuous story with the same characters.",
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
          parsed.fases.length === 3
        ) {
          return parsed;
        }
      }
    }
  } catch {
    // Si tarda más de 6.5s, usa inmediatamente el motor narrativo conectado por temas
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tema = (body?.tema || "Resolución de problemas").trim();
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
      "El tejido cooperativo del puente colgante sobre el río"
    );
    return NextResponse.json({ mision: fallback, guardado_en_supabase: false });
  }
}
