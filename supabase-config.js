// ─── Supabase Configuration ───────────────────────────────────────────────────
// Update SUPABASE_URL and SUPABASE_KEY here when switching projects.
// All pages import this file — one change updates the entire site.

const SUPABASE_URL = 'https://ctqtdqbsucbhikwnagvl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lKrIJVvBhDn_7Oxt419_0w_uTLrlq8Q';
const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
