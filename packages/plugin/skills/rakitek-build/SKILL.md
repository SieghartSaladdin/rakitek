---
name: rakitek-build
description: >-
  Assemble production-grade websites and landing pages from verified Rakitek
  styles, sections, and templates via rakitek-mcp instead of generating generic
  UI from scratch.
---

# Rakitek Build (MCP → website)

Use whenever building a website, landing page, or UI with Rakitek.

**Core rule:** never write a section from scratch when rakitek-mcp has one. Copy returned files as-is, then change only props, copy, and images.

## Minimal call sequence (keeps tokens low)
1. `suggest_page_blueprint({ niche })` — returns the style, a verified `basePage`, the ordered `stack` (one pick per slot + `alternatives`), and `next` steps. If it returns `note`, the niche had no tagged style; check `list_styles` only then.
2. `get_style({ id })` — once per project. Gives `tokens.css`, Google Fonts URL, `base.css`, `smooth-scroll-provider.tsx`, and tested npm versions. Pass `includeSetup: false` if you already have the setup.
3. `get_component({ id: basePage })` — returns the page, its template, and as many sections as fit one reply. For each id in `fetchSeparately`, call `get_component({ id, withComposed: false, includeExample: false })`.
4. Swapping a slot: `get_component({ id: <alternative>, withComposed: false })` and replace only that section.

Use `search_components` only when the blueprint has no fitting slot. It returns rows without code.

## Install into the target project
1. Load `googleFontsUrl` in the root layout. In global CSS, add `base.css` first **unless** the project already imports `tailwindcss` v4 (components are verified on that reset), then `tokens.css`. Set `data-rk-style="<style-id>"` on `<html>` or `<body>`.
2. Run the returned `installCommand` (versions are pinned to what was verified).
3. Copy every `=== <id>/<file> ===` block into `<components>/<id>/<file>`. Keep `./` imports. Rewrite `@registry/<folder>/<id>/component` to `<components>/<id>/component`.
4. Wrap the app once in `SmoothScrollProvider` if any section scrolls with animation (optional: `npm install lenis`). Never create Lenis inside a component.
5. `example.tsx` is reference only: it shows prop shapes and assembly order. Build your page from it with the brief's copy and images.

## Verify
Run the project's typecheck/build. Check the page at desktop (1440px) and mobile (390px): no horizontal scroll, no clipped or overlapping text. Keep all colors, fonts, radii, and easing on `var(--rk-*)`.
