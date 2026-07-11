/**
 * Claude AI Helper untuk Google Sheets
 * Belajar Claude — K2: Produktivitas Kantor
 *
 * CARA INSTALL:
 * 1. Buka Google Sheets kamu
 * 2. Klik Extensions → Apps Script
 * 3. Hapus kode yang ada, paste seluruh kode ini
 * 4. Ganti YOUR_API_KEY_HERE dengan API key Claude kamu (anthropic.com/api)
 * 5. Klik Save (Ctrl+S), lalu tutup tab Apps Script
 * 6. Refresh Google Sheets — menu "Claude AI" akan muncul di menu bar
 *
 * CARA DAPAT API KEY:
 * Daftar di https://console.anthropic.com → API Keys → Create Key
 *
 * CATATAN KEAMANAN:
 * Jangan share spreadsheet ini secara publik karena API key tersimpan di script.
 * Untuk penggunaan tim, gunakan PropertiesService (lihat komentar di bawah).
 */

// ─── KONFIGURASI ────────────────────────────────────────────────────────────
var CLAUDE_API_KEY = 'YOUR_API_KEY_HERE';
var CLAUDE_MODEL   = 'claude-haiku-4-5-20251001'; // Model tercepat & terhemat
var MAX_TOKENS     = 1024;

// ─── MENU UTAMA ─────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Claude AI')
    .addItem('Analisis Data Terpilih', 'analyzeSelection')
    .addItem('Buat Formula dari Deskripsi', 'generateFormula')
    .addItem('Ringkasan Eksekutif Tabel', 'summarizeTable')
    .addSeparator()
    .addItem('Isi Kolom dengan Claude', 'fillColumnWithClaude')
    .addItem('Debug Formula Error', 'debugFormula')
    .addSeparator()
    .addItem('Tentang Claude Helper', 'showAbout')
    .addToUi();
}

// ─── FUNGSI UTAMA ────────────────────────────────────────────────────────────

/**
 * Analisis sel/range yang sedang dipilih
 */
function analyzeSelection() {
  var sheet     = SpreadsheetApp.getActiveSheet();
  var range     = sheet.getActiveRange();
  var values    = range.getValues();
  var dataStr   = valuesToText(values);

  var prompt = 'Analisis data berikut dan berikan:\n'
             + '1. Ringkasan singkat dalam 2-3 kalimat\n'
             + '2. 3 insight atau pola menarik yang kamu temukan\n'
             + '3. 1-2 rekomendasi actionable\n\n'
             + 'DATA:\n' + dataStr;

  var result = callClaude(prompt);
  showResult('Analisis Data', result);
}

/**
 * Generate formula dari deskripsi pengguna
 */
function generateFormula() {
  var ui   = SpreadsheetApp.getUi();
  var resp = ui.prompt(
    'Generate Formula',
    'Jelaskan formula yang kamu butuhkan:\n'
    + 'Contoh: "Hitung total kolom C hanya jika kolom A berisi kata Aktif"\n'
    + 'Contoh: "Cari nama di kolom A dan tampilkan gaji dari Sheet2 kolom D"',
    ui.ButtonSet.OK_CANCEL
  );

  if (resp.getSelectedButton() !== ui.Button.OK) return;

  var desc   = resp.getResponseText();
  var prompt = 'Buatkan formula Google Sheets untuk kebutuhan berikut:\n'
             + desc + '\n\n'
             + 'Berikan:\n'
             + '1. Formula lengkap siap pakai (mulai dari tanda =)\n'
             + '2. Penjelasan cara kerja formula (singkat, maksimal 3 poin)\n'
             + '3. Cara menggunakannya (di sel mana, cara copy ke bawah, dll)\n\n'
             + 'Jika ada beberapa cara, berikan yang paling efisien.';

  var result = callClaude(prompt);
  showResult('Formula yang Dibuat', result);
}

/**
 * Buat ringkasan eksekutif dari tabel yang dipilih
 */
function summarizeTable() {
  var sheet   = SpreadsheetApp.getActiveSheet();
  var range   = sheet.getActiveRange();
  var values  = range.getValues();
  var dataStr = valuesToText(values);

  var prompt = 'Buat ringkasan eksekutif dari tabel data berikut:\n\n'
             + 'DATA:\n' + dataStr + '\n\n'
             + 'Format ringkasan:\n'
             + '**HEADLINE:** (1 kalimat kesimpulan utama)\n'
             + '**ANGKA KUNCI:** (3-4 metrik terpenting dengan angkanya)\n'
             + '**HIGHLIGHTS:** (yang berjalan baik)\n'
             + '**PERHATIAN:** (yang perlu ditindaklanjuti)\n'
             + '**REKOMENDASI:** (2-3 langkah konkret)\n\n'
             + 'Total maksimal 200 kata. Gunakan bahasa Indonesia profesional.';

  var result = callClaude(prompt);

  // Tulis hasil ke sel baru di bawah range
  var lastRow  = range.getLastRow();
  var lastCol  = range.getColumn();
  var output   = sheet.getRange(lastRow + 2, lastCol);
  output.setValue(result);
  output.setWrap(true);
  output.setBackground('#F0EDFF');

  showResult('Ringkasan Eksekutif', result + '\n\n[Hasil juga ditulis ke sel di bawah tabel]');
}

/**
 * Isi satu kolom berdasarkan kolom sumber menggunakan Claude
 */
function fillColumnWithClaude() {
  var ui = SpreadsheetApp.getUi();

  // Minta instruksi dari pengguna
  var instrResp = ui.prompt(
    'Isi Kolom dengan Claude',
    'Masukkan instruksi untuk setiap baris.\n'
    + 'Gunakan {value} untuk mewakili nilai dari kolom sumber.\n\n'
    + 'Contoh: "Terjemahkan teks berikut ke Bahasa Inggris: {value}"\n'
    + 'Contoh: "Kategorikan produk ini (Elektronik/Fashion/Makanan): {value}"\n'
    + 'Contoh: "Tulis deskripsi singkat 1 kalimat untuk: {value}"',
    ui.ButtonSet.OK_CANCEL
  );
  if (instrResp.getSelectedButton() !== ui.Button.OK) return;

  var instruction = instrResp.getResponseText();
  var sheet       = SpreadsheetApp.getActiveSheet();
  var range       = sheet.getActiveRange();
  var sourceCol   = range.getColumn();
  var startRow    = range.getRow();
  var numRows     = range.getNumRows();

  // Konfirmasi
  var confirm = ui.alert(
    'Konfirmasi',
    'Claude akan memproses ' + numRows + ' baris.\n'
    + 'Hasil akan ditulis ke kolom sebelah kanan.\n\n'
    + 'Instruksi: ' + instruction + '\n\nLanjutkan?',
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  var targetCol = sourceCol + range.getNumColumns();

  for (var i = 0; i < numRows; i++) {
    var cellValue = sheet.getRange(startRow + i, sourceCol).getValue();
    if (!cellValue) continue;

    var prompt  = instruction.replace('{value}', cellValue);
    var result  = callClaude(prompt);
    var target  = sheet.getRange(startRow + i, targetCol);
    target.setValue(result);
    target.setBackground('#E0F2F1');

    // Jeda kecil agar tidak hit rate limit
    Utilities.sleep(500);
  }

  ui.alert('Selesai!', 'Claude telah mengisi ' + numRows + ' baris di kolom sebelah kanan.', ui.ButtonSet.OK);
}

/**
 * Debug formula yang error
 */
function debugFormula() {
  var ui       = SpreadsheetApp.getUi();
  var sheet    = SpreadsheetApp.getActiveSheet();
  var cell     = sheet.getActiveCell();
  var formula  = cell.getFormula();
  var value    = cell.getValue();

  var errorMsg = (typeof value === 'string' && value.startsWith('#')) ? value : 'tidak ada error';
  var context  = ui.prompt(
    'Debug Formula',
    'Formula di sel aktif: ' + (formula || '(bukan formula)') + '\n'
    + 'Nilai saat ini: ' + value + '\n\n'
    + 'Jelaskan kondisi data atau error yang dialami (opsional):',
    ui.ButtonSet.OK_CANCEL
  );

  if (context.getSelectedButton() !== ui.Button.OK) return;

  var prompt = 'Tolong debug formula Google Sheets berikut:\n\n'
             + 'FORMULA: ' + (formula || '(tidak ada formula)') + '\n'
             + 'ERROR/NILAI: ' + errorMsg + '\n'
             + 'KONTEKS: ' + (context.getResponseText() || 'tidak ada keterangan tambahan') + '\n\n'
             + 'Berikan:\n'
             + '1. Penyebab error yang paling mungkin\n'
             + '2. Formula yang sudah diperbaiki\n'
             + '3. Penjelasan singkat apa yang diubah dan kenapa';

  var result = callClaude(prompt);
  showResult('Debug Formula', result);
}

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

function callClaude(prompt) {
  var url     = 'https://api.anthropic.com/v1/messages';
  var payload = {
    model:      CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    messages:   [{ role: 'user', content: prompt }]
  };

  var options = {
    method:      'post',
    contentType: 'application/json',
    headers: {
      'x-api-key':         CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    payload:          JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json     = JSON.parse(response.getContentText());

    if (json.error) {
      return 'Error dari Claude API: ' + json.error.message;
    }
    return json.content[0].text;
  } catch (e) {
    return 'Gagal menghubungi Claude: ' + e.message
         + '\nPastikan API key sudah benar dan koneksi internet aktif.';
  }
}

function valuesToText(values) {
  return values.map(function(row) {
    return row.join('\t');
  }).join('\n');
}

function showResult(title, text) {
  var html = HtmlService
    .createHtmlOutput(
      '<style>body{font-family:Arial,sans-serif;font-size:13px;line-height:1.6;padding:12px;}'
      + 'pre{background:#f5f5f5;padding:10px;border-radius:6px;white-space:pre-wrap;word-wrap:break-word;}'
      + 'h3{color:#6C47FF;margin-top:0;}</style>'
      + '<h3>' + title + '</h3>'
      + '<pre>' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>'
    )
    .setTitle(title)
    .setWidth(520)
    .setHeight(480);
  SpreadsheetApp.getUi().showModelessDialog(html, title);
}

function showAbout() {
  SpreadsheetApp.getUi().alert(
    'Claude AI Helper untuk Google Sheets',
    'Versi 1.0 — Belajar Claude K2: Produktivitas Kantor\n\n'
    + 'Script ini menghubungkan Google Sheets dengan Claude AI\n'
    + 'melalui Anthropic API.\n\n'
    + 'Dokumentasi: belajarclaude.id',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
