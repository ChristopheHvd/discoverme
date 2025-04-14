/**
 * Définitions de types pour le SDK MCP
 */

declare module '@modelcontextprotocol/sdk/server/mcp.js' {

  export class McpServer {
    constructor(options: { name: string; version: string; description: string });
    
    // Méthode pour enregistrer une ressource avec la nouvelle syntaxe d'objet
    resource(name: string, uri: any, handler: (uri: any, params: any) => Promise<any>): void;
    
    // Méthode pour enregistrer un outil
    tool(name: string, schema: any, handler: (params: any) => Promise<any>): void;
    
    // Autres méthodes du serveur MCP
    connect(transport: any): Promise<void>;
    close(): Promise<void>;
  }
  // Dans un nouveau fichier, par exemple src/utils/ResourceTemplate.ts
  export class ResourceTemplate {
    uri: string;
    list: Record<string, any>;

    constructor(uri: string, list: Record<string, any>);
    // Autres méthodes utiles
  }

}
