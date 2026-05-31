// ─── Klaud.id Login Modal ────────────────────────────────────────────────────
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
      font-family: 'Plus Jakarta Sans', 'Helvetica Neue', sans-serif;
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
      font-size: 24px; font-weight: 800; letter-spacing: -0.5px;
      color: #13163A;
    }
    #klaud-modal .m-logo span { color: #4A72D6; }

    #klaud-modal h2 {
      font-size: 20px; font-weight: 800; color: #13163A;
      margin-bottom: 6px; letter-spacing: -0.3px;
    }
    #klaud-modal .m-sub {
      font-size: 14px; color: #6B7080; line-height: 1.65;
      margin-bottom: 28px;
    }

    #klaud-modal label {
      display: block; font-size: 12px; font-weight: 600;
      color: #374151; margin-bottom: 6px; letter-spacing: 0.3px;
    }
    #klaud-modal input[type="email"] {
      width: 100%; padding: 12px 14px;
      border: 1.5px solid #E8EAF0; border-radius: 10px;
      font-size: 14px; color: #13163A; outline: none;
      transition: border-color 0.2s; margin-bottom: 14px;
      font-family: inherit; background: #fff;
    }
    #klaud-modal input[type="email"]:focus { border-color: #4A72D6; }

    #klaud-modal-btn {
      width: 100%; padding: 13px;
      background: #13163A; color: #fff;
      border: none; border-radius: 10px;
      font-size: 15px; font-weight: 700;
      cursor: pointer; transition: background 0.2s;
      font-family: inherit;
    }
    #klaud-modal-btn:hover:not(:disabled) { background: #4A72D6; }
    #klaud-modal-btn:disabled { background: #94A3B8; cursor: not-allowed; }

    #klaud-modal-msg {
      margin-top: 14px; padding: 12px 14px;
      border-radius: 10px; font-size: 13px;
      text-align: center; line-height: 1.6; display: none;
    }
    #klaud-modal-msg.success { background: #ECFDF5; color: #065F46; display: block; }
    #klaud-modal-msg.error   { background: #FEE2E2; color: #991B1B; display: block; }

    #klaud-modal .m-note {
      margin-top: 18px; font-size: 12px;
      color: #94A3B8; text-align: center; line-height: 1.6;
    }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ─────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'klaud-modal-overlay';
  overlay.innerHTML = `
    <div id="klaud-modal">
      <button id="klaud-modal-close" onclick="window.closeLoginModal()" aria-label="Tutup">✕</button>
      <div class="m-logo">Klaud<span>.id</span></div>
      <h2>Masuk atau Daftar</h2>
      <p class="m-sub">Masukkan email kamu — kami kirimkan link masuk langsung ke inbox. Tidak perlu password.</p>
      <div id="klaud-modal-form">
        <label for="klaud-modal-email">Email</label>
        <input type="email" id="klaud-modal-email" placeholder="nama@email.com" />
        <button id="klaud-modal-btn" onclick="window.sendModalMagicLink()">Lanjutkan →</button>
      </div>
      <div id="klaud-modal-msg"></div>
      <p class="m-note">Dengan melanjutkan, kamu menyetujui syarat & ketentuan Klaud.id.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) window.closeLoginModal();
  });

  // Enter key support
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.sendModalMagicLink();
    if (e.key === 'Escape') window.closeLoginModal();
  });

  // ── Public API ───────────────────────────────────────────────────────────────
  window.openLoginModal = function () {
    overlay.classList.add('open');
    // Reset form state
    const form = document.getElementById('klaud-modal-form');
    const msg  = document.getElementById('klaud-modal-msg');
    const btn  = document.getElementById('klaud-modal-btn');
    const inp  = document.getElementById('klaud-modal-email');
    form.style.opacity = '';
    form.style.pointerEvents = '';
    msg.className = 'klaud-modal-msg';
    msg.style.display = 'none';
    btn.disabled = false;
    btn.textContent = 'Lanjutkan →';
    btn.style.background = '';
    inp.value = '';
    setTimeout(() => inp.focus(), 100);
  };

  window.closeLoginModal = function () {
    overlay.classList.remove('open');
  };

  window.sendModalMagicLink = async function () {
    const email = document.getElementById('klaud-modal-email').value.trim();
    const btn   = document.getElementById('klaud-modal-btn');
    const msg   = document.getElementById('klaud-modal-msg');

    if (!email || !email.includes('@')) {
      msg.innerHTML = 'Masukkan alamat email yang valid ya.';
      msg.className = 'error';
      msg.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Mengirim...';
    msg.style.display = 'none';

    const { error } = await sbClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://juliautomo.github.io/klaud-id/dashboard.html' },
    });

    if (error) {
      msg.innerHTML = 'Gagal mengirim email: ' + error.message;
      msg.className = 'error';
      msg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Lanjutkan →';
    } else {
      btn.textContent = '✉️ Link terkirim!';
      btn.style.background = '#065F46';
      msg.innerHTML = 'Link masuk sudah dikirim ke <strong>' + email + '</strong>.<br>Cek inbox dan klik linknya untuk masuk.';
      msg.className = 'success';
      msg.style.display = 'block';
      document.getElementById('klaud-modal-form').style.opacity = '0.5';
      document.getElementById('klaud-modal-form').style.pointerEvents = 'none';
    }
  };

  // ── Intercept all login.html links ──────────────────────────────────────────
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[href="login.html"]');
    if (!link) return;
    e.preventDefault();

    // Check if already logged in
    const { data: { session } } = await sbClient.auth.getSession();
    if (session) {
      // Already logged in — go to dashboard or the course/package destination
      const dest = link.getAttribute('data-dest') || 'dashboard.html';
      window.location.href = dest;
    } else {
      window.openLoginModal();
    }
  });

})();
