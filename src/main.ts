import { Server } from "@lib/mod.ts";

const server = new Server({
  configuration: {
    app: {
      name: "My App",
      port: 8080,
    },
  },
});

if (import.meta.main) {
  server.bootstrap();
}
