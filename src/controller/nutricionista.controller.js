import * as nutricionistaService from '../service/nutricionista.service.js';

export async function obtenerNutricionistas(req, res) {
  try {
    const resultado =
      await nutricionistaService.obtenerNutricionistas();

    res.status(resultado.estado).json(resultado.nutricionistas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudieron obtener los nutricionistas.',
    });
  }
}

export async function obtenerNutricionista(req, res) {
  try {
    const resultado =
      await nutricionistaService.obtenerNutricionista(
        req.params.id,
      );

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.nutricionista);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo obtener el nutricionista.',
    });
  }
}

export async function crearNutricionista(req, res) {
  try {
    const resultado =
      await nutricionistaService.crearNutricionista(req.body);

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.nutricionista);
  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un nutricionista con ese identificador.',
      });
    }

    res.status(500).json({
      error: 'No se pudo crear el nutricionista.',
    });
  }
}

export async function actualizarNutricionista(req, res) {
  try {
    const resultado =
      await nutricionistaService.actualizarNutricionista(
        req.params.id,
        req.body,
      );

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.nutricionista);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo actualizar el nutricionista.',
    });
  }
}

export async function eliminarNutricionista(req, res) {
  try {
    const resultado =
      await nutricionistaService.eliminarNutricionista(
        req.params.id,
      );

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    if (error.code === '23503') {
      return res.status(409).json({
        error: 'No se puede eliminar el nutricionista porque tiene citas asociadas.',
      });
    }

    res.status(500).json({
      error: 'No se pudo eliminar el nutricionista.',
    });
  }
}
