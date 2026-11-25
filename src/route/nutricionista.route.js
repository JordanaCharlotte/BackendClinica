import { Router } from 'express';
import {
  obtenerNutricionistas,
  obtenerNutricionista,
  crearNutricionista,
  actualizarNutricionista,
  eliminarNutricionista,
} from '../controller/nutricionista.controller.js';
import {
  verificarToken,
  permitirRoles,
} from '../middleware/auth.middleware.js';

const router = Router();

// Consultas públicas.
router.get('/', obtenerNutricionistas);
router.get('/:id', obtenerNutricionista);

// Operaciones administrativas.
router.post(
  '/',
  verificarToken,
  permitirRoles('admin'),
  crearNutricionista,
);

router.put(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  actualizarNutricionista,
);

router.delete(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  eliminarNutricionista,
);

export default router;
