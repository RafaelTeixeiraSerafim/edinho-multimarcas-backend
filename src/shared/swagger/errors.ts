export const ErrorExamples = {
  Unauthorized: {
    summary: "Unauthorized",
    value: {
      success: false,
      error: {
        name: "UnauthorizedError",
        message: "Token de acesso ausente",
        statusCode: 401,
      },
    },
  },
  BadRequest: {
    summary: "Bad request",
    value: {
      success: false,
      error: {
        name: "BadRequestError",
        message: "Campo 'value' é obrigatório",
        statusCode: 400,
      },
    },
  },
  NotFound: {
    summary: "Not found",
    value: {
      success: false,
      error: {
        name: "NotFoundError",
        message: "Veículo não encontrado",
        statusCode: 404,
      },
    },
  },
  InternalServer: {
    summary: "Internal server error",
    value: {
      success: false,
      error: {
        name: "InternalServerError",
        message: "Algo deu errado",
        statusCode: 500,
      },
    },
  },
  Forbidden: {
    summary: "Forbidden",
    value: {
      success: false,
      error: {
        name: "ForbiddenError",
        message: "Acesso negado",
        statusCode: 403,
      },
    },
  },
  Conflict: {
    summary: "Conflict",
    value: {
      success: false,
      error: {
        name: "ConflictError",
        message: "Um veículo com esses dados já existe",
        statusCode: 409,
      },
    },
  },
};

export const ErrorResponseSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: false,
    },
    error: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        message: {
          type: "string",
        },
        statusCode: {
          type: "integer",
        },
      },
    },
  },
};
