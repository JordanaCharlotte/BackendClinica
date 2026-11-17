// Revisa el token JWT que llega en "Authorization: Bearer <token>".
import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
  const [tipo, token] = String(req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: Number(datos.sub), rol: datos.rol };
    next();
  } catch {
    res.status(401).json({ error: 'Tu sesión expiró. Vuelve a iniciar sesión.' });
  }
}


// Solo deja pasar a los roles indicados. Ejemplo: permitirRoles('admin')
export function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario?.rol)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción.' });
    }
    next();
  };
}
