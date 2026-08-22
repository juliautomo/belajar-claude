// Meta (Facebook) Pixel — site-wide PageView tracking for ad campaign measurement.
// Dataset: "BelajarClaude Website" (ID 1488423606341237) in Meta Events Manager.
// Purchase events are NOT fired here — see payment-success.html, which fires
// Purchase with the real order amount once the pixel below has loaded.
//
// Prod-only gate: this site is a single Worker deployment served at both
// belajarclaude.id (prod) and dev-belajar-claude.belajarclaude-id.workers.dev
// (dev) — same files, two hostnames (see backend-config.js for the same split).
// Without this check, every dev/preview pageview and test purchase would land
// in the same Meta dataset as real ad traffic and corrupt campaign optimization.
if (location.hostname === 'belajarclaude.id') {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1488423606341237');
  fbq('track', 'PageView');
}
