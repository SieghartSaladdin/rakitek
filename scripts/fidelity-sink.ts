import fs from "node:fs";
import http from "node:http";
import path from "node:path";

// Local receiver so a browser page can save rkMeasure() results straight into fidelity/.
// Usage: npm run fidelity:sink   then in the page:
//   await new Promise((ok) => document.head.append(Object.assign(document.createElement("script"), { src: "http://127.0.0.1:4599/measure.js", onload: ok })));
//   fetch("http://127.0.0.1:4599/save?file=<id>/original-1920.json", { method: "POST", body: JSON.stringify(rkMeasure(map)) })

const PORT = Number(process.env.RK_FIDELITY_PORT ?? 4599);
const ROOT = path.resolve(process.cwd(), "fidelity");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  if (req.method === "GET" && url.pathname === "/measure.js") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(fs.readFileSync(path.resolve(process.cwd(), "scripts", "fidelity", "measure.js"), "utf8"));
    return;
  }
  if (req.method !== "POST" || url.pathname !== "/save") {
    res.writeHead(404).end("POST /save?file=<id>/<name>.json");
    return;
  }
  const rel = url.searchParams.get("file") ?? "";
  const target = path.resolve(ROOT, rel);
  if (!target.startsWith(ROOT + path.sep) || path.extname(target) !== ".json") {
    res.writeHead(400).end("file must be a .json path inside fidelity/");
    return;
  }
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 2_000_000) req.destroy();
  });
  req.on("end", () => {
    try {
      const parsed = JSON.parse(body);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, JSON.stringify(parsed, null, 2));
      console.log(`[rakitek fidelity] saved ${path.relative(process.cwd(), target)}`);
      res.writeHead(200).end("saved");
    } catch {
      res.writeHead(400).end("body must be JSON");
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[rakitek fidelity] sink listening on http://127.0.0.1:${PORT}/save`);
});
