import { Server } from "@lib/mod.ts";
import { config } from "@utils/mod.ts";

import { triggerUnloadEvent } from "@lib/helpers.ts";

const server = new Server({
  configuration: {
    app: {
      name: config.app.name,
      port: config.app.port,
    },
    environment: config.environment,
    logLevel: config.logLevel,
  },
});

if (import.meta.main) {
  server.bootstrap();
  triggerUnloadEvent();
}
