// Chapter 4, Part 2 practice sheet (Lane B: open, AI allowed). Interactive version of "Practice sheet – Part 2.pdf".
// Question fields:
//   id, title, tags (labels shown), lp (Part 2 checklist items it practises), prompt, optional figure / table / work / hint
//   parts: every graded part must be right for the question to count as correct
//     { label, options, answer (index from 0), roman: true for i) ii) … }
//     { label, numeric: true, answer, unit, rel (relative tolerance, default 1%) }
//     { label, note: true } for a sub-question with nothing to check; its answer is in explain
//   explain: shown after the student checks
(function (E) {
  var t = String.raw;

  // ---- Small circuit-drawing helpers (local to this sheet) ----
  var MINUS = "&#8722;";
  var SW = ' stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  function r1(v) { return Math.round(v * 10) / 10; }
  function svg(w, h, label, body) {
    return '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" role="img" aria-label="' + label + '">' + body + "</svg>";
  }
  function wire() { // wire(x1, y1, x2, y2, ...)
    var a = arguments, p = [];
    for (var i = 0; i < a.length; i += 2) p.push(r1(a[i]) + "," + r1(a[i + 1]));
    return '<polyline points="' + p.join(" ") + '"' + SW + "/>";
  }
  var ZX = [-20, -16.7, -10, -3.3, 3.3, 10, 16.7, 20], ZY = [0, -7, 7, -7, 7, -7, 7, 0];
  function resH(x1, x2, y) { // resistor centred on a horizontal wire from x1 to x2
    var c = (x1 + x2) / 2, p = [r1(x1) + "," + y];
    for (var i = 0; i < ZX.length; i++) p.push(r1(c + ZX[i]) + "," + (y + ZY[i]));
    p.push(r1(x2) + "," + y);
    return '<polyline points="' + p.join(" ") + '"' + SW + "/>";
  }
  function resV(x, y1, y2) { // resistor centred on a vertical wire from y1 to y2
    var c = (y1 + y2) / 2, p = [x + "," + r1(y1)];
    for (var i = 0; i < ZX.length; i++) p.push((x + ZY[i]) + "," + r1(c + ZX[i]));
    p.push(x + "," + r1(y2));
    return '<polyline points="' + p.join(" ") + '"' + SW + "/>";
  }
  function vsrc(x, y1, y2, top) { // independent voltage source; top = "+" or "-" (the mark nearer y1)
    var c = (y1 + y2) / 2, yp = top === "+" ? c - 8 : c + 8, ym = top === "+" ? c + 8 : c - 8;
    return wire(x, y1, x, c - 18) + wire(x, c + 18, x, y2) +
      '<circle cx="' + x + '" cy="' + c + '" r="18"' + SW + "/>" +
      '<path d="M' + (x - 5) + " " + yp + "h10M" + x + " " + (yp - 5) + "v10M" + (x - 5) + " " + ym + 'h10" stroke="currentColor" stroke-width="2.2" fill="none"/>';
  }
  function arrowIn(x, c, dir, s) { // arrow inside a source symbol
    var d = dir === "up" ? -1 : 1;
    return '<line x1="' + x + '" y1="' + (c - d * s) + '" x2="' + x + '" y2="' + (c + d * (s - 7)) + '" stroke="currentColor" stroke-width="2.2"/>' +
      '<polygon points="' + (x - 4.5) + "," + (c + d * (s - 8)) + " " + (x + 4.5) + "," + (c + d * (s - 8)) + " " + x + "," + (c + d * s) + '" fill="currentColor"/>';
  }
  function isrc(x, y1, y2, dir) { // independent current source, arrow "up" or "down"
    var c = (y1 + y2) / 2;
    return wire(x, y1, x, c - 18) + wire(x, c + 18, x, y2) + '<circle cx="' + x + '" cy="' + c + '" r="18"' + SW + "/>" + arrowIn(x, c, dir, 11);
  }
  function disrc(x, y1, y2, dir) { // dependent current source (diamond), arrow "up" or "down"
    var c = (y1 + y2) / 2;
    return wire(x, y1, x, c - 20) + wire(x, c + 20, x, y2) +
      '<polygon points="' + x + "," + (c - 20) + " " + (x + 20) + "," + c + " " + x + "," + (c + 20) + " " + (x - 20) + "," + c + '"' + SW + "/>" +
      arrowIn(x, c, dir, 10);
  }
  function dvsrcH(x1, x2, y) { // dependent voltage source (diamond) on a horizontal wire; marks drawn separately
    var c = (x1 + x2) / 2;
    return wire(x1, y, c - 18, y) + wire(c + 18, y, x2, y) +
      '<polygon points="' + (c - 18) + "," + y + " " + c + "," + (y - 18) + " " + (c + 18) + "," + y + " " + c + "," + (y + 18) + '"' + SW + "/>";
  }
  function term(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.5" stroke="currentColor" stroke-width="2" fill="none"/>'; }
  function dot(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="currentColor"/>'; }
  function tx(x, y, s, anchor) {
    return '<text x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + ' fill="currentColor" font-size="19">' + s + "</text>";
  }
  function mark(x, y, s) { // + or − polarity mark
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="currentColor" font-size="22" font-weight="700">' + (s === "+" ? "+" : MINUS) + "</text>";
  }
  function it(s) { return '<tspan font-style="italic">' + s + "</tspan>"; }
  function sym(base, sub, upright) { // italic symbol with a subscript (upright for digits)
    return it(base) + '<tspan font-size="70%" dy="5"' + (upright ? "" : ' font-style="italic"') + ">" + sub + "</tspan>";
  }
  function arrowR(x1, x2, y) { // current reference arrow pointing right
    return '<line x1="' + x1 + '" y1="' + y + '" x2="' + (x2 - 8) + '" y2="' + y + '" stroke="currentColor" stroke-width="2.2"/>' +
      '<polygon points="' + (x2 - 10) + "," + (y - 5.5) + " " + (x2 - 10) + "," + (y + 5.5) + " " + x2 + "," + y + '" fill="currentColor"/>';
  }
  function arrowD(x, y1, y2) { // current reference arrow pointing down
    return '<line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + (y2 - 8) + '" stroke="currentColor" stroke-width="2.2"/>' +
      '<polygon points="' + (x - 5.5) + "," + (y2 - 10) + " " + (x + 5.5) + "," + (y2 - 10) + " " + x + "," + y2 + '" fill="currentColor"/>';
  }

  // Source (+ at the top) – series resistor – shunt resistor – [current source, arrow up] – series resistor – terminals a, b.
  function ladder(o) {
    var xn = o.cs ? 220 : 260, xc = 340, xa = 480, x3 = o.cs ? xc : xn;
    var b = vsrc(90, 50, 190, "+") + resH(90, xn, 50) + resV(xn, 50, 190) + dot(xn, 50) + dot(xn, 190) +
      tx(62, 126, o.vs, "end") + tx((90 + xn) / 2, 30, o.r1, "middle") + tx(xn + 16, 126, o.r2);
    if (o.cs) b += wire(xn, 50, xc, 50) + isrc(xc, 50, 190, "up") + dot(xc, 50) + dot(xc, 190) + tx(xc + 26, 126, o.cs);
    b += resH(x3, xa - 4.5, 50) + wire(90, 190, xa - 4.5, 190) + term(xa, 50) + term(xa, 190) +
      tx(r1((x3 + xa) / 2), 30, o.r3, "middle") + tx(xa + 14, 57, it("a")) + tx(xa + 14, 197, it("b"));
    return svg(520, 215, o.label, b);
  }

  // Two branches (resistor above a voltage source) joined at the top, then a series resistor to terminal a.
  function twoBranch(o) {
    var xl = 100, xm = 280, xa = 430, T = 50, M = 120, B = 220;
    return svg(470, 245, o.label,
      resV(xl, T, M) + vsrc(xl, M, B, o.top1) + resV(xm, T, M) + vsrc(xm, M, B, o.top2) +
      wire(xl, T, xm, T) + resH(xm, xa - 4.5, T) + wire(xl, B, xa - 4.5, B) + dot(xm, T) + dot(xm, B) + term(xa, T) + term(xa, B) +
      tx(xl - 16, 91, o.r1, "end") + tx(xl - 26, 176, o.v1, "end") + tx(xm + 16, 91, o.r2) + tx(xm + 26, 176, o.v2) +
      tx(r1((xm + xa) / 2), 30, o.r3, "middle") + tx(xa + 14, T + 7, it("a")) + tx(xa + 14, B + 7, it("b")));
  }

  // ---- Figures ----
  var figS1 = svg(380, 240,
    "Circuit: a 12 V voltage source on the left, + at the top and − at the bottom. Its top connects through a 4 Ω resistor to terminal a; its bottom connects directly to terminal b.",
    vsrc(90, 50, 210, "+") + resH(90, 325.5, 50) + wire(90, 210, 325.5, 210) + term(330, 50) + term(330, 210) +
    tx(62, 136, "12 V", "end") + tx(208, 30, "4 Ω", "middle") + tx(344, 57, it("a")) + tx(344, 217, it("b")));

  var figS2 = svg(620, 210,
    "Circuit between a top wire and a bottom wire. From left to right: a 60 V voltage source, + at the top; a 6 Ω resistor along the top wire; a 3 Ω resistor from top to bottom; an 8 Ω resistor along the top wire; a 10 Ω resistor from top to bottom; a 2 A current source from top to bottom with its arrow pointing up; and a 15 Ω resistor from top to bottom. The current i_o flows along the top wire to the right, from the 2 A source towards the 15 Ω resistor.",
    vsrc(80, 50, 170, "+") + resH(80, 210, 50) + resH(210, 340, 50) + wire(340, 50, 560, 50) + wire(80, 170, 560, 170) +
    resV(210, 50, 170) + resV(340, 50, 170) + isrc(450, 50, 170, "up") + resV(560, 50, 170) +
    dot(210, 50) + dot(210, 170) + dot(340, 50) + dot(340, 170) + dot(450, 50) + dot(450, 170) +
    arrowR(482, 510, 68) + tx(516, 78, sym("i", "o")) +
    tx(52, 116, "60 V", "end") + tx(145, 30, "6 Ω", "middle") + tx(275, 30, "8 Ω", "middle") +
    tx(226, 116, "3 Ω") + tx(356, 116, "10 Ω") + tx(476, 116, "2 A") + tx(576, 116, "15 Ω"));

  var figS3 = svg(560, 215,
    "Circuit: a 100 V voltage source on the left, + at the top. A 50 Ω resistor is connected directly across the source. A 20 Ω resistor runs along the top wire to a node from which a 10 Ω resistor in series with a 2 A current source, arrow pointing up, goes down to the bottom wire. On the right, a 20 Ω resistor from top to bottom carries the voltage v_o, + at the top and − at the bottom.",
    vsrc(90, 50, 190, "+") + wire(90, 50, 200, 50) + resV(200, 50, 190) + resH(200, 340, 50) + resV(340, 50, 110) + isrc(340, 110, 190, "up") +
    wire(340, 50, 470, 50) + wire(90, 190, 470, 190) + resV(470, 50, 190) +
    dot(200, 50) + dot(200, 190) + dot(340, 50) + dot(340, 190) +
    tx(62, 126, "100 V", "end") + tx(216, 126, "50 Ω") + tx(270, 30, "20 Ω", "middle") + tx(356, 86, "10 Ω") + tx(366, 156, "2 A") +
    mark(486, 80, "+") + mark(486, 182, "-") + tx(500, 120, "20 Ω") + tx(510, 148, sym("v", "o")));

  var figS4 = svg(570, 215,
    "Circuit: a 60 V voltage source on the left, + at the top. A 3 Ω resistor along the top wire carries i_1 to the right, to a node from which a 6 Ω resistor goes down, carrying i_2 downward. A 2 Ω resistor along the top wire carries i_3 to the right, to a node from which a 4 Ω resistor goes down, carrying i_4 downward. On the right, a 6 A current source from top to bottom with its arrow pointing down.",
    vsrc(90, 50, 190, "+") + resH(90, 230, 50) + resH(230, 370, 50) + resV(230, 50, 190) + resV(370, 50, 190) +
    wire(370, 50, 500, 50) + wire(90, 190, 500, 190) + isrc(500, 50, 190, "down") +
    dot(230, 50) + dot(230, 190) + dot(370, 50) + dot(370, 190) +
    arrowR(146, 174, 70) + tx(180, 82, sym("i", "1", true)) + arrowR(286, 314, 70) + tx(320, 82, sym("i", "3", true)) +
    arrowD(210, 106, 134) + tx(200, 126, sym("i", "2", true), "end") + arrowD(350, 106, 134) + tx(340, 126, sym("i", "4", true), "end") +
    tx(62, 126, "60 V", "end") + tx(160, 30, "3 Ω", "middle") + tx(300, 30, "2 Ω", "middle") +
    tx(246, 126, "6 Ω") + tx(386, 126, "4 Ω") + tx(526, 126, "6 A"));

  var figS6 = ladder({ vs: "60 V", r1: "4 Ω", r2: "12 Ω", cs: "5 A", r3: "2 Ω",
    label: "Circuit: a 60 V voltage source on the left, + at the top. A 4 Ω resistor along the top wire leads to a node with a 12 Ω resistor down to the bottom wire, then a 5 A current source from bottom to top with its arrow pointing up, then a 2 Ω resistor along the top wire to terminal a. The bottom wire goes to terminal b." });

  var figS7 = twoBranch({ r1: "10 Ω", v1: "50 V", top1: "+", r2: "15 Ω", v2: "30 V", top2: "+", r3: "1 Ω",
    label: "Circuit with two branches between a top wire and a bottom wire. Left branch: a 10 Ω resistor above a 50 V voltage source, + at the top. Middle branch: a 15 Ω resistor above a 30 V voltage source, + at the top. From the top wire, a 1 Ω resistor leads to terminal a; the bottom wire goes to terminal b." });

  var figS8 = svg(520, 215,
    "Circuit: a 24 V voltage source on the left, + at the top. A 4 Ω resistor along the top wire leads to a node with a 20 Ω resistor down to the bottom wire, carrying i_x downward. A 10 Ω resistor along the top wire leads to a dependent current source 2 i_x, a diamond from bottom to top with its arrow pointing up, connected across terminals a (top) and b (bottom).",
    vsrc(90, 50, 190, "+") + resH(90, 220, 50) + resV(220, 50, 190) + resH(220, 360, 50) + disrc(360, 50, 190, "up") +
    wire(360, 50, 475.5, 50) + wire(90, 190, 475.5, 190) +
    dot(220, 50) + dot(220, 190) + dot(360, 50) + dot(360, 190) + term(480, 50) + term(480, 190) +
    arrowD(200, 106, 134) + tx(190, 126, sym("i", "x"), "end") +
    tx(62, 126, "24 V", "end") + tx(155, 30, "4 Ω", "middle") + tx(236, 126, "20 Ω") + tx(290, 30, "10 Ω", "middle") +
    tx(390, 126, "2" + sym("i", "x")) + tx(494, 57, it("a")) + tx(494, 197, it("b")));

  var figS9 = svg(500, 215,
    "Circuit with terminals a (top left) and b (bottom left). Across the terminals: a dependent current source v_x/40, a diamond with its arrow pointing up towards the top wire; then a 30 Ω resistor; then a 10 Ω resistor along the top wire in series with a 20 Ω resistor down to the bottom wire. The voltage across the 20 Ω is v_x, + at the top and − at the bottom.",
    term(40, 50) + term(40, 190) + wire(44.5, 50, 270, 50) + wire(44.5, 190, 400, 190) +
    disrc(150, 50, 190, "up") + resV(270, 50, 190) + resH(270, 400, 50) + resV(400, 50, 190) +
    dot(150, 50) + dot(150, 190) + dot(270, 50) + dot(270, 190) +
    tx(28, 57, it("a"), "end") + tx(28, 197, it("b"), "end") +
    tx(178, 126, sym("v", "x") + '<tspan dy="-5">/40</tspan>') + tx(286, 126, "30 Ω") + tx(335, 30, "10 Ω", "middle") +
    mark(416, 80, "+") + mark(416, 182, "-") + tx(430, 120, "20 Ω") + tx(440, 148, sym("v", "x")));

  var figS10 = svg(530, 240,
    "Circuit: a 90 V voltage source on the left, + at the top. A 10 Ω resistor along the top wire leads to a node with a 40 Ω resistor down to the bottom wire, then a 1 Ω resistor along the top wire to terminal a. The load resistor R_L is connected between terminal a on the top wire and terminal b on the bottom wire.",
    vsrc(90, 50, 200, "+") + resH(90, 220, 50) + resV(220, 50, 200) + resH(220, 350, 50) + wire(350, 50, 470, 50) +
    resV(470, 50, 200) + wire(90, 200, 470, 200) +
    dot(220, 50) + dot(220, 200) + dot(350, 50) + dot(350, 200) +
    tx(62, 131, "90 V", "end") + tx(155, 30, "10 Ω", "middle") + tx(236, 131, "40 Ω") + tx(285, 30, "1 Ω", "middle") +
    tx(350, 34, it("a"), "middle") + tx(350, 226, it("b"), "middle") + tx(486, 131, sym("R", "L")));

  var figS11 = twoBranch({ r1: "6 Ω", v1: "30 V", top1: "+", r2: "3 Ω", v2: "6 V", top2: "-", r3: "4 Ω",
    label: "Circuit with two branches between a top wire and a bottom wire. Left branch: a 6 Ω resistor above a 30 V voltage source, + at the top. Middle branch: a 3 Ω resistor above a 6 V voltage source, − at the top and + at the bottom. From the top wire, a 4 Ω resistor leads to terminal a; the bottom wire goes to terminal b." });

  var figS12 = ladder({ vs: "20 V", r1: "4 Ω", r2: "12 Ω", cs: "2 A", r3: "5 Ω",
    label: "Circuit: a 20 V voltage source on the left, + at the top. A 4 Ω resistor along the top wire leads to a node with a 12 Ω resistor down to the bottom wire, then a 2 A current source from bottom to top with its arrow pointing up, then a 5 Ω resistor along the top wire to terminal a. The bottom wire goes to terminal b." });

  var figS13 = svg(540, 215,
    "Circuit: a 100 V voltage source on the left, + at the top. A 10 Ω resistor along the top wire carries i_1 to the right, to a node with a 40 Ω resistor down to the bottom wire. From that node, a dependent voltage source 5 i_1 (a diamond on the top wire, − on the left and + on the right) and then a 6 Ω resistor lead to terminal a. The bottom wire goes to terminal b.",
    vsrc(90, 50, 190, "+") + resH(90, 210, 50) + resV(210, 50, 190) + dvsrcH(210, 360, 50) + resH(360, 495.5, 50) +
    wire(90, 190, 495.5, 190) + dot(210, 50) + dot(210, 190) + term(500, 50) + term(500, 190) +
    arrowR(136, 164, 70) + tx(170, 82, sym("i", "1", true)) +
    tx(62, 126, "100 V", "end") + tx(150, 30, "10 Ω", "middle") + tx(226, 126, "40 Ω") +
    tx(285, 22, "5" + sym("i", "1", true), "middle") + mark(271, 92, "-") + mark(299, 92, "+") +
    tx(428, 30, "6 Ω", "middle") + tx(514, 57, it("a")) + tx(514, 197, it("b")));

  var figS16 = ladder({ vs: "36 V", r1: "6 Ω", r2: "12 Ω", r3: "2 Ω",
    label: "Circuit: a 36 V voltage source on the left, + at the top. A 6 Ω resistor along the top wire leads to a node with a 12 Ω resistor down to the bottom wire, then a 2 Ω resistor along the top wire to terminal a. The bottom wire goes to terminal b." });

  var LINES5 = ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"];

  E.sheets["4-2"] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. The Part 2 device-free quiz, at the start of week 10, session 1 (Thu 10 Dec), is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Both must be right.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Conventions:</strong> $v_{ab}$ is the voltage of terminal a measured from terminal b. A Thévenin equivalent is $V_{\text{Th}}$ in series with $R_{\text{Th}}$; a Norton equivalent is $I_N$ in parallel with $R_N = R_{\text{Th}}$. To deactivate a voltage source, replace it with a short circuit; to deactivate a current source, replace it with an open circuit. Never deactivate a dependent source. “Power developed” means power delivered by a source. Check every answer: $V_{\text{Th}}/R_{\text{Th}}$ must equal the short-circuit current, and the absorbed powers (passive sign convention) must add to zero.`
    ],

    questions: [
      {
        id: "S1", title: "A source transformation", tags: ["Two-tier"], lp: [1],
        prompt: t`Which current source and resistor are equivalent at terminals a and b? (“Toward a” gives the direction of the source arrow.)`,
        figure: figS1,
        parts: [
          { label: "Answer", options: [
            "3 A toward b, 4 Ω in parallel",
            "3 A toward a, 4 Ω in parallel",
            "48 A toward a, 4 Ω in parallel",
            "3 A toward a, 4 Ω in series"
          ], answer: 1 },
          { label: "Reason", roman: true, options: [
            "A current-source arrow points from + to −, the way current flows through a resistor.",
            "The resistor must stay in series to limit the current.",
            "Both circuits must give the same short-circuit current, 12/4 = 3 A out of terminal a, and the same resistance seen from a and b.",
            "The source current is the voltage times the resistance."
          ], answer: 2 },
          { label: "Follow-up: with a and b open, the 4 Ω absorbs 0 W in one circuit and 36 W in the other. Why does that not contradict the equivalence?", note: true }
        ],
        explain: t`Short a to b: $12/4 = 3$ A flows out of terminal a. The current source must push the same 3 A out of a, so its arrow points toward a (the + side of the voltage source), with the same 4 Ω in parallel so that the resistance seen from a and b is unchanged. Reason (i) leads to (a), (ii) to (d), and (iv) to (c), since $12 \times 4 = 48$. Follow-up: the equivalence holds only at the terminals, not inside. With a and b open, no current flows in the voltage-source circuit, so its 4 Ω absorbs 0 W; in the current-source circuit the 3 A flows through the 4 Ω, which absorbs $3^2 \times 4 = 36$ W. Both still give $v_{ab} = 12$ V.`
      },
      {
        id: "S2", title: "A chain of source transformations", tags: [], lp: [1],
        prompt: "",
        figure: figS2,
        parts: [
          { label: t`a) Use successive source transformations to find $i_o$.`, numeric: true, answer: 1, unit: "A" },
          { label: t`b) Check your answer with the node-voltage method. With the bottom wire as the reference, the node voltage above the 3 Ω`, numeric: true, answer: 19, unit: "V" },
          { label: t`b) …and the node voltage above the 15 Ω`, numeric: true, answer: 15, unit: "V" }
        ],
        explain: t`a) The 60 V source with the 6 Ω becomes 10 A in parallel with 6 Ω. With the 3 Ω, $6 \parallel 3 = 2$ Ω, which transforms back to 20 V in series with 2 Ω. Add the 8 Ω: 20 V with 10 Ω becomes 2 A in parallel with 10 Ω. With the 10 Ω, $10 \parallel 10 = 5$ Ω. The 2 A source points up, the same way, so the two add: 4 A in parallel with 5 Ω. The current divider gives $i_o = 4 \times 5/(5 + 15) = 1$ A. b) $v_1 = 19$ V above the 3 Ω and $v_2 = 15$ V above the 15 Ω, so $i_o = 15/15 = 1$ A. KCL at node 2, currents leaving: $1.5 + 1 - 2 - 0.5 = 0$.`
      },
      {
        id: "S3", title: "Resistors you may remove, and resistors you may not", tags: ["Predict first"], lp: [1],
        prompt: "",
        figure: figS3,
        parts: [
          { label: t`Predict first: does the 50 Ω change $v_o$? Does the 10 Ω?`, options: [
            t`Both change $v_o$`,
            t`Only the 50 Ω changes $v_o$`,
            t`Only the 10 Ω changes $v_o$`,
            t`Neither changes $v_o$`
          ], answer: 3 },
          { label: t`a) Use source transformations to find $v_o$.`, numeric: true, answer: 70, unit: "V" },
          { label: "b) Find the power developed by the 100 V source.", numeric: true, answer: 350, unit: "W" },
          { label: "c) Find the power developed by the 2 A source.", numeric: true, answer: 180, unit: "W" },
          { label: "d) Which resistors could you drop in (a), and why do they matter in (b) and (c)?", note: true }
        ],
        explain: t`Neither changes $v_o$: the 50 Ω is directly across the 100 V source, so its voltage is fixed at 100 V, and the 10 Ω is in series with the 2 A source, so its current is fixed at 2 A. a) Drop both. 100 V with 20 Ω becomes 5 A in parallel with 20 Ω; add the 2 A (both arrows up) to get 7 A; $20 \parallel 20 = 10$ Ω, so $v_o = 7 \times 10 = 70$ V. b) The 100 V source supplies 2 A to the 50 Ω plus $(100 - 70)/20 = 1.5$ A to the 20 Ω: 3.5 A, so it develops $100 \times 3.5 = 350$ W. c) The 2 A source has $70 + 2 \times 10 = 90$ V across it, so it develops $90 \times 2 = 180$ W. d) The 50 Ω and the 10 Ω change nothing at the load, but they carry current, so they change the powers: the 50 Ω absorbs 200 W and the 10 Ω absorbs 40 W. Balance: absorbed $200 + 45 + 40 + 245 = 530$ W $= 350 + 180$ W developed.`
      },
      {
        id: "S4", title: "Superposition", tags: [], lp: [2],
        prompt: t`As in Nilsson Example 4.22.<br>a) Find $i_1$ to $i_4$ with the 60 V source alone.<br>b) Find them with the 6 A source alone.<br>c) Add the two sets to get the actual currents.<br>d) Find the power in the 6 Ω resistor. Compare it with the sum of the powers you would get from (a) and (b) separately.`,
        figure: figS4,
        parts: [
          { label: t`a) 60 V source alone: $i_1$`, numeric: true, answer: 10, unit: "A" },
          { label: t`a) $i_2$`, numeric: true, answer: 5, unit: "A" },
          { label: t`a) $i_3$`, numeric: true, answer: 5, unit: "A" },
          { label: t`a) $i_4$`, numeric: true, answer: 5, unit: "A" },
          { label: t`b) 6 A source alone: $i_1$`, numeric: true, answer: 2, unit: "A" },
          { label: t`b) $i_2$`, numeric: true, answer: -1, unit: "A" },
          { label: t`b) $i_3$`, numeric: true, answer: 3, unit: "A" },
          { label: t`b) $i_4$`, numeric: true, answer: -3, unit: "A" },
          { label: t`c) Actual currents: $i_1$`, numeric: true, answer: 12, unit: "A" },
          { label: t`c) $i_2$`, numeric: true, answer: 4, unit: "A" },
          { label: t`c) $i_3$`, numeric: true, answer: 8, unit: "A" },
          { label: t`c) $i_4$`, numeric: true, answer: 2, unit: "A" },
          { label: "d) The power in the 6 Ω resistor", numeric: true, answer: 96, unit: "W" },
          { label: "d) The sum of the powers in the 6 Ω from (a) and (b) separately", numeric: true, answer: 156, unit: "W" }
        ],
        explain: t`a) With the 6 A source open, the 2 Ω and 4 Ω in series (6 Ω) are in parallel with the 6 Ω, giving 3 Ω; with the 3 Ω the source sees 6 Ω. So $i_1 = 60/6 = 10$ A, which splits equally: $i_2 = 5$ A and $i_3 = i_4 = 5$ A. b) With the 60 V source shorted, the 6 A arrow points down, so the source pulls current down out of the right-hand node: $i_1 = 2$ A, $i_2 = -1$ A, $i_3 = 3$ A, $i_4 = -3$ A (the 6 Ω and 4 Ω currents flow upward). c) Add with signs: $i_1 = 12$ A, $i_2 = 4$ A, $i_3 = 8$ A, $i_4 = 2$ A. d) $4^2 \times 6 = 96$ W, not $150 + 6 = 156$ W. Currents add, but power goes as the square of the current, so powers do not.`
      },
      {
        id: "S5", title: "Does power add?", tags: ["Two-tier"], lp: [2],
        prompt: t`With only source 1 on, 2 A flows down through a 5 Ω resistor. With only source 2 on, 1 A flows down through it. What power does the resistor absorb with both sources on?`,
        parts: [
          { label: "Answer", options: ["25 W", "20 W", "45 W", "5 W"], answer: 2 },
          { label: "Reason", roman: true, options: [
            "The powers add, because energy is conserved.",
            "Only the larger source sets the power; the smaller one is masked.",
            "Currents from two different sources subtract, because they oppose each other.",
            "The currents add, with their directions, to one total current, and the power depends on the square of that total."
          ], answer: 3 }
        ],
        explain: t`Both currents flow down, so they add to 3 A down, and $p = (2 + 1)^2 \times 5 = 45$ W. (a) adds the powers, $20 + 5$ (reason i); (b) keeps only the larger source (reason ii); (d) subtracts the currents (reason iii).`
      },
      {
        id: "S6", title: t`A Thévenin equivalent from $v_{\text{oc}}$ and $i_{\text{sc}}$`, tags: [], lp: [3, 4],
        prompt: t`As in Nilsson Example 4.14.`,
        figure: figS6,
        parts: [
          { label: t`a) Find $V_{\text{Th}}$, the open-circuit voltage $v_{ab}$.`, numeric: true, answer: 60, unit: "V" },
          { label: t`b) Short a to b. Find $i_{\text{sc}}$`, numeric: true, answer: 12, unit: "A" },
          { label: t`b) …then $R_{\text{Th}} = V_{\text{Th}}/i_{\text{sc}}$`, numeric: true, answer: 5, unit: "Ω" },
          { label: t`c) Check $R_{\text{Th}}$ by deactivating both sources: the resistance seen from a and b`, numeric: true, answer: 5, unit: "Ω" },
          { label: "d) A 15 Ω load is connected between a and b. Find its current", numeric: true, answer: 3, unit: "A" },
          { label: "d) …and its power", numeric: true, answer: 135, unit: "W" }
        ],
        explain: t`a) With a and b open, the 2 Ω carries no current, so $v_{ab}$ is the voltage $v$ above the 12 Ω: $(v - 60)/4 + v/12 - 5 = 0$ gives $v = 60$ V, so $V_{\text{Th}} = 60$ V. (The 60 V source carries no current.) b) With a–b shorted, $(v - 60)/4 + v/12 - 5 + v/2 = 0$ gives $v = 24$ V, so $i_{\text{sc}} = 24/2 = 12$ A and $R_{\text{Th}} = 60/12 = 5$ Ω. c) Short the 60 V source and open the 5 A source: $2 + 4 \parallel 12 = 2 + 3 = 5$ Ω, which agrees. d) $i = 60/(5 + 15) = 3$ A, and $p = 3^2 \times 15 = 135$ W.`
      },
      {
        id: "S7", title: "A Norton equivalent by source transformations", tags: [], lp: [1, 3],
        prompt: "",
        figure: figS7,
        parts: [
          { label: t`a) Use source transformations to find the Norton equivalent, then the Thévenin equivalent. $I_N$`, numeric: true, answer: 6, unit: "A" },
          { label: "a) The Norton source arrow points", options: ["toward a", "toward b"], answer: 0 },
          { label: t`a) $R_N = R_{\text{Th}}$`, numeric: true, answer: 7, unit: "Ω" },
          { label: t`a) $V_{\text{Th}}$`, numeric: true, answer: 42, unit: "V" },
          { label: "b) With a and b open, a current still flows around the two branches. Which source delivers power?", options: ["The 50 V source", "The 30 V source"], answer: 0 },
          { label: "b) How much power does it deliver?", numeric: true, answer: 40, unit: "W" },
          { label: "b) How much power does the other source absorb?", numeric: true, answer: 24, unit: "W" }
        ],
        explain: t`a) The 50 V source with the 10 Ω becomes 5 A in parallel with 10 Ω; the 30 V source with the 15 Ω becomes 2 A in parallel with 15 Ω. Both arrows point up, toward the + terminals, so they add: 7 A in parallel with $10 \parallel 15 = 6$ Ω, which transforms to 42 V in series with 6 Ω, + at the top. Add the 1 Ω: $V_{\text{Th}} = 42$ V and $R_{\text{Th}} = 7$ Ω. The Norton equivalent is $I_N = 42/7 = 6$ A, arrow toward a, in parallel with 7 Ω. b) With a and b open, $(50 - 30)/(10 + 15) = 0.8$ A circulates from the 50 V source into the 30 V source’s + terminal. The 50 V source delivers $50 \times 0.8 = 40$ W, the 30 V source absorbs $30 \times 0.8 = 24$ W, and the resistors absorb $6.4 + 9.6 = 16$ W.`
      },
      {
        id: "S8", title: "A Thévenin equivalent with a dependent source", tags: [], lp: [3, 4],
        prompt: t`As in Nilsson Example 4.16.`,
        figure: figS8,
        parts: [
          { label: t`a) Find $V_{\text{Th}}$.`, numeric: true, answer: 60, unit: "V" },
          { label: t`b) Find $i_{\text{sc}}$`, numeric: true, answer: 3, unit: "A" },
          { label: t`b) …and $R_{\text{Th}}$`, numeric: true, answer: 20, unit: "Ω" },
          { label: t`c) Check $R_{\text{Th}}$ with a test source: deactivate the 24 V source only, connect a 1 A current source from b to a (so 1 A enters the circuit at a) and find $v_{ab}$.`, numeric: true, answer: 20, unit: "V" }
        ],
        explain: t`a) With a and b open, the 10 Ω carries the dependent source’s $2i_x$ from a to node 1 (above the 20 Ω): $(v_1 - 24)/4 + v_1/20 - 2i_x = 0$ with $i_x = v_1/20$ gives $v_1 = 30$ V and $i_x = 1.5$ A, so $V_{\text{Th}} = 30 + 10 \times 3 = 60$ V. b) With a–b shorted, $v_1 = 15$ V and $i_x = 0.75$ A. The short carries $15/10 = 1.5$ A from the 10 Ω plus $2i_x = 1.5$ A from the dependent source: $i_{\text{sc}} = 3$ A, so $R_{\text{Th}} = 60/3 = 20$ Ω. c) With 1 A entering at a, $v_1 = 5$ V and $v_{ab} = 20$ V, so $R_{\text{Th}} = 20/1 = 20$ Ω, which agrees. The dependent source stays in the circuit throughout.`
      },
      {
        id: "S9", title: "Only a dependent source", tags: [], lp: [3, 4],
        prompt: t`As in Nilsson Example 4.19.`,
        figure: figS9,
        parts: [
          { label: t`a) Without calculating, what is $V_{\text{Th}}$? Why?`, numeric: true, answer: 0, unit: "V" },
          { label: t`b) Find $R_{\text{Th}}$ with a 1 A test current source from b to a. (The dependent source delivers $v_x/40$ amperes, with $v_x$ in volts.)`, numeric: true, answer: 20, unit: "Ω" },
          { label: "c) A classmate deactivates the dependent source and gets 15 Ω. What went wrong?", note: true }
        ],
        explain: t`a) $V_{\text{Th}} = 0$: the circuit has no independent source, so nothing drives a current with a and b open. b) With a test voltage $v_T$ and current $i_T$ entering at a: $i_T = v_T/30 + v_T/30 - v_x/40$, where $v_x = 2v_T/3$ (the 10 Ω and 20 Ω divide $v_T$). So $i_T = v_T/20$ and $R_{\text{Th}} = 20$ Ω: the 1 A test current gives $v_{ab} = 20$ V. c) A dependent source is never deactivated: its current depends on $v_x$, a voltage in the circuit. 15 Ω is $30 \parallel 30$, which ignores the dependent source.`
      },
      {
        id: "S10", title: "Maximum power transfer", tags: [], lp: [3, 5],
        prompt: t`As in Nilsson Example 4.21.`,
        figure: figS10,
        parts: [
          { label: t`a) Find the Thévenin equivalent seen by $R_L$: $V_{\text{Th}}$`, numeric: true, answer: 72, unit: "V" },
          { label: t`a) $R_{\text{Th}}$`, numeric: true, answer: 9, unit: "Ω" },
          { label: t`b) What value of $R_L$ receives maximum power?`, numeric: true, answer: 9, unit: "Ω" },
          { label: "b) How much power is it?", numeric: true, answer: 144, unit: "W" },
          { label: t`c) With $R_L$ at that value, what percentage of the power delivered by the 90 V source reaches $R_L$?`, numeric: true, answer: 32, unit: "%" }
        ],
        explain: t`a) With $R_L$ removed, the 1 Ω carries no current: $V_{\text{Th}} = 90 \times 40/50 = 72$ V and $R_{\text{Th}} = 10 \parallel 40 + 1 = 8 + 1 = 9$ Ω. b) $R_L = R_{\text{Th}} = 9$ Ω, and $p_{\max} = 72^2/(4 \times 9) = 144$ W. c) With 9 Ω, $v_{ab} = 36$ V and the load current is 4 A, so the node above the 40 Ω is at $36 + 4 \times 1 = 40$ V. The source current is $(90 - 40)/10 = 5$ A and the source delivers $90 \times 5 = 450$ W, so $144/450 = 32\%$ reaches $R_L$: less than half, because the real circuit also loses power in the 10 Ω and the 40 Ω.`
      },
      {
        id: "S11", title: "Spot the error", tags: ["Spot the error"], lp: [1, 3],
        prompt: t`The worked solution below finds the Thévenin equivalent. It contains the kind of polarity slip AI chat tools often make.`,
        figure: figS11,
        work: [
          "The 30 V source and 6 Ω become 5 A in parallel with 6 Ω, arrow pointing up, toward the + terminal.",
          "The 6 V source and 3 Ω, + at the bottom, become 2 A in parallel with 3 Ω, arrow pointing down.",
          t`Combine: $5 - 2 = 3$ A pointing up, in parallel with $6 \parallel 3 = 2$ Ω.`,
          "Transform back: 3 A pointing up with 2 Ω becomes 6 V in series with 2 Ω, + at the bottom.",
          t`Add the 4 Ω: $V_{\text{Th}} = -6$ V and $R_{\text{Th}} = 6$ Ω. Check: deactivating the sources gives $4 + 6 \parallel 3 = 6$ Ω, so the answer is right.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: LINES5, answer: 3 },
          { label: t`b) Correct it and find $V_{\text{Th}}$.`, numeric: true, answer: 6, unit: "V" },
          { label: t`c) Check $V_{\text{Th}}$ with one node equation: the node voltage above the 3 Ω, with b as the reference`, numeric: true, answer: 6, unit: "V" },
          { label: t`d) Line 5 calls itself a check. Why does it prove nothing about $V_{\text{Th}}$?`, note: true }
        ],
        explain: t`Lines 1 to 3 are right. Line 4 is the first wrong line: a current source pointing up pushes current out of the top, so the equivalent voltage source has + at the top, 6 V in series with 2 Ω. The 4 Ω carries no current with a and b open, so $V_{\text{Th}} = +6$ V and $R_{\text{Th}} = 6$ Ω. c) With b as the reference, the 6 V source puts −6 V below the 3 Ω, so $(v - 30)/6 + (v + 6)/3 = 0$, which gives $v = 6$ V $= V_{\text{Th}}$. d) $R_{\text{Th}}$ does not depend on the source values or polarities, so it cannot catch a polarity slip.`
      },
      {
        id: "S12", title: t`Spot the error in $R_{\text{Th}}$`, tags: ["Spot the error"], lp: [4, 6],
        prompt: t`The worked solution below contains an error.`,
        figure: figS12,
        work: [
          "Deactivate the sources: replace the 20 V source and the 2 A source with short circuits.",
          t`The short in place of the 2 A source also shorts the 12 Ω, so $R_{\text{Th}} = 5$ Ω.`,
          t`Open circuit: $(v - 20)/4 + v/12 - 2 = 0$ gives $v = 21$ V, so $V_{\text{Th}} = 21$ V.`,
          t`So $i_{\text{sc}} = V_{\text{Th}}/R_{\text{Th}} = 4.2$ A.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4"], answer: 0 },
          { label: t`b) Correct it and find $R_{\text{Th}}$.`, numeric: true, answer: 8, unit: "Ω" },
          { label: t`c) Short a to b in the original circuit and find $i_{\text{sc}}$ directly.`, numeric: true, answer: 2.625, unit: "A" },
          { label: t`c) Does it agree with $V_{\text{Th}}/R_{\text{Th}}$, using your corrected $R_{\text{Th}}$?`, options: ["Yes", "No"], answer: 0 }
        ],
        explain: t`Line 1 is the first wrong line: a current source is deactivated as an open circuit, not a short circuit. Then nothing shorts the 12 Ω, and $R_{\text{Th}} = 5 + 4 \parallel 12 = 5 + 3 = 8$ Ω. Line 3 is right: $V_{\text{Th}} = 21$ V. c) With a–b shorted, $(v - 20)/4 + v/12 - 2 + v/5 = 0$ gives $v = 13.125$ V, so $i_{\text{sc}} = 13.125/5 = 2.625$ A $= 21/8$, which agrees with the corrected $V_{\text{Th}}/R_{\text{Th}}$. Line 4’s 4.2 A does not, and this check exposes it.`
      },
      {
        id: "S13", title: "Maximum power with a dependent source", tags: [], lp: [3, 4, 5],
        prompt: "",
        figure: figS13,
        parts: [
          { label: t`a) Find $V_{\text{Th}}$. Hint: with a and b open, no current flows in the 6 Ω or in the dependent source.`, numeric: true, answer: 90, unit: "V" },
          { label: t`b) Find $R_{\text{Th}}$ with a test source.`, numeric: true, answer: 10, unit: "Ω" },
          { label: "c) What load receives maximum power?", numeric: true, answer: 10, unit: "Ω" },
          { label: "c) How much power?", numeric: true, answer: 202.5, unit: "W" }
        ],
        explain: t`a) With a and b open, $i_1 = 100/(10 + 40) = 2$ A and the 40 Ω has $v_1 = 80$ V across it. The dependent source adds $5i_1 = 10$ V, + on the right: $V_{\text{Th}} = 80 + 5 \times 2 = 90$ V. b) Deactivate the 100 V source and push a 1 A test current into a. It flows through the 6 Ω and the dependent source into node 1, so $v_1 = 1 \times (10 \parallel 40) = 8$ V and $i_1 = -8/10 = -0.8$ A. Then $v_{ab} = 6 - 4 + 8 = 10$ V, so $R_{\text{Th}} = 10$ Ω. c) $R_L = 10$ Ω receives $p_{\max} = 90^2/40 = 202.5$ W.`
      },
      {
        id: "S14", title: "Work backwards", tags: [], lp: [3, 5],
        prompt: t`A circuit is tested with two loads. With 10 Ω across its terminals, the load voltage is 20 V. With 30 Ω, it is 30 V.`,
        parts: [
          { label: t`a) Find $V_{\text{Th}}$`, numeric: true, answer: 40, unit: "V" },
          { label: t`a) …and $R_{\text{Th}}$`, numeric: true, answer: 10, unit: "Ω" },
          { label: "b) What load resistance would receive maximum power?", numeric: true, answer: 10, unit: "Ω" },
          { label: "b) How much?", numeric: true, answer: 40, unit: "W" }
        ],
        explain: t`Each load forms a voltage divider with $R_{\text{Th}}$: $20 = V_{\text{Th}} \times 10/(10 + R_{\text{Th}})$ and $30 = V_{\text{Th}} \times 30/(30 + R_{\text{Th}})$. Solving gives $R_{\text{Th}} = 10$ Ω and $V_{\text{Th}} = 40$ V. b) A 10 Ω load receives $40^2/40 = 40$ W.`
      },
      {
        id: "S15", title: "Your generator subscription", tags: ["Predict first"], lp: [3, 5],
        prompt: t`With nothing switched on, the socket reads 230 V. With a heater on, it draws 10 A and the socket reads 210 V. Model the generator and its cables as a Thévenin equivalent.`,
        parts: [
          { label: t`a) Find $V_{\text{Th}}$`, numeric: true, answer: 230, unit: "V" },
          { label: t`a) $R_{\text{Th}}$`, numeric: true, answer: 2, unit: "Ω" },
          { label: "a) The heater’s resistance", numeric: true, answer: 21, unit: "Ω" },
          { label: "b) Predict first: with two identical heaters on, will the socket read about 210 V, 193 V or 170 V?", options: ["About 210 V", "About 193 V", "About 170 V"], answer: 1 },
          { label: "b) Then calculate it.", numeric: true, answer: 193.2, unit: "V" },
          { label: "b) The total heater power", numeric: true, answer: 3555, unit: "W" },
          { label: "b) Is it twice the power of one heater?", options: ["Yes", "No"], answer: 1 },
          { label: t`c) Why does the generator owner not match the load to $R_{\text{Th}}$ for maximum power transfer?`, note: true }
        ],
        explain: t`a) The open-circuit reading is $V_{\text{Th}} = 230$ V. The 20 V drop at 10 A gives $R_{\text{Th}} = 20/10 = 2$ Ω, and the heater is $210/10 = 21$ Ω. b) Two heaters in parallel make 10.5 Ω: $v = 230 \times 10.5/12.5 = 193.2$ V. The total heater power is $193.2^2/10.5 \approx 3555$ W, not $2 \times 2100 = 4200$ W, because the socket voltage has dropped. c) At $R_L = R_{\text{Th}}$, half the power would be lost in the generator and cables, and the socket would read only 115 V. Supply systems keep $R_L$ much larger than $R_{\text{Th}}$.`
      },
      {
        id: "S16", title: "Check an equivalent without solving again", tags: [], lp: [6],
        prompt: t`Two classmates report the Thévenin equivalent. Student 1: $V_{\text{Th}} = 24$ V, $R_{\text{Th}} = 6$ Ω. Student 2: $V_{\text{Th}} = 24$ V, $R_{\text{Th}} = 4$ Ω. Short a to b, find $i_{\text{sc}}$, and use $i_{\text{sc}} = V_{\text{Th}}/R_{\text{Th}}$ to decide which student is right.`,
        figure: figS16,
        parts: [
          { label: t`$i_{\text{sc}}$`, numeric: true, answer: 4, unit: "A" },
          { label: "Which student is right?", options: ["Student 1", "Student 2"], answer: 0 }
        ],
        explain: t`With a–b shorted, the 2 Ω is in parallel with the 12 Ω: $2 \parallel 12 = 12/7$ Ω. The source current is $36/(6 + 12/7) \approx 4.67$ A, and the 2 Ω takes $4.67 \times 12/14 = 4$ A, so $i_{\text{sc}} = 4$ A. Student 1: $24/6 = 4$ A, which matches. Student 2: $24/4 = 6$ A, which fails: the 2 Ω was forgotten.`
      }
    ]
  };
})(window.EENG);
