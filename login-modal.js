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
    #klaud-modal input[type="password"] {
      width: 100%; padding: 12px 14px;
      border: 1.5px solid #E8EAF0; border-radius: 10px;
      font-size: 14px; color: #13163A; outline: none;
      transition: border-color 0.2s; margin-bottom: 14px;
      font-family: inherit; background: #fff;
    }
    #klaud-modal input[type="email"]:focus,
    #klaud-modal input[type="password"]:focus { border-color: #6C47FF; }

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

      <div class="m-tabs" id="m-tabs">
        <button class="m-tab active" data-tab="login">Masuk</button>
        <button class="m-tab" data-tab="register">Daftar</button>
      </div>

      <!-- Login view -->
      <div class="m-view active" id="m-view-login">
        <label for="m-login-email">Email</label>
        <input type="email" id="m-login-email" placeholder="nama@email.com" autocomplete="email" />
        <label for="m-login-password">Password</label>
        <input type="password" id="m-login-password" placeholder="Password kamu" autocomplete="current-password" />
        <button class="m-forgot" id="m-forgot-link">Lupa password?</button>
        <button class="m-btn" id="m-login-btn">Masuk →</button>
        <div class="m-msg" id="m-login-msg"></div>
      </div>

      <!-- Register view -->
      <div class="m-view" id="m-view-register">
        <label for="m-reg-email">Email</label>
        <input type="email" id="m-reg-email" placeholder="nama@email.com" autocomplete="email" />
        <label for="m-reg-password">Password</label>
        <input type="password" id="m-reg-password" placeholder="Minimal 6 karakter" autocomplete="new-password" />
        <label for="m-reg-confirm">Konfirmasi Password</label>
        <input type="password" id="m-reg-confirm" placeholder="Ulangi password" autocomplete="new-password" style="margin-bottom:14px;" />
        <button class="m-btn" id="m-reg-btn">Daftar →</button>
        <div class="m-msg" id="m-reg-msg"></div>
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

  // Register button
  overlay.querySelector('#m-reg-btn').addEventListener('click', async function() {
    var email = overlay.querySelector('#m-reg-email').value.trim();
    var password = overlay.querySelector('#m-reg-password').value;
    var confirm = overlay.querySelector('#m-reg-confirm').value;
    var btn = overlay.querySelector('#m-reg-btn');
    var msg = overlay.querySelector('#m-reg-msg');

    if (!email || !password) return mShowMsg(msg, 'error', 'Isi semua kolom ya.');
    if (password.length < 6) return mShowMsg(msg, 'error', 'Password minimal 6 karakter.');
    if (password !== confirm) return mShowMsg(msg, 'error', 'Konfirmasi password tidak cocok.');

    btn.disabled = true; btn.textContent = 'Mendaftar...';
    msg.className = 'm-msg';

    var res = await sbClient.auth.signUp({ email: email, password: password });
    if (res.error) {
      mShowMsg(msg, 'error', res.error.message);
      btn.disabled = false; btn.textContent = 'Daftar →';
    } else if (res.data.session) {
      btn.textContent = 'Berhasil!';
      window.location.href = 'dashboard.html';
    } else {
      mShowMsg(msg, 'success', 'Cek inbox ' + email + ' untuk konfirmasi akun, lalu kembali untuk masuk.');
      btn.disabled = false; btn.textContent = 'Daftar →';
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

    var res = await sbClient.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://belajar-claude.vercel.app/reset-password.html'
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
    else if (active.id === 'm-view-register') overlay.querySelector('#m-reg-btn').click();
    else if (active.id === 'm-view-forgot') overlay.querySelector('#m-forgot-btn').click();
  });

  // ── Public API ───────────────────────────────────────────────────────────────
  window.openLoginModal = function(defaultTab) {
    overlay.classList.add('open');
    // Reset all forms
    overlay.querySelectorAll('input').forEach(function(i) { i.value = ''; });
    overlay.querySelectorAll('.m-msg').forEach(function(m) { m.className = 'm-msg'; m.style.display = ''; });
    overlay.querySelectorAll('.m-btn').forEach(function(b) { b.disabled = false; });
    overlay.querySelector('#m-login-btn').textContent = 'Masuk →';
    overlay.querySelector('#m-reg-btn').textContent = 'Daftar →';
    overlay.querySelector('#m-forgot-btn').textContent = 'Kirim Link Reset →';
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
