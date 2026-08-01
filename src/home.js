(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    // ---- shared scroll reveal (one observer, unobserve after firing) ----
    var targets = document.querySelectorAll('.node, .out, .card, .price');
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('on'); });
      document.getElementById('tl').classList.add('on');
      startDemo(true);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);

        if (el.id === 'flow') { el.classList.add('run'); return; }
        if (el.id === 'tl')   { el.classList.add('on');  return; }

        // stagger siblings within a group
        var group = Array.prototype.filter.call(el.parentNode.children, function (c) {
          return c.classList.contains('node') || c.classList.contains('out') ||
                 c.classList.contains('card') || c.classList.contains('price');
        });
        var i = group.indexOf(el);
        setTimeout(function () { el.classList.add('on'); }, Math.max(0, i) * 90);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
    ['flow', 'tl'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });

    startDemo(false);
  }

  // ---- hero inbox loop ----
  function startDemo(staticMode) {
    var steps = document.querySelectorAll('#demo [data-step]');
    if (!steps.length) return;
    if (staticMode) {
      Array.prototype.forEach.call(steps, function (s) { s.classList.add('on'); });
      return;
    }
    var beats = [350, 1900, 3550, 5450, 6250];
    var cycle = 9800;
    var timers = [];
    function run() {
      timers.forEach(clearTimeout); timers = [];
      Array.prototype.forEach.call(steps, function (s) { s.classList.remove('on'); });
      Array.prototype.forEach.call(steps, function (el, i) {
        timers.push(setTimeout(function () { el.classList.add('on'); }, beats[i]));
      });
    }
    run();
    var loop = setInterval(run, cycle);

    // pause the loop when the hero is off-screen, which saves main-thread work
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !loop) { run(); loop = setInterval(run, cycle); }
          else if (!e.isIntersecting && loop) { clearInterval(loop); loop = null; }
        });
      }, { threshold: 0 }).observe(document.getElementById('demo'));
    }
  }

  // defer setup until after first paint so it never competes with LCP
  if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 1200 });
  else window.addEventListener('load', init);
})();