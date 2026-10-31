"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Compass,
  Sparkles,
  Award,
  Layers,
  BookOpen,
} from "lucide-react";
import { MISION_INICIAL_DEMO } from "@/lib/default-missions";
import { MisionYuyAI, RetoGrado } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function MisionVivaPage() {
  const [mision, setMision] = useState<MisionYuyAI>(MISION_INICIAL_DEMO);
  const [faseIndex, setFaseIndex] = useState<number>(0);

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

  const erroresTotalesRef = useRef<number>(0);
  const intentosTotalesRef = useRef<number>(0);
  const inicioTimestampRef = useRef<number>(Date.now());

  useEffect(() => {
    try {
      const guardada = localStorage.getItem("yuyai_mision_activa");
      if (guardada) {
        const parsed = JSON.parse(guardada);
        if (parsed && Array.isArray(parsed.fases) && parsed.fases.length > 0) {
          setMision(parsed);
        }
      }
    } catch {
      // Mantiene misión demo por defecto
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
      utterance.pitch = 1.04;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Silencioso si el navegador bloquea TTS sin gesto previo
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    async function cargarIlustracionEscenario() {
      setCargandoImagen(true);
      const promptUsar = misionCompletada
        ? mision.prompt_sdxl_victoria
        : `${mision.prompt_sdxl_base}, scene phase ${faseActual.numero_fase}`;
      try {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptUsar }),
        });
        const data = await res.json();
        if (!cancelado && data?.imageUrl) {
          setBgImageUrl(data.imageUrl);
        }
      } catch {
        if (!cancelado) setBgImageUrl("/fallbacks/andes-bg.svg");
      } finally {
        if (!cancelado) setCargandoImagen(false);
      }
    }

    cargarIlustracionEscenario();
    return () => {
      cancelado = true;
    };
  }, [
    faseIndex,
    misionCompletada,
    mision.prompt_sdxl_base,
    mision.prompt_sdxl_victoria,
    faseActual.numero_fase,
  ]);

  const dispararConfeti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#D4653B", "#238564", "#F59E0B", "#2B6CB0"],
      });
    } catch {
      // Ignorar si falla canvas
    }
  };

  const verificarRespuestaNivel = (idx: number, reto: RetoGrado) => {
    if (resueltos[idx]) return;
    intentosTotalesRef.current += 1;

    const valorLimpio = (respuestas[idx] || "").trim().replace(",", ".");
    const numeroIngresado = Number(valorLimpio);

    if (
      valorLimpio !== "" &&
      !Number.isNaN(numeroIngresado) &&
      Math.abs(numeroIngresado - Number(reto.respuesta_correcta)) < 0.01
    ) {
      setResueltos((prev) => ({ ...prev, [idx]: true }));
      setFeedbackError((prev) => ({ ...prev, [idx]: null }));
      const nombreNivel =
        reto.nivel_nombre || reto.nivel_codigo || `${reto.grado}° Grado`;
      hablarTexto(
        `¡Muy bien equipo de ${nombreNivel}! La respuesta ${reto.respuesta_correcta} es correcta.`
      );
      dispararConfeti();
    } else {
      erroresTotalesRef.current += 1;
      setErroresShake((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
      setFeedbackError((prev) => ({ ...prev, [idx]: reto.feedback_error }));
      hablarTexto(reto.feedback_error);
    }
  };

  const todosNivelesResueltos =
    retosActuales.length > 0 &&
    retosActuales.every((_, idx) => Boolean(resueltos[idx]));

  const avanzarSiguienteFase = async () => {
    if (faseIndex < mision.fases.length - 1) {
      setFaseIndex((prev) => prev + 1);
      setRespuestas({});
      setResueltos({});
      setFeedbackError({});
    } else {
      setMisionCompletada(true);
      dispararConfeti();
      hablarTexto(
        mision.narrativa_victoria ||
          "¡Felicitaciones a todos los niveles del aula! Hemos completado juntos la misión de nuestra comunidad."
      );

      const duracionSegundos = Math.max(
        15,
        Math.round((Date.now() - inicioTimestampRef.current) / 1000)
      );
      try {
        await supabase.from("sesiones_aula").insert({
          mision_id: mision.id?.startsWith("default-") ? null : mision.id || null,
          metricas: {
            tasa_exito: Math.max(
              70,
              100 - erroresTotalesRef.current * 5
            ),
            tiempo_promedio_seg: duracionSegundos,
            intentos_totales: intentosTotalesRef.current,
            errores_tts_activados: erroresTotalesRef.current,
          },
        });
      } catch {
        // Silencioso en modo autónomo
      }
    }
  };

  const reiniciarMision = () => {
    setFaseIndex(0);
    setRespuestas({});
    setResueltos({});
    setFeedbackError({});
    setMisionCompletada(false);
    erroresTotalesRef.current = 0;
    intentosTotalesRef.current = 0;
    inicioTimestampRef.current = Date.now();
  };

  const estilosPorIndice = [
    {
      badge: "bg-valle-100 text-valle-700 border-valle-500/30",
      headerBg: "bg-valle-50",
      btn: "bg-valle-600 hover:bg-valle-700",
    },
    {
      badge: "bg-lago-100 text-lago-600 border-lago-500/30",
      headerBg: "bg-lago-50",
      btn: "bg-lago-600 hover:bg-lago-500",
    },
    {
      badge: "bg-terracotta-100 text-terracotta-700 border-terracotta-500/30",
      headerBg: "bg-terracotta-50",
      btn: "bg-terracotta-500 hover:bg-terracotta-600",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-crema-100 text-tierra-900 flex flex-col justify-between pb-10">
      {/* Barra Superior Cálida y Clara */}
      <header className="sticky top-0 z-30 border-b border-crema-300 bg-crema-50/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/maestro/dashboard"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-crema-100 border border-crema-300 text-xs sm:text-sm font-bold text-tierra-800 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Compass className="w-4 h-4 text-terracotta-500" />
              Cuaderno del Docente
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 truncate">
                Sesión Vivencial Multinivel
              </p>
              <h1 className="text-base sm:text-lg font-bold text-tierra-900 truncate">
                {mision.titulo_mision}
              </h1>
            </div>
          </div>

          {/* Indicador de las 3 Fases Pedagógicas */}
          <div className="flex items-center gap-2">
            {mision.fases.map((f, idx) => {
              const activa = idx === faseIndex && !misionCompletada;
              const superada = idx < faseIndex || misionCompletada;
              return (
                <div
                  key={f.numero_fase}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activa
                      ? "bg-terracotta-500 text-white border-terracotta-600 shadow-sm"
                      : superada
                      ? "bg-valle-100 text-valle-700 border-valle-500/30"
                      : "bg-white text-tierra-600 border-crema-300"
                  }`}
                >
                  <span>Fase {f.numero_fase}</span>
                  {superada && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenido Principal Responsivo (Cero Desbordes) */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 space-y-6 flex-1">
        {/* Banner Escenario Ilustrado (RunPod SDXL Turbo + Relato Comunitario) */}
        <section className="relative rounded-3xl overflow-hidden border-2 border-crema-300 shadow-sm bg-tierra-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] overflow-hidden bg-tierra-800">
              <img
                src={bgImageUrl}
                alt={`Escenario Fase ${faseActual.numero_fase}`}
                onError={() => setBgImageUrl("/fallbacks/andes-bg.svg")}
                className="w-full h-full object-cover animate-kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tierra-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-crema-50/95 text-tierra-900 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                  {cargandoImagen
                    ? "Pintando los colores de nuestra tierra..."
                    : `Escenario Fase ${faseActual.numero_fase}`}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 p-5 sm:p-7 bg-crema-50 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-terracotta-100 text-terracotta-700 border border-terracotta-500/30">
                    Fase {faseActual.numero_fase} de {mision.fases.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => hablarTexto(faseActual.narrativa_fase)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-crema-100 text-tierra-800 border border-crema-300 text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-terracotta-500" />
                    Escuchar Relato en Voz Alta
                  </button>
                </div>

                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-tierra-900 leading-snug break-words pt-1">
                  “{faseActual.narrativa_fase}”
                </p>
              </div>

              <div className="pt-2 border-t border-crema-200 flex flex-wrap items-center justify-between gap-2 text-xs text-tierra-600">
                <span>
                  Cada <strong>Nivel del Aula</strong> resuelve su propio reto
                  para que toda la comunidad avance junta.
                </span>
                <span className="font-bold text-valle-700">
                  {Object.values(resueltos).filter(Boolean).length} de{" "}
                  {retosActuales.length} niveles listos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pizarra Multinivel o Celebración de Victoria */}
        {!misionCompletada ? (
          <section className="space-y-5">
            <div
              className={`grid grid-cols-1 gap-5 ${
                retosActuales.length === 2
                  ? "md:grid-cols-2"
                  : retosActuales.length >= 3
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "max-w-2xl mx-auto"
              }`}
            >
              {retosActuales.map((reto, idx) => {
                const estaResuelto = Boolean(resueltos[idx]);
                const numErrores = erroresShake[idx] || 0;
                const mensajePista = feedbackError[idx] || null;
                const est = estilosPorIndice[idx % estilosPorIndice.length];
                const etiquetaNivel =
                  reto.nivel_nombre ||
                  reto.nivel_codigo ||
                  `Nivel ${reto.grado || idx + 1}`;

                return (
                  <motion.div
                    key={`${faseActual.numero_fase}-${idx}-${numErrores}`}
                    animate={
                      numErrores > 0 && !estaResuelto
                        ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.45 }}
                    className={`rounded-3xl bg-white border-2 shadow-sm flex flex-col justify-between overflow-hidden transition-all min-w-0 ${
                      estaResuelto
                        ? "border-valle-500 ring-2 ring-valle-500/20"
                        : mensajePista
                        ? "border-terracotta-500"
                        : "border-crema-300"
                    }`}
                  >
                    <div>
                      <div
                        className={`p-4 sm:p-5 border-b border-crema-200 ${est.headerBg}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${est.badge}`}
                          >
                            <Layers className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{etiquetaNivel}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => hablarTexto(reto.instruccion)}
                            className="p-2 rounded-xl bg-white hover:bg-crema-100 text-tierra-700 border border-crema-300 transition-colors cursor-pointer shrink-0"
                            title="Escuchar pregunta del nivel"
                          >
                            <Volume2 className="w-4 h-4 text-terracotta-500" />
                          </button>
                        </div>

                        {reto.tema_curricular && (
                          <p className="text-xs text-tierra-700 mt-1 flex items-center gap-1.5 break-words font-medium">
                            <BookOpen className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                            <span>{reto.tema_curricular}</span>
                          </p>
                        )}
                      </div>

                      <div className="p-4 sm:p-5">
                        <p className="text-base sm:text-lg font-bold text-tierra-900 leading-relaxed break-words">
                          {reto.instruccion}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 pt-0 space-y-3">
                      <AnimatePresence mode="wait">
                        {mensajePista && !estaResuelto && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-3.5 rounded-2xl bg-terracotta-50 border border-terracotta-500/30 text-terracotta-700 text-xs sm:text-sm font-medium flex items-start gap-2.5"
                          >
                            <Volume2 className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                            <span className="break-words">{mensajePista}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {estaResuelto ? (
                        <div className="p-4 rounded-2xl bg-valle-50 border border-valle-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-6 h-6 text-valle-600 shrink-0" />
                            <div>
                              <p className="font-bold text-sm text-valle-700">
                                ¡Reto superado!
                              </p>
                              <p className="text-xs text-tierra-600">
                                Respuesta correcta:{" "}
                                <strong>{reto.respuesta_correcta}</strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
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
                                verificarRespuestaNivel(idx, reto);
                              }
                            }}
                            placeholder="Escribe el número..."
                            className="flex-1 min-w-0 rounded-2xl bg-crema-50 border-2 border-crema-300 px-4 py-3 text-xl font-bold text-tierra-900 placeholder:text-tierra-600/50 focus:outline-none focus:border-terracotta-500"
                          />
                          <button
                            type="button"
                            onClick={() => verificarRespuestaNivel(idx, reto)}
                            className={`px-5 py-3.5 rounded-2xl text-white font-bold text-sm shadow-sm transition-all cursor-pointer shrink-0 ${est.btn}`}
                          >
                            Comprobar
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {todosNivelesResueltos && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-2"
              >
                <button
                  type="button"
                  onClick={avanzarSiguienteFase}
                  className="px-8 py-4 rounded-2xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-base sm:text-lg shadow-md flex items-center gap-3 transition-all cursor-pointer"
                >
                  <span>
                    {faseIndex < mision.fases.length - 1
                      ? "¡Todos los niveles listos! Avanzar a la siguiente etapa"
                      : "¡Culminar Misión Comunitaria del Aula!"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </section>
        ) : (
          <motion.section
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto rounded-3xl bg-white border-2 border-valle-500 p-6 sm:p-8 text-center shadow-md space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-terracotta-50 border border-terracotta-500/30 flex items-center justify-center mx-auto text-terracotta-600">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-valle-100 text-valle-700">
                ¡Ayni Pedagógico Cumplido!
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-tierra-900">
                ¡Toda el Aula Completó la Misión!
              </h2>
              <p className="text-sm sm:text-base text-tierra-700">
                {mision.narrativa_victoria ||
                  `Cada nivel aportó sus conocimientos en ${mision.titulo_mision} y el progreso de la sesión ya quedó registrado en el cuaderno del docente.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={reiniciarMision}
                className="px-5 py-3 rounded-2xl bg-crema-100 hover:bg-crema-200 text-tierra-800 border border-crema-300 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir esta Misión
              </button>
              <Link
                href="/maestro/dashboard"
                className="px-6 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm shadow-sm transition-colors"
              >
                Volver al Cuaderno del Docente
              </Link>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
