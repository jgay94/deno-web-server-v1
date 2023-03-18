export interface IServer {
  bootstrap(): void;
}

export interface IServerDependencies {
  configuration: {
    app: {
      name: string;
      port: number;
    };
  };
}