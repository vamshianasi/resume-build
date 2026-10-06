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
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 10) {
        topbar.classList.add('scrolled');
      } else {
        topbar.classList.remove('scrolled');
      }
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

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- 3D tilt effect on cards ---
  var tiltCards = document.querySelectorAll('.tilt-card');
  var maxTilt = 8;

  tiltCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -maxTilt;
      var rotateY = ((x - centerX) / centerX) * maxTilt;
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  // --- Parallax effect on hero orbs ---
  var orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length && 'IntersectionObserver' in window) {
    var heroSection = document.querySelector('.hero');
    if (heroSection) {
      window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          orbs.forEach(function (orb, i) {
            var speed = 0.15 + (i * 0.05);
            orb.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
          });
        }
      }, { passive: true });
    }
  }
})();
