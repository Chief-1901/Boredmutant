(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var targets = document.querySelectorAll('.card, .datecard, .pstep, .price, .out, .node');
    var tl = document.getElementById('tl');

    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('on'); });
      if (tl) tl.classList.add('on');
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        if (el.id === 'tl') { el.classList.add('on'); return; }
        var group = Array.prototype.filter.call(el.parentNode.children, function (c) {
          return c.classList.contains(el.classList[0]);
        });
        var i = group.indexOf(el);
        setTimeout(function () { el.classList.add('on'); }, Math.max(0, i) * 85);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
    if (tl) io.observe(tl);
  }

  if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 1200 });
  else window.addEventListener('load', init);
})();
