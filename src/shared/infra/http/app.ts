import express from "express";
import "@shared/container"
import { routes } from "@shared/infra/http/routes";
import { errorManager } from "./middlewares/errorManager";

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorManager)

export { app };
