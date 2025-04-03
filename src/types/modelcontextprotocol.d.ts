declare module '@modelcontextprotocol/sdk' {
  export class Server {
    constructor(options: {
      name: string;
      version: string;
      description: string;
    });
    addTool(tool: Tool): void;
    listen(transport: any): void;
  }

  export class StdioTransport {
    constructor();
  }

  export class Tool {
    constructor(options: {
      name: string;
      description: string;
      parameters: Record<string, {
        type: string;
        description: string;
        enum?: string[];
      }>;
      handler: (params: any) => Promise<any>;
    });
  }
}
