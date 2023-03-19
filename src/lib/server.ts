import { Application } from "@oak";
import { log, setupLogger } from "@utils/mod.ts";
import { IServer, IServerDependencies } from "@lib/typings.d.ts";

export class Server implements IServer {
  private app: Application;
  private abortController: AbortController;

  private name: string;
  private port: number;

  private id: string; // temp
  private isClosing = false; // temp

  constructor({
    configuration: {
      app: {
        name,
        port,
      },
      logLevel,
    },
  }: IServerDependencies) {
    this.app = new Application();
    this.abortController = new AbortController();
    this.name = name;
    this.port = port;

    this.id = Math.random().toString(36).substring(2, 15); // Generate a unique ID

    setupLogger(logLevel);
  }

  public bootstrap(): void {
    this.registerAppMiddleware();
    this.addEventListeners();
    this.serve();
  }

  public close(reason?: DOMException): void {
    if (this.isClosing) {
      console.log(`[${this.id}]: Already closing, skipping...`);
      return;
    }

    this.isClosing = true;
    this.abortController.abort();

    if (reason) {
      log.warning(
        `🔌 [${this.id}] ${this.name} is shutting down: ${reason.message} (${reason.name})...`,
      );
    } else {
      log.warning(`🔌 ${this.name} is shutting down...`);
    }
  }

  private registerAppMiddleware(): void {
    this.app.use(async (ctx, next) => {
      await next();
      ctx.response.body = "Hello world!";
    });
    log.info("Registering application middleware...");
  }

  protected addEventListeners(): void {
    this.addRequestListener();
    this.addErrorListener();
    this.addUnloadListener();
    log.info("Adding event listeners...");
  }

  protected addRequestListener(): void {
    this.app.addEventListener("listen", ({ secure, hostname, port }) => {
      const protocol = secure ? "https://" : "http://";
      const url = `${protocol}${hostname ?? "localhost"}:${port}`;
      log.info(`🚀 ${this.name} is now running on: ${url}`);
    });
  }

  protected addErrorListener(): void {
    this.app.addEventListener("error", ({ error }) => {
      log.error(`💥 Uh oh! An error occurred: ${error.message}`);
    });
  }

  protected addUnloadListener(): void {
    // Listen for the unload event and gracefully close the server
    globalThis.addEventListener("unload", () => {
      const reason = new DOMException(
        "Server shutting down gracefully",
        "OperationError",
      );
      console.log(`[addUnloadListener()]: ${this.id} Handling unload event`);
      this.close(reason);
    });
    console.log(`[addUnloadListener()]: ${this.id} Registered unload event listener`);
  }

  private async serve(): Promise<void> {
    const { signal } = this.abortController;

    await this.app.listen({
      port: this.port,
      signal,
    });
  }
}
