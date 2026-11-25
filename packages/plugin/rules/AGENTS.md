# Rakitek Plugin Rules

- When the user asks to **extract** a REA/Next.js website into Rakitek, load and follow the `rakitek-extract` skill strictly.
- When the user asks to **build** a website or UI using Rakitek, load `rakitek-build` and query `rakitek-mcp` tools (`list_styles`, `get_style`, `search_components`, `get_component`, `suggest_page_blueprint`) instead of generating generic UI from scratch.
- Never hardcode hex colors or brand font names inside `rakitek/registry/ui/*`, `sections/*`, `templates/*`, or `pages/*`; always bind to semantic `--rk-*` CSS variables.
- Every `meta.json` MUST define `level` (`atom | molecule | organism | template | page`) and `composes` (`<folder>/<id>` entries matching actual `@registry/<folder>/<id>/component` imports). A component may only import components with the same or lower `level`.
- After any extract or fix, run `npm run verify` (sync, lint incl. `rakitek/fidelity-evidence`, tests, `fidelity:all` over every saved pair, build) and report only from its real output. Never loosen tolerances or edit measurement JSON to pass; if the measuring tool changes, re-measure every component.
- When consuming a `template` or `page` via `get_component`, inspect `composedComponents` and fetch each dependency's files (`code`, `stylesCss`, `extraFiles`) so all `@registry/*` imports can be remapped cleanly in the target project.
