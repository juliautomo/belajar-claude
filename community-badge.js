// "N baru" badge for the Komunitas link, and an optional banner.
// Include after supabase-config.js on member pages (dashboard, profile).
// Marks: any element with data-community-badge gets the count (hidden at 0);
// #communityNewBanner (optional) is shown with the count.
// "New" = published after the member last opened community.html (table
// community_seen), excluding their own posts. First visit: last 14 days.
(function () {
  async function run() {
    try {
      var s = (await sbClient.auth.getSession()).data.session;
      if (!s) return;
      var email = s.user.email;
      var seen = await sbClient.from('community_seen').select('seen_at').eq('email', email).maybeSingle();
      var since = (seen.data && seen.data.seen_at) || new Date(Date.now() - 14 * 864e5).toISOString();
      var r = await sbClient.from('community_posts').select('id', { count: 'exact', head: true })
        .gt('publish_at', since).lte('publish_at', new Date().toISOString()).neq('email', email);
      var n = r.count || 0;
      document.querySelectorAll('[data-community-badge]').forEach(function (el) {
        el.textContent = n > 9 ? '9+' : String(n);
        el.hidden = n === 0;
        el.setAttribute('aria-label', n + ' post baru');
      });
      var banner = document.getElementById('communityNewBanner');
      if (banner && n > 0) {
        var t = banner.querySelector('[data-community-count-text]');
        if (t) t.textContent = n === 1 ? '1 post baru di Komunitas' : n + ' post baru di Komunitas';
        banner.hidden = false;
      }
    } catch (e) { /* a badge is never worth breaking the page */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
