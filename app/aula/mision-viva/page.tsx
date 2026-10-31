"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Compass,
  Sparkles,
  Award,
  Layers,
  BookOpen,
  Wand2,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import {
  MISION_INICIAL_DEMO,
  generarOpcionesParaRespuesta,
} from "@/lib/default-missions";
import { MisionYuyAI, RetoGrado } from "@/lib/types";
import { supabase } from "@/lib/supabase";

function normalizarTextoComparacion(str: string): string {
  return String(str || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function MisionVivaPage() {
  const [mision, setMision] = useState<MisionYuyAI>(MISION_INICIAL_DEMO);
  const [faseIndex, setFaseIndex] = useState<number>(0);

  const [pasoEtapa, setPasoEtapa] = useState<"historia" | "preguntas">(
    "historia"
  );

  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [resueltos, setResueltos] = useState<Record<number, boolean>>({});
  const [erroresShake, setErroresShake] = useState<Record<number, number>>({});
  const [feedbackError, setFeedbackError] = useState<
    Record<number, string | null>
  >({});

  const [misionCompletada, setMisionCompletada] = useState(false);

  const [bgImageUrl, setBgImageUrl] = useState<string>(
    "/fallbacks/andes-bg.svg"
  );
  const [cargandoImagen, setCargandoImagen] = useState<boolean>(false);
  const [promptEscenaExtra, setPromptEscenaExtra] = useState<string>("");
  const [tiempoGeneracionSeg, setTiempoGeneracionSeg] = useState<string | null>(
    null
  );

  const erroresTotalesRef = useRef<number>(0);
  const intentosTotalesRef = useRef<number>(0);
  const inicioTimestampRef = useRef<number>(Date.now());

  useEffect(() => {
    try {
      localStorage.removeItem("yuyai_mision_activa");
      const guardada = localStorage.getItem("yuyai_mision_activa_v3");
      if (guardada) {
        const parsed = JSON.parse(guardada) as MisionYuyAI;
        if (parsed && Array.isArray(parsed.fases) && parsed.fases.length > 0) {
          const fasesCorregidas = parsed.fases.map((f, fIdx) => {
            const retosBase =
              MISION_INICIAL_DEMO.fases[fIdx]?.retos_grados ||
              MISION_INICIAL_DEMO.fases[0].retos_grados;
            const existentes = Array.isArray(f.retos_grados)
              ? f.retos_grados
              : [];
            const completos =
              existentes.length >= 2
                ? existentes
                : retosBase.map((rb, idx) => existentes[idx] || rb);

            return {
              ...f,
              retos_grados: completos.map((r, rIdx) => ({
                ...retosBase[rIdx % retosBase.length],
                ...r,
                explicacion_previa:
                  r.explicacion_previa ||
                  retosBase[rIdx % retosBase.length].explicacion_previa,
                ejemplo_corto:
                  r.ejemplo_corto ||
                  retosBase[rIdx % retosBase.length].ejemplo_corto,
                opciones: generarOpcionesParaRespuesta(
                  r.respuesta_correcta,
                  r.opciones
                ),
              })),
            };
          });
          setMision({ ...parsed, fases: fasesCorregidas });
        }
      }
    } catch {
      // Mantiene misión por defecto
    }
    inicioTimestampRef.current = Date.now();
  }, []);

  const faseActual = mision.fases[faseIndex] || mision.fases[0];
  const retosActuales: RetoGrado[] = faseActual.retos_grados || [];

  const hablarTexto = useCallback((texto: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "es-PE";
      utterance.rate = 0.96;
      utterance.pitch = 1.03;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignorar si no hay gesto previo
    }
  }, []);

  const ilustrarCapituloEnVivo = useCallback(
    async (escenaPersonalizada?: string) => {
      setCargandoImagen(true);
      const t0 = performance.now();
      const promptBase = misionCompletada
        ? mision.prompt_sdxl_victoria
        : faseActual.prompt_sdxl ||
          `${mision.prompt_sdxl_base}, chapter ${faseActual.numero_fase}`;
      const promptFinal = escenaPersonalizada
        ? `Modern colorful children storybook illustration of ${escenaPersonalizada}, bright primary school setting, vibrant colors`
        : promptBase;

      try {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptFinal }),
        });
        const data = await res.json();
        if (data?.imageUrl) {
          setBgImageUrl(data.imageUrl);
          setTiempoGeneracionSeg(
            ((performance.now() - t0) / 1000).toFixed(1)
          );
        }
      } catch {
        setBgImageUrl("/fallbacks/andes-bg.svg");
      } finally {
        setCargandoImagen(false);
      }
    },
    [
      faseActual.numero_fase,
      faseActual.prompt_sdxl,
      mision.prompt_sdxl_base,
      mision.prompt_sdxl_victoria,
      misionCompletada,
    ]
  );

  useEffect(() => {
    ilustrarCapituloEnVivo();
  }, [faseIndex, misionCompletada, ilustrarCapituloEnVivo]);

  const dispararConfeti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
        colors: ["#D4653B", "#238564", "#F59E0B", "#2B6CB0"],
      });
    } catch {
      // Ignorar
    }
  };

  // Soporta respuestas de texto (Ciencia, Personal Social, Comunicación) Y numéricas (Matemática)
  const verificarValorNivel = (
    idx: number,
    reto: RetoGrado,
    valorProbar: string
  ) => {
    if (resueltos[idx]) return;
    intentosTotalesRef.current += 1;

    setRespuestas((prev) => ({ ...prev, [idx]: valorProbar }));
    const ingresadoNorm = normalizarTextoComparacion(valorProbar);
    const esperadoNorm = normalizarTextoComparacion(reto.respuesta_correcta);

    const numIngresado = Number(valorProbar.trim().replace(",", "."));
    const numEsperado = Number(
      String(reto.respuesta_correcta).trim().replace(",", ".")
    );

    const coincideTexto =
      ingresadoNorm !== "" && ingresadoNorm === esperadoNorm;
    const coincideNumero =
      valorProbar.trim() !== "" &&
      !Number.isNaN(numIngresado) &&
      !Number.isNaN(numEsperado) &&
      Math.abs(numIngresado - numEsperado) < 0.01;

    if (coincideTexto || coincideNumero) {
      setResueltos((prev) => ({ ...prev, [idx]: true }));
      setFeedbackError((prev) => ({ ...prev, [idx]: null }));
      const nombreNivel = reto.nivel_nombre || `Nivel ${idx + 1}`;
      hablarTexto(
        `¡Muy bien ${nombreNivel}! La respuesta ${reto.respuesta_correcta} es correcta.`
      );
      dispararConfeti();
    } else {
      erroresTotalesRef.current += 1;
      setErroresShake((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
      setFeedbackError((prev) => ({ ...prev, [idx]: reto.feedback_error }));
      hablarTexto(reto.feedback_error);
    }
  };

  const nivelesListosCount = Object.values(resueltos).filter(Boolean).length;
  const todosNivelesResueltos =
    retosActuales.length > 0 &&
    retosActuales.every((_, idx) => Boolean(resueltos[idx]));

  const avanzarSiguienteCapitulo = async () => {
    if (faseIndex < mision.fases.length - 1) {
      setFaseIndex((prev) => prev + 1);
      setPasoEtapa("historia");
      setRespuestas({});
      setResueltos({});
      setFeedbackError({});
    } else {
      setMisionCompletada(true);
      dispararConfeti();
      hablarTexto(
        mision.narrativa_victoria ||
          "¡Felicitaciones a todos los niveles del aula! Hemos terminado la clase de hoy."
      );

      const duracionSegundos = Math.max(
        15,
        Math.round((Date.now() - inicioTimestampRef.current) / 1000)
      );
      try {
        await supabase.from("sesiones_aula").insert({
          mision_id: mision.id?.startsWith("default-")
            ? null
            : mision.id || null,
          metricas: {
            tasa_exito: Math.max(70, 100 - erroresTotalesRef.current * 5),
            tiempo_promedio_seg: duracionSegundos,
            intentos_totales: intentosTotalesRef.current,
            errores_tts_activados: erroresTotalesRef.current,
          },
        });
      } catch {
        // Silencioso
      }
    }
  };

  const reiniciarMision = () => {
    setFaseIndex(0);
    setPasoEtapa("historia");
    setRespuestas({});
    setResueltos({});
    setFeedbackError({});
    setMisionCompletada(false);
    erroresTotalesRef.current = 0;
    intentosTotalesRef.current = 0;
    inicioTimestampRef.current = Date.now();
  };

  const estilosNivel = [
    {
      nombreCorto: "Nivel 1 · Ciclo III",
      badge: "bg-valle-100 text-valle-700 border-valle-500/30",
      cardBg: "bg-valle-50/60",
      btn: "bg-valle-600 hover:bg-valle-700",
      chipHover: "hover:border-valle-500 hover:bg-valle-50",
    },
    {
      nombreCorto: "Nivel 2 · Ciclo IV",
      badge: "bg-lago-100 text-lago-600 border-lago-500/30",
      cardBg: "bg-lago-50/60",
      btn: "bg-lago-600 hover:bg-lago-500",
      chipHover: "hover:border-lago-500 hover:bg-lago-50",
    },
    {
      nombreCorto: "Nivel 3 · Ciclo V",
      badge: "bg-terracotta-100 text-terracotta-700 border-terracotta-500/30",
      cardBg: "bg-terracotta-50/60",
      btn: "bg-terracotta-500 hover:bg-terracotta-600",
      chipHover: "hover:border-terracotta-500 hover:bg-terracotta-50",
    },
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-crema-100 text-tierra-900 flex flex-col">
      {/* BARRA SUPERIOR LIMPIA */}
      <header className="shrink-0 border-b border-crema-300 bg-crema-50 px-4 sm:px-6 py-2.5">
        <div className="max-w-[1550px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/maestro/dashboard"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-crema-200 border border-crema-300 text-xs font-bold text-tierra-800 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Sala del Docente</span>
            </Link>
            <h1 className="text-sm sm:text-base font-bold text-tierra-900 truncate">
              {mision.titulo_mision}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {mision.fases.map((f, idx) => {
              const activa = idx === faseIndex && !misionCompletada;
              const superada = idx < faseIndex || misionCompletada;
              return (
                <button
                  key={f.numero_fase}
                  type="button"
                  onClick={() => {
                    if (!misionCompletada) {
                      setFaseIndex(idx);
                      setPasoEtapa("historia");
                      setRespuestas({});
                      setResueltos({});
                      setFeedbackError({});
                    }
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    activa
                      ? "bg-terracotta-500 text-white border-terracotta-600 shadow-sm"
                      : superada
                      ? "bg-valle-100 text-valle-700 border-valle-500/30"
                      : "bg-white text-tierra-600 border-crema-300 hover:bg-crema-100"
                  }`}
                >
                  <span>Capítulo {f.numero_fase}</span>
                  {superada && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {!misionCompletada && (
            <div className="flex items-center bg-crema-200/80 p-1 rounded-xl border border-crema-300">
              <button
                type="button"
                onClick={() => setPasoEtapa("historia")}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  pasoEtapa === "historia"
                    ? "bg-white text-terracotta-600 shadow-sm"
                    : "text-tierra-700 hover:text-tierra-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Cuento y Explicación</span>
              </button>
              <button
                type="button"
                onClick={() => setPasoEtapa("preguntas")}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  pasoEtapa === "preguntas"
                    ? "bg-white text-valle-700 shadow-sm"
                    : "text-tierra-700 hover:text-tierra-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  2. Preguntas ({nivelesListosCount}/{retosActuales.length})
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-[1550px] w-full mx-auto px-4 sm:px-6 py-3 min-h-0 flex flex-col">
        {misionCompletada ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 rounded-3xl bg-white border-2 border-valle-500 p-8 flex flex-col items-center justify-center text-center shadow-md space-y-5 max-w-2xl mx-auto my-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-valle-100 text-valle-700 flex items-center justify-center">
              <Award className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-valle-100 text-valle-700">
                ¡Sesión Completada!
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-tierra-900">
                ¡Felicitaciones a los 3 Niveles del Salón!
              </h2>
              <p className="text-sm sm:text-base text-tierra-700">
                {mision.narrativa_victoria}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reiniciarMision}
                className="px-5 py-2.5 rounded-xl bg-crema-100 hover:bg-crema-200 text-tierra-800 border border-crema-300 font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir Sesión
              </button>
              <Link
                href="/maestro/dashboard"
                className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm shadow-sm"
              >
                Preparar Nueva Clase
              </Link>
            </div>
          </motion.div>
        ) : pasoEtapa === "historia" ? (
          /* =====================================================================
             PASO 1 DE LA ETAPA: EL CUENTO ILUSTRADO EN VIVO + EXPLICACIÓN CORTA
          ===================================================================== */
          <motion.div
            key={`historia-fase-${faseIndex}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-y-auto lg:overflow-hidden"
          >
            <section className="lg:col-span-5 rounded-3xl bg-white border-2 border-crema-300 shadow-sm overflow-hidden flex flex-col justify-between min-h-0">
              <div className="relative flex-1 min-h-[240px] bg-tierra-900 overflow-hidden">
                <img
                  src={bgImageUrl}
                  alt={
                    faseActual.titulo_fase ||
                    `Capítulo ${faseActual.numero_fase}`
                  }
                  onError={() => setBgImageUrl("/fallbacks/andes-bg.svg")}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    cargandoImagen
                      ? "scale-105 blur-sm opacity-75"
                      : "animate-kenburns"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tierra-900/85 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-crema-50/95 text-tierra-900 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                    {cargandoImagen
                      ? "Ilustrando escena en vivo..."
                      : `Escena ilustrada al instante ${
                          tiempoGeneracionSeg ? `(${tiempoGeneracionSeg}s)` : ""
                        }`}
                  </span>

                  <button
                    type="button"
                    disabled={cargandoImagen}
                    onClick={() => ilustrarCapituloEnVivo()}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Nueva Ilustración</span>
                  </button>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-crema-200">
                    Capítulo {faseActual.numero_fase} de {mision.fases.length}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {faseActual.titulo_fase ||
                      `Capítulo ${faseActual.numero_fase}`}
                  </h2>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!promptEscenaExtra.trim()) return;
                  ilustrarCapituloEnVivo(promptEscenaExtra.trim());
                }}
                className="p-3 bg-crema-50 border-t border-crema-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={promptEscenaExtra}
                  onChange={(e) => setPromptEscenaExtra(e.target.value)}
                  placeholder="¿Qué quieres dibujar en la escena? (ej: niños haciendo un experimento o leyendo en el jardín)"
                  className="flex-1 min-w-0 rounded-xl bg-white border border-crema-300 px-3 py-2 text-xs text-tierra-900 focus:outline-none focus:border-terracotta-500"
                />
                <button
                  type="submit"
                  disabled={cargandoImagen || !promptEscenaExtra.trim()}
                  className="px-3.5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Ilustrar</span>
                </button>
              </form>
            </section>

            <section className="lg:col-span-7 flex flex-col justify-between gap-3 min-h-0">
              <div className="rounded-2xl bg-white border-2 border-crema-300 p-4 shadow-sm shrink-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    Parte 1 · La Historia del Capítulo {faseActual.numero_fase}
                  </span>
                  <button
                    type="button"
                    onClick={() => hablarTexto(faseActual.narrativa_fase)}
                    className="px-3 py-1 rounded-xl bg-crema-100 hover:bg-crema-200 text-tierra-800 border border-crema-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Escuchar Historia</span>
                  </button>
                </div>
                <p className="text-sm sm:text-base font-medium text-tierra-900 leading-relaxed">
                  “{faseActual.narrativa_fase}”
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-2.5 min-h-0">
                <div className="flex items-center justify-between px-1 shrink-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-valle-700 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-valle-600" />
                    Parte 2 · Explicación del Tema para cada Nivel
                  </span>
                </div>

                <div className="flex-1 grid grid-cols-1 gap-2.5 min-h-0">
                  {retosActuales.map((reto, idx) => {
                    const est = estilosNivel[idx % estilosNivel.length];
                    const etiquetaNivel =
                      reto.nivel_nombre || est.nombreCorto;

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl bg-white border border-crema-300 px-4 py-3 shadow-sm flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${est.badge}`}
                            >
                              {etiquetaNivel}
                            </span>
                            {reto.area_curricular && (
                              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-crema-100 text-tierra-700 shrink-0">
                                {reto.area_curricular}
                              </span>
                            )}
                            <span className="text-xs font-bold text-tierra-800 truncate">
                              {reto.tema_curricular}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              hablarTexto(
                                `${etiquetaNivel}. ${
                                  reto.explicacion_previa || ""
                                } ${reto.ejemplo_corto || ""}`
                              )
                            }
                            className="p-1.5 rounded-lg bg-crema-100 hover:bg-crema-200 text-tierra-700 cursor-pointer shrink-0"
                            title="Escuchar explicación en voz alta"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-terracotta-500" />
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-tierra-800 my-1 leading-snug">
                          {reto.explicacion_previa}
                        </p>

                        {reto.ejemplo_corto && (
                          <div
                            className={`px-3 py-1.5 rounded-xl border border-crema-200 text-xs font-bold text-tierra-900 ${est.cardBg}`}
                          >
                            💡 {reto.ejemplo_corto}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPasoEtapa("preguntas")}
                className="shrink-0 w-full py-3.5 px-6 rounded-2xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <span>
                  ¡Listo! Pasar a Resolver las Preguntas del Capítulo{" "}
                  {faseActual.numero_fase}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </section>
          </motion.div>
        ) : (
          /* =====================================================================
             PASO 2 DE LA ETAPA: LAS PREGUNTAS POR NIVEL (CIENCIA, SOCIAL, COMUNICACIÓN O MATEMÁTICA)
          ===================================================================== */
          <motion.div
            key={`preguntas-fase-${faseIndex}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-y-auto lg:overflow-hidden"
          >
            <section className="lg:col-span-4 rounded-3xl bg-white border-2 border-crema-300 shadow-sm overflow-hidden flex flex-col justify-between min-h-0">
              <div className="relative flex-1 min-h-[180px] bg-tierra-900 overflow-hidden">
                <img
                  src={bgImageUrl}
                  alt={faseActual.titulo_fase || "Escenario"}
                  onError={() => setBgImageUrl("/fallbacks/andes-bg.svg")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tierra-900/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3.5 right-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-crema-200">
                    Capítulo {faseActual.numero_fase} · Preguntas por Nivel
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {faseActual.titulo_fase}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-3 bg-crema-50 border-t border-crema-200">
                <div className="flex items-center justify-between text-xs font-bold text-tierra-800">
                  <span>Avance del Salón:</span>
                  <span className="text-valle-700">
                    {nivelesListosCount} de {retosActuales.length} niveles
                    completados
                  </span>
                </div>

                <div className="space-y-1.5">
                  {retosActuales.map((r, i) => {
                    const listo = Boolean(resueltos[i]);
                    return (
                      <div
                        key={i}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border ${
                          listo
                            ? "bg-valle-100 text-valle-700 border-valle-500/30"
                            : "bg-white text-tierra-700 border-crema-200"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          {r.nivel_nombre ||
                            estilosNivel[i % estilosNivel.length].nombreCorto}
                        </span>
                        <span>{listo ? "✓ Completado" : "Resolviendo..."}</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setPasoEtapa("historia")}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-crema-100 border border-crema-300 text-xs font-bold text-tierra-800 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Volver a ver el Cuento y la Explicación</span>
                </button>
              </div>
            </section>

            <section className="lg:col-span-8 flex flex-col justify-between gap-2.5 min-h-0">
              {todosNivelesResueltos && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shrink-0 p-3 rounded-2xl bg-valle-600 text-white flex items-center justify-between gap-3 shadow-md"
                >
                  <span className="text-sm font-bold">
                    🎉 ¡Los 3 niveles respondieron correctamente este capítulo!
                  </span>
                  <button
                    type="button"
                    onClick={avanzarSiguienteCapitulo}
                    className="px-4 py-2 rounded-xl bg-white text-valle-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>
                      {faseIndex < mision.fases.length - 1
                        ? `Ir al Capítulo ${faseIndex + 2}`
                        : "Finalizar la Clase"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              <div className="flex-1 flex flex-col justify-between gap-2.5 min-h-0">
                {retosActuales.map((reto, idx) => {
                  const estaResuelto = Boolean(resueltos[idx]);
                  const numErrores = erroresShake[idx] || 0;
                  const mensajePista = feedbackError[idx] || null;
                  const est = estilosNivel[idx % estilosNivel.length];
                  const etiquetaNivel =
                    reto.nivel_nombre || est.nombreCorto;
                  const opciones = generarOpcionesParaRespuesta(
                    reto.respuesta_correcta,
                    reto.opciones
                  );
                  const esNumerica = !Number.isNaN(
                    Number(
                      String(reto.respuesta_correcta).trim().replace(",", ".")
                    )
                  );

                  return (
                    <motion.div
                      key={`${faseActual.numero_fase}-${idx}-${numErrores}`}
                      animate={
                        numErrores > 0 && !estaResuelto
                          ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
                          : { x: 0 }
                      }
                      transition={{ duration: 0.4 }}
                      className={`flex-1 rounded-2xl bg-white border-2 shadow-sm px-4 py-3 flex flex-col justify-between transition-all min-h-0 ${
                        estaResuelto
                          ? "border-valle-500 bg-valle-50/30"
                          : mensajePista
                          ? "border-terracotta-500"
                          : "border-crema-300"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${est.badge}`}
                          >
                            {etiquetaNivel}
                          </span>
                          {reto.area_curricular && (
                            <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-crema-100 text-tierra-700 shrink-0">
                              {reto.area_curricular}
                            </span>
                          )}
                          <span className="text-xs text-tierra-600 truncate">
                            {reto.tema_curricular}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const ayuda =
                                reto.ejemplo_corto || reto.feedback_error;
                              setFeedbackError((prev) => ({
                                ...prev,
                                [idx]: ayuda,
                              }));
                              hablarTexto(ayuda);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-crema-100 hover:bg-crema-200 text-tierra-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-terracotta-500" />
                            <span>Pista</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => hablarTexto(reto.instruccion)}
                            className="p-1.5 rounded-lg bg-crema-100 hover:bg-crema-200 text-tierra-700 cursor-pointer"
                            title="Leer pregunta en voz alta"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-terracotta-500" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base font-bold text-tierra-900 leading-snug my-1">
                        {reto.instruccion}
                      </p>

                      <AnimatePresence mode="wait">
                        {mensajePista && !estaResuelto && (
                          <motion.div
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="px-3 py-1.5 rounded-xl bg-terracotta-50 border border-terracotta-500/30 text-terracotta-700 text-xs font-medium flex items-center gap-2 mb-1"
                          >
                            <Volume2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{mensajePista}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {estaResuelto ? (
                        <div className="px-3 py-2 rounded-xl bg-valle-100/80 border border-valle-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-valle-600 shrink-0" />
                            <span className="font-bold text-xs sm:text-sm text-valle-700">
                              ¡Correcto: {reto.respuesta_correcta}!
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap flex-1">
                            {opciones.map((op) => (
                              <button
                                key={op}
                                type="button"
                                onClick={() =>
                                  verificarValorNivel(idx, reto, op)
                                }
                                className={`px-3 py-1.5 rounded-xl bg-crema-50 border-2 border-crema-300 font-bold text-xs sm:text-sm text-tierra-900 text-left transition-all cursor-pointer shadow-sm active:scale-95 ${est.chipHover}`}
                              >
                                {op}
                              </button>
                            ))}
                          </div>

                          {esNumerica && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <input
                                type="number"
                                inputMode="numeric"
                                value={respuestas[idx] || ""}
                                onChange={(e) =>
                                  setRespuestas((prev) => ({
                                    ...prev,
                                    [idx]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    verificarValorNivel(
                                      idx,
                                      reto,
                                      respuestas[idx] || ""
                                    );
                                  }
                                }}
                                placeholder="N.°"
                                className="w-20 rounded-xl bg-crema-50 border-2 border-crema-300 px-2.5 py-1 text-sm font-bold text-tierra-900 focus:outline-none focus:border-terracotta-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  verificarValorNivel(
                                    idx,
                                    reto,
                                    respuestas[idx] || ""
                                  )
                                }
                                className={`px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow-sm transition-all cursor-pointer ${est.btn}`}
                              >
                                Comprobar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
