// course-video.js — Injects admin-set module videos (YouTube embeds), PDF,
// module PPT slides, and practice documents into content pages.
// Requires: sbClient (from supabase-config.js) and a global COURSE_SLUG
// constant defined before this script tag loads. Looks for elements with id
// "video-slot-<moduleNum>", "ppt-slot-<moduleNum>", "doc-slot-<moduleNum>"
// (all below the module title) and "pdf-download-slot" (sidebar link to the
// course-level PDF).

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

        // Sidebar link — bigger, bolder, hard to miss among the module list.
        // Title is always a fixed, clear label ("Unduh Materi PDF") so it never
        // depends on whatever raw filename the admin uploaded. The admin's
        // custom label (if any) shows as a smaller subtitle, truncated with
        // ellipsis so long filenames can never overflow/overlap the sidebar.
        var pdfSlot = document.getElementById('pdf-download-slot');
        if (pdfSlot) {
          var subtitleHtml = resource.pdf_label
            ? '<span style="display:block;font-size:10.5px;font-weight:500;color:rgba(255,255,255,0.75);' +
              'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">' + resource.pdf_label + '</span>'
            : '';
          pdfSlot.innerHTML =
            '<a href="' + resource.pdf_url + '" target="_blank" rel="noopener" ' +
            'style="display:flex;align-items:center;gap:10px;margin:12px 16px;padding:12px 14px;' +
            'background:var(--accent);color:#fff;border-radius:12px;' +
            'text-decoration:none;box-shadow:0 2px 10px var(--accent-glow);">' +
            '<span style="font-size:18px;line-height:1;flex-shrink:0;">📄</span>' +
            '<span style="min-width:0;flex:1;overflow:hidden;">' +
            '<span style="display:block;font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Unduh Materi PDF</span>' +
            subtitleHtml +
            '</span></a>';
        }
      })
      .catch(function (e) { console.log('course-video: gagal memuat PDF', e); });

    sbClient
      .from('module_ppts')
      .select('module_num, ppt_url, ppt_label')
      .eq('course_slug', COURSE_SLUG)
      .then(function (res) {
        (res.data || []).forEach(function (row) {
          if (!row.ppt_url) return;
          var slot = document.getElementById('ppt-slot-' + row.module_num);
          if (!slot) return;
          var label = row.ppt_label || 'Slide Modul';
          slot.innerHTML =
            '<a href="' + row.ppt_url + '" target="_blank" rel="noopener" ' +
            'style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:12px 14px;' +
            'background:var(--accent-dim, rgba(108,71,255,0.08));color:var(--accent);border-radius:10px;' +
            'font-size:13px;font-weight:700;text-decoration:none;">' +
            '<span style="font-size:18px;line-height:1;">📊</span>' +
            '<span>Lihat ' + label + '</span></a>';
        });
      })
      .catch(function (e) { console.log('course-video: gagal memuat PPT', e); });

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
