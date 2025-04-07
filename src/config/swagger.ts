import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { components } from "@shared/swagger/index";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FIPE API Documentation",
      version: "1.0.0",
      description: "API documentation for custom FIPE application",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    components,
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/modules/**/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number | string) {
  // Swagger page
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/api/v1/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/api/v1/docs`);
}

export default swaggerDocs;
