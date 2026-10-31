import Link from "next/link";
import { BookOpen, Play, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-crema-100 text-tierra-900 flex flex-col justify-between">
      {/* Cabecera simple y limpia de escuela */}
      <header className="w-full border-b border-crema-300 bg-crema-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              Y
            </div>
            <div>
              <span className="font-bold text-lg text-tierra-900 block leading-none">
                YuyAI · Aula Primaria Multinivel
              </span>
              <span className="text-xs text-tierra-600">
                Ciclos III, IV y V · Educación Primaria
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/maestro/dashboard"
              className="px-4 py-2 rounded-xl bg-white hover:bg-crema-200 text-tierra-800 border border-crema-300 text-xs sm:text-sm font-bold transition-colors"
            >
              Sala del Docente
            </Link>
            <Link
              href="/aula/mision-viva"
              className="px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              Pizarra del Salón
            </Link>
          </div>
        </div>
      </header>

      {/* Cuerpo central directo y natural */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-valle-100 text-valle-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Sesiones Interactivas por Niveles
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-tierra-900 tracking-tight">
            Una misma historia en el aula, un aprendizaje para cada nivel
          </h1>
          <p className="text-sm sm:text-base text-tierra-700">
            Elige dónde deseas ingresar hoy para comenzar la sesión escolar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1: Docente */}
          <Link
            href="/maestro/dashboard"
            className="group rounded-3xl bg-white border-2 border-crema-300 hover:border-terracotta-500 p-7 shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                  Para el Profesor
                </span>
                <h2 className="text-2xl font-bold text-tierra-900 mt-1">
                  Preparar la Clase del Día
                </h2>
                <p className="text-sm text-tierra-700 mt-2 leading-relaxed">
                  Sube tu programación en PDF, elige los temas que trabajará
                  cada nivel del salón y genera el cuento ilustrado con su
                  explicación teórica y ejercicios.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-crema-200 flex items-center justify-between text-sm font-bold text-terracotta-600">
              <span>Entrar al Planificador Docente</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          {/* Tarjeta 2: Aula */}
          <Link
            href="/aula/mision-viva"
            className="group rounded-3xl bg-white border-2 border-crema-300 hover:border-valle-500 p-7 shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-valle-100 text-valle-600 flex items-center justify-center">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-valle-700">
                  Para Proyectar con los Niños
                </span>
                <h2 className="text-2xl font-bold text-tierra-900 mt-1">
                  Pizarra Interactiva del Salón
                </h2>
                <p className="text-sm text-tierra-700 mt-2 leading-relaxed">
                  Presenta primero el capítulo del cuento ilustrado y la
                  explicación corta para cada grupo, y luego pasa a resolver
                  las preguntas en equipo.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-crema-200 flex items-center justify-between text-sm font-bold text-valle-700">
              <span>Abrir Pizarra de Clase</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <footer className="border-t border-crema-300 bg-crema-50 py-4 text-center text-xs text-tierra-600">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>Escuela Primaria Multinivel · YuyAI</span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-terracotta-500" />
            Nivel 1 (Ciclo III) · Nivel 2 (Ciclo IV) · Nivel 3 (Ciclo V)
          </span>
        </div>
      </footer>
    </main>
  );
}
