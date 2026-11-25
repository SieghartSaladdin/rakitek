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

export const MCP_CONFIG_SNIPPET = `{
  "mcpServers": {
    "rakitek-mcp": {
      "command": "node",
      "args": ["<RAKITEK_ROOT>/packages/mcp/dist/index.js"]
    }
  }
}`;

export const PLUGIN_INSTALL_SNIPPET = `# 1. Build rakitek first
cd <RAKITEK_ROOT>
npm install
npm run build

# 2. Replace <RAKITEK_ROOT> in packages/plugin/mcp_config.json with your rakitek path

# 3. Copy plugin bundle (MCP + rakitek-build skill + rules) to global Antigravity config
Copy-Item -Recurse -Force "packages\\plugin" "$env:USERPROFILE\\.gemini\\config\\plugins\\rakitek"`;

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
