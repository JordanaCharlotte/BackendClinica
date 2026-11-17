// Validaciones de formularios (registro, login, contacto, usuarios y perfil).
// Son funciones puras: reciben datos y devuelven un mensaje de error o null.
// Las funciones "validarX" de formularios completos devuelven un objeto
// { campo: 'mensaje' } que los componentes muestran bajo cada campo.

// ---------- RUN chileno ----------

// Quita puntos, guion y espacios: "12.345.678-5" -> "123456785".
export function limpiarRun(run = '') {
  return String(run).replace(/[.\-\s]/g, '').toUpperCase();
}

// Calcula el dígito verificador con el algoritmo módulo 11:
// multiplica cada número (de derecha a izquierda) por 2, 3, 4, 5, 6, 7 y vuelve a 2.
export function calcularDv(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

// Deja el RUN con puntos y guion para mostrarlo bonito.
export function formatearRun(run = '') {
  const limpio = limpiarRun(run);
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}

// Revisa que el RUN tenga el formato correcto y que el dígito verificador calce.
export function validarRun(run) {
  const limpio = limpiarRun(run);
  if (!limpio) return 'El RUN es obligatorio.';
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
    return 'Escribe el RUN con dígito verificador, por ejemplo 12.345.678-5.';
  }
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (calcularDv(cuerpo) !== dv) return 'El dígito verificador del RUN no es válido.';
  return null;
}

// ---------- Texto ----------

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' ]+$/;

// Sirve para nombre y apellidos: obligatorio, entre 2 y 50 letras.
export function validarNombre(valor, etiqueta = 'El nombre') {
  const texto = String(valor ?? '').trim();
  if (!texto) return `${etiqueta} es obligatorio.`;
  if (texto.length < 2) return `${etiqueta} debe tener al menos 2 letras.`;
  if (texto.length > 50) return `${etiqueta} no puede superar los 50 caracteres.`;
  if (!SOLO_LETRAS.test(texto)) return `${etiqueta} solo puede contener letras y espacios.`;
  return null;
}

// ---------- Correo ----------

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Errores de tipeo comunes en el dominio → sugerencia "¿Quisiste decir...?"
const DOMINIOS_CORREGIDOS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cl': 'gmail.com',
  'gamil.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'duocuc.c': 'duocuc.cl',
  'duoc.c': 'duoc.cl',
};

// Correo obligatorio, máximo 100 caracteres y con forma nombre@dominio.xx
export function validarCorreo(correo) {
  const texto = String(correo ?? '').trim();
  if (!texto) return 'El correo es obligatorio.';
  if (texto.length > 100) return 'El correo no puede superar los 100 caracteres.';
  if (!PATRON_CORREO.test(texto)) return 'Escribe un correo válido, por ejemplo nombre@correo.cl.';
  return null;
}

// Si el dominio está mal escrito (ej: gmial.com) devuelve el correo corregido.
export function sugerirCorreo(correo) {
  const texto = String(correo ?? '').trim().toLowerCase();
  const [usuario, dominio] = texto.split('@');
  if (!usuario || !dominio) return null;
  const corregido = DOMINIOS_CORREGIDOS[dominio];
  return corregido ? `${usuario}@${corregido}` : null;
}

// ---------- Contraseña ----------

// Entre 6 y 20 caracteres y debe tener letras y números.
export function validarPassword(password) {
  const texto = String(password ?? '');
  if (!texto) return 'La contraseña es obligatoria.';
  if (texto.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  if (texto.length > 20) return 'La contraseña no puede superar los 20 caracteres.';
  if (!/[A-Za-z]/.test(texto) || !/\d/.test(texto)) {
    return 'La contraseña debe combinar letras y números.';
  }
  return null;
}

// Da un puntaje según largo, mayúsculas, números y símbolos para mostrar si es débil, media o fuerte.
export function fuerzaPassword(password = '') {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) puntos++;
  if (/\d/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;
  if (puntos <= 1) return 'débil';
  if (puntos <= 2) return 'media';
  return 'fuerte';
}

// La segunda contraseña tiene que ser igual a la primera.
export function validarConfirmacion(password, confirmacion) {
  if (!confirmacion) return 'Repite la contraseña.';
  if (password !== confirmacion) return 'Las contraseñas no coinciden.';
  return null;
}

// ---------- Teléfono (opcional) ----------

// Celular chileno: 9 + 8 dígitos, con o sin +56 adelante.
export function validarTelefono(telefono, obligatorio = false) {
  const limpio = String(telefono ?? '').replace(/\s/g, '');
  if (!limpio) return obligatorio ? 'El teléfono es obligatorio.' : null;
  if (!/^(\+?56)?9\d{8}$/.test(limpio)) {
    return 'Escribe un celular chileno de 9 dígitos, por ejemplo +56 9 1234 5678.';
  }
  return null;
}

// ---------- Mensaje de contacto ----------

export const MAX_MENSAJE = 500;

export function validarMensaje(mensaje) {
  const texto = String(mensaje ?? '').trim();
  if (!texto) return 'Escribe tu mensaje.';
  if (texto.length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
  if (texto.length > MAX_MENSAJE) return `El mensaje no puede superar los ${MAX_MENSAJE} caracteres.`;
  return null;
}

// ---------- Formularios completos ----------

// Deja solo los campos que tienen error (saca los null).
function limpiarNulos(errores) {
  return Object.fromEntries(Object.entries(errores).filter(([, v]) => v));
}

// true si el objeto de errores tiene al menos un campo.
export function hayErrores(errores) {
  return Object.keys(errores || {}).length > 0;
}

// En el login solo se revisa que el correo sea válido y que la contraseña no esté vacía.
export function validarLogin({ correo, password } = {}) {
  return limpiarNulos({
    correo: validarCorreo(correo),
    password: String(password ?? '') ? null : 'La contraseña es obligatoria.',
  });
}

// Valida todos los campos del formulario de registro de una vez.
export function validarRegistro(datos = {}) {
  return limpiarNulos({
    run: validarRun(datos.run),
    nombre: validarNombre(datos.nombre),
    apellidos: validarNombre(datos.apellidos, 'Los apellidos'),
    correo: validarCorreo(datos.correo),
    telefono: validarTelefono(datos.telefono),
    password: validarPassword(datos.password),
    confirmarPassword: validarConfirmacion(datos.password, datos.confirmarPassword),
    aceptaTerminos: datos.aceptaTerminos ? null : 'Debes aceptar los términos para registrarte.',
  });
}

export const ASUNTOS_CONTACTO = ['Consulta general', 'Agendamiento', 'Planes y precios', 'Reclamo o sugerencia'];

// Valida el formulario de contacto (el asunto tiene que ser uno de la lista).
export function validarContacto(datos = {}) {
  return limpiarNulos({
    nombre: validarNombre(datos.nombre),
    correo: validarCorreo(datos.correo),
    asunto: ASUNTOS_CONTACTO.includes(datos.asunto) ? null : 'Elige un asunto.',
    mensaje: validarMensaje(datos.mensaje),
  });
}

// Formulario de usuario del admin. En edición la contraseña es opcional
// (si se deja vacía, se mantiene la actual).
export function validarUsuario(datos = {}, { esEdicion = false } = {}) {
  const passwordVacia = !datos.password;
  return limpiarNulos({
    run: validarRun(datos.run),
    nombre: validarNombre(datos.nombre),
    apellidos: validarNombre(datos.apellidos, 'Los apellidos'),
    correo: validarCorreo(datos.correo),
    telefono: validarTelefono(datos.telefono),
    rol: ['admin', 'cliente'].includes(datos.rol) ? null : 'Elige un rol.',
    password: esEdicion && passwordVacia ? null : validarPassword(datos.password),
  });
}

// Perfil: la persona edita sus datos; RUN y correo no se cambian aquí.
export function validarPerfil(datos = {}) {
  const cambiaPassword = Boolean(datos.password);
  return limpiarNulos({
    nombre: validarNombre(datos.nombre),
    apellidos: validarNombre(datos.apellidos, 'Los apellidos'),
    telefono: validarTelefono(datos.telefono),
    password: cambiaPassword ? validarPassword(datos.password) : null,
    confirmarPassword: cambiaPassword
      ? validarConfirmacion(datos.password, datos.confirmarPassword)
      : null,
  });
}
