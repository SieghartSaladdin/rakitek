---
name: rakitek-extract
description: >-
  Extract website styling presets, UI components, and landing-page sections from
  any REA / Next.js project into the Rakitek registry so they immediately appear
  in the Rakitek visual showcase website and rakitek-mcp server.
---

# Rakitek Extract Workflow (REA → Registry → Website + MCP)

Use this skill whenever the user says things like:
- *"Ini hasil REA di `<folder>`, tolong extract masukin ke rakitek"*
- *"Ambil style & komponen dari `<proyek>` ke rakitek"*

## Target Repository
- Default Rakitek root: `C:\Users\Fafnir\Documents\rea-web\rakitek`

## Step-by-Step Extraction Procedure

### 0. Atomic Audit (Before Writing Any Component)
Read the source project's `package.json`, `globals.css` / theme CSS, `src/app/page.tsx`, and all component folders. Produce a concrete **Atomic Classification Map** before coding:
- **Website Style DNA** (`registry/styles/<style-id>/`): surface/bg/fg/accent palette, display + body + mono font pairing (verified via browser `fontRendered` with open Google Fonts equivalents), border radii, easing curve, overall vibe.
- **Atoms** (`registry/ui/<id>/`, `level: "atom"`): indivisible primitives (`button`, `badge`, `ticker`, `icon-button`).
- **Molecules** (`registry/ui/<id>/`, `level: "molecule"`): small cohesive units combining 2-3 atoms (`input` + submit, `card`, `slider-controls`, `search-bar`).
- **Organisms** (`registry/sections/<id>/`, or `registry/ui/<id>/` for standalone `drawer`/`modal`, `level: "organism"`): complete functional blocks or page sections (`navbar`, `hero`, `quiz`, `showcase`, `faq`, `pricing`, `footer`).
- **Template** (`registry/templates/<id>/`, `level: "template"`, optional): extract only when the source site has a page-level layout shell rule (e.g. `calc(100% - 90px)` rail column, sticky sidebar layout) that does not belong inside individual sections.
- **Page** (`registry/pages/<id>/`, `level: "page"`, optional): neutral composed demo page verified via the 2-step protocol (Step 1: `0 FAIL` assembly check with original copy against the full live homepage; Step 2: swap to neutral sample data and visually confirm zero overlap, clipping, or horizontal overflow).

**Composition & Ordering Rules:**
- Extract **bottom-up**: Style -> Atoms -> Molecules -> Organisms -> (optional) Template & Page.
- Only populate `composes` (`["<folder>/<id>", ...]`) when the component truly imports another registry item via `@registry/<folder>/<id>/component`. A component may only import components with the **same or lower `level`**.
- Never force a section to import a shared atom if the source site styles that sub-element differently (e.g. pinned CTA, custom blend mode) in a way that could break 1:1 `0 FAIL` fidelity; keep `composes: []` in that case.
- Keep component-private helper files in the same folder and import them via `./` (never `../`).

### 1. Extract Website Style (Optional if new style)
Create `registry/styles/<style-id>/`:
- `meta.json` — valid against `StyleMetaSchema` (`id`, `name`, `vibe`, `description`, `sourceRef`, `fonts` with `googleFontsUrl`, `palettePreview`, `tags`).
- `tokens.css` — scoped under `[data-rk-style="<style-id>"]` defining all required `--rk-*` variables:
  `--rk-bg`, `--rk-surface`, `--rk-surface-elevated`, `--rk-fg`, `--rk-fg-muted`, `--rk-accent`, `--rk-accent-fg`, `--rk-highlight`, `--rk-border`, `--rk-border-strong`, `--rk-font-display`, `--rk-font-body`, `--rk-font-mono`, `--rk-display-transform`, `--rk-display-tracking`, `--rk-radius-sm`, `--rk-radius-md`, `--rk-radius-lg`, `--rk-radius-pill`, `--rk-shadow`, `--rk-ease`.

### 2. Extract High-Fidelity, White-Label UI Components & Sections
For each extracted component, create `registry/ui/<id>/`, `registry/sections/<id>/`, `registry/templates/<id>/`, or `registry/pages/<id>/` containing:
1. `meta.json` — valid against `ComponentMetaSchema` (`id` MUST match folder name, `kind`: `"ui"` or `"section"`, `level`: `"atom" | "molecule" | "organism"`, `composes`: array of `"<folder>/<id>"` matching actual `@registry/<folder>/<id>/component` imports or `[]`, `styling`: `"css-modules"` | `"tailwind"` | `"hybrid"`, `dependencies`: original motion/interaction libraries such as `["gsap"]`, `["swiper", "gsap"]`, `["motion"]`, `["three"]`, `["matter-js"]`). A component may only import components with the same or lower `level`, and local helpers must stay in the same folder via `./`.
2. `styles.module.css` (Recommended for CSS-heavy / custom-motion / editorial websites) — **1:1 Source-Faithful Geometry Rule:** NEVER paraphrase or invent generic replacement grids from memory. Read the exact source TSX and CSS stylesheet rules (`grid-template-columns`, `grid-column` tracks, `vw`/`vh` display scale, `aspect-ratio`, `border-radius`, `box-shadow`, easing curves, keyframes, and hover transitions) and port them faithfully into `styles.module.css`, replacing ONLY hardcoded hex colors and proprietary font names with `var(--rk-*)` tokens and `color-mix(in srgb, var(--rk-...) ..., ...)`.
3. `component.tsx` — MUST follow the Rakitek Styling-Agnostic Contract:
   - **Preserve native mechanics:** Keep real animation/interaction engines (`gsap`, `swiper`, `three`, `matter-js`, etc.) when present in the source website; never dumb down complex motion into static placeholders.
   - **Zero brand leftovers:** No original brand names, copyrighted copy, private CDN URLs, or obfuscated/Webflow CSS classes. Expose clean optional media props (`backgroundImage`, `imageSrc`, `galleryImages`) with graceful token-styled fallbacks.
   - **Token-only styling:** CSS Modules (`styles.module.css`), Tailwind, or Hybrid — all colors, fonts, radii, and easing MUST reference `var(--rk-*)` CSS variables (zero hardcoded hex literals in both `.tsx` and `.module.css`).
   - **Readable & AI-editable:** Clean TypeScript props interface with sensible defaults, `<= 250` lines per file.
   - **No scroll conflicts:** Never instantiate `Lenis` inside a component.
4. `preview.tsx` — Default export rendering realistic white-label demo data so it immediately renders live in `apps/web`.

### 3. Measure 1:1 Browser Fidelity, Auto-Sync, Lint & Verify
Follow [docs/workflow-ekstrak-1to1.md](../../../../docs/workflow-ekstrak-1to1.md) strictly for every extracted component:
1. Measure the live original website (`1920x980` and `1024x768`, plus `375x812` if responsive) using `scripts/fidelity/measure.js` (via `npm run fidelity:sink` or `npm run fidelity:capture -- <job.json>`) and save JSON + screenshots under `fidelity/<id>/`.
2. Build & restart the showcase server, then measure `/preview/<kind>/<id>` with the exact same labels and viewports.
3. Run `npm run fidelity -- fidelity/<id>/original-1920.json fidelity/<id>/extract-1920.json` and `1024` until `0 FAIL`, and document every intentional WARN + side-by-side screenshots in `fidelity/<id>/REPORT.md`.
4. Run the single gate inside `C:\Users\Fafnir\Documents\rea-web\rakitek` until it exits 0:
```bash
npm run verify
```
`verify` runs sync, lint (incl. `rakitek/fidelity-evidence`), lint-rule tests, MCP tests, `fidelity:all` (re-compares **every** saved pair, not just the new one), and both builds. Never loosen tolerances or edit measurement JSON to pass; if the measuring tool changes, re-measure every component.

### 4. Report Summary
Follow the report format in `AGENTS.md`: paste the last 15 lines of the real `npm run verify` output, list changed components with reasons, remaining intentional WARNs, and side-by-side screenshot paths.

List the exact IDs added (styles, atoms, molecules, organisms, and any templates/pages), their live preview paths (`/styles`, `/atoms`, `/molecules`, `/organisms`, `/templates`, `/pages`, `/item/<kind>/<id>`), and confirm they are immediately queryable via `rakitek-mcp`.
