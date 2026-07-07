// course-video.js — Injects admin-uploaded module videos, PDF, and practice
// documents into content pages.
// Requires: sbClient (from supabase-config.js) and a global COURSE_SLUG
// constant defined before this script tag loads. Looks for elements with id
// "video-slot-<moduleNum>", "doc-slot-<moduleNum>", "pdf-download-slot"
// (sidebar) and "pdf-banner-slot" (top of main content, always visible).
(function () {
  function run() {
    if (typeof COURSE_SLUG === 'undefined' || !COURSE_SLUG) return;

    sbClient
      .from('module_videos')
      .select('module_num, video_url')
      .eq('course_slug', COURSE_SLUG)
      .then(function (res) {
        (res.data || []).forEach(function (row) {
          if (!row.video_url) return;
          var slot = document.getElementById('video-slot-' + row.module_num);
          if (!slot) return;
          slot.innerHTML =
            '<video controls preload="metadata" style="width:100%;border-radius:12px;margin:4px 0 24px;background:#000;max-height:420px;display:block;">' +
            '<source src="' + row.video_url + '" type="video/mp4"></video>';
        });
      })
      .catch(function (e) { console.log('course-video: gagal memuat video', e); });

    sbClient
      .from('course_resources')
      .select('pdf_url, pdf_label')
      .eq('course_slug', COURSE_SLUG)
      .maybeSingle()
      .then(function (res) {
        var resource = res.data;
        if (!resource || !resource.pdf_url) return;
        var label = resource.pdf_label || 'PDF';

        // Sidebar link — bigger, bolder, hard to miss among the module list.
        var pdfSlot = document.getElementById('pdf-download-slot');
        if (pdfSlot) {
          pdfSlot.innerHTML =
            '<a href="' + resource.pdf_url + '" target="_blank" rel="noopener" ' +
            'style="display:flex;align-items:center;gap:10px;margin:12px 16px;padding:12px 14px;' +
            'background:var(--accent);color:#fff;border-radius:12px;font-size:12.5px;' +
            'font-weight:700;text-decoration:none;box-shadow:0 2px 10px var(--accent-glow);">' +
            '<span style="font-size:18px;line-height:1;">📄</span>' +
            '<span>Unduh ' + label + '</span></a>';
        }

        // Main content banner — full-width, always visible above the module content.
        var bannerSlot = document.getElementById('pdf-banner-slot');
        if (bannerSlot) {
          bannerSlot.innerHTML =
            '<a href="' + resource.pdf_url + '" target="_blank" rel="noopener" ' +
            'style="display:flex;align-items:center;gap:14px;margin-bottom:24px;padding:16px 20px;' +
            'background:var(--accent);color:#fff;border-radius:14px;text-decoration:none;' +
            'box-shadow:0 4px 20px var(--accent-glow);">' +
            '<span style="font-size:26px;line-height:1;">📄</span>' +
            '<div style="flex:1;">' +
            '<div style="font-size:14px;font-weight:700;">Unduh ' + label + '</div>' +
            '<div style="font-size:12px;opacity:0.85;">Materi lengkap kursus ini, siap disimpan atau dicetak</div>' +
            '</div>' +
            '<span style="font-size:18px;">→</span></a>';
        }
      })
      .catch(function (e) { console.log('course-video: gagal memuat PDF', e); });

    sbClient
      .from('module_documents')
      .select('module_num, doc_url, doc_label')
      .eq('course_slug', COURSE_SLUG)
      .order('created_at')
      .then(function (res) {
        var byModule = {};
        (res.data || []).forEach(function (row) {
          if (!row.doc_url) return;
          (byModule[row.module_num] = byModule[row.module_num] || []).push(row);
        });
        Object.keys(byModule).forEach(function (moduleNum) {
          var slot = document.getElementById('doc-slot-' + moduleNum);
          if (!slot) return;
          var items = byModule[moduleNum].map(function (d) {
            return '<a href="' + d.doc_url + '" target="_blank" rel="noopener" ' +
              'style="display:flex;align-items:center;gap:8px;padding:10px 12px;' +
              'background:var(--surface-2, #F5F5F7);border:1px solid var(--border);border-radius:10px;' +
              'font-size:13px;font-weight:600;color:var(--ink);text-decoration:none;margin-bottom:8px;">' +
              '📎 ' + (d.doc_label || 'Dokumen Praktik') + '</a>';
          }).join('');
          slot.innerHTML =
            '<div style="margin-top:8px;">' +
            '<div style="font-size:11px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;color:var(--ink-2);margin-bottom:10px;">Materi Praktik</div>' +
            items + '</div>';
        });
      })
      .catch(function (e) { console.log('course-video: gagal memuat dokumen praktik', e); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
