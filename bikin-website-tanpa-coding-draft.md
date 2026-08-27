# Bikin Website Sendiri Tanpa Coding — Draft Kurikulum

**Status: draft perencanaan, belum ditulis ke `*-content.html` mana pun.** Menggantikan slot roadmap `ai-powered-app` ("Build AI App Sederhana") di `all-access.html` — judul lama berpotensi bikin salah paham (kesannya situsnya sendiri "bertenaga AI", padahal yang benar: AI-nya bantu kamu *membangun* situs biasa). Judul baru menghindari itu.

**Level**: Pemula. **8 modul.** Studi kasus utama: **katalog toko online** — tapi fleksibel, dijelaskan di Modul 1 kalau kamu mau bikin portfolio atau situs lain, ikuti langkah yang sama pakai kontenmu sendiri.

---

## Ringkasan tools & biaya

| Tahap | Tools | Biaya |
|---|---|---|
| Modul 1–6 (rencana, desain, bangun) | Claude.ai chat + Artifacts | Gratis (HTML artifacts sudah dibuka ke free tier sejak Feb 2026) |
| Modul 7 (akun & repo) | GitHub | Gratis |
| Modul 8 (deploy) | Vercel (login pakai akun GitHub) | Gratis |
| Bonus, opsional | Claude Code / Cowork / GitHub connector | Tergantung paket, tidak wajib |
| Bonus, opsional | Custom domain | ~Rp150-250rb/tahun, tidak wajib |

**Sengaja tidak pakai Supabase di course ini** — katalog cukup pakai data produk yang di-hardcode langsung di file situs (array/JSON), jadi tetap 100% statis, tanpa backend, tanpa biaya. Supabase (database live, biar produk bisa di-update tanpa sentuh kode) jadi topik course lanjutan (lihat penutup Modul 8).

---

## Modul 1 — Apa yang Bisa Dibangun (+ Kenapa Ini Skill Berharga)

**Tujuan**: set ekspektasi realistis, kenalkan peran Claude, dan buka opsi kalau mau pakai studi kasus lain.

**Yang dibahas:**
- Yang **bisa** dibangun di course ini: halaman katalog produk, portfolio, landing page bisnis — situs statis satu arah (nggak butuh login/checkout).
- Yang **belum** dibahas di course ini: sistem checkout pembayaran, akun pelanggan, dashboard admin live — ini butuh backend (lihat course lanjutan).
- **Apa yang Claude bisa bantu**: brainstorming struktur & isi konten (termasuk nulisin draft copy halaman), bikin desain & layout dari deskripsi (atau dari gambar referensi — lihat Modul 3), bangun kode Artifact-nya langsung (nggak perlu ngoding manual), dan bantu troubleshoot kalau ada yang error atau nyangkut pas publish nanti. Intinya: Claude yang membangun, kamu yang mengarahkan & mereview.
- **Kenapa skill ini berharga**: selain buat toko/portfolio kamu sendiri, ini jadi jasa yang bisa ditawarkan ke UMKM lain yang belum punya situs — banyak yang butuh, dan tarif jasa bikin situs sederhana biasanya cukup layak buat side income.
- **Fleksibilitas studi kasus**: course ini jalan dengan contoh katalog toko, tapi metodenya (struktur → desain → bangun → publish) sama persis buat portfolio pribadi atau situs single-purpose lain. Kalau itu yang kamu butuhkan, ikuti tiap modul pakai kontenmu sendiri.

**Latihan**: tulis brief satu halaman — jenis produk/jasa yang mau dikatalogkan (atau: jenis portfolio yang mau dibuat), siapa target pengunjungnya, dan daftar halaman yang kira-kira dibutuhkan.

**Output**: brief satu halaman (jenis situs, target pengunjung, daftar halaman).

---

## Modul 2 — Rancang Struktur & Kumpulkan Konten

**Tujuan**: sitemap dan konten asli disiapkan sebelum masuk ke desain, supaya nggak bolak-balik ubah struktur pas sudah setengah jalan bangun.

**Yang dibahas:**
- Prompting untuk sitemap: minta Claude bantu susun halaman apa saja yang perlu ada (home, kategori produk, detail produk, kontak) berdasarkan brief Modul 1.
- Kumpulkan konten nyata dulu: nama produk, harga, kategori, deskripsi singkat, foto — baru desain di modul berikutnya. Prinsip yang sama dipakai course Analisis Data (rapikan data dulu sebelum diolah).
- Kalau foto produk belum ada bagus, boleh minta Claude bikin deskripsi visual placeholder sementara.

**Contoh prompt**:
```
Saya mau bikin katalog online untuk toko roti saya. Produknya ada 3 kategori:
roti tawar, roti manis, dan kue ulang tahun custom. Bantu saya susun sitemap
(halaman apa saja yang dibutuhkan) dan struktur informasi tiap halaman.
```

**Output**: sitemap + draft konten/data produk (nama, harga, kategori, deskripsi, foto) tertulis rapi.

---

## Modul 3 — Prompt untuk Desain Katalog (+ Cari Inspirasi Desain)

**Tujuan**: hasil desain yang lebih terarah, bukan tebak-tebakan — dengan bantuan referensi visual nyata.

**Yang dibahas:**
- **Cari inspirasi dulu, sebelum nulis prompt desain**: lihat 2-3 contoh situs/katalog yang kamu suka (Pinterest, Dribbble, atau langsung situs kompetitor/UMKM lain). Nggak perlu bikin dari kosong.
- **Kasih referensi itu langsung ke Claude** — upload screenshot ("bikin desain kayak gambar ini tapi untuk katalog produk saya") atau deskripsikan link/gaya yang dimaksud. Claude bisa membaca gambar yang diupload dan menangkap gaya (warna, layout, mood)-nya, jauh lebih akurat dibanding mendeskripsikan dari nol.
- Prompting untuk elemen katalog spesifik: grid produk, kartu produk (product card), tab kategori, hero section.
- Artifact pertama di sini murni kerangka visual (layout & gaya), belum diisi konten asli — itu Modul 4.

**Contoh prompt:**
```
[upload screenshot referensi]
Saya suka gaya visual di gambar ini — warnanya soft, kartu produknya rapi
dengan foto besar di atas. Bikinkan kerangka layout katalog produk dengan
gaya serupa: grid 3 kolom, tab kategori di atas, tiap kartu produk ada
foto + nama + harga.
```

**Output**: Artifact pertama — kerangka layout visual (grid, kartu produk, tab kategori), belum diisi data asli.

---

## Modul 4 — Bangun Halaman Katalog

**Tujuan**: kerangka Modul 3 diisi konten asli dari Modul 2 jadi halaman yang benar-benar berfungsi.

**Yang dibahas:**
- Masukkan data produk asli ke kerangka layout.
- Pola refine-by-chat: screenshot hasil Artifact, kasih tahu Claude apa yang mau diubah, ulangi sampai pas — bukan coba nulis prompt sempurna sekali jadi.
- Catatan realistis: free tier Claude ada rate limit untuk artifact HTML — kalau sesi refine panjang, mungkin kena jeda sebentar, itu wajar.

**Output**: homepage + halaman katalog produk yang sudah jadi dan bisa di-preview langsung di Artifact.

---

## Modul 5 — Tambah Filter Kategori & Order via WhatsApp

**Tujuan**: katalog jadi interaktif dan langsung bisa dipakai terima order — tanpa backend.

**Yang dibahas:**
- Filter kategori (klik tab kategori, produk yang tampil berubah) — tetap JS statis, nggak butuh server.
- Link "Order via WhatsApp" (`wa.me/...`) di tiap kartu produk, otomatis terisi nama produk di pesan.
- Ini yang bikin situs statis tetap bisa "jualan" tanpa sistem checkout.

**Output**: katalog interaktif — filter kategori jalan, tiap produk punya tombol order ke WhatsApp yang berfungsi.

---

## Modul 6 — Rapikan: Mobile & Cek Ulang

**Tujuan**: situs teruji sebelum dipublish — konsisten dengan pola "cek ulang sebelum percaya" di Modul 7 Analisis Data.

**Yang dibahas:**
- Cek tampilan di ukuran layar HP (paling banyak pengunjung dari mobile).
- Sapu bersih: link yang salah/rusak, typo, harga yang belum diisi.
- Checklist singkat sebelum lanjut ke publish.

**Output**: checklist QA selesai, versi situs yang sudah responsive dan bebas bug jelas.

---

## Modul 7 — Kenalan dengan GitHub & Bikin Akun

**Tujuan**: siap publish, sekaligus mulai bangun portfolio nyata.

**Yang dibahas:**
- Apa itu GitHub dalam bahasa sederhana (tempat nyimpan & menampilkan project).
- **GitHub sebagai portfolio**: repo publik yang bisa ditunjukkan ke calon klien/employer sebagai bukti kerja nyata — relevan langsung ke poin monetisasi di Modul 1.
- Bikin akun (gratis), bikin repo pertama, upload file situs — semua lewat web UI, tanpa command line/git command.

**Output**: akun GitHub aktif + repo pertama berisi file situs yang sudah diupload — portfolio piece pertama, bahkan sebelum situsnya live.

---

## Modul 8 — Hubungkan ke Vercel & Publish

**Tujuan**: situs benar-benar live di internet, dan tahu cara update-nya nanti.

**Yang dibahas:**
- Login Vercel pakai akun GitHub (nggak perlu daftar akun terpisah).
- Import repo dari Modul 7, deploy, dapat URL live.
- Update selanjutnya: edit/upload file baru ke GitHub → Vercel otomatis redeploy — nggak perlu ulang proses drag-and-drop manual.
- **Penutup — monetisasi**: repo GitHub + situs live ini sekarang jadi bukti kerja nyata yang bisa ditunjukkan ke UMKM lain yang butuh jasa serupa.
- **Bonus box (opsional, nggak wajib buat selesai course)**: Claude Code buat yang mau kelola file & deploy langsung dari terminal; Cowork buat workflow yang lebih hands-off; GitHub connector biar Claude bisa baca/push perubahan repo langsung dari chat.
- **Teaser course lanjutan**: katalog ini cocok buat browse-and-WhatsApp, tapi kalau butuh data produk yang benar-benar hidup (update stok/harga tanpa sentuh kode) dan order tersimpan rapi di database, itu topik course berikutnya — pakai Supabase. Course itu levelnya naik ke Intermediate (butuh sedikit JS, meski tetap dibimbing Claude), beda dari course "Tanpa Coding" ini.

**Output**: URL live yang bisa dikunjungi siapa saja — situs katalog (atau portfolio) yang sudah selesai dan ter-deploy, otomatis update tiap ada push baru ke GitHub.

---

## Ide course lanjutan (belum digarap, sekadar catatan arah)

**"Bikin Toko Online" / e-commerce course** — lanjutan langsung dari course ini, studi kasus yang sama naik level: tabel produk pindah dari hardcode ke Supabase (bisa diedit tanpa sentuh kode), order pembeli tersimpan di database asli (bukan cuma WhatsApp). Levelnya Intermediate, bukan Pemula, karena mulai butuh sedikit interaksi kode (client library Supabase), meski Claude tetap yang menulis sebagian besarnya.
