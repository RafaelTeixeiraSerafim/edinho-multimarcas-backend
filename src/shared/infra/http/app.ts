import express from "express";
import "@shared/container"
import { routes } from "@shared/infra/http/routes";

const app = express();

app.use(express.json());

app.use(routes);

export { app };
