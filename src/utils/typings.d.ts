export type Environment = "production" | "development";

export type LogLevel =
  | "NOTSET"
  | "DEBUG"
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";

export type Configuration = {
  app: {
    name: string;
    port: number;
  };
  environment: Environment;
  logLevel: LogLevel;
};
