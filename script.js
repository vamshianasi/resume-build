// Mobile nav toggle, active link highlighting, topbar scroll effect, scroll reveals.
(function () {
  'use strict';

  // --- Mobile nav toggle ---
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu when a link is clicked (mobile).
    nav.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on resize to desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Topbar scroll effect ---
  var topbar = document.getElementById('topbar');
  if (topbar) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 10) {
        topbar.classList.add('scrolled');
      } else {
        topbar.classList.remove('scrolled');
      }
      lastScroll = y;
    }, { passive: true });
  }

  // --- Active nav link highlighting ---
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  if (links.length) {
    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href').replace('#', '');
        var el = document.getElementById(id);
        return el ? { link: link, el: el } : null;
      })
      .filter(Boolean);

    function updateActive() {
      var pos = window.scrollY + 160;
      var current = null;

      sections.forEach(function (item) {
        if (item.el.offsetTop <= pos) current = item;
      });

      links.forEach(function (link) { link.classList.remove('active'); });
      if (current) current.link.classList.add('active');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateActive();
        ticking = false;
      });
    }, { passive: true });

    updateActive();
  }

  // --- Scroll reveal animations ---
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all if IntersectionObserver not supported.
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();