// Punto de entrada: enciende el servidor en el puerto del .env
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`BackendClinica escuchando en el puerto ${port}`);
});