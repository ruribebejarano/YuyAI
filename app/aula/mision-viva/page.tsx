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
  Wand2,
  HelpCircle,
  Calculator,
  Plus,
  Minus,
} from "lucide-react";
import {
  MISION_INICIAL_DEMO,
  generarOpcionesParaRespuesta,
} from "@/lib/default-missions";
import { MisionYuyAI, RetoGrado } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const ELEMENTOS_MAGICOS_ESCENA = [
  {
    label: "🦅 Cóndor de los Apus",
    extraPrompt:
      "with a majestic Andean condor soaring over the children in golden sunlight",
  },
  {
    label: "🦙 Caravana de Alpacas",
    extraPrompt:
      "with cute fluffy white and brown alpacas wearing colorful woven tassels",
  },
  {
    label: "🌈 Arcoíris en el Valle",
    extraPrompt:
      "with a bright double rainbow arching across the green terraced mountains",
  },
  {
    label: "🎶 Músicos con Quenas",
    extraPrompt:
      "with joyful villagers playing traditional Andean flutes and drums",
  },
];

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

  // Estado del Lienzo Vivo RunPod SDXL Turbo
  const [bgImageUrl, setBgImageUrl] = useState<string>(
    "/fallbacks/andes-bg.svg"
  );
  const [cargandoImagen, setCargandoImagen] = useState<boolean>(false);
  const [detallePersonalizado, setDetallePersonalizado] = useState<string>("");
  const [tiempoPintadoMs, setTiempoPintadoMs] = useState<number | null>(null);
  const [fuenteImagen, setFuenteImagen] = useState<string>("runpod");

  // Yupana / Contador visual de apoyo para niños
  const [mostrarYupana, setMostrarYupana] = useState<boolean>(false);
  const [decenasYupana, setDecenasYupana] = useState<number>(2);
  const [unidadesYupana, setUnidadesYupana] = useState<number>(5);

  const erroresTotalesRef = useRef<number>(0);
  const intentosTotalesRef = useRef<number>(0);
  const inicioTimestampRef = useRef<number>(Date.now());

  useEffect(() => {
    try {
      const guardada = localStorage.getItem("yuyai_mision_activa");
      if (guardada) {
        const parsed = JSON.parse(guardada) as MisionYuyAI;
        if (parsed && Array.isArray(parsed.fases) && parsed.fases.length > 0) {
          // Si alguna misión antigua en localStorage tenía solo 1 reto, completarla a 3 niveles
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
              retos_grados: completos.map((r) => ({
                ...r,
                opciones:
                  Array.isArray(r.opciones) && r.opciones.length >= 3
                    ? r.opciones
                    : generarOpcionesParaRespuesta(r.respuesta_correcta),
              })),
            };
          });
          setMision({ ...parsed, fases: fasesCorregidas });
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

  const pintarEscenaRunPod = useCallback(
    async (extraDetalle?: string) => {
      setCargandoImagen(true);
      const t0 = performance.now();
      const promptBaseFase = misionCompletada
        ? mision.prompt_sdxl_victoria
        : faseActual.prompt_sdxl ||
          `${mision.prompt_sdxl_base}, phase ${faseActual.numero_fase}`;
      const promptFinal = extraDetalle
        ? `${promptBaseFase}, ${extraDetalle}`
        : promptBaseFase;

      try {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptFinal }),
        });
        const data = await res.json();
        if (data?.imageUrl) {
          setBgImageUrl(data.imageUrl);
          setFuenteImagen(data.source || "runpod-sdxl-turbo");
          setTiempoPintadoMs(Math.round(performance.now() - t0));
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
    pintarEscenaRunPod();
  }, [faseIndex, misionCompletada, pintarEscenaRunPod]);

  const dispararConfeti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 68,
        origin: { y: 0.65 },
        colors: ["#D4653B", "#238564", "#F59E0B", "#2B6CB0"],
      });
    } catch {
      // Ignorar si falla canvas
    }
  };

  const verificarValorNivel = (
    idx: number,
    reto: RetoGrado,
    valorProbar: string
  ) => {
    if (resueltos[idx]) return;
    intentosTotalesRef.current += 1;

    setRespuestas((prev) => ({ ...prev, [idx]: valorProbar }));
    const valorLimpio = valorProbar.trim().replace(",", ".");
    const numeroIngresado = Number(valorLimpio);

    if (
      valorLimpio !== "" &&
      !Number.isNaN(numeroIngresado) &&
      Math.abs(numeroIngresado - Number(reto.respuesta_correcta)) < 0.01
    ) {
      setResueltos((prev) => ({ ...prev, [idx]: true }));
      setFeedbackError((prev) => ({ ...prev, [idx]: null }));
      const nombreNivel =
        reto.nivel_nombre || reto.nivel_codigo || `Nivel ${idx + 1}`;
      hablarTexto(
        `¡Excelente ${nombreNivel}! La respuesta ${reto.respuesta_correcta} es correcta.`
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
      nombreCorto: "Nivel 1 · Semillas",
      badge: "bg-valle-100 text-valle-700 border-valle-500/30",
      headerBg: "bg-valle-50",
      borderActivo: "border-valle-500",
      btn: "bg-valle-600 hover:bg-valle-700",
      chipHover: "hover:border-valle-500 hover:bg-valle-50",
    },
    {
      nombreCorto: "Nivel 2 · Tejedores",
      badge: "bg-lago-100 text-lago-600 border-lago-500/30",
      headerBg: "bg-lago-50",
      borderActivo: "border-lago-500",
      btn: "bg-lago-600 hover:bg-lago-500",
      chipHover: "hover:border-lago-500 hover:bg-lago-50",
    },
    {
      nombreCorto: "Nivel 3 · Amautas",
      badge: "bg-terracotta-100 text-terracotta-700 border-terracotta-500/30",
      headerBg: "bg-terracotta-50",
      borderActivo: "border-terracotta-500",
      btn: "bg-terracotta-500 hover:bg-terracotta-600",
      chipHover: "hover:border-terracotta-500 hover:bg-terracotta-50",
    },
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-crema-100 text-tierra-900 flex flex-col">
      {/* BARRA SUPERIOR COMPACTA (56px) */}
      <header className="shrink-0 border-b border-crema-300 bg-crema-50 px-3 sm:px-5 py-2">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/maestro/dashboard"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-crema-200 border border-crema-300 text-xs font-bold text-tierra-800 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Panel Docente</span>
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-tierra-900 truncate">
                {mision.titulo_mision}
              </h1>
            </div>
          </div>

          {/* Progreso de las 3 Fases + Energía Cooperativa Ayni */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-crema-100 border border-crema-300 rounded-xl px-2.5 py-1 text-xs font-bold text-tierra-700">
              <span>Energía Ayni:</span>
              <span className="text-valle-700">
                {nivelesListosCount}/{retosActuales.length} Niveles Listos
              </span>
            </div>

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
                      setRespuestas({});
                      setResueltos({});
                      setFeedbackError({});
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                    activa
                      ? "bg-terracotta-500 text-white border-terracotta-600 shadow-sm"
                      : superada
                      ? "bg-valle-100 text-valle-700 border-valle-500/30"
                      : "bg-white text-tierra-600 border-crema-300 hover:bg-crema-100"
                  }`}
                >
                  <span>Etapa {f.numero_fase}</span>
                  {superada && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setMostrarYupana((v) => !v)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                mostrarYupana
                  ? "bg-lago-600 text-white border-lago-600"
                  : "bg-white hover:bg-crema-100 text-tierra-800 border-crema-300"
              }`}
              title="Abrir Ábaco Andino (Yupana) para contar"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ábaco Yupana</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL / PANEL FLOTANTE DE LA YUPANA (ÁBACO INTERACTIVO PARA NIÑOS) */}
      <AnimatePresence>
        {mostrarYupana && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 right-4 z-50 w-80 rounded-2xl bg-white border-2 border-lago-500 shadow-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-crema-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-lago-600 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Yupana · Contador de Semillas
              </span>
              <button
                onClick={() => setMostrarYupana(false)}
                className="text-xs font-bold text-tierra-600 hover:text-tierra-900"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-terracotta-50 border border-terracotta-500/30">
                <p className="text-[11px] font-bold text-terracotta-700">
                  DECENAS (×10)
                </p>
                <p className="text-2xl font-bold text-tierra-900 my-1">
                  {decenasYupana * 10}
                </p>
                <div className="flex flex-wrap justify-center gap-1 min-h-[24px] mb-2">
                  {Array.from({ length: decenasYupana }).map((_, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full bg-terracotta-500 inline-block"
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() =>
                      setDecenasYupana((d) => Math.max(0, d - 1))
                    }
                    className="p-1 rounded-lg bg-white border border-crema-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setDecenasYupana((d) => Math.min(12, d + 1))
                    }
                    className="p-1 rounded-lg bg-white border border-crema-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-valle-50 border border-valle-500/30">
                <p className="text-[11px] font-bold text-valle-700">
                  UNIDADES (×1)
                </p>
                <p className="text-2xl font-bold text-tierra-900 my-1">
                  {unidadesYupana}
                </p>
                <div className="flex flex-wrap justify-center gap-1 min-h-[24px] mb-2">
                  {Array.from({ length: unidadesYupana }).map((_, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-valle-500 inline-block"
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() =>
                      setUnidadesYupana((u) => Math.max(0, u - 1))
                    }
                    className="p-1 rounded-lg bg-white border border-crema-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setUnidadesYupana((u) => Math.min(19, u + 1))
                    }
                    className="p-1 rounded-lg bg-white border border-crema-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-crema-100 text-center">
              <span className="text-xs text-tierra-700">Total formado: </span>
              <strong className="text-xl font-bold text-tierra-900">
                {decenasYupana * 10 + unidadesYupana}
              </strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUERPO PRINCIPAL DIVIDIDO EN 2 COLUMNAS QUE CABEN EN 1 SOLA PANTALLA */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-5 py-3 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* COLUMNA IZQUIERDA (5 cols): MUNDO VIVO INTERACTIVO (RUNPOD SDXL TURBO + RELATO) */}
        <section className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white border-2 border-crema-300 shadow-sm overflow-hidden min-h-0">
          {/* Escenario Visual con Insignias de Logro Superpuestas */}
          <div className="relative flex-1 min-h-[200px] bg-tierra-900 overflow-hidden">
            <img
              src={bgImageUrl}
              alt={faseActual.titulo_fase || `Escenario Etapa ${faseActual.numero_fase}`}
              onError={() => setBgImageUrl("/fallbacks/andes-bg.svg")}
              className={`w-full h-full object-cover transition-all duration-700 ${
                cargandoImagen ? "scale-105 blur-[2px] opacity-80" : "animate-kenburns"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tierra-900/85 via-tierra-900/15 to-transparent" />

            {/* Etiqueta Superior: Estado de RunPod SDXL Turbo en Vivo */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-crema-50/95 text-tierra-900 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                {cargandoImagen
                  ? "Pintando escena en vivo con RunPod GPU..."
                  : fuenteImagen.includes("runpod")
                  ? `Lienzo Vivo IA ${tiempoPintadoMs ? `(${(tiempoPintadoMs / 1000).toFixed(1)}s)` : ""}`
                  : "Lienzo Ilustrado del Aula"}
              </span>

              <button
                type="button"
                onClick={() => pintarEscenaRunPod()}
                disabled={cargandoImagen}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Generar nueva ilustración en RunPod"
              >
                <Wand2 className="w-3 h-3" />
                <span>Nuevo Paisaje</span>
              </button>
            </div>

            {/* Insignias de los Niveles Desbloqueadas sobre el Paisaje */}
            <div className="absolute bottom-16 left-2.5 right-2.5 flex flex-wrap gap-1.5">
              {retosActuales.map((r, i) => {
                const listo = Boolean(resueltos[i]);
                return (
                  <div
                    key={i}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 backdrop-blur-md border transition-all ${
                      listo
                        ? "bg-valle-500/95 text-white border-white shadow-md scale-105"
                        : "bg-tierra-900/65 text-crema-100 border-white/20"
                    }`}
                  >
                    {listo ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Layers className="w-3 h-3 shrink-0 opacity-75" />
                    )}
                    <span>
                      {estilosNivel[i % estilosNivel.length].nombreCorto}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Título de la Fase sobre el pie de la imagen */}
            <div className="absolute bottom-2.5 left-3 right-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-crema-200">
                Etapa {faseActual.numero_fase} de {mision.fases.length}
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                {faseActual.titulo_fase ||
                  `Desafío Comunitario · Etapa ${faseActual.numero_fase}`}
              </h2>
            </div>
          </div>

          {/* Relato Corto + Botón de Voz */}
          <div className="p-3.5 bg-crema-50 border-t border-crema-200 space-y-2.5 shrink-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs sm:text-sm font-medium text-tierra-900 leading-snug">
                “{faseActual.narrativa_fase}”
              </p>
              <button
                type="button"
                onClick={() => hablarTexto(faseActual.narrativa_fase)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-crema-200 text-tierra-800 border border-crema-300 text-xs font-bold flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
                title="Escuchar el relato en voz alta"
              >
                <Volume2 className="w-4 h-4 text-terracotta-500" />
                <span>Oír</span>
              </button>
            </div>

            {/* CONTROLES INTERACTIVOS DE RUNPOD: ¡Los niños eligen qué aparece en la ilustración! */}
            <div className="pt-2 border-t border-crema-200 space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5" />
                ¡Imagina con los niños! Haz clic para pintar en el escenario:
              </p>

              <div className="flex flex-wrap gap-1">
                {ELEMENTOS_MAGICOS_ESCENA.map((elem) => (
                  <button
                    key={elem.label}
                    type="button"
                    disabled={cargandoImagen}
                    onClick={() => pintarEscenaRunPod(elem.extraPrompt)}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-terracotta-50 text-tierra-800 border border-crema-300 hover:border-terracotta-500 text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {elem.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!detallePersonalizado.trim()) return;
                  pintarEscenaRunPod(detallePersonalizado.trim());
                }}
                className="flex gap-1.5 pt-0.5"
              >
                <input
                  type="text"
                  value={detallePersonalizado}
                  onChange={(e) => setDetallePersonalizado(e.target.value)}
                  placeholder="O escribe qué agregar al dibujo (ej: un perro pastor, lluvia...)"
                  className="flex-1 min-w-0 rounded-lg bg-white border border-crema-300 px-2.5 py-1 text-xs text-tierra-900 focus:outline-none focus:border-terracotta-500"
                />
                <button
                  type="submit"
                  disabled={cargandoImagen || !detallePersonalizado.trim()}
                  className="px-3 py-1 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Pintar
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* COLUMNA DERECHA (7 cols): LAS 3 ESTACIONES DE RETO MULTINIVEL (SIN SCROLL VERTICAL) */}
        <section className="lg:col-span-7 flex flex-col justify-between gap-2.5 min-h-0">
          {!misionCompletada ? (
            <>
              {/* Instrucción Guía clara arriba de las tarjetas */}
              <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 bg-white border border-crema-300 rounded-xl px-3.5 py-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-tierra-800">
                  <span className="w-6 h-6 rounded-lg bg-terracotta-100 text-terracotta-700 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>
                    Resuelvan la estación de cada{" "}
                    <strong className="text-terracotta-600">Nivel</strong>{" "}
                    (tocando una ficha o escribiendo el número) para avanzar:
                  </span>
                </div>

                {todosNivelesResueltos && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    type="button"
                    onClick={avanzarSiguienteFase}
                    className="px-4 py-1.5 rounded-xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 cursor-pointer animate-bounce"
                  >
                    <span>
                      {faseIndex < mision.fases.length - 1
                        ? "¡Pasar a la Etapa " + (faseIndex + 2) + "!"
                        : "¡Ver Gran Victoria!"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Las 3 tarjetas apiladas de forma compacta y clara para que entren las 3 en pantalla */}
              <div className="flex-1 flex flex-col justify-between gap-2.5 min-h-0">
                {retosActuales.map((reto, idx) => {
                  const estaResuelto = Boolean(resueltos[idx]);
                  const numErrores = erroresShake[idx] || 0;
                  const mensajePista = feedbackError[idx] || null;
                  const est = estilosNivel[idx % estilosNivel.length];
                  const etiquetaNivel =
                    reto.nivel_nombre || est.nombreCorto;
                  const opciones =
                    Array.isArray(reto.opciones) && reto.opciones.length >= 3
                      ? reto.opciones
                      : generarOpcionesParaRespuesta(reto.respuesta_correcta);

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
                      {/* Cabecera compacta de la Estación del Nivel */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${est.badge}`}
                          >
                            <Layers className="w-3 h-3 shrink-0" />
                            <span>{etiquetaNivel}</span>
                          </span>
                          {reto.tema_curricular && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-tierra-600 truncate">
                              <BookOpen className="w-3 h-3 text-terracotta-500 shrink-0" />
                              <span className="truncate">
                                {reto.tema_curricular}
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackError((prev) => ({
                                ...prev,
                                [idx]: reto.feedback_error,
                              }));
                              hablarTexto(reto.feedback_error);
                            }}
                            className="px-2 py-1 rounded-lg bg-crema-100 hover:bg-crema-200 text-tierra-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            title="Escuchar pista del Amauta"
                          >
                            <HelpCircle className="w-3 h-3 text-terracotta-500" />
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

                      {/* Pregunta del Nivel */}
                      <p className="text-sm sm:text-base font-bold text-tierra-900 leading-snug my-1">
                        {reto.instruccion}
                      </p>

                      {/* Pista hablada si hubo error o si pidieron pista */}
                      {mensajePista && !estaResuelto && (
                        <div className="px-3 py-1.5 rounded-xl bg-terracotta-50 border border-terracotta-500/30 text-terracotta-700 text-xs font-medium flex items-center gap-2 mb-1">
                          <Volume2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="line-clamp-2">{mensajePista}</span>
                        </div>
                      )}

                      {/* Controles Interactivos: Fichas Táctiles Rápidas + Input Directo */}
                      {estaResuelto ? (
                        <div className="px-3 py-2 rounded-xl bg-valle-100/80 border border-valle-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-valle-600 shrink-0" />
                            <span className="font-bold text-xs sm:text-sm text-valle-700">
                              ¡Estación superada! Respuesta:{" "}
                              {reto.respuesta_correcta}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-valle-700 bg-white px-2.5 py-0.5 rounded-full border border-valle-500/20">
                            ⭐ +100 Ayni
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                          {/* 4 Fichas Táctiles para tocar directamente en pizarra/proyector */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-tierra-600 mr-0.5">
                              Toca una ficha:
                            </span>
                            {opciones.map((op) => (
                              <button
                                key={op}
                                type="button"
                                onClick={() =>
                                  verificarValorNivel(idx, reto, op)
                                }
                                className={`min-w-[46px] px-3 py-1.5 rounded-xl bg-crema-50 border-2 border-crema-300 font-bold text-sm text-tierra-900 transition-all cursor-pointer shadow-sm active:scale-95 ${est.chipHover}`}
                              >
                                {op}
                              </button>
                            ))}
                          </div>

                          {/* O escribir número manualmente */}
                          <div className="flex items-center gap-1.5">
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
                              className={`px-3.5 py-1.5 rounded-xl text-white font-bold text-xs shadow-sm transition-all cursor-pointer ${est.btn}`}
                            >
                              Probar
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            /* PANTALLA DE VICTORIA COMUNITARIA */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 rounded-3xl bg-white border-2 border-valle-500 p-6 flex flex-col items-center justify-center text-center shadow-md space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-terracotta-50 border border-terracotta-500/30 flex items-center justify-center text-terracotta-600">
                <Award className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-lg">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-valle-100 text-valle-700">
                  ¡Misión Multinivel Completada!
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-tierra-900">
                  ¡Toda el Aula Logró la Meta!
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
                  Jugar de Nuevo
                </button>
                <Link
                  href="/maestro/dashboard"
                  className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm shadow-sm"
                >
                  Crear Otra Clase en el Panel Docente
                </Link>
              </div>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
