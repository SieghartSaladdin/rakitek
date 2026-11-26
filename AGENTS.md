# Rakitek — Workflow & Architecture Guide

`rakitek` = 1 Registry Tunggal (`registry/`) yang otomatis menggerakkan Website Showcase (`apps/web`), MCP Server (`packages/mcp`), dan Plugin/Skills (`packages/plugin`).

Dua sisi yang dipisah:
- **Internal (repo ini, untuk pengelola):** skill `rakitek-extract` ada di `.agent/skills/rakitek-extract/SKILL.md` dan **tidak** ikut dibagikan. Muat skill ini setiap kali diminta mengekstrak proyek REA ke rakitek.
- **Pengguna:** MCP online `https://rakitek.qifor.my.id/mcp` (route `apps/web/src/app/mcp`, server di `packages/mcp/src/server.ts` beserta instruksi ringkasnya) + skill `packages/plugin/skills/rakitek-build/SKILL.md` (disajikan di `/skills/rakitek-build/SKILL.md`). Jangan taruh aturan ekstrak, lint, atau `npm run verify` di sana, dan jangan tulis path lokal laptop di file pengguna. Kalau alur pemakaian berubah, perbarui `RAKITEK_INSTRUCTIONS`, `SKILL.md`, dan tutorial di halaman Docs bersamaan.
## Alur Kerja
1. **Extract & Compose:** Ekstrak proyek REA ke `registry/styles|ui|sections/<id>/` secara high-fidelity & styling-agnostic (`styles.module.css`, Tailwind, atau hybrid + engine animasi asli seperti GSAP/Swiper), tetap terikat ke token `--rk-*`, props bersih, dan tanpa hardcode brand. Template layout (`registry/templates/<id>/`) dan demo page (`registry/pages/<id>/`) merangkai komponen yang sudah ada lewat import kanonis `@registry/<folder>/<id>/component`.
   - Section wajib punya `roles` di `meta.json` dan props yang membuatnya bisa dipakai di luar web aslinya (`id`, teks lewat props, flag sembunyikan bagian khusus, `formatPrice`, link `#` tidak diblokir, `preview.tsx` mengisi semua props). Checklist lengkap ada di skill `rakitek-extract` bagian 2.
   - Setiap `meta.json` **wajib** mencantumkan `level: "atom" | "molecule" | "organism" | "template" | "page"` dan `composes` (format tunggal `<folder>/<id>`, mis. `"sections/editorial-storefront-hero"`, hanya diisi jika benar-benar di-import lewat `@registry/<folder>/<id>/component`).
   - File helper milik komponen sendiri disimpan di folder komponen yang sama dan di-import secara lokal via `./` (dilarang `../`). Sebuah komponen hanya boleh meng-import komponen lain dengan `level` yang sama atau lebih rendah (dijaga oleh `rakitek/imports-resolvable`, `rakitek/atomic-hierarchy`, dan `rakitek/composes-sync`).
   - Untuk `pages/*`: verifikasi 2 langkah wajib dilakukan: (1) isi data asli sementara lalu ukur `0 FAIL` terhadap halaman web asli utuh sebagai bukti perakitan, (2) ganti ke data contoh netral tanpa nama brand lalu verifikasi visual bebas tumpang tindih, terpotong, dan overflow.
2. **Ukur & bukti:** Ikuti [docs/workflow-ekstrak-1to1.md](docs/workflow-ekstrak-1to1.md). Bukti wajib ada di `fidelity/<id>/` (dijaga lint `rakitek/fidelity-evidence`).
3. **Gerbang:** Jalankan `npm run verify` sampai exit 0. Ini satu-satunya bukti "selesai".

## Gerbang Verifikasi Mandiri (`npm run verify`)
`npm run verify` = sync → lint → tes lint sintetis → tes MCP → `fidelity:all` (bandingkan ulang **semua** pasangan JSON di `fidelity/`) → build MCP + web. Gagal kalau ada satu FAIL saja.

Aturan anti-curang (wajib):
- **Dilarang** melonggarkan toleransi, mengubah `scripts/fidelity/compare-core.ts`, atau menyunting file JSON hasil ukur supaya lolos. Kalau alat ukur memang perlu diubah, ukur ulang **semua** komponen dan sebutkan alasannya di laporan.
- **Dilarang** menulis "0 FAIL" atau "lolos" tanpa menjalankan perintahnya saat itu juga. Angka diambil dari output perintah, bukan dari ingatan atau laporan sebelumnya.
- Mengubah file komponen = bukti lamanya kadaluarsa. `fidelity:all` menandai "bukti lebih tua dari kode"; ukur ulang komponen itu.
- Sebelum melapor, lakukan review diri seperti reviewer: cek ulang setiap klaim dengan perintah, dan hapus kode/file yang tidak lagi dipakai (kecuali `fidelity/`).

## Format Laporan ke User (maks 10 baris)
1. Tempel 15 baris terakhir output asli `npm run verify` (bukan ringkasan).
2. Komponen yang diubah + alasan singkat.
3. Beda yang disengaja (WARN) yang tersisa + alasannya.
4. Path screenshot berdampingan (`fidelity/<id>/original-*.jpg` vs `extract-*.jpg`) dan URL halaman untuk dicek langsung.

User cukup membaca output `verify`, melihat screenshot, dan membuka web. Kalau user masih harus mencari beda sendiri, pekerjaan belum selesai.

## Folder Sumber Selesai
Setelah ekstrak satu proyek REA selesai dan sudah di-commit dengan `npm run verify` lolos, ganti nama folder sumbernya menjadi `<nama>(done)` (mis. `coffee-shop/escape-cafe-nextjs(done)`) supaya jelas mana yang belum diekstrak. `sourceRef` di `meta.json` tetap ditulis tanpa `(done)`. Saat mengukur ulang web asli, jalankan dari folder `(done)` itu.

## Skala
Kalau `npm run sync` mencetak `[rakitek skala] ...`, kerjakan langkah yang disebut di [docs/rencana-skala.md](docs/rencana-skala.md) sebelum menambah komponen lagi. Setiap tool MCP baru wajib membatasi ukuran jawabannya (limit/paging).

## Aturan Evolusi Lint
- Setiap kali memperbaiki bug yang berulang atau monoton, tambahkan aturan cek deterministik baru (di `scripts/lint-rakitek.ts` atau modul `scripts/lint-*.ts`) beserta kasus tes sintetis di `scripts/test-lint-rules.ts`.

## Perintah
- `npm run verify` — Gerbang lengkap (wajib exit 0 sebelum melapor)
- `npm run sync` — Validasi schema & generate index Website + MCP
- `npm run lint` — Aturan deterministik (token `--rk-*`, WCAG AA, fokus, antislop, ukuran file, import, hierarki atomic, bukti fidelity)
- `npm test` — sync + lint + tes lint sintetis + tes MCP
- `npm run fidelity:all` — Bandingkan ulang semua pasangan di `fidelity/` (`--verbose` untuk semua baris)
- `npm run fidelity -- <original.json> <extract.json>` — Bandingkan satu pasangan
- `npm run fidelity:sink` / `npm run fidelity:capture` — Simpan hasil ukur dari browser / ukur otomatis via Chrome headless
- `npm run dev` / `npm run build` — Jalankan showcase lokal / build MCP + web
