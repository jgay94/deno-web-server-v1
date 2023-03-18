import * as log from "@std/log/mod.ts";
import { LogLevel } from "@utils/typings.d.ts";

const DEFAULT_HANDLER = "console";

export async function setupLogger(logLevel: LogLevel): Promise<void> {
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(logLevel),
    },
    loggers: {
      default: {
        level: logLevel,
        handlers: [DEFAULT_HANDLER],
      },
    },
  });
}

export default log;
