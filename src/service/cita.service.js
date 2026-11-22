import * as Cita from '../repository/cita.repository.js';
import * as Usuario from '../repository/usuario.repository.js';
import * as Servicio from '../repository/servicio.repository.js';
import * as Nutricionista from '../repository/nutricionista.repository.js';


function obtenerFechaChile() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
  }).format(new Date());
}

function validarFecha(fecha) {
  if (typeof fecha !== 'string' || fecha.length === 0) {
    return 'La fecha es obligatoria.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return 'La fecha debe tener el formato AAAA-MM-DD.';
  }

  const partes = fecha.split('-');
  const anio = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  const fechaComprobacion = new Date(
    Date.UTC(anio, mes - 1, dia),
  );

  if (
    fechaComprobacion.getUTCFullYear() !== anio ||
    fechaComprobacion.getUTCMonth() !== mes - 1 ||
    fechaComprobacion.getUTCDate() !== dia
  ) {
    return 'La fecha no es válida.';
  }

  if (fecha < obtenerFechaChile()) {
    return 'No puedes agendar una cita en una fecha anterior a hoy.';
  }

  return null;
}

function validarHora(hora) {
  if (typeof hora !== 'string' || hora.length === 0) {
    return 'La hora es obligatoria.';
  }

  if (!/^\d{2}:\d{2}$/.test(hora)) {
    return 'La hora debe tener el formato HH:MM.';
  }

  const partes = hora.split(':');
  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);

  if (horas > 23 || minutos > 59) {
    return 'La hora no es válida.';
  }

  return null;
}

function validarServicioId(servicioId) {
  const id = Number(servicioId);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function crearCita(datos) {
  const servicioId = validarServicioId(datos.servicioId);

  if (servicioId === null) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del servicio no es válido.',
    };
  }

  if (!datos.nutricionistaId) {
    return {
      ok: false,
      estado: 400,
      error: 'El nutricionista es obligatorio.',
    };
  }

  const errorFecha = validarFecha(datos.fecha);

  if (errorFecha) {
    return {
      ok: false,
      estado: 400,
      error: errorFecha,
    };
  }

  const errorHora = validarHora(datos.hora);

  if (errorHora) {
    return {
      ok: false,
      estado: 400,
      error: errorHora,
    };
  }

  const usuario = await Usuario.buscarPorId(datos.usuarioId);

  if (!usuario) {
    return {
      ok: false,
      estado: 404,
      error: 'El usuario autenticado no existe.',
    };
  }

  const servicio = await Servicio.buscarServicioPorId(servicioId);

  if (!servicio) {
    return {
      ok: false,
      estado: 404,
      error: 'El servicio no existe.',
    };
  }

  if (!servicio.disponibilidad) {
    return {
      ok: false,
      estado: 409,
      error: 'El servicio no está disponible.',
    };
  }

  if (servicio.cupos <= 0) {
    return {
      ok: false,
      estado: 409,
      error: 'El servicio no tiene cupos disponibles.',
    };
  }

  const nutricionista =
    await Nutricionista.buscarNutricionistaPorId(
      datos.nutricionistaId,
    );

  if (!nutricionista) {
    return {
      ok: false,
      estado: 404,
      error: 'El nutricionista no existe.',
    };
  }

  const horarioOcupado = await Cita.existeHorario(
  nutricionista.id,
  datos.fecha,
  datos.hora,
);

if (horarioOcupado) {
  return {
    ok: false,
    estado: 409,
    error: 'El nutricionista ya tiene una cita en ese horario.',
  };
}

  const datosCita = {
    usuarioId: usuario.id,
    servicioId: servicio.id,
    nutricionistaId: nutricionista.id,
    fecha: datos.fecha,
    hora: datos.hora,
    nombre: usuario.nombre + ' ' + usuario.apellidos,
    correo: usuario.correo,
    precio: servicio.precio,
  };

  const cita = await Cita.crearCita(datosCita);

  return {
    ok: true,
    estado: 201,
    cita,
  };
}

export async function obtenerCitas(usuarioId, rol) {
  let citas;

  if (rol === 'admin') {
    citas = await Cita.buscarTodasLasCitas();
  } else {
    citas = await Cita.buscarCitasPorUsuario(usuarioId);
  }

  return {
    ok: true,
    estado: 200,
    citas,
  };
}

export async function reprogramarCita(id, datos) {
  const citaActual = await Cita.buscarCitaPorId(id);

  if (!citaActual) {
    return {
      ok: false,
      estado: 404,
      error: 'La cita no existe.',
    };
  }

  if (citaActual.estado === 'cancelada') {
    return {
      ok: false,
      estado: 409,
      error: 'No se puede reprogramar una cita cancelada.',
    };
  }

  if (!datos.fecha && !datos.hora) {
    return {
      ok: false,
      estado: 400,
      error: 'Debes enviar una nueva fecha o una nueva hora.',
    };
  }

  if (datos.fecha) {
    const errorFecha = validarFecha(datos.fecha);

    if (errorFecha) {
      return {
        ok: false,
        estado: 400,
        error: errorFecha,
      };
    }
  }

  if (datos.hora) {
    const errorHora = validarHora(datos.hora);

    if (errorHora) {
      return {
        ok: false,
        estado: 400,
        error: errorHora,
      };
    }
  }

    const nuevaFecha = datos.fecha || citaActual.fecha;
  const nuevaHora = datos.hora || citaActual.hora;

  const horarioOcupado = await Cita.existeHorario(
    citaActual.nutricionista_id,
    nuevaFecha,
    nuevaHora,
    id,
  );

  if (horarioOcupado) {
    return {
      ok: false,
      estado: 409,
      error: 'El nutricionista ya tiene otra cita en ese horario.',
    };
  }

  const cita = await Cita.actualizarCita(id, {
    fecha: datos.fecha,
    hora: datos.hora,
    estado: 'reprogramada',
  });

  return {
    ok: true,
    estado: 200,
    cita,
  };
}

export async function cancelarCita(id) {
  const cita = await Cita.actualizarCita(id, {
    estado: 'cancelada',
  });

  if (!cita) {
    return {
      ok: false,
      estado: 404,
      error: 'La cita no existe.',
    };
  }

  return {
    ok: true,
    estado: 200,
    cita,
  };
}
