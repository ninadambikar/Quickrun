// ─── QuickRun App Utilities ───

// Toast notification
function showToast(msg, icon = '✓') {
  let toast = document.getElementById('qr-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'qr-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = `${icon} ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Cart state (sessionStorage)
const Cart = {
  get() {
    try { return JSON.parse(sessionStorage.getItem('qr_cart') || '[]'); } catch { return []; }
  },
  set(items) {
    sessionStorage.setItem('qr_cart', JSON.stringify(items));
    Cart.updateBadge();
  },
  add(item) {
    const items = Cart.get();
    const existing = items.find(i => i.id === item.id);
    if (existing) existing.qty += 1;
    else items.push({ ...item, qty: 1 });
    Cart.set(items);
  },
  remove(id) {
    const items = Cart.get();
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
      if (items[idx].qty > 1) items[idx].qty -= 1;
      else items.splice(idx, 1);
    }
    Cart.set(items);
  },
  clear() { Cart.set([]); },
  count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
  total() { return Cart.get().reduce((s, i) => s + i.price * i.qty, 0); },
  updateBadge() {
    const badge = document.getElementById('cart-badge');
    const count = Cart.count();
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
};

// User session
const Auth = {
  isLoggedIn() { return !!sessionStorage.getItem('qr_user'); },
  getUser() { try { return JSON.parse(sessionStorage.getItem('qr_user')); } catch { return null; } },
  login(user) { sessionStorage.setItem('qr_user', JSON.stringify(user)); },
  logout() { sessionStorage.removeItem('qr_user'); window.location.href = 'index.html'; }
};

// Redirect if not logged in (call on protected pages)
function requireAuth() {
  if (!Auth.isLoggedIn()) window.location.href = 'index.html';
}

// Format currency
function fmt(n) { return '$' + n.toFixed(2); }

// Ripple effect
document.addEventListener('click', function(e) {
  const target = e.target.closest('.ripple');
  if (!target) return;
  const r = document.createElement('span');
  const rect = target.getBoundingClientRect();
  r.style.cssText = `position:absolute;width:8px;height:8px;background:rgba(255,255,255,0.4);border-radius:50%;
    top:${e.clientY - rect.top - 4}px;left:${e.clientX - rect.left - 4}px;
    transform:scale(0);animation:rippleAnim 0.5s ease-out forwards;pointer-events:none;`;
  target.style.position = 'relative';
  target.style.overflow = 'hidden';
  target.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim{to{transform:scale(30);opacity:0}}';
document.head.appendChild(rippleStyle);

// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();

  // Animate items on load
  document.querySelectorAll('.animate-in').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animationDelay = `${i * 0.07}s`;
    setTimeout(() => el.style.opacity = '', 50);
  });
});
