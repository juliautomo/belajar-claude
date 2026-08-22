// ─── Belajar Claude Login Modal ────────────────────────────────────────────────────
// Drop <script src="login-modal.js"></script> on any page (after supabase-config.js).
// All <a href="login.html"> clicks will open this modal instead of navigating.
// Call window.openLoginModal() programmatically from any button/function.

(function () {
  // ── Inject CSS ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #klaud-modal-overlay {
      display: none;
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(19,22,58,0.5);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    #klaud-modal-overlay.open { display: flex; }

    #klaud-modal {
      background: #fff;
      border-radius: 20px;
      padding: 40px 36px 32px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 24px 64px rgba(0,0,0,0.22);
      position: relative;
      animation: klaudModalIn 0.2s ease;
      font-family: 'Geist', 'Plus Jakarta Sans', 'Helvetica Neue', sans-serif;
    }
    @keyframes klaudModalIn {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0)   scale(1); }
    }

    #klaud-modal-close {
      position: absolute; top: 14px; right: 14px;
      width: 32px; height: 32px; border-radius: 50%;
      background: #F1F5F9; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #64748B; font-size: 16px; line-height: 1;
      transition: background 0.15s;
    }
    #klaud-modal-close:hover { background: #E2E8F0; color: #13163A; }

    #klaud-modal .m-logo {
      text-align: center; margin-bottom: 24px;
      font-size: 18px; font-weight: 800; letter-spacing: -0.4px;
      color: #13163A;
    }
    #klaud-modal .m-logo span { color: #6C47FF; }

    /* Tabs */
    #klaud-modal .m-tabs {
      display: flex; border-bottom: 1.5px solid #E8EAF0;
      margin-bottom: 24px;
    }
    #klaud-modal .m-tab {
      flex: 1; background: none; border: none; padding: 9px 0;
      font-family: inherit; font-size: 14px; font-weight: 600;
      color: #6B7080; cursor: pointer; position: relative;
      transition: color 0.15s;
    }
    #klaud-modal .m-tab.active { color: #6C47FF; }
    #klaud-modal .m-tab.active::after {
      content: ''; position: absolute; bottom: -1.5px; left: 0; right: 0;
      height: 2px; background: #6C47FF; border-radius: 2px 2px 0 0;
    }

    #klaud-modal label {
      display: block; font-size: 12px; font-weight: 600;
      color: #374151; margin-bottom: 6px;
    }
    #klaud-modal input[type="email"],
    #klaud-modal input[type="password"],
    #klaud-modal .pw-wrap input[type="text"] {
      width: 100%; padding: 12px 14px;
      border: 1.5px solid #E8EAF0; border-radius: 10px;
      font-size: 14px; color: #13163A; outline: none;
      transition: border-color 0.2s; margin-bottom: 14px;
      font-family: inherit; background: #fff;
    }
    #klaud-modal input[type="email"]:focus,
    #klaud-modal input[type="password"]:focus,
    #klaud-modal .pw-wrap input[type="text"]:focus { border-color: #6C47FF; }

    #klaud-modal .pw-wrap { position: relative; width: 100%; margin-bottom: 14px; }
    #klaud-modal .pw-wrap input[type="password"],
    #klaud-modal .pw-wrap input[type="text"] {
      width: 100%; box-sizing: border-box; padding-right: 42px; margin-bottom: 0;
    }
    #klaud-modal input[type="password"]::-ms-reveal,
    #klaud-modal input[type="password"]::-ms-clear { display: none; }
    #klaud-modal .pw-toggle {
      -webkit-appearance: none; -moz-appearance: none; appearance: none;
      position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
      width: 30px; height: 30px; margin: 0;
      background: transparent; background-color: transparent;
      border: none; box-shadow: none; outline: none; padding: 0;
      border-radius: 8px; cursor: pointer;
      color: #BBBBBB; display: flex; align-items: center; justify-content: center;
      transition: color 0.15s, background-color 0.15s;
    }
    #klaud-modal .pw-toggle:hover { color: #6B7080; background-color: #F5F5F7; }
    #klaud-modal .pw-toggle:focus-visible { box-shadow: 0 0 0 2px rgba(108,71,255,0.18); }
    #klaud-modal .pw-toggle svg { width: 18px; height: 18px; display: block; }
    #klaud-modal .pw-toggle .icon-eye-off { display: none; }
    #klaud-modal .pw-toggle.showing .icon-eye { display: none; }
    #klaud-modal .pw-toggle.showing .icon-eye-off { display: block; }

    #klaud-modal .m-btn {
      width: 100%; padding: 13px;
      background: #13163A; color: #fff;
      border: none; border-radius: 10px;
      font-size: 15px; font-weight: 700;
      cursor: pointer; transition: background 0.2s;
      font-family: inherit; margin-top: 2px;
    }
    #klaud-modal .m-btn:hover:not(:disabled) { background: #6C47FF; }
    #klaud-modal .m-btn:disabled { background: #94A3B8; cursor: not-allowed; }

    #klaud-modal .m-forgot {
      display: block; text-align: right; font-size: 12px;
      color: #6C47FF; margin-top: -8px; margin-bottom: 16px;
      cursor: pointer; background: none; border: none;
      font-family: inherit; padding: 0;
    }
    #klaud-modal .m-forgot:hover { text-decoration: underline; }

    #klaud-modal .m-back-link {
      display: inline-block; margin-top: 14px; font-size: 12px;
      color: #6C47FF; cursor: pointer; background: none;
      border: none; font-family: inherit; padding: 0;
    }
    #klaud-modal .m-back-link:hover { text-decoration: underline; }

    #klaud-modal .m-msg {
      margin-top: 14px; padding: 12px 14px;
      border-radius: 10px; font-size: 13px;
      text-align: center; line-height: 1.6; display: none;
    }
    #klaud-modal .m-msg.success { background: #ECFDF5; color: #065F46; display: block; }
    #klaud-modal .m-msg.error   { background: #FEE2E2; color: #991B1B; display: block; }

    #klaud-modal .m-note {
      margin-top: 18px; font-size: 12px;
      color: #94A3B8; text-align: center; line-height: 1.6;
    }

    #klaud-modal .m-context {
      display: none;
      background: #F5F3FF; border: 1px solid #E4DEFF;
      border-radius: 10px; padding: 11px 14px;
      font-size: 12.5px; color: #5B3FD1; line-height: 1.55;
      text-align: center; margin-bottom: 20px;
    }

    #klaud-modal .m-view { display: none; }
    #klaud-modal .m-view.active { display: block; }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ─────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'klaud-modal-overlay';
  overlay.innerHTML = `
    <div id="klaud-modal">
      <button id="klaud-modal-close" aria-label="Tutup">✕</button>
      <div class="m-logo">belajar<span>claude</span></div>
      <div class="m-context" id="m-context"></div>

      <div class="m-tabs" id="m-tabs">
        <button class="m-tab active" data-tab="login">Masuk</button>
      </div>

      <!-- Login view -->
      <div class="m-view active" id="m-view-login">
        <label for="m-login-email">Email</label>
        <input type="email" id="m-login-email" placeholder="nama@email.com" autocomplete="email" />
        <label for="m-login-password">Password</label>
        <div class="pw-wrap">
          <input type="password" id="m-login-password" placeholder="Password kamu" autocomplete="current-password" />
          <button type="button" class="pw-toggle" id="m-pw-toggle" aria-label="Tampilkan password">
            <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg class="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M6.1 6.1C3.51 7.86 1 12 1 12s4 8 11 8a9.26 9.26 0 0 0 5.9-2.1"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
        <button class="m-forgot" id="m-forgot-link">Lupa password?</button>
        <button class="m-btn" id="m-login-btn">Masuk →</button>
        <div class="m-msg" id="m-login-msg"></div>
      </div>

      <!-- Forgot password view -->
      <div class="m-view" id="m-view-forgot">
        <p style="font-size:14px;color:#6B7080;margin-bottom:20px;line-height:1.6;">
          Masukkan email kamu. Kami kirimkan link untuk buat password baru.
        </p>
        <label for="m-forgot-email">Email</label>
        <input type="email" id="m-forgot-email" placeholder="nama@email.com" />
        <button class="m-btn" id="m-forgot-btn">Kirim Link Reset →</button>
        <div class="m-msg" id="m-forgot-msg"></div>
        <button class="m-back-link" id="m-back-to-login">← Kembali ke Masuk</button>
      </div>

      <p class="m-note">Dengan melanjutkan, kamu menyetujui syarat & ketentuan Belajar Claude.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── Internal helpers ────────────────────────────────────────────────────────
  function mSwitchTab(tab) {
    overlay.querySelectorAll('.m-tab').forEach(function(b) {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    mSwitchView(tab);
  }

  function mSwitchView(view) {
    overlay.querySelectorAll('.m-view').forEach(function(v) { v.classList.remove('active'); });
    var el = overlay.querySelector('#m-view-' + view);
    if (el) el.classList.add('active');
    var tabs = overlay.querySelector('#m-tabs');
    if (tabs) tabs.style.display = view === 'forgot' ? 'none' : 'flex';
    // Focus first input in active view
    if (el) {
      var inp = el.querySelector('input');
      if (inp) setTimeout(function() { inp.focus(); }, 60);
    }
  }

  function mShowMsg(el, type, text) {
    el.textContent = text; el.className = 'm-msg ' + type; el.style.display = '';
  }

  // ── Event listeners ─────────────────────────────────────────────────────────
  overlay.querySelector('#klaud-modal-close').addEventListener('click', function() {
    window.closeLoginModal();
  });

  // Password show/hide toggle
  overlay.querySelector('#m-pw-toggle').addEventListener('click', function() {
    var input = overlay.querySelector('#m-login-password');
    var showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    this.classList.toggle('showing', !showing);
    this.setAttribute('aria-label', showing ? 'Tampilkan password' : 'Sembunyikan password');
  });

  // Tab clicks
  overlay.querySelectorAll('.m-tab').forEach(function(btn) {
    btn.addEventListener('click', function() { mSwitchTab(btn.dataset.tab); });
  });

  // Forgot password link
  overlay.querySelector('#m-forgot-link').addEventListener('click', function() {
    mSwitchView('forgot');
  });

  // Back to login
  overlay.querySelector('#m-back-to-login').addEventListener('click', function() {
    mSwitchView('login');
    mSwitchTab('login');
  });

  // Login button
  overlay.querySelector('#m-login-btn').addEventListener('click', async function() {
    var email = overlay.querySelector('#m-login-email').value.trim();
    var password = overlay.querySelector('#m-login-password').value;
    var btn = overlay.querySelector('#m-login-btn');
    var msg = overlay.querySelector('#m-login-msg');

    if (!email || !password) return mShowMsg(msg, 'error', 'Isi email dan password ya.');
    btn.disabled = true; btn.textContent = 'Memproses...';
    msg.className = 'm-msg';

    var res = await sbClient.auth.signInWithPassword({ email: email, password: password });
    if (res.error) {
      var text = res.error.message.includes('Invalid login credentials')
        ? 'Email atau password salah. Belum punya password? Klik "Lupa password?" untuk buat password baru.'
        : res.error.message;
      mShowMsg(msg, 'error', text);
      btn.disabled = false; btn.textContent = 'Masuk →';
    } else {
      btn.textContent = 'Berhasil!';
      window.location.href = 'dashboard.html';
    }
  });

  // Forgot password button
  overlay.querySelector('#m-forgot-btn').addEventListener('click', async function() {
    var email = overlay.querySelector('#m-forgot-email').value.trim();
    var btn = overlay.querySelector('#m-forgot-btn');
    var msg = overlay.querySelector('#m-forgot-msg');

    if (!email || !email.includes('@')) return mShowMsg(msg, 'error', 'Masukkan email yang valid ya.');
    btn.disabled = true; btn.textContent = 'Mengirim...';
    msg.className = 'm-msg';

    // Same env-aware redirect as login.html's doForgot() — hardcoding production here
    // would send dev-site users to production's reset-password.html/dashboard.html.
    var res = await sbClient.auth.resetPasswordForEmail(email, {
      redirectTo: (location.hostname === 'belajarclaude.id'
        ? 'https://belajarclaude.id'
        : 'https://dev-belajar-claude.belajarclaude-id.workers.dev') + '/reset-password.html'
    });
    if (res.error) {
      mShowMsg(msg, 'error', res.error.message);
      btn.disabled = false; btn.textContent = 'Kirim Link Reset →';
    } else {
      mShowMsg(msg, 'success', 'Link reset sudah dikirim ke ' + email + '. Cek inbox kamu.');
      btn.textContent = 'Terkirim!';
    }
  });

  // Close on backdrop click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) window.closeLoginModal();
  });

  // Enter key support
  overlay.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { window.closeLoginModal(); return; }
    if (e.key !== 'Enter') return;
    var active = overlay.querySelector('.m-view.active');
    if (!active) return;
    if (active.id === 'm-view-login') overlay.querySelector('#m-login-btn').click();
    else if (active.id === 'm-view-forgot') overlay.querySelector('#m-forgot-btn').click();
  });

  // ── Public API ───────────────────────────────────────────────────────────────
  // contextMsg (optional): short explanatory line shown above the tabs, for when the
  // modal is triggered by an action other than a plain "Masuk"/"Daftar" nav click
  // (e.g. clicking "Beli All Access" while logged out) so it's clear why a login/signup
  // prompt just interrupted them instead of it feeling like a random popup.
  window.openLoginModal = function(defaultTab, contextMsg) {
    overlay.classList.add('open');
    // Reset all forms
    overlay.querySelectorAll('input').forEach(function(i) { i.value = ''; });
    overlay.querySelectorAll('.m-msg').forEach(function(m) { m.className = 'm-msg'; m.style.display = ''; });
    overlay.querySelectorAll('.m-btn').forEach(function(b) { b.disabled = false; });
    overlay.querySelector('#m-login-btn').textContent = 'Masuk →';
    overlay.querySelector('#m-forgot-btn').textContent = 'Kirim Link Reset →';
    // Context banner
    var ctxEl = overlay.querySelector('#m-context');
    if (contextMsg) { ctxEl.textContent = contextMsg; ctxEl.style.display = 'block'; }
    else { ctxEl.textContent = ''; ctxEl.style.display = 'none'; }
    // Show tabs, go to requested tab (default: login)
    overlay.querySelector('#m-tabs').style.display = 'flex';
    mSwitchTab(defaultTab || 'login');
  };

  window.closeLoginModal = function() {
    overlay.classList.remove('open');
  };

  // ── Intercept all login.html links ──────────────────────────────────────────
  document.addEventListener('click', async function(e) {
    const link = e.target.closest('a[href="login.html"]');
    if (!link) return;
    e.preventDefault();

    const { data: { session } } = await sbClient.auth.getSession();
    if (session) {
      const dest = link.getAttribute('data-dest') || 'dashboard.html';
      window.location.href = dest;
    } else {
      window.openLoginModal();
    }
  });

})();
