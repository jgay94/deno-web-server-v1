import { Application } from "@oak";

import { 
  IServer, 
  IServerDependencies 
} from "@lib/typings.d.ts";

export class Server implements IServer {
  private app: Application;

  private name: string;
  private port: number;

  constructor({
    configuration: {
      app: {
        name,
        port,
      },
    },
  }: IServerDependencies) {
    this.app = new Application();
    this.name = name;
    this.port = port;
  }

  public bootstrap(): void {
    this.registerAppMiddleware();
    this.addEventListeners();
    this.serve();
  }

  private registerAppMiddleware(): void {
    this.app.use(async (ctx, next) => {
      await next();
      ctx.response.body = "Hello world!";
    });
    console.info("Registering app middleware...")
  }

  private addEventListeners(): void {
    // Add the 'listen' event listener
    this.app.addEventListener("listen", ({ secure, hostname, port }) => {
      const protocol = secure ? "https://" : "http://";
      const url = `${protocol}${hostname ?? "localhost"}:${port}`;
      console.info(`🚀 ${this.name} is now running on: ${url}`);
    });
  
    // Add the 'error' event listener
    this.app.addEventListener("error", ({ error }) => {
      console.error(`💥 Uh oh! An error occurred: ${error.message}`);
    });
  
    console.info("Adding event listeners...");
  }  

  private async serve(): Promise<void> {
    await this.app.listen({
      port: this.port,
    });
  }
}
