import { Router } from 'express';
import {
  obtenerServicios,
  obtenerServicio,
} from '../controller/servicio.controller.js';

const router = Router();

router.get('/', obtenerServicios);
router.get('/:id', obtenerServicio);

export default router;
