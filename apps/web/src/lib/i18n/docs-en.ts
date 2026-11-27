import type { WebCopy } from "./types";

export const DOCS_EN: WebCopy["docs"] = {
  title: "Documentation",
  install: {
    tag: "Start here",
    title: "Install MCP & Skill",
    intro: "Rakitek MCP is online. No clone or build needed, just point your AI at",
    note: "The server is public and read-only, limited to 60 requests per minute per IP.",
    clientLabel: "Choose your AI",
    checkTitle: "Check & try",
    checkFilename: "Check connection",
    tryPrompt: "Example prompt: \"Build a coffee shop landing page with rakitek.\"",
    steps: {
      claude: {
        mcpTitle: "Connect the MCP (global)",
        mcpDesc: "Run once in a terminal. --scope user makes rakitek available in every project. The MCP ships short instructions, so Claude already knows the workflow.",
        skillTitle: "Install the rakitek-build skill (global, optional)",
        skillDesc: "The full guide for Claude. Global skills live in ~/.claude/skills and apply to every project. Re-run the same command to update.",
        checkDesc: "Make sure rakitek shows Connected, then start a new Claude Code session.",
      },
      antigravity: {
        mcpTitle: "Connect the MCP (global)",
        mcpDesc: "Open Customizations → Installed → MCP Servers, click Copy Config File Path, open that file, and add the rakitek entry below inside mcpServers. The personal config lives at ~/.gemini/config/mcp_config.json.",
        skillTitle: "Install the rakitek-build skill (global)",
        skillDesc: "Antigravity global skills live in ~/.gemini/config/skills and apply to every workspace. Re-run the same command to update.",
        checkDesc: "Restart the rakitek server from the ⋮ menu (or restart Antigravity), then check that its 6 tools appear.",
      },
    },
  },
  introPart1: "Complete guide to using Rakitek components manually, connecting",
  introPart2: ", and using the skill",
  sec1Tag: "Section 01",
  sec1Title: "Manual Usage (Website & Copy)",
  sec1Intro1: "Every Rakitek component follows the CSS Variables contract",
  sec1Intro2: "with CSS Modules or Tailwind CSS. Add a single",
  sec1Intro3: "file, then copy the component files from the Code tab.",
  steps: [
    {
      step: "Step 1",
      title: "Pick a Website Style",
      beforeCode: "Open the Styles page, copy",
      code: "tokens.css",
      afterCode: ", and load the listed Google Fonts.",
    },
    {
      step: "Step 2",
      title: "Copy Component or Section",
      beforeCode: "Pick an item from the sidebar, inspect Desktop/Tablet/Mobile previews, then copy",
      code: "component.tsx",
      afterCode: "and any sibling files.",
    },
    {
      step: "Step 3",
      title: "Customize Props & Content",
      beforeCode: "Update copy, images, and handlers for your project while keeping the",
      code: "--rk-*",
      afterCode: "token contract intact.",
    },
  ],
  sec2Tag: "Section 02",
  sec2TitlePrefix: "MCP Documentation",
  sec2Intro1: "runs online over Streamable HTTP and reads the same registry as this website:",
  sec2Intro2: "Every time the registry is updated with",
  sec2Intro3: "and deployed, every user gets the latest components.",
  tableTool: "Tool Name",
  tableArgs: "Arguments",
  tablePurpose: "Purpose",
  mcpToolPurposes: {
    plan_page: "Start here: turns a brief into ordered content slots, each offering every section from any demo that fits.",
    suggest_page_blueprint:
      "One whole verified demo page; use it only when the brief closely matches that demo.",
    get_style:
      "One-time setup: tokens.css, Google Fonts, base.css, SmoothScrollProvider, pinned npm versions.",
    get_component:
      "Ready-to-copy files for one component (plus its children unless withComposed is false).",
    search_components:
      "Find components without code, e.g. every section with the offerings role.",
    list_styles:
      "Compare styles (palette, fonts, vibe) before forcing a styleId.",
  },
  sec3Tag: "Section 03",
  sec3Title: "The rakitek-build skill",
  sec3Intro1: "One skill for users, sourced from",
  sec3Intro2: "and downloadable from this website. Install steps are in Install MCP & Skill above.",
  skill2Tag: "Skill (Assembly)",
  skill2Desc1: "Guides AI in new client projects to pull verified styles and components from",
  skill2Desc2: ", mount a single",
  skill2Desc3: ", tailor props to match the brief, and write grounded anti-slop copy (no AI buzzwords, generic CTAs, em dashes, or fabricated proof).",
  skill2Prompt:
    'Example prompt: "Build a coffee shop landing page with rakitek-build and the editorial-roastery style."',
};
