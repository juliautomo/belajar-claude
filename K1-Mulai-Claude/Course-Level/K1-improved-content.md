# K1 · Mulai dengan Claude AI — Improved Content Draft
> **Untuk:** Siapapun yang belum pernah pakai Claude AI sama sekali. **Prasyarat:** Tidak ada — hanya butuh email dan browser. **Tools:** Claude.ai · Claude Artifacts · Google Docs.
>
> **Studi kasus yang dipakai di seluruh modul:** Kamu punya usaha kecil (toko online, resto, atau jasa) dan sering harus membalas chat pelanggan yang bertanya soal produk, harga, atau komplain. Sepanjang Modul 1 sampai 3, kita pakai Claude untuk membantu membalas chat pelanggan itu. Modul 4 dan 5 memperluas ke kebutuhan kerja yang lebih umum — membuat dokumen dan menyatukan semuanya jadi satu alur kerja nyata.
>
> **Review notes:** Tandai bagian yang perlu diubah dengan `[REVISI: ...]`

---

## HALAMAN JUDUL

**Mulai dengan Claude AI**
Panduan lengkap Modul 1–5

01 Apa itu Claude & Setup Akun · 02 Anatomi Prompt yang Menghasilkan Output Bagus · 03 Role Prompting — Claude sebagai Ahli · 04 Claude Artifacts · 05 PRAKTEK: Workflow End-to-End Pertamamu

---

## Cara Pakai Modul Ini

1. Baca penjelasan tiap modul sampai selesai
2. Coba exercise-nya langsung di akun Claude.ai kamu
3. Cek hasilmu dengan bagian "Output yang Diharapkan"
4. Lanjut ke modul berikutnya

---

## MODUL 01 · Apa itu Claude & Setup Akun

### Apa itu Claude?

Claude adalah AI assistant buatan Anthropic yang bisa diajak "ngobrol" lewat teks — kamu ketik pertanyaan atau permintaan, Claude membalas dengan jawaban, tulisan, analisis, atau bahkan dokumen lengkap. Bedanya dengan software biasa: Claude tidak punya menu atau tombol tetap, kamu tinggal jelaskan apa yang kamu mau dengan bahasa sehari-hari.

### Analogi — Claude vs Google Search

Google Search itu seperti bertanya ke pustakawan — dia kasih kamu tumpukan buku yang relevan, tapi kamu yang harus baca dan menyimpulkan sendiri. Claude itu seperti bertanya ke rekan kerja yang sudah baca semua buku itu — dia langsung kasih kesimpulan, draft, atau jawaban yang siap pakai, sesuai konteks yang kamu kasih. Google bagus untuk mencari fakta atau link. Claude bagus untuk **membuatkan sesuatu** — balasan chat, ringkasan, analisis — berdasarkan situasi spesifik kamu.

**Claude vs ChatGPT:** keduanya sama-sama AI chatbot, tapi Claude dikenal lebih hati-hati soal akurasi, gaya tulisannya lebih natural dan tidak kaku, dan punya fitur Projects & Artifacts yang cocok untuk kerja jangka panjang — bukan cuma tanya-jawab sekali lalu selesai.

### Setup Akun Claude.ai Gratis — Langkah per Langkah

1. Buka claude.ai di browser
2. Klik "Sign up" di kanan atas
3. Daftar pakai email / akun Google
4. Cek email, klik link verifikasi
5. Selesai — masuk ke halaman chat

### Gratis vs Pro

**Gratis**
- Limit pesan harian
- Cocok untuk belajar & pemakaian ringan-menengah
- Akses model dasar

**Pro (Berbayar)**
- Limit pesan jauh lebih banyak
- Akses model paling canggih
- Cocok untuk yang pakai Claude tiap hari untuk kerja

> **Catatan:** untuk belajar di kursus ini dan pemakaian ringan-menengah sehari-hari, versi gratis sudah lebih dari cukup. Pertimbangkan upgrade ke Pro kalau kamu sudah pakai Claude setiap hari untuk kerja dan sering kehabisan limit pesan sebelum jam kerja selesai.

### Opsi Lain: Max, Team, Enterprise

Selain Gratis dan Pro, ada 3 opsi lain untuk kebutuhan yang lebih besar:

- **Max** — Limit pesan dan penggunaan jauh lebih tinggi dari Pro, cocok untuk kamu yang pakai Claude sangat intensif sepanjang hari kerja
- **Team** — Untuk perusahaan kecil-menengah, tiap anggota dapat akses penuh plus fitur kolaborasi, admin console, dan keamanan tingkat perusahaan
- **Enterprise** — Untuk organisasi besar yang butuh kontrol akses, audit, dan dukungan implementasi khusus

### Orientasi Interface: Chat, Projects, Memory, Artifacts

- **Chat** — Layar utama tempat kamu ngobrol dengan Claude. Setiap "New Chat" adalah percakapan baru, terpisah dari sebelumnya.
- **Projects** — Folder untuk kerjaan yang berulang, misalnya "Customer Service Toko" — lengkap dengan instruksi standar yang Claude ingat setiap dibuka.
- **Memory** — Claude bisa mengingat konteks dari percakapan sebelumnya (kalau fitur ini aktif), jadi tidak perlu menjelaskan ulang setiap chat baru.
- **Artifacts** — Ketika Claude membuatkan dokumen/kode/tabel panjang, itu muncul di panel terpisah yang bisa diedit, copy, atau download.

### Di Luar 4 Area Utama: Cowork & Claude Code

Selain Chat, Projects, Memory, dan Artifacts, Claude Desktop app juga punya dua area kerja lain yang mungkin kamu temui nanti:

- **Claude Cowork** — Ruang kerja khusus untuk tugas non-teknis yang butuh banyak file dan tools sekaligus, seperti riset panjang atau menyusun dokumen dari berbagai sumber
- **Claude Code** — Asisten coding yang bisa membantu menulis, membaca, dan memperbaiki kode langsung dari terminal, desktop app, atau IDE favoritmu

> **Catatan:** Kursus ini fokus ke Chat, Projects, dan Artifacts dulu — Cowork dan Claude Code adalah pengembangan lanjutan begitu kamu sudah nyaman dengan dasar-dasarnya.

### ■ RINGKASAN MODUL 1

- Claude adalah AI assistant yang membantu kamu *membuat sesuatu*, bukan sekadar mencari informasi
- Setup akun gratis hanya butuh email, 5 langkah selesai
- Ada tier gratis dan Pro — mulai dari gratis dulu, upgrade kalau kebutuhan makin sering
- Interface Claude punya 4 area utama: Chat, Projects, Memory, Artifacts

### ■ EXERCISE

**Prompt:** "Saya punya usaha kecil dan sering harus membalas chat pelanggan. Bisa bantu jelaskan bagaimana kamu bisa membantu saya?"

Buat akun Claude gratis, lalu kirim prompt di atas. Baca jawaban Claude sampai selesai — perhatikan gaya bahasanya dan bagaimana ia menyusun jawaban. Tidak ada jawaban yang benar atau salah — fokuslah membuat prompt yang semakin jelas dan spesifik.

### ■ OUTPUT YANG DIHARAPKAN

Akun Claude aktif + kamu sudah dapat 1 balasan dari Claude dan paham dasar bagaimana ia "berbicara" dan membantu.

### ■ TIPS

Jangan langsung berharap hasil sempurna di prompt pertama — Modul 2 akan mengajarkan cara menyusun prompt yang menghasilkan output jauh lebih baik.

---

## MODUL 02 · Anatomi Prompt yang Menghasilkan Output Bagus

### Apa itu Prompt, dan untuk Apa?

Prompt adalah pesan atau instruksi yang kamu ketik ke Claude — bisa berupa pertanyaan, permintaan, atau tugas. Prompt adalah satu-satunya cara kamu "mengendalikan" Claude — semakin jelas prompt-mu, semakin sesuai hasilnya dengan yang kamu butuhkan.

### Analogi

Anggap prompt sebagai instruksi kerja yang kamu kasih ke karyawan baru — karyawan baru tidak tahu bisnismu, kebiasaanmu, atau standar yang kamu mau. Kalau instruksinya jelas, hasil kerjanya jauh lebih tepat dan kamu tidak perlu revisi berkali-kali.

### 4 Elemen Prompt: Role + Konteks + Tugas + Format

Contoh nyata untuk kasus membalas chat pelanggan (studi kasus toko sepatu online):

- **Role** — "Bertindaklah sebagai customer service yang ramah dan solutif."
- **Konteks** — "Saya jualan sepatu online, pelanggan bernama Rina baru saja komplain sepatunya sobek setelah dipakai 3 hari."
- **Tugas** — "Balas komplain Rina, tawarkan penggantian sepatu baru gratis, minta dia kirim foto kerusakan dulu."
- **Format** — "Tulis sebagai pesan chat WhatsApp, 3-4 kalimat, nada minta maaf tapi tetap profesional."

**Digabung jadi satu prompt:** "Bertindaklah sebagai customer service yang ramah dan solutif. Saya jualan sepatu online, pelanggan bernama Rina baru saja komplain sepatunya sobek setelah dipakai 3 hari. Balas komplain Rina, tawarkan penggantian sepatu baru gratis, minta dia kirim foto kerusakan dulu. Tulis sebagai pesan chat WhatsApp, 3-4 kalimat, nada minta maaf tapi tetap profesional."

### Mengapa "Tolong Buatkan Email" Gagal

Prompt seperti ini terlalu umum — Claude tidak tahu email tentang apa, ke siapa, nada bicaranya seperti apa. Hasilnya jadi generik dan sering harus diedit ulang total. Claude tidak bisa membaca pikiran kamu — semakin lengkap detail yang kamu kasih (nama produk, harga, situasi pelanggan), semakin dekat hasilnya dengan yang kamu butuhkan, dan semakin sedikit revisi.

### Contoh Prompt Buruk vs Prompt Baik untuk 3 Situasi Kerja Nyata

| Situasi | Prompt Buruk | Prompt Baik | Kenapa Berhasil |
|---|---|---|---|
| Pelanggan tanya stok | "Balesin chat ini" | "Saya jualan baju online. Pelanggan tanya apakah size M warna hitam masih ada. Stok masih ada 3. Balas dengan ramah dan singkat, ajak dia checkout." | Ada konteks jelas (produk, stok), tugas spesifik (ajak checkout), dan format (ramah, singkat) |
| Pelanggan komplain | "Buatkan balasan komplain" | "Pelanggan komplain baju yang diterima ukurannya kekecilan. Saya mau tawarkan tukar size gratis. Tulis balasan yang empatik, minta maaf, dan jelaskan cara tukarnya." | Menyebutkan solusi konkret yang mau ditawarkan dan nada yang diinginkan |
| Follow-up pelanggan | "Bikin pesan follow up" | "Pelanggan sudah checkout 3 hari lalu tapi belum bayar. Tulis pesan follow-up yang sopan, tidak memaksa, ingatkan batas waktu pembayaran 24 jam lagi." | Ada detail waktu (3 hari, 24 jam) dan batasan nada (tidak memaksa) |

### Framework R-K-T-F: Role → Konteks → Tugas → Format

Susun promptmu dengan urutan ini setiap kali: mulai dari **Role** (siapa Claude), lalu **Konteks** situasi, **Tugas** yang jelas, tutup dengan **Format** output yang kamu mau.

### ■ RINGKASAN MODUL 2

- Prompt adalah instruksi kamu ke Claude — kualitas prompt menentukan kualitas hasil
- Prompt yang baik punya 4 elemen: Role, Konteks, Tugas, Format
- Prompt yang terlalu umum menghasilkan output generik yang perlu banyak revisi
- Semakin spesifik detail yang kamu berikan, semakin dekat hasilnya dengan kebutuhan aslimu
- Gunakan urutan R-K-T-F (Role → Konteks → Tugas → Format) setiap menulis prompt

### ■ EXERCISE

Ambil prompt buruk ini: *"Balesin chat pelanggan komplain barang rusak"*. Tulis ulang jadi prompt yang baik menggunakan framework R-K-T-F. Sertakan: role yang sesuai, jenis usahamu, apa yang rusak, solusi yang mau kamu tawarkan (ganti barang/refund), dan minta Claude membalas dengan nada empatik.

### ■ OUTPUT YANG DIHARAPKAN

1 prompt lengkap (Role-Konteks-Tugas-Format) yang menghasilkan balasan chat siap kirim ke pelanggan — bukan draft generik yang masih perlu diedit banyak.

### ■ KESALAHAN UMUM

Menulis prompt sepanjang paragraf tapi tanpa struktur jelas. Lebih baik prompt pendek tapi punya role-konteks-tugas-format yang jelas, daripada prompt panjang tapi berantakan.

---

## MODUL 03 · Role Prompting — Claude sebagai Ahli

### Apa itu Role Prompting: "Bertindaklah sebagai [Ahli]"

Role prompting adalah cara kamu "memanggil" versi Claude yang berpikir seperti ahli tertentu — cukup dengan bilang "Bertindaklah sebagai [Ahli]" di awal prompt.

### Analogi

Bayangkan kamu bertanya soal kesehatan kulit ke teman biasa vs ke dokter kulit. Pertanyaannya sama, tapi jawaban dokter kulit akan jauh lebih terstruktur dan mempertimbangkan hal-hal yang tidak kepikiran teman biasa.

### Mengapa Role Prompting Meningkatkan Kualitas Output

Ketika Claude diminta "bertindaklah sebagai konsultan penjualan berpengalaman", ia otomatis menerapkan standar dan sudut pandang bidang itu — pertanyaan apa yang biasanya ditanyakan, hal apa yang perlu dipertimbangkan, bagaimana cara meyakinkan tanpa terkesan memaksa — tanpa kamu harus menjelaskan semua itu secara manual.

### 5 Role yang Paling Berguna

- **Copywriter** — Caption, promo, deskripsi produk yang menjual
- **Analis** — Membaca data penjualan, spreadsheet, atau tren
- **Konsultan** — Saran strategi atau meyakinkan pelanggan
- **Editor** — Memperbaiki tulisan/pesan yang sudah dibuat
- **Guru** — Penjelasan konsep dengan bahasa sederhana

### Cara Chain Role + Tugas + Format dalam Satu Prompt

"Bertindaklah sebagai konsultan penjualan yang persuasif tapi jujur. Tugas kamu: [tugas]. Format: [format]."

Role selalu ditaruh di awal, sebelum tugas dan format, supaya Claude "masuk peran" dulu sebelum mengerjakan.

### Batasan Role Prompting

Meski diberi peran tertentu, Claude tidak akan memberi info yang salah, menyesatkan, atau melanggar prinsip dasarnya hanya karena "diperankan" sebagai sesuatu — role prompting mengubah gaya dan sudut pandang, bukan nilai dasarnya.

### Lihat Bedanya: Tanpa Role vs Dengan Role

Situasi: Pelanggan bingung pilih antara dua tas — mereka tanya, "Mendingan saya beli yang model A atau B ya?"

**Tanpa Role:** "Pelanggan tanya mendingan beli tas model A atau B. Model A lebih murah, model B lebih tahan lama. Bantu jawab pelanggan ini."
Hasil: jawaban netral yang sekadar membandingkan dua produk, terasa seperti daftar spesifikasi.

**Dengan Role:** "Bertindaklah sebagai konsultan penjualan berpengalaman. Pelanggan tanya mendingan beli tas model A atau B. Model A lebih murah, model B lebih tahan lama. Tugas: bantu pelanggan memutuskan dengan menanyakan kebutuhan mereka dulu. Format: balasan chat, ramah, maks 4 kalimat."
Hasil: Claude lebih dulu menggali kebutuhan pelanggan sebelum merekomendasikan — persis cara sales berpengalaman menjual.

### ■ RINGKASAN MODUL 3

- Role prompting = memberi Claude "topi" ahli tertentu di awal prompt
- Role mengubah sudut pandang dan pendekatan Claude, bukan cuma gaya bahasanya
- 5 role paling berguna: copywriter, analis, konsultan, editor, guru
- Role selalu ditulis di awal prompt, sebelum tugas dan format
- Role prompting tidak mengubah prinsip dasar Claude — tetap jujur dan akurat

### ■ EXERCISE

Buat 1 prompt yang menggabungkan role + tugas + format untuk situasi ini: pelanggan bertanya kenapa harga produkmu lebih mahal dari kompetitor. Gunakan role "konsultan penjualan yang persuasif tapi jujur", minta Claude menjelaskan value produkmu tanpa menjelekkan kompetitor, format: balasan chat singkat.

### ■ OUTPUT YANG DIHARAPKAN

1 prompt lengkap dengan role yang jelas + 1 balasan chat dari Claude yang terasa lebih meyakinkan dan strategis dibanding kalau kamu tanya tanpa role.

### ■ TIPS

Simpan role-role yang sering kamu pakai di satu dokumen (Notion/Notepad) supaya tidak perlu mengetik ulang setiap kali — tinggal copy-paste dan sesuaikan situasinya.

---

## MODUL 04 · Claude Artifacts — Output Langsung Jadi Dokumen

### Pernah Capek Copy-Paste Bolak-Balik dari Chat?

Kamu minta Claude buatkan tabel perbandingan, dapat hasilnya di tengah-tengah chat, lalu harus scroll, select, copy, buka Google Docs, paste, rapikan formatnya lagi — dan kalau ada revisi, ulangi semua dari awal. Untuk dokumen panjang (laporan, kode, draft proposal), proses copy-paste manual ini jadi titik paling melelahkan dari pakai AI.

### Apa Itu Artifacts

Canvas terpisah di sisi chat — begitu Claude membuat output yang cukup terstruktur (dokumen, tabel, kode, diagram), ia otomatis muncul di panel sendiri, bukan tercampur di aliran percakapan. Kamu bisa edit langsung di panel itu, minta revisi tanpa kehilangan tampilan sebelumnya, dan export kapan sudah final — tanpa satu kali pun copy-paste manual.

### Kapan Artifacts Muncul Otomatis

Claude memicu Artifacts untuk output yang punya struktur jelas dan cukup panjang untuk berdiri sendiri: tabel data, dokumen multi-bagian, kode program, diagram. Untuk jawaban singkat, Claude tetap menjawab di chat biasa — tapi kamu bisa secara eksplisit minta ("buatkan di Artifacts") kalau ingin memastikan.

### Jenis Artifacts yang Paling Berguna untuk Kerja

- **Markdown** — Dokumen, laporan, SOP, proposal — format paling umum untuk kerja kantoran
- **Tabel** — Perbandingan, tracking, rekap data terstruktur
- **Kode** — Script, formula, atau halaman HTML sederhana
- **SVG / Diagram** — Flowchart, struktur organisasi, alur proses

### ■ KESALAHAN UMUM MEMAKAI ARTIFACTS

- **Tidak memanfaatkan iterasi** — merasa harus minta ulang dari nol kalau ada bagian yang kurang pas, padahal cukup minta revisi bagian tertentu
- **Lupa Artifacts tetap perlu direview** — tampilannya rapi seperti dokumen jadi, sering dianggap otomatis benar padahal isinya tetap perlu dicek
- **Tidak export, cuma screenshot** — kehilangan format asli yang bisa di-edit atau di-copy sebagai teks

### Contoh Prompt: Biasa vs Eksplisit Minta Artifacts

**Prompt Biasa:** "Bandingkan 5 fitur Claude dengan ChatGPT"
Hasil: Claude mungkin menjawab di chat biasa dengan poin-poin, tergantung panjang jawabannya.

**Prompt Eksplisit + Terstruktur:** "Buatkan tabel perbandingan 5 fitur Claude vs ChatGPT dalam bentuk tabel markdown. Setelah itu saya mau minta revisi kolom tertentu, jadi buat di Artifacts supaya bisa saya edit langsung."
Hasil: instruksi eksplisit + format tabel + niat mau revisi → Claude tahu ini perlu jadi dokumen yang bisa diiterasi.

### Cara Kerja Step-by-Step

1. Minta Claude buat output terstruktur (tabel, dokumen, kode) — Artifacts biasanya muncul otomatis
2. Kalau ada bagian kurang pas, minta revisi spesifik — bukan minta ulang dari nol
3. Review isi Artifacts sebelum dipakai — jangan asumsikan otomatis benar
4. Kalau sudah final, export ke Google Docs atau download sebagai file lokal

### ■ EXERCISE

Generate tabel perbandingan 5 fitur Claude vs Chat biasa (bukan AI) — misalnya kecepatan, kemampuan olah dokumen, konsistensi jawaban, dll. Minta revisi 1 kolom setelah tabel muncul untuk coba fitur iterasi.

### ■ OUTPUT YANG DIHARAPKAN

1 tabel Artifacts yang sudah direvisi minimal 1 kali — kamu paham cara generate dan edit dokumen langsung di Claude tanpa copy-paste manual.

---

## MODUL 05 · PRAKTEK: Workflow End-to-End Pertamamu

### Menyatukan Semua yang Sudah Dipelajari Jadi Satu Alur Kerja Nyata

Modul-modul sebelumnya mengajarkan kemampuan secara terpisah: menyusun prompt yang jelas (R-K-T-F), memberi Claude peran ahli (Role Prompting), dan mendapatkan output langsung jadi dokumen (Artifacts). Modul ini menyatukan ketiganya jadi satu workflow nyata — dari input berantakan sampai output yang siap dikirim ke atasan, klien, atau siapapun yang menunggu hasil kerja kamu.

### Studi Kasus: Catatan Meeting Berantakan → Laporan Rapi

Keluar dari meeting dengan catatan yang tercecer (poin loncat-loncat, tidak terstruktur), tapi tetap harus dikirim sebagai laporan rapi berisi ringkasan dan action items dalam waktu dekat. Workflow ini mengubah proses yang biasanya makan waktu 30-45 menit merapikan manual, menjadi hitungan menit — semua dalam satu prompt, satu chat.

> **Kenapa urutan ini penting:** menyatukan role, konteks, tugas, dan format ke dalam satu prompt yang eksplisit meminta output terstruktur menghilangkan dua titik lambat sekaligus — tidak perlu bolak-balik beberapa prompt untuk memperjelas maksudmu, dan tidak perlu copy-paste manual dari chat ke dokumen. Ini yang membuat workflow-nya benar-benar end-to-end.

### Contoh Skenario Berdasarkan Profesi

- **Manajer** — Catatan meeting 2 halaman diolah jadi ringkasan + action items dalam satu prompt
- **HRD** — Hasil interview (catatan wawancara kandidat) diolah jadi laporan evaluasi terstruktur
- **Mahasiswa** — Catatan kuliah/diskusi kelompok diolah jadi rangkuman untuk bahan belajar

### Contoh Prompt Lengkap (1 Alur Penuh)

"Bertindaklah sebagai asisten kerja yang rapi dan terstruktur. Ini catatan meeting saya hari ini, masih berantakan: [paste catatan mentah]. Tolong olah jadi laporan dengan 2 bagian: (1) Ringkasan poin utama dalam bentuk paragraf singkat, (2) Action items dalam bentuk tabel dengan kolom Tugas, PIC, dan Deadline. Buatkan dalam format dokumen supaya bisa saya export ke Google Docs."

### Cara Kerja Step-by-Step

1. Buka chat baru di Claude.ai
2. Siapkan 1 catatan meeting/rapat nyata yang masih berantakan
3. Tulis 1 prompt lengkap (Role + Konteks + Tugas + Format), paste catatan, minta ringkasan + action items sekaligus
4. Review hasil di Artifacts, minta revisi kalau kurang pas
5. Export ke Google Docs, rapikan format akhir

### ■ EXERCISE

Ambil catatan rapat nyata dari minggu ini (atau catatan kuliah/diskusi kalau kamu mahasiswa). Jalankan alur 3 langkah di atas dari awal sampai selesai.

### ■ OUTPUT YANG DIHARAPKAN

1 laporan meeting profesional di Google Docs — dibuat langsung dari catatan berantakan lewat satu prompt terstruktur, tanpa satu kali pun copy-paste manual dari chat.

### 📎 File yang Perlu Disiapkan

Belum punya catatan meeting sendiri? Gunakan **contoh-catatan-meeting-berantakan.txt** — catatan meeting marketing yang sengaja dibuat berantakan untuk simulasi latihan ini.

---

## Kursus Selesai!

Dari membalas chat pelanggan, menyusun prompt yang presisi dengan role dan format yang tepat, sampai membuat dokumen terstruktur langsung lewat Artifacts — kamu sekarang punya fondasi yang cukup kuat untuk mulai memakai Claude secara rutin dalam pekerjaan sehari-hari.

**01 · Setup Akun** — Paham beda Claude vs Google Search · Akun Claude aktif · Kenal 4 area interface
**02 · Anatomi Prompt** — Paham 4 elemen R-K-T-F · Bisa susun prompt R-K-T-F · Tahu ciri prompt yang gagal
**03 · Role Prompting** — Paham cara kerja role prompting · Kenal 5 role paling berguna · Bisa gabungkan role+tugas+format
**04 · Claude Artifacts** — Paham kapan Artifacts muncul · Bisa generate & revisi dokumen · Tahu cara export ke luar Claude
**05 · Praktek End-to-End** — Menyatukan R-K-T-F, Role Prompting, dan Artifacts · 1 laporan nyata siap dikirim · Paham alur kerja 3 langkah

Satu hal terakhir: anggap Claude seperti rekan kerja baru yang membantu menyiapkan draft — cepat dan membantu, tapi tetap perlu kamu baca ulang dan sesuaikan sebelum benar-benar dipakai, terutama sebelum dikirim ke pelanggan atau dipakai untuk keputusan penting.

**Lanjutkan belajar (sudah termasuk All Access kamu):** Produktivitas Kantor (Role Prompting, Gmail, Sheets) · Kreasi Konten Pemasaran (Positioning, konten Instagram, copy iklan, komunikasi pelanggan)

---

*(Draft ini konsisten dengan HTML final di mulai-claude-content.html per audit 30 Juli 2026. Perbaikan dari versi PDF sebelumnya: tabel Gratis vs Pro disederhanakan agar sama persis dengan HTML (menghapus item Cowork/Claude Code yang tidak ada di HTML — sudah tercakup di section "Di Luar 4 Area Utama" secara terpisah), dan ditambahkan section "Contoh Skenario Berdasarkan Profesi" di Modul 5 yang sebelumnya hilang dari PDF. PDF hasil render akan dibuat ulang dari draft ini pada tahap berikutnya.)*
