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
const SKILL_BASE_URL = `${SITE_URL}/skills/rakitek-build`;
const SKILL_URL = `${SKILL_BASE_URL}/SKILL.md`;
const COPYWRITING_REF_URL = `${SKILL_BASE_URL}/references/copywriting.md`;

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
        code: `New-Item -ItemType Directory -Force "$HOME\\.claude\\skills\\rakitek-build\\references" | Out-Null
Invoke-WebRequest ${SKILL_URL} -OutFile "$HOME\\.claude\\skills\\rakitek-build\\SKILL.md"
Invoke-WebRequest ${COPYWRITING_REF_URL} -OutFile "$HOME\\.claude\\skills\\rakitek-build\\references\\copywriting.md"`,
      },
      {
        name: "macOS / Linux",
        code: `mkdir -p ~/.claude/skills/rakitek-build/references
curl -fsSL ${SKILL_URL} -o ~/.claude/skills/rakitek-build/SKILL.md
curl -fsSL ${COPYWRITING_REF_URL} -o ~/.claude/skills/rakitek-build/references/copywriting.md`,
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
        code: `New-Item -ItemType Directory -Force "$HOME\\.gemini\\config\\skills\\rakitek-build\\references" | Out-Null
Invoke-WebRequest ${SKILL_URL} -OutFile "$HOME\\.gemini\\config\\skills\\rakitek-build\\SKILL.md"
Invoke-WebRequest ${COPYWRITING_REF_URL} -OutFile "$HOME\\.gemini\\config\\skills\\rakitek-build\\references\\copywriting.md"`,
      },
      {
        name: "macOS / Linux",
        code: `mkdir -p ~/.gemini/config/skills/rakitek-build/references
curl -fsSL ${SKILL_URL} -o ~/.gemini/config/skills/rakitek-build/SKILL.md
curl -fsSL ${COPYWRITING_REF_URL} -o ~/.gemini/config/skills/rakitek-build/references/copywriting.md`,
      },
    ],
    check: `Customizations → Installed → MCP Servers
# rakitek → 6 tools`,
  },
};

export const MCP_TOOLS = [
  {
    name: "plan_page",
    args: '{ brief: "company profile studio arsitektur", pageType?, styleId? }',
    purpose: "Mulai di sini: brief jadi slot konten berurutan, tiap slot berisi semua section dari demo mana pun yang cocok.",
  },
  {
    name: "suggest_page_blueprint",
    args: '{ niche: "coffee-shop", styleId? }',
    purpose: "Satu halaman demo utuh yang sudah teruji; dipakai kalau brief sangat mirip demo itu.",
  },
  {
    name: "get_style",
    args: '{ id: "editorial-roastery", includeSetup? }',
    purpose: "Setup sekali per proyek: tokens.css, Google Fonts, base.css, SmoothScrollProvider, versi npm.",
  },
  {
    name: "get_component",
    args: '{ id: "collection-split-showcase", withComposed?, includeExample? }',
    purpose: "File siap salin plus komponen turunannya dalam satu jawaban; sisanya di fetchSeparately.",
  },
  {
    name: "search_components",
    args: '{ kind?, level?, role?, category?, vibe?, query? }',
    purpose: "Cari komponen tanpa kode, misalnya semua section dengan role offerings.",
  },
  {
    name: "list_styles",
    args: "none",
    purpose: "Bandingkan style (palet, font, vibe) sebelum memaksa styleId.",
  },
];
