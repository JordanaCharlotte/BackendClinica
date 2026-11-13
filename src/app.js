// Configura Express: CORS, lectura de JSON y rutas.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoute from './route/health.route.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGINS.split(',') })); // solo el frontend permitido
app.use(express.json()); // lee el cuerpo JSON de las solicitudes

app.use('/api/health', healthRoute);

// Si la ruta no existe: 404
app.use((req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

export default app;