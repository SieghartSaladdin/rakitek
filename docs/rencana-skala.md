# Rencana Skala Rakitek

Registry adalah data (satu folder per komponen), lalu `npm run sync` membuat indeksnya. Strukturnya aman sampai ratusan komponen. Dokumen ini mencatat apa yang sudah disiapkan untuk skala besar, dan apa yang harus dikerjakan saat registry tumbuh.

`npm run sync` memeriksa ambang di bawah setiap kali jalan (`scripts/scale-check.ts`). Kalau ada yang terlewati, muncul baris `[rakitek skala] ...` yang menyebut langkah mana yang harus dikerjakan. Pengingat ini tidak menggagalkan build.

## Sudah dikerjakan (2026-11-27)

- **Jawaban MCP dibatasi.** `plan_page` hanya menampilkan 5 kandidat teratas per slot, sisanya disebut di `moreCandidates` dan bisa dibuka lewat `search_components({ role })`. `search_components` memakai halaman (`limit` default 20, maksimal 50, lalu `offset` / `nextOffset`). `get_component` dibatasi 36 ribu karakter per jawaban, kelebihannya masuk `fetchSeparately`.
- **Katalog di-cache di memori MCP.** `catalog.json` dan `setup.json` diparse sekali, lalu dibaca ulang hanya kalau file-nya berubah (mtime).
- **Preview di web dimuat per halaman** (`preview-map.ts` memakai dynamic import), dan `sources.json` hanya dipakai di server, tidak ikut ke browser.

Ukuran saat dokumen ini ditulis: 58 komponen, `fidelity/` 27 MB, `catalog.json` 76 KB, `sources.json` 755 KB.

## Dikerjakan saat ambang terlewati

| Langkah | Ambang | Gejala | Rencana |
|---|---|---|---|
| A. Foto bukti fidelity | `fidelity/` ≥ 300 MB | Clone repo lambat, ukuran repo terus naik karena foto ikut sejarah git. | Pindahkan `fidelity/**/*.jpg` ke Git LFS (`git lfs track "fidelity/**/*.jpg"`) atau ke object storage. JSON hasil ukur tetap di git karena dibandingkan oleh `fidelity:all`. Pastikan `rakitek/fidelity-evidence` tetap bisa memeriksa keberadaan foto. |
| B. Build halaman preview | ≥ 300 komponen, atau build web > 10 menit | `next build` merender semua `/preview/*` dan `/item/*` di awal. | Hapus `generateStaticParams` untuk halaman preview/item (atau batasi ke komponen unggulan) dan biarkan dirender saat pertama dibuka, lalu di-cache (ISR). |
| C. Kode sumber untuk halaman "lihat kode" | `sources.json` ≥ 10 MB | Bundle server dan memori naik, build lebih lambat. | Jangan import satu JSON besar; baca file komponen dari `registry/` saat halaman item dibuka (sama seperti `readRegistryFile` di MCP). |
| D. Indeks katalog | `catalog.json` ≥ 5 MB (kira-kira ribuan komponen) | Startup MCP dan sync melambat. | Pecah indeks per jenis (`ui`, `sections`, ...) atau pindah ke SQLite dengan index pada `role`, `style`, `category`. Tool MCP tidak perlu berubah dari sisi pengguna. |

## Jaga sejak sekarang

- Setiap tool MCP baru wajib punya batas jawaban (limit atau ringkasan + paging). Jangan pernah mengembalikan seluruh katalog dalam satu jawaban.
- Data yang diulang di setiap panggilan (katalog, setup) dibaca lewat `readJsonCached` di `packages/mcp/src/loader.ts`.
- Kalau mengubah ambang di `scripts/scale-check.ts`, perbarui tabel di atas.
