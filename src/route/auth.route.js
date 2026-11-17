// URL de autenticación: /api/auth/...
import { Router } from 'express';
import { registro, login, usuarioActual } from '../controller/auth.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registro); // POST /api/auth/register
router.post('/login', login); // POST /api/auth/login
router.get('/me', verificarToken, usuarioActual); // GET /api/auth/me (con token)

export default router;
