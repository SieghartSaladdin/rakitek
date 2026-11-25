# Rakitek untuk pengguna

Isi folder ini yang dibagikan ke pengguna:
- **MCP online:** `https://rakitek.qifor.my.id/mcp` (Streamable HTTP, publik, read-only, 60 request/menit per IP). Kode server ada di `packages/mcp`, endpoint-nya di `apps/web/src/app/mcp/route.ts`.
- **Skill `rakitek-build`:** `skills/rakitek-build/SKILL.md`. Saat `npm run sync`, file ini disalin ke `apps/web/public/skills/rakitek-build/SKILL.md` supaya bisa diunduh dari `https://rakitek.qifor.my.id/skills/rakitek-build/SKILL.md`.
- **`mcp_config.json`:** contoh config Antigravity (key `serverUrl`).

Tutorial pemasangan untuk pengguna (Claude Code dan Antigravity) ada di halaman Docs web: `https://rakitek.qifor.my.id/docs#install`.

Skill ekstrak (`rakitek-extract`) adalah alat internal pengelola, tinggal di `.agent/skills/`, dan tidak dibagikan.
