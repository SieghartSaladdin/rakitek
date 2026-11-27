# Fidelity Report: `bookclub-faq-accordion`

- **Kind / Level:** `section` (lihat `meta.json`)
- **Sumber:** `ecommerce-d2c/aardvark-book-club/src/components/sections/FaqSection.tsx + FaqBackgroundSvg.tsx` (`http://localhost:3031/`)
- **Preview ekstrak:** `http://localhost:3035/preview/section/bookclub-faq-accordion` (showcase dev, port blok N=3)
- **Pembanding:** `npm run fidelity -- fidelity/bookclub-faq-accordion/original-<lebar>.json fidelity/bookclub-faq-accordion/extract-<lebar>.json`

## Hasil ukur

| Viewport | Elemen | FAIL | WARN |
| --- | ---: | ---: | ---: |
| `1920x980` | 4 | **0** | 8 |
| `1024x768` | 4 | **0** | 8 |

## Screenshot berdampingan

| Viewport | Asli | Ekstrak |
| --- | --- | --- |
| `1920x980` | ![asli 1920](./original-1920.jpg) | ![ekstrak 1920](./extract-1920.jpg) |
| `1024x768` | ![asli 1024](./original-1024.jpg) | ![ekstrak 1024](./extract-1024.jpg) |

## Beda yang disengaja (WARN)

- Properti ber-WARN: `fontRendered`, `fontWeight`, `width`, `x`.
- Font berbayar/webfont asli diganti font gratis: Degular -> Barlow (body), Champ -> Rubik (display), Hello Organichand -> Shadows Into Light (tulisan tangan). Ini sumber seluruh WARN `fontRendered` dan sebagian WARN `x`/`width`/`y` (lebar huruf beda).
- `x`/`y`/`width`: posisi asli diukur pada halaman utuh (ada header/layout situs), preview hanya komponen; lebar huruf font pengganti menggeser lebar elemen inline.
- `fontWeight`/`letterSpacing`: pembulatan atau nilai bawaan font pengganti.

## Catatan teknis
- Pengukuran headless (Brave) dengan `scripts/fidelity/measure.js` apa adanya; scrollbar disembunyikan otomatis. Tidak ada perubahan toleransi atau `compare-core.ts`.
