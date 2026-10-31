export type TipoMecanica = "input_numerico" | "opcion_multiple" | "texto_corto";

export interface NivelAulaRow {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  color_hex: string;
  orden: number;
  activo: boolean;
}

export interface DocumentoCurricularRow {
  id: string;
  nombre_archivo: string;
  texto_extraido: string;
  total_temas: number;
  fecha_subida: string;
}

export interface TemaCurricularRow {
  id: string;
  documento_id?: string | null;
  nivel_id?: string | null;
  nivel_codigo: string;
  nivel_nombre: string;
  area_curricular: string;
  titulo_tema: string;
  competencia_minedu: string;
  desempeno_esperado: string;
  estado: "pendiente" | "en_curso" | "completado";
  orden: number;
}

export interface RetoGrado {
  grado?: number;
  nivel_codigo?: string;
  nivel_nombre?: string;
  tema_curricular?: string;
  area_curricular?: string;
  instruccion: string;
  tipo_mecanica: TipoMecanica;
  opciones?: string[];
  respuesta_correcta: string;
  feedback_error: string;
}

export interface FaseMision {
  numero_fase: number;
  narrativa_fase: string;
  retos_grados: RetoGrado[];
}

export interface MisionYuyAI {
  id?: string;
  titulo_mision: string;
  prompt_sdxl_base: string;
  fases: FaseMision[];
  narrativa_victoria: string;
  prompt_sdxl_victoria: string;
  imagen_base_url?: string;
  imagen_victoria_url?: string;
  niveles_incluidos?: string[];
  fecha_creacion?: string;
}

export interface CompetenciasAlumno {
  logica_matematica: number;
  comprension_lectora: number;
  resolucion_problemas: number;
  trabajo_colaborativo: number;
  expresion_oral: number;
  pensamiento_creativo: number;
}

export interface AlumnoRow {
  id: string;
  nombre_completo: string;
  grado_actual: number;
  nivel_codigo?: string;
  nivel_nombre?: string;
  competencias: CompetenciasAlumno;
}

export interface MisionPlantillaRow {
  id: string;
  titulo: string;
  fases_json: MisionYuyAI;
  fecha_creacion: string;
}

export interface MetricasSesion {
  tasa_exito: number;
  tiempo_promedio_seg: number;
  intentos_totales: number;
  errores_tts_activados: number;
  precision_por_nivel?: Record<string, number>;
  grado_2_precision?: number;
  grado_3_precision?: number;
  semana?: string;
}

export interface SesionAulaRow {
  id: string;
  mision_id: string | null;
  fecha: string;
  metricas: MetricasSesion;
}
