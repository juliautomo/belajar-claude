// ─── Backend API Configuration ──────────────────────────────────────────────
// Single source of truth for which backend server this site talks to (payments,
// signup, etc.) — every page that calls the backend should use BACKEND_URL from
// here instead of hardcoding the Railway URL directly.
//
// Today, dev and production both point at the SAME real backend, because no
// separate dev backend service exists yet (see TEAM-WORKFLOW.md — "What dev does
// NOT protect you from"). That means checkout and sign-up are still real
// regardless of which URL you're using, even after this change.
//
// Once a second Railway service exists for `dev` (with its own sandbox Duitku
// credentials), only this one file needs to change — update the URL below for
// the non-production branch, instead of hunting through every page again.
const BACKEND_URL = (location.hostname === 'belajarclaude.id')
  ? 'https://klaud-backend-production.up.railway.app'   // production
  : 'https://klaud-backend-production.up.railway.app';  // TODO: point at the dev Railway service once it exists
