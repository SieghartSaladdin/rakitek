# Contributing to Rakitek

Pull requests for bug fixes, new style presets, registry components, MCP server improvements, and docs fixes are welcome.

## Setup

Fork the repository, clone your fork, and install dependencies with Node.js 22:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to browse the local preview site.

## Registry conventions

Every item in `registry/` must pass `npm run sync` and `npm run lint`.

### Style presets (`registry/styles/<id>/`)

A style folder needs `meta.json` and `tokens.css`, with `meta.id` matching the folder name. Token pairs checked by the linter (`--rk-fg` on `--rk-bg`, `--rk-fg-muted` on `--rk-bg` and `--rk-surface`, and `--rk-accent-fg` on `--rk-accent`) must meet at least a 4.5:1 WCAG AA contrast ratio.

### Components (`ui`, `sections`, `templates`, `pages`)

Each component lives in `registry/<folder>/<id>/` with `meta.json`, `component.tsx`, `preview.tsx`, and an optional `styles.module.css`. Keep component-specific helpers in the same folder and import them with `./` (relative `../` imports across components are rejected by the linter).

Follow these rules when adding or editing a component:

- Read colors, fonts, radii, and easing from `--rk-*` CSS variables rather than hardcoding hex colors or font names.
- Pass copy, links, images, section IDs, and optional feature toggles through TypeScript props, and exercise all of them in `preview.tsx`.
- Set `level` (`atom`, `molecule`, `organism`, `template`, or `page`) in `meta.json`.
- Import shared registry components with `@registry/<folder>/<id>/component`, import only from the same or lower atomic level, and list every directly imported component in `composes` (`"<folder>/<id>"`).
- Keep component source files under 260 lines and leave out hardcoded brand names.
- If you add a section, declare its `roles` in `meta.json` so `plan_page` and `search_components` can find it.

Do not edit `registry/.generated/` or `apps/web/src/generated/` by hand. Run `npm run sync` after changing anything under `registry/`.

## MCP server and skill docs

The user-facing MCP server lives in `packages/mcp/src/server.ts`, the hosted HTTP route is in `apps/web/src/app/mcp`, and the distributable agent skill is in `packages/plugin/skills/rakitek-build/SKILL.md`. If a change alters how users connect or call MCP tools, update the server instructions, `SKILL.md`, and the docs page in `apps/web` together so they stay in sync.

## Checks before opening a pull request

Run the test suite and build locally:

```bash
npm test
npm run typecheck
npm run build
```

For registry component changes that affect layout or styling, also run `npm run verify` and attach desktop and mobile screenshots in the pull request description.

## Reporting bugs

Open a GitHub issue with the steps to reproduce, the component ID or MCP tool involved, and the terminal output or screenshot showing the problem.
