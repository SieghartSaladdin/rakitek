# Rakitek Antigravity Plugin

Bundle ini berisi `rakitek-mcp` + 2 Skills (`rakitek-extract` dan `rakitek-build`) + `rules/AGENTS.md`.

## Cara Memasang Secara Global (Kapan Saja Siap)
1. Pastikan `rakitek` sudah di-build terlebih dahulu:
   ```powershell
   cd C:\Users\Fafnir\Documents\rea-web\rakitek
   npm run build
   ```
2. Salin (atau symlink) folder ini ke direktori plugin global Antigravity:
   ```powershell
   Copy-Item -Recurse -Force "C:\Users\Fafnir\Documents\rea-web\rakitek\packages\plugin" "$env:USERPROFILE\.gemini\config\plugins\rakitek"
   ```
3. Restart/reload Antigravity untuk mengaktifkan `rakitek-mcp`, `rakitek-extract`, dan `rakitek-build` di semua workspace.
