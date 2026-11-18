# BackendClinica

Enlace para Frontend del proyecto: https://github.com/JordanaCharlotte/Clinica.git

## Autenticación

| Método | Ruta | ¿Necesita token? | Qué hace |
|---|---|---|---|
| POST | `/api/auth/register` | No | Crea una cuenta. Siempre queda con rol `cliente` |
| POST | `/api/auth/login` | No | Revisa correo y contraseña y entrega un token |
| GET | `/api/auth/me` | Sí | Devuelve los datos de quien inició sesión |

El token se envía en cada ruta protegida con el encabezado:
`Authorization: Bearer <token>`

Las contraseñas se guardan cifradas con **bcrypt**. El token dura **15 minutos** y solo lleva el id y el rol del usuario.

### Errores 401 y 403

| Código | Significado | Cuándo aparece | Respuesta |
|---|---|---|---|
| **401** | No sé quién eres | No se envió token, el token venció o fue modificado | `{ "error": "Debes iniciar sesión." }` o `{ "error": "Tu sesión expiró. Vuelve a iniciar sesión." }` |
| **401** | Datos de acceso incorrectos | Login con correo o contraseña incorrectos | `{ "ok": false, "error": "Correo o contraseña incorrectos." }` |
| **403** | Sé quién eres, pero no tienes permiso | Un cliente intenta una acción de administrador | `{ "error": "No tienes permiso para esta acción." }` |

Para proteger una ruta solo para administradores:

```js
router.delete('/:id', verificarToken, permitirRoles('admin'), cancelar);
```

Otros errores: **400** datos inválidos · **409** el correo o el RUN ya existen.

### Diagrama de secuencia del login

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend React (Login.jsx)
    participant R as Ruta y Controlador
    participant S as auth.service
    participant DB as PostgreSQL (RDS)

    U->>F: Escribe correo y contraseña
    F->>R: POST /api/auth/login
    R->>R: validarLogin()
    alt Datos inválidos
        R-->>F: 400 { errores }
    end
    R->>S: iniciarSesion(correo, password)
    S->>DB: SELECT usuario por correo
    DB-->>S: usuario con password_hash
    S->>S: bcrypt.compare(password, hash)
    alt Correo o contraseña incorrectos
        S-->>R: { ok: false }
        R-->>F: 401 Correo o contraseña incorrectos
    else Correctos
        S->>S: jwt.sign({ id, rol })
        S-->>R: { ok: true, usuario, token }
        R-->>F: 200 { usuario, token }
        F-->>U: Sesión iniciada
    end

    Note over F,R: En las siguientes peticiones
    F->>R: GET /api/auth/me + Authorization: Bearer token
    R->>R: verificarToken (jwt.verify)
    alt Token inválido o vencido
        R-->>F: 401
    else Token válido
        R->>DB: SELECT usuario por id
        DB-->>R: datos sin contraseña
        R-->>F: 200 { usuario }
    end
```


## Citas

| Método | Ruta | ¿Necesita token? | ¿Quién puede usarla? | Qué hace |
|---|---|---|---|---|
| POST | `/api/citas` | Sí | Usuario autenticado | Crea una nueva cita para el usuario que inició sesión |
| GET | `/api/citas` | Sí | Usuario autenticado | Lista las citas propias; el administrador puede ver todas |
| GET | `/api/citas/:id` | Sí | Usuario autenticado | Obtiene una cita específica |
| PATCH | `/api/citas/:id/reprogramar` | Sí | Solo administrador | Cambia la fecha u hora de una cita |
| DELETE | `/api/citas/:id` | Sí | Solo administrador | Cambia el estado de la cita a cancelada |

El token se envía en cada solicitud protegida mediante el encabezado:

`Authorization: Bearer <token>`

Para crear una cita se debe enviar el servicio, el nutricionista, la fecha, la hora, el nombre, el correo y el precio. El usuario asociado no se recibe desde el frontend, sino que se obtiene desde el token JWT mediante `req.usuario.id`. De esta forma, la cita queda relacionada con el usuario autenticado.

El módulo valida que los campos obligatorios estén completos y que la fecha no sea anterior al día actual. Las citas se almacenan en la tabla `citas` de PostgreSQL. Al cancelar una cita no se elimina el registro de la base de datos, sino que su estado cambia a `cancelada`.

La funcionalidad se organiza en capas. `cita.route.js` define las rutas y aplica la autenticación y los permisos; `cita.controller.js` recibe las solicitudes y envía las respuestas; `cita.service.js` contiene las validaciones y reglas de negocio; y `cita.repository.js` ejecuta las consultas SQL sobre PostgreSQL.

El flujo del módulo es:

`Ruta → Middleware de autenticación → Controlador → Servicio → Repositorio → PostgreSQL`


