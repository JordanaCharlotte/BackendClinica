import * as Nutricionista from '../repository/nutricionista.repository.js';

function validarId(id) {
  return typeof id === 'string' && /^NUT\d{3,}$/i.test(id.trim());
}

function prepararDatos(datos) {
  return {
    id: datos.id?.trim().toUpperCase(),
    nombre: datos.nombre?.trim(),
    especialidad: datos.especialidad?.trim() || null,
    dias: datos.dias?.trim() || null,
    horario: datos.horario?.trim() || null,
  };
}

function validarDatos(datos, esActualizacion = false) {
  if (!esActualizacion && !datos.id?.trim()) {
    return 'El identificador del nutricionista es obligatorio.';
  }

  if (!esActualizacion && !validarId(datos.id)) {
    return 'El identificador debe tener un formato como NUT005.';
  }

  if (!esActualizacion && !datos.nombre?.trim()) {
    return 'El nombre del nutricionista es obligatorio.';
  }

  if (datos.nombre !== undefined) {
    if (
      typeof datos.nombre !== 'string' ||
      !datos.nombre.trim()
    ) {
      return 'El nombre del nutricionista no puede estar vacío.';
    }
  }

  return null;
}

export async function obtenerNutricionistas() {
  const nutricionistas =
    await Nutricionista.buscarTodosLosNutricionistas();

  return {
    ok: true,
    estado: 200,
    nutricionistas,
  };
}

export async function obtenerNutricionista(id) {
  if (!validarId(id)) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del nutricionista no es válido.',
    };
  }

  const nutricionista =
    await Nutricionista.buscarNutricionistaPorId(id.trim().toUpperCase());

  if (!nutricionista) {
    return {
      ok: false,
      estado: 404,
      error: 'El nutricionista no existe.',
    };
  }

  return {
    ok: true,
    estado: 200,
    nutricionista,
  };
}

export async function crearNutricionista(datos) {
  const error = validarDatos(datos);

  if (error) {
    return {
      ok: false,
      estado: 400,
      error,
    };
  }

  const nutricionista =
    await Nutricionista.crearNutricionista(
      prepararDatos(datos),
    );

  return {
    ok: true,
    estado: 201,
    nutricionista,
  };
}

export async function actualizarNutricionista(id, datos) {
  const idNormalizado = String(id ?? '').trim().toUpperCase();

  if (!validarId(idNormalizado)) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del nutricionista no es válido.',
    };
  }

  const existente =
    await Nutricionista.buscarNutricionistaPorId(idNormalizado);

  if (!existente) {
    return {
      ok: false,
      estado: 404,
      error: 'El nutricionista no existe.',
    };
  }

  const error = validarDatos(datos, true);

  if (error) {
    return {
      ok: false,
      estado: 400,
      error,
    };
  }

  const nutricionista =
    await Nutricionista.actualizarNutricionista(
      idNormalizado,
      {
        nombre: datos.nombre?.trim(),
        especialidad: datos.especialidad?.trim(),
        dias: datos.dias?.trim(),
        horario: datos.horario?.trim(),
      },
    );

  return {
    ok: true,
    estado: 200,
    nutricionista,
  };
}

export async function eliminarNutricionista(id) {
  const idNormalizado = String(id ?? '').trim().toUpperCase();

  if (!validarId(idNormalizado)) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del nutricionista no es válido.',
    };
  }

  const existente =
    await Nutricionista.buscarNutricionistaPorId(idNormalizado);

  if (!existente) {
    return {
      ok: false,
      estado: 404,
      error: 'El nutricionista no existe.',
    };
  }

  await Nutricionista.eliminarNutricionista(idNormalizado);

  return {
    ok: true,
    estado: 204,
  };
}
