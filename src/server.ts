import express from "express";
import { envClient } from "./config/env.config.js";
import { HTTP_CONSTANTS } from "./constant/http.constant.js";
import PreResponseMiddleware from "./middlewares/pre-response.middleware.js";
import routes from "./routes/routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1", routes);

app.use(PreResponseMiddleware);

app.use((_req: express.Request, res: express.Response) => {
  res.status(HTTP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
    success: false,
    error: "Route not found",
  });
});

app.use((_err: Error, _req: express.Request, res: express.Response) => {
  res.status(HTTP_CONSTANTS.STATUS_CODES.INTERNAL_ERROR).json({
    success: false,
    error: "Internal server error",
  });
});

app.listen(envClient.port, () => {});
