import * as Servicio from '../repository/servicio.repository.js';

function validarId(id) {
  return Number.isInteger(id) && id > 0;
}

function prepararDatos(datos) {
  return {
    codigo: datos.codigo?.trim(),
    categoria: datos.categoria?.trim(),
    nombre: datos.nombre?.trim(),
    duracion: datos.duracion?.trim() || null,
    modalidad: datos.modalidad?.trim() || null,
    profesional: datos.profesional?.trim() || null,
    precio: datos.precio,
    precioAnterior: datos.precioAnterior ?? null,
    oferta: datos.oferta ?? false,
    disponibilidad: datos.disponibilidad ?? true,
    cupos: datos.cupos ?? 0,
    descripcion: datos.descripcion?.trim() || null,
  };
}

function validarDatos(datos, esActualizacion = false) {
  if (!esActualizacion) {
    if (!datos.codigo?.trim()) {
      return 'El código del servicio es obligatorio.';
    }

    if (!datos.categoria?.trim()) {
      return 'La categoría del servicio es obligatoria.';
    }

    if (!datos.nombre?.trim()) {
      return 'El nombre del servicio es obligatorio.';
    }

    if (datos.precio === undefined || datos.precio === null) {
      return 'El precio del servicio es obligatorio.';
    }
  }

  if (datos.precio !== undefined && datos.precio !== null) {
    const precio = Number(datos.precio);

    if (!Number.isInteger(precio) || precio < 0) {
      return 'El precio debe ser un número entero mayor o igual a cero.';
    }
  }

  if (datos.cupos !== undefined && datos.cupos !== null) {
    const cupos = Number(datos.cupos);

    if (!Number.isInteger(cupos) || cupos < 0) {
      return 'Los cupos deben ser un número entero mayor o igual a cero.';
    }
  }

  if (
    datos.precioAnterior !== undefined &&
    datos.precioAnterior !== null
  ) {
    const precioAnterior = Number(datos.precioAnterior);

    if (!Number.isInteger(precioAnterior) || precioAnterior < 0) {
      return 'El precio anterior debe ser un número entero mayor o igual a cero.';
    }
  }

  return null;
}

export async function obtenerServicios() {
  const servicios = await Servicio.buscarTodosLosServicios();

  return {
    ok: true,
    estado: 200,
    servicios,
  };
}

export async function obtenerServicio(id) {
  if (!validarId(id)) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del servicio no es válido.',
    };
  }

  const servicio = await Servicio.buscarServicioPorId(id);

  if (!servicio) {
    return {
      ok: false,
      estado: 404,
      error: 'El servicio no existe.',
    };
  }

  return {
    ok: true,
    estado: 200,
    servicio,
  };
}

export async function crearServicio(datos) {
  const error = validarDatos(datos);

  if (error) {
    return {
      ok: false,
      estado: 400,
      error,
    };
  }

  const servicio = await Servicio.crearServicio(
    prepararDatos(datos),
  );

  return {
    ok: true,
    estado: 201,
    servicio,
  };
}

export async function actualizarServicio(id, datos) {
  if (!validarId(id)) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del servicio no es válido.',
    };
  }

  const existente = await Servicio.buscarServicioPorId(id);

  if (!existente) {
    return {
      ok: false,
      estado: 404,
      error: 'El servicio no existe.',
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

  const servicio = await Servicio.actualizarServicio(id, {
    codigo: datos.codigo?.trim(),
    categoria: datos.categoria?.trim(),
    nombre: datos.nombre?.trim(),
    duracion: datos.duracion?.trim(),
    modalidad: datos.modalidad?.trim(),
    profesional: datos.profesional?.trim(),
    precio: datos.precio,
    precioAnterior: datos.precioAnterior,
    oferta: datos.oferta,
    disponibilidad: datos.disponibilidad,
    cupos: datos.cupos,
    descripcion: datos.descripcion?.trim(),
  });

  return {
    ok: true,
    estado: 200,
    servicio,
  };
}

export async function eliminarServicio(id) {
  if (!validarId(id)) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del servicio no es válido.',
    };
  }

  const existente = await Servicio.buscarServicioPorId(id);

  if (!existente) {
    return {
      ok: false,
      estado: 404,
      error: 'El servicio no existe.',
    };
  }

  await Servicio.eliminarServicio(id);

  return {
    ok: true,
    estado: 204,
  };
}
