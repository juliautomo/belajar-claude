/**
 * PDF Export Helper untuk Google Sheets
 * Belajar Claude — K2: Produktivitas Kantor, Modul 4
 *
 * 100% GRATIS — tidak pakai API key, tidak butuh paket Claude Pro.
 * Hanya memakai fitur bawaan Google Apps Script + Google Drive, jadi tidak
 * ada biaya pemakaian apapun di luar akun Google-mu sendiri.
 *
 * CARA INSTALL:
 * 1. Buka Google Sheets kamu
 * 2. Klik Extensions → Apps Script
 * 3. Hapus kode yang ada, paste seluruh kode ini
 * 4. Klik Save (Ctrl+S), lalu tutup tab Apps Script
 * 5. Refresh Google Sheets — menu "Export PDF" akan muncul di menu bar
 * 6. Saat pertama kali dipakai, Google akan minta izin akses — klik Allow
 *    (ini normal, script perlu izin baca sheet & simpan file ke Drive-mu)
 *
 * KENAPA INI GRATIS:
 * Script ini cuma memakai SpreadsheetApp, DriveApp, dan UrlFetchApp bawaan
 * Google — tidak ada panggilan ke Claude API sama sekali. Beda dengan versi
 * sebelumnya yang butuh API key berbayar dari console.anthropic.com, script
 * ini tidak butuh apapun di luar akun Google-mu sendiri.
 */

// ─── MENU UTAMA ─────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Export PDF')
    .addItem('Export Sheet Aktif sebagai PDF', 'exportActiveSheet')
    .addItem('Export Rentang Terpilih sebagai PDF', 'exportSelection')
    .addSeparator()
    .addItem('Tentang PDF Export Helper', 'showAbout')
    .addToUi();
}

// ─── FUNGSI UTAMA ────────────────────────────────────────────────────────────

/**
 * Export sheet yang sedang aktif jadi 1 file PDF rapi.
 */
function exportActiveSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var opts = { gid: sheet.getSheetId() };
  var fileName = SpreadsheetApp.getActiveSpreadsheet().getName() + ' - ' + sheet.getName() + '.pdf';
  runExport(opts, fileName, sheet.getName());
}

/**
 * Export hanya rentang sel yang sedang dipilih (mis. tabel ringkasan hasil
 * analisis Claude) jadi 1 file PDF — tanpa ikut kolom/baris yang tidak perlu.
 */
function exportSelection() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert('Pilih dulu rentang sel yang mau di-export, lalu jalankan menu ini lagi.');
    return;
  }
  var a1 = range.getA1Notation();
  var opts = { gid: sheet.getSheetId(), range: a1 };
  var fileName = SpreadsheetApp.getActiveSpreadsheet().getName() + ' - ' + sheet.getName() + ' (' + a1 + ').pdf';
  runExport(opts, fileName, sheet.getName() + ' — ' + a1);
}

/**
 * Jalankan proses export: bangun URL export bawaan Google Sheets, ambil file
 * PDF-nya, simpan ke folder "Export PDF - Belajar Claude" di Drive-mu, lalu
 * tampilkan link untuk membukanya.
 */
function runExport(opts, fileName, label) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  try {
    var url = buildExportUrl(ss, opts);
    var token = ScriptApp.getOAuthToken();
    var response = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token }
    });
    var pdfBlob = response.getBlob().setName(fileName);

    var folder = getOrCreateExportFolder();
    var file = folder.createFile(pdfBlob);

    var html = HtmlService.createHtmlOutput(
      '<style>body{font-family:Arial,sans-serif;font-size:13px;line-height:1.6;padding:12px;}'
      + 'a.btn{display:inline-block;margin-top:10px;background:#6C47FF;color:#fff;text-decoration:none;'
      + 'padding:8px 16px;border-radius:8px;font-weight:600;}</style>'
      + '<h3 style="color:#6C47FF;margin-top:0;">PDF Siap ✓</h3>'
      + '<p>"' + label + '" berhasil di-export sebagai PDF dan disimpan di folder '
      + '<strong>Export PDF - Belajar Claude</strong> di Google Drive-mu.</p>'
      + '<a class="btn" href="' + file.getUrl() + '" target="_blank">Buka PDF</a>'
    ).setTitle('Export Selesai').setWidth(420).setHeight(220);
    ui.showModelessDialog(html, 'Export Selesai');
  } catch (e) {
    ui.alert('Gagal export PDF: ' + e.message);
  }
}

/**
 * Bangun URL export bawaan Google Sheets dengan pengaturan rapi: tanpa
 * gridlines, fit ke lebar halaman, ukuran A4, potrait, margin rapi.
 */
function buildExportUrl(ss, opts) {
  var base = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?';
  var params = {
    format: 'pdf',
    size: 'A4',
    portrait: 'true',
    fitw: 'true',
    gridlines: 'false',
    printtitle: 'false',
    sheetnames: 'false',
    pagenum: 'CENTER',
    top_margin: '0.5',
    bottom_margin: '0.5',
    left_margin: '0.5',
    right_margin: '0.5',
    horizontal_alignment: 'CENTER'
  };
  for (var k in opts) params[k] = opts[k];

  var query = Object.keys(params).map(function (k) {
    return k + '=' + encodeURIComponent(params[k]);
  }).join('&');
  return base + query;
}

/**
 * Cari atau buat folder "Export PDF - Belajar Claude" di root Drive supaya
 * hasil export tidak berserakan — semua PDF dari script ini tersimpan rapi
 * di 1 tempat.
 */
function getOrCreateExportFolder() {
  var name = 'Export PDF - Belajar Claude';
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function showAbout() {
  SpreadsheetApp.getUi().alert(
    'PDF Export Helper untuk Google Sheets',
    'Versi 1.0 — Belajar Claude K2: Produktivitas Kantor, Modul 4\n\n'
    + '100% gratis — tidak butuh API key atau paket Claude Pro.\n'
    + 'Cuma pakai fitur bawaan Google Apps Script + Drive.\n\n'
    + 'Export sheet aktif atau rentang terpilih jadi PDF rapi (tanpa\n'
    + 'gridlines, fit ke halaman), otomatis tersimpan di folder\n'
    + '"Export PDF - Belajar Claude" di Drive-mu.\n\n'
    + 'Dokumentasi: belajarclaude.id',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
