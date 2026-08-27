# Analisis Data & Laporan — Draft Kurikulum Lengkap

Total 12 modul di 2 course terpisah: **Dasar** (7 modul, sudah live di `dev`) + **Level Lanjut** (5 modul baru, draft di bawah). Course Level Lanjut lanjutin studi kasus yang sama (Kedai Roti) tapi bisnisnya sudah naik level — multi-cabang, jualan online, mulai pakai iklan — supaya datanya juga naik skala secara natural.

---

## BAGIAN A — Modul Dasar (existing, sudah live)

Referensi singkat aja, konten aslinya nggak diulang di sini karena udah ada & live di `analisis-data-content.html` (branch `dev`).

| # | Modul | Fokus |
|---|-------|-------|
| 1 | Apa itu Analisis Data? | 5 jenis analisis, Claude vs Excel |
| 2 | Upload & Baca Data | Verifikasi & rapikan data sebelum analisis |
| 3 | Prompt yang Pas untuk Analisis Data | Framework K-P-I |
| 4 | Mengolah & Menyusun Data Spreadsheet | Kategorisasi, agregasi, rumus, gabung 2 sumber |
| 5 | Dari Analisis ke Laporan | Ringkasan eksekutif, kutipan, rencana aksi |
| 6 | Dari Angka ke Grafik | Chart via Artifacts |
| 7 | Cek Ulang Sebelum Percaya | Spot-check, anti-halusinasi, sarkasme |

---

## BAGIAN B — Modul Level Lanjut (draft baru, 5 modul)

Catatan penting sebelum masuk ke konten: course ini **nggak sepenuhnya gratis**. Setiap modul di bawah punya catatan "Tools & Biaya" di awal supaya calon peserta nggak kaget.

---

### Modul 8 — Data Besar & Data Hidup

**Subtitle:** Dari file besar yang berantakan, sampai data yang selalu update sendiri

**🔧 Tools & Biaya:** Claude (chat/Projects) — gratis, tapi Projects dibatasi 5 di paket gratis. Kalau mau connect ke data hidup (MCP), connector remote butuh Pro ke atas.

**Deskripsi modul:**
Kedai Roti kamu sekarang udah punya 3 cabang dan mulai jualan online juga. Data yang dulu cuma 15 baris review sekarang jadi ribuan baris transaksi per bulan, tersebar di beberapa sheet (kasir, online, retur). Modul 2 udah ngajarin kamu kebiasaan "cek dulu sebelum analisis" — modul ini nguji kebiasaan itu di skala yang beneran nyata, terus ngenalin cara baru: connect langsung ke datanya, tanpa export-upload manual tiap kali.

**1. Kerja dengan File Besar & Multi-Sheet**
Masalah baru yang muncul di skala besar: file kegedean cuma kebaca sebagian, sheet tersembunyi ketinggalan, atau kolom yang sama punya nama beda di tiap cabang ("Total Penjualan" vs "Total Sales" vs "Omzet").

📝 **Prompt Cek Skala Besar:**
```
Ini data penjualan 3 cabang saya, masing-masing di sheet terpisah. Sebelum
saya lanjut, cek dulu: sheet mana aja yang berhasil kamu baca, berapa
baris/kolom masing-masing, dan apakah nama kolom antar sheet konsisten
atau perlu disamakan dulu.
```

💡 **Catatan:** Kalau file terlalu besar buat sekali baca, minta Claude kasih tau bagian mana yang keliatannya kepotong — jangan asumsi semuanya kebaca lengkap cuma karena nggak ada pesan error.

**2. Hubungkan Claude ke Data yang Selalu Update (MCP)**
MCP itu semacam colokan yang bikin Claude bisa baca (bahkan kadang nulis ke) sumber data lain secara langsung — Google Sheets, database, dashboard analitik — tanpa kamu export-upload manual tiap mau tanya sesuatu.

📋 **Cara kerja singkatnya:**
1. Connector di-setup sekali (biasanya lewat Settings → Connectors)
2. Setelah connect, kamu tinggal nanya di chat, Claude yang ambil data terbaru sendiri
3. Nggak perlu lagi re-upload file tiap data berubah

**Contoh skenario:** dashboard pesanan online Kedai Roti terhubung ke Claude lewat MCP. Setiap pagi kamu tinggal tanya "gimana penjualan online kemarin dibanding rata-rata minggu ini?" — tanpa export apapun.

**Ringkasan Modul 8:**
- Data skala besar butuh langkah verifikasi ekstra: cek per-sheet, cek konsistensi nama kolom antar sumber
- MCP menghilangkan langkah upload manual — Claude connect langsung ke sumber data
- Connector lokal/dasar gratis, tapi connector remote/live butuh paket berbayar

**🎯 Latihan:**
Data contoh (potongan data 3 cabang, sengaja beda format kolom):
```
Cabang A: Tanggal | Total Penjualan | Jumlah Transaksi
Cabang B: Date | Total Sales | Qty Transaction
Cabang C: Tgl | Omzet | Jml Transaksi
```
Minta Claude (1) konfirmasi ketiga sheet kebaca dengan benar, (2) samakan nama kolom jadi satu standar, (3) gabungkan jadi 1 tabel total penjualan gabungan 3 cabang.

**✅ Output yang Diharapkan:** 1 tabel gabungan 3 cabang dengan nama kolom yang sudah distandarkan, plus konfirmasi eksplisit dari Claude soal apa yang berhasil/tidak berhasil dibaca.

---

### Modul 9 — Claude for Excel & Gabungan Banyak Sumber

**Subtitle:** Kerja langsung di file, dan menyatukan data yang saling bertentangan

**🔧 Tools & Biaya:** Claude for Excel add-in — butuh paket Pro/Max/Team/Enterprise. Bagian gabungan banyak sumber tetap bisa lewat chat biasa, gratis.

**Deskripsi modul:**
Modul 4 udah ngajarin kategorisasi, agregasi, dan gabung 2 sumber data lewat copy-paste ke chat. Modul ini punya 2 level-up: pertama, kerja langsung di dalam file Excel/Sheets tanpa bolak-balik copy-paste; kedua, naikin tantangan gabungan data dari 2 sumber ke 3-4 sumber yang kadang hasilnya saling bertentangan.

**1. Claude for Excel — Kerja Tanpa Copy-Paste**
Add-in ini nempel langsung di Excel-mu. Bedanya sama cara yang diajarin di Modul 4:

| | Cara Modul 4 (chat biasa) | Claude for Excel |
|---|---|---|
| Alur kerja | Copy data → paste ke chat → copy hasil → paste balik ke Excel | Langsung minta di dalam file, hasilnya muncul di sel |
| Rumus lintas sheet | Harus dijelasin manual | Bisa baca semua sheet yang terbuka |
| Biaya | Gratis | Pro/Max/Team/Enterprise |

📝 **Contoh permintaan di dalam Excel:**
```
Buatkan kolom baru "Margin %" yang otomatis hitung dari kolom Harga Jual
dan Harga Modal di sheet ini, lalu buatkan juga tabel ringkasan margin
rata-rata per cabang, ambil datanya dari 3 sheet cabang yang terbuka.
```

**2. Gabungan 3-4 Sumber yang Saling Bertentangan**
Modul 4c cuma gabung 2 sumber yang searah (review + penjualan). Di dunia nyata, sumber data sering kasih sinyal yang beda-beda.

**Contoh skenario:** Kedai Roti pasang iklan online bulan lalu. Penjualan online naik. Tapi ada 3 sumber data lain yang perlu dicek dulu sebelum menyimpulkan iklannya yang berhasil: data stok (apakah kebetulan lagi ada promo diskon stok lama?), data cuaca/musim (apakah ini memang bulan ramai?), dan data komplain (apakah kenaikan pesanan malah dibarengi komplain keterlambatan karena kewalahan?).

📝 **Prompt Rekonsiliasi Multi-Sumber:**
```
Saya punya 4 data bulan ini: penjualan online, spend iklan, data stok/promo,
dan data komplain pengiriman. Penjualan online naik 30%. Sebelum saya
simpulkan itu karena iklan, cek apakah ada penjelasan lain yang lebih kuat
dari 3 data lainnya. Tunjukkan sumber mana yang paling mendukung dan mana
yang bertentangan.
```

**Ringkasan Modul 9:**
- Claude for Excel menghilangkan langkah copy-paste, tapi butuh paket berbayar
- Gabungan banyak sumber (3-4+) sering kasih sinyal yang saling bertentangan — bagian tersulitnya adalah menentukan sumber mana yang paling kuat buktinya, bukan cuma menggabungkan angkanya
- Selalu minta Claude tunjukkan bukti dari tiap sumber, jangan langsung terima 1 kesimpulan tunggal

**🎯 Latihan:**
Pakai skenario 4-sumber di atas (penjualan online, spend iklan, stok/promo, komplain). Buat data contoh sederhana untuk masing-masing (boleh angka rekaan), lalu jalankan Prompt Rekonsiliasi Multi-Sumber. Perhatikan apakah Claude kasih kesimpulan tunggal terburu-buru, atau benar-benar menimbang ke-4 sumbernya.

**✅ Output yang Diharapkan:** 1 analisis yang menyebutkan eksplisit sumber mana yang paling mendukung klaim "iklan berhasil" dan sumber mana yang jadi penjelasan alternatif — bukan cuma "ya, iklan berhasil."

---

### Modul 10 — Analisis Data Pakai Claude Code

**Subtitle:** Dari chat sekali pakai, ke script yang bisa dipakai ulang

**🔧 Tools & Biaya:** Claude Code + Python. Status inklusi di paket Pro sedang berubah-ubah — cek halaman pricing resmi sebelum kasih tau harga pasti ke peserta. Alternatifnya, jalan lewat API berbayar (per token).

**Deskripsi modul:**
Semua modul sebelumnya kerja lewat chat — cepat, tapi tiap kali mau analisis bulan baru, kamu ngulang prompt dari nol. Modul ini ngenalin Claude Code: cara kerja Claude yang bisa nulis dan jalanin kode Python beneran (pakai pandas buat olah data, matplotlib buat chart), hasilnya berupa script yang bisa dipakai ulang kapan aja tanpa mulai dari nol.

**1. Kapan Butuh Ini, Kapan Cukup Chat Biasa**

| Situasi | Cukup chat biasa (Modul 1-9) | Butuh Claude Code |
|---|---|---|
| Analisis sekali, data kecil | ✅ | |
| Laporan bulanan rutin dengan format sama | | ✅ (bikin script sekali, pakai berkali-kali) |
| Dataset jutaan baris | | ✅ |
| Perlu histori/versi kode yang bisa dicek ulang | | ✅ |

**2. Dari Prompt ke Script**

📝 **Contoh permintaan:**
```
Bikinkan script Python yang baca file CSV penjualan bulanan Kedai Roti
(kolom: tanggal, cabang, produk, jumlah, harga), hitung total penjualan
per cabang per bulan, dan buat bar chart perbandingan 3 cabang. Script
ini harus bisa saya pakai ulang tiap bulan tinggal ganti file CSV-nya.
```

Bedanya sama Artifacts (Modul 6): Artifacts bikin chart sekali jadi di chat, sedangkan script dari Claude Code bisa kamu simpan, jalanin ulang bulan depan dengan data baru, dan modif sendiri kalau ngerti dikit soal Python.

**Ringkasan Modul 10:**
- Claude Code cocok untuk analisis yang berulang atau data yang kegedean buat chat biasa
- Hasilnya berupa script yang reusable, bukan jawaban sekali pakai
- Cek status paket sebelum bilang ke peserta ini "termasuk Pro" — infonya masih berubah

**🎯 Latihan:**
Minta Claude Code bikin script sederhana yang menghitung total penjualan per cabang dari data contoh (boleh 10-15 baris), lalu minta modifikasi kecil (misal: ganti bar chart jadi line chart) untuk lihat gimana rasanya iterasi di kode dibanding di chat biasa.

**✅ Output yang Diharapkan:** 1 script Python yang jalan dan menghasilkan chart, plus pemahaman kapan sebaiknya pakai cara ini vs chat biasa.

---

### Modul 11 — Signifikansi Statistik & Prediksi

**Subtitle:** Benar-benar beda, atau cuma kebetulan? Dan apa yang mungkin terjadi selanjutnya?

**🔧 Tools & Biaya:** Claude (chat, atau Code untuk perhitungan) — gratis, kecuali pemakaian Code-nya berat dan kena limit paket gratis.

**Deskripsi modul:**
Modul 7 udah ngajarin spot-check manual. Modul ini naikin levelnya: gimana caranya tau kalau suatu perubahan itu beneran signifikan secara statistik, bukan cuma fluktuasi normal minggu ke minggu? Dan sekalian nutup 2 jenis analisis dari Modul 1 yang belum pernah benar-benar dipraktikkan: prediktif dan preskriptif.

**1. Signifikan, atau Cuma Kebetulan?**
Penjualan Roti Sobek Keju turun dari 80 ke 48 unit/minggu. Kedengarannya besar — tapi apakah itu beda yang nyata, atau masih dalam rentang wajar naik-turun mingguan?

📝 **Prompt Cek Signifikansi:**
```
Ini data penjualan mingguan Roti Sobek Keju 8 minggu terakhir: [DATA].
Minggu ke-5 turun ke 48 unit, sebelumnya rata-rata 78. Apakah penurunan
ini di luar variasi normal minggu-ke-minggu, atau masih dalam rentang
wajar? Jelaskan dengan bahasa sederhana, bukan istilah statistik yang ribet.
```

💡 **Kenapa ini penting:** tanpa langkah ini, gampang banget salah ambil kesimpulan dari 1-2 minggu data yang sebenarnya masih normal — lalu bikin keputusan bisnis berdasarkan kesimpulan yang keliru.

**2. Dari "Apa yang Terjadi" ke "Apa yang Mungkin Terjadi Selanjutnya"**
Modul 1 nyebut analisis prediktif dan preskriptif tapi nggak pernah dipraktikkan langsung — modul ini baru benar-benar masuk ke situ.

📝 **Prompt Prediksi:**
```
Berdasarkan tren penjualan 6 bulan terakhir dan kenaikan harga di bulan
Juni, perkirakan penjualan Roti Sobek Keju untuk kuartal depan. Sebutkan
juga asumsi yang kamu pakai dan seberapa yakin kamu dengan perkiraan ini.
```

⚠️ **Wajib:** selalu minta Claude sebutkan asumsi dan tingkat keyakinannya. Prediksi tanpa itu cuma keliatan meyakinkan padahal nggak ada dasarnya — sama kayak prinsip anti-halusinasi dari Modul 7.

**Ringkasan Modul 11:**
- Sebelum bereaksi ke sebuah perubahan angka, cek dulu apakah itu signifikan atau masih variasi normal
- Analisis prediktif/preskriptif baru berguna kalau disertai asumsi dan tingkat keyakinan yang jelas
- Ini kelanjutan langsung dari prinsip validasi Modul 7, cuma levelnya naik dari "cek manual" ke "cek dengan dasar statistik"

**🎯 Latihan:**
Pakai data 8 minggu penjualan Roti Sobek Keju (boleh dikarang mirip contoh di atas, dengan 1 minggu yang turun tajam). Jalankan Prompt Cek Signifikansi, lalu lanjutkan dengan Prompt Prediksi untuk kuartal depan. Catat asumsi yang disebutkan Claude — apakah masuk akal buat bisnismu?

**✅ Output yang Diharapkan:** 1 kesimpulan soal signifikansi (nyata vs kebetulan) + 1 perkiraan kuartal depan lengkap dengan asumsi dan tingkat keyakinan.

---

### Modul 12 — Otomatisasi Laporan & Workflow

**Subtitle:** Dari laporan yang kamu minta manual, ke laporan yang datang sendiri

**🔧 Tools & Biaya:** Claude API (bayar per token, bukan langganan chat biasa) + Zapier/Make (ada paket gratis, tapi buat pemakaian rutin biasanya perlu upgrade) + Slack/Email (gratis).

**Deskripsi modul:**
Ini modul penutup, gabungan dari semua yang udah dipelajari: Modul 5 (format laporan), Modul 7 (validasi), dan Modul 8 (data hidup). Bedanya, di sini semuanya jalan otomatis — nggak ada lagi langkah "kamu buka chat, paste data, minta laporan" setiap minggu.

**1. Alur Otomatisasi**
```
Data baru masuk → Zapier/Make deteksi → Claude API proses (tag/ringkas)
→ Hasil dikirim ke Slack/Email
```
Zapier/Make jadi "penjaga" yang mantau kapan ada data baru dan yang manggil Claude secara otomatis — kamu nggak perlu buka chat sama sekali.

**2. Contoh Kasus: Laporan Mingguan Otomatis**
Setiap Senin pagi, sistem otomatis: ambil data penjualan minggu lalu → minta Claude API bikin ringkasan eksekutif (format sama kayak Modul 5) → kirim ke email/Slack tim, tanpa ada yang buka Claude.ai secara manual.

**3. Contoh Kasus: Review Baru Auto-Tagged**
Review pelanggan baru masuk → otomatis dikirim ke Claude API untuk ditag (Topik/Sentimen/Urgensi, format sama kayak Modul 4) → kalau urgensinya "Tinggi", langsung post ke channel Slack tim customer service.

⚠️ **Tetap butuh manusia untuk:** memutuskan tindakan dari hasil laporan/tag. Otomatisasi ini cuma menghilangkan langkah "generate laporannya" — bukan menggantikan langkah "putuskan apa yang harus dilakukan dari laporan itu." Prinsip validasi dari Modul 7 tetap berlaku, cuma sekarang dicek secara berkala/sampling, bukan tiap kali generate.

**Ringkasan Modul 12:**
- 3 komponen: Claude API (otak), Zapier/Make (pemicu otomatis), Slack/Email (tujuan)
- Ini bukan modul "gratis" — Claude API dan pemakaian rutin Zapier/Make butuh biaya berjalan
- Otomatisasi menghilangkan langkah generate manual, tapi keputusan akhir tetap di tangan manusia — validasi berkala tetap perlu

**🎯 Latihan (konseptual, nggak perlu di-build beneran):**
Rancang alur otomatisasi untuk 1 laporan rutin yang paling sering kamu bikin manual saat ini. Tentukan: (1) apa pemicunya (data baru, jadwal mingguan, dll), (2) apa yang diminta ke Claude, (3) ke mana hasilnya dikirim, (4) di titik mana manusia tetap perlu cek sebelum hasilnya dipakai.

**✅ Output yang Diharapkan:** 1 diagram alur otomatisasi (boleh sketsa sederhana) untuk laporan rutin milikmu sendiri, siap dijadikan dasar kalau nanti mau benar-benar di-build.

---

## Ringkasan Struktur Akhir

- **Course Dasar:** 7 modul (live, gratis sepenuhnya)
- **Course Level Lanjut:** 5 modul (8-12), campuran gratis & berbayar, jelas ditandai per modul
- **Total:** 12 modul di 2 course terpisah — tetap di bawah 10 modul per course

Ini masih draft konten (belum jadi HTML). Kasih tau kalau ada bagian yang mau direvisi sebelum saya bikin jadi halaman course beneran.
