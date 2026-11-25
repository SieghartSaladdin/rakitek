#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRakitekServer } from "./server.js";

async function main() {
  const server = createRakitekServer();
  await server.connect(new StdioServerTransport());
}

main().catch((err) => {
  console.error("[rakitek-mcp] Fatal error:", err);
  process.exit(1);
});
