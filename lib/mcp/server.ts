// ============================================
// NicheGenius AI - MCP Server Framework
// Model Context Protocol server implementation
// ============================================

import { z, ZodType } from 'zod';

// ---- Types ----

export interface MCPToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  default?: unknown;
  schema?: ZodType;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: MCPToolParameter[];
  handler: (args: Record<string, unknown>) => Promise<MCPToolResult>;
}

export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'json' | 'error';
    data: unknown;
  }>;
  isError?: boolean;
  metadata?: Record<string, unknown>;
}

export interface MCPRequest {
  id: string | number;
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  id: string | number;
  jsonrpc: '2.0';
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface MCPServerConfig {
  name: string;
  version: string;
  description: string;
  port: number;
  tools: MCPTool[];
  onError?: (error: Error, request?: MCPRequest) => void;
  onLog?: (level: string, message: string, data?: unknown) => void;
}

export interface MCPServerInstance {
  name: string;
  port: number;
  tools: Map<string, MCPTool>;
  handleRequest: (request: MCPRequest) => Promise<MCPResponse>;
  getToolList: () => MCPToolDescription[];
  getServerInfo: () => MCPServerInfo;
}

export interface MCPToolDescription {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export interface MCPServerInfo {
  name: string;
  version: string;
  description: string;
  capabilities: {
    tools: boolean;
    resources: boolean;
    prompts: boolean;
  };
  toolCount: number;
}

// ---- MCP Error Codes ----

const MCP_ERRORS = {
  PARSE_ERROR: { code: -32700, message: 'Parse error' },
  INVALID_REQUEST: { code: -32600, message: 'Invalid request' },
  METHOD_NOT_FOUND: { code: -32601, message: 'Method not found' },
  INVALID_PARAMS: { code: -32602, message: 'Invalid params' },
  INTERNAL_ERROR: { code: -32603, message: 'Internal error' },
  TOOL_NOT_FOUND: { code: -32001, message: 'Tool not found' },
  TOOL_EXECUTION_ERROR: { code: -32002, message: 'Tool execution error' },
} as const;

// ---- Logging Helper ----

function createLogger(config: MCPServerConfig) {
  const log = config.onLog || ((level: string, message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    const prefix = `[MCP:${config.name}]`;
    if (data) {
      console.log(`${timestamp} ${prefix} [${level.toUpperCase()}] ${message}`, data);
    } else {
      console.log(`${timestamp} ${prefix} [${level.toUpperCase()}] ${message}`);
    }
  });
  return {
    info: (msg: string, data?: unknown) => log('info', msg, data),
    warn: (msg: string, data?: unknown) => log('warn', msg, data),
    error: (msg: string, data?: unknown) => log('error', msg, data),
    debug: (msg: string, data?: unknown) => log('debug', msg, data),
  };
}

// ---- Parameter Schema Builder ----

function buildInputSchema(parameters: MCPToolParameter[]): MCPToolDescription['inputSchema'] {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const param of parameters) {
    properties[param.name] = {
      type: param.type,
      description: param.description,
      ...(param.default !== undefined ? { default: param.default } : {}),
    };
    if (param.required) {
      required.push(param.name);
    }
  }

  return { type: 'object', properties, required };
}

// ---- Parameter Validation ----

function validateParameters(
  tool: MCPTool,
  args: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const param of tool.parameters) {
    const value = args[param.name];

    if (param.required && (value === undefined || value === null)) {
      errors.push(`Missing required parameter: ${param.name}`);
      continue;
    }

    if (value !== undefined && value !== null) {
      if (param.schema) {
        const result = param.schema.safeParse(value);
        if (!result.success) {
          errors.push(`Parameter '${param.name}' validation failed: ${result.error.message}`);
        }
      } else {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (param.type === 'array' && !Array.isArray(value)) {
          errors.push(`Parameter '${param.name}' expected array, got ${actualType}`);
        } else if (param.type !== 'array' && param.type !== 'object' && actualType !== param.type) {
          errors.push(`Parameter '${param.name}' expected ${param.type}, got ${actualType}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ---- Factory Function ----

/**
 * Create an MCP server instance with tool registration and request handling.
 */
export function createMCPServer(config: MCPServerConfig): MCPServerInstance {
  const logger = createLogger(config);
  const tools = new Map<string, MCPTool>();

  // Register tools
  for (const tool of config.tools) {
    if (tools.has(tool.name)) {
      logger.warn(`Duplicate tool name: ${tool.name}. Overwriting.`);
    }
    tools.set(tool.name, tool);
    logger.info(`Registered tool: ${tool.name}`);
  }

  logger.info(`MCP Server '${config.name}' initialized with ${tools.size} tools on port ${config.port}`);

  // ---- Request Handler ----

  async function handleRequest(request: MCPRequest): Promise<MCPResponse> {
    const baseResponse = { id: request.id, jsonrpc: '2.0' as const };

    try {
      // Validate JSON-RPC
      if (request.jsonrpc !== '2.0') {
        return {
          ...baseResponse,
          error: { ...MCP_ERRORS.INVALID_REQUEST, data: 'Expected jsonrpc: "2.0"' },
        };
      }

      switch (request.method) {
        // ---- Initialize ----
        case 'initialize':
          return {
            ...baseResponse,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: { listChanged: false },
              },
              serverInfo: {
                name: config.name,
                version: config.version,
              },
            },
          };

        // ---- List Tools ----
        case 'tools/list':
          return {
            ...baseResponse,
            result: {
              tools: getToolList(),
            },
          };

        // ---- Call Tool ----
        case 'tools/call': {
          const params = request.params || {};
          const toolName = params.name as string;
          const toolArgs = (params.arguments || {}) as Record<string, unknown>;

          if (!toolName) {
            return {
              ...baseResponse,
              error: { ...MCP_ERRORS.INVALID_PARAMS, data: 'Missing tool name' },
            };
          }

          const tool = tools.get(toolName);
          if (!tool) {
            return {
              ...baseResponse,
              error: { ...MCP_ERRORS.TOOL_NOT_FOUND, data: `Tool '${toolName}' not found` },
            };
          }

          // Validate parameters
          const validation = validateParameters(tool, toolArgs);
          if (!validation.valid) {
            return {
              ...baseResponse,
              error: {
                ...MCP_ERRORS.INVALID_PARAMS,
                data: { errors: validation.errors },
              },
            };
          }

          // Execute tool
          const startTime = Date.now();
          try {
            const result = await tool.handler(toolArgs);
            const latency = Date.now() - startTime;

            logger.info(`Tool '${toolName}' executed in ${latency}ms`, {
              args: Object.keys(toolArgs),
              isError: result.isError,
            });

            return {
              ...baseResponse,
              result: {
                content: result.content.map((c) => ({
                  type: c.type === 'json' ? 'text' : c.type,
                  text: typeof c.data === 'string' ? c.data : JSON.stringify(c.data, null, 2),
                })),
                isError: result.isError || false,
                _meta: {
                  latencyMs: latency,
                  ...(result.metadata || {}),
                },
              },
            };
          } catch (toolError) {
            const latency = Date.now() - startTime;
            const errorMessage = toolError instanceof Error ? toolError.message : String(toolError);
            logger.error(`Tool '${toolName}' failed after ${latency}ms: ${errorMessage}`);

            config.onError?.(toolError instanceof Error ? toolError : new Error(errorMessage), request);

            return {
              ...baseResponse,
              error: {
                ...MCP_ERRORS.TOOL_EXECUTION_ERROR,
                data: { tool: toolName, error: errorMessage, latencyMs: latency },
              },
            };
          }
        }

        // ---- Ping ----
        case 'ping':
          return { ...baseResponse, result: { status: 'ok', timestamp: Date.now() } };

        // ---- Notifications (no response needed) ----
        case 'notifications/initialized':
          logger.info('Client initialized');
          return { ...baseResponse, result: {} };

        // ---- Unknown Method ----
        default:
          return {
            ...baseResponse,
            error: { ...MCP_ERRORS.METHOD_NOT_FOUND, data: `Method '${request.method}' not found` },
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Request handling failed: ${errorMessage}`);
      config.onError?.(error instanceof Error ? error : new Error(errorMessage), request);

      return {
        ...baseResponse,
        error: { ...MCP_ERRORS.INTERNAL_ERROR, data: errorMessage },
      };
    }
  }

  // ---- Tool List ----

  function getToolList(): MCPToolDescription[] {
    return Array.from(tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: buildInputSchema(tool.parameters),
    }));
  }

  // ---- Server Info ----

  function getServerInfo(): MCPServerInfo {
    return {
      name: config.name,
      version: config.version,
      description: config.description,
      capabilities: {
        tools: true,
        resources: false,
        prompts: false,
      },
      toolCount: tools.size,
    };
  }

  return {
    name: config.name,
    port: config.port,
    tools,
    handleRequest,
    getToolList,
    getServerInfo,
  };
}

// ---- Helper: Create Tool ----

/**
 * Helper to create a well-typed MCP tool definition.
 */
export function defineTool(
  name: string,
  description: string,
  parameters: MCPToolParameter[],
  handler: MCPTool['handler'],
): MCPTool {
  return { name, description, parameters, handler };
}

/**
 * Helper to create a successful tool result.
 */
export function toolSuccess(data: unknown, metadata?: Record<string, unknown>): MCPToolResult {
  return {
    content: [
      {
        type: typeof data === 'object' ? 'json' : 'text',
        data,
      },
    ],
    isError: false,
    metadata,
  };
}

/**
 * Helper to create an error tool result.
 */
export function toolError(message: string, metadata?: Record<string, unknown>): MCPToolResult {
  return {
    content: [
      {
        type: 'error',
        data: message,
      },
    ],
    isError: true,
    metadata,
  };
}
