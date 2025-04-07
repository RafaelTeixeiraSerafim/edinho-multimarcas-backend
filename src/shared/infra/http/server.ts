import "reflect-metadata";
import { createServer } from "http";
import { app } from "@shared/infra/http/app";
import swaggerDocs from "@config/swagger";

const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;

swaggerDocs(app, PORT);

httpServer.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}!`);
});
