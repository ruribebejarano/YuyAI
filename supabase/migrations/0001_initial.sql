-- Migración Inicial YuyAI: Orquestador Educativo Multinivel MINEDU
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE niveles_aula (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    descripcion TEXT DEFAULT '',
    color_hex TEXT DEFAULT '#C85A32',
    orden INT NOT NULL DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE documentos_curriculares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_archivo TEXT NOT NULL,
    texto_extraido TEXT DEFAULT '',
    total_temas INT DEFAULT 0,
    fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE temas_curriculares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento_id UUID REFERENCES documentos_curriculares(id) ON DELETE SET NULL,
    nivel_id UUID REFERENCES niveles_aula(id) ON DELETE CASCADE,
    nivel_codigo TEXT NOT NULL,
    nivel_nombre TEXT NOT NULL,
    area_curricular TEXT NOT NULL,
    titulo_tema TEXT NOT NULL,
    competencia_minedu TEXT NOT NULL,
    desempeno_esperado TEXT DEFAULT '',
    estado TEXT DEFAULT 'pendiente',
    orden INT DEFAULT 1,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE alumnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_completo TEXT NOT NULL,
    grado_actual INT NOT NULL DEFAULT 1,
    nivel_codigo TEXT DEFAULT 'nivel_1',
    nivel_nombre TEXT DEFAULT 'Nivel 1 · Ciclo III',
    competencias JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE misiones_plantillas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    fases_json JSONB NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sesiones_aula (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mision_id UUID REFERENCES misiones_plantillas(id) ON DELETE CASCADE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metricas JSONB NOT NULL
);
