# K2 · Produktivitas Kantor — Improved Content Draft
> **Persona ilustratif:** Rina, owner UMKM fashion online "Kasual Studio" — jual pakaian kasual wanita via Instagram & Tokopedia, tim 2 orang, sehari-hari: balas pesan pelanggan, buat konten, analisis penjualan, koordinasi supplier. Dipakai sebagai contoh berjalan di sebagian besar modul.
>
> **Persona file latihan Modul 2:** file `k2-m2-referensi-project.txt` yang didownload siswa memakai profil **PT Kreatif Digital** (agensi digital marketing) — sengaja beda dari Kasual Studio, supaya siswa yang belum punya data bisnis sendiri tetap bisa langsung praktik dengan Claude Project yang sudah terisi penuh.
>
> **Struktur kursus: 7 modul aktif** (Modul 1–7, diakhiri di Modul 7 "Dokumen & Riset" lalu form feedback). **Catatan penting:** ada 1 panel "Case Study: Satu Hari Kerja Penuh" (2 skenario — Rina/Kasual Studio dan Budi/Konsultan Freelance) yang masih ada di HTML tapi **sudah di-archive dari alur pembelajaran aktif** (ditandai `ARCHIVED` di kode, disimpan untuk kemungkinan dipakai lagi di section studi-kasus terpisah nanti). Draft ini hanya mencakup 7 modul yang benar-benar live.
>
> **Review notes:** Tandai bagian yang perlu diubah dengan `[REVISI: ...]`

---

## HALAMAN JUDUL

**K2 · Produktivitas Kantor**
Intermediate

**Tagline:** Kurangi 2 jam kerja harianmu — tanpa tools baru, tanpa kursus coding.

**7 Modul:**
01 Role Prompting — framework 4 elemen yang jadi dasar semua modul berikutnya
02 Claude Projects — setup sekali, Claude ingat bisnismu selamanya
03 Gmail + Claude — dari 15 email, 12 selesai dalam 10 menit
04 Spreadsheet & Claude — laporan 2 jam jadi 15 menit
05 Batch Prompting — 20 output dari 1 prompt
06 Prompt Chaining — output kompleks dari langkah sederhana
07 Dokumen & Riset — meeting notes, ringkasan, SWOT, SOP, semua 3× lebih cepat

---

## PENGANTAR

Kamu tidak perlu belajar tools baru untuk produktif dengan Claude. Semua yang ada di modul ini bekerja dengan apps yang sudah kamu pakai setiap hari — email, spreadsheet, dokumen.

Modul 1 mengajarkan satu framework yang jadi dasar semua modul berikutnya. Modul 2 memperkenalkan Claude Projects supaya kamu tidak perlu briefing ulang tiap sesi. Modul 3–4 aplikasikan ke tools sehari-hari (email, spreadsheet). Modul 5–6 mengalikan hasilnya (batch, chaining). Modul 7 menutup dengan kategori kerja "berpikir" — meeting notes, ringkasan, riset, SOP.

Ikuti urutan modul. Setiap latihan dirancang untuk langsung pakai di kerjaan nyata — bukan contoh fiktif.

---

## MODUL 01 · Role Prompting

### Masalah yang Diselesaikan

Prompt singkat seperti "buatkan caption" memaksa Claude menebak-nebak konteks yang sebenarnya cuma kamu yang tahu — hasilnya sering generik dan perlu ditulis ulang. Role prompting menyelesaikan ini dengan memberi Claude peran, konteks, dan instruksi yang jelas sejak awal, mirip briefing ke rekan kerja baru: makin spesifik briefing-nya, makin sedikit revisi yang dibutuhkan. **Setelah modul ini:** kamu punya framework 4 elemen yang jadi dasar untuk hampir semua modul berikutnya.

### Framework: 4 Elemen Prompt

- **ROLE — Siapa Claude dalam situasi ini?** *"Kamu adalah copywriter fashion yang paham pasar Gen Z Indonesia."*
- **KONTEKS — Situasi, latar, info relevan** *"Toko saya jual pakaian kasual wanita, harga Rp 150–350rb, beli lewat DM Instagram."*
- **TUGAS — Satu instruksi utama yang jelas** *"Tulis caption Instagram untuk koleksi baru: kemeja linen putih."*
- **FORMAT — Panjang, struktur, tone, bahasa** *"Maks 80 kata, 1 hook kuat di baris pertama, 3 hashtag relevan, bahasa Indonesia santai."*

### Sebelum vs. Sesudah

**❌ SEBELUM (prompt lama):** "Buatkan caption Instagram untuk baju baru saya"
Hasil: caption generik, tidak ada hook, hashtag tidak relevan, harus ditulis ulang. Waktu terbuang: 20 menit edit.

**✅ SESUDAH (4-elemen prompt):** "Kamu adalah copywriter fashion Gen Z Indonesia. Toko saya jual baju kasual wanita harga Rp 150–350rb via DM Instagram. Tulis caption untuk kemeja linen putih — koleksi summer. Maks 80 kata, hook kuat, 3 hashtag, bahasa santai."
Hasil: caption siap posting dalam 30 detik. Hemat 18 menit per caption.

### Cheat Sheet — Copy dan Simpan

```
ROLE:    "Kamu adalah [jabatan/keahlian] yang [spesialisasi]."
KONTEKS: "[Situasi saat ini / info bisnis / latar penerima]"
TUGAS:   "[Satu instruksi utama — buat / tulis / analisis / ringkas]"
FORMAT:  "[Panjang] · [Struktur] · [Tone] · [Bahasa]"
```

**Tips Perbaikan:** Tidak perlu urutan persis. Yang penting 4 elemen hadir. Kalau hasilnya kurang tepat: identifikasi elemen yang hilang — lalu tambahkan. Jangan ganti prompt dari nol.

### ■ LATIHAN

**Contoh skenario** (kalau belum ada tugas mendesak): Kasual Studio dapat DM Instagram — *"Kak, badan aku agak berisi, kemeja linen size M kira-kira muat gak ya? Terus warna apa yang gak gampang keliatan kotor?"* Pakai skenario ini, atau pilih 1 pesan/dokumen lain yang perlu kamu buat hari ini — bisa email, caption, balasan komplain, atau laporan singkat. Tulis prompt menggunakan 4 elemen. Kirim ke Claude. Kalau hasilnya belum tepat, tanya diri sendiri: *elemen mana yang kurang spesifik?* Tambahkan info itu dan coba lagi.

### ■ OUTPUT YANG DIHARAPKAN

1 draft pesan siap kirim — kalau kamu pakai skenario di atas, artinya 1 balasan DM Instagram yang menjawab pertanyaan pelanggan dan mengarahkan ke pembelian, tanpa perlu diedit ulang.

---

## MODUL 02 · Claude Projects

### Masalah yang Diselesaikan

Chat biasa di Claude tidak menyimpan konteks — tiap sesi baru berarti mulai dari nol lagi: jelaskan bisnismu, tentukan tone, jelaskan produk, dari awal. Claude Projects menyimpan semua itu sekali, lalu otomatis aktif di setiap chat baru dalam project yang sama. **Setelah modul ini:** kamu setup 1 project sekali, dan setiap chat berikutnya langsung "ngerti" konteks bisnismu tanpa briefing ulang.

### Chat Biasa vs. Claude Projects

**Chat Biasa**
- Memori direset setiap sesi baru
- Harus briefing ulang setiap kali buka chat
- Claude tidak ingat nama toko, produk, atau tone
- Tidak bisa simpan file referensi secara permanen

**Claude Projects**
- Memori permanen — ingat semua konteks bisnismu
- Sekali setup, selamanya aktif di semua sesi
- Bisa simpan tone, format, dan file referensi
- Langsung kerja tanpa briefing ulang

### Contoh yang Bisa Disimpan di Project

Nama & info bisnis · Tone bahasa · Format output · Price list · Template SOP

### Cara Setup Project — 3 Langkah

1. Klik "New Project" di sidebar kiri Claude → beri nama (misal "Latihan Modul 2")
2. Download **k2-m2-referensi-project.txt** dari halaman materi → paste seluruh isinya ke "Project Instructions"
3. Mulai chat. Tidak perlu briefing ulang lagi.

### ■ LATIHAN

Setup Claude Project pertamamu sekarang pakai **k2-m2-referensi-project.txt** — sudah berisi profil lengkap PT Kreatif Digital (agensi digital marketing), jadi kamu tidak perlu punya data bisnis sendiri dulu untuk mulai latihan. Download file-nya, paste ke "Project Instructions", lalu coba 3 prompt pendek tanpa briefing, misalnya: *"Tulis caption promo diskon 20% untuk klien F&B"*, *"Balas email klien yang komplain laporan bulanan terlalu teknis"*, atau *"Buatkan 3 poin highlight untuk laporan bulanan klien fashion"*. Perhatikan: Claude langsung paham konteks PT Kreatif Digital tanpa kamu jelaskan ulang.

### ■ OUTPUT YANG DIHARAPKAN

1 Claude Project aktif dengan System Instructions dari k2-m2-referensi-project.txt. Sudah coba minimal 3 prompt pendek dan Claude merespons sesuai konteks PT Kreatif Digital tanpa briefing ulang.

### Selanjutnya: Bikin Versi Bisnismu Sendiri

**Template (isi sesuai bisnismu):**
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

**Contoh Rina — Kasual Studio:**
```
# Tentang Bisnis
Nama: Kasual Studio — pakaian kasual wanita, basic & trendy
Target: wanita 20–32 tahun, Gen Z & Millennial
Harga: Rp 150.000–350.000 | Channel: Instagram DM & Tokopedia

# Tone: Bahasa Indonesia santai, hangat, relatable. Pakai "kamu" bukan "Anda".
# Format: Caption IG maks 80 kata + 5 hashtag. Balasan komplain: mulai dengan empati, lalu solusi konkret.
```

### Dengan Project, Prompt Jadi Super Pendek

**Tanpa Project:** "Kamu adalah copywriter fashion. Toko saya namanya Kasual Studio, jual baju kasual wanita, target Gen Z, harga 150–350rb. Tulis caption untuk..."

**Dengan Project:** "Tulis caption untuk kemeja linen putih baru — koleksi summer." Sama hasilnya. Hemat 3–5 menit briefing setiap sesi.

> **📎 Ganti ke Data Bisnismu:** Setelah terbiasa lewat latihan k2-m2-referensi-project.txt di atas, ganti isi Project Instructions dengan data bisnismu sendiri — pakai template di atas sebagai kerangka. Project ini yang akan kamu pakai terus di modul-modul berikutnya.

---

## MODUL 03 · Gmail + Claude

### Masalah yang Diselesaikan

Menulis balasan email yang tepat — nada yang pas, informasi lengkap, tidak bertele-tele — biasanya makan waktu lebih lama dari yang seharusnya. Claude bisa bantu susun draft balasan dalam hitungan detik: kamu kasih konteks singkat soal email dan tujuan balasannya, Claude yang menyusun kalimatnya. **Setelah modul ini:** email yang biasanya kamu tulis dari nol selesai dalam hitungan menit — kamu tetap yang menentukan isi dan nadanya, bukan Claude.

### Workflow Email dengan Claude — 4 Langkah dari Inbox ke Terkirim

1. **Baca Email** — Buka email masuk. Pahami inti pesan: apa yang diminta, siapa pengirimnya, seberapa urgent.
2. **Tulis Prompt** — Ceritakan konteks ke Claude: email dari siapa, isinya apa, tone yang diinginkan. Pakai 3 Elemen Wajib.
3. **Baca & Edit** — Baca output Claude. Tambahkan info personal atau detail spesifik yang hanya kamu tahu. Sesuaikan jika perlu.
4. **Kirim** — Lakukan checklist sebelum kirim. Pastikan nama, detail, dan tone sudah sesuai. Baru tekan "Send".

### 3 Elemen Wajib Prompt Email

- **A. Konteks Penerima** — Siapa yang menerima? Hubungan apa (klien baru, supplier lama, pelanggan kecewa)? Tingkat formalitas yang sesuai?
- **B. Inti Pesan** — Apa yang ingin disampaikan? Satu kalimat yang merangkum tujuan email ini.
- **C. Tone & Panjang** — Formal / santai / tegas / empati? Maks berapa kata? Ada CTA atau tidak?

### 4 Tipe Email yang Sering Ditulis

**① Balas Pertanyaan / Inquiry**
"[paste email inquiry] Balas email dari [nama] yang tanya tentang [topik]. Berikan info lengkap tapi singkat. Tone: ramah-profesional. Maks 80 kata."

**② Menangani Komplain**
"[paste email komplain] Balas komplain dari [nama] soal [masalah]. Mulai dengan empati, akui masalahnya, tawarkan solusi [sebutkan]. Tone: hangat, tidak defensif."

**③ Follow-up & Pengingat**
"[paste email atau catatan follow-up] Kirim follow-up ke [nama] soal [topik] yang belum direspons sejak [tanggal]. Tone: sopan, gentle reminder. Jangan terkesan mendesak."

**④ Konfirmasi & Informasi**
"[paste bukti/detail terkait] Tulis konfirmasi ke [nama] bahwa [detail pesanan/meeting/keputusan] sudah diterima. Sertakan ringkasan poin penting. Singkat, maks 60 kata."

### Checklist Sebelum Kirim

☐ Nama penerima benar (bukan placeholder [nama]) · ☐ Isi email akurat, bukan halusinasi Claude · ☐ Ada CTA yang jelas jika diperlukan · ☐ Tone sudah sesuai: formal / santai / tegas? · ☐ Tidak ada info sensitif yang ikut di-paste ke Claude · ☐ Panjang sudah sesuai, tidak bertele-tele

### ■ LATIHAN

Download file latihan **k2-m3-contoh-inbox.txt** dari halaman materi — isinya 12 email contoh inbox Kasual Studio. Pilih 1 email: (1) identifikasi tipenya — inquiry / komplain / follow-up / konfirmasi, (2) pilih template yang sesuai dari atas dan isi [placeholder] dengan info dari email, (3) paste ke Claude, baca draft, edit seperlunya. Lanjutkan dengan email asli dari inbox kamu sendiri.

### ■ OUTPUT YANG DIHARAPKAN

1 draft balasan email siap kirim. Target: di bawah 3 menit.

> **✏️ Lanjutan — Coba Inbox Kamu Sendiri:** Setelah lancar dengan data contoh, ulangi pola yang sama dengan email asli dari inbox kamu. Ini yang bakal jadi rutinitas harianmu, bukan cuma latihan sekali jalan.

### Level Up: Inbox Triage Board

**🛠️ Bonus: Papan Prioritas, Bukan Cuma Draft Balasan.** Kalau inbox-mu sering menumpuk, minta Claude susun dulu papan prioritasnya sebelum kamu mulai membalas: kolom Urgent, Perlu Dibalas, dan Sekadar Info. Belum sempat connect Gmail? Pakai file contoh **k2-m3-contoh-inbox.txt** untuk latihan.

**Contoh Prompt:** "[paste isi inbox] Kelompokkan semua email ini ke 3 kategori: URGENT (perlu dibalas hari ini), PERLU DIBALAS (bisa besok), SEKADAR INFO (tidak perlu balasan). Buatkan sebagai 1 halaman HTML dengan 3 kolom berwarna berbeda, supaya saya bisa lihat sekilas mana yang harus dikerjakan duluan."

> **✦ TIP — Gmail Langsung dari Claude (MCP Connector):** Selain copy-paste manual, Claude juga bisa terhubung langsung ke inbox Gmail-mu lewat Connector — baca dan susun draft tanpa copy-paste sama sekali. Cara setup dan pemakaiannya dibahas lengkap di modul lain.

---

## MODUL 04 · Spreadsheet & Claude

### Masalah yang Diselesaikan

Spreadsheet — Google Sheets atau Excel, sama saja — menyimpan datamu, tapi menganalisisnya masih manual: bikin formula, cari pola, susun laporan, semua makan waktu. Claude bisa bantu di ketiga langkah itu sekaligus, dan cara promptingnya sama persis di kedua tools: tulis formula dari deskripsi biasa, temukan pola dari data yang kamu paste, dan kasih rekomendasi bisnis konkret. Modul ini pakai Google Sheets sebagai contoh (termasuk 1 bonus otomasi khusus Sheets), tapi kalau kamu di Excel, tinggal sebutkan itu ke Claude dan hasilnya tetap relevan. **Setelah modul ini:** laporan yang biasanya makan waktu berjam-jam selesai dalam hitungan menit — dan kamu tetap yang pegang kendali datanya, bukan Claude.

### Yang Bisa Claude Bantu di Spreadsheet

- **01 Formula** — Claude menulis formula dari deskripsi biasa, menjelaskan formula yang membingungkan, dan membantu debug formula yang error
- **02 Analisis** — Temukan pola dari data penjualan, bandingkan performa antar produk atau periode, dan identifikasi anomali yang mudah terlewat
- **03 Rekomendasi** — Dari data ke keputusan bisnis konkret — produk mana yang perlu direstock, dipromosikan, atau dihentikan

### Data Aman vs. Data Sensitif

**✅ AMAN Dibagikan:** Nama produk, kategori, harga · Jumlah penjualan per periode · Data performa (tanpa nama pelanggan) · Struktur kolom dan formula

**⚠️ HINDARI Dibagikan:** Nama lengkap + nomor telepon pelanggan · Nomor kartu kredit / rekening · Password atau API key · Data karyawan dengan info personal

### Latihan — Langkah demi Langkah (Praktik dengan Data Kasual Studio)

1. **Download file-nya.** Download **k2-data-latihan-sheets.csv** dari halaman materi — data transaksi Kasual Studio (April–Juli 2026, ~180 baris: Tanggal, Order ID, Produk, Region, Sales, Qty, Harga Satuan, Total).
2. **Upload ke Claude.** Buka claude.ai, mulai chat baru. Drag & drop file CSV tadi ke jendela chat (atau klik ikon 📎 attach di kolom chat untuk upload manual).
3. **Kirim 3 prompt di bawah, satu per satu.** Tetap di chat yang sama — Claude tetap "ingat" datamu sepanjang percakapan, tidak perlu upload ulang.

**Prompt 1 — Formula:** "Data saya di spreadsheet punya kolom: Tanggal, Order ID, Produk, Region, Sales, Qty, Harga Satuan, Total. Buatkan formula SUMIF untuk hitung total revenue per Produk, dan total revenue per Region. Saya pakai Google Sheets (sebutkan kalau kamu pakai Excel)."

**Prompt 2 — Analisis & Rekomendasi:** "Dari data transaksi yang saya kasih tadi: produk dan region mana yang paling laris? Ada tren naik atau turun? Sales mana yang paling produktif? Kasih rekomendasi langkah berikutnya."

**Prompt 3 — File Excel Ringkasan:** "Dari analisis dan rekomendasi tadi, buatkan saya file Excel ringkasan yang bisa saya bagikan ke tim: sheet 1 ringkasan per Produk (qty + revenue), sheet 2 ringkasan per Region, sheet 3 insight & rekomendasi dalam poin-poin. Format rapi."

> **📌 Tips:** Prompt 1 hasilnya formula — kamu salin manual ke sheet-mu sendiri. Prompt 3 beda: Claude langsung generate file **.xlsx** yang muncul sebagai lampiran di chat, tinggal klik download — tidak perlu disalin manual.

> **💾 Sudah Connect Google Drive ke Claude?** Kalau Google Drive sudah terhubung ke akun Claude-mu (dan fitur "Code execution and file creation" aktif di Settings → Capabilities — nyala secara default di paket Free/Pro/Max), kamu tidak harus download file Excel dari Prompt 3. Minta langsung: *"Simpan file ringkasan ini ke Google Drive saya sebagai Google Sheet."* Claude akan menyimpannya langsung ke Drive-mu, dan otomatis jadi Google Sheet asli — bukan cuma file .xlsx yang perlu kamu convert manual.

### ■ OUTPUT YANG DIHARAPKAN

Formula SUMIF yang siap kamu paste ke sheet-mu sendiri, insight & rekomendasi dari Claude di chat, dan 1 file Excel ringkasan (bisa langsung didownload) yang dibuatkan Claude dari hasil analisis.

### 🛠️ Bonus — Automasi Workflow: Menu "Export PDF" di Google Sheets

Google Apps Script yang menambahkan menu "Export PDF" ke Sheets-mu — cuma 2 klik: **"1. Update Formatting"** untuk otomatis menambah judul laporan, merapikan kolom Total jadi format Rupiah, dan memberi conditional formatting, lalu **"2. Export ke PDF"** untuk langsung export sheet aktif jadi PDF rapi ke Drive. Dibuat dengan memprompt Claude langsung — tidak ada API key atau paket Pro yang dibutuhkan.

Bukan Claude yang jalan di dalam Sheets-mu — tapi Claude yang menulis automasinya untukmu. Script ini awalnya dibuat dengan cara memprompt Claude langsung, lalu tinggal di-paste ke Apps Script sekali. **Catatan:** ini otomasi khusus Google Sheets. Kalau kamu di Excel, konsepnya sama tapi toolnya beda — minta Claude tulis versi VBA macro dengan prompt yang serupa.

**Prompt yang Dipakai untuk Generate Script Ini:** "Buatkan saya Google Apps Script untuk Google Sheets dengan menu custom "Export PDF" berisi 2 menu saja: (1) "Update Formatting" — otomatis deteksi tabel data (cari kolom bernama "Total" dan "Harga Satuan" di header, tidak perlu select range manual), tambahkan 1 baris judul laporan (nama sheet + tanggal hari ini, diberi warna dan bold) di paling atas, rapikan kolom Total/Harga Satuan jadi format Rupiah, dan beri conditional formatting warna skala pada kolom Total; (2) "Export ke PDF" — export sheet aktif jadi 1 file PDF rapi (tanpa gridlines, fit ke lebar halaman), disimpan ke folder khusus di Drive dengan link untuk membukanya. Tidak boleh pakai API key eksternal apapun — cukup fitur bawaan Apps Script dan Drive."

> **✏️ Mau Versimu Sendiri?** Kamu tidak harus pakai script k2-pdf-export-helper.txt persis apa adanya — paste prompt di atas ke Claude dan minta modifikasi sesuai kebutuhanmu. Contoh: *"tambahkan nama toko di judul PDF-nya"*, *"ubah warna grafik jadi hijau"*, atau *"export ke folder Drive tertentu, bukan folder baru"*. Claude akan tulis ulang scriptnya untukmu — kamu tinggal paste versi barunya ke Apps Script.

**Cara Install — 6 Langkah** (file k2-pdf-export-helper.txt cuma teks biasa, buka dengan Notepad/TextEdit — tidak perlu software tambahan):
1. Download k2-pdf-export-helper.txt dari halaman materi (atau pakai versi hasil promptmu sendiri ke Claude)
2. Klik kanan file-nya → Open with → pilih Notepad (Windows) atau TextEdit (Mac)
3. Select All (Ctrl+A / Cmd+A) lalu Copy (Ctrl+C / Cmd+C) seluruh isinya
4. Buka Google Sheets-mu → Extensions → Apps Script → hapus kode default → Paste isi yang tadi di-copy
5. Klik Save (ikon disket atau Ctrl+S), lalu tutup tab Apps Script
6. Refresh halaman Google Sheets → menu "Export PDF" muncul di menu bar. Saat pertama dipakai, klik Allow saat Google minta izin akses (normal, script perlu izin baca sheet & simpan ke Drive-mu)

**Cara Pakai — 2 Langkah Sebelum Export:**
1. *Update Formatting* — Klik sel mana saja di dalam tabel data kamu (tidak perlu select range manual) → jalankan "1. Update Formatting". Script otomatis mendeteksi kolom Total & Harga Satuan, menambah judul laporan, merapikan angka jadi Rupiah, dan memberi conditional formatting pada kolom Total.
2. *Export ke PDF* — Jalankan "2. Export ke PDF" — judul dan formatting dari langkah 1 ikut ter-export karena semuanya bagian dari tampilan sheet

> **👀 Contoh Hasil:** Kalau kamu jalankan alur ini pakai k2-data-latihan-sheets.csv, hasil PDF-nya berupa: judul "Kasual Studio — Laporan [tanggal]" dengan latar ungu, dan kolom Total dengan angka Rupiah rapi (Rp 12.375.000, bukan 12375000 — total revenue produk terlaris di data latihan) plus conditional formatting warna skala.

> **💳 Soal Biaya:** Beda dengan bonus versi sebelumnya (yang butuh API key berbayar dari console.anthropic.com), script ini tidak memanggil Claude API sama sekali — cuma pakai fitur bawaan Google Apps Script dan Google Drive. 100% gratis, tidak butuh paket Claude Pro, dan tidak ada biaya pemakaian apapun di luar akun Google-mu sendiri.

### ✦ TIP — Claude di Sheets, Excel Online, & Excel Desktop

- **🌐 Claude in Chrome** — Bisa baca & isi formula langsung di Google Sheets atau Excel Online (versi browser) tanpa copy-paste. **Butuh paket Pro atau lebih tinggi — tidak tersedia di paket Free.** Setup: Chrome Web Store → cari "Claude" → install "Claude for Chrome" (dari Anthropic) → login → buka Sheets/Excel Online → klik ikon Claude di toolbar → panel Claude muncul di sisi kanan. Setelah setup: *"Lihat sheet yang terbuka. Buatkan formula total revenue per produk di kolom yang saya tunjuk."*
- **🖥️ Claude for Excel** — Pakai Excel Desktop (Windows atau Mac)? Itu tool yang beda — ada add-in terpisah bernama "Claude for Excel", diinstall langsung dari Microsoft Marketplace, yang kerja di dalam Excel-nya sendiri (bukan lewat browser). Juga khusus paket Pro ke atas.

---

## MODUL 05 · Batch Prompting

### Masalah yang Diselesaikan

Batch prompting adalah cara memberi Claude satu set instruksi + daftar item sekaligus, supaya semuanya diproses dalam satu kali jalan — bukan satu per satu secara manual. Cocok untuk pekerjaan apapun yang butuh **perlakuan sama** di banyak item: deskripsi produk, ringkasan review, balasan template, kategori data, dan sejenisnya. **Contohnya:** 20 item yang butuh diproses satu-satu — dengan cara biasa: 20 prompt terpisah, 20 copy-paste, 40 menit. Dengan batch prompting: 1 prompt, 20 hasil, 5 menit.

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

### 4 Contoh Langsung Pakai

**① Deskripsi Produk Tokopedia:** "Tulis deskripsi produk Tokopedia untuk setiap item berikut. Format per produk: Nama, Deskripsi (2 kalimat manfaat + 1 kalimat CTA, maks 50 kata), Highlight (3 bullet point keunggulan). Produk: 1. Kemeja linen putih... [lanjutkan sampai semua produk]"

**② Klasifikasi Pesan (DM/WA):** "Klasifikasikan setiap pesan berikut ke dalam salah satu kategori: KOMPLAIN / PERTANYAAN / PUJIAN / PERMINTAAN. Format: Nomor | Kategori | Tingkat urgensi (Segera/Normal/Rendah). Pesan: 1. ... [lanjutkan]"

**③ Ringkasan Email Masuk:** "Ringkas setiap email berikut dalam 1 kalimat. Sebutkan: siapa pengirim + apa yang mereka minta/sampaikan. Email 1: [paste email] ..."

**④ 5 Variasi Caption dari 1 Konsep:** "Buat 5 variasi caption Instagram untuk produk yang sama. Tiap variasi: hook berbeda, tone berbeda (santai/inspiratif/edukatif/FOMO/relatable). Semua: maks 60 kata + 3 hashtag."

### ⚠️ Kapan TIDAK Pakai Batch Prompting

- Kalau setiap item butuh konteks yang sangat berbeda satu sama lain
- Kalau output satu item bergantung pada output item lain
- Kalau kamu butuh review mendalam per item (bukan proses cepat)
- Kalau jumlah item lebih dari ~30 (pecah jadi beberapa batch)

### ■ LATIHAN

Pilih 5–10 item sejenis dari pekerjaanmu: deskripsi produk, email template, ringkasan, atau apapun. Belum ada bahan sendiri? Pakai **k2-m5-latihan-batch.txt** dari halaman materi (4 set latihan: deskripsi produk, ringkasan email, klasifikasi pesan DM/WA, variasi caption). Tulis satu batch prompt dengan instruksi + format + semua item. Proses sekaligus. Simpan prompt tersebut sebagai template — pakai lagi kapanpun perlu.

### ■ OUTPUT YANG DIHARAPKAN

5–10 output terproses sekaligus. 1 template prompt tersimpan untuk dipakai lagi.

### Level Up: Batch Output Tracker

**🛠️ Bonus: Jangan Cuma Scroll 20 Hasil.** Batch prompting menghasilkan banyak output sekaligus — tapi kalau cuma jadi teks panjang, gampang lupa mana yang sudah diproses. Minta Claude susun hasilnya sebagai daftar tercentang, supaya kamu bisa pantau progres saat menindaklanjuti satu per satu (kirim, posting, atau balas).

**Contoh Prompt:** "Dari hasil klasifikasi 10 pesan tadi (Latihan C di k2-m5-latihan-batch.txt), buatkan saya 1 halaman HTML: daftar tercentang per pesan, dengan kategori dan urgensi sebagai label warna, dan checkbox 'sudah ditindaklanjuti'. Simpan sebagai 1 file yang bisa saya buka sambil kerja menyelesaikan satu per satu."

---

## MODUL 06 · Prompt Chaining

### Masalah yang Diselesaikan

Prompt chaining adalah cara memecah tugas kompleks jadi beberapa step berurutan dalam satu chat yang sama — output dari satu prompt jadi input untuk prompt berikutnya, dan setiap step membangun di atas konteks yang sudah ada. Cocok untuk output yang terlalu kompleks untuk 1 prompt, tugas yang punya tahapan logis (riset → draft → review → finalisasi), atau saat 1 prompt langsung menghasilkan hasil yang dangkal dan generik. **Contohnya:** mau buat proposal kerjasama untuk reseller potensial — dengan 1 prompt langsung, hasilnya generik dan dangkal. Dicicil jadi chain 4 step, setiap step membangun di atas yang sebelumnya — hasilnya jauh lebih kuat.

### Contoh Nyata: Proposal Reseller — Chain 4 Step

**Step 1 — Riset & Profil Calon Reseller:** "Saya akan buat proposal kerjasama reseller untuk Kasual Studio (brand fashion kasual wanita, harga Rp 150–350rb). Calon reseller: toko fashion di Bandung, sudah 2 tahun berjualan, follower IG 8.000, fokus ke pasar mahasiswi. Buat: (1) profil calon reseller berdasarkan info ini, (2) apa yang kemungkinan mereka cari dari kerjasama, (3) kekhawatiran yang mungkin mereka punya."

**Step 2 — Kerangka Proposal (gunakan output Step 1):** "Berdasarkan profil dan kebutuhan reseller tadi, buat kerangka proposal kerjasama yang menjawab kekhawatiran mereka. Sertakan: penawaran harga grosir, minimum order, keuntungan eksklusif reseller, dan cara mulai. Formatnya: 5 section dengan heading."

**Step 3 — Tulis Proposal Lengkap:** "Tulis proposal lengkap berdasarkan kerangka tadi. Tone: profesional tapi hangat. Panjang: 400–500 kata. Bahasa Indonesia formal."

**Step 4 — Review & Perkuat:** "Identifikasi 3 bagian paling lemah dari proposal ini dan tulis ulang agar lebih meyakinkan. Fokus pada bagian yang bisa membuat reseller ragu."

### 5 Aturan Chain yang Efektif

1. **Tetap di satu chat** — jangan buka chat baru di tengah chain
2. **Review output di setiap step** sebelum lanjut ke step berikutnya
3. **Mulai dari yang luas, semakin spesifik** setiap step
4. **Gunakan "dari hasil tadi..."** untuk merujuk ke output sebelumnya
5. **Step terakhir selalu review** — "identifikasi 3 bagian paling lemah dan perbaiki"

### Ide Chain untuk Bisnismu

- **Konten Bulanan** — Riset trend → Kalender konten → Draft caption → Review & finalisasi
- **Laporan Performa** — Analisis data → Temukan insight → Buat narasi → Slide summary
- **Onboarding Karyawan** — Buat checklist → Tulis SOP → Buat template pertanyaan
- **Pitch atau Proposal** — Riset klien → Kerangka → Draft lengkap → Identifikasi kelemahan

### ■ LATIHAN

Pilih satu tugas yang biasanya kamu kerjakan dalam beberapa langkah terpisah. Buat chain minimal 3 step. Kerjakan dalam satu chat yang sama. Review output di setiap step sebelum lanjut. Bandingkan hasilnya dengan satu prompt langsung — mana yang lebih baik?

### ■ OUTPUT YANG DIHARAPKAN

1 output final dari chain minimal 3 step yang lebih baik dari yang dihasilkan 1 prompt langsung.

### Level Up: Dokumen Jadi, Bukan Cuma Teks Chat

**🛠️ Bonus: Hasil Akhir Chain Bisa Langsung Jadi File.** Proposal hasil chain 4 step di atas masih berupa teks di chat — masih perlu disalin manual ke Word. Langkah terakhir yang sering kelewat: minta Claude langsung hasilkan filenya. Claude bisa membuat Word (.docx) atau PDF asli, lengkap dengan heading dan format rapi, siap dilampirkan ke email tanpa kamu susun ulang.

**Contoh Prompt:** "Dari proposal yang sudah kita perkuat tadi, buatkan sebagai dokumen Word (.docx) yang rapi: judul, heading per section, paragraf yang sudah diformat, dan siap saya lampirkan langsung ke email tanpa perlu saya susun ulang di Word."

---

## MODUL 07 · Dokumen & Riset

### Masalah yang Diselesaikan

Ada satu kategori kerja yang menyita waktu tapi jarang disadari: membaca, meringkas, dan memikirkan sesuatu. Rapat 1 jam yang tidak menghasilkan action items jelas. Dokumen 15 halaman yang harus dibaca sebelum meeting besok. SOP yang tidak pernah sempat ditulis. **Setelah modul ini:** semua pekerjaan "berpikir" ini selesai 3× lebih cepat — bukan karena Claude berpikir untuk kamu, tapi karena Claude membantu menstrukturkan dan mengeksekusi prosesnya.

> **📎 Bahan Latihan:** Belum punya catatan meeting, dokumen, atau proses sendiri untuk dicoba? Download **k2-m7-contoh-dokumen.txt** dari halaman materi — berisi 4 bagian yang cocok untuk masing-masing sub-skill di bawah: catatan meeting, dokumen proposal, bahan SWOT, dan deskripsi proses untuk SOP.

4 sub-skill modul ini: **Meeting Notes** (catatan berantakan → action items terstruktur dalam 2 menit) · **Summarizing** (dokumen 10 halaman → ringkasan 1 halaman untuk ambil keputusan) · **Riset & SWOT** (observasimu + web search + analisis Claude = framework keputusan bisnis, siap jadi slide presentasi) · **SOP Writing** (ceritakan prosesnya → Claude tulis SOP-nya siap pakai).

### 01 — Meeting Notes → Action Items

**Prompt:** "Ini catatan meeting saya dengan supplier kain tadi: [paste catatan — boleh berantakan, boleh campur bahasa]. Tolong buat: 1. Ringkasan keputusan yang disepakati (maks 5 poin), 2. Action items dalam format tabel: Siapa | Apa | Deadline, 3. Pertanyaan yang belum terjawab dan perlu di-follow-up."

> **💡 Tips:** Tidak perlu catatan yang rapi — poin acak, singkatan, bahkan typo tetap bisa diproses. Kalau rapat direkam: transkrip audio dulu, lalu paste hasilnya ke Claude. Minta Claude kirim ulang dalam format "siap dishare ke tim" kalau perlu.

Output: Tabel action items siap dishare ke peserta rapat, dalam waktu di bawah 5 menit sejak rapat selesai.

### 02 — Summarizing Dokumen

**Prompt:** "Ini proposal kerjasama yang saya terima: [paste dokumen]. Saya perlu memutuskan apakah mau lanjut atau tidak. Ringkas dalam format: Apa yang mereka tawarkan (3 poin konkret), Apa yang mereka minta dari saya (3 poin konkret), Hal yang perlu saya perhatikan sebelum setuju, Pertanyaan yang perlu saya tanyakan sebelum tanda tangan."

**4 Variasi Siap Pakai:**
- **Laporan keuangan** — "Highlight 3 angka paling penting dan jelaskan artinya untuk kondisi bisnis saya."
- **Kontrak/perjanjian** — "Apa klausul yang tidak biasa atau perlu saya perhatikan sebelum tanda tangan?"
- **Artikel atau riset panjang** — "Ringkas ide utamanya dalam 5 kalimat. Apa yang relevan untuk bisnis saya?"
- **Email thread panjang** — "Apa inti permasalahan dalam thread ini dan keputusan apa yang sudah disepakati?"

Output: Ringkasan 1 halaman atau kurang — cukup untuk ambil keputusan atau membalas dengan percaya diri.

### 03 — Riset & Analisis (SWOT)

> **📌 Yang Perlu Dipahami:** Analisis paling tajam datang dari observasi langsungmu — harga kompetitor yang kamu lihat sendiri, tren dari pelanggan, atau hal spesifik di lapangan yang tidak akan muncul dari pencarian umum. Riset terbaik terjadi ketika **kamu yang membawa observasi** → Claude yang membantu **menganalisis dan menyusunnya**. Selain SWOT, observasi yang sama juga bisa diminta sebagai competitive brief kalau kamu punya deskripsi kompetitor yang kamu lihat langsung.

**Prompt SWOT:** "Saya mau masuk ke kategori tas kanvas untuk pasar yang sama (wanita 20–32 tahun, harga Rp 150–350rb, Instagram & Tokopedia). Yang sudah saya observasi: [kompetitor yang kamu lihat dan harga mereka], [tren yang kamu tangkap dari Instagram atau pelanggan], [modal dan kapasitas yang kamu miliki], [kekhawatiran yang kamu punya]. Buatkan SWOT analysis untuk keputusan ini. Setiap kuadran: 3–4 poin yang konkret dan spesifik — bukan generik."

Output: SWOT analysis 1 halaman siap dijadikan bahan diskusi atau dasar keputusan bisnis.

**Perkuat Riset dengan Web Search** — Observasi langsungmu tetap yang paling tajam untuk detail spesifik bisnismu, tapi kalau Claude-mu punya fitur web search aktif, kamu bisa minta Claude mencari info terkini untuk melengkapi: tren pasar terbaru, berita industri, atau data publik tentang kompetitor yang belum kamu tahu.

**Prompt:** "Cari informasi terbaru soal tren pasar tas kanvas casual di Indonesia tahun ini, dan kalau ada, data publik tentang kompetitor seperti Kanvas Kita atau Totewear.id. Bandingkan temuanmu dengan observasiku di SWOT tadi — ada yang perlu ditambahkan atau diperbarui?"

> **📎 Perhatikan Ini:** Hasil web search bantu melengkapi gambaran besar, tapi belum tentu setepat observasi langsungmu soal detail spesifik bisnis (harga real yang kamu lihat, komentar pelanggan langsung). Pakai web search untuk konteks tambahan, bukan pengganti observasi lapanganmu. Kalau Claude-mu belum punya fitur web search, cari sendiri di Google lalu paste hasil relevannya ke Claude untuk dianalisis bersama observasimu.

Output: SWOT yang lebih lengkap — gabungan observasi lapanganmu dan konteks pasar terkini dari web search.

**SWOT → Slide Presentasi** — SWOT atau riset yang sudah kamu buat biasanya perlu dipresentasikan — ke partner bisnis, calon investor, atau tim internal. Daripada mengetik ulang manual di PowerPoint, minta Claude langsung susun jadi slide.

**Prompt:** "Dari SWOT tas kanvas yang sudah kita buat tadi, buatkan sebagai file presentasi (.pptx): 1 slide judul, lalu 1 slide per kuadran (Strengths, Weaknesses, Opportunities, Threats) dengan judul singkat dan 3-4 bullet point per slide, dan 1 slide kesimpulan dengan rekomendasi. Desain simpel dan rapi, siap dipakai presentasi atau dipoles lebih lanjut di PowerPoint atau Google Slides."

> **📎 Belum Bisa Bikin File Langsung?** Kalau akun Claude-mu belum bisa langsung membuat file .pptx, prompt yang sama tetap menghasilkan teks terstruktur per slide — tinggal copy-paste manual ke PowerPoint atau Google Slides, judul dan bullet-nya sudah siap pakai.

Output: 1 slide deck ringkas (5–6 slide) siap presentasi, dari riset yang tadinya cuma catatan observasi.

### 04 — SOP Writing

**Prompt:** "Saya mau dokumentasikan proses packing pesanan di toko saya. Prosesnya kira-kira: cek pesanan masuk dari Tokopedia, siapkan produk dari rak, cek kondisi produk (tidak ada cacat, warna sesuai), lipat dengan benar, bungkus bubble wrap untuk produk yang mudah kusut, masukkan nota pembelian dan kartu ucapan kecil, seal packaging dengan lakban bening, tempel label pengiriman, foto produk yang sudah di-pack sebelum diserahkan ke kurir. Tulis ini sebagai SOP yang bisa dibaca pegawai baru. Formatnya: Judul dan tujuan SOP, Alat/bahan yang dibutuhkan, Langkah-langkah bernomor (detail cukup untuk diikuti tanpa penjelasan lisan), Checklist verifikasi di akhir, Kesalahan umum yang harus dihindari."

**Proses Lain yang Bisa Didokumentasikan:**
- **Penanganan Komplain** — Alur dari komplain masuk sampai resolusi dan follow-up
- **Onboarding Reseller** — Proses menerima, verifikasi, dan orientasi reseller baru
- **Konten Instagram** — Cara membuat, review, schedule, dan posting konten harian
- **Cek Stok & Restock** — Prosedur audit stok mingguan dan pemesanan ulang ke supplier

### ■ OUTPUT YANG DIHARAPKAN

1 SOP siap pakai yang bisa langsung diberikan ke pegawai baru atau disimpan sebagai dokumentasi bisnis.

### Level Up: Team Wiki

**🛠️ Bonus: 4 Dokumen Terpisah Jadi 1 Halaman yang Bisa Dibuka Tim.** Meeting notes, ringkasan, SWOT, dan SOP di atas biasanya berakhir sebagai 4 chat terpisah yang gampang hilang. Minta Claude satu langkah lagi: satukan jadi 1 halaman HTML dengan navigasi sederhana — team wiki kecil yang bisa kamu tambah isinya setiap kali menjalankan modul ini lagi.

**Contoh Prompt:** "Dari 4 hasil tadi — ringkasan meeting supplier, ringkasan proposal, SWOT tas kanvas, dan SOP packing — buatkan saya 1 halaman HTML 'Team Wiki' dengan sidebar navigasi ke 4 bagian tersebut. Setiap bagian tampil rapi dengan heading. Simpan sebagai 1 file HTML yang bisa saya buka lagi dan tambahkan dokumen baru tiap minggu."

---

## Kursus Selesai!

Kamu sudah menguasai 7 modul produktivitas. Kurangi 2 jam kerja harianmu — tanpa tools baru, tanpa kursus coding.

**Lanjutkan Belajar:** Kreasi Konten Pemasaran — Positioning, deskripsi produk, konten Instagram, dan copy iklan dengan Claude.

---

## LAMPIRAN (Arsip, Tidak Aktif): Case Study — Satu Hari Kerja Penuh

Panel ini masih ada di `produktivitas-content.html` (id `panel-casestudy-archived`, ditandai `ARCHIVED — removed from active lesson flow` di komentar kode) tapi **tidak lagi bisa diakses lewat alur belajar normal** — sidebar dan tombol "Selanjutnya" di Modul 7 langsung menuju form feedback, bukan ke sini. Dicatat di sini sebagai referensi kalau suatu saat mau diaktifkan lagi sebagai section studi-kasus terpisah, bukan bagian dari 7 modul yang di-generate ke PDF.

Isinya singkat: 2 skenario pilihan (Skenario A — Rina/Kasual Studio: 23 email + 10 deskripsi produk + analisis penjualan + proposal reseller + konten IG dalam 1 hari; Skenario B — Budi/Konsultan Freelance: riset kompetitor + proposal + deck 8 slide + follow-up klien untuk pitching besok pagi), masing-masing berjalan step-by-step lewat semua modul di atas, ditutup rekap waktu "Biasa vs Dengan Claude" dan bonus "Level Up: Daily Command Center" (dashboard HTML gabungan).

---

*(Draft ini konsisten dengan HTML final di produktivitas-content.html per audit 30 Juli 2026 — mencakup 7 modul yang benar-benar live. Perbedaan utama dari draft v1 sebelumnya: M04 berganti nama dari "Google Sheets" jadi "Spreadsheet & Claude" dan mendapat bonus Apps Script PDF-export + Claude in Chrome/Claude for Excel (Pro-only); M05 dan M06 masing-masing dapat 1 section "Level Up" baru; M07 "Dokumen & Riset" adalah modul baru yang sama sekali tidak ada di draft v1; dan Case Study lama (yang di draft v1 jadi M07) sekarang berstatus archived, dipindah ke lampiran non-aktif di atas. PDF hasil render akan dibuat ulang dari draft ini pada tahap berikutnya.)*
