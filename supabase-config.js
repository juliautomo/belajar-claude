// ─── Supabase Configuration ───────────────────────────────────────────────────
// Update SUPABASE_URL and SUPABASE_KEY here when switching projects.
// All pages import this file — one change updates the entire site.

const SUPABASE_URL = 'https://ctqtdqbsucbhikwnagvl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lKrIJVvBhDn_7Oxt419_0w_uTLrlq8Q';
// An email link that was already used, expired (24h), or replaced by a newer
// "kirim ulang" email comes back as #error=access_denied&error_code=otp_expired.
// Instead of silently landing on a page that bounces them around, send them to
// the login page, which explains it and offers to resend.
(function () {
  try {
    if (/error_code=otp_expired/.test(location.hash) && !/(login|reset-password)(\.html)?$/.test(location.pathname)) {
      location.replace('login.html?link=expired');
    }
  } catch (e) {}
})();

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
