export const vehicleSchemas = {
  CreateVehicleDTO: {
    type: "object",
    properties: {
      fipeCode: {
        type: "string",
        description: "Código FIPE do veículo",
        example: "038003-2",
        nullable: true,
      },
      value: {
        type: "number",
        description: "Valor do veículo em moeda",
        example: 45000,
        minimum: 0,
      },
      referenceMonth: {
        type: "number",
        description: "Mês de referência (1-12)",
        example: 6,
        minimum: 1,
        maximum: 12,
        nullable: true,
      },
      referenceYear: {
        type: "number",
        description: "Ano de referência (1900-Ano atual)",
        example: 2023,
        minimum: 1900,
        maximum: new Date().getFullYear(),
        nullable: true,
      },
      vehicleYear: {
        type: "number",
        description: "Ano de fabricação do veículo",
        example: 2022,
        minimum: 1900,
        maximum: new Date().getFullYear(),
      },
      modelId: {
        type: "string",
        format: "uuid",
        description: "UUID do modelo do veículo",
        example: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      },
      fuelTypeId: {
        type: "string",
        format: "uuid",
        description: "UUID do tipo de combustível",
        example: "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
      },
    },
    required: ["value", "vehicleYear", "modelId", "fuelTypeId"],
  },
  VehicleResponseDTO: {
    allOf: [
      { $ref: "#/components/schemas/CreateVehicleDTO" },
      {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "UUID do veículo",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data e hora de criação do registro",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data e hora da última atualização do registro",
          },
          createdById: {
            type: "string",
            format: "uuid",
            nullable: true,
            description: "UUID do usuário que criou o registro",
          },
          updatedById: {
            type: "string",
            format: "uuid",
            nullable: true,
            description:
              "UUID do usuário que atualizou o registro pela última vez",
          },
        },
      },
    ],
  },
};
