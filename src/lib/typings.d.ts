import { Configuration } from "@utils/mod.ts";

export interface IServer {
  bootstrap(): void;
  close(reason?: DOMException): void;
}

export interface IServerDependencies {
  configuration: Configuration;
}
