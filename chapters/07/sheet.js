// Chapter 7 practice sheet (Lane B: open, AI allowed). Interactive version of "Practice sheet.pdf".
// Question fields:
//   id, title, tags (labels shown), lp (checklist items it practises), prompt, optional figure / table / work / hint
//   parts: every part must be right for the question to count as correct
//     { label, options, answer (index from 0), roman: true for i) ii) … }
//     { label, numeric: true, answer, unit, rel (relative tolerance, default 1%) }
//     { label, note: true, text } for a sub-question with nothing to check; its answer is in explain
//   explain: shown after the student checks
(function (E) {
  var t = String.raw;
  var MINUS = "&#8722;";

  // ---- A small kit for the circuit figures. Lines and text use currentColor. ----
  function r2(x) { return Math.round(x * 100) / 100; }
  function pts(a) { return a.map(function (p) { return r2(p[0]) + "," + r2(p[1]); }).join(" "); }
  function line(x1, y1, x2, y2, extra) {
    return '<line x1="' + r2(x1) + '" y1="' + r2(y1) + '" x2="' + r2(x2) + '" y2="' + r2(y2) + '"' + (extra || "") + "/>";
  }
  function circ(x, y, r, extra) { return '<circle cx="' + r2(x) + '" cy="' + r2(y) + '" r="' + r + '"' + (extra || "") + "/>"; }
  // Italic symbol with an optional italic subscript, e.g. sym("v", "o").
  function sym(base, sub) {
    return '<tspan font-style="italic">' + base + "</tspan>" + (sub ? '<tspan font-size="70%" dy="4" font-style="italic">' + sub + "</tspan>" : "");
  }
  var T0 = sym("t") + " = 0";
  var RAD = Math.PI / 180;

  function kit() {
    var s = "", f = "", tx = "";
    var k = {};
    k.wire = function () { s += '<polyline points="' + pts([].slice.call(arguments)) + '"/>'; return k; };
    k.dot = function (x, y) { f += circ(x, y, 3.5); return k; };
    k.term = function (x, y) { s += circ(x, y, 3, ' stroke-width="2"'); return k; };
    k.text = function (x, y, str, anchor, size) {
      tx += '<text x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + (size ? ' font-size="' + size + '"' : "") + ">" + str + "</text>";
      return k;
    };
    k.sign = function (x, y, c) {
      tx += '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="20" font-weight="700">' + (c === "+" ? "+" : MINUS) + "</text>";
      return k;
    };
    // Filled arrowhead: tip at (x, y), pointing along the unit vector (dx, dy).
    k.head = function (x, y, dx, dy, len) {
      var bx = x - len * dx, by = y - len * dy, px = -dy * len * 0.5, py = dx * len * 0.5;
      f += '<polygon points="' + pts([[x, y], [bx + px, by + py], [bx - px, by - py]]) + '"/>';
      return k;
    };
    // Current reference arrow from (x1, y1) to (x2, y2).
    k.arrow = function (x1, y1, x2, y2) {
      var L = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)), dx = (x2 - x1) / L, dy = (y2 - y1) / L;
      s += line(x1, y1, x2 - 6 * dx, y2 - 6 * dy);
      return k.head(x2, y2, dx, dy, 10);
    };
    // Resistor (zigzag) on a horizontal or vertical wire.
    k.resH = function (x1, x2, y) {
      var a = (x1 + x2) / 2 - 18, p = [[x1, y], [a, y]];
      for (var i = 0; i < 6; i++) p.push([a + 6 * i + 3, y + (i % 2 ? 7 : -7)]);
      p.push([a + 36, y], [x2, y]);
      return k.wire.apply(null, p);
    };
    k.resV = function (x, y1, y2) {
      var a = (y1 + y2) / 2 - 18, p = [[x, y1], [x, a]];
      for (var i = 0; i < 6; i++) p.push([x + (i % 2 ? -7 : 7), a + 6 * i + 3]);
      p.push([x, a + 36], [x, y2]);
      return k.wire.apply(null, p);
    };
    // Inductor (four turns) on a vertical wire.
    k.ind = function (x, y1, y2) {
      var a = (y1 + y2) / 2 - 22, d = "M" + x + " " + y1 + "V" + a;
      for (var i = 0; i < 4; i++) d += "a5.5 5.5 0 0 1 0 11";
      s += '<path d="' + d + "V" + y2 + '"/>';
      return k;
    };
    // Capacitor on a vertical wire.
    k.cap = function (x, y1, y2) {
      var m = (y1 + y2) / 2;
      s += line(x, y1, x, m - 5) + line(x, m + 5, x, y2) +
        '<path stroke-width="3" d="M' + (x - 14) + " " + (m - 5) + "h28M" + (x - 14) + " " + (m + 5) + 'h28"/>';
      return k;
    };
    // Independent voltage source on a vertical wire; top = "+" or "−" (the sign nearer the top).
    k.vsrc = function (x, y1, y2, top) {
      var m = (y1 + y2) / 2, up = top === "+" ? m - 7 : m + 7, dn = top === "+" ? m + 7 : m - 7;
      s += line(x, y1, x, m - 17) + line(x, m + 17, x, y2) + circ(x, m, 17) +
        '<path stroke-width="2" d="M' + (x - 4.5) + " " + up + "h9M" + x + " " + (up - 4.5) + "v9M" + (x - 4.5) + " " + dn + 'h9"/>';
      return k;
    };
    // Independent current source on a vertical wire; dir = "up" or "down".
    k.isrc = function (x, y1, y2, dir) {
      var m = (y1 + y2) / 2, u = dir === "up" ? -1 : 1;
      s += line(x, y1, x, m - 17) + line(x, m + 17, x, y2) + circ(x, m, 17) + line(x, m - 9 * u, x, m + 3 * u, ' stroke-width="2"');
      return k.head(x, m + 10 * u, 0, u, 8);
    };
    // Dependent voltage source on a horizontal wire, + on the left and − on the right.
    k.dvs = function (x1, x2, y) {
      var m = (x1 + x2) / 2, h = 18;
      s += line(x1, y, m - h, y) + line(m + h, y, x2, y) + '<polygon points="' + pts([[m - h, y], [m, y - h], [m + h, y], [m, y + h]]) + '"/>' +
        '<path stroke-width="2" d="M' + (m - 11) + " " + y + "h8M" + (m - 7) + " " + (y - 4) + "v8M" + (m + 3) + " " + y + 'h8"/>';
      return k;
    };
    // Dependent current source on a vertical wire; dir = "up" or "down".
    k.dis = function (x, y1, y2, dir) {
      var m = (y1 + y2) / 2, h = 18, u = dir === "up" ? -1 : 1;
      s += line(x, y1, x, m - h) + line(x, m + h, x, y2) + '<polygon points="' + pts([[x, m - h], [x + h, m], [x, m + h], [x - h, m]]) + '"/>' +
        line(x, m - 9 * u, x, m + 2 * u, ' stroke-width="2"');
      return k.head(x, m + 9 * u, 0, u, 7);
    };
    // Curved arrow on a circle about (cx, cy), from angle a1 to a2 (degrees, counterclockwise positive).
    function swing(cx, cy, r, a1, a2) {
      var P = function (a) { return [cx + r * Math.cos(a * RAD), cy - r * Math.sin(a * RAD)]; };
      var p1 = P(a1), p2 = P(a2), ccw = a2 > a1;
      s += '<path stroke-width="2" d="M' + r2(p1[0]) + " " + r2(p1[1]) + "A" + r + " " + r + " 0 0 " + (ccw ? 0 : 1) + " " + r2(p2[0]) + " " + r2(p2[1]) + '"/>';
      var dx = ccw ? -Math.sin(a2 * RAD) : Math.sin(a2 * RAD), dy = ccw ? -Math.cos(a2 * RAD) : Math.cos(a2 * RAD);
      k.head(p2[0] + 3 * dx, p2[1] + 3 * dy, dx, dy, 8);
    }
    // Single-throw switch on a horizontal wire from x1 to x2. action "open" (opens at t = 0) or "close" (closes at t = 0).
    // Drawn as in the PDF: the blade pivots on the left terminal; the curved arrow shows which way it moves.
    k.sw = function (x1, x2, y, action) {
      var c = (x1 + x2) / 2, px = c - 12;
      k.wire([x1, y], [c - 15, y]).wire([c + 15, y], [x2, y]).term(c - 12, y).term(c + 12, y);
      s += line(px + 2.6, y - 1.5, px + 26, y - 15);
      if (action === "open") swing(px, y, 22, 8, 52); else swing(px, y, 22, 52, 8);
      return k;
    };
    // Double-throw switch: throws at (px − 20, yT) and (px + 20, yT), pole at (px, yT + 28).
    // from = "left" or "right": the throw the blade touches before t = 0. The curved arrow points to the other throw.
    k.spdt = function (px, yT, from, labL, labR) {
      var py = yT + 28, sx = from === "left" ? -20 : 20, L = Math.sqrt(20 * 20 + 28 * 28), q = (L - 3) / L;
      k.term(px - 20, yT).term(px + 20, yT).dot(px, py);
      s += line(px, py, px + sx * q, py - 28 * q);
      if (from === "left") swing(px, py, 25, 116, 66); else swing(px, py, 25, 64, 114);
      return k.text(px - 20, yT - 10, labL, "middle", 16).text(px + 20, yT - 10, labR, "middle", 16);
    };
    // The drawing spans x = 0 … w; a 20-unit margin on the left keeps the source labels in view.
    k.svg = function (w, h, label) {
      return '<svg class="fig" viewBox="-20 0 ' + (w + 20) + " " + h + '" width="' + (w + 20) + '" role="img" aria-label="' + label + '">' +
        '<g stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">' + s + "</g>" +
        '<g fill="currentColor">' + f + "</g>" +
        '<g fill="currentColor" font-size="17">' + tx + "</g></svg>";
    };
    return k;
  }

  // ---- Figures (rails at y = 50 and y = 170) ----
  var figS2 = kit()
    .vsrc(50, 50, 170, "+").text(26, 116, "24 V", "end")
    .resH(50, 140, 50).text(95, 34, "4 Ω", "middle")
    .sw(140, 200, 50, "open").text(166, 20, T0, "middle")
    .wire([200, 50], [230, 50]).dot(230, 50)
    .ind(230, 50, 170).text(216, 116, "0.3 H", "end")
    .arrow(244, 60, 244, 82).text(252, 78, sym("i", "L"))
    .resH(230, 330, 50).text(280, 34, "2 Ω", "middle")
    .dot(330, 50).resV(330, 50, 170).text(344, 116, "12 Ω")
    .sign(314, 82, "+").text(310, 120, sym("v", "o"), "end").sign(314, 160, "−")
    .wire([330, 50], [420, 50]).resV(420, 50, 170).text(434, 116, "6 Ω")
    .wire([50, 170], [420, 170]).dot(230, 170).dot(330, 170)
    .svg(470, 185, "Circuit for S2. Left: 24 V source, + at the top. Top wire: 4 Ω resistor, then a switch that is closed and opens at t = 0, then a node. From that node a 0.3 H inductor goes down to the bottom wire, with current i_L referenced downward. The top wire continues through 2 Ω to a 12 Ω resistor and a 6 Ω resistor, both from the top wire to the bottom wire. v_o is across the 12 Ω, + at the top, − at the bottom.");

  var figS3 = kit()
    .vsrc(50, 50, 170, "+").text(26, 116, "60 V", "end")
    .resH(50, 170, 50).text(110, 34, "10 kΩ", "middle").wire([170, 50], [187, 50])
    .spdt(210, 50, "left", "x", "y").text(210, 18, T0, "middle")
    .cap(210, 78, 170).text(188, 130, "2 µF", "end")
    .sign(224, 94, "+").text(232, 130, sym("v", "C")).sign(224, 162, "−")
    .resH(233, 340, 50).text(286, 34, "20 kΩ", "middle")
    .dot(340, 50).resV(340, 50, 170).text(354, 116, "30 kΩ")
    .sign(322, 82, "+").text(318, 120, sym("v", "o"), "end").sign(322, 160, "−")
    .wire([340, 50], [450, 50]).resV(450, 50, 170).text(464, 116, "60 kΩ")
    .arrow(436, 60, 436, 82).text(428, 78, sym("i", "o"), "end")
    .wire([50, 170], [450, 170]).dot(210, 170).dot(340, 170)
    .svg(520, 185, "Circuit for S3. Left: 60 V source, + at the top, in series with 10 kΩ to switch position x. The switch pole is the top of a 2 µF capacitor; before t = 0 it is at x, and at t = 0 it moves to position y. v_C is across the capacitor, + at the top. Position y connects through 20 kΩ to a 30 kΩ resistor and a 60 kΩ resistor in parallel to the bottom wire. v_o is across the 30 kΩ, + at the top. Current i_o is referenced downward through the 60 kΩ.");

  var figS5 = kit()
    .vsrc(50, 50, 170, "+").text(26, 116, "30 V", "end")
    .resH(50, 140, 50).text(95, 34, "3 Ω", "middle").wire([140, 50], [167, 50])
    .spdt(190, 50, "right", "b", "a").text(190, 18, T0, "middle")
    .ind(190, 78, 170)
    .sign(176, 96, "+").text(172, 130, sym("v"), "end").sign(176, 162, "−")
    .arrow(204, 84, 204, 106).text(212, 102, sym("i")).text(206, 154, "150 mH")
    .wire([213, 50], [330, 50]).dot(330, 50).resV(330, 50, 170).text(344, 116, "5 Ω")
    .wire([330, 50], [420, 50]).isrc(420, 50, 170, "down").text(446, 116, "6 A")
    .wire([50, 170], [420, 170]).dot(190, 170).dot(330, 170)
    .svg(485, 185, "Circuit for S5. Left: 30 V source, + at the top, in series with 3 Ω to switch position b. The switch pole is the top of a 150 mH inductor; before t = 0 it is at position a, and at t = 0 it moves to b. v is across the inductor, + at the top, and current i is referenced downward through it. Position a connects to a 5 Ω resistor and a 6 A current source in parallel to the bottom wire; the source arrow points down.");

  var figS6 = kit()
    .vsrc(60, 50, 170, "+").text(36, 116, "36 V", "end")
    .resH(60, 170, 50).text(115, 34, "12 kΩ", "middle")
    .dot(170, 50).resV(170, 50, 170).text(156, 116, "24 kΩ", "end")
    .wire([170, 50], [237, 50])
    .spdt(260, 50, "left", "1", "2").text(260, 18, T0, "middle")
    .cap(260, 78, 170).text(238, 142, "0.25 µF", "end")
    .arrow(246, 84, 246, 106).text(238, 102, sym("i", "o"), "end")
    .sign(274, 94, "+").text(282, 130, sym("v", "o")).sign(274, 162, "−")
    .wire([283, 50], [300, 50]).resH(300, 390, 50).text(345, 34, "20 kΩ", "middle")
    .dot(390, 50).resV(390, 50, 170).text(404, 116, "60 kΩ")
    .resH(390, 500, 50).text(445, 34, "30 kΩ", "middle")
    .vsrc(500, 50, 170, "−").text(526, 116, "45 V")
    .wire([60, 170], [500, 170]).dot(170, 170).dot(260, 170).dot(390, 170)
    .svg(570, 185, "Circuit for S6. Left: 36 V source, + at the top, then 12 kΩ in series to a node with 24 kΩ down to the bottom wire; that node connects to switch position 1. The switch pole is the top of a 0.25 µF capacitor; before t = 0 it is at 1, and at t = 0 it moves to 2. v_o is across the capacitor, + at the top, and current i_o is referenced downward into its + terminal. Position 2 connects through 20 kΩ to a node with 60 kΩ down to the bottom wire, then through 30 kΩ to a 45 V source whose − terminal is at the top and + terminal at the bottom.");

  var figS7 = kit()
    .isrc(90, 50, 170, "up").text(64, 116, "200 mA", "end")
    .wire([90, 50], [180, 50]).dot(180, 50).resV(180, 50, 170).text(166, 116, "16 Ω", "end")
    .sw(180, 300, 50, "open").text(242, 20, T0, "middle")
    .dot(300, 50).resV(300, 50, 170).text(314, 116, "80 Ω")
    .sign(282, 84, "+").text(276, 120, sym("v", "o"), "end").sign(282, 158, "−")
    .resH(300, 420, 50).text(360, 34, "20 Ω", "middle")
    .ind(420, 50, 170).text(436, 116, "0.2 H")
    .arrow(406, 60, 406, 82).text(398, 78, sym("i", "o"), "end")
    .wire([90, 170], [420, 170]).dot(180, 170).dot(300, 170)
    .svg(485, 185, "Circuit for S7. Left: 200 mA current source, arrow pointing up, with 16 Ω in parallel. The top wire continues through a switch that is closed and opens at t = 0 to a node with an 80 Ω resistor down to the bottom wire; v_o is across the 80 Ω, + at the top. From that node, 20 Ω in series leads to a 0.2 H inductor down to the bottom wire, with current i_o referenced downward through the inductor.");

  var figS8 = kit()
    .vsrc(60, 50, 170, "+").text(36, 116, "60 V", "end")
    .resH(60, 177, 50).text(118, 34, "250 kΩ", "middle")
    .spdt(200, 50, "right", "b", "a").text(200, 18, T0, "middle")
    .cap(200, 78, 170).text(178, 136, "0.8 µF", "end")
    .sign(214, 94, "+").text(222, 130, sym("v", "C")).sign(214, 162, "−")
    .wire([223, 50], [300, 50]).dot(300, 50).resV(300, 50, 170).text(314, 116, "40 Ω")
    .resH(300, 420, 50).text(360, 34, "10 Ω", "middle")
    .vsrc(420, 50, 170, "−").text(446, 116, "50 V")
    .wire([60, 170], [420, 170]).dot(200, 170).dot(300, 170)
    .svg(490, 185, "Circuit for S8. Left: 60 V source, + at the top, in series with 250 kΩ to switch position b. The switch pole is the top of a 0.8 µF capacitor; before t = 0 it is at position a, and at t = 0 it moves to b. v_C is across the capacitor, + at the top. Position a connects to a node with a 40 Ω resistor down to the bottom wire, then through 10 Ω to a 50 V source whose − terminal is at the top and + terminal at the bottom.");

  var figS9 = kit()
    .isrc(60, 50, 170, "up").text(36, 116, "4 A", "end")
    .wire([60, 50], [140, 50]).dot(140, 50).resV(140, 50, 170).text(126, 116, "10 Ω", "end")
    .sw(140, 260, 50, "open").text(202, 20, T0, "middle")
    .dot(260, 50).ind(260, 50, 170).text(246, 116, "0.5 H", "end")
    .arrow(274, 60, 274, 82).text(282, 78, sym("i", "L"))
    .dvs(260, 400, 50).text(330, 24, "20 " + sym("i", "x"), "middle")
    .dot(400, 50).resV(400, 50, 170).text(386, 116, "20 Ω", "end")
    .arrow(414, 60, 414, 82).text(422, 78, sym("i", "x"))
    .wire([400, 50], [480, 50]).resV(480, 50, 170).text(494, 116, "20 Ω")
    .wire([60, 170], [480, 170]).dot(140, 170).dot(260, 170).dot(400, 170)
    .svg(540, 185, "Circuit for S9. Left: 4 A current source, arrow pointing up, with 10 Ω in parallel. The top wire continues through a switch that is closed and opens at t = 0 to a node with a 0.5 H inductor down to the bottom wire; current i_L is referenced downward through the inductor. From that node, a dependent voltage source of value 20 i_x, + on the left (inductor side) and − on the right, leads to a node with a 20 Ω resistor down to the bottom wire, carrying current i_x referenced downward, and a second 20 Ω resistor in parallel with it.");

  var figS10 = kit()
    .cap(80, 50, 170).text(58, 116, "2 µF", "end")
    .sign(98, 84, "+").text(102, 120, sym("v")).sign(98, 156, "−")
    .sw(80, 190, 50, "close").text(137, 20, T0, "middle")
    .arrow(196, 36, 222, 36).text(208, 24, sym("i"), "middle")
    .resH(190, 300, 50).text(245, 80, "15 kΩ", "middle")
    .dot(300, 50).resV(300, 50, 170).text(286, 116, "20 kΩ", "end")
    .sign(318, 84, "+").text(322, 120, sym("v", "x")).sign(318, 156, "−")
    .wire([300, 50], [410, 50]).dis(410, 50, 170, "down").text(436, 116, "0.15 mS × " + sym("v", "x"))
    .wire([80, 170], [410, 170]).dot(300, 170)
    .svg(560, 185, "Circuit for S10. Left: 2 µF capacitor with voltage v, + at the top. The top wire runs through a switch that is open and closes at t = 0, then a 15 kΩ resistor, with current i referenced to the right, away from the capacitor. It reaches a node with a 20 kΩ resistor down to the bottom wire; v_x is across the 20 kΩ, + at the top. A dependent current source of value 0.15 mS × v_x is in parallel with the 20 kΩ, its arrow pointing down.");

  var lines5 = ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"];

  E.sheets[7] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. The device-free quiz, at the start of the last class (week 13, session 2, Thu 14 Jan), is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Get both right; on the quiz each earns half the marks.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Conventions:</strong> “a long time” means the circuit has reached dc steady state: an inductor is a short circuit and a capacitor an open circuit. Every response here has the form $x(t) = x_f + (x_0 - x_f)e^{-t/\tau}$, with $\tau = L/R$ or $\tau = RC$, where $R$ is the resistance the inductor or capacitor sees after switching. Check every answer: $x(0)$ must equal the initial value, $x(\infty)$ the final value, and $\tau$ must be positive.`,
      t`<strong>Entering numbers:</strong> type each value in the unit shown next to its box (for example, 50 for 50 ms), with a minus sign where needed.`
    ],

    questions: [
      {
        id: "S1", title: "What cannot jump?", tags: ["Two-tier"], lp: [5],
        prompt: t`A switch moves at $t = 0$ in a circuit with a resistor and an inductor. Which of these must always have the same value just after the switch moves ($t = 0^+$) as just before ($t = 0^-$), in any circuit of this kind?`,
        parts: [
          { label: "Answer", options: ["The inductor’s voltage", "The inductor’s current", "The resistor’s current", "The resistor’s voltage"], answer: 1 },
          { label: "Reason", roman: true, options: [
            "An inductor’s current cannot change instantly: a jump would need an infinite voltage.",
            "An inductor’s voltage cannot change instantly, because its current is continuous.",
            "A resistor’s current cannot jump, because Ohm’s law fixes it.",
            "A resistor’s voltage cannot jump, because the resistance does not change."
          ], answer: 0 },
          { label: "Follow-up: name the quantity that cannot jump in a circuit with a capacitor.", options: ["The capacitor’s current", "The capacitor’s voltage", "The resistor’s current", "The resistor’s voltage"], answer: 1 }
        ],
        explain: t`An inductor’s voltage is $v = L\,di/dt$, so a jump in its current would need an infinite voltage: $i_L(0^+) = i_L(0^-)$. The other three can jump when the switch moves. Reason (ii) gives (a), (iii) gives (c) and (iv) gives (d). Follow-up: in a circuit with a capacitor, the capacitor’s voltage cannot jump, since $i = C\,dv/dt$ would then be infinite.`
      },
      {
        id: "S2", title: "RL natural response", tags: [], lp: [1, 3, 4, 5],
        prompt: t`As in Nilsson Example 7.1. The switch has been closed for a long time and opens at $t = 0$.`,
        figure: figS2,
        parts: [
          { label: t`a) Find $i_L(0)$.`, numeric: true, answer: 6, unit: "A" },
          { label: t`b) Find the time constant $\tau$.`, numeric: true, answer: 50, unit: "ms" },
          { label: t`c) Find $i_L(t)$ for $t \ge 0$ and $v_o(t)$ for $t \ge 0^+$. Each has the form $Ke^{-at}$. Enter $a$:`, numeric: true, answer: 20, unit: "1/s" },
          { label: t`c) … and $K$ for $v_o(t)$:`, numeric: true, answer: -24, unit: "V" },
          { label: t`d) Find $v_o(0^-)$.`, numeric: true, answer: 0, unit: "V" },
          { label: t`d) Find $v_o(0^+)$.`, numeric: true, answer: -24, unit: "V" },
          { label: t`d) Why can $v_o$ jump when $i_L$ cannot?`, note: true, text: "Answer in a sentence, then compare with the explanation." },
          { label: "e) What percentage of the initial stored energy is dissipated in the 12 Ω resistor?", numeric: true, answer: 22.2, unit: "%" }
        ],
        explain: t`a) Long closed, the inductor is a short circuit and shorts the resistors to its right: $i_L(0) = 24/4 = 6$ A. b) After the switch opens, the inductor sees $R = 2 + 12 \parallel 6 = 6$ Ω, so $\tau = 0.3/6 = 50$ ms. c) $i_L = 6e^{-20t}$ A. The 12 Ω carries a third of it, upward, so $v_o = -24e^{-20t}$ V. d) $v_o(0^-) = 0$ V, because the inductor shorts it, and $v_o(0^+) = -24$ V. $v_o$ is a resistor voltage, so it can jump; only the inductor current must be continuous. e) 22.2%: per unit of $i_L^2$, the whole 6 Ω dissipates 6 parts, and the 12 Ω, which carries a third of $i_L$, dissipates $(1/9)(12) = 1.33$ of them.`
      },
      {
        id: "S3", title: "RC natural response", tags: [], lp: [1, 3, 4],
        prompt: t`As in Nilsson Example 7.3. The switch has been in position x for a long time and moves to position y at $t = 0$.`,
        figure: figS3,
        parts: [
          { label: t`a) Find $v_C(0)$.`, numeric: true, answer: 60, unit: "V" },
          { label: t`b) Find $\tau$.`, numeric: true, answer: 80, unit: "ms" },
          { label: t`c) Find $v_C(t)$ for $t \ge 0$, and $v_o(t)$ and the current $i_o$ down through the 60 kΩ for $t \ge 0^+$. Each has the form $Ke^{-at}$. Enter $a$:`, numeric: true, answer: 12.5, unit: "1/s" },
          { label: t`c) … $K$ for $v_o(t)$:`, numeric: true, answer: 30, unit: "V" },
          { label: t`c) … $K$ for $i_o(t)$:`, numeric: true, answer: 0.5, unit: "mA" },
          { label: "d) How much energy is dissipated in the 60 kΩ resistor?", numeric: true, answer: 0.6, unit: "mJ" }
        ],
        explain: t`a) Long at x, the capacitor is an open circuit, so no current flows in the 10 kΩ and $v_C(0) = 60$ V. b) At y, the capacitor sees $R = 20 + 30 \parallel 60 = 40$ kΩ, so $\tau = (40\text{ k}\Omega)(2\ \mu\text{F}) = 80$ ms. c) $v_C = 60e^{-12.5t}$ V. The 30 kΩ ∥ 60 kΩ pair is 20 kΩ, half of the 40 kΩ, so $v_o = 30e^{-12.5t}$ V and $i_o = v_o/60\text{ k}\Omega = 0.5e^{-12.5t}$ mA. d) $w = \int_0^\infty (60\text{ k}\Omega)\,i_o^2\,dt = (60\text{ k}\Omega)(0.5\text{ mA})^2(\tau/2) = 0.6$ mJ, of the $\tfrac12(2\ \mu\text{F})(60)^2 = 3.6$ mJ stored.`
      },
      {
        id: "S4", title: "One time constant later", tags: ["Two-tier"], lp: [4],
        prompt: t`In a natural response, what fraction of the initial value remains after one time constant?`,
        parts: [
          { label: "Answer", options: ["63%", "0", "37%", "50%"], answer: 2 },
          { label: "Reason", roman: true, options: [
            "The time constant is the time the response takes to reach its final value.",
            t`After one time constant, $x = x_0 e^{-1} = 0.37x_0$.`,
            "Half of what remains decays in each time constant.",
            t`After one time constant, $1 - e^{-1} = 63\%$ of $x_0$ remains.`
          ], answer: 1 },
          { label: "Follow-up: after how many time constants is less than 1% left?", numeric: true, answer: 5, unit: "time constants" }
        ],
        explain: t`After one time constant, $x = x_0e^{-1} = 0.37x_0$: 37% remains. Reason (i) gives (b), (iii) gives (d) and (iv) gives (a); (iv) confuses what remains (37%) with the part of the change already done (63%). Follow-up: five, since $e^{-5} = 0.7\%$.`
      },
      {
        id: "S5", title: "RL step response", tags: [], lp: [1, 2, 3, 4, 5],
        prompt: t`As in Nilsson Example 7.5. The switch has been in position a for a long time. At $t = 0$ it moves to position b; it makes contact at b before it breaks contact at a, so the inductor current is never interrupted.`,
        figure: figS5,
        parts: [
          { label: t`a) Find $i(0)$.`, numeric: true, answer: -6, unit: "A" },
          { label: t`a) Find $i(\infty)$.`, numeric: true, answer: 10, unit: "A" },
          { label: t`a) Find $\tau$.`, numeric: true, answer: 50, unit: "ms" },
          { label: t`b) Find $i(t)$ for $t \ge 0$. In the form $i(\infty) + Be^{-t/\tau}$, enter $B$:`, numeric: true, answer: -16, unit: "A" },
          { label: t`c) Find $v(t)$ for $t \ge 0^+$. In the form $Ve^{-t/\tau}$, enter $V$:`, numeric: true, answer: 48, unit: "V" },
          { label: t`c) Why is $v(0^+)$ larger than the 30 V of the source?`, note: true, text: "Answer in a sentence, then compare with the explanation." },
          { label: t`d) When does $v$ equal 30 V?`, numeric: true, answer: 23.5, unit: "ms" }
        ],
        explain: t`a) Long at a, the inductor shorts the 5 Ω, and the 6 A source drives its current up through the inductor: $i(0) = -6$ A. At b, $i(\infty) = 30/3 = 10$ A and $\tau = 0.15/3 = 50$ ms. b) $i = 10 + (-6 - 10)e^{-20t} = 10 - 16e^{-20t}$ A. c) $v = 0.15\,di/dt = 48e^{-20t}$ V. At $0^+$ the current is still −6 A, so the 3 Ω’s 18 V adds to the source: $30 + 18 = 48$ V. d) $48e^{-20t} = 30$ gives $t = (1/20)\ln(48/30) = 23.5$ ms.`
      },
      {
        id: "S6", title: "RC step response with a Thévenin equivalent", tags: [], lp: [1, 2, 3, 4],
        prompt: t`As in Nilsson Example 7.6. The switch has been in position 1 for a long time and moves to position 2 at $t = 0$.`,
        figure: figS6,
        parts: [
          { label: t`a) Find $v_o(0)$.`, numeric: true, answer: 24, unit: "V" },
          { label: t`b) For $t \ge 0$, find the Thévenin equivalent that the capacitor sees. $V_{\text{Th}}$, with the same polarity as $v_o$:`, numeric: true, answer: -30, unit: "V" },
          { label: t`b) … $R_{\text{Th}}$:`, numeric: true, answer: 40, unit: "kΩ" },
          { label: t`c) Find $v_o(t)$ for $t \ge 0$. First $\tau$:`, numeric: true, answer: 10, unit: "ms" },
          { label: t`c) … then $B$ in $v_o(t) = v_o(\infty) + Be^{-t/\tau}$:`, numeric: true, answer: 54, unit: "V" },
          { label: t`d) Find the capacitor current $i_o$, referenced into its + terminal, for $t \ge 0^+$. In the form $Ie^{-t/\tau}$, enter $I$:`, numeric: true, answer: -1.35, unit: "mA" }
        ],
        explain: t`a) Long at 1, the capacitor is an open circuit across the 24 kΩ: $v_o(0) = 36 \times 24/36 = 24$ V. b) At 2, the 45 V source has its + terminal at the bottom, so $V_{\text{Th}} = -45 \times 60/90 = -30$ V, and $R_{\text{Th}} = 20 + 60 \parallel 30 = 40$ kΩ. c) $\tau = (40\text{ k}\Omega)(0.25\ \mu\text{F}) = 10$ ms, so $v_o = -30 + (24 + 30)e^{-100t} = -30 + 54e^{-100t}$ V. d) $i_o = C\,dv_o/dt = (0.25\ \mu\text{F})(-5400e^{-100t}) = -1.35e^{-100t}$ mA.`
      },
      {
        id: "S7", title: "The general method, RL", tags: [], lp: [1, 3, 4, 5],
        prompt: t`As in Nilsson Example 7.7. The switch has been closed for a long time and opens at $t = 0$.`,
        figure: figS7,
        parts: [
          { label: t`a) Find $i_o(0)$.`, numeric: true, answer: 80, unit: "mA" },
          { label: t`b) Find $\tau$.`, numeric: true, answer: 2, unit: "ms" },
          { label: t`c) Find $i_o(t)$ for $t \ge 0$. In the form $Ke^{-at}$, enter $a$:`, numeric: true, answer: 500, unit: "1/s" },
          { label: t`d) Find $v_o(0^-)$.`, numeric: true, answer: 1.6, unit: "V" },
          { label: t`d) Find $v_o(0^+)$ and $v_o(t)$ for $t \ge 0^+$. Enter $v_o(0^+)$:`, numeric: true, answer: -6.4, unit: "V" }
        ],
        explain: t`a) With the inductor shorted, the 16 Ω, 80 Ω and 20 Ω are in parallel (8 Ω): $v = (0.2)(8) = 1.6$ V and $i_o = 1.6/20 = 80$ mA. b) After opening, the inductor sees $20 + 80 = 100$ Ω: $\tau = 0.2/100 = 2$ ms. c) $i_o = 80e^{-500t}$ mA. d) $v_o(0^-) = (80\text{ mA})(20\ \Omega) = 1.6$ V. After opening, $i_o$ returns up through the 80 Ω, so $v_o(0^+) = -(80\text{ mA})(80\ \Omega) = -6.4$ V and $v_o = -6.4e^{-500t}$ V. $v_o$ is a resistor voltage, so it can jump.`
      },
      {
        id: "S8", title: "The general method, RC from a negative voltage", tags: [], lp: [1, 2, 3, 4],
        prompt: t`As in Nilsson Example 7.8. The switch has been in position a for a long time and moves to position b at $t = 0$.`,
        figure: figS8,
        parts: [
          { label: t`a) Find $v_C(0)$. Watch the polarity.`, numeric: true, answer: -40, unit: "V" },
          { label: t`b) Find $v_C(t)$ for $t \ge 0$. First $v_C(\infty)$:`, numeric: true, answer: 60, unit: "V" },
          { label: t`b) … $\tau$:`, numeric: true, answer: 0.2, unit: "s" },
          { label: t`b) … $B$ in $v_C(t) = v_C(\infty) + Be^{-t/\tau}$:`, numeric: true, answer: -100, unit: "V" },
          { label: t`c) Find the capacitor current $i$, referenced into its + terminal, for $t \ge 0^+$. In the form $Ie^{-t/\tau}$, enter $I$:`, numeric: true, answer: 0.4, unit: "mA" },
          { label: t`d) When is $v_C$ zero?`, numeric: true, answer: 102, unit: "ms" }
        ],
        explain: t`a) Long at a, the capacitor is across the 40 Ω of a divider fed by the 50 V source, whose + terminal is at the bottom: $v_C(0) = -50 \times 40/50 = -40$ V. The top of the 40 Ω is negative. b) $v_C(\infty) = 60$ V and $\tau = (250\text{ k}\Omega)(0.8\ \mu\text{F}) = 0.2$ s, so $v_C = 60 + (-40 - 60)e^{-5t} = 60 - 100e^{-5t}$ V. c) $i = C\,dv_C/dt = (0.8\ \mu\text{F})(500e^{-5t}) = 0.4e^{-5t}$ mA. d) $60 - 100e^{-5t} = 0$ gives $t = 0.2\ln(100/60) = 102$ ms.`
      },
      {
        id: "S9", title: t`A dependent source sets $\tau$`, tags: [], lp: [1, 3, 4],
        prompt: t`As in booklet Problem 7.7. The switch has been closed for a long time and opens at $t = 0$.`,
        figure: figS9,
        parts: [
          { label: t`a) Find $i_L(0)$.`, numeric: true, answer: 4, unit: "A" },
          { label: t`b) For $t \ge 0$, find the resistance the inductor sees, using a test source.`, numeric: true, answer: 20, unit: "Ω" },
          { label: t`c) Find $\tau$ and $i_L(t)$ for $t \ge 0$. Enter $\tau$:`, numeric: true, answer: 25, unit: "ms" },
          { label: t`d) Find $i_x(t)$ for $t \ge 0^+$. In the form $Ie^{-t/\tau}$, enter $I$:`, numeric: true, answer: -2, unit: "A" }
        ],
        explain: t`Call the node at the top of the two right-hand 20 Ω resistors B. a) $i_L(0) = 4$ A: the inductor shorts the 10 Ω, and the right-hand branch carries no current ($i_x = -i_x$ gives $i_x = 0$). b) Put a test current $i_T$ into the top node of the inductor: $v_B = i_T(20 \parallel 20) = 10i_T$, $i_x = 0.5i_T$, and $v_T = v_B + 20i_x = 20i_T$, so $R = 20$ Ω. c) $\tau = 0.5/20 = 25$ ms and $i_L = 4e^{-40t}$ A. d) A current $-i_L$ flows into node B, so $v_B = -10i_L$ and $i_x = v_B/20 = -2e^{-40t}$ A.`
      },
      {
        id: "S10", title: "A dependent source in an RC circuit", tags: [], lp: [3, 4],
        prompt: t`The 2 µF capacitor has been charged to 30 V. At $t = 0$ the switch closes.`,
        figure: figS10,
        parts: [
          { label: "a) Find the resistance the capacitor sees, using a test source.", numeric: true, answer: 20, unit: "kΩ" },
          { label: t`b) Find $\tau$ and $v(t)$ for $t \ge 0$. Enter $\tau$:`, numeric: true, answer: 40, unit: "ms" },
          { label: t`c) Find $i(t)$ and $v_x(t)$ for $t \ge 0^+$. In the form $Ke^{-t/\tau}$, enter $K$ for $i(t)$:`, numeric: true, answer: 1.5, unit: "mA" },
          { label: t`c) … $K$ for $v_x(t)$:`, numeric: true, answer: 7.5, unit: "V" }
        ],
        explain: t`a) Replace the capacitor with a test current $i_T$ flowing into the 15 kΩ. At node B, the top of the 20 kΩ, $i_T = v_B/20\text{ k}\Omega + (0.15\text{ mS})v_B$, so $v_B = (5\text{ k}\Omega)i_T$ and $R = 15 + 5 = 20$ kΩ. b) $\tau = (20\text{ k}\Omega)(2\ \mu\text{F}) = 40$ ms and $v = 30e^{-25t}$ V. c) $i = v/20\text{ k}\Omega = 1.5e^{-25t}$ mA and $v_x = (5\text{ k}\Omega)i = 7.5e^{-25t}$ V.`
      },
      {
        id: "S11", title: "Spot the error", tags: ["Spot the error"], lp: [1, 4],
        prompt: t`The worked solution below contains the kind of polarity slip AI chat tools often make. For $t < 0$ a 0.4 µF capacitor has been connected for a long time across the 24 kΩ resistor of a divider: a 36 V source in series with 12 kΩ and 24 kΩ. The source’s + terminal connects to the bottom of the 24 kΩ, so the top of the 24 kΩ is negative. At $t = 0$ the capacitor is switched to a 48 V source in series with 125 kΩ. $v_C$ is positive at the top.`,
        work: [
          t`$\tau = (125\text{ k}\Omega)(0.4\ \mu\text{F}) = 50$ ms.`,
          t`$v_C(0) = 36 \times 24/(12 + 24) = 24$ V.`,
          t`$v_C(\infty) = 48$ V.`,
          t`$v_C(t) = 48 + (24 - 48)e^{-20t} = 48 - 24e^{-20t}$ V.`,
          t`Check: $v_C(0) = 24$ V and $v_C(\infty) = 48$ V, as found.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: lines5, answer: 1 },
          { label: t`b) Correct it and find $v_C(t)$. The corrected $v_C(0)$:`, numeric: true, answer: -24, unit: "V" },
          { label: t`b) … $B$ in $v_C(t) = 48 + Be^{-20t}$ V:`, numeric: true, answer: -72, unit: "V" },
          { label: "c) Line 5 calls itself a check. Why did it not catch the error?", note: true, text: "Answer in a sentence, then compare with the explanation." },
          { label: t`d) When is $v_C$ zero?`, numeric: true, answer: 20.3, unit: "ms" }
        ],
        explain: t`Line 2 drops the polarity: the top of the 24 kΩ is negative, so $v_C(0) = -24$ V, and $v_C = 48 + (-24 - 48)e^{-20t} = 48 - 72e^{-20t}$ V. c) Line 5 tests the formula against its own initial value and never goes back to the figure, so it cannot catch a wrong initial value. d) $48 - 72e^{-20t} = 0$ gives $t = 0.05\ln(72/48) = 20.3$ ms.`
      },
      {
        id: "S12", title: "Spot the error in a time constant", tags: ["Spot the error"], lp: [3],
        prompt: t`An uncharged 0.4 µF capacitor is connected at $t = 0$ through 5 kΩ to a node N. Node N connects through 30 kΩ to a 60 V source and through 60 kΩ to ground.`,
        work: [
          t`$v(0) = 0$, since the capacitor is uncharged.`,
          t`$v(\infty) = 60 \times 60/(30 + 60) = 40$ V.`,
          t`$\tau = (5 + 30 + 60\text{ k}\Omega)(0.4\ \mu\text{F}) = 38$ ms.`,
          t`$v(t) = 40 - 40\exp(-t/0.038)$ V.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4"], answer: 2 },
          { label: t`b) Find the correct $\tau$.`, numeric: true, answer: 10, unit: "ms" },
          { label: t`b) … and $v(t)$: enter $a$ in $v(t) = 40 - 40e^{-at}$ V.`, numeric: true, answer: 100, unit: "1/s" },
          { label: "c) What resistance does the capacitor see?", numeric: true, answer: 25, unit: "kΩ" },
          { label: "c) … and how do you find it?", note: true, text: "Answer in a sentence, then compare with the explanation." }
        ],
        explain: t`Line 3 puts all three resistors in series. With the source shorted, the capacitor sees $5 + 30 \parallel 60 = 25$ kΩ: $\tau = (25\text{ k}\Omega)(0.4\ \mu\text{F}) = 10$ ms and $v = 40 - 40e^{-100t}$ V. c) It is the Thévenin resistance at the capacitor’s terminals, with the independent source replaced by a short circuit.`
      },
      {
        id: "S13", title: "Work backwards", tags: [], lp: [6],
        prompt: t`A capacitor charges through 10 kΩ. Its voltage is 10 V at $t = 0$, rises toward 40 V, and reads 30 V at $t = 2$ ms.`,
        parts: [
          { label: t`a) Find $\tau$.`, numeric: true, answer: 1.82, unit: "ms" },
          { label: t`b) Find $C$.`, numeric: true, answer: 0.182, unit: "µF" },
          { label: "c) When does the voltage reach 39 V?", numeric: true, answer: 6.19, unit: "ms" },
          { label: t`d) The same steps work for an inductor: a current rises from 0 toward 2 A through 20 Ω and reads 1.5 A at $t = 6.93$ ms. Find $\tau$:`, numeric: true, answer: 5, unit: "ms" },
          { label: t`d) … and $L$.`, numeric: true, answer: 0.1, unit: "H" }
        ],
        explain: t`a) $30 - 40 = (10 - 40)e^{-2\text{ ms}/\tau}$, so $e^{-2\text{ ms}/\tau} = 1/3$ and $\tau = 2/\ln 3 = 1.82$ ms. b) $C = \tau/R = 1.82\text{ ms}/10\text{ k}\Omega = 0.182\ \mu$F. c) $39 - 40 = (10 - 40)e^{-t/\tau}$ gives $e^{-t/\tau} = 1/30$: $t = \tau\ln 30 = 6.19$ ms. d) $1.5/2 = 0.75$, so $e^{-6.93\text{ ms}/\tau} = 0.25$: $\tau = 6.93/\ln 4 = 5$ ms and $L = \tau R = 0.1$ H.`
      },
      {
        id: "S14", title: "An artificial pacemaker", tags: ["Predict first"], lp: [4, 6],
        prompt: t`As in Nilsson’s Practical Perspective for this chapter. A source $V_s$ charges a capacitor $C$ through a resistor $R$, starting from 0 V. When $v_C$ reaches $0.75V_s$, a controller discharges the capacitor in a negligible time and sends a pulse to the heart; then charging starts again.`,
        parts: [
          { label: t`a) Show that each charging takes $t = RC\ln 4$, so the heart rate is $H = 60/(RC\ln 4)$ beats per minute.`, note: true, text: "Show it on paper, then compare with the explanation." },
          { label: t`b) With $C = 2$ µF, what $R$ gives 60 beats per minute?`, numeric: true, answer: 361, unit: "kΩ" },
          { label: t`c) With $C = 2$ µF and $R = 300$ kΩ, what is the heart rate?`, numeric: true, answer: 72.1, unit: "beats per minute" },
          { label: t`d) Predict first: what happens to the heart rate if $R$ is doubled?`, options: ["It doubles.", "It halves.", "It does not change."], answer: 1 }
        ],
        explain: t`a) $V_s(1 - e^{-t/RC}) = 0.75V_s$ gives $e^{-t/RC} = 0.25$, so $t = RC\ln 4$, and $H = 60/t$. b) $H = 60$ needs $t = 1$ s: $RC = 1/\ln 4 = 0.721$ s, so $R = 0.721\text{ s}/2\ \mu\text{F} = 361$ kΩ. c) $RC = 0.6$ s: $H = 60/(0.6\ln 4) = 72.1$ beats per minute. d) It halves: doubling $R$ doubles $RC$ and so the time of each charging.`
      },
      {
        id: "S15", title: "How fast does a relay let go?", tags: [], lp: [3, 4, 5],
        prompt: t`A 0.5 H relay coil with 60 Ω winding resistance carries 0.2 A from a 12 V supply. When the driving switch opens at $t = 0$, the coil current continues through a diode (ideal: 0 V when conducting) in series with a 140 Ω resistor, connected across the coil.`,
        parts: [
          { label: t`a) Find $\tau$ for $t \ge 0$.`, numeric: true, answer: 2.5, unit: "ms" },
          { label: "b) The relay releases when the current falls below 50 mA. When does it release?", numeric: true, answer: 3.47, unit: "ms" },
          { label: t`c) What voltage appears across the coil’s terminals at $t = 0^+$? Take it positive at the terminal the supply made positive.`, numeric: true, answer: -28, unit: "V" },
          { label: t`d) Repeat (a) and (b) with the diode alone (no 140 Ω). $\tau$:`, numeric: true, answer: 8.33, unit: "ms" },
          { label: "d) … and the release time:", numeric: true, answer: 11.6, unit: "ms" },
          { label: "d) Why do designers sometimes add the resistor?", note: true, text: "Answer in a sentence, then compare with the explanation." }
        ],
        explain: t`a) The coil current flows through the winding and the 140 Ω: $R = 60 + 140 = 200$ Ω and $\tau = 0.5/200 = 2.5$ ms. b) $0.2e^{-t/\tau} = 0.05$ gives $t = 2.5\ln(0.2/0.05) = 3.47$ ms. c) The coil’s terminals are across the diode and the 140 Ω: $-(0.2)(140) = -28$ V: the polarity reverses, and the open switch then sees $12 + 28 = 40$ V. d) $\tau = 0.5/60 = 8.33$ ms; the relay releases at $8.33\ln 4 = 11.6$ ms, with almost no spike. The resistor buys a faster release at the cost of a higher spike.`
      },
      {
        id: "S16", title: "Check an answer without solving again", tags: [], lp: [1, 2, 3, 4],
        prompt: t`A 0.4 H inductor carries $i(0) = -2$ A. At $t = 0$ it is switched across a 20 V source in series with 5 Ω; $i$ is referenced in the direction the source drives current. Student 1: $i = 4 - 6\exp(-12.5t)$ A. Student 2: $i = 4 - 2\exp(-12.5t)$ A. Use $i(0)$, $i(\infty)$ and $\tau$ to decide which student is right.`,
        parts: [
          { label: t`Find $i(\infty)$.`, numeric: true, answer: 4, unit: "A" },
          { label: t`Find $\tau$.`, numeric: true, answer: 80, unit: "ms" },
          { label: "Which student is right?", options: ["Student 1", "Student 2"], answer: 0 }
        ],
        explain: t`$i(0) = -2$ A, $i(\infty) = 20/5 = 4$ A and $\tau = 0.4/5 = 0.08$ s, so the exponent is $-12.5t$. Both answers end at 4 A with the right exponent, but Student 2’s answer starts at +2 A, not −2 A. Student 1’s gives $4 - 6 = -2$ A at $t = 0$, so Student 1 is right.`
      }
    ]
  };
})(window.EENG);
