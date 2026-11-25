import { Router } from 'express';
import {
  obtenerServicios,
  obtenerServicio,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from '../controller/servicio.controller.js';
import {
  verificarToken,
  permitirRoles,
} from '../middleware/auth.middleware.js';

const router = Router();

// Consultas del catálogo.
router.get('/', obtenerServicios);
router.get('/:id', obtenerServicio);

// Operaciones administrativas.
router.post(
  '/',
  verificarToken,
  permitirRoles('admin'),
  crearServicio,
);

router.put(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  actualizarServicio,
);

router.delete(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  eliminarServicio,
);

export default router;
