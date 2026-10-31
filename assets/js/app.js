/* AI Security Academy — router, renderer, quiz engine, progress store.
   No dependencies, no build step, works from file:// */
(function () {
  "use strict";

  var STORE_KEY = "asa.progress.v1";
  var MODULES = window.MODULES || [];
  var CONTENT = window.CONTENT || {};

  /* ---------- progress ---------- */
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  var progress = loadProgress();

  function isDone(id) { return !!(progress[id] && progress[id].done); }
  function markDone(id, score) {
    progress[id] = { done: true, score: score, at: new Date().toISOString() };
    saveProgress(progress);
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function inline(s) {
    var out = esc(s);
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return out;
  }

  function flat() {
    var list = [];
    MODULES.forEach(function (mid) {
      var m = CONTENT[mid];
      if (!m) return;
      m.lessons.forEach(function (l) { list.push({ m: m, l: l }); });
    });
    return list;
  }

  function modulePct(m) {
    var done = m.lessons.filter(function (l) { return isDone(l.id); }).length;
    return { done: done, total: m.lessons.length, pct: m.lessons.length ? Math.round((done / m.lessons.length) * 100) : 0 };
  }
  function overallPct() {
    var all = flat();
    var done = all.filter(function (x) { return isDone(x.l.id); }).length;
    return { done: done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  }

  /* ---------- render: blocks ---------- */
  function block(b) {
    switch (b.t) {
      case "h3": return "<h3>" + inline(b.text) + "</h3>";
      case "h4": return "<h4>" + inline(b.text) + "</h4>";
      case "p": return "<p>" + inline(b.text) + "</p>";
      case "lead": return '<p class="lede">' + inline(b.text) + "</p>";
      case "ul": return "<ul>" + b.items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</ul>";
      case "ol": return "<ol>" + b.items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</ol>";
      case "code":
        return "<pre>" + (b.lang ? '<span class="lang">' + esc(b.lang) + "</span>" : "") +
          "<code>" + esc(b.text) + "</code></pre>";
      case "note": {
        var kind = b.kind || "job";
        var tag = b.title || { job: "why this matters at work", warn: "careful", danger: "do not do this", tip: "tip", lab: "lab" }[kind] || "note";
        return '<div class="callout ' + kind + '"><span class="tagline">' + esc(tag) + "</span>" +
          b.text.split("\n\n").map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("") + "</div>";
      }
      case "table": {
        var h = "<thead><tr>" + b.head.map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr></thead>";
        var r = "<tbody>" + b.rows.map(function (row) {
          return "<tr>" + row.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody>";
        return "<table>" + h + r + "</table>";
      }
      case "hr": return "<hr style='border:0;border-top:1px solid var(--border);margin:30px 0'>";
      default: return "";
    }
  }

  /* ---------- render: quiz ---------- */
  function quizHtml(l) {
    if (!l.quiz || !l.quiz.length) return "";
    var html = '<div class="quiz" data-quiz="' + esc(l.id) + '">' +
      '<div class="quiz-head"><span>Check yourself</span><span><b class="qcount">0</b> / ' + l.quiz.length + " answered</span></div>";
    l.quiz.forEach(function (q, qi) {
      html += '<div class="q" data-q="' + qi + '"><div class="q-text">' + (qi + 1) + ". " + inline(q.q) + "</div>";
      q.options.forEach(function (o, oi) {
        html += '<div class="opt" data-oi="' + oi + '" data-answer="' + q.answer + '">' +
          '<span class="key">' + String.fromCharCode(65 + oi) + "</span><span>" + inline(o) + "</span></div>";
      });
      html += '<div class="why">' + inline(q.why || "") + "</div></div>";
    });
    html += '<div class="quiz-foot"><span class="score">—</span>' +
      '<button class="btn ghost reset">Reset quiz</button></div></div>';
    html += '<div class="done-banner"></div>';
    return html;
  }

  function wireQuiz(l) {
    var root = document.querySelector('.quiz[data-quiz="' + l.id + '"]');
    if (!root) return;
    var total = l.quiz.length;
    var answered = {};
    var banner = document.querySelector(".done-banner");
    var countEl = root.querySelector(".qcount");
    var scoreEl = root.querySelector(".score");

    function update() {
      var n = Object.keys(answered).length;
      var right = 0;
      Object.keys(answered).forEach(function (k) { if (answered[k] === true) right++; });
      countEl.textContent = n;
      if (n === total) {
        scoreEl.innerHTML = "Score <b>" + right + " / " + total + "</b> — " +
          (right === total ? "clean sweep." : right + " right. Re-read the missed ones before moving on.");
        markDone(l.id, right + "/" + total);
        if (banner) {
          banner.className = "done-banner show";
          banner.innerHTML = "✓ Lesson marked complete (" + right + "/" + total + "). Progress saved locally.";
        }
        renderSidebarState();
        renderProgressBar();
      } else {
        scoreEl.textContent = (total - n) + " left";
      }
    }

    root.querySelectorAll(".q").forEach(function (qEl, qi) {
      var q = l.quiz[qi];
      qEl.querySelectorAll(".opt").forEach(function (optEl) {
        optEl.addEventListener("click", function () {
          if (qEl.dataset.locked) return;
          qEl.dataset.locked = "1";
          var chosen = Number(optEl.dataset.oi);
          var correct = Number(optEl.dataset.answer);
          qEl.querySelectorAll(".opt").forEach(function (o, oi) {
            o.classList.add("locked");
            if (oi === correct) o.classList.add("correct");
            else if (oi === chosen) o.classList.add("wrong");
          });
          qEl.querySelector(".why").classList.add("show");
          answered[qi] = chosen === correct;
          update();
        });
      });
    });

    root.querySelector(".reset").addEventListener("click", function () {
      answered = {};
      root.querySelectorAll(".q").forEach(function (qEl) {
        delete qEl.dataset.locked;
        qEl.querySelectorAll(".opt").forEach(function (o) { o.className = "opt"; });
        qEl.querySelector(".why").classList.remove("show");
      });
      scoreEl.textContent = "—";
      countEl.textContent = "0";
      if (banner) banner.className = "done-banner";
    });

    update();
  }

  /* ---------- render: sidebar ---------- */
  function renderSidebarState() {
    MODULES.forEach(function (mid) {
      var m = CONTENT[mid];
      if (!m) return;
      var st = modulePct(m);
      var node = document.querySelector('[data-mod="' + mid + '"]');
      if (!node) return;
      var pctEl = node.querySelector(".nav-pct");
      if (pctEl) pctEl.textContent = st.pct + "%";
      m.lessons.forEach(function (l) {
        var a = node.querySelector('[data-lesson="' + l.id + '"] .tick');
        if (a) a.className = "tick" + (isDone(l.id) ? "" : " pending");
      });
    });
  }

  function renderSidebar(activeMid, activeLid) {
    var nav = document.getElementById("nav");
    var html = "";
    MODULES.forEach(function (mid) {
      var m = CONTENT[mid];
      if (!m) return;
      var st = modulePct(m);
      html += '<div class="nav-module' + (mid === activeMid ? " open" : "") + '" data-mod="' + mid + '">' +
        '<button type="button"><span class="nav-num">' + esc(m.num) + "</span>" +
        '<span class="nav-title">' + esc(m.title) + '<div class="nav-pct">' + st.pct + "%</div></span></button>" +
        '<div class="nav-lessons">';
      m.lessons.forEach(function (l) {
        html += '<a href="#/' + mid + "/" + l.id + '" data-lesson="' + escapeAttr(l.id) + '"' +
          (activeLid === l.id ? ' class="active"' : "") + '>' +
          '<span class="tick' + (isDone(l.id) ? "" : " pending") + '">●</span>' +
          "<span>" + esc(l.title) + "</span></a>";
      });
      html += "</div></div>";
    });
    nav.innerHTML = html;
  }

  function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }

  function renderProgressBar() {
    var o = overallPct();
    document.getElementById("pctText").textContent = o.pct + "%";
    document.getElementById("pctCount").textContent = o.done + "/" + o.total + " lessons";
    document.getElementById("pctFill").style.width = o.pct + "%";
  }

  /* ---------- render: pages ---------- */
  function homePage() {
    var o = overallPct();
    var html = '<div class="hero"><h2>AI Security Academy</h2>' +
      '<p class="lede">Starts from zero, in plain words. Short lessons, everyday analogies, and labs you run ' +
      "on your own machine — building towards a job in AI security.</p></div>";

    html += '<div class="meta"><span class="chip accent">' + o.pct + "% complete</span>" +
      '<span class="chip">' + o.done + " / " + o.total + " lessons</span>" +
      '<span class="chip">~14 weeks</span></div>';

    html += '<div class="callout lab"><span class="tagline">start here</span>' +
      "<p>If this is day one, open <b>Module 00</b>, read lesson 1 for the role map, then do the 90-day plan lesson. " +
      "Modules 00–04 are complete; 05–11 land one per week.</p></div>";

    html += '<div class="cards">';
    MODULES.forEach(function (mid) {
      var m = CONTENT[mid];
      if (!m) return;
      var st = modulePct(m);
      html += '<a class="card" href="#/' + mid + '"><span class="n">MODULE ' + esc(m.num) + "</span>" +
        "<h4>" + esc(m.title) + "</h4><p>" + esc(m.blurb) + "</p>" +
        '<div class="st">' + m.lessons.length + " lessons · " + (st.done === st.total && st.total ? "complete ✓" : st.pct + "%") + "</div></a>";
    });
    html += "</div>";
    return html;
  }

  function modulePage(mid) {
    var m = CONTENT[mid];
    if (!m) return notFound();
    var st = modulePct(m);
    var html = '<div class="crumbs">Module ' + esc(m.num) + " · " + esc(m.tag) + "</div>" +
      '<h2 class="title">' + esc(m.title) + "</h2>" +
      '<div class="meta"><span class="chip accent">' + st.done + "/" + st.total + " done</span>" +
      "<span class=\"chip\">~" + esc(m.hours) + "</span></div>" +
      "<p>" + inline(m.blurb) + "</p>";

    if (m.outcomes && m.outcomes.length) {
      html += "<h3>What you can do after this module</h3><ul>" +
        m.outcomes.map(function (x) { return "<li>" + inline(x) + "</li>"; }).join("") + "</ul>";
    }
    if (m.project) {
      html += '<div class="callout lab"><span class="tagline">portfolio output</span><p>' + inline(m.project) + "</p></div>";
    }
    html += "<h3>Lessons</h3><ol>";
    m.lessons.forEach(function (l) {
      html += '<li><a href="#/' + mid + "/" + l.id + '">' + esc(l.title) + "</a> " +
        '<span style="color:var(--text-faint);font-size:12px">· ' + (l.minutes || 10) + " min" +
        (isDone(l.id) ? ' · <span style="color:var(--ok)">done</span>' : "") + "</span></li>";
    });
    html += "</ol>";
    return html;
  }

  function lessonPage(mid, lid) {
    var m = CONTENT[mid];
    if (!m) return notFound();
    var l = null;
    m.lessons.forEach(function (x) { if (x.id === lid) l = x; });
    if (!l) return notFound();

    var html = '<div class="crumbs"><a href="#/' + mid + '">Module ' + esc(m.num) + " · " + esc(m.title) + "</a> <b>/</b> lesson</div>" +
      '<h2 class="title">' + esc(l.title) + "</h2>" +
      '<div class="meta"><span class="chip">' + (l.minutes || 10) + " min read</span>" +
      '<span class="chip ' + (isDone(l.id) ? "" : "warn") + '">' + (isDone(l.id) ? "✓ complete" : "not complete") + "</span>" +
      (l.tag ? '<span class="chip accent">' + esc(l.tag) + "</span>" : "") + "</div>";

    l.body.forEach(function (b) { html += block(b); });
    html += quizHtml(l);

    // pager
    var all = flat();
    var idx = all.findIndex(function (x) { return x.l.id === l.id; });
    var prev = idx > 0 ? all[idx - 1] : null;
    var next = idx < all.length - 1 ? all[idx + 1] : null;
    html += '<div class="pager">';
    html += prev ? '<a href="#/' + prev.m.id + "/" + prev.l.id + '"><span class="dir">← previous</span><span class="lbl">' + esc(prev.l.title) + "</span></a>" : '<span class="spacer"></span>';
    html += next ? '<a class="next" href="#/' + next.m.id + "/" + next.l.id + '"><span class="dir">next →</span><span class="lbl">' + esc(next.l.title) + "</span></a>" : '<span class="spacer"></span>';
    html += "</div>";
    return html;
  }

  function notFound() {
    return '<div class="crumbs">404</div><h2 class="title">That lesson does not exist</h2>' +
      '<p>Check the sidebar, or head back to the <a href="#/">course index</a>.</p>';
  }

  /* ---------- search ---------- */
  function stripBody(l) {
    return l.body.map(function (b) {
      if (b.text) return b.text;
      if (b.items) return b.items.join(" ");
      if (b.rows) return b.rows.map(function (r) { return r.join(" "); }).join(" ");
      return "";
    }).join(" ");
  }

  function wireSearch() {
    var input = document.getElementById("search");
    var nav = document.getElementById("nav");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { restoreNav(); return; }
      var hits = [];
      flat().forEach(function (x) {
        var hay = (x.l.title + " " + x.m.title + " " + stripBody(x.l)).toLowerCase();
        if (hay.indexOf(q) !== -1) {
          var i = hay.indexOf(q);
          hits.push({
            m: x.m, l: x.l,
            snip: stripBody(x.l).substr(Math.max(0, i - 40), 110)
          });
        }
      });
      if (!hits.length) {
        nav.innerHTML = '<div style="padding:18px;color:var(--text-faint);font-size:13px">No matches for "' + esc(input.value) + '".</div>';
        return;
      }
      nav.innerHTML = '<div style="padding:10px 16px 4px;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--text-faint)">' +
        hits.length + " results</div>" +
        hits.map(function (h) {
          return '<a class="card" style="margin:8px 10px;padding:12px" href="#/' + h.m.id + "/" + h.l.id + '">' +
            '<div class="n">' + esc(h.m.num) + " · " + esc(h.m.title) + "</div>" +
            "<h4>" + esc(h.l.title) + "</h4>" +
            '<p>' + esc(h.snip.trim()) + "…</p></a>";
        }).join("");
      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { input.value = ""; setTimeout(restoreNav, 0); });
      });
    });
  }

  function restoreNav() {
    var hash = parseHash();
    renderSidebar(hash.mid, hash.lid);
  }

  /* ---------- router ---------- */
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    if (parts.length === 0) return { mid: null, lid: null };
    return { mid: parts[0], lid: parts[1] || null };
  }

  function route() {
    var r = parseHash();
    var main = document.getElementById("article");
    if (!r.mid) main.innerHTML = homePage();
    else if (!r.lid) main.innerHTML = modulePage(r.mid);
    else main.innerHTML = lessonPage(r.mid, r.lid);

    var m = CONTENT[r.mid];
    if (m && r.lid) {
      var l = m.lessons.filter(function (x) { return x.id === r.lid; })[0];
      if (l) wireQuiz(l);
      document.title = l.title + " · AI Security Academy";
    } else if (m) {
      document.title = m.title + " · AI Security Academy";
    } else {
      document.title = "AI Security Academy";
    }

    if (!document.getElementById("search").value) renderSidebar(r.mid, r.lid);
    else { /* keep results visible while navigating */ }
    renderProgressBar();
    renderSidebarState();
    // close mobile sidebar
    document.querySelector(".sidebar").classList.remove("open");
    window.scrollTo(0, 0);
  }

  /* ---------- boot ---------- */
  function boot() {
    document.getElementById("nav").addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) return; // hash handles it
      var b = e.target.closest(".nav-module > button");
      if (b) b.parentElement.classList.toggle("open");
    });

    wireSearch();
    document.getElementById("menuBtn").addEventListener("click", function () {
      document.querySelector(".sidebar").classList.toggle("open");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("search").focus();
      }
      if (e.key === "Escape") document.querySelector(".sidebar").classList.remove("open");
    });

    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
