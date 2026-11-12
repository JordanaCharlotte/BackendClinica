// Define las URL de comprobación y qué función del controlador las atiende
const { Router } = require('express');
const healthController = require('../controller/health.controller');

const router = Router();
router.get('/', healthController.estado);       // GET /api/health
router.get('/db', healthController.baseDeDatos); // GET /api/health/db

module.exports = router;