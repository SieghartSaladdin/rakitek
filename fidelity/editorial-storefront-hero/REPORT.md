# Fidelity Report: editorial-storefront-hero

Sumber: `coffee-shop/escape-cafe-nextjs/src/components/HomeHero.tsx` (localhost:3001)
Ekstrak: `registry/sections/editorial-storefront-hero` (localhost:3005/preview/section/editorial-storefront-hero)
Keadaan: scroll paling atas, 3,5 detik setelah load (animasi masuk selesai).

Catatan pengukuran: di web asli, `.section` dibatasi `100vw - 90px` untuk memberi ruang rail navbar kanan. Itu aturan layout halaman, bukan aturan hero, jadi saat mengukur lebar section asli disamakan menjadi 100% (`#hero{width:100%}`).

## Hasil `npm run fidelity`

- 1920x980: 20 elemen, **0 FAIL**, 14 WARN. Tinggi hero 2120.3px, sama persis dengan aslinya.
- 1024x768: 20 elemen, **1 FAIL**, 28 WARN. Tinggi hero 1449.2px, sama persis dengan aslinya.

Satu-satunya FAIL: blok mood di 1024 lebih sempit 7px (262.7 vs 255.3, selisih 2,8%). Blok mood memakai `width: 30vw` yang ikut menyusut mengikuti ruang minimum kartu produk di sebelahnya. Ruang minimum itu bergantung pada lebar huruf font, dan Barlow Condensed tidak sama persis dengan Garaje. Ini hanya bisa hilang dengan font asli (berbayar).

## Screenshot berdampingan

| | Asli | Ekstrak |
| --- | --- | --- |
| 1920 atas | ![](original-1920-top.jpg) | ![](extract-1920-top.jpg) |
| 1920 bawah | ![](original-1920-bottom.jpg) | ![](extract-1920-bottom.jpg) |
| 1024 atas | ![](original-1024-top.jpg) | ![](extract-1024-top.jpg) |

## Beda yang disengaja (WARN)

- **Font display**: Molitor (berbayar) diganti **Oswald**, font gratis yang lebarnya paling mendekati (CANTALOUPE 97 vs 96.1px). Bentuk hurufnya tetap berbeda karena Molitor bergaya art-deco.
- **Font label sempit** (tabel spesifikasi): Garaje diganti Barlow Condensed lewat token baru `--rk-font-narrow`.
- **Foto latar**: foto gunung milik brand diganti foto Unsplash (gunung malam) supaya tidak memakai aset brand. Komposisinya beda, tapi gelapnya mirip sehingga teks putih tetap terbaca.
- **Posisi X tombol Shop Now**: dihitung dari lebar hero (rata dengan kolom 9, sejajar deskripsi). Di aslinya dihitung dari `100vw - 90px`.
- **Hitam tombol**: `#000` asli → token `--rk-fg` `#151515`.

## Yang diperbaiki dari versi Gemini

- Ukuran judul memakai rumus asli `min(17.36vw, 31.48vh)` (sebelumnya `min(13.5vw, 22vh)`), jadi tinggi hero sama.
- Struktur kartu produk, tabel spesifikasi (grid 70px + auto), ticker panah, dan ikon mug dibuat persis seperti aslinya.
- Animasi asli dikembalikan: huruf judul masuk acak dari kiri/kanan/atas/bawah, foto mengecil dari 1.2 dan parallax, tombol di-pin lalu mengecil dari 1.3, deskripsi muncul saat di-scroll.
- Gemini menambahkan "(+1)" ke judul produk saat diklik. Ini tidak ada di aslinya, jadi diganti callback `onProductClick`.
- **Re-verifikasi 25 Nov (`letter-spacing: var(--rk-display-tracking)` pada `.desc`):** Menambahkan `-0.02em` pada `.desc` agar metrik font substitusi `Oswald` tidak menambah 1 baris ekstra saat hero dipasang pada lebar `1830px` (`calc(100vw - 90px)` di dalam template). Pengukuran ulang standalone mengonfirmasi `wrapper.height` (`2120.3px` @ 1920, `1449.2px` @ 1024) dan `desc.height` (`104px` @ 1920, `73.9px` @ 1024) tetap identik `0.0px` dengan aslinya (selisih lebar `1905` vs `1910` pada capture standalone murni berasal dari lebar scrollbar Chrome Windows `15px` vs `10px`).

## Pembaruan 2026-11-27: ukur ulang ternormalisasi

`original-*.json` dan `extract-*.json` diukur ulang dengan `scripts/fidelity-capture.ts` (scrollbar disembunyikan di kedua sisi, lebar penuh 1920/1024px). Tanpa scrollbar muncul 6 FAIL di 1024: `desc` 3 baris vs 4 (55.5 vs 73.9, ikut `wrapper`/`media` 1430.7 vs 1449.2), dan `mood.width` 257.7 vs 266.5 (ikut `products`/`ticker` 660.8 vs 652).

Perbaikan CSS (kompensasi font pengganti per elemen):

- `.desc`: `letter-spacing` dari `var(--rk-display-tracking)` (-0.02em) menjadi `-0.01em`. Dengan -0.02em baris pertama Oswald ("... with each") 15.74em, muat di kolom 293px (15.86em) padahal di Molitor tidak muat. Dengan -0.01em pemutusan barisnya sama persis dengan aslinya di keempat lebar yang dicek: 4 baris di 1024 (kolom 293px) dan di template 1024 (kolom 263px), 3 baris di 1920 (kolom 592px) dan di template `calc(100vw - 90px)` 1920 (kolom 562px, baris pertama 557px). Jadi catatan 25 Nov tentang muat di template tetap berlaku dengan nilai baru ini.
- `.spec`: `letter-spacing: -0.048em`. Tabel spesifikasi Barlow Condensed 917px vs Garaje 813px untuk 171 glyph yang sama pada 12.8px. Lebar max-content kartu produk menentukan seberapa jauh `mood` (30vw) menyusut, jadi ini yang mengembalikan `mood` ke 266.5px seperti aslinya. FAIL `mood.width` di catatan awal ("hanya bisa hilang dengan font asli") kini tertutup.
- `.moodHeading`: `letter-spacing: 0.026em`. Oswald 830px vs Molitor 878px untuk 34 glyph pada 54.4px (lebih sempit). Tanpa ini, setelah `mood` kembali 266.5px judulnya jadi 3 baris (81.6 vs 108.8).

Hasil `npm run fidelity` (sebelum -> sesudah): 1024x768 6 FAIL, 44 WARN -> **0 FAIL**, 20 WARN; 1920x980 0 FAIL, 15 WARN -> **0 FAIL**, 18 WARN. Bukti ekstrak diambil dari dev server; perlu capture ulang dari build produksi.
