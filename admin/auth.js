/**
 * auth.js — Shared admin authentication logic
 * theAIReadyist · Admin layer
 *
 * HOW TO SET YOUR PASSWORD:
 * 1. Open your browser console (F12)
 * 2. Run this with your chosen password:
 *      hashPassword('yourchosenpassword').then(h => console.log(h))
 * 3. Copy the output hash and replace ADMIN_HASH below
 * 4. Deploy — the plaintext password is never stored anywhere
 *
 * DEFAULT HASH = SHA-256 of:  aireadyist2026
 * Change before deploying to production.
 */

const ADMIN_HASH = '73ceb15f18bb0a313c8880abe54bf61a529dd8f1e75b084dd39926a1518d3d2f';

// ─────────────────────────────────────────────
// Core: async SHA-256 hash using Web Crypto API
// ─────────────────────────────────────────────

async function hashPassword(str) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}

// ─────────────────────────────────────────────
// Login page: attempt login
// Called by login.html button / enter key
// ─────────────────────────────────────────────

async function attemptLogin() {
  // Lockout check
  const lockUntil = parseInt(localStorage.getItem('admin_lock_until') || '0', 10);
  if (Date.now() < lockUntil) {
    showLockout(lockUntil);
    return;
  }

  const input    = document.getElementById('password').value;
  const errEl    = document.getElementById('error-msg');
  const noteEl   = document.getElementById('attempts-note');
  const card     = document.getElementById('login-card');
  let   attempts = parseInt(sessionStorage.getItem('admin_attempts') || '0', 10);

  const hash = await hashPassword(input);

  if (hash === ADMIN_HASH) {
    // ✓ Success
    sessionStorage.setItem('aireadyist_admin_auth', 'true');
    sessionStorage.removeItem('admin_attempts');
    window.location.replace('./index.html');
  } else {
    // ✗ Failure
    attempts++;
    sessionStorage.setItem('admin_attempts', attempts);

    // Shake
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');

    errEl.classList.add('visible');
    document.getElementById('password').value = '';
    document.getElementById('password').focus();

    if (attempts >= 5) {
      const until = Date.now() + 15 * 60 * 1000;
      localStorage.setItem('admin_lock_until', until);
      showLockout(until);
    } else {
      const left = 5 - attempts;
      noteEl.textContent = left + ' attempt' + (left === 1 ? '' : 's') + ' remaining before lockout.';
    }
  }
}

function showLockout(until) {
  document.getElementById('lock-msg').classList.add('visible');
  document.getElementById('login-form-wrap').style.display = 'none';
  setTimeout(() => window.location.reload(), until - Date.now());
}

function checkLockout() {
  const lockUntil = parseInt(localStorage.getItem('admin_lock_until') || '0', 10);
  if (Date.now() < lockUntil) {
    const lockEl = document.getElementById('lock-msg');
    const formEl = document.getElementById('login-form-wrap');
    if (lockEl) lockEl.classList.add('visible');
    if (formEl) formEl.style.display = 'none';
    setTimeout(() => window.location.reload(), lockUntil - Date.now());
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────
// Guard: protect every admin page
// Call guardAdmin() on any page inside /admin/
// ─────────────────────────────────────────────

function guardAdmin() {
  if (sessionStorage.getItem('aireadyist_admin_auth') !== 'true') {
    window.location.replace('/admin/login.html');
  }
}

// ─────────────────────────────────────────────
// Sign out
// ─────────────────────────────────────────────

function adminSignOut() {
  sessionStorage.removeItem('aireadyist_admin_auth');
  window.location.replace('/admin/login.html');
}
