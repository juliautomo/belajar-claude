-- Adds an admin-editable physical address to social_links, shown in the footer's
-- "Hubungi Kami" (Contact Us) group alongside Email and WhatsApp.
-- Idempotent — safe to re-run.
-- Already applied directly to production (ctqtdqbsucbhikwnagvl) via Supabase MCP, Checkpoint 177 (Aug 6, 2026).

alter table social_links add column if not exists address text;
alter table social_links add column if not exists address_visible boolean default true;
