import express from "express";
import cors from "cors";
import "@shared/container";
import { routes } from "@shared/infra/http/routes";
import { errorManager } from "./middlewares/errorManager";

const app = express();

app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(routes);

app.use(errorManager);

export { app };
