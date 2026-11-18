import * as Cita from '../repository/cita.repository.js';

function validarDatosCita(datos) {
  if (!datos.servicioId) {
    return 'El servicio es obligatorio.';
  }

  if (!datos.nutricionistaId) {
    return 'El nutricionista es obligatorio.';
  }

  if (!datos.fecha) {
    return 'La fecha es obligatoria.';
  }

  if (!datos.hora) {
    return 'La hora es obligatoria.';
  }

  const fechaSeleccionada = new Date(datos.fecha + 'T00:00:00');
  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  if (fechaSeleccionada < hoy) {
    return 'No puedes agendar una cita en una fecha anterior a hoy.';
  }

  if (!datos.nombre) {
    return 'El nombre es obligatorio.';
  }

  if (!datos.correo) {
    return 'El correo es obligatorio.';
  }

  if (datos.precio === undefined || datos.precio === null) {
    return 'El precio es obligatorio.';
  }

  return null;
}

export async function crearCita(datos) {
  const error = validarDatosCita(datos);

  if (error) {
    return {
      ok: false,
      estado: 400,
      error,
    };
  }

  const cita = await Cita.crearCita(datos);

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

export async function obtenerCita(id, usuarioId, rol) {
  const cita = await Cita.buscarCitaPorId(id);

  if (!cita) {
    return {
      ok: false,
      estado: 404,
      error: 'La cita no existe.',
    };
  }

  if (rol !== 'admin' && cita.usuario_id !== usuarioId) {
    return {
      ok: false,
      estado: 403,
      error: 'No tienes permiso para ver esta cita.',
    };
  }

  return {
    ok: true,
    estado: 200,
    cita,
  };
}

export async function reprogramarCita(id, datos) {
  if (!datos.fecha && !datos.hora) {
    return {
      ok: false,
      estado: 400,
      error: 'Debes enviar una nueva fecha o una nueva hora.',
    };
  }

  if (datos.fecha) {
    const fechaSeleccionada = new Date(datos.fecha + 'T00:00:00');
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      return {
        ok: false,
        estado: 400,
        error: 'No puedes reprogramar una cita para una fecha anterior a hoy.',
      };
    }
  }

  const cita = await Cita.actualizarCita(id, {
    fecha: datos.fecha,
    hora: datos.hora,
    estado: 'reprogramada',
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
