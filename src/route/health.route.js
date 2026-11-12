// Define las URL de comprobación y qué función del controlador las atiende.
import { Router } from 'express';
import { estado, baseDeDatos } from '../controller/health.controller.js';

const router = Router();

router.get('/', estado); // GET /api/health
router.get('/db', baseDeDatos); // GET /api/health/db

export default router;