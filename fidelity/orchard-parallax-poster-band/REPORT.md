# Fidelity Report: orchard-parallax-poster-band

- **Kind / Level:** `section` / `organism`
- **Composes:** `ui/orchard-format-badge`, `ui/orchard-jar-slide-card`
- **Reference Source:** `fnb-bakery/agrumea-farm` (`http://localhost:3041/en/dispensa`)
- **Live Extract Preview:** `http://localhost:3045/preview/section/orchard-parallax-poster-band`

## Hasil pengukuran (`npm run fidelity`)

| Viewport | Elemen | FAIL | WARN |
| --- | ---: | ---: | ---: |
| 1920x980 | 6 | **0** | 13 |
| 1024x768 | 6 | **0** | 13 |

## Screenshot berdampingan

| Viewport | Asli | Ekstrak |
| --- | --- | --- |
| 1920x980 | ![asli 1920](original-1920.jpg) | ![ekstrak 1920](extract-1920.jpg) |
| 1024x768 | ![asli 1024](original-1024.jpg) | ![ekstrak 1024](extract-1024.jpg) |

## Beda yang disengaja (WARN)

- `fontRendered` (12x): Font berbayar (ivystyle-sans, ivymode) diganti font gratis Outfit / Italiana.
- `text` (10x): Copy putih-label (white-label): teks asli diganti teks contoh netral tanpa merek.
- `letterSpacing` (4x): Letter-spacing token display/body berbeda dari nilai browser asli.
