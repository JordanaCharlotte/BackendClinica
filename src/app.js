// Configura Express: CORS, lectura de JSON y rutas.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoute from './route/health.route.js';
import authRoute from './route/auth.route.js';
import usuarioRoute from './route/usuario.route.js';
import citaRoute from './route/cita.route.js';
import servicioRoute from './route/servicio.route.js';
import nutricionistaRoute from './route/nutricionista.route.js';
import fs from 'fs';
import * as yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGINS.split(',') })); // solo el frontend permitido
app.use(express.json()); // lee el cuerpo JSON de las solicitudes

app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/usuarios', usuarioRoute);
app.use('/api/citas', citaRoute);
app.use('/api/servicios', servicioRoute);
app.use('/api/nutricionistas', nutricionistaRoute);

// Documentación de la API con Swagger: http://localhost:3000/api-docs
const documentoApi = yaml.load(fs.readFileSync(new URL('../docs/openapi.yaml', import.meta.url), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentoApi));


// Si la ruta no existe: 404
app.use((req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

// Errores inesperados: responde en JSON sin mostrar detalles internos del servidor.
// Express sabe que es un manejador de errores porque recibe 4 parámetros.
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido.' });
  }
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

export default app;
