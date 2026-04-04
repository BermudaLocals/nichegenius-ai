#!/usr/bin/env node
/**
 * NicheGenius AI — MCP Server Orchestrator
 * Starts all 6 specialized MCP tool servers in parallel.
 */

import { createMCPServer, defineTool, toolSuccess, toolError } from '../lib/mcp/server';

const SERVERS = [
  { name: 'niche-research',   port: 3100, module: './niche-research/server' },
  { name: 'market-data',      port: 3101, module: './market-data/server' },
  { name: 'competitor-intel',  port: 3102, module: './competitor-intel/server' },
  { name: 'content-gen',      port: 3103, module: './content-gen/server' },
  { name: 'product-ideas',    port: 3104, module: './product-ideas/server' },
  { name: 'trend-analysis',   port: 3105, module: './trend-analysis/server' },
];

async function startAll() {
  console.log('\n🚀 NicheGenius AI — MCP Server Orchestrator');
  console.log('━'.repeat(50));

  const results = await Promise.allSettled(
    SERVERS.map(async (srv) => {
      try {
        const mod = await import(srv.module);
        if (typeof mod.start === 'function') {
          await mod.start(srv.port);
          console.log(`  ✅ ${srv.name.padEnd(20)} → :${srv.port}`);
        } else {
          console.log(`  ⚠️  ${srv.name.padEnd(20)} — no start() export, skipping`);
        }
      } catch (err: any) {
        console.error(`  ❌ ${srv.name.padEnd(20)} — ${err.message}`);
        throw err;
      }
    }),
  );

  const ok = results.filter((r) => r.status === 'fulfilled').length;
  const fail = results.filter((r) => r.status === 'rejected').length;
  console.log('━'.repeat(50));
  console.log(`  ${ok} servers started, ${fail} failed\n`);
}

startAll().catch((err) => {
  console.error('Fatal orchestrator error:', err);
  process.exit(1);
});

export { SERVERS };
