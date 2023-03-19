import { Application } from "@oak";
import { log, setupLogger } from "@utils/mod.ts";
import { IServer, IServerDependencies } from "@lib/typings.d.ts";

export class Server implements IServer {
  private app: Application;
  private abortController: AbortController;

  private name: string;
  private port: number;

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

    setupLogger(logLevel);
  }

  public bootstrap(): void {
    this.registerAppMiddleware();
    this.addEventListeners();
    this.serve();
  }

  public close(reason?: DOMException): void {
    this.abortController.abort();
    if (reason) {
      log.warning(
        `🔌 ${this.name} is shutting down: ${reason.message} (${reason.name})...`,
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
      this.close(reason);
    });
  }

  private async serve(): Promise<void> {
    const { signal } = this.abortController;

    await this.app.listen({
      port: this.port,
      signal,
    });
  }
}
