// Shared page code: header, footer, home page and chapter page.
window.EENG = window.EENG || {};

(function (E) {
  E.chapters = E.chapters || {};
  E.sheets = E.sheets || {};

  var params = new URLSearchParams(location.search);

  E.pad = function (n) { return String(n).padStart(2, "0"); };
  E.param = function (name) { return params.get(name); };

  E.loadScript = function (src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Could not load " + src)); };
      document.head.appendChild(s);
    });
  };

  E.math = function (el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
    }
  };

  E.store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };

  E.chapterInfo = function (n) {
    return E.course.chapters.filter(function (c) { return c.n === n; })[0];
  };

  // Weeks in which a chapter is taught, from the schedule.
  E.chapterWeeks = function (n) {
    return E.course.weeks.filter(function (w) {
      return w.items.some(function (it) { return it.ch === n; });
    }).map(function (w) { return w.w; });
  };

  function weekRange(ws) {
    if (!ws.length) return "";
    return ws.length === 1 ? "Week " + ws[0] : "Weeks " + ws[0] + "&ndash;" + ws[ws.length - 1];
  }

  // Class dates for one schedule row, entered by hand in course.js (breaks and holidays rule out a formula).
  // A chapter item's own sessions win over the week's, for weeks shared by two chapters.
  function weekDates(w, it, sep) {
    var s = it && it.sessions ? it.sessions : w.sessions;
    return s && s.length ? s.join(sep || ", ") : "";
  }

  function renderChrome() {
    var c = E.course;
    var header = document.getElementById("site-header");
    if (header) {
      header.innerHTML =
        '<div class="wrap">' +
        '<a class="brand" href="index.html">' +
        '<span class="brand-code">' + c.code + '</span>' +
        '<span class="brand-title">' + c.title + '</span></a>' +
        '<nav class="site-nav" aria-label="Main">' +
        '<a href="index.html#schedule">Schedule</a>' +
        '<a href="index.html#chapters">Chapters</a>' +
        '<a href="index.html#how">How it works</a>' +
        '<a href="index.html#course">Course info</a>' +
        '</nav></div>';
    }
    var footer = document.getElementById("site-footer");
    if (footer) {
      footer.innerHTML =
        '<div class="wrap"><p>' + c.code + " &middot; " + c.title + "</p>" +
        "<p>Textbook: " + c.textbook + "</p></div>";
    }
  }

  function statusBadge(ch) {
    var open = ch.status === "open";
    return '<span class="badge ' + (open ? "badge-open" : "badge-soon") + '">' + (open ? "Open" : "Coming soon") + "</span>";
  }

  function chapterItem(ch) {
    var open = ch.status === "open";
    var inner =
      '<span class="ch-num">Chapter ' + ch.n + "</span>" +
      '<span class="ch-title">' + ch.title + "</span>" +
      '<span class="ch-meta"><span class="ch-weeks">' + weekRange(E.chapterWeeks(ch.n)) + "</span>" +
      '<span class="tag">' + ch.clo + "</span>" + statusBadge(ch) + "</span>";
    return '<li class="chapter-item' + (open ? "" : " is-soon") + '">' +
      (open ? '<a class="ch-link" href="chapter.html?ch=' + ch.n + '">' + inner + "</a>"
            : '<div class="ch-link">' + inner + "</div>") +
      "</li>";
  }

  // Links for a chapter's materials, used in the schedule. For a chapter in parts, only that part's files.
  function materialLinks(ch, part) {
    if (ch.status !== "open") return '<span class="muted">Coming soon</span>';
    var links = (ch.files || []).filter(function (f) {
      return !part || f.part === part;
    }).map(function (f) {
      var name = f.short || f.kind;
      return f.href ? '<a href="' + f.href + '" target="_blank" rel="noopener">' + name + " (PDF)</a>" : '<span class="muted">' + name + " (soon)</span>";
    });
    if (ch.sheet) links.push('<a href="sheet.html?ch=' + ch.n + (part ? "&amp;part=" + part : "") + '">' + (part ? "Part " + part + " practice sheet" : "Practice sheet") + " (online)</a>");
    return links.join("<br>");
  }

  function scheduleTable() {
    var c = E.course, seen = {}, seenPart = {}, rows = "";
    c.weeks.forEach(function (w) {
      w.items.forEach(function (it, k) {
        var ch = it.ch ? E.chapterInfo(it.ch) : null;
        var key = it.ch || "rev";
        var partKey = key + "-" + (it.part || 0);
        var firstOfPart = !seenPart[partKey];
        seenPart[partKey] = true;
        var first = !seen[key];
        if (first) {
          seen[key] = true;
          rows += ch
            ? '<tr class="band"><td colspan="4">' +
              (ch.status === "open" ? '<a href="chapter.html?ch=' + ch.n + '">' : "<span>") +
              "Chapter " + ch.n + ": " + ch.title + (ch.status === "open" ? "</a>" : "</span>") +
              ' <span class="band-meta">' + weekRange(E.chapterWeeks(ch.n)) + " &middot; " + ch.clo + "</span></td></tr>"
            : '<tr class="band band-revision"><td colspan="4"><span>Revision</span></td></tr>';
        }
        var events = k === 0 && w.events ? w.events.map(function (ev) {
          return '<span class="ev ev-' + ev.type + '">' + ev.text + "</span>";
        }).join("") : "";
        var date = weekDates(w, it, "<br>");
        rows +='<tr class="' + (ch ? "row" : "row row-revision") + '">' +
          '<td class="wk" data-label="Week"><strong>' + w.w + "</strong>" + (date ? '<span class="date">' + date + "</span>" : "") + "</td>" +
          '<td data-label="Topics">' + (ch ? '<span class="row-ch">Ch. ' + ch.n + (it.part ? " &middot; Part " + it.part : "") + "</span> " : "") + it.topics + "</td>" +
          '<td data-label="Materials">' + (ch && firstOfPart ? materialLinks(ch, it.part) : "") + "</td>" +
          '<td data-label="Events">' + events + "</td></tr>";
      });
    });
    if (c.final) {
      rows += '<tr class="band band-exam"><td colspan="4">Final exam (tentative)' +
        ' <span class="band-meta">' + c.final.covers + " &middot; " + (c.final.date || "date to be confirmed") + "</span></td></tr>";
    }
    return '<table class="schedule"><thead><tr><th class="wk">Week</th><th>Topics</th><th>Materials</th><th>Events</th></tr></thead><tbody>' +
      rows + "</tbody></table>";
  }

  // Colour key for the schedule; lists only the event types that appear.
  function legend() {
    var names = { quiz: "Quiz", exam: "Exam" }, used = {};
    E.course.weeks.forEach(function (w) { (w.events || []).forEach(function (ev) { used[ev.type] = true; }); });
    if (E.course.final) used.exam = true;
    return '<div class="legend"><span class="legend-band">Chapter</span>' +
      Object.keys(names).filter(function (k) { return used[k]; }).map(function (k) {
        return '<span class="ev ev-' + k + '">' + names[k] + "</span>";
      }).join("") + "</div>";
  }

  E.renderHome = function () {
    var c = E.course;
    var main = document.getElementById("main");
    main.innerHTML =
      '<div class="wrap">' +
      '<section class="hero">' +
      '<p class="eyebrow">Course website <span class="byline">prepared by ' + c.preparedBy + "</span></p>" +
      "<h1>" + c.code + ' <span class="hero-sep">&middot;</span> ' + c.title + "</h1>" +
      '<p class="lead">Lecture slides, introductions and practice sheets for every chapter.</p>' +
      '<ul class="facts"><li>' + c.credits + " credits</li><li>" + c.hours + " contact hours</li><li>" + c.weeks.length + " teaching weeks</li><li>Textbook: " + c.textbook + "</li></ul>" +
      "</section>" +

      '<section class="section" id="schedule"><h2>Schedule</h2>' +
      '<p class="section-note">Tentative, from the syllabus. Each coloured band is a chapter; the rows under it are the weeks it is taught. Materials appear on the first week of each chapter.</p>' +
      legend() +
      scheduleTable() + "</section>" +

      '<section class="section" id="chapters"><h2>Chapters</h2>' +
      '<ul class="chapter-list">' + c.chapters.map(chapterItem).join("") + "</ul></section>" +

      '<section class="section" id="how"><h2>How this course works</h2>' +
      '<div class="lanes">' +
      '<div class="lane"><p class="eyebrow">Practice &middot; open</p><h3>Practice sheets: any help allowed, AI included</h3>' +
      "<p>Each chapter has a practice sheet you can solve online, with instant feedback, or print. Practice sheets are not marked for correctness. Use your notes, classmates or an AI tool, but check every AI answer: chatbots often get signs and directions wrong.</p></div>" +
      '<div class="lane"><p class="eyebrow">In class &middot; device-free</p><h3>Quizzes and quick oral checks</h3>' +
      "<p>Each chapter has a short quiz in class, without phones or laptops, and any student may be asked to explain a step out loud. " +
      "Every quiz question is a twin of a practice-sheet question: the same idea with new numbers or orientation. If you can do the sheet on your own, you will do well on the quiz.</p></div>" +
      "</div></section>" +

      '<section class="section" id="course"><h2>Course information</h2>' +
      '<p class="about">' + c.description + "</p>" +
      '<div class="info-grid">' +
      '<div class="info-block"><h3>Assessment</h3><div class="table-scroll"><table class="data-table"><thead><tr><th>Evaluation</th><th>Weight</th><th>Chapters</th></tr></thead><tbody>' +
      c.marking.map(function (m) { return "<tr><td>" + m.item + "</td><td>" + m.weight + "</td><td>" + m.covers + "</td></tr>"; }).join("") +
      "</tbody></table></div></div>" +
      '<div class="info-block"><h3>Requisites</h3><p><strong>Prerequisite:</strong> ' + c.prerequisites + "</p><p><strong>Co-requisites:</strong> " + c.corequisites + "</p></div>" +
      "</div>" +
      '<h3 class="clo-head">Course learning outcomes</h3>' +
      '<ol class="clo-list">' + c.clos.map(function (o) {
        return '<li><span class="clo-id">' + o.id + "</span><span>" + o.text + "</span></li>";
      }).join("") + "</ol>" +
      '<p class="section-note">All four map to ' + c.plos + ".</p>" +
      "</section></div>";
    E.math(main);
  };

  E.renderChapter = function () {
    var n = parseInt(E.param("ch"), 10);
    var ch = E.chapterInfo(n);
    var main = document.getElementById("main");
    if (!ch) {
      main.innerHTML = '<div class="wrap"><h1>Chapter not found</h1><p><a href="index.html">Back to the schedule</a></p></div>';
      return;
    }
    document.title = "Chapter " + n + ": " + ch.title + " · " + E.course.code;
    var weeks = E.chapterWeeks(n);
    if (ch.status !== "open") {
      main.innerHTML = '<div class="wrap"><p class="eyebrow">Chapter ' + n + " &middot; " + weekRange(weeks) + "</p><h1>" + ch.title + "</h1>" +
        '<p class="lead">This chapter opens soon.</p><p><a href="index.html#schedule">Back to the schedule</a></p></div>';
      return;
    }
    E.loadScript("chapters/" + E.pad(n) + "/chapter.js").then(function () {
      var d = E.chapters[n] || {};
      var whenRows = E.course.weeks.map(function (w) {
        return w.items.filter(function (it) { return it.ch === n; }).map(function (it) {
          var date = weekDates(w, it);
          return '<li><span class="when-wk">Week ' + w.w + (date ? " &middot; " + date : "") + (it.part ? " &middot; Part " + it.part : "") + "</span><span>" + it.topics + "</span></li>";
        }).join("");
      }).join("");
      var lastPart = 0;
      var files = (ch.files || []).map(function (f) {
        var head = f.part && f.part !== lastPart ? '<li class="material-part">' + ((ch.parts || [])[f.part - 1] || "Part " + f.part) + "</li>" : "";
        lastPart = f.part || 0;
        return head + '<li class="material"><span class="material-kind">' + f.kind + "</span>" +
          '<span class="material-label">' + f.label + "</span>" +
          (f.href ? '<a class="btn" href="' + f.href + '" target="_blank" rel="noopener">Open PDF</a>'
                  : '<span class="badge badge-soon">Coming soon</span>') + "</li>";
      }).join("");
      var checkKey = "eeng250-check-" + n;
      var checked = E.store.get(checkKey) || [];
      var boxNo = 0; // checkbox index across all parts, for saving ticks

      function sheetCard(p, title) {
        return '<a class="sheet-card" href="sheet.html?ch=' + n + (p ? "&amp;part=" + p : "") + '">' +
          '<span class="eyebrow">Open practice &middot; AI allowed</span>' +
          "<strong>Solve the " + (p ? "Part " + p + " " : "") + "practice sheet online</strong>" +
          "<span>" + (p ? title + ". " : "") + "Each question tells you at once whether your answer, and your reason, are right.</span>" +
          '<span class="btn">Start the sheet</span></a>';
      }

      // One block of intro sections and checklist; a chapter in parts has one block per part.
      function block(b, partTitle) {
        var h = partTitle ? "h3" : "h2";
        return (partTitle ? '<section class="section part-head"><h2>' + partTitle + "</h2>" +
            (b.lead ? '<p class="lead">' + b.lead + "</p>" : "") + "</section>" : "") +
          (b.sections || []).map(function (s) {
            return '<section class="section prose"><' + h + ">" + s.title + "</" + h + ">" + s.html + "</section>";
          }).join("") +
          (b.checklist ? '<section class="section"><' + h + ">Checklist: you can do these without help</" + h + ">" +
            '<p class="section-note">Tick each one when you can. Your ticks are saved in this browser only.</p><ul class="checklist">' +
            b.checklist.map(function (c) {
              var i = boxNo++;
              return '<li><label><input type="checkbox" data-i="' + i + '"' + (checked.indexOf(i) >= 0 ? " checked" : "") + "><span>" + c + "</span></label></li>";
            }).join("") + "</ul></section>" : "");
      }

      main.innerHTML =
        '<div class="wrap">' +
        '<p class="crumbs"><a href="index.html#schedule">Schedule</a></p>' +
        '<header class="chapter-head"><p class="eyebrow">Chapter ' + n + " &middot; " + ch.clo + " &middot; " + weekRange(weeks) + "</p>" +
        "<h1>" + ch.title + "</h1>" + (d.lead ? '<p class="lead">' + d.lead + "</p>" : "") + "</header>" +

        '<div class="chapter-top">' +
        '<section class="when"><h2>When</h2><ul class="when-list">' + whenRows + "</ul>" +
        (ch.quiz ? '<p class="when-quiz"><span class="ev ev-quiz">Quiz</span> ' + ch.quiz + "</p>" : "") + "</section>" +
        '<section class="materials-box"><h2>Materials</h2><ul class="materials">' + files + "</ul>" +
        (ch.sheet ? (ch.parts ? ch.parts.map(function (t, i) { return sheetCard(i + 1, t); }).join("") : sheetCard(0)) : "") +
        "</section></div>" +

        (d.parts ? d.parts.map(function (p) { return block(p, p.title); }).join("") : block(d)) +
        "</div>";

      main.querySelectorAll(".checklist input").forEach(function (box) {
        box.addEventListener("change", function () {
          var list = [].map.call(main.querySelectorAll(".checklist input:checked"), function (b) { return +b.getAttribute("data-i"); });
          E.store.set(checkKey, list);
        });
      });
      E.math(main);
    }).catch(function (err) {
      main.innerHTML = '<div class="wrap"><h1>' + ch.title + "</h1><p>" + err.message + "</p></div>";
    });
  };

  document.addEventListener("DOMContentLoaded", renderChrome);
})(window.EENG);
