import type { WebCopy } from "./types";

export const DOCS_ID: WebCopy["docs"] = {
  title: "Dokumentasi",
  install: {
    tag: "Mulai di sini",
    title: "Pasang MCP & Skill",
    intro: "Rakitek MCP sudah online. Tidak perlu clone repo atau build apa pun, cukup hubungkan AI kamu ke",
    note: "Server ini publik dan hanya-baca, dibatasi 60 request per menit per IP.",
    clientLabel: "Pilih AI",
    checkTitle: "Cek & coba",
    checkFilename: "Cek koneksi",
    tryPrompt: "Contoh prompt: \"Bangun landing page coffee shop pakai rakitek.\"",
    steps: {
      claude: {
        mcpTitle: "Hubungkan MCP (global)",
        mcpDesc: "Jalankan sekali di terminal. --scope user membuat rakitek aktif di semua proyek. MCP ini sudah membawa instruksi ringkas, jadi Claude langsung tahu alur kerjanya.",
        skillTitle: "Pasang skill rakitek-build (global, opsional)",
        skillDesc: "Panduan lengkap untuk Claude. Skill global ada di ~/.claude/skills dan aktif di semua proyek. Unduh ulang dengan perintah yang sama untuk memperbarui.",
        checkDesc: "Pastikan rakitek berstatus Connected, lalu mulai sesi Claude Code baru.",
      },
      antigravity: {
        mcpTitle: "Hubungkan MCP (global)",
        mcpDesc: "Buka Customizations → Installed → MCP Servers, klik Copy Config File Path, buka file itu, lalu tambahkan entri rakitek di bawah ke dalam mcpServers. Konfigurasi personal ada di ~/.gemini/config/mcp_config.json.",
        skillTitle: "Pasang skill rakitek-build (global)",
        skillDesc: "Skill global Antigravity ada di ~/.gemini/config/skills dan aktif di semua workspace. Unduh ulang dengan perintah yang sama untuk memperbarui.",
        checkDesc: "Restart server rakitek dari menu ⋮ (atau restart Antigravity), lalu pastikan 6 tool rakitek muncul.",
      },
    },
  },
  introPart1: "Panduan lengkap cara memakai komponen Rakitek secara manual, menghubungkan",
  introPart2: ", dan memakai skill",
  sec1Tag: "Bagian 01",
  sec1Title: "Cara Penggunaan Manual (Website & Salin)",
  sec1Intro1: "Setiap komponen di Rakitek memakai kontrak CSS Variables",
  sec1Intro2: "dengan CSS Modules atau Tailwind CSS. Cukup pasang satu file",
  sec1Intro3: ", lalu salin file komponen dari tab Kode.",
  steps: [
    {
      step: "Langkah 1",
      title: "Pilih Website Style",
      beforeCode: "Buka halaman Styles, salin",
      code: "tokens.css",
      afterCode: ", dan muat Google Fonts yang tertera.",
    },
    {
      step: "Langkah 2",
      title: "Salin Komponen / Section",
      beforeCode: "Pilih item dari sidebar, cek pratinjau Desktop/Tablet/Ponsel, lalu salin",
      code: "component.tsx",
      afterCode: "beserta file pendukungnya.",
    },
    {
      step: "Langkah 3",
      title: "Ubah Props & Konten",
      beforeCode: "Ganti teks, gambar, dan handler sesuai brief klien tanpa merusak sistem token",
      code: "--rk-*",
      afterCode: ".",
    },
  ],
  sec2Tag: "Bagian 02",
  sec2TitlePrefix: "Dokumentasi MCP",
  sec2Intro1: "berjalan online lewat Streamable HTTP dan membaca registry yang sama dengan website ini:",
  sec2Intro2: "Setiap kali registry diperbarui dengan",
  sec2Intro3: "lalu di-deploy, semua pengguna langsung mendapat komponen terbaru.",
  tableTool: "Nama Tool",
  tableArgs: "Argumen",
  tablePurpose: "Fungsi",
  mcpToolPurposes: {
    plan_page: "Mulai di sini: brief jadi slot konten berurutan, tiap slot menawarkan semua section dari demo mana pun yang cocok.",
    suggest_page_blueprint:
      "Satu halaman demo utuh yang sudah teruji; pakai hanya kalau brief sangat mirip demo itu.",
    get_style:
      "Setup sekali per proyek: tokens.css, Google Fonts, base.css, SmoothScrollProvider, versi npm teruji.",
    get_component:
      "File siap salin untuk satu komponen (plus turunannya kecuali withComposed false).",
    search_components:
      "Cari komponen tanpa kode, misalnya semua section dengan role offerings.",
    list_styles:
      "Bandingkan style (palet, font, vibe) sebelum memaksa styleId.",
  },
  sec3Tag: "Bagian 03",
  sec3Title: "Skill rakitek-build",
  sec3Intro1: "Satu skill untuk pengguna, sumbernya di",
  sec3Intro2: "dan bisa diunduh dari website. Cara pasangnya ada di bagian Pasang MCP & Skill di atas.",
  skill2Tag: "Skill (Perakitan)",
  skill2Desc1: "Memandu AI di proyek klien baru agar mengambil style dan komponen teruji dari",
  skill2Desc2: ", memasang",
  skill2Desc3: "tunggal, dan mengedit props sesuai brief.",
  skill2Prompt:
    'Contoh prompt: "Bangun landing page coffee shop pakai rakitek-build dan style editorial-roastery."',
};
