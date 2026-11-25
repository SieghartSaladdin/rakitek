export const USAGE_LAYOUT_SNIPPET = `// 1. Import tokens.css (copied from /styles) inside app/globals.css
@import "tailwindcss";
@import "./tokens.css";

// 2. Apply the style attribute on your root container in app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-rk-style="editorial-roastery">
      <body>{children}</body>
    </html>
  );
}`;

export const USAGE_COMPONENT_SNIPPET = `import { InteractiveQuiz } from "@/components/interactive-quiz";

export default function Page() {
  return (
    <InteractiveQuiz
      eyebrow="Package Finder"
      questions={yourQuestions}
      results={yourResults}
    />
  );
}`;

export const SITE_URL = "https://rakitek.qifor.my.id";
export const MCP_URL = `${SITE_URL}/mcp`;
const SKILL_URL = `${SITE_URL}/skills/rakitek-build/SKILL.md`;

export type InstallClient = "claude" | "antigravity";

/** Per client: global MCP install, global skill install (Windows + macOS/Linux), and a check. */
export const INSTALL_SNIPPETS: Record<
  InstallClient,
  { mcp: { name: string; code: string }[]; skill: { name: string; code: string }[]; check: string }
> = {
  claude: {
    mcp: [
      {
        name: "Terminal",
        code: `claude mcp add --transport http --scope user rakitek ${MCP_URL}`,
      },
    ],
    skill: [
      {
        name: "Windows (PowerShell)",
        code: `New-Item -ItemType Directory -Force "$HOME\\.claude\\skills\\rakitek-build" | Out-Null
Invoke-WebRequest ${SKILL_URL} -OutFile "$HOME\\.claude\\skills\\rakitek-build\\SKILL.md"`,
      },
      {
        name: "macOS / Linux",
        code: `mkdir -p ~/.claude/skills/rakitek-build
curl -fsSL ${SKILL_URL} -o ~/.claude/skills/rakitek-build/SKILL.md`,
      },
    ],
    check: `claude mcp list
# rakitek: ${MCP_URL} (HTTP) - ✓ Connected`,
  },
  antigravity: {
    mcp: [
      {
        name: "mcp_config.json",
        code: `{
  "mcpServers": {
    "rakitek": {
      "serverUrl": "${MCP_URL}"
    }
  }
}`,
      },
    ],
    skill: [
      {
        name: "Windows (PowerShell)",
        code: `New-Item -ItemType Directory -Force "$HOME\\.gemini\\config\\skills\\rakitek-build" | Out-Null
Invoke-WebRequest ${SKILL_URL} -OutFile "$HOME\\.gemini\\config\\skills\\rakitek-build\\SKILL.md"`,
      },
      {
        name: "macOS / Linux",
        code: `mkdir -p ~/.gemini/config/skills/rakitek-build
curl -fsSL ${SKILL_URL} -o ~/.gemini/config/skills/rakitek-build/SKILL.md`,
      },
    ],
    check: `Customizations → Installed → MCP Servers
# rakitek → 5 tools`,
  },
};

export const MCP_TOOLS = [
  {
    name: "suggest_page_blueprint",
    args: '{ niche: "coffee-shop", styleId? }',
    purpose: "Mulai di sini: pilih style + halaman teruji, susunan section berurutan, dan langkah berikutnya.",
  },
  {
    name: "get_style",
    args: '{ id: "editorial-roastery", includeSetup? }',
    purpose: "Setup sekali per proyek: tokens.css, Google Fonts, base.css, SmoothScrollProvider, versi npm.",
  },
  {
    name: "get_component",
    args: '{ id: "storefront-demo-page", withComposed?, includeExample? }',
    purpose: "File siap salin plus komponen turunannya dalam satu jawaban; sisanya di fetchSeparately.",
  },
  {
    name: "search_components",
    args: '{ kind?, level?, category?, vibe?, query? }',
    purpose: "Cari komponen tanpa kode, hanya kalau blueprint belum punya slot yang cocok.",
  },
  {
    name: "list_styles",
    args: "none",
    purpose: "Bandingkan style (palet, font, vibe) bila blueprint memberi catatan default.",
  },
];
