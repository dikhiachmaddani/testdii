import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "../../config/env.config.js";
import { envClient } from "../../config/env.config.js";
import { logger } from "../logger.utils.js";
import { PrismaClient } from "./generated/prisma/client.js";

const { Pool } = pg;

const pool = new Pool({ connectionString: envClient.databaseUrl });

export const prismaClient = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

prismaClient.$on("error", (e) => {
  logger.error(e);
});

prismaClient.$on("warn", (e) => {
  logger.warn(e);
});

prismaClient.$on("info", (e) => {
  logger.info(e);
});

prismaClient.$on("query", (e) => {
  logger.info(e);
});
