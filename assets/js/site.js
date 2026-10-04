// Shared page code: header, footer, home page, chapter pages and the Topics page.
// The same functions build each page's HTML in the browser and in tools/build.js, which
// writes it into the published pages so search engines can read them without running scripts.
window.EENG = window.EENG || {};

(function (E) {
  E.chapters = E.chapters || {};
  E.sheets = E.sheets || {};

  // Path from the current page back to the site root, e.g. "../" on a chapter page.
  E.root = window.EENG_ROOT || "";

  E.pad = function (n) { return String(n).padStart(2, "0"); };

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

  // Page addresses, relative to the current page.
  E.url = {
    home: function (hash) { return (E.root || "./") + (hash ? "#" + hash : ""); },
    chapter: function (n) { return E.root + E.chapterInfo(n).slug + "/"; },
    sheet: function (n, part) { return E.url.chapter(n) + (part ? "part-" + part + "/" : "") + "practice/"; },
    topics: function () { return E.root + "topics/"; },
    file: function (href) { return E.root + href; }
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

  E.headerHTML = function () {
    var c = E.course;
    return '<div class="wrap">' +
      '<a class="brand" href="' + E.url.home() + '">' +
      '<span class="brand-code">' + c.code + '</span>' +
      '<span class="brand-title">' + c.title + '</span></a>' +
      '<nav class="site-nav" aria-label="Main">' +
      '<a href="' + E.url.home("schedule") + '">Schedule</a>' +
      '<a href="' + E.url.home("chapters") + '">Chapters</a>' +
      '<a href="' + E.url.topics() + '">Topics</a>' +
      '<a href="' + E.url.home("how") + '">How it works</a>' +
      '<a href="' + E.url.home("course") + '">Course info</a>' +
      '</nav></div>';
  };

  E.footerHTML = function () {
    var c = E.course;
    return '<div class="wrap"><p>' + c.code + " &middot; " + c.title + " &middot; prepared by " + c.preparedBy + "</p>" +
      "<p>Textbook: " + c.textbook + "</p></div>";
  };

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
      (open ? '<a class="ch-link" href="' + E.url.chapter(ch.n) + '">' + inner + "</a>"
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
      return f.href ? '<a href="' + E.url.file(f.href) + '" target="_blank" rel="noopener">' + name + " (PDF)</a>" : '<span class="muted">' + name + " (soon)</span>";
    });
    if (ch.sheet) links.push('<a href="' + E.url.sheet(ch.n, part) + '">' + (part ? "Part " + part + " practice sheet" : "Practice sheet") + " (online)</a>");
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
              (ch.status === "open" ? '<a href="' + E.url.chapter(ch.n) + '">' : "<span>") +
              "Chapter " + ch.n + ": " + ch.title + (ch.status === "open" ? "</a>" : "</span>") +
              ' <span class="band-meta">' + weekRange(E.chapterWeeks(ch.n)) + " &middot; " + ch.clo + "</span></td></tr>"
            : '<tr class="band band-revision"><td colspan="4"><span>Revision</span></td></tr>';
        }
        var events = k === 0 && w.events ? w.events.map(function (ev) {
          return '<span class="ev ev-' + ev.type + '">' + ev.text + "</span>";
        }).join("") : "";
        var date = weekDates(w, it, "<br>");
        rows += '<tr class="' + (ch ? "row" : "row row-revision") + '">' +
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

  E.homeHTML = function () {
    var c = E.course;
    return '<div class="wrap">' +
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
      '<ul class="chapter-list">' + c.chapters.map(chapterItem).join("") + "</ul>" +
      '<p class="section-note">Looking for one subject, such as Thévenin equivalents or op amps? <a href="' + E.url.topics() + '">Browse by topic</a>.</p></section>' +

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
  };

  // The chapter page. Needs the chapter's data file (chapters/NN/chapter.js) loaded.
  E.chapterHTML = function (n) {
    var ch = E.chapterInfo(n);
    var d = E.chapters[n] || {};
    var weeks = E.chapterWeeks(n);
    if (ch.status !== "open") {
      return '<div class="wrap"><p class="eyebrow">Chapter ' + n + " &middot; " + weekRange(weeks) + "</p><h1>" + ch.title + "</h1>" +
        '<p class="lead">This chapter opens soon.</p><p><a href="' + E.url.home("schedule") + '">Back to the schedule</a></p></div>';
    }
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
        (f.href ? '<a class="btn" href="' + E.url.file(f.href) + '" target="_blank" rel="noopener">Open PDF</a>'
                : '<span class="badge badge-soon">Coming soon</span>') + "</li>";
    }).join("");
    var boxNo = 0; // checkbox index across all parts, for saving ticks

    function sheetCard(p, title) {
      return '<a class="sheet-card" href="' + E.url.sheet(n, p) + '">' +
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
            return '<li><label><input type="checkbox" data-i="' + (boxNo++) + '"><span>' + c + "</span></label></li>";
          }).join("") + "</ul></section>" : "");
    }

    return '<div class="wrap">' +
      '<p class="crumbs"><a href="' + E.url.home("schedule") + '">Schedule</a></p>' +
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
  };

  // The Topics page: every subject students search for, with its chapter and practice sheet.
  E.topicsHTML = function () {
    var c = E.course;
    return '<div class="wrap">' +
      '<p class="crumbs"><a href="' + E.url.home("chapters") + '">Chapters</a></p>' +
      '<header class="chapter-head"><p class="eyebrow">Browse by topic</p><h1>Electric circuits topics</h1>' +
      '<p class="lead">Every topic in ' + c.code + " " + c.title + ", with its lecture slides and a free practice sheet that checks your answers as you go.</p></header>" +
      c.chapters.map(function (ch) {
        var list = c.topics.filter(function (t) { return t.ch === ch.n; });
        if (!list.length) return "";
        return '<section class="section topic-group"><h2><a href="' + E.url.chapter(ch.n) + '">Chapter ' + ch.n + ": " + ch.title + "</a></h2>" +
          '<ul class="topic-list">' + list.map(function (t) {
            return '<li><a class="topic-name" href="' + E.url.chapter(ch.n) + '">' + t.name + "</a>" +
              (ch.sheet ? '<a class="topic-practice" href="' + E.url.sheet(ch.n, t.part) + '">Practice problems' + (t.part ? ", Part " + t.part : "") + "</a>" : "") + "</li>";
          }).join("") + "</ul></section>";
      }).join("") + "</div>";
  };

  // In the browser: fill a page part only if the build did not already write it.
  function fill(id, html) {
    var el = document.getElementById(id);
    if (el && !el.firstElementChild) el.innerHTML = html;
    return el;
  }

  function chrome() {
    fill("site-header", E.headerHTML());
    fill("site-footer", E.footerHTML());
  }

  E.renderHome = function () {
    chrome();
    E.math(fill("main", E.homeHTML()));
  };

  E.renderTopics = function () {
    chrome();
    E.math(fill("main", E.topicsHTML()));
  };

  E.renderChapter = function (n) {
    chrome();
    var main = fill("main", E.chapterHTML(n));
    var checkKey = "eeng250-check-" + n;
    var checked = E.store.get(checkKey) || [];
    main.querySelectorAll(".checklist input").forEach(function (box) {
      box.checked = checked.indexOf(+box.getAttribute("data-i")) >= 0;
      box.addEventListener("change", function () {
        var list = [].map.call(main.querySelectorAll(".checklist input:checked"), function (b) { return +b.getAttribute("data-i"); });
        E.store.set(checkKey, list);
      });
    });
    E.math(main);
  };
})(window.EENG);
