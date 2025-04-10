import { vehicleSchemas } from "@modules/vehicles/swagger/schemas";
import { ErrorExamples, ErrorResponseSchema } from "./errors";
import { userSchemas } from "@modules/users/swagger/schemas";

import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { fuelTypeSchemas } from "@modules/fuelTypes/swagger/schemas";

export const schemas = validationMetadatasToSchemas({
  refPointerPrefix: "#/components/schemas/",
});


export const components = {
  schemas: {
    ...userSchemas,
    ...fuelTypeSchemas,
    ...vehicleSchemas,
    ...schemas,
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
