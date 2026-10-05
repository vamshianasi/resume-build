// Highlights the nav link for the section currently in view.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  if (!links.length) return;

  var sections = links
    .map(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      var el = document.getElementById(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  function update() {
    var pos = window.scrollY + 140;
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
      update();
      ticking = false;
    });
  }, { passive: true });

  update();
})();