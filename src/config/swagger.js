const swaggerDocument = {
  openapi: '3.0.3',

  info: {
    title: 'API Clínica NutriVida',
    version: '1.0.0',
    description: 'API para servicios, nutricionistas, usuarios y citas.',
  },

  servers: [
    {
      url: 'http://35.153.200.228:3000',
      description: 'Backend en EC2',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },

    schemas: {
      Servicio: {
        type: 'object',
        properties: {
          id:
            { type: 'integer', example: 1 },
          codigo:
            { type: 'string', example: 'CN001' },
          categoria:
            { type: 'string', example: 'Consulta' },
          nombre:
            { type: 'string', example: 'Primera consulta nutricional' },
          duracion:
            { type: 'string', example: '50 min' },
          modalidad:
            { type: 'string', example: 'Presencial' },
          profesional:
            { type: 'string', example: 'Nutricionista' },
          precio:
            { type: 'integer', example: 35000 },
          precio_anterior:
            { type: 'integer', nullable: true, example: null },
          oferta:
            { type: 'boolean', example: false },
          disponibilidad:
            { type: 'boolean', example: true },
          cupos:
            { type: 'integer', example: 10 },
          descripcion:
            { type: 'string', example: 'Evaluación nutricional completa.' },
        },
      },

      ServicioEntrada: {
        type: 'object',
        required: [
          'codigo',
          'categoria',
          'nombre',
          'precio',
        ],
        properties: {
          codigo:
            { type: 'string', example: 'PRUEBA-SWAGGER' },
          categoria:
            { type: 'string', example: 'Consulta' },
          nombre:
            { type: 'string', example: 'Servicio creado desde Swagger' },
          duracion:
            { type: 'string', example: '30 min' },
          modalidad:
            { type: 'string', example: 'Presencial' },
          profesional:
            { type: 'string', example: 'Nutricionista' },
          precio:
            { type: 'integer', example: 15000 },
          precioAnterior:
            { type: 'integer', nullable: true, example: null },
          oferta:
            { type: 'boolean', example: false },
          disponibilidad:
            { type: 'boolean', example: true },
          cupos:
            { type: 'integer', example: 5 },
          descripcion:
            { type: 'string', example: 'Servicio temporal de prueba.' },
        },
      },

      Nutricionista: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'NUT001',
          },
          nombre: {
            type: 'string',
            example: 'María González',
          },
          especialidad: {
            type: 'string',
            example: 'Nutrición clínica',
          },
          dias: {
            type: 'string',
            example: 'Lunes, miércoles y viernes',
          },
          horario: {
            type: 'string',
            example: '09:00 - 17:00',
          },
        },
      },

      NutricionistaEntrada: {
        type: 'object',
        required: ['id', 'nombre'],
        properties: {
          id: {
            type: 'string',
            example: 'NUT999',
          },
          nombre: {
            type: 'string',
            example: 'Nutricionista temporal',
          },
          especialidad: {
            type: 'string',
            example: 'Nutrición deportiva',
          },
          dias: {
            type: 'string',
            example: 'Martes y jueves',
          },
          horario: {
            type: 'string',
            example: '10:00 - 14:00',
          },
        },
      },

      Error: {
        type: 'object',
        properties: {
          error:
            { type: 'string', example: 'No tienes permiso para esta acción.' },
        },
      },
    },
  },

  paths: {
    '/api/servicios': {
      get: {
        summary: 'Listar todos los servicios',
        tags: ['Servicios'],
        responses: {
          200: {
            description: 'Lista de servicios',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Servicio' },
                },
              },
            },
          },
        },
      },

      post: {
        summary: 'Crear un servicio',
        tags: ['Servicios'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ServicioEntrada' },
            },
          },
        },
        responses: {
          201: {
            description: 'Servicio creado correctamente',
          },
          400: {
            description: 'Datos inválidos',
          },
          401: {
            description: 'No autenticado',
          },
          403: {
            description: 'El usuario no es administrador',
          },
          409: {
            description: 'Código de servicio duplicado',
          },
        },
      },
    },

    '/api/servicios/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del servicio',
          schema: { type: 'integer', example: 1 },
        },
      ],

      get: {
        summary: 'Obtener un servicio por ID',
        tags: ['Servicios'],
        responses: {
          200: {
            description: 'Servicio encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Servicio' },
              },
            },
          },
          400: {
            description: 'ID inválido',
          },
          404: {
            description: 'Servicio no encontrado',
          },
        },
      },

      put: {
        summary: 'Actualizar un servicio',
        tags: ['Servicios'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ServicioEntrada' },
            },
          },
        },
        responses: {
          200: {
            description: 'Servicio actualizado correctamente',
          },
          400: {
            description: 'Datos inválidos',
          },
          401: {
            description: 'No autenticado',
          },
          403: {
            description: 'El usuario no es administrador',
          },
          404: {
            description: 'Servicio no encontrado',
          },
        },
      },

      delete: {
        summary: 'Eliminar un servicio',
        tags: ['Servicios'],
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: 'Servicio eliminado correctamente',
          },
          401: {
            description: 'No autenticado',
          },
          403: {
            description: 'El usuario no es administrador',
          },
          404: {
            description: 'Servicio no encontrado',
          },
          409: {
            description: 'El servicio tiene citas asociadas',
          },
        },
      },
    },

    '/api/nutricionistas': {
      get: {
        summary: 'Listar todos los nutricionistas',
        tags: ['Nutricionistas'],
        responses: {
          200: {
            description: 'Lista de nutricionistas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Nutricionista',
                  },
                },
              },
            },
          },
        },
      },

      post: {
        summary: 'Crear un nutricionista',
        tags: ['Nutricionistas'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NutricionistaEntrada',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Nutricionista creado correctamente',
          },
          400: {
            description: 'Datos inválidos',
          },
          401: {
            description: 'No autenticado',
          },
          403: {
            description: 'El usuario no es administrador',
          },
          409: {
            description: 'El identificador ya existe',
          },
        },
      },
    },

    '/api/nutricionistas/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Identificador del nutricionista',
          schema: {
            type: 'string',
            example: 'NUT001',
          },
        },
      ],

      get: {
        summary: 'Obtener un nutricionista por ID',
        tags: ['Nutricionistas'],
        responses: {
          200: {
            description: 'Nutricionista encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Nutricionista',
                },
              },
            },
          },
          400: {
            description: 'ID inválido',
          },
          404: {
            description: 'Nutricionista no encontrado',
          },
        },
      },

      put: {
        summary: 'Actualizar un nutricionista',
        tags: ['Nutricionistas'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NutricionistaEntrada',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Nutricionista actualizado correctamente',
          },
          400: {
            description: 'Datos inválidos',
          },
          401: {
            description: 'No autenticado',
          },
          403: {
            description: 'El usuario no es administrador',
          },
          404: {
            description: 'Nutricionista no encontrado',
          },
        },
      },

      delete: {
        summary: 'Eliminar un nutricionista',
        tags: ['Nutricionistas'],
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: 'Nutricionista eliminado correctamente',
          },
          401: {
            description: 'No autenticado',
          },
          403: {
            description: 'El usuario no es administrador',
          },
          404: {
            description: 'Nutricionista no encontrado',
          },
          409: {
            description: 'El nutricionista tiene citas asociadas',
          },
        },
      },
    },
  
      '/api/citas': {
      get: {
        summary: 'Listar citas',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Citas obtenidas correctamente',
          },
          401: {
            description: 'Token faltante o inválido',
          },
        },
      },

      post: {
        summary: 'Crear una cita',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'servicioId',
                  'nutricionistaId',
                  'fecha',
                  'hora',
                ],
                properties: {
                  servicioId: {
                    type: 'integer',
                    example: 5,
                  },
                  nutricionistaId: {
                    type: 'string',
                    example: 'NUT003',
                  },
                  fecha: {
                    type: 'string',
                    format: 'date',
                    example: '2026-12-25',
                  },
                  hora: {
                    type: 'string',
                    example: '09:00',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Cita creada correctamente',
          },
          400: {
            description: 'Datos inválidos',
          },
          401: {
            description: 'Token faltante o inválido',
          },
          404: {
            description: 'Servicio o nutricionista no encontrado',
          },
          409: {
            description: 'El horario ya está ocupado',
          },
        },
      },
    },

    '/api/citas/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID de la cita',
          schema: {
            type: 'integer',
            example: 7,
          },
        },
      ],

      get: {
        summary: 'Obtener una cita por ID',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Cita obtenida correctamente',
          },
          400: {
            description: 'ID inválido',
          },
          401: {
            description: 'Token faltante o inválido',
          },
          404: {
            description: 'Cita no encontrada',
          },
        },
      },

      delete: {
        summary: 'Cancelar una cita',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Cita cancelada correctamente',
          },
          400: {
            description: 'ID inválido',
          },
          401: {
            description: 'Token faltante o inválido',
          },
          403: {
            description: 'No tienes permisos para cancelar la cita',
          },
          404: {
            description: 'Cita no encontrada',
          },
        },
      },
    },

    '/api/citas/{id}/reprogramar': {
      patch: {
        summary: 'Reprogramar una cita',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID de la cita',
            schema: {
              type: 'integer',
              example: 7,
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fecha', 'hora'],
                properties: {
                  fecha: {
                    type: 'string',
                    format: 'date',
                    example: '2026-12-26',
                  },
                  hora: {
                    type: 'string',
                    example: '10:00',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cita reprogramada correctamente',
          },
          400: {
            description: 'Datos inválidos',
          },
          401: {
            description: 'Token faltante o inválido',
          },
          403: {
            description: 'No tienes permisos para reprogramar la cita',
          },
          404: {
            description: 'Cita no encontrada',
          },
          409: {
            description: 'El horario ya está ocupado',
          },
        },
      },
    },},
};

export default swaggerDocument;
