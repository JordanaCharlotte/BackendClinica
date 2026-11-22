import * as citaService from '../service/cita.service.js';

export async function crearCita(req, res) {
  try {
    const datos = {
      usuarioId: req.usuario.id,
      servicioId: req.body.servicioId,
      nutricionistaId: req.body.nutricionistaId,
      fecha: req.body.fecha,
      hora: req.body.hora,
    };

    const resultado = await citaService.crearCita(datos);

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.cita);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo crear la cita.',
    });
  }
}

export async function obtenerCitas(req, res) {
  try {
    const resultado = await citaService.obtenerCitas(
      req.usuario.id,
      req.usuario.rol,
    );

    res.status(resultado.estado).json(resultado.citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudieron obtener las citas.',
    });
  }
}

export async function obtenerCita(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El id de la cita no es válido"
      });
    }
    const resultado = await citaService.obtenerCita(
      id,
      req.usuario.id,
      req.usuario.rol,
    );

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.cita);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo obtener la cita.',
    });
  }
}

export async function reprogramarCita(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El id de la cita no es válido.",
      });
    }
    const resultado = await citaService.reprogramarCita(id, req.body);

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.cita);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'No se pudo reprogramar la cita.',
    });
  }
}

export async function cancelarCita(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El id de la cita no es válido.',
      });
    }

    const resultado = await citaService.cancelarCita(id);

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    return res.status(resultado.estado).json(resultado.cita);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'No se pudo cancelar la cita.',
    });
  }
}
