// Configura Express: seguridad, CORS, JSON y rutas
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const healthRoute = require('./route/health.route');

const app = express();

app.use(helmet());                                                // cabeceras de seguridad
app.use(cors({ origin: process.env.CORS_ORIGINS.split(',') }));  // solo el frontend permitido
app.use(express.json());                                          // lee el cuerpo JSON de las solicitudes

app.use('/api/health', healthRoute);

// Si la ruta no existe: 404
app.use((req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

module.exports = app;