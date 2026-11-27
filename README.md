# Rakitek

Rakitek is a React component registry built on `--rk-*` CSS tokens, paired with a Next.js preview site and an MCP server. Everything lives in one `registry/` folder, and `npm run sync` builds the catalog data that both the web app and the MCP server read.

Live preview site and docs: [rakitek.qifor.my.id](https://rakitek.qifor.my.id)

## What is in the registry

Components read colors, typography, radii, and spacing from `--rk-*` CSS variables, so you can drop a section from one style into another and pass your own copy, images, links, and options through TypeScript props. Sections with motion keep their original animation libraries (GSAP, Lenis, Swiper, Motion, Three.js, or Matter.js).

Current catalog contents:

- 7 style presets: `azure-editorial`, `editorial-roastery`, `kinetic-obsidian`, `neon-brutalist`, `orchard-terracotta`, `playful-bookclub`, and `swiss-mono`
- 31 UI primitives in `registry/ui`
- 78 page sections in `registry/sections`
- 8 layout templates in `registry/templates`
- 11 demo pages in `registry/pages`

## Connect an AI coding agent via MCP

The hosted MCP endpoint is `https://rakitek.qifor.my.id/mcp`. Once connected, your agent can inspect styles, plan page slots, and pull verified component source files directly into your project.

### Claude Code

```bash
claude mcp add --transport http --scope user rakitek https://rakitek.qifor.my.id/mcp
```

To install the `rakitek-build` skill globally:

```bash
mkdir -p ~/.claude/skills/rakitek-build
curl -fsSL https://rakitek.qifor.my.id/skills/rakitek-build/SKILL.md -o ~/.claude/skills/rakitek-build/SKILL.md
```

### Antigravity

Add the server to `mcp_config.json`:

```json
{
  "mcpServers": {
    "rakitek": {
      "serverUrl": "https://rakitek.qifor.my.id/mcp"
    }
  }
}
```

To install the `rakitek-build` skill globally:

```bash
mkdir -p ~/.gemini/config/skills/rakitek-build
curl -fsSL https://rakitek.qifor.my.id/skills/rakitek-build/SKILL.md -o ~/.gemini/config/skills/rakitek-build/SKILL.md
```

### MCP tools

| Tool | What it returns |
| --- | --- |
| `plan_page` | Ordered page slots for a brief, with a default pick and alternative sections for each slot |
| `list_styles` | Available style presets with palette, typography, and vibe metadata |
| `get_style` | A style's `tokens.css`, Google Fonts URL, `base.css`, `SmoothScrollProvider`, and install command |
| `search_components` | Matching component metadata filtered by `kind`, `level`, `role`, `category`, `vibe`, or `query` |
| `get_component` | Copy-ready component source files, dependencies, and a working prop example |
| `suggest_page_blueprint` | One complete demo page blueprint when a brief closely matches an existing demo |

## Use components manually

1. Copy a style preset's `tokens.css` from `registry/styles/<style-id>/` and import it in your global stylesheet:

```css
@import "tailwindcss";
@import "./tokens.css";
```

2. Set `data-rk-style` on `<html>` (or on the wrapper around your Rakitek sections):

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-rk-style="editorial-roastery">
      <body>{children}</body>
    </html>
  );
}
```

3. Copy the component folder you need from `registry/`, install any packages listed in its `meta.json`, and pass your content through props.

## Run locally

The Docker image builds on Node.js 22. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

`npm run dev` validates `registry/`, regenerates the catalog indexes, and starts the Next.js app on `http://localhost:3000`.

Root scripts in `package.json`:

- `npm run sync` validates registry schemas and regenerates index files.
- `npm run lint` checks tokens, WCAG AA contrast, imports, file size, and registry rules.
- `npm test` runs `sync`, `lint`, lint rule tests, and MCP server tests.
- `npm run build` runs `sync`, `lint`, and builds `packages/mcp` and `apps/web`.
- `npm run typecheck` checks TypeScript types across `packages/mcp` and `apps/web`.

To run the production build with Docker:

```bash
docker compose up --build
```

## Project layout

```text
rakitek/
├── registry/          # Source of truth: styles, ui, sections, templates, pages
├── apps/web/          # Next.js preview site and /mcp HTTP route
├── packages/mcp/      # Model Context Protocol server (@rakitek/mcp)
├── packages/plugin/   # Distributable agent skill (rakitek-build)
└── scripts/           # Sync, lint, and verification scripts
```

## Contributing

Bug fixes, style presets, and registry components are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

MIT. See [LICENSE](./LICENSE).
