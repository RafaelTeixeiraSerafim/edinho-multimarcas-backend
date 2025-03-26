import "reflect-metadata";
import { createServer } from "http";
import { app } from "@shared/infra/http/app";

const httpServer = createServer(app);

const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}!`);
});
