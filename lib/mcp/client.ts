// ============================================
// NicheGenius AI - MCP Client
// Connects to MCP servers for tool execution
// ============================================

import { retry } from '@/lib/utils';
import type { MCPToolDescription, MCPServerInfo } from './server';

// ---- Types ----

export interface MCPClientConfig {
  timeout?: number;
  retries?: number;
  onError?: (error: Error, serverUrl: string) => void;
}

export interface MCPCallResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError: boolean;
  metadata?: Record<string, unknown>;
}

export interface MCPServerEntry {
  name: string;
  url: string;
  port: number;
  type: string;
  healthy: boolean;
  lastChecked: number;
  tools: MCPToolDescription[];
  info?: MCPServerInfo;
}

interface JsonRpcResponse {
  id: string | number;
  jsonrpc: '2.0';
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

// ---- Error Class ----

export class MCPClientError extends Error {
  serverUrl: string;
  code?: number;

  constructor(message: string, serverUrl: string, code?: number) {
    super(message);
    this.name = 'MCPClientError';
    this.serverUrl = serverUrl;
    this.code = code;
  }
}

// ---- Internal JSON-RPC Caller ----

let requestCounter = 0;

function nextId(): number {
  return ++requestCounter;
}

async function rpcCall(
  serverUrl: string,
  method: string,
  params?: Record<string, unknown>,
  timeout: number = 30000,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id: nextId(),
        jsonrpc: '2.0',
        method,
        params: params || {},
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => 'Unknown error');
      throw new MCPClientError(
        `MCP server returned ${response.status}: ${body}`,
        serverUrl,
        response.status,
      );
    }

    const json = (await response.json()) as JsonRpcResponse;

    if (json.error) {
      throw new MCPClientError(
        `MCP RPC error [${json.error.code}]: ${json.error.message}`,
        serverUrl,
        json.error.code,
      );
    }

    return json.result;
  } catch (error) {
    if (error instanceof MCPClientError) throw error;

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new MCPClientError(
        `MCP request timed out after ${timeout}ms`,
        serverUrl,
        408,
      );
    }

    throw new MCPClientError(
      `MCP connection failed: ${error instanceof Error ? error.message : String(error)}`,
      serverUrl,
    );
  } finally {
    clearTimeout(timer);
  }
}

// ---- Core Client Functions ----

/**
 * Connect to an MCP server and retrieve its capabilities.
 */
export async function connectToServer(
  url: string,
  config?: MCPClientConfig,
): Promise<{ info: MCPServerInfo; tools: MCPToolDescription[] }> {
  const timeout = config?.timeout ?? 10000;

  // Initialize connection
  const initResult = (await retry(
    () => rpcCall(url, 'initialize', {}, timeout),
    { maxRetries: config?.retries ?? 2 },
  )) as {
    protocolVersion: string;
    serverInfo: { name: string; version: string };
    capabilities: Record<string, unknown>;
  };

  // Send initialized notification
  await rpcCall(url, 'notifications/initialized', {}, timeout).catch(() => {
    // Notifications don't require response
  });

  // List available tools
  const toolsResult = (await rpcCall(url, 'tools/list', {}, timeout)) as {
    tools: MCPToolDescription[];
  };

  const info: MCPServerInfo = {
    name: initResult.serverInfo.name,
    version: initResult.serverInfo.version,
    description: '',
    capabilities: {
      tools: !!initResult.capabilities?.tools,
      resources: !!initResult.capabilities?.resources,
      prompts: !!initResult.capabilities?.prompts,
    },
    toolCount: toolsResult.tools.length,
  };

  return { info, tools: toolsResult.tools };
}

/**
 * Call a tool on an MCP server.
 */
export async function callTool(
  serverUrl: string,
  toolName: string,
  args: Record<string, unknown> = {},
  config?: MCPClientConfig,
): Promise<MCPCallResult> {
  const timeout = config?.timeout ?? 60000;

  const result = (await retry(
    () =>
      rpcCall(
        serverUrl,
        'tools/call',
        { name: toolName, arguments: args },
        timeout,
      ),
    { maxRetries: config?.retries ?? 2 },
  )) as MCPCallResult;

  return result;
}

/**
 * List available tools on an MCP server.
 */
export async function listTools(
  serverUrl: string,
  config?: MCPClientConfig,
): Promise<MCPToolDescription[]> {
  const timeout = config?.timeout ?? 10000;

  const result = (await rpcCall(serverUrl, 'tools/list', {}, timeout)) as {
    tools: MCPToolDescription[];
  };

  return result.tools;
}

/**
 * Ping an MCP server to check health.
 */
export async function pingServer(
  serverUrl: string,
  timeout: number = 5000,
): Promise<{ healthy: boolean; latencyMs: number }> {
  const start = Date.now();

  try {
    await rpcCall(serverUrl, 'ping', {}, timeout);
    return { healthy: true, latencyMs: Date.now() - start };
  } catch {
    return { healthy: false, latencyMs: Date.now() - start };
  }
}

// ---- MCP Server Registry ----

/**
 * Registry to manage all MCP server connections.
 * Tracks server health, caches tool lists, and provides discovery.
 */
export class MCPServerRegistry {
  private servers: Map<string, MCPServerEntry> = new Map();
  private config: MCPClientConfig;

  constructor(config?: MCPClientConfig) {
    this.config = config || {};
  }

  /**
   * Register and connect to an MCP server.
   */
  async register(
    name: string,
    url: string,
    port: number,
    type: string,
  ): Promise<MCPServerEntry> {
    try {
      const { info, tools } = await connectToServer(url, this.config);

      const entry: MCPServerEntry = {
        name,
        url,
        port,
        type,
        healthy: true,
        lastChecked: Date.now(),
        tools,
        info,
      };

      this.servers.set(name, entry);
      console.log(
        `[MCPRegistry] Registered '${name}' at ${url} with ${tools.length} tools`,
      );

      return entry;
    } catch (error) {
      const entry: MCPServerEntry = {
        name,
        url,
        port,
        type,
        healthy: false,
        lastChecked: Date.now(),
        tools: [],
      };

      this.servers.set(name, entry);
      console.warn(
        `[MCPRegistry] Failed to connect to '${name}' at ${url}: ${error instanceof Error ? error.message : String(error)}`,
      );

      return entry;
    }
  }

  /**
   * Register all NicheGenius MCP servers from environment config.
   */
  async registerAll(): Promise<Map<string, MCPServerEntry>> {
    const serverConfigs = [
      {
        name: 'trend-analysis',
        port: parseInt(process.env.MCP_TREND_ANALYSIS_PORT || '3101'),
        type: 'TREND_ANALYSIS',
      },
      {
        name: 'product-ideas',
        port: parseInt(process.env.MCP_PRODUCT_IDEAS_PORT || '3102'),
        type: 'PRODUCT_IDEAS',
      },
      {
        name: 'content-gen',
        port: parseInt(process.env.MCP_CONTENT_GEN_PORT || '3103'),
        type: 'CONTENT_GEN',
      },
      {
        name: 'market-data',
        port: parseInt(process.env.MCP_MARKET_DATA_PORT || '3104'),
        type: 'MARKET_DATA',
      },
      {
        name: 'niche-research',
        port: parseInt(process.env.MCP_NICHE_RESEARCH_PORT || '3105'),
        type: 'NICHE_RESEARCH',
      },
      {
        name: 'competitor-intel',
        port: parseInt(process.env.MCP_COMPETITOR_INTEL_PORT || '3106'),
        type: 'COMPETITOR_INTEL',
      },
    ];

    await Promise.allSettled(
      serverConfigs.map((cfg) =>
        this.register(
          cfg.name,
          `http://localhost:${cfg.port}/mcp`,
          cfg.port,
          cfg.type,
        ),
      ),
    );

    return this.servers;
  }

  /**
   * Get a specific server entry.
   */
  get(name: string): MCPServerEntry | undefined {
    return this.servers.get(name);
  }

  /**
   * Get all registered servers.
   */
  getAll(): MCPServerEntry[] {
    return Array.from(this.servers.values());
  }

  /**
   * Get only healthy servers.
   */
  getHealthy(): MCPServerEntry[] {
    return this.getAll().filter((s) => s.healthy);
  }

  /**
   * Call a tool on a named server.
   */
  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown> = {},
  ): Promise<MCPCallResult> {
    const server = this.servers.get(serverName);
    if (!server) {
      throw new MCPClientError(
        `Server '${serverName}' not registered`,
        'registry',
      );
    }
    if (!server.healthy) {
      throw new MCPClientError(
        `Server '${serverName}' is unhealthy`,
        server.url,
      );
    }

    return callTool(server.url, toolName, args, this.config);
  }

  /**
   * Find a tool across all servers.
   */
  findTool(toolName: string): { server: MCPServerEntry; tool: MCPToolDescription } | null {
    for (const server of this.servers.values()) {
      if (!server.healthy) continue;
      const tool = server.tools.find((t) => t.name === toolName);
      if (tool) return { server, tool };
    }
    return null;
  }

  /**
   * List all tools across all healthy servers.
   */
  listAllTools(): Array<{ server: string; tool: MCPToolDescription }> {
    const tools: Array<{ server: string; tool: MCPToolDescription }> = [];

    for (const server of this.servers.values()) {
      if (!server.healthy) continue;
      for (const tool of server.tools) {
        tools.push({ server: server.name, tool });
      }
    }

    return tools;
  }

  /**
   * Health check all servers.
   */
  async healthCheck(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    await Promise.allSettled(
      Array.from(this.servers.entries()).map(async ([name, server]) => {
        const { healthy } = await pingServer(server.url);
        server.healthy = healthy;
        server.lastChecked = Date.now();
        results.set(name, healthy);
      }),
    );

    return results;
  }

  /**
   * Remove a server from the registry.
   */
  unregister(name: string): boolean {
    return this.servers.delete(name);
  }

  /**
   * Get registry status summary.
   */
  status(): {
    totalServers: number;
    healthyServers: number;
    totalTools: number;
    servers: Array<{ name: string; healthy: boolean; toolCount: number; url: string }>;
  } {
    const servers = this.getAll();
    return {
      totalServers: servers.length,
      healthyServers: servers.filter((s) => s.healthy).length,
      totalTools: servers.reduce((sum, s) => sum + s.tools.length, 0),
      servers: servers.map((s) => ({
        name: s.name,
        healthy: s.healthy,
        toolCount: s.tools.length,
        url: s.url,
      })),
    };
  }
}

// ---- Singleton Registry ----

let _registry: MCPServerRegistry | null = null;

/**
 * Get or create the global MCP server registry.
 */
export function getMCPRegistry(config?: MCPClientConfig): MCPServerRegistry {
  if (!_registry) {
    _registry = new MCPServerRegistry(config);
  }
  return _registry;
}
