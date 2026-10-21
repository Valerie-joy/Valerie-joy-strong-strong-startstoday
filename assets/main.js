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

/* Payment method buttons (mockup only — the real GHL form handles this) */
document.querySelectorAll('.pay-method').forEach(function (btn, _, all) {
  btn.addEventListener('click', function () {
    all.forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
    btn.setAttribute('aria-checked', 'true');
  });
});
