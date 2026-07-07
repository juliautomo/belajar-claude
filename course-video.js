// course-video.js — Injects admin-uploaded module videos + course PDF into content pages.
// Requires: sbClient (from supabase-config.js) and a global COURSE_SLUG constant
// defined before this script tag loads. Looks for elements with id
// "video-slot-<moduleNum>" and "pdf-download-slot" to populate.
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
