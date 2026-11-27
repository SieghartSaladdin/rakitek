# Fidelity Report: `bookclub-benefits-stage`

- **Kind / Level:** `section` (lihat `meta.json`)
- **Sumber:** `ecommerce-d2c/aardvark-book-club/src/components/sections/BenefitsSection.tsx + BenefitsBackgroundSvg.tsx` (`http://localhost:3031/`)
- **Preview ekstrak:** `http://localhost:3035/preview/section/bookclub-benefits-stage` (showcase dev, port blok N=3)
- **Pembanding:** `npm run fidelity -- fidelity/bookclub-benefits-stage/original-<lebar>.json fidelity/bookclub-benefits-stage/extract-<lebar>.json`

## Hasil ukur

| Viewport | Elemen | FAIL | WARN |
| --- | ---: | ---: | ---: |
| `1920x980` | 3 | **0** | 7 |
| `1024x768` | 3 | **0** | 7 |

## Screenshot berdampingan

| Viewport | Asli | Ekstrak |
| --- | --- | --- |
| `1920x980` | ![asli 1920](./original-1920.jpg) | ![ekstrak 1920](./extract-1920.jpg) |
| `1024x768` | ![asli 1024](./original-1024.jpg) | ![ekstrak 1024](./extract-1024.jpg) |

## Beda yang disengaja (WARN)

- Properti ber-WARN: `fontRendered`, `letterSpacing`, `text`, `width`.
- Font berbayar/webfont asli diganti font gratis: Degular -> Barlow (body), Champ -> Rubik (display), Hello Organichand -> Shadows Into Light (tulisan tangan). Ini sumber seluruh WARN `fontRendered` dan sebagian WARN `x`/`width`/`y` (lebar huruf beda).
- `text`: salinan contoh netral tanpa merek menggantikan teks asli; gambar sampul/foto privat diganti placeholder bertoken.
- `x`/`y`/`width`: posisi asli diukur pada halaman utuh (ada header/layout situs), preview hanya komponen; lebar huruf font pengganti menggeser lebar elemen inline.
- `fontWeight`/`letterSpacing`: pembulatan atau nilai bawaan font pengganti.

## Catatan teknis
- Pengukuran headless (Brave) dengan `scripts/fidelity/measure.js` apa adanya; scrollbar disembunyikan otomatis. Tidak ada perubahan toleransi atau `compare-core.ts`.
