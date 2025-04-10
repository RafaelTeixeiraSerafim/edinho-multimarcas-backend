export const userSchemas = {
  UserResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      birthdate: { type: "string", format: "date-time", nullable: true },
      contact: { type: "string", nullable: true },
      nationalId: { type: "string", nullable: true },
      email: { type: "string", format: "email" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      createdById: { type: "string", format: "uuid", nullable: true },
      updatedById: { type: "string", format: "uuid", nullable: true },
    },
    required: [
      "id",
      "name",
      "email",
      "createdAt",
      "updatedAt",
      "createdById",
      "updatedById",
      "birthdate",
      "contact",
      "nationalId",
    ],
  },
  AuthenticateUserResponseDTO: {
    type: "object",
    properties: {
      accessToken: {
        type: "string",
      },
      refreshToken: {
        type: "string",
      },
      tokenExpiry: {
        type: "number",
      },
      user: {
        $ref: "#/components/schemas/UserResponseDTO",
      },
    },
    required: ["accessToken", "refreshToken", "tokenExpiry", "user"],
  },
};
