-- Tablas del backend de la clínica (esquema "app" en la RDS).
-- Mismos datos y nombres que src/data/ del frontend.
SET search_path TO app;

-- Usuarios (data/usuarios.js). La contraseña se guarda con hash, nunca en texto plano.
CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    run           VARCHAR(12)  NOT NULL UNIQUE,
    nombre        VARCHAR(50)  NOT NULL,
    apellidos     VARCHAR(50)  NOT NULL,
    correo        VARCHAR(100) NOT NULL UNIQUE,
    telefono      VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    rol           VARCHAR(10)  NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin', 'cliente'))
);

-- Catálogo de servicios (data/servicios.js).
CREATE TABLE IF NOT EXISTS servicios (
    id              SERIAL PRIMARY KEY,
    codigo          VARCHAR(10)  NOT NULL UNIQUE,
    categoria       VARCHAR(30)  NOT NULL,
    nombre          VARCHAR(100) NOT NULL,
    duracion        VARCHAR(20),
    modalidad       VARCHAR(30),
    profesional     VARCHAR(30),
    precio          INTEGER NOT NULL CHECK (precio >= 0),
    precio_anterior INTEGER CHECK (precio_anterior >= 0),
    oferta          BOOLEAN NOT NULL DEFAULT FALSE,
    disponibilidad  BOOLEAN NOT NULL DEFAULT TRUE,
    cupos           INTEGER NOT NULL DEFAULT 0 CHECK (cupos >= 0),
    descripcion     TEXT
);

-- Nutricionistas (data/nutricionistas.js).
CREATE TABLE IF NOT EXISTS nutricionistas (
    id           VARCHAR(10)  PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    dias         VARCHAR(50),
    horario      VARCHAR(30)
);

-- Citas: la operación principal (Confirmacion.jsx y citaService.js).
CREATE TABLE IF NOT EXISTS citas (
    id               SERIAL PRIMARY KEY,
    usuario_id       INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    servicio_id      INTEGER     NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
    nutricionista_id VARCHAR(10) NOT NULL REFERENCES nutricionistas(id) ON DELETE RESTRICT,
    fecha            DATE        NOT NULL,
    hora             VARCHAR(5)  NOT NULL,
    nombre           VARCHAR(100) NOT NULL,
    correo           VARCHAR(100) NOT NULL,
    precio           INTEGER     NOT NULL CHECK (precio >= 0),
    estado           VARCHAR(15) NOT NULL DEFAULT 'pendiente'
                     CHECK (estado IN ('pendiente', 'confirmada', 'reprogramada', 'cancelada'))
);

-- Sesiones: tokens de renovación, para poder cerrar sesión y renovar el acceso.
CREATE TABLE IF NOT EXISTS sesiones (
    id         SERIAL PRIMARY KEY,
    usuario_id INTEGER      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expira_en  TIMESTAMP    NOT NULL,
    revocada   BOOLEAN      NOT NULL DEFAULT FALSE
);