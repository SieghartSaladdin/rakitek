# Rakitek Plugin (untuk pengguna)

Bundle ini berisi `rakitek-mcp` + skill `rakitek-build` + `rules/AGENTS.md`. Isinya hanya untuk **merakit** website dari komponen Rakitek. Skill ekstrak (`rakitek-extract`) adalah alat internal pengelola dan tinggal di repo (`.agent/skills/`), tidak ikut di bundle ini.

## Cara Memasang
1. Build rakitek (MCP membaca katalog dari `registry/.generated/catalog.json` di repo yang sama):
   ```powershell
   cd <RAKITEK_ROOT>
   npm install
   npm run build
   ```
2. Di `mcp_config.json`, ganti `<RAKITEK_ROOT>` dengan path folder rakitek di komputer kamu (pakai `/`, mis. `D:/kode/rakitek`).
3. Salin folder ini ke direktori plugin global Antigravity:
   ```powershell
   Copy-Item -Recurse -Force "<RAKITEK_ROOT>\packages\plugin" "$env:USERPROFILE\.gemini\config\plugins\rakitek"
   ```
4. Restart Antigravity. Coba prompt: "Bangun landing page coffee shop pakai rakitek-build."

Setiap kali registry diperbarui, jalankan `npm run sync` dan `npm run build` lagi di folder rakitek.
