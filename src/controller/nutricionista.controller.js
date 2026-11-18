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
