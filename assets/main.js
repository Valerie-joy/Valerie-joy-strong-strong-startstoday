/* Strong Starts Today — small progressive enhancements.
   The page works fully without this file; it only adds polish. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Header: add a hairline + shadow once the page scrolls */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll reveal: fade sections up once */
  var reveals = document.querySelectorAll('.reveal');
  if (!hasIO || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  if (!hasIO) return;

  /* Nav: highlight the link for the section in view */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var byId = {};
  links.forEach(function (link) { byId[link.getAttribute('href').slice(1)] = link; });
  var navIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = byId[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(byId).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) navIO.observe(section);
  });
  // Back on the hero: no section link should look active
  var heroEl = document.querySelector('.hero');
  if (heroEl) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
      }
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(heroEl);
  }

  /* Mobile CTA bar: show after the hero, hide while checkout is on screen */
  var bar = document.querySelector('.mobile-cta');
  var hero = document.querySelector('.hero');
  var enroll = document.getElementById('enroll');
  if (bar && hero && enroll) {
    var pastHero = false, atEnroll = false;
    var update = function () {
      var show = pastHero && !atEnroll;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      bar.querySelectorAll('a').forEach(function (a) { a.tabIndex = show ? 0 : -1; });
    };
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (e) { atEnroll = e[0].isIntersecting; update(); }).observe(enroll);
    update();
  }
})();

/* =========================================================
   Demo checkout.
   Everything here runs in the browser only: nothing is sent
   over the network and nothing is stored. Card fields are
   locked to Stripe's public test card.
   ========================================================= */
(function () {
  'use strict';
  var form = document.getElementById('checkout');
  if (!form) return;

  var success = document.getElementById('success');
  var alertBox = document.getElementById('form-alert');
  var submitBtn = document.getElementById('submit-btn');

  /* ---------- Validation ---------- */
  var rules = {
    'ss-name': function (v) {
      if (!v) return 'Please enter your full name.';
      if (v.split(/\s+/).filter(Boolean).length < 2) return 'Please enter your first and last name.';
      return '';
    },
    'ss-email': function (v) {
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'That email doesn’t look quite right — check for a typo.';
      return '';
    },
    'ss-phone': function (v) {
      var digits = v.replace(/\D/g, '');
      if (!digits) return 'Please enter your phone number.';
      if (digits.length < 10 || digits.length > 15) return 'Please enter a full phone number, including area code.';
      return '';
    }
  };

  function showError(input, msg) {
    var err = document.getElementById(input.id + '-err');
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      err.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>';
      err.appendChild(document.createTextNode(msg));
      err.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      err.hidden = true;
      err.textContent = '';
    }
  }

  function validate(input) {
    var msg = rules[input.id](input.value.trim());
    showError(input, msg);
    return !msg;
  }

  Object.keys(rules).forEach(function (id) {
    var input = document.getElementById(id);
    // Check when she leaves a field; once flagged, re-check as she types
    input.addEventListener('blur', function () { if (input.value.trim()) validate(input); });
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid')) validate(input); });
  });

  /* ---------- Payment method (radio group with arrow keys) ---------- */
  var methods = Array.prototype.slice.call(form.querySelectorAll('.pay-method'));
  var panels = form.querySelectorAll('.pay-panel');
  function selectMethod(btn, focus) {
    methods.forEach(function (b) {
      var on = b === btn;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== btn.getAttribute('data-method'); });
    if (focus) btn.focus();
  }
  methods.forEach(function (btn, i) {
    btn.addEventListener('click', function () { selectMethod(btn); });
    btn.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = methods[(i + 1) % methods.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = methods[(i - 1 + methods.length) % methods.length];
      if (next) { e.preventDefault(); selectMethod(next, true); }
    });
  });

  /* ---------- Coupon (never changes the price in the demo) ---------- */
  var couponBtn = document.getElementById('coupon-btn');
  var couponInput = document.getElementById('ss-coupon');
  var couponMsg = document.getElementById('ss-coupon-msg');
  function applyCoupon() {
    var code = couponInput.value.trim();
    couponMsg.textContent = code
      ? 'Coupon “' + code.toUpperCase() + '” would be checked at the live checkout. Your total stays $49.97 in this demo.'
      : 'Enter a code to apply it.';
  }
  couponBtn.addEventListener('click', applyCoupon);
  couponInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } });

  /* ---------- Submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (id) {
      var input = document.getElementById(id);
      if (!validate(input) && !firstBad) firstBad = input;
    });
    if (firstBad) {
      alertBox.textContent = 'Please fix the highlighted field' + (form.querySelectorAll('[aria-invalid="true"]').length > 1 ? 's' : '') + ' to continue.';
      alertBox.hidden = false;
      firstBad.focus();
      return;
    }
    alertBox.hidden = true;

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn__label').textContent = 'Processing…';

    // Simulated processing delay — no request is made
    setTimeout(function () {
      var name = document.getElementById('ss-name').value.trim();
      document.getElementById('success-name').textContent = name.split(/\s+/)[0];
      document.getElementById('success-email').textContent = document.getElementById('ss-email').value.trim();
      form.hidden = true;
      success.hidden = false;
      var title = document.getElementById('success-title');
      title.focus({ preventScroll: true });
      success.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }, 1400);
  });

  /* ---------- Reset ---------- */
  document.getElementById('reset-demo').addEventListener('click', function () {
    form.reset();
    Object.keys(rules).forEach(function (id) { showError(document.getElementById(id), ''); });
    selectMethod(methods[0]);
    couponMsg.textContent = '';
    alertBox.hidden = true;
    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn__label').innerHTML = 'Start My 14-Day Strong Start &nbsp;·&nbsp; $49.97';
    success.hidden = true;
    form.hidden = false;
    document.getElementById('ss-name').focus();
  });
})();
