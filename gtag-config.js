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
// GA_MEASUREMENT_ID is real (set at Checkpoint 234, GA4 property created
// Sept 2026). AW_CONVERSION_ID / AW_CONVERSION_LABEL are still placeholders
// until the Google Ads account exists -- swap them here, nowhere else. Until
// then gtag('config', window.AW_CONVERSION_ID) below is a harmless no-op:
// Google just has no conversion action to attach it to yet.
//
// Main/prod-only, like meta-pixel.js -- dev.* does not include this file, so
// QA/testing traffic never counts as real visitors/buyers in GA4 or Google
// Ads. Don't add this include to dev when merging/syncing branches (same
// rule as meta-pixel.js -- see the notes in all-access.html).
window.GA_MEASUREMENT_ID   = 'G-8MT5FVXPVY';
window.AW_CONVERSION_ID    = 'AW_CONVERSION_ID';
window.AW_CONVERSION_LABEL = 'AW_CONVERSION_LABEL';

(function () {
  var s = document.createElement('script');
  s.async = true;
  // Loader is fetched under GA_MEASUREMENT_ID specifically, not
  // AW_CONVERSION_ID -- it's the one guaranteed to be a real ID right now.
  // One valid ID in this URL is enough to load the shared gtag.js library;
  // both gtag('config', ...) calls below then register against it, so
  // Google Ads config will start working the moment AW_CONVERSION_ID is
  // filled in above, with no change needed here.
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_MEASUREMENT_ID;
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

// Fires GA4's own recommended "purchase" event (separate call from the Ads
// conversion above, since that one's `send_to` locks it to the Ads
// destination only -- without a matching call here, GA4's own Ecommerce
// reports/Key events would show zero purchases despite Ads receiving them).
// Same caller (payment-success.html), same order data, own dedup key so
// firing both from the same page load never double-fires either one.
window.fireGA4Purchase = function (orderId, value) {
  if (!orderId || typeof gtag === 'undefined') return;
  var firedKey = 'ga4_purchase_fired_' + orderId;
  try { if (localStorage.getItem(firedKey)) return; } catch (e) { /* fail open */ }
  try {
    gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: 'IDR',
      items: [{ item_id: 'all-access', item_name: 'All Access', price: value, quantity: 1 }],
    });
    try { localStorage.setItem(firedKey, '1'); } catch (e) { /* fail silent */ }
  } catch (e) { /* fail silent -- worst case this one event is missed */ }
};
