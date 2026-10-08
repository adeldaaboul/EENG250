// Interactive practice sheet (Lane B). Answers are checked in the browser; nothing is sent anywhere.
// Progress and Sure/Unsure marks are remembered in this browser only.
(function (E) {
  var n, part, key, sheet, chapter, state = {};
  var ROMAN = ["i", "ii", "iii", "iv", "v", "vi"];

  function storeKey() { return "eeng250-sheet-" + key; }
  function save() { E.store.set(storeKey(), state); }

  function letter(p, i) { return p.roman ? ROMAN[i] : String.fromCharCode(97 + i); }

  function renderPart(q, p, k, s) {
    var name = q.id + "-p" + k;
    var got = (s.parts || [])[k];
    var html = '<div class="tier" data-k="' + k + '"><p class="tier-label">' + p.label + "</p>";
    if (p.note) {
      return html + '<p class="tier-note">' + (p.text || "Work this out on paper, then compare with the explanation.") + "</p></div>";
    }
    if (p.numeric) {
      html += '<label class="num"><span class="sr-only">' + p.label + '</span><input type="text" inputmode="decimal" autocomplete="off" name="' + name + '" value="' +
        (got === undefined ? "" : String(got).replace(/"/g, "&quot;")) + '"><span class="unit">' + p.unit + "</span></label>";
    } else {
      html += '<div class="opts">' + p.options.map(function (o, i) {
        return '<label class="opt"><input type="radio" name="' + name + '" value="' + i + '"' + (got === i ? " checked" : "") + ">" +
          '<span class="opt-letter">' + letter(p, i) + ')</span><span class="opt-text">' + o + "</span></label>";
      }).join("") + "</div>";
    }
    return html + '<p class="part-mark" aria-live="polite"></p></div>';
  }

  function renderQuestion(q) {
    var s = state[q.id] || {};
    var conf = s.conf || "";
    return '<article class="q" id="' + q.id + '">' +
      '<div class="q-head"><span class="q-num">' + q.id + '</span><span class="q-title">' + q.title + "</span>" +
      q.tags.map(function (tg) { return '<span class="q-format">' + tg + "</span>"; }).join("") +
      '<span class="q-status"></span>' +
      '<span class="conf" role="group" aria-label="Confidence">' +
      '<button type="button" data-conf="S"' + (conf === "S" ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">Sure</button>" +
      '<button type="button" data-conf="U"' + (conf === "U" ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">Unsure</button></span></div>" +
      '<div class="q-body"><div class="q-prompt">' + q.prompt + "</div>" +
      (q.table ? '<div class="q-table">' + q.table + "</div>" : "") +
      (q.figure ? '<div class="q-fig">' + q.figure + "</div>" : "") +
      (q.work ? '<ol class="work">' + q.work.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ol>" : "") +
      (q.hint ? '<p class="hint"><strong>Hint:</strong> ' + q.hint + "</p>" : "") +
      q.parts.map(function (p, k) { return renderPart(q, p, k, s); }).join("") +
      '<div class="q-actions"><button type="button" class="btn" data-act="check">Check</button>' +
      '<button type="button" class="btn btn-quiet" data-act="explain"' + (s.checked ? "" : " hidden") + ">Show explanation</button></div>" +
      '<div class="feedback" role="status" aria-live="polite"></div>' +
      '<div class="explain" hidden>' + q.explain + "</div>" +
      "</div></article>";
  }

  function parseNum(text) {
    var t = String(text).trim().replace(/−/g, "-").replace(/\s/g, "").replace(",", ".");
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return NaN;
    return parseFloat(t);
  }

  function near(x, target, p) {
    var tol = Math.max(p.abs || 0, (p.rel === undefined ? 0.01 : p.rel) * Math.abs(target));
    return Math.abs(x - target) <= tol + 1e-12;
  }

  // Reads the inputs; returns false if something is unanswered.
  function read(el, q, s) {
    s.parts = [];
    var complete = true;
    q.parts.forEach(function (p, k) {
      var name = q.id + "-p" + k;
      if (p.note) return;
      if (p.numeric) {
        var v = el.querySelector('input[name="' + name + '"]').value;
        s.parts[k] = v;
        if (isNaN(parseNum(v))) complete = false;
      } else {
        var r = el.querySelector('input[name="' + name + '"]:checked');
        s.parts[k] = r ? parseInt(r.value, 10) : undefined;
        if (!r) complete = false;
      }
    });
    return complete;
  }

  function check(el, q, quiet) {
    var s = state[q.id] = state[q.id] || {};
    var fb = el.querySelector(".feedback");
    el.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("is-right", "is-wrong"); });
    el.querySelectorAll(".part-mark").forEach(function (m) { m.textContent = ""; m.className = "part-mark"; });

    var graded = q.parts.filter(function (p) { return !p.note; }).length;
    if (!read(el, q, s)) {
      if (!quiet) {
        fb.className = "feedback";
        fb.textContent = graded > 1 ? "Answer every part first (numbers like 2.5 or -3)." : "Pick an answer first.";
        save();
      }
      return;
    }

    var results = q.parts.map(function (p, k) {
      if (p.note) return null;
      var tier = el.querySelector('.tier[data-k="' + k + '"]');
      var mark = tier.querySelector(".part-mark");
      var ok, signSlip = false;
      if (p.numeric) {
        var x = parseNum(s.parts[k]);
        ok = near(x, p.answer, p);
        signSlip = !ok && p.answer !== 0 && near(-x, p.answer, p);
      } else {
        ok = s.parts[k] === p.answer;
        var input = tier.querySelector('input[value="' + s.parts[k] + '"]');
        if (input) input.closest(".opt").classList.add(ok ? "is-right" : "is-wrong");
      }
      if (graded > 1 || p.numeric) {
        mark.textContent = ok ? "✓ Right" : signSlip ? "✗ The size is right but the sign is wrong." : "✗ Not yet";
        mark.className = "part-mark " + (ok ? "is-ok" : "is-bad");
      }
      return { ok: ok, reason: /^Reason/.test(p.label) };
    }).filter(Boolean);

    var allOk = results.every(function (r) { return r.ok; });
    var reasonWrong = results.some(function (r) { return r.reason && !r.ok; });
    var answerOk = results.filter(function (r) { return !r.reason; }).every(function (r) { return r.ok; });
    var msg;
    if (!graded) msg = "Compare your working with the explanation.";
    else if (allOk) msg = graded > 1 ? "Correct: every part is right." : "Correct.";
    else if (answerOk && reasonWrong) msg = "Right answer, wrong reason. In the quiz, the reason carries half the marks. Look at the reason again.";
    else msg = "Not yet. Check your signs, directions and units, then try again.";

    s.checked = true;
    s.correct = allOk;
    fb.className = "feedback " + (!graded ? "" : allOk ? "is-ok" : "is-bad");
    fb.textContent = msg;
    el.querySelector('[data-act="explain"]').hidden = false;
    el.querySelector(".q-status").textContent = allOk ? "✓" : "";
    el.classList.toggle("is-done", allOk);
    if (!quiet) { save(); updateScore(); }
  }

  function updateScore() {
    var qs = sheet.questions;
    var done = qs.filter(function (q) { return state[q.id] && state[q.id].correct; }).length;
    var unsure = qs.filter(function (q) { return state[q.id] && state[q.id].conf === "U"; })
      .map(function (q) { return '<a href="#' + q.id + '">' + q.id + "</a>"; });
    document.getElementById("score-text").innerHTML = "<strong>" + done + " of " + qs.length + "</strong> correct" +
      (unsure.length ? '<span class="unsure-list"> &middot; Unsure: ' + unsure.join(" ") + "</span>" : "");
    document.getElementById("score-bar").style.width = (100 * done / qs.length) + "%";
  }

  function coverage() {
    var list = part ? ((chapter.parts || [])[part - 1] || {}).checklist : chapter.checklist;
    return '<ol class="lp-list lp-coverage">' + (list || []).map(function (p, i) {
      var qs = sheet.questions.filter(function (q) { return q.lp.indexOf(i + 1) >= 0; })
        .map(function (q) { return '<a href="#' + q.id + '">' + q.id + "</a>"; }).join(" ");
      return '<li><span class="lp-id">' + (i + 1) + "</span><span>" + p + ' <span class="lp-qs">' + qs + "</span></span></li>";
    }).join("") + "</ol>";
  }

  // Page title for a sheet, e.g. "Chapter 4, Part 1, Node Voltages and Mesh Currents".
  E.sheetLabel = function (n, p) {
    var info = E.chapterInfo(n);
    return "Chapter " + n + (p ? ", Part " + p : "") + ", " + (p ? info.parts[p - 1].replace(/^Part [0-9]+: /, "") : info.title);
  };

  // The whole sheet page. Needs chapters/NN/chapter.js and the sheet file loaded.
  // Answers and Sure/Unsure marks saved in this browser are restored into it.
  E.sheetHTML = function (chNum, p) {
    n = chNum;
    part = p || 0;
    key = part ? n + "-" + part : String(n);
    var info = E.chapterInfo(n);
    chapter = E.chapters[n] || {};
    sheet = E.sheets[key];
    state = (typeof localStorage !== "undefined" && E.store.get(storeKey())) || {};
    var pdf = (info.files || []).filter(function (f) { return f.kind === "Sheet" && f.href && (!part || f.part === part); })[0];
    return '<div class="wrap">' +
      '<p class="crumbs"><a href="' + E.url.chapter(n) + '">Chapter ' + n + ": " + info.title + "</a></p>" +
      '<header class="chapter-head"><p class="eyebrow">Open practice &middot; AI allowed</p>' +
      "<h1>Practice sheet: " + E.sheetLabel(n, part) + "</h1>" +
      '<p class="lead">' + sheet.intro + "</p></header>" +
      '<ul class="rules">' + sheet.rules.map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul>" +
      (pdf ? '<p class="section-note">Prefer paper? <a href="' + E.url.file(pdf.href) + '" target="_blank" rel="noopener">Open the printable PDF</a>.</p>' : "") +
      '<details class="coverage"><summary>Which questions practise which skill</summary>' + coverage() + "</details>" +
      '<div class="questions">' + sheet.questions.map(renderQuestion).join("") + "</div>" +
      "</div>" +
      '<div class="scorebar"><div class="wrap scorebar-inner">' +
      '<span id="score-text"></span><span class="score-track"><span id="score-bar"></span></span>' +
      '<button type="button" class="btn btn-quiet" id="reset">Start over</button></div></div>';
  };

  E.renderSheet = function (chNum, p) {
    var main = document.getElementById("main");
    if (!document.getElementById("site-header").firstElementChild) document.getElementById("site-header").innerHTML = E.headerHTML();
    if (!document.getElementById("site-footer").firstElementChild) document.getElementById("site-footer").innerHTML = E.footerHTML();
    main.innerHTML = E.sheetHTML(chNum, p);
    E.qrPanel();

    sheet.questions.forEach(function (q) {
      var el = document.getElementById(q.id);
      if (state[q.id] && state[q.id].checked) check(el, q, true);
      el.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        var act = btn.getAttribute("data-act");
        var conf = btn.getAttribute("data-conf");
        if (act === "check") check(el, q);
        if (act === "explain") {
          var ex = el.querySelector(".explain");
          ex.hidden = !ex.hidden;
          btn.textContent = ex.hidden ? "Show explanation" : "Hide explanation";
        }
        if (conf) {
          var s = state[q.id] = state[q.id] || {};
          s.conf = s.conf === conf ? "" : conf;
          el.querySelectorAll("[data-conf]").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.getAttribute("data-conf") === s.conf));
          });
          save();
          updateScore();
        }
      });
    });
    document.getElementById("reset").addEventListener("click", function () {
      if (!confirm("Clear all your answers and Sure/Unsure marks on this sheet?")) return;
      state = {};
      save();
      E.renderSheet(chNum, p);
    });
    updateScore();
    E.math(main);
  };
})(window.EENG);
