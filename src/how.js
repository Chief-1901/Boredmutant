(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function nodesOf(wf) {
    // document order = execution order; the fork's three arms light together
    return Array.prototype.slice.call(wf.querySelectorAll('.wfn'));
  }

  function play(wf) {
    var nodes = nodesOf(wf);
    if (reduced) { nodes.forEach(function (n) { n.classList.add('lit'); }); return; }
    if (wf.dataset.busy === '1') return;
    wf.dataset.busy = '1';
    nodes.forEach(function (n) { n.classList.remove('lit'); });
    wf.classList.remove('running');
    void wf.offsetWidth;            // restart the wire animations
    wf.classList.add('running');

    var step = 620;
    nodes.forEach(function (n, i) {
      setTimeout(function () { n.classList.add('lit'); }, 220 + i * step);
    });
    setTimeout(function () {
      wf.classList.remove('running');
      wf.dataset.busy = '0';
    }, 400 + nodes.length * step);
  }

  function init() {
    var canvases = document.querySelectorAll('.wf');
    if (!canvases.length) return;

    Array.prototype.forEach.call(document.querySelectorAll('[data-replay]'), function (b) {
      b.addEventListener('click', function () {
        var wf = document.getElementById(b.getAttribute('data-replay'));
        if (wf) play(wf);
      });
    });

    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(canvases, function (wf) {
        nodesOf(wf).forEach(function (n) { n.classList.add('lit'); });
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        play(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' });

    Array.prototype.forEach.call(canvases, function (wf) { io.observe(wf); });

    // generic reveals shared with the rest of the site
    var rev = document.querySelectorAll('.card, .out, .price');
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        e.target.classList.add('on');
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(rev, function (el) { io2.observe(el); });
  }

  if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 1200 });
  else window.addEventListener('load', init);
})();
