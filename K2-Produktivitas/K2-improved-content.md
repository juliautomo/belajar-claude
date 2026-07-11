# K2 · Produktivitas Kantor — Improved Content Draft
> **Persona konsisten:** Rina, owner UMKM fashion online "Kasual Studio" — jual pakaian kasual wanita via Instagram & Tokopedia, tim 2 orang, sehari-hari: balas pesan pelanggan, buat konten, analisis penjualan, koordinasi supplier.
> 
> **Review notes:** Tandai bagian yang perlu diubah dengan `[REVISI: ...]`

---

## HALAMAN JUDUL

**K2 · Produktivitas Kantor**
Intermediate

**Tagline:** Kurangi 2 jam kerja harianmu — tanpa tools baru, tanpa kursus coding.

**7 Modul:**
01 Role Prompting — prompt yang langsung menghasilkan output bagus
02 Claude Projects — asisten yang ingat bisnismu
03 Gmail + Claude — inbox bersih, email cepat
04 Google Sheets — data jadi insight dalam menit
05 Batch Prompting — kerjakan 20 hal dalam satu prompt
06 Prompt Chaining — output kompleks dari langkah sederhana
07 Case Study — semua modul dalam satu hari kerja nyata

---

## PENGANTAR (½ halaman — diperpendek dari versi lama)

Kamu tidak perlu belajar tools baru untuk produktif dengan Claude. Semua yang ada di modul ini bekerja dengan apps yang sudah kamu pakai setiap hari — email, spreadsheet, dokumen.

Modul 1 mengajarkan satu framework yang jadi dasar semua modul berikutnya. Modul 2–4 aplikasikan ke tools sehari-hari. Modul 5–6 mengalikan hasilnya.

Ikuti urutan modul. Setiap latihan dirancang untuk langsung pakai di kerjaan nyata — bukan contoh fiktif.

---

## MODUL 01 · Role Prompting

### Masalah yang Diselesaikan

Rina menghabiskan 45 menit setiap pagi untuk balas email dan buat caption. Hasilnya sering tidak sesuai ekspektasi dan harus diedit ulang.

Setelah modul ini: waktu yang sama, output 3x lebih baik — karena Claude tahu persis apa yang dibutuhkan.

### Framework: 4 Elemen Prompt

> [VISUAL: Diagram horizontal → ROLE → KONTEKS → TUGAS → FORMAT → OUTPUT]

**ROLE** — Siapa Claude dalam situasi ini?
*"Kamu adalah copywriter fashion yang paham pasar Gen Z Indonesia."*

**KONTEKS** — Situasi, latar, info relevan
*"Toko saya jual pakaian kasual wanita, harga Rp 150–350rb, beli lewat DM Instagram."*

**TUGAS** — Satu instruksi utama yang jelas
*"Tulis caption Instagram untuk koleksi baru: kemeja linen putih."*

**FORMAT** — Panjang, struktur, tone, bahasa
*"Maks 80 kata, 1 hook kuat di baris pertama, 3 hashtag relevan, bahasa Indonesia santai."*

### Sebelum vs. Sesudah

> [VISUAL: Dua kotak berdampingan — SEBELUM (kiri, merah) dan SESUDAH (kanan, hijau)]

**SEBELUM (prompt lama Rina):**
> "Buatkan caption Instagram untuk baju baru saya"

Hasil: caption generik, tidak ada hook, hashtag tidak relevan, harus ditulis ulang.
Waktu terbuang: 20 menit edit.

**SESUDAH (4-elemen prompt):**
> "Kamu adalah copywriter fashion yang paham pasar Gen Z Indonesia. Toko saya jual pakaian kasual wanita harga Rp 150–350rb via DM Instagram. Tulis caption untuk kemeja linen putih baru — koleksi summer. Maks 80 kata, hook kuat di baris pertama, 3 hashtag relevan, bahasa santai."

Hasil: caption siap posting dalam 30 detik.
Waktu yang dihemat: 18 menit per caption.

### Cheat Sheet — Framework 4 Elemen

> [VISUAL: Kotak referensi — desain seperti sticky note atau kartu, bisa di-screenshot]

```
ROLE:    "Kamu adalah [jabatan/keahlian] yang [spesialisasi]."
KONTEKS: "[Situasi saat ini / info tentang bisnis / latar penerima]"
TUGAS:   "[Satu instruksi utama — buat / tulis / analisis / ringkas]"
FORMAT:  "[Panjang] · [Struktur] · [Tone] · [Bahasa]"
```

**Tips:** Tidak perlu urutan persis. Yang penting 4 elemen hadir.
**Kalau hasilnya kurang tepat:** identifikasi elemen yang hilang — lalu tambahkan. Jangan ganti prompt dari nol.

### ■ LATIHAN

Pilih 1 pesan atau dokumen yang perlu kamu buat hari ini — bisa email, caption, balasan komplain, atau laporan singkat.

Tulis prompt menggunakan 4 elemen. Kirim ke Claude.

Kalau hasilnya belum tepat, tanya diri sendiri: *elemen mana yang kurang spesifik?* Tambahkan info itu dan coba lagi.

### ■ OUTPUT YANG DIHARAPKAN

1 draft siap pakai. Simpan promptnya — kamu akan pakai lagi di modul berikutnya.

---

## MODUL 02 · Claude Projects

### Masalah yang Diselesaikan

Setiap kali Rina buka chat baru, dia harus briefing ulang — tulis nama toko, jelaskan produk, tentukan tone. Ini buang waktu 5 menit per sesi, belum termasuk kalau Claude salah tone karena lupa konteks.

Setelah modul ini: setup Claude Projects sekali — Claude ingat semua konteks bisnismu selamanya.

### Apa itu Claude Projects?

> [VISUAL: Diagram — Chat Biasa (lupa setiap sesi) vs. Claude Project (ingat konteks permanen)]

Chat biasa = memori yang direset setiap sesi.
Claude Project = memori permanen yang bisa dikonfigurasi.

Kamu bisa simpan:
- Informasi bisnis (nama toko, produk, target market)
- Tone dan gaya bahasa yang diinginkan
- Format output favorit
- File referensi (price list, template, SOP)

### Cara Setup Project (3 Langkah)

> [VISUAL: Screenshot langkah 1 — tombol "New Project" di sidebar Claude]
> [VISUAL: Screenshot langkah 2 — kolom "Project Instructions"]
> [VISUAL: Screenshot langkah 3 — hasil chat dengan konteks aktif]

**Langkah 1:** Klik "New Project" di sidebar kiri Claude → beri nama project (contoh: "Kasual Studio")

**Langkah 2:** Isi "Project Instructions" — ini yang Claude baca setiap kali kamu chat di project ini

**Langkah 3:** Mulai chat. Tidak perlu briefing ulang.

### Template System Instructions — Copy & Pakai

> [VISUAL: Kotak kode / text box dengan border, bisa di-copy]

```
# Tentang Bisnis
Nama: [nama toko/perusahaan kamu]
Produk/Layanan: [deskripsikan singkat]
Target customer: [siapa yang beli]
Harga rata-rata: [range harga]
Channel penjualan: [Instagram / Tokopedia / WhatsApp / dll]

# Tone & Bahasa
- Bahasa Indonesia [formal / semi-formal / santai]
- Gunakan "kamu" bukan "Anda"  
- [tambahkan gaya unik bisnismu]

# Format Output Default
- Caption IG: maks [X] kata + [X] hashtag
- Email: maks [X] kata, ada CTA di penutup
- Balas komplain: empati dulu, solusi kedua
```

**Contoh Rina (Kasual Studio):**
```
# Tentang Bisnis
Nama: Kasual Studio
Produk: pakaian kasual wanita, basic & trendy
Target: wanita 20–32 tahun, Gen Z & Millennial
Harga: Rp 150.000–350.000
Channel: Instagram DM & Tokopedia

# Tone & Bahasa
- Bahasa Indonesia santai, hangat, relatable
- Pakai "kamu" bukan "Anda"
- Hindari kata "terbaik" atau "termurah" tanpa data

# Format Default
- Caption IG: maks 80 kata + 5 hashtag relevan
- Balasan DM: ramah, to the point, maks 3 kalimat
- Balasan komplain: mulai dengan maaf/empati, beri solusi konkret
```

### Sebelum vs. Sesudah

**Tanpa Project:**
> "Kamu adalah copywriter fashion. Toko saya namanya Kasual Studio, jual baju kasual wanita, target Gen Z, harga 150–350rb. Tulis caption untuk..."

**Dengan Project:**
> "Tulis caption untuk kemeja linen putih baru — koleksi summer."

Sama hasilnya. Hemat 3–5 menit briefing setiap sesi.

### ■ LATIHAN

Setup Claude Project pertamamu sekarang.

1. Buka Claude → klik "New Project"
2. Salin template System Instructions di atas
3. Isi dengan info bisnismu sendiri
4. Test dengan prompt pendek — lihat apakah Claude langsung "ngerti" tanpa briefing

### ■ OUTPUT YANG DIHARAPKAN

1 Claude Project aktif dengan System Instructions terisi. Coba minimal 3 prompt berbeda tanpa briefing ulang.

---

## MODUL 03 · Gmail + Claude

### Masalah yang Diselesaikan

Rata-rata orang menghabiskan 2,5 jam sehari untuk email. Sebagian besar terbuang untuk memikirkan kata-kata yang tepat — bukan untuk benar-benar bekerja.

Rina punya 15 email yang perlu dibalas setiap hari: komplain pelanggan, pertanyaan reseller, konfirmasi supplier, follow-up pembayaran.

Setelah modul ini: dari 15 email, 12 bisa diselesaikan dalam 10 menit.

### Workflow: Email → Claude → Review → Kirim

> [VISUAL: Diagram alur 4 langkah horizontal dengan ikon]
> Email masuk → Copy ke Claude → Dapat draft → Edit & kirim

Claude tidak bisa masuk ke Gmail langsung. Tapi workflownya tetap cepat:

1. **Buka email** yang perlu dibalas
2. **Copy isi email** → paste ke Claude
3. **Tambahkan konteks 1–2 kalimat** (hubungan, tujuan balasan, tone)
4. **Minta draft** → review → kirim

### 3 Elemen Wajib Saat Prompt Email

> [VISUAL: 3 kotak horizontal]

**1. Teks email asli** — paste seluruhnya, jangan ringkas
**2. Konteks hubungan** — pelanggan baru? supplier lama? reseller potensial?
**3. Tujuan balasan** — konfirmasi, tolak, klarifikasi, follow-up, atau tawaran?

### Contoh Nyata: 4 Tipe Email Rina

> [VISUAL: 4 kartu/tab dengan contoh masing-masing]

**① Komplain pelanggan (paling sering)**
```
[paste email komplain]

Ini pelanggan yang sudah beli 3x. Dia komplain baju yang diterima warnanya 
beda dari foto. Tulis balasan yang: (1) minta maaf tulus, (2) tawarkan tukar 
atau refund, (3) minta foto bukti. Tone: hangat dan profesional. Maks 5 kalimat.
```

**② Pertanyaan reseller**
```
[paste email tanya-tanya reseller]

Ini calon reseller dari Surabaya. Dia tanya soal harga grosir dan minimum order. 
Kita belum punya program reseller formal. Tulis balasan yang: informatif, 
tidak menutup pintu, dan minta nomor WA untuk diskusi lebih lanjut.
```

**③ Follow-up supplier yang tidak balas**
```
Saya perlu follow-up supplier kain yang belum balas email saya dari 3 hari lalu 
soal pesanan 50 meter kain linen. Tulis follow-up yang: singkat, sopan, 
ada sense of urgency ringan. Maks 3 kalimat.
```

**④ Konfirmasi pembayaran**
```
[paste bukti transfer pelanggan]

Pelanggan sudah transfer. Tulis konfirmasi yang: akui pembayaran, sebutkan 
estimasi pengiriman 1–2 hari kerja, dan ucapkan terima kasih. Maks 3 kalimat.
```

### Checklist Sebelum Kirim

> [VISUAL: Checklist kotak centang — desain simpel]

☐ Nama penerima sudah benar (bukan "[Nama]")
☐ Tone sesuai dengan hubungan (formal / santai)
☐ Tidak ada info yang salah atau perlu dicek ulang
☐ CTA atau next step jelas (kalau dibutuhkan)
☐ Panjang email sesuai (tidak terlalu panjang untuk hal sederhana)

### ■ LATIHAN

Buka inbox kamu sekarang. Pilih 3 email yang perlu dibalas.

Untuk masing-masing:
- Paste isi email ke Claude
- Tambahkan konteks 1–2 kalimat
- Minta draft
- Hitung waktu yang dibutuhkan vs. menulis dari nol

### ■ OUTPUT YANG DIHARAPKAN

3 draft balasan email siap kirim. Target: rata-rata di bawah 3 menit per email.

---

## MODUL 04 · Google Sheets + Claude

### Masalah yang Diselesaikan

Rina punya data penjualan di Google Sheets — 6 bulan, 12 produk, 300+ transaksi. Setiap minggu dia butuh 2 jam untuk bikin laporan manual.

Setelah modul ini: laporan yang sama selesai dalam 15 menit — dan hasilnya lebih akurat.

### Yang Bisa Claude Bantu di Sheets

> [VISUAL: 3 kolom dengan ikon]

**Formula** — buat, jelaskan, debug formula yang error
**Analisis** — temukan pola, bandingkan performa, identifikasi anomali
**Rekomendasi** — dari data ke keputusan bisnis konkret

### Data yang Aman vs. Tidak untuk Dibagikan ke Claude

> [VISUAL: Dua kotak — AMAN (hijau) dan HINDARI (merah)]

**AMAN dibagikan:**
- Nama produk, kategori, harga
- Jumlah penjualan per periode
- Data performa (tanpa nama pelanggan)
- Struktur kolom dan formula

**HINDARI dibagikan:**
- Nama lengkap + nomor telepon pelanggan
- Nomor kartu kredit / rekening
- Password atau API key
- Data karyawan dengan info personal

### Cara Prompt yang Benar untuk Sheets

**Selalu sebutkan struktur data dulu:**

```
Saya punya sheet dengan kolom:
A: Nama Produk | B: Kategori | C: Jan | D: Feb | E: Mar
F: Target Bulanan | G: Harga | H: Stok

[pertanyaan atau permintaan spesifik]
```

**Contoh Rina — Alur Lengkap:**

*Step 1 — Minta formula:*
```
Sheet saya punya kolom: A=Nama Produk, B=Jan, C=Feb, D=Mar, E=Target.
Buatkan formula di F2 untuk hitung total penjualan Jan–Mar, 
dan G2 untuk hitung % pencapaian target. Saya pakai Google Sheets.
```

*Step 2 — Minta analisis (paste 5–10 baris hasil):*
```
Ini data penjualan Kasual Studio 3 bulan terakhir:
[paste data]

Analisis: produk mana yang performa paling konsisten? 
Mana yang tren naik vs. turun? Rekomendasikan 2 produk yang perlu 
ditingkatkan stok bulan depan.
```

*Step 3 — Keputusan bisnis:*
```
Dari analisis tadi, saya punya budget restock Rp 5 juta. 
Sarankan alokasi yang paling optimal berdasarkan data performa.
```

> [VISUAL: Diagram alur — Data → Formula → Insight → Keputusan]

### ■ BONUS: Google Apps Script

> [VISUAL: Kotak dengan label "BONUS — Untuk yang Ingin Lanjut"]

Untuk pengguna yang lebih teknis: Claude bisa bantu tulis Google Apps Script untuk otomatisasi berulang (laporan otomatis, notifikasi email, dll). Ini bukan bagian wajib modul — pelajari kalau kamu sudah nyaman dengan workflow dasar.

### ■ LATIHAN

Download file latihan `k2-data-penjualan.csv` dari halaman materi.

1. Import ke Google Sheets
2. Minta Claude buat 3 formula dasar (total, rata-rata, % target)
3. Paste 5 baris data ke Claude dan minta analisis pola
4. Tanya Claude: *"Dari data ini, produk mana yang harus saya prioritaskan bulan depan?"*

### ■ OUTPUT YANG DIHARAPKAN

Sheet dengan 3 formula berjalan + 1 paragraf analisis dari Claude tentang pola performa berdasarkan data kamu.

---

## MODUL 05 · Batch Prompting

### Masalah yang Diselesaikan

Rina punya 20 produk baru yang perlu deskripsi untuk Tokopedia. Dengan cara biasa: 20 prompt terpisah, 20 copy-paste, 40 menit.

Dengan batch prompting: 1 prompt, 20 deskripsi, 5 menit.

### Apa itu Batch Prompting?

> [VISUAL: Diagram — 1 Prompt masuk → Claude memproses → 20 Output keluar (fan out)]

Kamu berikan Claude satu set instruksi + daftar item → Claude proses semua sekaligus.

Berlaku untuk item apapun yang membutuhkan **perlakuan sama**: deskripsi produk, ringkasan review, balasan template, kategori data, dll.

### Struktur Prompt Batch

```
[Instruksi yang berlaku untuk SEMUA item]

Format output per item:
[tentukan struktur yang diinginkan]

Daftar item:
1. [item pertama]
2. [item kedua]
3. [item ketiga]
...
```

### 4 Contoh Nyata yang Bisa Kamu Pakai Sekarang

> [VISUAL: 4 kartu — satu per kasus]

**① Deskripsi produk Tokopedia (Rina)**
```
Tulis deskripsi produk Tokopedia untuk setiap item berikut.
Format per produk:
- Nama: [nama produk]
- Deskripsi: 2 kalimat manfaat + 1 kalimat CTA, maks 50 kata
- Highlight: 3 bullet point keunggulan

Produk:
1. Kemeja linen putih, bahan adem, cocok kerja & kasual
2. Celana kulot hitam, pinggang elastis, all size S–XL
3. Dress midi floral, bahan katun, tersedia 4 warna
[lanjutkan sampai 20 produk]
```

**② Kategori review pelanggan**
```
Kategorikan setiap review berikut sebagai: POSITIF / NEGATIF / NETRAL
Lalu ekstrak: poin utama yang disebut pelanggan (maks 5 kata)

Review:
1. "Baju bagus, jahitan rapi, tapi pengiriman lama"
2. "Warna persis seperti foto, puas!"
3. "Ukuran kebesaran dari yang tertera"
[lanjutkan]
```

**③ Ringkasan email masuk**
```
Ringkas setiap email berikut dalam 1 kalimat. 
Sebutkan: siapa pengirim + apa yang mereka minta/sampaikan.

Email 1: [paste email]
Email 2: [paste email]
[lanjutkan]
```

**④ Buat variasi caption dari 1 konsep**
```
Buat 5 variasi caption Instagram untuk produk yang sama.
Tiap variasi: hook berbeda, tone berbeda (santai / inspiratif / edukatif / FOMO / relatable).
Semua: maks 60 kata + 3 hashtag.

Produk: Kemeja linen putih, koleksi summer, harga Rp 189.000
```

### Kapan TIDAK Pakai Batch Prompting

> [VISUAL: Kotak peringatan / warning box]

- Kalau setiap item butuh konteks yang sangat berbeda satu sama lain
- Kalau output satu item bergantung pada output item lain
- Kalau kamu butuh review mendalam per item (bukan proses cepat)
- Kalau jumlah item lebih dari ~30 (pecah jadi beberapa batch)

### ■ LATIHAN

Pilih 5–10 item sejenis dari pekerjaanmu: deskripsi produk, email template, ringkasan, atau apapun.

Tulis satu batch prompt dengan instruksi + format + semua item. Proses sekaligus.

Simpan prompt tersebut sebagai template — pakai lagi kapanpun perlu.

### ■ OUTPUT YANG DIHARAPKAN

5–10 output terproses sekaligus. 1 template prompt tersimpan.

---

## MODUL 06 · Prompt Chaining

### Masalah yang Diselesaikan

Rina perlu buat proposal kerjasama untuk reseller potensial di Bandung. Kalau satu prompt: hasilnya generik dan dangkal. Kalau dicicil: setiap step membangun di atas yang sebelumnya.

Setelah modul ini: output kompleks yang biasanya butuh 2 jam, selesai dalam 25 menit.

### Apa itu Prompt Chaining?

> [VISUAL: Diagram alur → Prompt 1 → Output 1 → Prompt 2 → Output 2 → Prompt 3 → Output final]

Satu prompt menghasilkan output.
Output itu jadi input untuk prompt berikutnya.
Setiap step membangun di atas konteks yang sudah ada.

**Kapan dibutuhkan:**
- Output yang terlalu kompleks untuk 1 prompt
- Tugas yang punya tahapan logis (riset → draft → review → finalisasi)
- Kalau satu prompt menghasilkan hasil yang dangkal atau generik

### Contoh Nyata: Rina Buat Proposal Reseller

> [VISUAL: Timeline/flowchart 4 step dengan konten singkat per step]

**Step 1 — Riset & Profil (Prompt pertama)**
```
Saya akan buat proposal kerjasama reseller untuk Kasual Studio 
(brand fashion kasual wanita, harga Rp 150–350rb).

Calon reseller: toko fashion di Bandung, sudah 2 tahun berjualan, 
follower IG 8.000, fokus ke pasar mahasiswi.

Buat: (1) profil calon reseller berdasarkan info ini, 
(2) apa yang kemungkinan mereka cari dari kerjasama, 
(3) kekhawatiran yang mungkin mereka punya.
```

**Step 2 — Struktur Proposal (Gunakan output Step 1)**
```
Berdasarkan profil dan kebutuhan reseller tadi, 
buat kerangka proposal kerjasama yang menjawab kekhawatiran mereka.

Sertakan: penawaran harga grosir, minimum order, keuntungan eksklusif reseller, 
dan cara mulai. Formatnya: 5 section dengan heading.
```

**Step 3 — Tulis Proposal Lengkap**
```
Tulis proposal lengkap berdasarkan kerangka tadi.
Tone: profesional tapi hangat. Panjang: 400–500 kata.
Bahasa Indonesia formal.
```

**Step 4 — Review & Perkuat**
```
Identifikasi 3 bagian paling lemah dari proposal ini dan tulis ulang 
agar lebih meyakinkan. Fokus pada bagian yang bisa membuat reseller ragu.
```

### 5 Aturan Prompt Chaining yang Efektif

> [VISUAL: 5 poin dengan ikon nomor]

1. **Tetap di satu chat** — jangan buka chat baru di tengah chain
2. **Review output di setiap step** sebelum lanjut
3. **Mulai dari yang luas, semakin spesifik** setiap step
4. **Gunakan "dari hasil tadi..."** untuk merujuk ke output sebelumnya
5. **Step terakhir selalu review** — "identifikasi 3 bagian paling lemah dan perbaiki"

### Ide Chain untuk Bisnismu

> [VISUAL: 3 kartu contoh use case]

- **Konten bulanan:** Riset trend → Kalender konten → Draft caption → Review
- **Laporan performa:** Analisis data → Temukan insight → Buat narasi → Slide summary
- **Onboarding karyawan baru:** Buat checklist → Tulis SOP → Buat template pertanyaan

### ■ LATIHAN

Pilih satu tugas yang biasanya kamu kerjakan dalam beberapa langkah terpisah.

Buat chain minimal 3 step. Kerjakan dalam satu chat yang sama. Review output di setiap step sebelum lanjut.

### ■ OUTPUT YANG DIHARAPKAN

1 output final dari chain minimal 3 step. Bandingkan hasilnya dengan satu prompt langsung — mana yang lebih baik?

---

## MODUL 07 · Case Study: Senin Pagi di Kasual Studio

### Setup Skenario

Rina baru pulang dari liburan 3 hari. Senin pagi, dia buka laptop dan langsung dihadapkan dengan:

- 23 email belum dibalas
- Koleksi baru (10 produk linen summer) yang belum punya deskripsi Tokopedia
- Data penjualan bulan lalu yang belum dianalisis
- 1 calon reseller dari Yogyakarta yang minta proposal kerjasama
- Deadline posting konten Instagram: hari ini

Tanpa Claude: setidaknya 5 jam kerja.
Dengan semua yang sudah dipelajari di K2: selesai sebelum makan siang.

Ikuti Rina step by step — dan perhatikan modul mana yang dipakai di setiap langkah.

---

### Step 1 — Buka Claude Project, Langsung Kerja
*Modul yang dipakai: M02 Claude Projects*

Rina tidak perlu briefing ulang. Project "Kasual Studio" sudah dikonfigurasi. Claude sudah tahu nama toko, produk, tone, dan format yang diinginkan.

Prompt pertama Rina hari ini:

```
Bantu saya prioritaskan pekerjaan hari ini. Saya punya:
- 23 email belum dibalas (campuran komplain, inquiry, konfirmasi)
- 10 deskripsi produk baru untuk Tokopedia
- Analisis data penjualan bulan lalu
- 1 proposal reseller yang perlu dibuat
- 1 post Instagram hari ini

Urutkan dari yang paling urgent ke yang bisa ditunda.
```

Claude langsung menjawab dengan urutan yang logis — karena sudah tahu konteks bisnis Rina.

---

### Step 2 — Bersihkan 23 Email dalam 30 Menit
*Modul yang dipakai: M01 Role Prompting + M03 Gmail + Claude*

Rina buka inbox, sort by sender type. Dia kelompokkan email jadi 4 tipe:

**Komplain (5 email)** — pakai template prompt komplain dari M03, tambahkan konteks per email:
```
[paste email komplain]
Pelanggan ini beli pertama kali. Komplain soal ukuran yang kebesaran.
Balas: empati, tawarkan tukar ukuran gratis ongkir, minta foto produk.
```

**Inquiry reseller (3 email)** — pakai batch prompting (M05) untuk ringkas semua inquiry dulu:
```
Ringkas 3 email inquiry reseller berikut dalam 1 kalimat masing-masing.
Sebutkan: kota asal + apa yang mereka tanyakan.

Email 1: [paste]
Email 2: [paste]
Email 3: [paste]
```
Setelah tahu isinya, Rina balas satu per satu pakai Role Prompting.

**Konfirmasi pembayaran (12 email)** — ini yang paling cepat. Rina pakai batch prompting:
```
Tulis 12 balasan konfirmasi pembayaran. Setiap balasan: akui transfer,
sebutkan estimasi kirim 1-2 hari kerja, ucapkan terima kasih.
Format: singkat, maks 3 kalimat, bahasa santai.

Nama pembeli:
1. Dinda - transfer Rp 189.000 - Kemeja Linen Putih
2. Sarah - transfer Rp 245.000 - Dress Midi Floral
[lanjut sampai 12]
```

**Lain-lain (3 email)** — dibalas manual, tidak butuh Claude.

Total waktu: 28 menit untuk 23 email.

---

### Step 3 — 10 Deskripsi Produk Sekaligus
*Modul yang dipakai: M05 Batch Prompting*

```
Tulis deskripsi produk Tokopedia untuk 10 produk berikut.
Format per produk:
- Judul listing: maks 60 karakter, sertakan kata kunci pencarian
- Deskripsi: 3 kalimat — bahan, kecocokan, dan keunggulan produk
- Highlight: 4 bullet point singkat

Produk koleksi Summer Linen Kasual Studio:
1. Kemeja linen putih, bahan 100% linen, adem, cocok kerja & weekend
2. Celana kulot krem, pinggang elastis, all size S–XL
3. Dress midi sage green, lengan panjang, bahan linen mix
4. Blouse off-white, kerah V, bahan linen ringan
5. Co-ord set linen hitam (atasan + celana), tersedia 3 warna
6. Jumpsuit linen dusty pink, tali adjustable, one size
7. Rok midi linen stripe, zipper belakang, panjang di bawah lutut
8. Kemeja oversized linen biru muda, fit boxy, cocok jadi outer
9. Set piyama linen krem, nyaman untuk tidur & santai di rumah
10. Dress mini linen terracotta, lengan balon, cocok acara kasual
```

10 deskripsi siap upload dalam 4 menit.

---

### Step 4 — Analisis Data Penjualan Bulan Lalu
*Modul yang dipakai: M04 Google Sheets + Claude*

Rina buka Sheets, copy 10 baris data penjualan terlaris:

```
Ini data penjualan Kasual Studio bulan Juni:
[paste data: nama produk, jumlah terjual, revenue, stok tersisa]

Analisis:
1. Produk mana yang paling cepat habis (perlu restock segera)?
2. Produk mana yang stagnan (perlu promosi atau diskon)?
3. Berdasarkan tren ini, koleksi warna apa yang sebaiknya saya tambah bulan depan?
```

Claude memberikan analisis + 3 rekomendasi konkret. Total waktu: 8 menit termasuk copy-paste data.

---

### Step 5 — Proposal Reseller Yogyakarta
*Modul yang dipakai: M06 Prompt Chaining*

Ini yang paling kompleks — Rina pakai chain 4 step (persis seperti yang dipelajari di M06):

**Step 1:** Profil calon reseller berdasarkan email mereka
**Step 2:** Kerangka proposal yang menjawab kekhawatiran mereka
**Step 3:** Tulis proposal lengkap
**Step 4:** Review — identifikasi 3 bagian lemah dan perkuat

Total waktu: 22 menit untuk proposal yang biasanya butuh 2 jam.

---

### Step 6 — Konten Instagram Hari Ini
*Modul yang dipakai: M01 Role Prompting (via Claude Project)*

Karena Project sudah terkonfigurasi, prompt-nya pendek:

```
Tulis caption Instagram untuk kemeja linen putih dari koleksi summer baru.
Hook tentang "senin yang adem". Sertakan CTA untuk DM.
```

Done. 45 detik.

---

### Rekap: Apa yang Baru Saja Terjadi

> [VISUAL: Tabel ringkasan — 6 kolom: Tugas | Modul | Waktu Biasa | Waktu dengan Claude | Hemat]

| Tugas | Modul | Biasa | Dengan Claude |
|-------|-------|-------|---------------|
| 23 email | M01 + M03 + M05 | 2 jam | 28 menit |
| 10 deskripsi produk | M05 | 40 menit | 4 menit |
| Analisis penjualan | M04 | 45 menit | 8 menit |
| Proposal reseller | M06 | 2 jam | 22 menit |
| Caption Instagram | M01 + M02 | 15 menit | 2 menit |
| **Total** | | **~5,5 jam** | **~64 menit** |

Bukan sihir. Bukan otomasi penuh. Rina tetap yang memutuskan, mereview, dan mengirim semua output.

Yang berubah: Claude mengerjakan bagian yang selama ini memakan waktu paling banyak — memikirkan kata-kata, menyusun struktur, memformat output. Rina fokus ke keputusan dan judgement yang hanya bisa dia yang buat.

---

### ■ TANTANGAN AKHIR

Coba simulasi "Senin Rina" versimu sendiri.

Pilih satu hari kerja sibuk yang akan datang. Sebelum mulai, list semua tugas yang perlu diselesaikan hari itu. Tandai mana yang bisa dibantu Claude (pakai modul mana) dan mana yang tidak.

Kerjakan semua tugas Claude-nya — catat waktu aktual.

### ■ OUTPUT YANG DIHARAPKAN

Satu hari kerja selesai lebih awal dari biasanya. Catat berapa jam yang berhasil kamu hemat.

---

## PENUTUP & CHECKLIST PENGUASAAN

Kamu sudah selesaikan 6 modul K2. Gunakan checklist ini untuk memastikan kamu benar-benar bisa — bukan sekadar sudah nonton.

**01 Role Prompting**
☐ Bisa tulis prompt dengan 4 elemen tanpa melihat contoh
☐ Punya 1 template prompt yang sudah terbukti bekerja untuk tugasmu
☐ Kalau output kurang tepat, tahu cara perbaiki prompt (bukan ganti baru)

**02 Claude Projects**
☐ Punya minimal 1 Project aktif dengan System Instructions terisi
☐ Sudah test 3+ prompt di project tanpa briefing ulang
☐ Bisa jelaskan bedanya chat biasa vs. project ke orang lain

**03 Gmail + Claude**
☐ Bisa proses 3 email dalam 10 menit (rata-rata)
☐ Punya template prompt untuk tipe email yang paling sering kamu tulis
☐ Selalu pakai checklist sebelum kirim

**04 Google Sheets**
☐ Bisa minta Claude buat formula dari deskripsi data
☐ Pernah paste data ke Claude dan dapat insight bisnis dari sana
☐ Tahu data apa yang aman vs. tidak untuk dibagikan

**05 Batch Prompting**
☐ Sudah proses minimal 5 item sekaligus dengan 1 prompt
☐ Punya minimal 1 template batch prompt yang tersimpan
☐ Tahu kapan batch prompting tidak cocok dipakai

**06 Prompt Chaining**
☐ Sudah buat chain minimal 3 step dalam satu chat
☐ Bisa identifikasi kapan 1 prompt tidak cukup dan chain diperlukan
☐ Output dari chain lebih baik dari 1 prompt langsung

---

**07 Case Study**
☐ Sudah simulasi "hari kerja sibuk" dengan Claude
☐ Bisa identifikasi tugas mana yang cocok untuk modul mana
☐ Catat waktu aktual yang dihemat dibanding biasanya

---

Setelah semua checklist ini selesai, kamu siap lanjut ke **K3 — Content & Marketing**, di mana kamu akan pakai Claude untuk strategi konten, iklan, dan pemasaran bisnis.

---
*Draft v1 — untuk review sebelum generate PDF*
*Tandai revisi dengan: `[REVISI: tulis perbaikannya di sini]`*
