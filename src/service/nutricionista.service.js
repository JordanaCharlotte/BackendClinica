import * as Nutricionista from '../repository/nutricionista.repository.js';

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
  if (!id || typeof id !== 'string') {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del nutricionista no es válido.',
    };
  }

  const nutricionista =
    await Nutricionista.buscarNutricionistaPorId(id);

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
