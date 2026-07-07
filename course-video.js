// course-video.js — Injects admin-uploaded module videos, PDF, and practice
// documents into content pages.
// Requires: sbClient (from supabase-config.js) and a global COURSE_SLUG
// constant defined before this script tag loads. Looks for elements with id
// "video-slot-<moduleNum>", "doc-slot-<moduleNum>", and "pdf-download-slot".
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
        var pdfSlot = document.getElementById('pdf-download-slot');
        if (pdfSlot && resource && resource.pdf_url) {
          pdfSlot.innerHTML =
            '<a href="' + resource.pdf_url + '" target="_blank" rel="noopener" ' +
            'style="display:flex;align-items:center;gap:8px;margin:12px 16px 0;padding:10px 12px;' +
            'background:var(--accent-dim);color:var(--accent);border-radius:10px;font-size:12px;' +
            'font-weight:600;text-decoration:none;">' +
            '📄 Unduh ' + (resource.pdf_label || 'PDF') + '</a>';
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
