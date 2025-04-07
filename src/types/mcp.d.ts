/**
 * Définitions de types pour le SDK MCP
 */

declare module '@modelcontextprotocol/sdk/server/mcp.js' {
  export interface ResourceConfig {
    name: string;
    uriTemplate: string;
    handler: (uri: URL, variables: Record<string, unknown>) => Promise<any>;
  }

  export class McpServer {
    constructor(options: { name: string; version: string; description: string });
    
    // Méthode pour enregistrer une ressource avec la nouvelle syntaxe d'objet
    resource(config: ResourceConfig): void;
    
    // Méthode pour enregistrer un outil
    tool(name: string, schema: any, handler: (params: any) => Promise<any>): void;
    
    // Autres méthodes du serveur MCP
    listen(transport: any): Promise<void>;
    close(): Promise<void>;
  }
}
