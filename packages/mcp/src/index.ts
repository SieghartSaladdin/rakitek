#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerBlueprintTools } from "./tools/blueprint.js";
import { registerComponentTools } from "./tools/components.js";
import { registerStyleTools } from "./tools/styles.js";

async function main() {
  const server = new McpServer({
    name: "rakitek-mcp",
    version: "0.1.0",
  });

  registerStyleTools(server);
  registerComponentTools(server);
  registerBlueprintTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[rakitek-mcp] Fatal error:", err);
  process.exit(1);
});
