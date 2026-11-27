# Rakitek

**A multi-style UI/UX component registry, visual showcase, and MCP server for AI coding agents.**

Rakitek drives a single component registry (`registry/`) that powers three surfaces automatically:
- **Visual Showcase** (`apps/web`) — Browse live previews, inspect code, and switch visual styles at [rakitek.qifor.my.id](https://rakitek.qifor.my.id).
- **MCP Server** (`packages/mcp`) — Stream verified, token-based styles, sections, templates, and page plans directly into Claude Code, Antigravity, and other MCP clients.
- **Agent Skill** (`packages/plugin`) — Lightweight build workflow (`rakitek-build`) so AI agents assemble real UI components through props instead of generating generic markup from scratch.

---

## What's Inside

All components are built on `--rk-*` CSS design tokens, clean TypeScript props, and production animation engines (GSAP, Lenis, Swiper, Motion, Three.js, Matter.js) so sections can be mixed and matched across visual themes.

- **7 Style Presets**: `azure-editorial`, `editorial-roastery`, `kinetic-obsidian`, `neon-brutalist`, `orchard-terracotta`, `playful-bookclub`, `swiss-mono`
- **31 UI Primitives** (`registry/ui`)
- **78 Page Sections** (`registry/sections`)
- **8 Layout Templates** (`registry/templates`)
- **11 Complete Demo Pages** (`registry/pages`)

---

## Use with AI Coding Agents (MCP)

Hosted MCP endpoint: `https://rakitek.qifor.my.id/mcp`

### Claude Code

```bash
claude mcp add --transport http --scope user rakitek https://rakitek.qifor.my.id/mcp
```

Optional skill install (`rakitek-build`):

```bash
mkdir -p ~/.claude/skills/rakitek-build
curl -fsSL https://rakitek.qifor.my.id/skills/rakitek-build/SKILL.md -o ~/.claude/skills/rakitek-build/SKILL.md
```

### Antigravity

Add to `mcp_config.json`:

```json
{
  "mcpServers": {
    "rakitek": {
      "serverUrl": "https://rakitek.qifor.my.id/mcp"
    }
  }
}
```

Optional skill install (`rakitek-build`):

```bash
mkdir -p ~/.gemini/config/skills/rakitek-build
curl -fsSL https://rakitek.qifor.my.id/skills/rakitek-build/SKILL.md -o ~/.gemini/config/skills/rakitek-build/SKILL.md
```

### Available MCP Tools

| Tool | Purpose |
| --- | --- |
| `plan_page` | Turn a project brief into ordered content slots with recommended and alternative sections |
| `list_styles` | Compare available style presets (palettes, typography, vibe) |
| `get_style` | Fetch `tokens.css`, Google Fonts URL, `base.css`, `SmoothScrollProvider`, and setup command |
| `search_components` | Search registry items by `kind`, `level`, `role`, `category`, `vibe`, or `query` |
| `get_component` | Retrieve copy-ready component source files, dependencies, and usage examples |
| `suggest_page_blueprint` | Fetch a full verified demo page blueprint for a matching niche |

---

## Using Components Manually

1. Copy a style preset's `tokens.css` into your project and import it in your global stylesheet:

```css
@import "tailwindcss";
@import "./tokens.css";
```

2. Set the `data-rk-style` attribute on `<html>` (or your root wrapper):

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-rk-style="editorial-roastery">
      <body>{children}</body>
    </html>
  );
}
```

3. Copy any component folder from `registry/` and pass your own copy, images, links, and options through props.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Run Locally

```bash
npm install
npm run dev
```

This runs `npm run sync` to validate and index `registry/`, then starts the Next.js showcase on [http://localhost:3000](http://localhost:3000).

### Useful Scripts

```bash
npm run sync       # Validate registry schemas and regenerate catalog indexes
npm run build      # Sync, lint, and build both packages/mcp and apps/web
npm run typecheck  # Type-check MCP server and Next.js showcase
npm test           # Run sync, lint, lint rule tests, and MCP tests
```

### Docker

```bash
docker compose up --build
```

---

## Repository Structure

```text
rakitek/
├── registry/          # Single source of truth: styles, ui, sections, templates, pages
├── apps/web/          # Next.js visual showcase & hosted /mcp HTTP endpoint
├── packages/mcp/      # Model Context Protocol server (@rakitek/mcp)
├── packages/plugin/   # Distributable agent skill (rakitek-build)
└── scripts/           # Registry sync, validation, and build tooling
```

---

## License

MIT — see [LICENSE](./LICENSE).
