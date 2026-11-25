# Workflow Ekstrak 1:1 (Wajib untuk Semua Agent)

Tujuan: setiap komponen yang diekstrak ke `registry/` tampil **sama persis** dengan web aslinya. Pembuktiannya juga dilakukan sendiri oleh agent, bukan oleh user. Agent harus mengukur, membandingkan, dan menyertakan screenshot berdampingan. User cukup melihat bukti akhirnya.

Prinsipnya: **yang jadi patokan adalah tampilan di browser, bukan isi kode sumber.** Kode sumber bisa menyesatkan. Contohnya, escape-cafe menulis `font-family: "TWK Lausanne"`, tapi font itu tidak pernah dimuat, jadi yang benar-benar tampil adalah Arial.

---

## 0. Audit Atomic & Persiapan

Sebelum menulis kode komponen, lakukan **Audit Atomic** pada proyek REA sumber (`package.json`, stylesheet utama, `page.tsx`, dan seluruh folder komponen) untuk menyusun peta ekstraksi:

1. **Klasifikasikan setiap target ke layer Atomic:**
   - **Website Style** (`registry/styles/<style-id>/`): palet warna, font pair (patokan akhir tetap `fontRendered` dari browser), radius, easing, dan vibe.
   - **Atoms** (`registry/ui/<id>/`, `level: "atom"`): elemen dasar tunggal yang tidak bisa dipecah lagi (tombol, badge, ticker, kontrol ikon).
   - **Molecules** (`registry/ui/<id>/`, `level: "molecule"`): unit kecil gabungan beberapa atom dengan satu fungsi spesifik (input + tombol submit, kartu produk, kontrol slider, search bar).
   - **Organisms** (`registry/sections/<id>/`, atau `registry/ui/<id>/` untuk drawer/modal, `level: "organism"`): blok fungsional lengkap atau section halaman (navbar, hero, quiz, showcase, FAQ, footer).
   - **Template** (`registry/templates/<id>/`, `level: "template"`, opsional): hanya dibuat jika web asli memiliki aturan layout halaman (mis. right-rail `calc(100% - 90px)`, sidebar shell, atau grid global) yang tidak boleh ditaruh di section individual.
   - **Page** (`registry/pages/<id>/`, `level: "page"`, opsional): halaman demo netral yang merangkai template + organisme dengan verifikasi 2 langkah (uji assembly 0 FAIL dengan copy asli terlebih dulu, lalu ganti ke data netral dan cek visual bebas overlap/clipping/overflow).
2. **Tentukan `composes` tanpa merusak 1:1:**
   - Hanya isi `composes: ["<folder>/<id>", ...]` jika komponen benar-benar meng-import komponen registry lain lewat `@registry/<folder>/<id>/component`.
   - Aturan hierarki: sebuah komponen hanya boleh meng-import komponen lain dengan `level` yang **sama atau lebih rendah** (`atom <= molecule <= organism <= template <= page`).
   - Jangan memaksa section meng-import atom bersama jika di web aslinya elemen tersebut punya perilaku atau gaya khusus (mis. pinned, blend-mode, ukuran khusus) yang berisiko merusak status `0 FAIL`.
   - File helper internal milik satu komponen sendiri wajib disimpan di folder komponen yang sama dan di-import via `./` (dilarang `../`).
3. **Ekstrak secara bottom-up:** mulai dari **Style -> Atoms -> Molecules -> Organisms -> (opsional) Template & Page** agar target import `@registry/...` sudah siap dan terverifikasi `0 FAIL`.
4. **Siapkan environment uji:**
   - Jalankan web asli (contoh: `coffee-shop/escape-cafe-nextjs` -> `npm run dev -- -p 3001`).
   - Jalankan showcase rakitek dari hasil build terbaru: `npm run build`, lalu `npm run start -w apps/web -- -p 3000`.
     Catatan: kalau server memakai `next start`, perubahan baru terlihat setelah build ulang dan restart.
   - Siapkan folder bukti: `fidelity/<id-komponen>/`.

## 1. Baca sumber asli sampai tuntas

- Buka komponen asli (misal `src/components/CartDrawer.tsx`) **beserta seluruh CSS-nya** (`custom-overrides.css`, kelas tipografi seperti `t-h4`/`t-small-text`, `.btn`, ikon).
- Catat struktur DOM: urutan elemen, elemen yang ada, dan elemen yang tidak ada. Jangan menambah elemen yang tidak ada di aslinya, misalnya subtitle, warna aksen, atau blur backdrop.
- Catat teks asli apa adanya ("Checkout", bukan "Proceed to Checkout").

## 2. Ukur aslinya di browser (bukan menebak dari CSS)

Jalankan penerima lokal sekali di terminal terpisah: `npm run fidelity:sink`. Penerima ini menyajikan `measure.js` dan menyimpan hasil ukur langsung ke `fidelity/`, jadi agent tidak perlu menyalin JSON secara manual.

1. Buka web asli dan buat komponennya terlihat dalam keadaan yang sama dengan preview (drawer terbuka, 1 item, dst).
2. Atur viewport. Wajib diukur minimal di **1920x980** dan **1024x768**, ditambah **375x812** kalau komponennya responsif.
3. Tab yang diukur **harus aktif atau berada di depan**. Di tab latar, transisi CSS berhenti, sehingga drawer atau modal tidak pernah benar-benar terbuka.
4. Muat pengukur, tunggu elemennya diam, ukur, lalu simpan (jalankan lewat JS tool agent atau console):

   ```js
   await new Promise((ok) => document.head.append(Object.assign(document.createElement("script"),
     { src: "http://127.0.0.1:4599/measure.js", onload: ok })));
   await rkSettle(".escape-cart-drawer__panel");   // tunggu animasi buka selesai
   window.rkMap = {
     panel: ".escape-cart-drawer__panel",
     title: ".escape-cart-drawer__header h2",
     barFill: ".escape-cart-drawer__bar-fill",
     name: ".escape-cart-drawer__item-info .t-h6",
     subtotalValue: ".escape-cart-drawer__subtotal .t-h5",
     checkout: ".escape-cart-drawer__footer .btn",
   };
   await fetch("http://127.0.0.1:4599/save?file=<id>/original-1920.json",
     { method: "POST", body: JSON.stringify(rkMeasure(rkMap)) });
   ```

5. **Scrollbar disembunyikan otomatis.** `rkSettle`/`rkNormalize` dan `fidelity:capture` menyembunyikan scrollbar di kedua sisi, karena lebar scrollbar berbeda antar Chrome (15px, 10px, atau 0) dan dulu membuat FAIL palsu seperti `1905 vs 1910`. Selalu panggil `await rkSettle(...)` atau `await rkNormalize()` sebelum `rkMeasure`. JSON tanpa `"normalized": true` dianggap capture lama dan diberi WARN oleh pembanding.
6. Tidak perlu mengecek font secara manual. `rkMeasure` melaporkan `fontRendered`, yaitu font yang **benar-benar dipakai browser**, bukan yang tertulis di CSS. Ikuti `fontRendered` itu saat memilih token font.

## 3. Tulis komponen

- Ikuti aturan di `AGENTS.md`: token `--rk-*`, tanpa hex, tanpa hardcode brand, dan teks lewat props dengan default yang netral.
- Pakai **CSS Modules** untuk komponen high-fidelity supaya nilai px dan rumus `min(vw, vh)` bisa disalin persis dari aslinya.
- Salin rumus ukuran responsif persis seperti aslinya, misalnya `font-size: min(1.80556vw, 3.20988vh)` di `@media (min-width: 1024px)`.
- Kalau aslinya punya bug visual (misal ikon close 0px, backdrop tersembunyi oleh `div:empty`), tiru **tampilannya**, tapi pertahankan fungsi aksesibilitas (tombol close tetap ada, Escape menutup). Catat perbedaan ini di laporan.
- `preview.tsx` harus mereproduksi keadaan yang sama dengan screenshot asli (jumlah item, teks, mata uang).

## 4. Ukur hasil ekstrak dengan label yang sama

1. Buka `http://localhost:3005/preview/<ui|section>/<id>` di viewport yang sama.
2. Panggil `rkMeasure` dengan **label yang sama** dan selector versi rakitek. Nama kelas CSS Modules di build berbentuk `<hash>_namaKelas`, jadi pakai `[class$="_namaKelas"]`, atau `[class*="_namaKelas "]` kalau elemennya punya lebih dari satu kelas.
3. Tunggu animasi buka (transition) selesai sebelum mengukur. Kalau `visible: false` atau posisi `x` berada di luar layar, berarti elemennya masih bergerak, jadi ukur ulang.
4. Simpan ke `fidelity/<id>/extract-<lebar>.json`.

## 5. Bandingkan otomatis

```bash
npm run fidelity -- fidelity/<id>/original-1920.json fidelity/<id>/extract-1920.json
npm run fidelity -- fidelity/<id>/original-1024.json fidelity/<id>/extract-1024.json
```

- **FAIL** berarti ukuran, padding, warna, atau tata letak beda di luar toleransi (2%, minimal 1px, **maksimal 4px**). Batas 4px membuat selisih kecil pada section besar (misalnya hero 35px lebih tinggi) tetap tertangkap. Perbaiki lalu ulangi langkah 4 dan 5.
- **WARN** berarti beda yang bisa diterima kalau ada alasannya. Contohnya font berbayar yang diganti (Molitor → Barlow Condensed), atau pembulatan warna token. Setiap WARN wajib dijelaskan di laporan.
- Exit code 0 berarti lolos.

**Samakan lebar kontainer.** Kalau di web asli section dibatasi oleh layout halaman (misalnya `width: calc(100vw - 90px)` untuk rail navbar), samakan dulu sebelum mengukur, contohnya `#hero{width:100% !important}`. Catat hal ini di REPORT. Yang dibandingkan adalah komponennya, bukan layout halamannya.

**Font pengganti.** Kalau font asli berbayar, pilih font gratis yang **lebar hurufnya** paling mendekati, bukan yang bentuknya paling mirip. Ukur dengan canvas `measureText` untuk beberapa kandidat. Lebar yang mirip membuat baris teks turun di tempat yang sama, sehingga tinggi elemen ikut sama.

Masukkan **semua** elemen yang terlihat ke daftar ukur, termasuk elemen kecil seperti isian progress bar, ikon, dan badge. Elemen yang tidak diukur tidak akan ketahuan bedanya.

## 6. Screenshot berdampingan (dilakukan agent, bukan user)

1. Ambil screenshot asli dan hasil ekstrak di setiap viewport yang diukur, dalam keadaan yang sama.
2. Simpan ke `fidelity/<id>/original-<lebar>.png|jpg` dan `fidelity/<id>/extract-<lebar>.png|jpg`.
3. Bandingkan secara visual satu per satu: struktur, urutan, ukuran teks, jumlah baris (teks yang turun baris adalah tanda font atau lebar beda), warna, garis, jarak, dan ikon.
4. Kalau masih ada beda yang terlihat, kembali ke langkah 3. **Jangan melapor ke user sebelum screenshot terlihat sama.**

## 7. Gerbang akhir

Satu perintah, wajib exit 0:

```bash
npm run verify
```

`verify` menjalankan sync, lint (termasuk `rakitek/fidelity-evidence`: setiap komponen wajib punya `REPORT.md` + JSON asli/ekstrak di 1920 dan 1024), tes, `fidelity:all` (membandingkan ulang **semua** komponen, bukan hanya yang baru), lalu build. Jadi perubahan pada satu komponen atau pada alat ukur tidak bisa diam-diam merusak komponen lain.

Lalu restart server preview supaya build baru yang tampil, dan cek sekali lagi di browser.

## 8. Laporan ke user

Ikuti format di `AGENTS.md` (maks 10 baris, wajib menempel output asli `npm run verify`), lalu buat atau perbarui `fidelity/<id>/REPORT.md` berisi:

- hasil `npm run fidelity` per viewport (jumlah FAIL dan WARN),
- tautan ke pasangan screenshot `original-*.png` dan `extract-*.png`,
- daftar beda yang disengaja beserta alasannya (font berbayar, perbaikan aksesibilitas, gambar brand yang diganti placeholder).

Contoh laporan yang sudah jadi: [fidelity/slide-over-drawer/REPORT.md](../fidelity/slide-over-drawer/REPORT.md).

User cukup membuka `REPORT.md` atau screenshotnya. Kalau user masih harus mengambil screenshot sendiri untuk menemukan beda, berarti workflow ini belum dijalankan dengan benar.

---

## Kesalahan yang sering terjadi (jangan diulang)

- Menebak gaya dari nama kelas atau desain umum, bukan mengukur aslinya. Contohnya progress bar dibuat merah aksen padahal aslinya hitam.
- Menambah elemen yang tidak ada di aslinya (subtitle item, backdrop blur, pill radius).
- Menghilangkan elemen yang ada di aslinya (thumbnail produk, kode mata uang "CAD").
- Memakai font token yang lebih lebar dari aslinya sehingga teks turun baris.
- Membandingkan dengan build lama karena server `next start` belum di-restart.
- Mengubah alat ukur atau toleransi lalu hanya mengukur ulang beberapa komponen, sehingga klaim "semua 0 FAIL" sudah tidak benar. `fidelity:all` sekarang mencegah ini.
- Mengubah komponen tanpa mengukur ulang. `fidelity:all` memberi WARN "bukti lebih tua dari kode".
- Melapor "selesai" hanya karena `npm test` lolos. Lint tidak bisa mendeteksi beda visual.
