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
      "args": ["C:/Users/Fafnir/Documents/rea-web/rakitek/packages/mcp/dist/index.js"],
      "env": {
        "RAKITEK_ROOT": "C:/Users/Fafnir/Documents/rea-web/rakitek"
      }
    }
  }
}`;

export const PLUGIN_INSTALL_SNIPPET = `# 1. Build rakitek first
cd C:\\Users\\Fafnir\\Documents\\rea-web\\rakitek
npm run build

# 2. Copy plugin bundle (MCP + Skills + Rules) to global Antigravity config
Copy-Item -Recurse -Force "packages\\plugin" "$env:USERPROFILE\\.gemini\\config\\plugins\\rakitek"`;

export const MCP_TOOLS = [
  {
    name: "list_styles",
    args: "none",
    purpose: "Menampilkan semua Website Style presets (palet, font pairing, vibe, tags).",
  },
  {
    name: "get_style",
    args: '{ id: "editorial-roastery" }',
    purpose: "Mengambil isi lengkap tokens.css, Google Fonts URL, dan catatan pasang.",
  },
  {
    name: "search_components",
    args: '{ kind?: "ui" | "section", category?, vibe?, query? }',
    purpose: "Mencari variasi UI Component atau Section sesuai kategori dan gaya.",
  },
  {
    name: "get_component",
    args: '{ id: "interactive-quiz" }',
    purpose: "Mengambil source code TSX bersih, daftar dependencies, dan contoh pemakaian.",
  },
  {
    name: "suggest_page_blueprint",
    args: '{ niche: "coffee-shop", styleId? }',
    purpose: "Merekomendasikan kombinasi 1 style + sections + UI primitives untuk niche target.",
  },
];
