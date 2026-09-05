// Google tag (gtag.js) -- base site tag for GA4 + Google Ads (Checkpoint 233).
// Loaded the same way as posthog-config.js / meta-pixel.js: one
// <script src="gtag-config.js"> per page, and this file injects Google's own
// loader script itself so every page only needs that one extra line in <head>.
//
// GA_MEASUREMENT_ID:  GA4 property ID (format G-XXXXXXXXXX)
// AW_CONVERSION_ID:   Google Ads account conversion ID (format AW-XXXXXXXXX)
// AW_CONVERSION_LABEL: the label half of the specific "purchase" conversion
//   action's send_to string (Google Ads -> Goals/Conversions -> that
//   conversion action -> "Use Google tag" -- shows the full AW-XXXX/LABEL).
// All three are placeholders until Julia supplies the real values -- swap
// them here, nowhere else. Until then this still loads without erroring,
// it just has nothing real to report to.
//
// Main/prod-only, like meta-pixel.js -- dev.* does not include this file, so
// QA/testing traffic never counts as real visitors/buyers in GA4 or Google
// Ads. Don't add this include to dev when merging/syncing branches (same
// rule as meta-pixel.js -- see the notes in all-access.html).
window.GA_MEASUREMENT_ID   = 'GA_MEASUREMENT_ID';
window.AW_CONVERSION_ID    = 'AW_CONVERSION_ID';
window.AW_CONVERSION_LABEL = 'AW_CONVERSION_LABEL';

(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.AW_CONVERSION_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', window.GA_MEASUREMENT_ID);
  gtag('config', window.AW_CONVERSION_ID);
})();

// Fires the Google Ads "purchase" conversion exactly once per order. Called
// from payment-success.html (the Duitku returnUrl redirect) -- the one place
// the browser is guaranteed to still be around with a click ID (gclid) to
// attribute the sale back to an ad click. gclid never reaches the backend,
// so unlike PostHog's purchase_completed or Meta's CAPI Purchase, this event
// cannot be moved server-side without losing ad attribution entirely.
//
// Guarded two ways against double-counting: a localStorage flag per orderId
// (belt) and passing transaction_id so Google Ads' own dedup also catches it
// (suspenders) -- same two-layer pattern already used for the Meta Pixel
// Purchase call right above this one in payment-success.html.
window.fireGoogleAdsConversion = function (orderId, value) {
  if (!orderId || typeof gtag === 'undefined') return;
  var firedKey = 'ads_purchase_fired_' + orderId;
  try { if (localStorage.getItem(firedKey)) return; } catch (e) { /* fail open */ }
  try {
    gtag('event', 'conversion', {
      send_to: window.AW_CONVERSION_ID + '/' + window.AW_CONVERSION_LABEL,
      value: value,
      currency: 'IDR',
      transaction_id: orderId,
    });
    try { localStorage.setItem(firedKey, '1'); } catch (e) { /* fail silent */ }
  } catch (e) { /* fail silent -- worst case this one conversion is missed */ }
};
