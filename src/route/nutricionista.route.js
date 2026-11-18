import { Router } from 'express';
import {
  obtenerNutricionistas,
  obtenerNutricionista,
} from '../controller/nutricionista.controller.js';

const router = Router();

router.get('/', obtenerNutricionistas);
router.get('/:id', obtenerNutricionista);

export default router;
