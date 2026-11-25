import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createRakitekServer } from "@rakitek/mcp/server";

// Public, read-only Rakitek MCP over Streamable HTTP: https://<host>/mcp
// Stateless: every request gets its own server + transport, so no session store is needed.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Small in-memory limiter: the tools are read-only, this only protects the server from spam. */
function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, value] of hits) if (value.resetAt < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

async function handle(req: Request): Promise<Response> {
  if (rateLimited(clientIp(req))) {
    return Response.json(
      { jsonrpc: "2.0", error: { code: -32000, message: "Rate limit: 60 requests per minute." }, id: null },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }
  const server = createRakitekServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  return transport.handleRequest(req);
}

export { handle as GET, handle as POST, handle as DELETE };
