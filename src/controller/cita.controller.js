import * as citaService from '../service/cita.service.js';

export async function crearCita(req, res) {
  try {
    const datos = {
      usuarioId: req.usuario.id,
      servicioId: req.body.servicioId,
      nutricionistaId: req.body.nutricionistaId,
      fecha: req.body.fecha,
      hora: req.body.hora,
      nombre: req.body.nombre,
      correo: req.body.correo,
      precio: req.body.precio,
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
    const resultado = await citaService.obtenerCita(
      Number(req.params.id),
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
    const resultado = await citaService.reprogramarCita(
      Number(req.params.id),
      req.body,
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
      error: 'No se pudo reprogramar la cita.',
    });
  }
}

export async function cancelarCita(req, res) {
  try {
    const resultado = await citaService.cancelarCita(
      Number(req.params.id),
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
      error: 'No se pudo cancelar la cita.',
    });
  }
}
