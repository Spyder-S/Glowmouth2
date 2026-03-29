(function () {
  'use strict';

  /* ── Nav scroll border ───────────────────────────────── */
  var siteNav = document.querySelector('nav.site-nav');
  if (siteNav) {
    function onScroll() {
      siteNav.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ─────────────────────────────────── */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === '') page = 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });

  /* ── Hamburger ───────────────────────────────────────── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── FAQ accordion ───────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      /* close all */
      document.querySelectorAll('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
        i.querySelector('.faq-indicator').textContent  = '+';
      });

      /* open clicked if it was closed */
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.faq-answer').style.maxHeight =
          item.querySelector('.faq-answer').scrollHeight + 'px';
        item.querySelector('.faq-indicator').textContent  = '−';
      }
    });
  });

  /* ── Waitlist form ───────────────────────────────────── */
  var form = document.getElementById('waitlist-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var btn   = form.querySelector('button[type="submit"]');
      if (input && btn && input.value.trim()) {
        btn.textContent  = "You're on the list";
        btn.disabled     = true;
        input.disabled   = true;
        input.value      = '';
        input.placeholder = "Thanks — we'll be in touch.";
      }
    });
  }

})();
