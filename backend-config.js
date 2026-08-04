// ─── Backend API Configuration ──────────────────────────────────────────────
// Single source of truth for which backend server this site talks to (payments,
// signup, etc.) — every page that calls the backend should use BACKEND_URL from
// here instead of hardcoding the Railway URL directly.
//
// Real dev/prod split, as of the second Railway environment set up under the
// belajar-claude-backend project (environment "dev", branch `dev`, sandbox Duitku
// credentials, DUITKU_ENV unset). Production traffic (belajarclaude.id) hits the
// real backend; everything else (dev preview URLs, local file testing, etc.)
// hits the dev backend, which uses Duitku's sandbox — no real money moves there.
const BACKEND_URL = (location.hostname === 'belajarclaude.id')
  ? 'https://klaud-backend-production.up.railway.app'    // production — real Duitku once DUITKU_ENV=production is set there
  : 'https://belajar-claude-backend-dev.up.railway.app';  // dev — sandbox Duitku, no real money
