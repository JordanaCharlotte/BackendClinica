// URL de autenticación: /api/auth/...
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { registro, login, usuarioActual } from '../controller/auth.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

// Máximo 10 intentos FALLIDOS cada 15 minutos por IP (frena ataques de fuerza bruta).
// Los intentos correctos no cuentan, así el uso normal no se bloquea.
const limiteIntentos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Demasiados intentos fallidos. Espera 15 minutos y vuelve a intentar.' },
});

router.post('/register', limiteIntentos, registro); // POST /api/auth/register
router.post('/login', limiteIntentos, login); // POST /api/auth/login
router.get('/me', verificarToken, usuarioActual); // GET /api/auth/me (con token)

export default router;
