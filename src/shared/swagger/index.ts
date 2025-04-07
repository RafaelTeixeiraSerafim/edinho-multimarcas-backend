import { vehicleSchemas } from "@modules/vehicles/swagger/schemas";
import { ErrorExamples, ErrorResponseSchema } from "./errors";
import { userSchemas } from "@modules/users/swagger/schemas";
// import { userSchemas } from "@modules/users/swagger/schemas";
// import { updateVehicleSchema } from "@modules/models/dtos/CreateModelDTO";

export const components = {
  schemas: {
    ...vehicleSchemas,
    ...userSchemas,
    // ...updateVehicleSchema,
    ErrorResponse: ErrorResponseSchema,
  },
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  examples: {
    ...ErrorExamples,
  },
};
