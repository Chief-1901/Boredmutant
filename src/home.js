/* Homepage demo. The first scenario is rendered into the page by build.py, so the
   desk reads correctly without JS. This script adds the tabs, the fill-in sequence,
   the source highlighting and the approval stamp. DEMOS is injected by build.py. */
(function () {
  var root = document.querySelector("[data-demo]");
  if (!root || typeof DEMOS === "undefined") return;

  var stage = root.querySelector(".demo-stage");
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".demo-tab"));
  var status = root.querySelector(".status");
  var statusText = root.querySelector(".status-text");
  var approve = root.querySelector(".approve");
  var replay = root.querySelector(".replay");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = DEMOS[0];
  var timers = [];
  var seen = false;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function setStatus(state, text) {
    status.setAttribute("data-state", state);
    statusText.textContent = text;
  }

  function renderSource(src) {
    var doc = el("article", "doc doc--" + src.kind.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, ""));
    var head = el("div", "doc-head");
    head.appendChild(el("span", "doc-kind", src.kind));
    var meta = el("dl", "doc-meta");
    src.meta.forEach(function (m) {
      var d = el("div");
      d.appendChild(el("dt", null, m[0]));
      d.appendChild(el("dd", null, m[1]));
      meta.appendChild(d);
    });
    head.appendChild(meta);
    doc.appendChild(head);
    var body = el("div", "doc-body");
    src.paras.forEach(function (para) {
      var p = el("p");
      para.forEach(function (seg) {
        if (typeof seg === "string") p.appendChild(document.createTextNode(seg));
        else {
          var s = el("span", "src", seg[1]);
          s.setAttribute("data-id", seg[0]);
          p.appendChild(s);
        }
      });
      body.appendChild(p);
    });
    doc.appendChild(body);
    return doc;
  }

  function renderDraft(d) {
    var draft = el("section", "draft");
    draft.setAttribute("aria-label", d.title);
    var head = el("div", "draft-head");
    head.appendChild(el("span", "draft-title", d.title));
    head.appendChild(el("span", "draft-where", d.where));
    draft.appendChild(head);
    var dl = el("dl", "fields");
    d.fields.forEach(function (f) {
      var row = el("div", "field");
      if (f.src.length) {
        row.setAttribute("data-src", f.src.join(" "));
        row.tabIndex = 0;
      }
      row.appendChild(el("dt", null, f.label));
      var dd = el("dd");
      dd.appendChild(el("span", "bar"));
      var val = el("span", "val", f.value);
      if (f.note) val.appendChild(el("span", "note", f.note));
      dd.appendChild(val);
      row.appendChild(dd);
      dl.appendChild(row);
    });
    draft.appendChild(dl);
    var flag = el("div", "flag");
    if (d.flag.src.length) flag.setAttribute("data-src", d.flag.src.join(" "));
    flag.appendChild(el("strong", null, d.flag.title));
    flag.appendChild(document.createTextNode(d.flag.text));
    draft.appendChild(flag);
    var stamp = el("span", "stamp", "Approved");
    stamp.setAttribute("aria-hidden", "true");
    draft.appendChild(stamp);
    return draft;
  }

  function light(ids, on) {
    ids.forEach(function (id) {
      var s = stage.querySelector('.src[data-id="' + id + '"]');
      if (s) s.classList.toggle("lit", on);
    });
  }

  function wire() {
    stage.querySelectorAll("[data-src]").forEach(function (n) {
      var ids = n.getAttribute("data-src").split(" ");
      var on = function () { light(ids, true); };
      var off = function () { light(ids, false); };
      n.addEventListener("mouseenter", on);
      n.addEventListener("mouseleave", off);
      n.addEventListener("focus", on);
      n.addEventListener("blur", off);
    });
  }

  function waiting() {
    setStatus("waiting", "Waiting for approval from " + current.draft.approver);
    approve.disabled = false;
    approve.textContent = current.draft.action;
    replay.hidden = false;
  }

  function play(animate) {
    clearTimers();
    var d = current.draft;
    var draft = stage.querySelector(".draft");
    var fields = Array.prototype.slice.call(stage.querySelectorAll(".field"));
    var flag = stage.querySelector(".flag");
    draft.classList.remove("approved");
    approve.disabled = true;
    approve.textContent = d.action;
    if (!animate || reduce) { waiting(); return; }

    fields.forEach(function (f) { f.classList.add("pending"); });
    flag.classList.add("pending");
    setStatus("working", "Reading the " + current.sources[0].kind.toLowerCase());
    var t = 500;
    fields.forEach(function (f, i) {
      var ids = (f.getAttribute("data-src") || "").split(" ").filter(Boolean);
      later(function () {
        if (i === 1) setStatus("working", "Checking your records");
        if (i === fields.length - 1) setStatus("working", "Drafting");
        light(ids, true);
      }, t);
      later(function () { f.classList.remove("pending"); }, t + 380);
      later(function () { light(ids, false); }, t + 900);
      t += 620;
    });
    var fids = (flag.getAttribute("data-src") || "").split(" ").filter(Boolean);
    later(function () { light(fids, true); flag.classList.remove("pending"); }, t + 200);
    later(function () { light(fids, false); waiting(); }, t + 1200);
  }

  function show(i, animate) {
    current = DEMOS[i];
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    stage.setAttribute("aria-labelledby", tabs[i].id);
    stage.innerHTML = "";
    var col = el("div", "sources");
    current.sources.forEach(function (s) { col.appendChild(renderSource(s)); });
    stage.appendChild(col);
    stage.appendChild(renderDraft(current.draft));
    wire();
    play(animate);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { show(i, true); });
    t.addEventListener("keydown", function (e) {
      var k = e.key, n = null;
      if (k === "ArrowRight") n = (i + 1) % tabs.length;
      if (k === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (k === "Home") n = 0;
      if (k === "End") n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); tabs[n].focus(); show(n, true); }
    });
  });

  approve.addEventListener("click", function () {
    stage.querySelector(".draft").classList.add("approved");
    approve.disabled = true;
    setStatus("done", current.draft.done);
  });
  replay.addEventListener("click", function () { play(true); });

  // Rebuild the static first scenario so its fields get listeners, then play it
  // once when the desk scrolls into view.
  show(0, false);
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      if (!seen && entries[0].isIntersecting) { seen = true; play(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(root);
  }
})();
