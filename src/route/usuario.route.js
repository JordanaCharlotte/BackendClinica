// URL de administración de usuarios: /api/usuarios/... (solo administradores)
import { Router } from 'express';
import { listar, actualizar, eliminar } from '../controller/usuario.controller.js';
import { verificarToken, permitirRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verificarToken, permitirRoles('admin'), listar); // GET /api/usuarios
router.put('/:id', verificarToken, permitirRoles('admin'), actualizar); // PUT /api/usuarios/:id
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminar); // DELETE /api/usuarios/:id

export default router;
