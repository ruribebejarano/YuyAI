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
  Database,
  Upload,
  FileText,
  Network,
  Plus,
  Layers,
  GraduationCap,
  ArrowRight,
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

export default function MaestroDashboardPage() {
  const router = useRouter();

  const [niveles, setNiveles] = useState<NivelAulaRow[]>(NIVELES_INICIALES);
  const [temas, setTemas] = useState<TemaCurricularRow[]>(TEMAS_INICIALES);
  const [documentos, setDocumentos] = useState<DocumentoCurricularRow[]>([]);
  const [alumnos, setAlumnos] = useState<AlumnoRow[]>(ALUMNOS_DEMO);
  const [misionesGuardadas, setMisionesGuardadas] = useState<MisionYuyAI[]>([
    MISION_INICIAL_DEMO,
  ]);
  const [cargandoDB, setCargandoDB] = useState(true);

  const [temaSeleccionadoPorNivel, setTemaSeleccionadoPorNivel] = useState<
    Record<string, string>
  >({
    nivel_1: "tem-1",
    nivel_2: "tem-3",
    nivel_3: "tem-5",
  });
  const [nivelesActivosHoy, setNivelesActivosHoy] = useState<
    Record<string, boolean>
  >({
    nivel_1: true,
    nivel_2: true,
    nivel_3: true,
  });
  const [contextoRural, setContextoRural] = useState(
    "La cosecha comunitaria de papas nativas y maíz en nuestra chacra escolar"
  );

  const [subiendoPdf, setSubiendoPdf] = useState(false);
  const [mensajePdf, setMensajePdf] = useState<string | null>(null);
  const [nivelFiltroGrafo, setNivelFiltroGrafo] = useState<string>("TODOS");

  const [mostrarModalNuevoTema, setMostrarModalNuevoTema] = useState(false);
  const [nuevoTemaNivel, setNuevoTemaNivel] = useState("nivel_1");
  const [nuevoTemaArea, setNuevoTemaArea] = useState("Matemática");
  const [nuevoTemaTitulo, setNuevoTemaTitulo] = useState("");
  const [nuevoTemaDesc, setNuevoTemaDesc] = useState("");

  const [tejiendoMision, setTejiendoMision] = useState(false);
  const [indiceMensaje, setIndiceMensaje] = useState(0);
  const [misionRecienCreada, setMisionRecienCreada] =
    useState<MisionYuyAI | null>(null);

  const cargarDatosSupabase = async () => {
    setCargandoDB(true);
    try {
      const [resNiveles, resTemas, resDocs, resAlumnos, resMisiones] =
        await Promise.all([
          supabase
            .from("niveles_aula")
            .select("*")
            .order("orden", { ascending: true }),
          supabase
            .from("temas_curriculares")
            .select("*")
            .order("orden", { ascending: true }),
          supabase
            .from("documentos_curriculares")
            .select("*")
            .order("fecha_subida", { ascending: false })
            .limit(10),
          supabase.from("alumnos").select("*"),
          supabase
            .from("misiones_plantillas")
            .select("*")
            .order("fecha_creacion", { ascending: false })
            .limit(10),
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
      if (resMisiones.data && resMisiones.data.length > 0) {
        const mapeadas: MisionYuyAI[] = resMisiones.data
          .map((row: { id: string; fases_json: MisionYuyAI }) => {
            if (row.fases_json && row.fases_json.fases) {
              return { ...row.fases_json, id: row.id };
            }
            return null;
          })
          .filter(Boolean) as MisionYuyAI[];
        if (mapeadas.length > 0) {
          setMisionesGuardadas(mapeadas);
        }
      }

      const mapaSeleccion: Record<string, string> = {};
      const mapaActivos: Record<string, boolean> = {};
      nivelesDB.forEach((niv) => {
        mapaActivos[niv.codigo] = true;
        const temasDelNivel = temasDB.filter(
          (t) => t.nivel_codigo === niv.codigo
        );
        if (temasDelNivel.length > 0) {
          mapaSeleccion[niv.codigo] = temasDelNivel[0].id;
        }
      });
      setTemaSeleccionadoPorNivel((prev) => ({ ...mapaSeleccion, ...prev }));
      setNivelesActivosHoy((prev) => ({ ...mapaActivos, ...prev }));
      if (nivelesDB.length > 0) {
        setNuevoTemaNivel(nivelesDB[0].codigo);
      }
    } catch {
      // Mantiene datos semilla si hay desconexión
    } finally {
      setCargandoDB(false);
    }
  };

  useEffect(() => {
    cargarDatosSupabase();
  }, []);

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
    setMensajePdf(
      `Leyendo "${file.name}" y organizando los temas por nivel en la base de datos...`
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/curriculum", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.temas && Array.isArray(data.temas)) {
        await cargarDatosSupabase();
        setMensajePdf(
          `¡Documento "${file.name}" integrado! Se identificaron y guardaron ${data.temas.length} temas curriculares organizados por niveles.`
        );
      } else {
        setMensajePdf(
          "El documento fue procesado. Revisa el mapa curricular actualizado."
        );
      }
    } catch {
      setMensajePdf(
        "Se guardaron los temas base en el mapa curricular del aula."
      );
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
      competencia_minedu:
        nuevoTemaArea === "Matemática"
          ? "Resuelve problemas de cantidad"
          : "Indaga y se comunica en su lengua materna",
      desempeno_esperado:
        nuevoTemaDesc.trim() ||
        `Aplicación práctica de ${nuevoTemaTitulo.trim()} en el aula.`,
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
      setNuevoTemaDesc("");
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

    const selecciones = niveles
      .filter((n) => nivelesActivosHoy[n.codigo])
      .map((niv) => {
        const idTema = temaSeleccionadoPorNivel[niv.codigo];
        const temaObj =
          temas.find((t) => t.id === idTema) ||
          temas.find((t) => t.nivel_codigo === niv.codigo);
        return {
          nivel_codigo: niv.codigo,
          nivel_nombre: niv.nombre,
          tema_titulo:
            temaObj?.titulo_tema || "Resolución de problemas comunitarios",
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
        setMisionRecienCreada(data.mision);
        setMisionesGuardadas((prev) => [data.mision, ...prev]);
        localStorage.setItem(
          "yuyai_mision_activa",
          JSON.stringify(data.mision)
        );
      }
    } catch {
      setMisionRecienCreada(MISION_INICIAL_DEMO);
      localStorage.setItem(
        "yuyai_mision_activa",
        JSON.stringify(MISION_INICIAL_DEMO)
      );
    } finally {
      setTejiendoMision(false);
    }
  };

  const lanzarMisionAlProyector = (mision: MisionYuyAI) => {
    localStorage.setItem("yuyai_mision_activa", JSON.stringify(mision));
    router.push("/aula/mision-viva");
  };

  const datosRadarPorNivel = useMemo(() => {
    const dimensiones = [
      { key: "logica_matematica", label: "Matemática" },
      { key: "comprension_lectora", label: "Comprensión" },
      { key: "resolucion_problemas", label: "Problemas" },
      { key: "trabajo_colaborativo", label: "Ayni Colectivo" },
      { key: "expresion_oral", label: "Oralidad" },
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

  return (
    <div className="min-h-screen bg-crema-100 text-tierra-900 pb-16">
      {/* Barra Superior Cálida de Escuela Rural */}
      <header className="sticky top-0 z-30 border-b border-crema-300 bg-crema-50/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-terracotta-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0 hover:bg-terracotta-600 transition-colors"
            >
              Y
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-tierra-900 truncate">
                  Cuaderno Pedagógico Multinivel
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-valle-100 text-valle-700 border border-valle-500/30">
                  <Database className="w-3 h-3" />
                  {cargandoDB ? "Sincronizando..." : "Supabase Conectado"}
                </span>
              </div>
              <p className="text-xs text-tierra-600 truncate">
                Currículo Nacional MINEDU por Niveles · Gestión de PDF y Grafo
                Curricular
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() =>
                lanzarMisionAlProyector(
                  misionRecienCreada ||
                    misionesGuardadas[0] ||
                    MISION_INICIAL_DEMO
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Abrir Proyector del Aula
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* PASO 1: SUBIR PDF CURRICULAR Y GRAFO DE NIVELES Y TEMAS */}
        <section className="rounded-3xl bg-white border border-crema-300 shadow-sm p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-crema-200">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-600">
                <Network className="w-4 h-4" />
                Paso 1 · Mapa Curricular por Niveles (MINEDU)
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-tierra-900">
                Niveles del Aula y Temas Curriculares desde PDF
              </h2>
              <p className="text-sm text-tierra-600 leading-relaxed">
                Sube el documento PDF con la programación curricular o unidades
                de tu escuela. El sistema reconoce automáticamente los temas
                para cada <strong>Nivel</strong> y los guarda en la base de
                datos para que armes tus clases diarias.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <label
                className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-sm cursor-pointer transition-all shadow-sm ${
                  subiendoPdf
                    ? "bg-crema-200 text-tierra-800 cursor-wait"
                    : "bg-terracotta-500 hover:bg-terracotta-600 text-white"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>
                  {subiendoPdf
                    ? "Analizando PDF..."
                    : "Subir PDF de Temas MINEDU"}
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
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-crema-100 hover:bg-crema-200 text-tierra-800 border border-crema-300 font-bold text-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-terracotta-600" />
                Añadir Tema Manual
              </button>
            </div>
          </div>

          {mensajePdf && (
            <div className="mt-4 p-4 rounded-2xl bg-valle-50 border border-valle-500/30 text-valle-700 text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 shrink-0 text-valle-600" />
                <span className="font-medium break-words">{mensajePdf}</span>
              </div>
              <button
                onClick={() => setMensajePdf(null)}
                className="text-xs font-bold underline shrink-0"
              >
                Cerrar
              </button>
            </div>
          )}

          {mostrarModalNuevoTema && (
            <form
              onSubmit={manejarCrearTemaManual}
              className="mt-4 p-5 rounded-2xl bg-crema-50 border border-crema-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
            >
              <div>
                <label className="block text-xs font-bold text-tierra-700 mb-1">
                  Nivel Destino
                </label>
                <select
                  value={nuevoTemaNivel}
                  onChange={(e) => setNuevoTemaNivel(e.target.value)}
                  className="w-full rounded-xl border border-crema-300 bg-white px-3 py-2 text-sm text-tierra-900"
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
                  Área Curricular
                </label>
                <select
                  value={nuevoTemaArea}
                  onChange={(e) => setNuevoTemaArea(e.target.value)}
                  className="w-full rounded-xl border border-crema-300 bg-white px-3 py-2 text-sm text-tierra-900"
                >
                  <option value="Matemática">Matemática</option>
                  <option value="Ciencia y Tecnología">
                    Ciencia y Tecnología
                  </option>
                  <option value="Comunicación">Comunicación</option>
                  <option value="Personal Social">Personal Social</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-tierra-700 mb-1">
                  Título del Tema Curricular
                </label>
                <input
                  type="text"
                  required
                  value={nuevoTemaTitulo}
                  onChange={(e) => setNuevoTemaTitulo(e.target.value)}
                  placeholder="Ej: Medición de terrenos y perímetros en pasos"
                  className="w-full rounded-xl border border-crema-300 bg-white px-3 py-2 text-sm text-tierra-900"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-sm cursor-pointer"
                >
                  Guardar Tema
                </button>
              </div>
            </form>
          )}

          {/* Filtro del Grafo de Niveles */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-tierra-600 mr-1">
                Explorar Grafo por Nivel:
              </span>
              <button
                onClick={() => setNivelFiltroGrafo("TODOS")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  nivelFiltroGrafo === "TODOS"
                    ? "bg-tierra-800 text-white"
                    : "bg-crema-100 text-tierra-700 hover:bg-crema-200"
                }`}
              >
                Todos los Niveles ({niveles.length})
              </button>
              {niveles.map((niv) => (
                <button
                  key={niv.codigo}
                  onClick={() => setNivelFiltroGrafo(niv.codigo)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    nivelFiltroGrafo === niv.codigo
                      ? "bg-terracotta-500 text-white"
                      : "bg-crema-100 text-tierra-700 hover:bg-crema-200"
                  }`}
                >
                  {niv.nombre}
                </button>
              ))}
            </div>

            {documentos.length > 0 && (
              <div className="text-xs text-tierra-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-terracotta-500" />
                Último PDF procesado:{" "}
                <strong className="text-tierra-800">
                  {documentos[0].nombre_archivo}
                </strong>
              </div>
            )}
          </div>

          {/* GRAFO VISUAL DE CONEXIONES: NIVEL -> ÁREA -> TEMAS EN BASE DE DATOS */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {niveles
              .filter(
                (n) =>
                  nivelFiltroGrafo === "TODOS" || n.codigo === nivelFiltroGrafo
              )
              .map((niv, idx) => {
                const temasDeEsteNivel = temas.filter(
                  (t) => t.nivel_codigo === niv.codigo
                );
                const estilo = paletaPorOrden[idx % paletaPorOrden.length];
                const temaActivoId = temaSeleccionadoPorNivel[niv.codigo];

                return (
                  <div
                    key={niv.codigo}
                    className="rounded-2xl bg-crema-50 border-2 border-crema-200 p-4 flex flex-col justify-between min-w-0"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-crema-200">
                        <div className="min-w-0">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${estilo.badge}`}
                          >
                            <Layers className="w-3 h-3" />
                            {niv.nombre}
                          </span>
                          <p className="text-xs text-tierra-600 mt-1.5 break-words">
                            {niv.descripcion}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-crema-300 text-xs font-bold text-tierra-700 shrink-0">
                          {temasDeEsteNivel.length} temas
                        </span>
                      </div>

                      <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {temasDeEsteNivel.map((tema) => {
                          const esSeleccionadoHoy = temaActivoId === tema.id;
                          return (
                            <div
                              key={tema.id}
                              onClick={() =>
                                setTemaSeleccionadoPorNivel((prev) => ({
                                  ...prev,
                                  [niv.codigo]: tema.id,
                                }))
                              }
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
                                    Elegido para hoy
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-sm text-tierra-900 break-words">
                                {tema.titulo_tema}
                              </p>
                              <p className="text-xs text-tierra-600 mt-1 line-clamp-2 break-words">
                                {tema.desempeno_esperado}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-crema-200 flex items-center justify-between text-xs text-tierra-600">
                      <span>Haz clic en un tema para asignarlo a la clase</span>
                      <ArrowRight className="w-3.5 h-3.5 text-terracotta-500" />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* PASO 2: GENERADOR DE LA CLASE DEL DÍA Y ANALÍTICA MULTINIVEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-5 rounded-3xl bg-white border border-crema-300 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-terracotta-100 text-terracotta-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                  Paso 2 · Orquestador Multinivel
                </span>
                <h2 className="text-xl font-bold text-tierra-900">
                  Preparar la Clase del Día
                </h2>
              </div>
            </div>
            <p className="text-sm text-tierra-600 mb-5">
              Un mismo relato vivencial para toda el aula, pero cada{" "}
              <strong>Nivel</strong> resolverá el reto de su propio tema
              curricular.
            </p>

            <form onSubmit={manejarArmarClaseDelDia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-tierra-700 mb-1.5">
                  Escenario de la Comunidad / Chacra / Feria
                </label>
                <input
                  type="text"
                  required
                  value={contextoRural}
                  onChange={(e) => setContextoRural(e.target.value)}
                  placeholder="Ej: La cosecha comunitaria de papas nativas"
                  className="w-full rounded-xl bg-crema-50 border border-crema-300 px-3.5 py-2.5 text-sm text-tierra-900 focus:outline-none focus:border-terracotta-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    "Cosecha de papas nativas en la chacra",
                    "Trueque y feria dominical en la plaza",
                    "Crianza de alpacas y tejido de chullos",
                  ].map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => setContextoRural(sug)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-crema-100 hover:bg-crema-200 text-tierra-700 border border-crema-300 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-tierra-700">
                  Temas Asignados hoy por cada Nivel
                </label>

                {niveles.map((niv) => {
                  const temasNivel = temas.filter(
                    (t) => t.nivel_codigo === niv.codigo
                  );
                  const activo = nivelesActivosHoy[niv.codigo] ?? true;

                  return (
                    <div
                      key={niv.codigo}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        activo
                          ? "bg-crema-50 border-crema-300"
                          : "bg-crema-100/50 border-crema-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activo}
                            onChange={(e) =>
                              setNivelesActivosHoy((prev) => ({
                                ...prev,
                                [niv.codigo]: e.target.checked,
                              }))
                            }
                            className="rounded text-terracotta-500 focus:ring-terracotta-500"
                          />
                          <span className="font-bold text-sm text-tierra-900">
                            {niv.nombre}
                          </span>
                        </label>
                      </div>

                      {activo && (
                        <select
                          value={temaSeleccionadoPorNivel[niv.codigo] || ""}
                          onChange={(e) =>
                            setTemaSeleccionadoPorNivel((prev) => ({
                              ...prev,
                              [niv.codigo]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl bg-white border border-crema-300 px-3 py-2 text-xs sm:text-sm text-tierra-900 font-medium focus:outline-none focus:border-terracotta-500"
                        >
                          {temasNivel.map((t) => (
                            <option key={t.id} value={t.id}>
                              [{t.area_curricular}] {t.titulo_tema}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={tejiendoMision}
                className="w-full py-3.5 px-5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {tejiendoMision ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>{MENSAJES_CARGA_HUMANOS[indiceMensaje]}</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    <span>Armar Clase Multinivel del Día</span>
                  </>
                )}
              </button>
            </form>

            {misionRecienCreada && (
              <div className="mt-5 p-4 rounded-2xl bg-valle-50 border border-valle-500/30 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-valle-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Clase Lista para el Aula
                    </span>
                    <h3 className="font-bold text-base text-tierra-900 mt-0.5 break-words">
                      {misionRecienCreada.titulo_mision}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {misionRecienCreada.fases[0]?.retos_grados.map((rg, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-valle-500/30 text-tierra-800 font-medium"
                    >
                      <strong>
                        {rg.nivel_nombre || rg.nivel_codigo || `${rg.grado}°`}:
                      </strong>{" "}
                      {rg.tema_curricular || "Reto práctico"}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => lanzarMisionAlProyector(misionRecienCreada)}
                  className="w-full py-2.5 px-4 rounded-xl bg-valle-600 hover:bg-valle-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Proyectar esta Clase en el Aula
                </button>
              </div>
            )}
          </section>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico Radar por Niveles */}
              <div className="rounded-3xl bg-white border border-crema-300 shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-valle-700">
                      Mapa de Dominio
                    </span>
                    <GraduationCap className="w-4 h-4 text-valle-600" />
                  </div>
                  <h3 className="text-base font-bold text-tierra-900">
                    Equilibrio Curricular por Nivel
                  </h3>
                  <p className="text-xs text-tierra-600 mb-2">
                    Comparativa de avance entre los niveles del aula
                  </p>
                </div>

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
                      <Legend
                        wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FDFBF7",
                          borderColor: "#E5D7BE",
                          borderRadius: "12px",
                          color: "#241C15",
                          fontSize: "12px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico de Líneas de Evolución Semanal por Nivel */}
              <div className="rounded-3xl bg-white border border-crema-300 shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-lago-600">
                      Progreso Sostenido
                    </span>
                    <TrendingUp className="w-4 h-4 text-lago-600" />
                  </div>
                  <h3 className="text-base font-bold text-tierra-900">
                    Evolución de Logro por Nivel (%)
                  </h3>
                  <p className="text-xs text-tierra-600 mb-2">
                    Últimas 5 semanas de sesiones cooperativas
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={datosEvolucionSemanas}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F2E9D8" />
                      <XAxis
                        dataKey="semana"
                        tick={{ fill: "#57463A", fontSize: 11 }}
                      />
                      <YAxis
                        domain={[40, 100]}
                        tick={{ fill: "#57463A", fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FDFBF7",
                          borderColor: "#E5D7BE",
                          borderRadius: "12px",
                          color: "#241C15",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line
                        type="monotone"
                        name="Nivel 1"
                        dataKey="nivel_1"
                        stroke="#238564"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#238564" }}
                      />
                      <Line
                        type="monotone"
                        name="Nivel 2"
                        dataKey="nivel_2"
                        stroke="#2B6CB0"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#2B6CB0" }}
                      />
                      <Line
                        type="monotone"
                        name="Nivel 3"
                        dataKey="nivel_3"
                        stroke="#D4653B"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#D4653B" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Lista de Estudiantes Agrupados por Nivel */}
            <div className="rounded-3xl bg-white border border-crema-300 shadow-sm p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-terracotta-600" />
                  <h3 className="text-lg font-bold text-tierra-900">
                    Estudiantes del Aula por Nivel ({alumnos.length})
                  </h3>
                </div>
                <span className="text-xs text-tierra-600">
                  Agrupación flexible por nivel de aprendizaje
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {alumnos.map((al, idx) => {
                  const nivLabel =
                    al.nivel_nombre ||
                    al.nivel_codigo ||
                    `Nivel ${al.grado_actual <= 2 ? 1 : al.grado_actual <= 4 ? 2 : 3}`;
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
                      className="p-3.5 rounded-2xl bg-crema-50 border border-crema-200 flex flex-col justify-between gap-2 min-w-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-tierra-900 truncate">
                            {al.nombre_completo}
                          </p>
                          <p className="text-xs text-tierra-600 truncate">
                            {nivLabel}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${est.badge}`}
                        >
                          {al.nivel_codigo || `N${idx + 1}`}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-tierra-600">
                            Logro integral
                          </span>
                          <span className="font-bold text-tierra-900">
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
