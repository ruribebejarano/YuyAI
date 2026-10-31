import Link from "next/link";
import {
  Compass,
  BookOpen,
  Mountain,
  FileText,
  Layers,
  Volume2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-crema-100 text-tierra-900">
      {/* Barra de Navegación Limpia y Natural */}
      <header className="sticky top-0 z-30 border-b border-crema-300 bg-crema-50/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta-600 text-white shadow-sm">
              <Mountain className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-tierra-900 sm:text-2xl">
                Yuy<span className="text-terracotta-600">AI</span>
              </span>
              <p className="text-xs font-semibold text-tierra-600">
                Escuela Primaria Multinivel · MINEDU
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              href="/maestro/dashboard"
              className="rounded-xl border border-crema-300 bg-white px-4 py-2 text-sm font-bold text-tierra-800 shadow-sm transition hover:border-terracotta-500 hover:text-terracotta-600 sm:text-base"
            >
              Cuaderno del Maestro
            </Link>
            <Link
              href="/aula/mision-viva"
              className="rounded-xl bg-valle-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-valle-700 sm:text-base"
            >
              Proyectar Clase Viva
            </Link>
          </nav>
        </div>
      </header>

      {/* Sección Principal */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-valle-500/30 bg-valle-50 px-4 py-1.5 text-sm font-bold text-valle-700">
              <Layers className="h-4 w-4" />
              <span>Organización flexible por Niveles y Ciclos MINEDU</span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-tierra-900 sm:text-5xl">
              Transforma tu PDF curricular en una{" "}
              <span className="text-terracotta-600">
                aventura compartida para todos los niveles de tu aula
              </span>
            </h1>

            <p className="text-base leading-relaxed text-tierra-700 sm:text-lg">
              Diseñado para docentes de primaria multigrado: sube el documento
              PDF con los temas del MINEDU, organiza qué temas corresponden a
              cada nivel en la base de datos y genera la sesión interactiva del
              día con acompañamiento por voz e ilustraciones creadas al
              instante.
            </p>

            <div className="flex flex-col gap-3.5 pt-2 sm:flex-row">
              <Link
                href="/maestro/dashboard"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-terracotta-600 px-6 py-4 text-base font-extrabold text-white shadow-md transition hover:bg-terracotta-700 sm:text-lg"
              >
                <Compass className="h-5 w-5" />
                <span>Abrir Centro del Maestro</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/aula/mision-viva"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-valle-600 bg-white px-6 py-4 text-base font-extrabold text-valle-700 shadow-sm transition hover:bg-valle-50 sm:text-lg"
              >
                <BookOpen className="h-5 w-5" />
                <span>Ir a la Clase Interactiva</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-tierra-700">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-valle-600" />
                <span>Carga de PDF por Niveles</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-tierra-700">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-valle-600" />
                <span>Grafo Curricular en BD</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-tierra-700">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-valle-600" />
                <span>Pistas habladas por voz</span>
              </div>
            </div>
          </div>

          {/* Tarjeta visual de flujo pedagógico */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-crema-300 bg-white p-6 shadow-lg sm:p-8">
              <h2 className="text-lg font-extrabold text-tierra-900 sm:text-xl">
                ¿Cómo funciona en el aula?
              </h2>
              <p className="mt-1 text-sm text-tierra-600">
                Flujo completo conectado a Supabase, Gemini y RunPod SDXL Turbo
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4 rounded-2xl bg-crema-50 p-4 border border-crema-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta-100 text-terracotta-700 font-black">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-tierra-900">
                      1. Sube el PDF de Temas MINEDU
                    </h3>
                    <p className="mt-0.5 text-sm text-tierra-700">
                      El sistema identifica los niveles del aula y guarda todos
                      los temas de cada nivel en la base de datos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-crema-50 p-4 border border-crema-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-valle-100 text-valle-700 font-black">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-tierra-900">
                      2. Elige los Temas del Día por Nivel
                    </h3>
                    <p className="mt-0.5 text-sm text-tierra-700">
                      Explora el grafo de temas por nivel y selecciona qué tema
                      trabajará hoy el Nivel 1, Nivel 2 o Nivel 3.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-crema-50 p-4 border border-crema-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lago-100 text-lago-600 font-black">
                    <Volume2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-tierra-900">
                      3. Clase Interactiva con Voz e Imagen
                    </h3>
                    <p className="mt-0.5 text-sm text-tierra-700">
                      Cada nivel resuelve sus retos en pantalla con pistas
                      habladas automáticas cuando necesitan apoyo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-crema-300 bg-crema-50 py-4 text-center text-xs font-medium text-tierra-600 sm:text-sm">
        YuyAI · Plataforma pedagógica multinivel para escuelas primarias
      </footer>
    </div>
  );
}
