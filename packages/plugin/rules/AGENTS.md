# Rakitek Plugin Rules

- When the user asks to **build** a website, landing page, or UI with Rakitek, load the `rakitek-build` skill and start with `suggest_page_blueprint`, then `get_style` once, then `get_component`. Do not generate generic UI from scratch.
- Copy every returned file block as-is so local `./` imports resolve; fetch any ids listed in `fetchSeparately` and rewrite `@registry/<folder>/<id>/component` imports to the local folder.
- Customize props, copy, and images to fit the brief, but keep colors, fonts, radii, and easing bound to the `--rk-*` variables; do not replace them with hardcoded hex values or new font names.
- Do not rewrite a component's layout or animation from memory; if it does not fit, pick another variant via `search_components`.
- Finish by running the target project's own typecheck/build and checking the page at desktop and mobile widths.
