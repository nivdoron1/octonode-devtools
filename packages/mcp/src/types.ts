export type JsonSchema = Record<string, unknown>;
export type Method = "GET" | "POST" | "PUT";
export type ToolArguments = Record<string, unknown>;
export type McpEnv = Env & { OCTONODE_API_URL?: string };

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  method: Method;
  path: string;
  query?: string[];
  body?: string[];
  risk: "read" | "write";
  destructive?: boolean;
  stream?: boolean;
  projectScoped?: boolean;
}
