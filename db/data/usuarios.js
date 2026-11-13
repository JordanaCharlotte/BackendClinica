// Usuarios iniciales de la clínica.
// authService los copia a localStorage la primera vez que se usa la app;
// desde ahí en adelante los cambios (registro, edición) quedan en localStorage.
// rol: 'admin' | 'cliente'

export const ROLES = ['admin', 'cliente'];

const usuariosIniciales = [
  {
    id: 1,
    run: '11.111.111-1',
    nombre: 'Admin',
    apellidos: 'Clínica',
    correo: 'admin@clinica.cl',
    password: 'Admin123',
    telefono: '+56911111111',
    rol: 'admin',
  },
  {
    id: 2,
    run: '12.345.678-5',
    nombre: 'Camila',
    apellidos: 'Rojas Pérez',
    correo: 'camila@correo.cl',
    password: 'Cliente123',
    telefono: '+56922222222',
    rol: 'cliente',
  },
  {
    id: 3,
    run: '15.678.901-1',
    nombre: 'Matías',
    apellidos: 'González Soto',
    correo: 'matias@correo.cl',
    password: 'Cliente123',
    telefono: '',
    rol: 'cliente',
  },
];

export default usuariosIniciales;
