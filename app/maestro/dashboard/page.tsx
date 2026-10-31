"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Sparkles,
  BookOpen,
  Users,
  TrendingUp,
  Play,
  CheckCircle2,
  Upload,
  FileText,
  Plus,
  Layers,
  GraduationCap,
  Wand2,
  Edit3,
  Lightbulb,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  MISION_INICIAL_DEMO,
  NIVELES_INICIALES,
  TEMAS_INICIALES,
  ALUMNOS_DEMO,
  MENSAJES_CARGA_HUMANOS,
} from "@/lib/default-missions";
import {
  AlumnoRow,
  MisionYuyAI,
  NivelAulaRow,
  TemaCurricularRow,
  DocumentoCurricularRow,
} from "@/lib/types";

const ESCENARIOS_VISUALES = [
  {
    id: "puente",
    emoji: "🌉",
    titulo: "El Puente de Q'eswachaka",
    contexto: "El tejido cooperativo del puente colgante sobre el río",
  },
  {
    id: "chacra",
    emoji: "🥔",
    titulo: "Cosecha en la Chacra",
    contexto: "La cosecha comunitaria de papas y maíz en la chacra escolar",
  },
  {
    id: "feria",
    emoji: "🦙",
    titulo: "La Feria de la Plaza",
    contexto: "La feria dominical y el transporte de canastas con llamas",
  },
  {
    id: "agua",
    emoji: "💧",
    titulo: "Los Canales de Riego",
    contexto: "El recorrido del agua por los canales hacia las parcelas",
  },
];

export default function MaestroDashboardPage() {
  const router = useRouter();

  const [tabActiva, setTabActiva] = useState<
    "estudio" | "curriculo" | "progreso"
  >("estudio");

  const [niveles, setNiveles] = useState<NivelAulaRow[]>(NIVELES_INICIALES);
  const [temas, setTemas] = useState<TemaCurricularRow[]>(TEMAS_INICIALES);
  const [documentos, setDocumentos] = useState<DocumentoCurricularRow[]>([]);
  const [alumnos, setAlumnos] = useState<AlumnoRow[]>(ALUMNOS_DEMO);

  const [temaSeleccionadoPorNivel, setTemaSeleccionadoPorNivel] = useState<
    Record<string, string>
  >({
    nivel_1: "tem-1",
    nivel_2: "tem-3",
    nivel_3: "tem-5",
  });
  const [contextoRural, setContextoRural] = useState(
    ESCENARIOS_VISUALES[0].contexto
  );

  const [misionEstudio, setMisionEstudio] =
    useState<MisionYuyAI>(MISION_INICIAL_DEMO);
  const [fasePreviewIdx, setFasePreviewIdx] = useState<number>(0);
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState<string>(
    "/fallbacks/andes-bg.svg"
  );
  const [pintandoPreview, setPintandoPreview] = useState<boolean>(false);
  const [tejiendoMision, setTejiendoMision] = useState(false);
  const [indiceMensaje, setIndiceMensaje] = useState(0);

  const [subiendoPdf, setSubiendoPdf] = useState(false);
  const [mensajePdf, setMensajePdf] = useState<string | null>(null);
  const [mostrarModalNuevoTema, setMostrarModalNuevoTema] = useState(false);
  const [nuevoTemaNivel, setNuevoTemaNivel] = useState("nivel_1");
  const [nuevoTemaArea, setNuevoTemaArea] = useState("Matemática");
  const [nuevoTemaTitulo, setNuevoTemaTitulo] = useState("");

  const cargarDatosSupabase = async () => {
    try {
      const [resNiveles, resTemas, resDocs, resAlumnos] = await Promise.all([
        supabase
          .from("niveles_aula")
          .select("*")
          .order("orden", { ascending: true }),
        supabase
          .from("temas_curriculares")
          .select("*")
          .order("id", { ascending: false }),
        supabase
          .from("documentos_curriculares")
          .select("*")
          .order("fecha_subida", { ascending: false })
          .limit(10),
        supabase.from("alumnos").select("*"),
      ]);

      const nivelesDB =
        resNiveles.data && resNiveles.data.length > 0
          ? (resNiveles.data as NivelAulaRow[])
          : NIVELES_INICIALES;
      const temasDB =
        resTemas.data && resTemas.data.length > 0
          ? (resTemas.data as TemaCurricularRow[])
          : TEMAS_INICIALES;

      setNiveles(nivelesDB);
      setTemas(temasDB);

      if (resDocs.data) {
        setDocumentos(resDocs.data as DocumentoCurricularRow[]);
      }
      if (resAlumnos.data && resAlumnos.data.length > 0) {
        setAlumnos(resAlumnos.data as AlumnoRow[]);
      }

      const mapaSeleccion: Record<string, string> = {};
      nivelesDB.forEach((niv) => {
        const temasDelNivel = temasDB.filter(
          (t) => t.nivel_codigo === niv.codigo
        );
        if (temasDelNivel.length > 0) {
          mapaSeleccion[niv.codigo] = temasDelNivel[0].id;
        }
      });
      setTemaSeleccionadoPorNivel((prev) => ({ ...prev, ...mapaSeleccion }));
    } catch {
      // Mantiene datos iniciales
    }
  };

  useEffect(() => {
    cargarDatosSupabase();
  }, []);

  const generarImagenPreview = async (promptUsar?: string) => {
    setPintandoPreview(true);
    const fase =
      misionEstudio.fases[fasePreviewIdx] || misionEstudio.fases[0];
    const promptFinal =
      promptUsar ||
      fase?.prompt_sdxl ||
      misionEstudio.prompt_sdxl_base ||
      "Warm storybook illustration of Andean rural school children";

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptFinal }),
      });
      const data = await res.json();
      if (data?.imageUrl) {
        setImagenPreviewUrl(data.imageUrl);
      }
    } catch {
      setImagenPreviewUrl("/fallbacks/andes-bg.svg");
    } finally {
      setPintandoPreview(false);
    }
  };

  useEffect(() => {
    generarImagenPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [misionEstudio.titulo_mision, fasePreviewIdx]);

  useEffect(() => {
    if (!tejiendoMision) return;
    const timer = setInterval(() => {
      setIndiceMensaje((prev) => (prev + 1) % MENSAJES_CARGA_HUMANOS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [tejiendoMision]);

  const manejarSubidaPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoPdf(true);
    setMensajePdf(`Leyendo el archivo "${file.name}" e identificando temas...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/curriculum", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.temas && Array.isArray(data.temas) && data.temas.length > 0) {
        const nuevosTemas = data.temas as TemaCurricularRow[];
        setTemas((prev) => [...nuevosTemas, ...prev]);

        // Seleccionar automáticamente los nuevos temas extraídos del PDF para cada nivel
        const nuevaSeleccion: Record<string, string> = {};
        niveles.forEach((niv) => {
          const encontrado = nuevosTemas.find(
            (t) => t.nivel_codigo === niv.codigo
          );
          if (encontrado && encontrado.id) {
            nuevaSeleccion[niv.codigo] = encontrado.id;
          }
        });
        setTemaSeleccionadoPorNivel((prev) => ({
          ...prev,
          ...nuevaSeleccion,
        }));

        setMensajePdf(
          `Se identificaron ${nuevosTemas.length} temas en "${file.name}" y ya quedaron seleccionados por nivel.`
        );
      } else {
        setMensajePdf("No se encontraron temas nuevos en el archivo.");
      }
    } catch {
      setMensajePdf("Ocurrió un problema al leer el archivo PDF.");
    } finally {
      setSubiendoPdf(false);
      e.target.value = "";
    }
  };

  const manejarCrearTemaManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTemaTitulo.trim()) return;

    const nivelObj =
      niveles.find((n) => n.codigo === nuevoTemaNivel) || niveles[0];

    const nuevo: TemaCurricularRow = {
      id: `tema-${Date.now()}`,
      nivel_codigo: nuevoTemaNivel,
      nivel_nombre: nivelObj?.nombre || nuevoTemaNivel,
      area_curricular: nuevoTemaArea,
      titulo_tema: nuevoTemaTitulo.trim(),
      competencia_minedu: "Resuelve problemas de cantidad",
      desempeno_esperado: `Aprendizaje de ${nuevoTemaTitulo.trim()} en el aula.`,
      estado: "en_curso",
      orden: temas.length + 1,
    };

    try {
      const { data } = await supabase
        .from("temas_curriculares")
        .insert({
          nivel_codigo: nuevo.nivel_codigo,
          nivel_nombre: nuevo.nivel_nombre,
          area_curricular: nuevo.area_curricular,
          titulo_tema: nuevo.titulo_tema,
          competencia_minedu: nuevo.competencia_minedu,
          desempeno_esperado: nuevo.desempeno_esperado,
          estado: nuevo.estado,
          orden: nuevo.orden,
        })
        .select()
        .single();

      const temaFinal = (data as TemaCurricularRow) || nuevo;
      setTemas((prev) => [temaFinal, ...prev]);
      setTemaSeleccionadoPorNivel((prev) => ({
        ...prev,
        [temaFinal.nivel_codigo]: temaFinal.id,
      }));
      setNuevoTemaTitulo("");
      setMostrarModalNuevoTema(false);
    } catch {
      setTemas((prev) => [nuevo, ...prev]);
      setMostrarModalNuevoTema(false);
    }
  };

  const manejarArmarClaseDelDia = async (e: React.FormEvent) => {
    e.preventDefault();
    setTejiendoMision(true);
    setIndiceMensaje(0);

    const selecciones = niveles.map((niv) => {
      const idTema = temaSeleccionadoPorNivel[niv.codigo];
      const temaObj =
        temas.find((t) => t.id === idTema) ||
        temas.find((t) => t.nivel_codigo === niv.codigo);
      return {
        nivel_codigo: niv.codigo,
        nivel_nombre: niv.nombre,
        tema_titulo:
          temaObj?.titulo_tema || "Resolución de problemas matemáticos",
        area_curricular: temaObj?.area_curricular || "Matemática",
        competencia_minedu:
          temaObj?.competencia_minedu || "Resuelve problemas de cantidad",
      };
    });

    const resumenTemas = selecciones.map((s) => s.tema_titulo).join(" · ");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tema: resumenTemas,
          contexto: contextoRural,
          selecciones,
        }),
      });

      const data = await res.json();
      if (data.mision) {
        setMisionEstudio(data.mision);
        setFasePreviewIdx(0);
        localStorage.setItem(
          "yuyai_mision_activa",
          JSON.stringify(data.mision)
        );
      }
    } catch {
      setMisionEstudio(MISION_INICIAL_DEMO);
    } finally {
      setTejiendoMision(false);
    }
  };

  const actualizarPreguntaEnVivo = (
    retoIdx: number,
    nuevaInstruccion: string,
    nuevaRespuesta: string
  ) => {
    setMisionEstudio((prev) => {
      const nuevasFases = prev.fases.map((f, fIdx) => {
        if (fIdx !== fasePreviewIdx) return f;
        const nuevosRetos = f.retos_grados.map((r, rIdx) =>
          rIdx === retoIdx
            ? {
                ...r,
                instruccion: nuevaInstruccion,
                respuesta_correcta: nuevaRespuesta,
              }
            : r
        );
        return { ...f, retos_grados: nuevosRetos };
      });
      const actualizada = { ...prev, fases: nuevasFases };
      localStorage.setItem("yuyai_mision_activa", JSON.stringify(actualizada));
      return actualizada;
    });
  };

  const lanzarMisionAlProyector = () => {
    localStorage.setItem(
      "yuyai_mision_activa",
      JSON.stringify(misionEstudio)
    );
    router.push("/aula/mision-viva");
  };

  const datosRadarPorNivel = useMemo(() => {
    const dimensiones = [
      { key: "logica_matematica", label: "Matemática" },
      { key: "comprension_lectora", label: "Comprensión" },
      { key: "resolucion_problemas", label: "Problemas" },
      { key: "trabajo_colaborativo", label: "Trabajo Grupal" },
      { key: "expresion_oral", label: "Expresión Oral" },
      { key: "pensamiento_creativo", label: "Creatividad" },
    ] as const;

    return dimensiones.map((dim, idx) => {
      const fila: Record<string, string | number> = { area: dim.label };
      niveles.forEach((niv, nIdx) => {
        const alumnosDelNivel = alumnos.filter(
          (a) => a.nivel_codigo === niv.codigo
        );
        if (alumnosDelNivel.length > 0) {
          const prom = Math.round(
            alumnosDelNivel.reduce(
              (acc, a) => acc + (a.competencias?.[dim.key] || 80),
              0
            ) / alumnosDelNivel.length
          );
          fila[niv.codigo] = prom;
        } else {
          fila[niv.codigo] = 76 + ((idx * 5 + nIdx * 4) % 16);
        }
      });
      return fila;
    });
  }, [niveles, alumnos]);

  const datosEvolucionSemanas = [
    { semana: "Sem 1", nivel_1: 64, nivel_2: 60, nivel_3: 68 },
    { semana: "Sem 2", nivel_1: 71, nivel_2: 67, nivel_3: 74 },
    { semana: "Sem 3", nivel_1: 77, nivel_2: 75, nivel_3: 80 },
    { semana: "Sem 4", nivel_1: 84, nivel_2: 81, nivel_3: 86 },
    { semana: "Sem 5", nivel_1: 90, nivel_2: 88, nivel_3: 92 },
  ];

  const paletaPorOrden = [
    {
      badge: "bg-valle-100 text-valle-700 border-valle-500/30",
      hex: "#238564",
    },
    {
      badge: "bg-lago-100 text-lago-600 border-lago-500/30",
      hex: "#2B6CB0",
    },
    {
      badge: "bg-terracotta-100 text-terracotta-700 border-terracotta-500/30",
      hex: "#D4653B",
    },
  ];

  const fasePreviewActual =
    misionEstudio.fases[fasePreviewIdx] || misionEstudio.fases[0];

  return (
    <div className="min-h-screen bg-crema-100 text-tierra-900 pb-10">
      {/* CABECERA ESCOLAR LIMPIA */}
      <header className="sticky top-0 z-30 border-b border-crema-300 bg-crema-50/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-terracotta-500 flex items-center justify-center text-white font-bold text-lg shadow-sm hover:bg-terracotta-600 transition-colors"
            >
              Y
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-tierra-900">
                Sala del Docente · Planificador de Clases
              </h1>
              <p className="text-xs text-tierra-600 hidden sm:block">
                Primaria Multinivel (Ciclos III, IV y V)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-crema-200/70 p-1 rounded-2xl border border-crema-300">
            <button
              type="button"
              onClick={() => setTabActiva("estudio")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                tabActiva === "estudio"
                  ? "bg-white text-terracotta-600 shadow-sm"
                  : "text-tierra-700 hover:text-tierra-900"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>1. Preparar Clase</span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva("curriculo")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                tabActiva === "curriculo"
                  ? "bg-white text-terracotta-600 shadow-sm"
                  : "text-tierra-700 hover:text-tierra-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>2. Temas y PDF ({temas.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva("progreso")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                tabActiva === "progreso"
                  ? "bg-white text-terracotta-600 shadow-sm"
                  : "text-tierra-700 hover:text-tierra-900"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>3. Estudiantes</span>
            </button>
          </div>

          <button
            onClick={lanzarMisionAlProyector}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar Clase en Pizarra</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {/* =====================================================================
            PESTAÑA 1: PREPARAR CLASE DEL DÍA
        ===================================================================== */}
        {tabActiva === "estudio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMNA IZQUIERDA (5 cols): SUBIR PDF Y ELEGIR TEMAS */}
            <section className="lg:col-span-5 rounded-3xl bg-white border border-crema-300 shadow-sm p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-crema-200 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-tierra-900">
                    Configurar la Sesión de Hoy
                  </h2>
                  <p className="text-xs text-tierra-600">
                    Sube tu PDF de unidades o elige los temas por nivel
                  </p>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 border border-terracotta-500/30 text-xs font-bold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{subiendoPdf ? "Leyendo PDF..." : "Subir PDF"}</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={manejarSubidaPdf}
                    disabled={subiendoPdf}
                    className="hidden"
                  />
                </label>
              </div>

              {mensajePdf && (
                <div className="p-3 rounded-xl bg-valle-50 border border-valle-500/30 text-valle-700 text-xs font-medium flex items-center justify-between gap-2">
                  <span>{mensajePdf}</span>
                  <button
                    onClick={() => setMensajePdf(null)}
                    className="font-bold underline shrink-0"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              <form onSubmit={manejarArmarClaseDelDia} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-tierra-700 mb-2">
                    1. Tema del Cuento para el Salón:
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {ESCENARIOS_VISUALES.map((esc) => {
                      const seleccionado = contextoRural === esc.contexto;
                      return (
                        <button
                          key={esc.id}
                          type="button"
                          onClick={() => setContextoRural(esc.contexto)}
                          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            seleccionado
                              ? "bg-terracotta-50 border-terracotta-500 ring-2 ring-terracotta-500/20"
                              : "bg-crema-50 border-crema-200 hover:border-crema-300"
                          }`}
                        >
                          <span className="text-xl">{esc.emoji}</span>
                          <span className="text-xs font-bold text-tierra-900 leading-tight">
                            {esc.titulo}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    required
                    value={contextoRural}
                    onChange={(e) => setContextoRural(e.target.value)}
                    placeholder="O escribe sobre qué tratará la historia de hoy..."
                    className="w-full rounded-xl bg-crema-50 border border-crema-300 px-3 py-2 text-xs sm:text-sm text-tierra-900 focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-tierra-700">
                      2. Tema de Clase para cada Nivel:
                    </label>
                    <button
                      type="button"
                      onClick={() => setTabActiva("curriculo")}
                      className="text-xs font-bold text-terracotta-600 hover:underline cursor-pointer"
                    >
                      Administrar Temas →
                    </button>
                  </div>

                  {niveles.map((niv, idx) => {
                    const temasNivel = temas.filter(
                      (t) => t.nivel_codigo === niv.codigo
                    );
                    const est = paletaPorOrden[idx % paletaPorOrden.length];

                    return (
                      <div
                        key={niv.codigo}
                        className="p-3 rounded-2xl bg-crema-50 border border-crema-300 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${est.badge}`}
                          >
                            {niv.nombre}
                          </span>
                          <span className="text-[11px] text-tierra-600">
                            {niv.descripcion}
                          </span>
                        </div>

                        <select
                          value={temaSeleccionadoPorNivel[niv.codigo] || ""}
                          onChange={(e) =>
                            setTemaSeleccionadoPorNivel((prev) => ({
                              ...prev,
                              [niv.codigo]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl bg-white border border-crema-300 px-2.5 py-1.5 text-xs sm:text-sm text-tierra-900 font-medium focus:outline-none focus:border-terracotta-500"
                        >
                          {temasNivel.map((t) => (
                            <option key={t.id} value={t.id}>
                              [{t.area_curricular}] {t.titulo_tema}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={tejiendoMision}
                  className="w-full py-3.5 px-5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {tejiendoMision ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>{MENSAJES_CARGA_HUMANOS[indiceMensaje]}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Crear Historia, Explicación y Preguntas</span>
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* COLUMNA DERECHA (7 cols): VISTA PREVIA DEL CUENTO, LA EXPLICACIÓN Y LAS PREGUNTAS */}
            <section className="lg:col-span-7 rounded-3xl bg-white border-2 border-crema-300 shadow-sm overflow-hidden">
              <div className="relative h-48 sm:h-56 bg-tierra-900 overflow-hidden">
                <img
                  src={imagenPreviewUrl}
                  alt={misionEstudio.titulo_mision}
                  onError={() => setImagenPreviewUrl("/fallbacks/andes-bg.svg")}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    pintandoPreview ? "scale-105 blur-[2px] opacity-75" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tierra-900/90 via-tierra-900/25 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-crema-50/95 text-tierra-900 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                    {pintandoPreview
                      ? "Ilustrando escena..."
                      : "Ilustración del Capítulo"}
                  </span>

                  <button
                    type="button"
                    disabled={pintandoPreview}
                    onClick={() => generarImagenPreview()}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Nueva Ilustración</span>
                  </button>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-crema-200">
                      Vista Previa de la Sesión
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {misionEstudio.titulo_mision}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={lanzarMisionAlProyector}
                    className="px-5 py-2.5 rounded-xl bg-valle-500 hover:bg-valle-600 text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Abrir en la Pizarra del Salón</span>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-crema-200 pb-3">
                  <div className="flex items-center gap-2">
                    {misionEstudio.fases.map((f, idx) => (
                      <button
                        key={f.numero_fase}
                        type="button"
                        onClick={() => setFasePreviewIdx(idx)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          fasePreviewIdx === idx
                            ? "bg-tierra-800 text-white shadow-sm"
                            : "bg-crema-100 text-tierra-700 hover:bg-crema-200"
                        }`}
                      >
                        Capítulo {f.numero_fase}:{" "}
                        {f.titulo_fase || `Parte ${f.numero_fase}`}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-tierra-600 flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-terracotta-500" />
                    Editable antes de proyectar
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-crema-50 border border-crema-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
                    Relato del Capítulo {fasePreviewActual?.numero_fase}:
                  </span>
                  <p className="text-sm text-tierra-800">
                    “{fasePreviewActual?.narrativa_fase}”
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {fasePreviewActual?.retos_grados.map((reto, rIdx) => {
                    const est = paletaPorOrden[rIdx % paletaPorOrden.length];
                    return (
                      <div
                        key={rIdx}
                        className="p-3.5 rounded-2xl bg-crema-50 border border-crema-300 flex flex-col justify-between gap-2.5"
                      >
                        <div className="space-y-1.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${est.badge}`}
                          >
                            {reto.nivel_nombre || `Nivel ${rIdx + 1}`}
                          </span>
                          <p className="text-[11px] font-bold text-tierra-700">
                            {reto.tema_curricular}
                          </p>

                          {/* Explicación teórica corta generada para este nivel */}
                          {reto.explicacion_previa && (
                            <div className="p-2 rounded-xl bg-white border border-crema-200 text-[11px] text-tierra-700 space-y-1">
                              <span className="font-bold text-valle-700 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                Explicación previa:
                              </span>
                              <p>{reto.explicacion_previa}</p>
                              {reto.ejemplo_corto && (
                                <p className="font-bold text-tierra-900">
                                  {reto.ejemplo_corto}
                                </p>
                              )}
                            </div>
                          )}

                          <label className="block text-[11px] font-bold text-tierra-700 pt-1">
                            Pregunta para el nivel:
                          </label>
                          <textarea
                            rows={3}
                            value={reto.instruccion}
                            onChange={(e) =>
                              actualizarPreguntaEnVivo(
                                rIdx,
                                e.target.value,
                                reto.respuesta_correcta
                              )
                            }
                            className="w-full rounded-xl bg-white border border-crema-300 p-2 text-xs font-medium text-tierra-900 focus:outline-none focus:border-terracotta-500"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-crema-200">
                          <span className="text-xs font-bold text-tierra-700">
                            Respuesta:
                          </span>
                          <input
                            type="text"
                            value={reto.respuesta_correcta}
                            onChange={(e) =>
                              actualizarPreguntaEnVivo(
                                rIdx,
                                reto.instruccion,
                                e.target.value
                              )
                            }
                            className="w-20 rounded-lg bg-white border border-crema-300 px-2 py-1 text-xs font-bold text-center text-valle-700"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            PESTAÑA 2: TEMAS POR NIVEL Y CARGA DE PDF
        ===================================================================== */}
        {tabActiva === "curriculo" && (
          <section className="rounded-3xl bg-white border border-crema-300 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-crema-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-tierra-900">
                  Temas Curriculares por Nivel
                </h2>
                <p className="text-sm text-tierra-600">
                  Sube el PDF de tu programación anual o unidad didáctica para
                  extraer automáticamente los temas de cada nivel.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>
                    {subiendoPdf ? "Leyendo PDF..." : "Subir PDF de Unidades"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={manejarSubidaPdf}
                    disabled={subiendoPdf}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setMostrarModalNuevoTema((v) => !v)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-crema-100 hover:bg-crema-200 text-tierra-800 border border-crema-300 font-bold text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-terracotta-600" />
                  Agregar Tema Manual
                </button>
              </div>
            </div>

            {mensajePdf && (
              <div className="p-4 rounded-2xl bg-valle-50 border border-valle-500/30 text-valle-700 text-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{mensajePdf}</span>
                </div>
                <button
                  onClick={() => setMensajePdf(null)}
                  className="text-xs font-bold underline"
                >
                  Cerrar
                </button>
              </div>
            )}

            {mostrarModalNuevoTema && (
              <form
                onSubmit={manejarCrearTemaManual}
                className="p-4 rounded-2xl bg-crema-50 border border-crema-300 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-tierra-700 mb-1">
                    Nivel
                  </label>
                  <select
                    value={nuevoTemaNivel}
                    onChange={(e) => setNuevoTemaNivel(e.target.value)}
                    className="w-full rounded-xl border border-crema-300 bg-white px-3 py-2 text-sm"
                  >
                    {niveles.map((n) => (
                      <option key={n.codigo} value={n.codigo}>
                        {n.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-tierra-700 mb-1">
                    Área
                  </label>
                  <select
                    value={nuevoTemaArea}
                    onChange={(e) => setNuevoTemaArea(e.target.value)}
                    className="w-full rounded-xl border border-crema-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="Matemática">Matemática</option>
                    <option value="Ciencia y Tecnología">
                      Ciencia y Tecnología
                    </option>
                    <option value="Comunicación">Comunicación</option>
                    <option value="Personal Social">Personal Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-tierra-700 mb-1">
                    Título del Tema
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoTemaTitulo}
                    onChange={(e) => setNuevoTemaTitulo(e.target.value)}
                    placeholder="Ej: Suma de fracciones homogéneas"
                    className="w-full rounded-xl border border-crema-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-sm cursor-pointer"
                >
                  Guardar Tema
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {niveles.map((niv, idx) => {
                const temasDeEsteNivel = temas.filter(
                  (t) => t.nivel_codigo === niv.codigo
                );
                const estilo = paletaPorOrden[idx % paletaPorOrden.length];
                const temaActivoId = temaSeleccionadoPorNivel[niv.codigo];

                return (
                  <div
                    key={niv.codigo}
                    className="rounded-2xl bg-crema-50 border-2 border-crema-200 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-crema-200">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${estilo.badge}`}
                          >
                            <Layers className="w-3 h-3" />
                            {niv.nombre}
                          </span>
                          <p className="text-xs text-tierra-600 mt-1.5">
                            {niv.descripcion}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-crema-300 text-xs font-bold text-tierra-700 shrink-0">
                          {temasDeEsteNivel.length} temas
                        </span>
                      </div>

                      <div className="mt-3 space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {temasDeEsteNivel.map((tema) => {
                          const esSeleccionadoHoy = temaActivoId === tema.id;
                          return (
                            <div
                              key={tema.id}
                              onClick={() => {
                                setTemaSeleccionadoPorNivel((prev) => ({
                                  ...prev,
                                  [niv.codigo]: tema.id,
                                }));
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                esSeleccionadoHoy
                                  ? "bg-white border-terracotta-500 shadow-sm ring-2 ring-terracotta-500/20"
                                  : "bg-white/80 border-crema-200 hover:border-crema-300"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-tierra-600 bg-crema-100 px-2 py-0.5 rounded-md">
                                  {tema.area_curricular}
                                </span>
                                {esSeleccionadoHoy && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-terracotta-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Elegido
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-sm text-tierra-900">
                                {tema.titulo_tema}
                              </p>
                              <p className="text-xs text-tierra-600 mt-1">
                                {tema.desempeno_esperado}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTabActiva("estudio")}
                      className="mt-4 w-full py-2 rounded-xl bg-white hover:bg-crema-100 border border-crema-300 text-xs font-bold text-terracotta-600 cursor-pointer"
                    >
                      Volver a Preparar Clase →
                    </button>
                  </div>
                );
              })}
            </div>

            {documentos.length > 0 && (
              <div className="pt-2 border-t border-crema-200 text-xs text-tierra-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-terracotta-500" />
                <span>
                  Último archivo subido:{" "}
                  <strong>{documentos[0].nombre_archivo}</strong> (
                  {documentos[0].total_temas} temas registrados)
                </span>
              </div>
            )}
          </section>
        )}

        {/* =====================================================================
            PESTAÑA 3: SEGUIMIENTO DE ESTUDIANTES
        ===================================================================== */}
        {tabActiva === "progreso" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white border border-crema-300 shadow-sm p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-valle-700">
                    Desempeño por Áreas
                  </span>
                  <GraduationCap className="w-4 h-4 text-valle-600" />
                </div>
                <h3 className="text-base font-bold text-tierra-900 mb-2">
                  Avance por Nivel del Salón
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={datosRadarPorNivel}
                    >
                      <PolarGrid stroke="#E5D7BE" />
                      <PolarAngleAxis
                        dataKey="area"
                        tick={{
                          fill: "#57463A",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#786455", fontSize: 10 }}
                      />
                      {niveles.slice(0, 3).map((niv, idx) => {
                        const col =
                          paletaPorOrden[idx % paletaPorOrden.length].hex;
                        return (
                          <Radar
                            key={niv.codigo}
                            name={niv.nombre}
                            dataKey={niv.codigo}
                            stroke={col}
                            fill={col}
                            fillOpacity={0.2}
                          />
                        );
                      })}
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-crema-300 shadow-sm p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-lago-600">
                    Historial de Clases
                  </span>
                  <TrendingUp className="w-4 h-4 text-lago-600" />
                </div>
                <h3 className="text-base font-bold text-tierra-900 mb-2">
                  Evolución Semanal por Nivel (%)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosEvolucionSemanas}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F2E9D8" />
                      <XAxis
                        dataKey="semana"
                        tick={{ fill: "#57463A", fontSize: 11 }}
                      />
                      <YAxis
                        domain={[40, 100]}
                        tick={{ fill: "#57463A", fontSize: 11 }}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line
                        type="monotone"
                        name="Nivel 1"
                        dataKey="nivel_1"
                        stroke="#238564"
                        strokeWidth={2.5}
                      />
                      <Line
                        type="monotone"
                        name="Nivel 2"
                        dataKey="nivel_2"
                        stroke="#2B6CB0"
                        strokeWidth={2.5}
                      />
                      <Line
                        type="monotone"
                        name="Nivel 3"
                        dataKey="nivel_3"
                        stroke="#D4653B"
                        strokeWidth={2.5}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-crema-300 shadow-sm p-5">
              <h3 className="text-lg font-bold text-tierra-900 mb-4">
                Estudiantes Registrados ({alumnos.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {alumnos.map((al, idx) => {
                  const est = paletaPorOrden[idx % paletaPorOrden.length];
                  const vals = Object.values(al.competencias || {});
                  const promedio =
                    vals.length > 0
                      ? Math.round(
                          vals.reduce((a, b) => a + b, 0) / vals.length
                        )
                      : 85;
                  return (
                    <div
                      key={al.id}
                      className="p-3.5 rounded-2xl bg-crema-50 border border-crema-200 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm text-tierra-900">
                            {al.nombre_completo}
                          </p>
                          <p className="text-xs text-tierra-600">
                            {al.nivel_nombre || al.nivel_codigo}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${est.badge}`}
                        >
                          {promedio}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-crema-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-valle-500"
                          style={{ width: `${promedio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
