export const fuelTypeSchemas = {
  FuelTypeResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      abbreviation: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "name", "abbreviation", "createdAt", "updatedAt"],
  },
};
