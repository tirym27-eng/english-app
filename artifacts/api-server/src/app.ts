import express, { type Express } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Production: serve the Vite-built English app from the same origin as the API.
// This keeps cookies/local state and /api requests on one public origin.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "../../english-premium/dist/public");
const webIndex = path.join(webRoot, "index.html");

if (fs.existsSync(webIndex)) {
  app.use(express.static(webRoot, { index: "index.html" }));
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    return res.sendFile(webIndex);
  });
}

export default app;
