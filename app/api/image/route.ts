import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

function extractBase64Image(output: unknown): string | null {
  if (!output) return null;
  if (typeof output === "string" && output.length > 64) {
    return output.startsWith("data:image") || output.startsWith("http")
      ? output
      : `data:image/png;base64,${output}`;
  }
  if (typeof output === "object" && output !== null) {
    const obj = output as Record<string, unknown>;
    if (typeof obj.image_url === "string") {
      return obj.image_url.startsWith("data:image") || obj.image_url.startsWith("http")
        ? obj.image_url
        : `data:image/png;base64,${obj.image_url}`;
    }
    if (typeof obj.image === "string") {
      return obj.image.startsWith("data:image") || obj.image.startsWith("http")
        ? obj.image
        : `data:image/png;base64,${obj.image}`;
    }
    if (Array.isArray(obj.images) && obj.images.length > 0) {
      const first = obj.images[0];
      const raw =
        typeof first === "string"
          ? first
          : typeof (first as Record<string, unknown>)?.image === "string"
          ? ((first as Record<string, unknown>).image as string)
          : null;
      if (raw) {
        return raw.startsWith("data:image") || raw.startsWith("http")
          ? raw
          : `data:image/png;base64,${raw}`;
      }
    }
  }
  return null;
}

async function runSdxlTurboJob(
  endpointId: string,
  runpodKey: string,
  prompt: string
): Promise<string | null> {
  // Limpiar cualquier estereotipo forzado antiguo si viniera de caché
  const cleanPrompt = prompt
    .replace(/Andean rural school children|Andean school children|Andean primary school/gi, "friendly primary school students")
    .replace(/Andean mountains/gi, "bright modern school setting");

  const response = await fetch(`https://api.runpod.ai/v2/${endpointId}/runsync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runpodKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt: `${cleanPrompt}, modern colorful educational storybook illustration, cheerful primary school kids learning together, Pixar and Ghibli inspired digital art, high quality`,
        num_inference_steps: 1,
        guidance_scale: 0.0,
      },
    }),
  });

  if (!response.ok) return null;
  let data = await response.json();

  if (data?.status === "COMPLETED" && data?.output) {
    return extractBase64Image(data.output);
  }

  const jobId = data?.id;
  if (jobId && (data?.status === "IN_QUEUE" || data?.status === "IN_PROGRESS")) {
    for (let i = 0; i < 14; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(
        `https://api.runpod.ai/v2/${endpointId}/status/${jobId}`,
        {
          headers: { Authorization: `Bearer ${runpodKey}` },
        }
      );
      if (!statusRes.ok) break;
      data = await statusRes.json();
      if (data?.status === "COMPLETED" && data?.output) {
        return extractBase64Image(data.output);
      }
      if (data?.status === "FAILED") {
        break;
      }
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, tipo = "base" } = await req.json();
    const fallbackUrl =
      tipo === "victoria"
        ? "/fallbacks/andes-victory.svg"
        : "/fallbacks/andes-bg.svg";

    const runpodKey = process.env.RUNPOD_API_KEY || "";
    const endpointId = process.env.RUNPOD_ENDPOINT_ID || "ed7551wjzbibke";

    if (!runpodKey || !endpointId || !prompt) {
      return NextResponse.json({
        imageUrl: fallbackUrl,
        source: "fallback",
      });
    }

    let imageUrl = await runSdxlTurboJob(endpointId, runpodKey, prompt);
    if (!imageUrl) {
      imageUrl = await runSdxlTurboJob(endpointId, runpodKey, prompt);
    }

    if (imageUrl) {
      return NextResponse.json({
        imageUrl,
        source: "runpod-sdxl-turbo",
      });
    }

    return NextResponse.json({
      imageUrl: fallbackUrl,
      source: "fallback",
    });
  } catch {
    return NextResponse.json({
      imageUrl: "/fallbacks/andes-bg.svg",
      source: "fallback",
    });
  }
}
