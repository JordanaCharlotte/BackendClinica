import { Router } from 'express';
import {
  crearCita,
  obtenerCitas,
  obtenerCita,
  reprogramarCita,
  cancelarCita,
} from '../controller/cita.controller.js';
import {
  verificarToken,
  permitirRoles,
} from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, crearCita);

router.get('/', verificarToken, obtenerCitas);

router.get('/:id', verificarToken, obtenerCita);

router.patch(
  '/:id/reprogramar',
  verificarToken,
  permitirRoles('admin'),
  reprogramarCita,
);

router.delete(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  cancelarCita,
);

export default router;
