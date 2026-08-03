// ─── Belajar Claude Payment Success Modal ──────────────────────────────────────────
// Call window.showPaymentSuccess() after a successful Duitku payment.
//
// Guest checkout creates the account server-side with no browser session — so most
// buyers here have no session yet, and their real next step is the one-click
// "set password" link waiting in their email, NOT the dashboard (which would just
// bounce them to a login screen they can't use). So: if a session already exists
// (buyer was logged in before paying), skip this modal and go straight to the
// dashboard — no reason to make them read 3 steps or wait out a countdown. If there's
// no session, show the modal with no auto-redirect (there's nowhere useful to send
// them yet) and point them at their email instead.

(function () {
  const style = document.createElement('style');
  style.textContent = `
    #ps-overlay {
      display: none;
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    #ps-overlay.open { display: flex; }

    #ps-modal {
      background: #fff;
      border-radius: 20px;
      padding: 44px 36px 36px;
      max-width: 460px;
      width: 100%;
      box-shadow: 0 24px 64px rgba(0,0,0,0.18);
      text-align: center;
      font-family: 'Geist', system-ui, sans-serif;
      animation: psIn 0.25s ease;
      position: relative;
    }
    @keyframes psIn {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    #ps-modal .ps-icon { font-size: 52px; margin-bottom: 16px; }

    #ps-modal h2 {
      font-size: 22px; font-weight: 800;
      color: #111111; margin-bottom: 8px; letter-spacing: -0.4px;
    }

    #ps-modal .ps-sub {
      font-size: 14px; color: #777777;
      line-height: 1.65; margin-bottom: 28px;
    }

    #ps-modal .ps-steps {
      text-align: left; margin-bottom: 28px;
      display: flex; flex-direction: column; gap: 14px;
    }

    #ps-modal .ps-step {
      display: flex; align-items: flex-start; gap: 12px;
    }

    #ps-modal .ps-num {
      width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
      background: rgba(108,71,255,0.08); color: #6C47FF;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800;
    }

    #ps-modal .ps-step-title { font-size: 13px; font-weight: 700; color: #111111; margin-bottom: 2px; }
    #ps-modal .ps-step-desc  { font-size: 12px; color: #777777; line-height: 1.5; }

    #ps-modal .ps-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      width: 100%; background: #111111; color: #fff;
      font-size: 14px; font-weight: 700; padding: 13px 24px;
      border-radius: 10px; border: none; cursor: pointer;
      font-family: inherit; text-decoration: none;
      transition: background 0.2s;
    }
    #ps-modal .ps-btn:hover { background: #333; }

    #ps-modal .ps-timer {
      font-size: 12px; color: #BBBBBB; margin-top: 12px;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'ps-overlay';
  overlay.innerHTML = `
    <div id="ps-modal">
      <div class="ps-icon">🎉</div>
      <h2>Pembayaran Berhasil!</h2>
      <p class="ps-sub">Kursusmu sudah aktif dan siap untuk dimulai.</p>
      <div class="ps-steps">
        <div class="ps-step">
          <div class="ps-num">1</div>
          <div>
            <div class="ps-step-title">Cek email kamu</div>
            <div class="ps-step-desc">Konfirmasi dan link akses sudah dikirim ke inbox kamu.</div>
          </div>
        </div>
        <div class="ps-step">
          <div class="ps-num">2</div>
          <div>
            <div class="ps-step-title">Set password lewat email</div>
            <div class="ps-step-desc">Klik link di email untuk buat password — baru bisa masuk ke dashboard.</div>
          </div>
        </div>
        <div class="ps-step">
          <div class="ps-num">3</div>
          <div>
            <div class="ps-step-title">Mulai belajar</div>
            <div class="ps-step-desc">Akses selamanya — belajar sesuai pace kamu sendiri.</div>
          </div>
        </div>
      </div>
      <button class="ps-btn" id="ps-btn">Oke, Saya Akan Cek Email</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#ps-btn').addEventListener('click', () => {
    overlay.classList.remove('open');
  });

  window.showPaymentSuccess = async function () {
    let hasSession = false;
    try {
      const { data: { session } } = await sbClient.auth.getSession();
      hasSession = !!session;
    } catch (e) { /* fail closed — treat as guest, safer default */ }

    if (hasSession) {
      // Already had a session before paying — enrollment is live immediately, no
      // reason to interrupt with this modal at all.
      window.location.href = 'dashboard.html';
      return;
    }
    overlay.classList.add('open');
  };
})();
