# Fidelity Report: orchard-production-demo-page

- **Kind / Level:** `page` / `page`
- **Composes:** `templates/orchard-editorial-template`, `sections/orchard-top-header`, `sections/orchard-editorial-page-hero`, `sections/orchard-rhombus-intro`, `sections/orchard-production-ledger`, `sections/orchard-photo-drag-slider`, `sections/orchard-editorial-footer`, `ui/orchard-floating-pill-nav`
- **Reference Source:** `fnb-bakery/agrumea-farm` (`http://localhost:3041/en/produzione`)
- **Live Extract Preview:** `http://localhost:3045/preview/page/orchard-production-demo-page`

## Hasil pengukuran (`npm run fidelity`)

| Viewport | Elemen | FAIL | WARN |
| --- | ---: | ---: | ---: |
| 1920x980 | 8 | **0** | 15 |
| 1024x768 | 8 | **0** | 15 |

## Screenshot berdampingan

| Viewport | Asli | Ekstrak |
| --- | --- | --- |
| 1920x980 | ![asli 1920](original-1920.jpg) | ![ekstrak 1920](extract-1920.jpg) |
| 1024x768 | ![asli 1024](original-1024.jpg) | ![ekstrak 1024](extract-1024.jpg) |

## Beda yang disengaja (WARN)

- `fontRendered` (16x): Font berbayar (ivystyle-sans, ivymode) diganti font gratis Outfit / Italiana.
- `text` (12x): Copy putih-label (white-label): teks asli diganti teks contoh netral tanpa merek.
- `width` (2x): Lebar teks berbeda karena font pengganti (ivystyle-sans -> Outfit, ivymode -> Italiana).

## Catatan

Verifikasi 2 langkah halaman:

1. **Langkah 1 (perakitan, data asli):** `demo-data.ts` sementara berisi copy asli halaman web (judul, paragraf, tabel, nama produk). Wilayah halaman (hero, intro, setiap section, galeri, nav, footer) diukur pada `original-*.json` vs `extract-*.json`: **0 FAIL** di 1920x980 dan 1024x768. Ukuran asli diambil sebelum animasi `text-reveal` shell (DOM polos, tunggu 0,9 detik), sehingga `line-height` paragraf intro pada halaman ini dipaksa 1,3 lewat `styles.module.css` halaman (komponen `orchard-rhombus-intro` sendiri tetap memakai nilai hasil ukur sesudah reveal); elemen `header` tidak diukur karena masih tersembunyi saat itu (header sudah dibuktikan pada `orchard-editorial-demo-page`).
2. **Langkah 2 (data netral):** `demo-data.ts` diganti merek fiktif `HOLLOW Orchard`, alamat `example`, email `hello@example.com`, dan nama tempat/varietas fiktif dengan panjang karakter yang disetel. Diukur ulang dengan selector yang sama terhadap `original-*.json` (hasil di folder sementara, bukan bukti): tanpa overflow horizontal (`scrollWidth` sama dengan lebar viewport) dan tanpa teks terpotong (satu-satunya elemen ber-overflow adalah teks bantu `visuallyHidden` milik galeri, yang memang sengaja dipotong).

Karena `demo-data.ts` diganti ke data netral setelah ukur langkah 1, `npm run fidelity:all` memberi WARN "bukti lebih tua dari kode" untuk halaman ini. Itu disengaja: bukti JSON adalah bukti perakitan dengan data asli, dan JSON tidak disunting.

- Pill nav produk (`ui/orchard-floating-pill-nav`) berada di dasar viewport di luar layar pada scroll 0 (y = 980), sama seperti aslinya.
