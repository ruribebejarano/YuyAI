# YuyAI — Orquestador Educativo Gamificado para Aulas Multigrado

**YuyAI** transforma las sesiones del Currículo Nacional (MINEDU) en aventuras colaborativas para aulas rurales multigrado (2° y 3° grado de primaria), combinando estética **Andino Moderno y Mágico**, visualización analítica para el docente y acompañamiento pedagógico por voz sin consumo adicional de ancho de banda.

---

## Arquitectura y Rutas Principales

- **`/maestro/dashboard` (El Centro de Mando)**:
  - **Grafo de Conexiones (`recharts` RadarChart)**: Comparativa de competencias entre 2° y 3° grado.
  - **Evolución del Aula (`recharts` LineChart)**: Progreso por jornada escolar.
  - **Telar de Misiones**: Historial conectado en tiempo real a Supabase (`misiones_plantillas`) y creador de nuevas misiones con tono humano pedagógico.
- **`/aula/mision-viva` (La Clase Interactiva)**:
  - Pantalla completa (`h-screen`) de alto contraste pensada para proyectores rurales, con fondo dinámico (RunPod SDXL Turbo + efecto *Ken Burns* y respaldo automático `onError` en `/fallbacks/andes-bg.jpg`).
  - **Split Screen Multigrado**: Paneles translúcidos (*Glassmorphism*) para 2° y 3° grado.
  - **Retroalimentación por Voz (`window.speechSynthesis`)**: Si un grado ingresa una respuesta incorrecta, el panel vibra en rojo (`framer-motion`) y el sistema lee automáticamente la pista pedagógica (`feedback_error`).
  - **Celebración Comunitaria**: Confeti (`canvas-confetti`) y registro automático de métricas en `sesiones_aula`.

---

## Base de Datos (Supabase)

La migración inicial se encuentra en [`supabase/migrations/0001_initial.sql`](./supabase/migrations/0001_initial.sql) e incluye las tablas:
- `alumnos`
- `misiones_plantillas`
- `sesiones_aula`
