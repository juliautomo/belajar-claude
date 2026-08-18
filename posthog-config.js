// PostHog product analytics — site-wide pageview + click tracking.
// Project: BelajarClaude / "Default project" (US region). This key is the
// public client-side token, safe to expose in the browser.
//
// Autocapture (built into the snippet below) tracks pageviews and clicks
// on elements like the "Beli All Access" button automatically — no extra
// event code needed per-page.
!function (t, e) {
  var o, n, p, r;
  e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
    function g(t, e) {
      var o = e.split(".");
      2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    }
    (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0,
      p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js",
      (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
    var u = e;
    for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [],
      u.toString = function (t) {
        var e = "posthog";
        return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
      },
      u.people.toString = function () { return u.toString(1) + ".people (stub)"; },
      o = "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),
      n = 0; n < o.length; n++) g(u, o[n]);
    e._i.push([i, s, a]);
  }, e.__SV = 1);
}(document, window.posthog || []);

posthog.init('phc_BMCSvkn3cFikgae5rXDoPoPiQZf2W6HK7vFodYM6ybym', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
});

// Identify logged-in users so their activity ties together across pages and
// visits. Uses the Supabase auth user ID (a random, internal UUID) as the
// PostHog identifier — deliberately NOT email or name, so no personal data
// is sent to PostHog. Runs on window 'load' (not immediately) because this
// script loads early in <head>, before supabase-config.js defines `sbClient`
// later in the page — by the 'load' event, everything has run.
window.addEventListener('load', function () {
  if (typeof sbClient === 'undefined' || !sbClient.auth) return; // page has no Supabase auth (e.g. legal pages)
  sbClient.auth.getSession().then(function (res) {
    var user = res && res.data && res.data.session && res.data.session.user;
    if (user && user.id) {
      posthog.identify(user.id);
    }
  }).catch(function () {});
});
