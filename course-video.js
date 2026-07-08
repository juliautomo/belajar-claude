// course-video.js — Injects admin-set module videos (YouTube embeds), PDF,
// and practice documents into content pages.
// Requires: sbClient (from supabase-config.js) and a global COURSE_SLUG
// constant defined before this script tag loads. Looks for elements with id
// "video-slot-<moduleNum>", "doc-slot-<moduleNum>", "pdf-download-slot"
// (sidebar) and "pdf-banner-slot" (top of main content, always visible).

// Extracts an 11-char YouTube video ID from watch/share/shorts/embed URLs.
function extractYoutubeId(url) {
  if (!url) return null;
  var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

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
          var ytId = extractYoutubeId(row.video_url);
          if (ytId) {
            slot.innerHTML =
              '<div style="position:relative;width:100%;padding-top:56.25%;border-radius:12px;overflow:hidden;margin-bottom:24px;background:#000;">' +
              '<iframe src="https://www.youtube.com/embed/' + ytId + '" title="Video Modul" frameborder="0" ' +
              'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
              'allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>';
          } else {
            // Fallback: not a recognizable YouTube URL, just link it.
            slot.innerHTML =
              '<a href="' + row.video_url + '" target="_blank" rel="noopener" ' +
              'style="display:block;margin-bottom:24px;padding:12px 14px;background:var(--accent-dim);' +
              'color:var(--accent);border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;">' +
              '▶ Tonton Video Modul</a>';
          }
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
