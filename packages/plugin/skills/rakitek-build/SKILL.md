---
name: rakitek-build
description: >-
  Build websites, landing pages, and UI sections from verified Rakitek styles,
  sections, and templates via the rakitek MCP server instead of generating generic
  UI from scratch. Use when the user asks to build, design, or assemble a website,
  landing page, or page section, or mentions Rakitek.
---

# Rakitek Build (MCP → website)

Use whenever building a website, landing page, or UI section. Requires the `rakitek` MCP server (`https://rakitek.qifor.my.id/mcp`).

Rakitek is a set of parts, not a set of finished pages. You pick the sections that serve the user's brief from across every demo, then adapt them with props.

## Rules
- Never write a section from scratch when rakitek-mcp has one for that slot. Copy returned files as-is, then adapt them through props.
- Adapt through props only: copy, images, links, section `id`s, labels and aria text, `formatPrice`, and show/hide flags such as `showCart`. Leave out parts the brief does not need (empty data or the hide prop).
- Keep colors, fonts, radii, and easing on `var(--rk-*)`. No hardcoded hex values or new font names.
- Never rewrite a section's layout or animation from memory. If props cannot make a section fit, pick another candidate for that slot.

## Minimal call sequence (keeps tokens low)
1. `plan_page({ brief })`: returns a style, a layout `shell`, and ordered `slots` (navigation, hero, offerings, about, process, stats, proof, footer, ...). Each slot has a `pick` and all `candidates` from any demo that can fill it. Choose per slot by the brief and drop optional slots that do not serve it. Pass `pageType` (`company-profile`, `saas`, `storefront`, `story`, `waitlist`) if it says no page type matched. A candidate marked `verifiedInStyle: false` still uses only tokens, so it adopts the style, but check it visually.
2. `get_style({ id })`: once per project. Gives `tokens.css`, Google Fonts URL, `base.css`, `smooth-scroll-provider.tsx`, and `setupInstallCommand`. Pass `includeSetup: false` if you already have the setup.
3. `get_component({ id, withComposed: false })`: for each chosen section and for the shell template. The example file shows every prop. Add `includeExample: false` when you already know the props.

`suggest_page_blueprint({ niche })` returns one whole verified demo page instead. Use it only when the brief closely matches that demo (for example a coffee storefront). `search_components({ role })` lists sections by role without code.

## Install into the target project
1. Load `googleFontsUrl` in the root layout. In global CSS, add `base.css` first **unless** the project already imports `tailwindcss` v4 (components are verified on that reset), then `tokens.css`. Set `data-rk-style="<style-id>"` on `<html>` or `<body>`.
2. Run `setupInstallCommand` once, then each component's `installCommand` (versions are pinned to what was verified).
3. Copy every `=== <id>/<file> ===` block into `<components>/<id>/<file>`. Keep `./` imports. Rewrite `@registry/<folder>/<id>/component` to `<components>/<id>/component`.
4. Wrap the app once in `SmoothScrollProvider`. Never create Lenis inside a component.
5. Put the chosen sections into the shell template's slots in plan order (slot props accept any section), or stack them in `<main>` when there is no shell. Give sections the `id`s your navigation links point to.

## Other frameworks
Components are React + CSS Modules. For Vue or Svelte, port the markup and logic 1:1, keep `styles.module.css` byte-for-byte, and keep the animation code (GSAP, Swiper, Lenis) with the same versions.

Vue pitfalls that silently break animations:
- Start GSAP, Swiper, and Lenis in `onMounted` (clean up in `onBeforeUnmount`). A `watch(..., { immediate: true })` runs before the DOM exists, so they never start.
- Do not put an animation's initial state (opacity, transform, filter) in a `:style` binding. Vue re-applies bound styles on every re-render and overwrites the animated values. Set the initial state in `onMounted`, then animate.
- `withDefaults` cannot reference constants declared inside `<script setup>`. Put default data in a separate `<script>` block or a `defaults.ts` file.
- For `motion/react` sections, use the vanilla `animate()` from the same `motion` package with the same values, and replace `AnimatePresence` with `<Transition>` JS hooks.
- `ReactNode` props become slots. A template whose slots are props (`hero`, `footer`, ...) becomes named slots rendered in the same order; check `$slots.<name>` where the React code checked the prop.
- A helper `.tsx` that exports several components becomes one `.vue` file per component in the same folder.
- `on*` callback props: use a function prop when the React code checks whether the callback exists (e.g. `onClick={onCtaClick}` leaves `#` links native when it is undefined, or `onX ? handler : undefined`). Use emits only for pure notifications. An emit is always "present", so it would change that behavior.
- `get_component` lists `alsoNeeded` children it did not send; fetch those too.

## Verify
Run the project's typecheck/build. Check the page at desktop (1440px) and mobile (390px): no horizontal scroll, no clipped or overlapping text, readable text contrast on every background.
