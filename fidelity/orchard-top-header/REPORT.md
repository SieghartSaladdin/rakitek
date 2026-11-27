# Fidelity Report: orchard-top-header

- **Kind / Level:** `section` / `organism`
- **Composes:** `ui/orchard-rolling-toggle`
- **Reference Source:** `fnb-bakery/agrumea-farm` (`http://localhost:3041/en/dispensa`)
- **Live Extract Preview:** `http://localhost:3045/preview/section/orchard-top-header`

## Hasil pengukuran (`npm run fidelity`)

| Viewport | Elemen | FAIL | WARN |
| --- | ---: | ---: | ---: |
| 1920x980 | 8 | **0** | 11 |
| 1024x768 | 8 | **0** | 11 |
| 375x812 | 8 | **0** | 11 |

## Screenshot berdampingan

| Viewport | Asli | Ekstrak |
| --- | --- | --- |
| 1920x980 | ![asli 1920](original-1920.jpg) | ![ekstrak 1920](extract-1920.jpg) |
| 1024x768 | ![asli 1024](original-1024.jpg) | ![ekstrak 1024](extract-1024.jpg) |
| 375x812 | ![asli 375](original-375.jpg) | ![ekstrak 375](extract-375.jpg) |

## Beda yang disengaja (WARN)

- `fontRendered` (24x): Font berbayar (ivystyle-sans, ivymode) diganti font gratis Outfit / Italiana.
- `text` (9x): Copy putih-label (white-label): teks asli diganti teks contoh netral tanpa merek.
