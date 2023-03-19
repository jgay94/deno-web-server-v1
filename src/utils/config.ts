import { load } from "@std/dotenv/mod.ts";
import { Configuration, Environment, LogLevel } from "@utils/typings.d.ts";

const env = await load();

export const config: Configuration = {
  app: {
    name: env.APP_NAME || "My App",
    port: parseInt(env.APP_PORT, 10) || 8080,
  },
  environment: (env.ENVIRONMENT || "development") as Environment,
  logLevel: (env.LOG_LEVEL ||
    (env.ENVIRONMENT === "production" ? "INFO" : "DEBUG")) as LogLevel,
};
