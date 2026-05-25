/* =============================================
   ADOM SACCO — Main JavaScript
   ============================================= */

/* ---- MOBILE NAV ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');

function openMobileNav() {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}
if (hamburger) hamburger.addEventListener('click', function () {
  this.classList.toggle('open');
  openMobileNav();
});
if (mobileNavClose) mobileNavClose.addEventListener('click', function () {
  closeMobileNav();
  hamburger.classList.remove('open');
});
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', function () {
  closeMobileNav();
  hamburger.classList.remove('open');
});

/* ---- SCROLL TO TOP ---- */
const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', function () {
  if (window.scrollY > 400) {
    scrollBtn && scrollBtn.classList.add('visible');
  } else {
    scrollBtn && scrollBtn.classList.remove('visible');
  }
});
if (scrollBtn) scrollBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- FADE IN ANIMATIONS ---- */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { observer.observe(el); });
}

/* ---- PRODUCTS TABS ---- */
function activateTab(tabId) {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(function (t) { t.classList.remove('active'); });
  panels.forEach(function (p) { p.classList.remove('active'); });
  const btn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
  const panel = document.getElementById(tabId);
  if (btn) btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = this.dataset.tab;
      activateTab(target);
    });
  });
}

/* ---- LOAN CALCULATOR ---- */
function initCalculator() {
  const amountSlider = document.getElementById('loanAmount');
  const termSlider = document.getElementById('loanTerm');
  const amountDisplay = document.getElementById('amountDisplay');
  const termDisplay = document.getElementById('termDisplay');
  const monthlyDisplay = document.getElementById('monthlyPayment');
  const totalDisplay = document.getElementById('totalPayment');
  const interestDisplay = document.getElementById('totalInterest');
  const rateSelect = document.getElementById('loanType');

  if (!amountSlider) return;

  const rates = {
    development: 12,
    emergency: 10,
    school: 9,
    business: 14
  };

  function formatKES(n) {
    return 'KSh ' + Math.round(n).toLocaleString('en-KE');
  }

  function calculate() {
    const amount = parseFloat(amountSlider.value);
    const months = parseInt(termSlider.value);
    const rateKey = rateSelect ? rateSelect.value : 'development';
    const annualRate = rates[rateKey] || 12;
    const monthlyRate = annualRate / 100 / 12;
    let monthly;
    if (monthlyRate === 0) {
      monthly = amount / months;
    } else {
      monthly = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    const total = monthly * months;
    const interest = total - amount;

    if (amountDisplay) amountDisplay.textContent = formatKES(amount);
    if (termDisplay) termDisplay.textContent = months + ' months';
    if (monthlyDisplay) monthlyDisplay.textContent = formatKES(monthly);
    if (totalDisplay) totalDisplay.textContent = formatKES(total);
    if (interestDisplay) interestDisplay.textContent = formatKES(interest);
  }

  amountSlider.addEventListener('input', calculate);
  termSlider.addEventListener('input', calculate);
  if (rateSelect) rateSelect.addEventListener('change', calculate);
  calculate();
}

/* ---- COUNTER ANIMATION ---- */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        if (isNaN(target)) return;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = target * ease;
          el.textContent = prefix + current.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { observer.observe(c); });
}

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  closeMobileNav && closeMobileNav();
  if (hamburger) hamburger.classList.remove('open');
  if (target.classList.contains('tab-panel')) {
    activateTab(id);
  }
  setTimeout(function () {
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }, 100);
});

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = '✓ Message Sent! We will get back to you soon.';
      btn.style.background = '#1E7B4B';
      contactForm.reset();
      setTimeout(function () {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* ---- SINGLE INIT (consolidated) ---- */
document.addEventListener('DOMContentLoaded', function () {
  initFadeIn();
  initTabs();
  initCalculator();
  animateCounters();

  /* Navbar scroll shadow (moved here for cleanliness) */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 20px rgba(11,31,58,0.15)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(11,31,58,0.10)';
      }
    });
  }
});
