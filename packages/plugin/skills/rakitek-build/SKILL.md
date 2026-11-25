---
name: rakitek-build
description: >-
  Assemble production-grade, multi-style websites and landing pages using
  verified Website Styles, UI Components, and Sections from rakitek-mcp instead
  of generating generic UI from scratch.
---

# Rakitek Build Workflow (MCP → Production Website)

Use this skill whenever building a new website, landing page, or UI using the Rakitek design system.

## Core Rule
**Never guess or generate generic UI blocks from scratch when a matching style, UI component, or section exists in `rakitek-mcp`.**

## Step-by-Step Assembly Procedure

### 1. Discover Style & Blueprint
1. Call `list_styles` to inspect available Website Style presets.
2. Optionally call `suggest_page_blueprint({ niche, styleId })` to get a cohesive starter combination of style + sections + UI primitives.
3. Call `get_style({ id })` for the chosen style preset.

### 2. Install Website Styling First
1. Add the style's `googleFontsUrl` (or equivalent `next/font/google` setup) in the target project's root layout.
2. Add the style's `tokensCss` into `globals.css` and apply `data-rk-style="<style-id>"` to the root container (or place the `--rk-*` tokens directly in `:root`).
3. If the page uses smooth scroll, mount a single shared `SmoothScrollProvider` in the root layout.

### 3. Fetch & Assemble Verified Components
1. Call `search_components` by `kind` (`ui | section | template | page`), `level` (`atom | molecule | organism | template | page`), `category`, or `vibe` to find the best matching variants.
2. Call `get_component({ id })` for each chosen item.
3. Run the returned `installCommand` (or install listed `dependencies`, e.g. `gsap`, `swiper`, `three`, `matter-js`) in the target project.
4. Copy `code` (`component.tsx`), `stylesCss` (`styles.module.css` if present), AND every file in `extraFiles` right next to the component so local `./` imports resolve out of the box.
5. If `composedComponents` is non-empty (e.g. for a `template` or `page`), call `get_component({ id })` for each entry and remap its `@registry/<folder>/<id>/component` import path to the local target path (see `importGuide`). Customize **props, copy, images, and layout rhythm** to match the user's brief while keeping `--rk-*` variables intact so the entire site stays visually cohesive.

### 4. Verify
Run the target project's typecheck/build (`npm run build`) and verify visual consistency and responsiveness.
