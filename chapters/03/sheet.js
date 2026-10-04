// Chapter 3 practice sheet (Lane B: open, AI allowed). Interactive version of "Practice sheet.pdf".
// Question fields:
//   id, title, tags (labels shown), lp (checklist items it practises), prompt, optional figure / table / work / hint
//   parts: every part must be right for the question to count as correct
//     { label, options, answer (index from 0), roman: true for i) ii) … }
//     { label, numeric: true, answer, unit, rel (relative tolerance, default 1%), abs }
//     { label, note: true, text } for a sub-question with nothing to check (answer in explain)
//   explain: shown after the student checks
(function (E) {
  var t = String.raw;

  // ---- Circuit figure helpers. Lines and text use currentColor; current arrows use the link blue, as in the PDF. ----
  function r1(v) { return Math.round(v * 10) / 10; }
  function P(a) { return a.map(function (p) { return r1(p[0]) + "," + r1(p[1]); }).join(" "); }
  function wire() { // wire(x1, y1, x2, y2, ...)
    var a = [];
    for (var i = 0; i < arguments.length; i += 2) a.push([arguments[i], arguments[i + 1]]);
    return '<polyline points="' + P(a) + '"/>';
  }
  // Resistor from (x1, y1) to (x2, y2): straight leads and a zigzag of length len centred between them.
  function res(x1, y1, x2, y2, len, amp) {
    len = len || 30; amp = amp || 6;
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, h = len / 2, a = [[x1, y1], [mx - ux * h, my - uy * h]];
    for (var k = 0; k < 6; k++) {
      var s = -h + (k + 0.5) * len / 6, n = k % 2 ? -amp : amp;
      a.push([mx + ux * s - uy * n, my + uy * s + ux * n]);
    }
    a.push([mx + ux * h, my + uy * h], [x2, y2]);
    return '<polyline points="' + P(a) + '"/>';
  }
  // Point p moved a distance d towards q (to stop a wire at the edge of a terminal circle).
  function toward(p, q, d) {
    var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy);
    return [p[0] + dx * d / L, p[1] + dy * d / L];
  }
  function dot(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="currentColor"/>'; }
  function term(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4" stroke-width="2"/>'; }
  // Voltage source: circle with + (top) and − (bottom) inside.
  function vsrc(cx, cy) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="16"/><g stroke-width="2">' +
      '<line x1="' + (cx - 4.5) + '" y1="' + (cy - 7) + '" x2="' + (cx + 4.5) + '" y2="' + (cy - 7) + '"/>' +
      '<line x1="' + cx + '" y1="' + (cy - 11.5) + '" x2="' + cx + '" y2="' + (cy - 2.5) + '"/>' +
      '<line x1="' + (cx - 4.5) + '" y1="' + (cy + 7) + '" x2="' + (cx + 4.5) + '" y2="' + (cy + 7) + '"/></g>';
  }
  // Current source: circle with an arrow pointing up.
  function isrc(cx, cy) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="16"/>' +
      '<line x1="' + cx + '" y1="' + (cy + 10) + '" x2="' + cx + '" y2="' + (cy - 3) + '" stroke-width="2"/>' +
      '<polygon points="' + P([[cx - 5, cy - 3], [cx + 5, cy - 3], [cx, cy - 11]]) + '" fill="currentColor" stroke="none"/>';
  }
  // Current arrow: shaft from (x1, y1), head at (x2, y2).
  function iarrow(x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    var bx = x2 - ux * 10, by = y2 - uy * 10;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + r1(bx) + '" y2="' + r1(by) + '" stroke="currentColor" stroke-width="2.5"/>' +
      '<polygon points="' + P([[x2, y2], [bx - uy * 5.5, by + ux * 5.5], [bx + uy * 5.5, by - ux * 5.5]]) + '" fill="currentColor"/>';
  }
  function tx(x, y, s, anchor, extra) {
    return '<text x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + (extra || "") + ">" + s + "</text>";
  }
  // Italic symbol with an optional subscript (letters italic, digits upright).
  function sym(base, sub) {
    return '<tspan font-style="italic">' + base + "</tspan>" +
      (sub ? '<tspan font-size="72%" dy="4"' + (/[a-z]/i.test(sub) ? ' font-style="italic"' : "") + ">" + sub + "</tspan>" : "");
  }
  function plus(x, y) { return tx(x, y, "+", "middle", ' font-size="22" font-weight="700"'); }
  function minus(x, y) { return tx(x, y, "−", "middle", ' font-size="22" font-weight="700"'); }
  function svg(w, h, label, body) {
    return '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" role="img" aria-label="' + label + '">' + body + "</svg>";
  }
  var G = '<g stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round">';
  var T = '<g fill="currentColor" font-size="18">';
  var BLUE = '<g style="color:var(--link)" fill="currentColor" font-size="18">';

  // S1: series or not.
  var figS1 = svg(430, 212,
    "Circuit. Voltage source v_s on the left, + at the top. Along the top wire from the source: R1, a node, R3, R4, then the top right corner. R2 runs from the node after R1 down to the bottom wire. R5 runs down the right side to the bottom wire, which joins the source, R2 and R5.",
    G + wire(60, 104, 60, 50) + res(60, 50, 180, 50) + res(180, 50, 290, 50) + res(290, 50, 400, 50) + res(400, 50, 400, 190) +
    wire(400, 190, 60, 190, 60, 136) + res(180, 50, 180, 190) + vsrc(60, 120) + "</g>" +
    dot(180, 50) + dot(180, 190) +
    T + tx(120, 30, sym("R", "1"), "middle") + tx(235, 30, sym("R", "3"), "middle") + tx(345, 30, sym("R", "4"), "middle") +
    tx(162, 127, sym("R", "2"), "end") + tx(382, 127, sym("R", "5"), "end") + tx(36, 127, sym("v", "s"), "end") + "</g>");

  // S2: ladder.
  var figS2 = svg(430, 235,
    "Ladder network. From terminal a: 2 ohms on the top wire to a node, then 4 ohms to a second node, then the top wire continues to the right corner. 24 ohms runs down from the first node, 6 ohms from the second node, and 12 ohms down the right side. From terminal b: 3 ohms on the bottom wire to the bottom of the 24 ohm resistor; the bottom wire joins the 24, 6 and 12 ohm resistors.",
    G + term(40, 60) + res(44, 60, 165, 60) + res(165, 60, 300, 60) + wire(300, 60, 410, 60) +
    res(165, 60, 165, 195) + res(300, 60, 300, 195) + res(410, 60, 410, 195) +
    term(40, 195) + res(44, 195, 165, 195) + wire(165, 195, 410, 195) + "</g>" +
    dot(165, 60) + dot(300, 60) + dot(165, 195) + dot(300, 195) +
    T + tx(104, 40, "2 Ω", "middle") + tx(232, 40, "4 Ω", "middle") + tx(152, 134, "24 Ω", "end") + tx(287, 134, "6 Ω", "end") +
    tx(397, 134, "12 Ω", "end") + tx(104, 226, "3 Ω", "middle") +
    tx(28, 66, sym("a"), "end", ' font-size="20"') + tx(28, 201, sym("b"), "end", ' font-size="20"') + "</g>");

  // S3: a wire across a resistor.
  var figS3 = svg(435, 225,
    "Circuit. From terminal a: 10 ohms on the top wire to a node, then 5 ohms to a second node. 20 ohms runs down from the first node and 30 ohms from the second node to the bottom wire. From the second node the top wire continues to the right and straight down to the bottom wire, a plain wire across the 30 ohm resistor. Terminal b connects to the bottom wire with no resistor.",
    G + term(40, 60) + res(44, 60, 170, 60) + res(170, 60, 330, 60) + wire(330, 60, 415, 60, 415, 205) +
    res(170, 60, 170, 205) + res(330, 60, 330, 205) + term(40, 205) + wire(44, 205, 415, 205) + "</g>" +
    dot(170, 60) + dot(330, 60) + dot(170, 205) + dot(330, 205) +
    T + tx(107, 40, "10 Ω", "middle") + tx(250, 40, "5 Ω", "middle") + tx(157, 139, "20 Ω", "end") + tx(317, 139, "30 Ω", "end") +
    tx(28, 66, sym("a"), "end", ' font-size="20"') + tx(28, 211, sym("b"), "end", ' font-size="20"') + "</g>");

  // S4: loading a divider.
  var figS4 = svg(420, 265,
    "Voltage divider. 18 V source on the left, + at the top. 12 kilohms from the top wire down to the middle node, 6 kilohms from the middle node to the bottom wire. The output v_o is across the 6 kilohm resistor, + at the top, minus at the bottom. A load R_L is connected from the middle node to the bottom wire, on the right.",
    G + wire(70, 124, 70, 30, 230, 30) + res(230, 30, 230, 140) + res(230, 140, 230, 250) + wire(230, 140, 370, 140) +
    res(370, 140, 370, 250) + wire(70, 156, 70, 250, 370, 250) + vsrc(70, 140) + "</g>" +
    dot(230, 140) + dot(230, 250) +
    T + tx(212, 91, "12 kΩ", "end") + tx(212, 201, "6 kΩ", "end") + tx(46, 146, "18 V", "end") + tx(386, 201, sym("R", "L")) +
    plus(300, 180) + tx(300, 205, sym("v", "o"), "middle") + minus(300, 238) + "</g>");

  // S5: current division.
  var figS5 = svg(500, 165,
    "30 mA current source on the left, arrow pointing up, in parallel with 6 kilohms, 3 kilohms and 2 kilohms, left to right.",
    G + wire(100, 69, 100, 25, 430, 25) + wire(100, 101, 100, 145, 430, 145) + isrc(100, 85) +
    res(210, 25, 210, 145) + res(320, 25, 320, 145) + res(430, 25, 430, 145) + "</g>" +
    dot(210, 25) + dot(320, 25) + dot(210, 145) + dot(320, 145) +
    T + tx(76, 91, "30 mA", "end") + tx(224, 91, "6 kΩ") + tx(334, 91, "3 kΩ") + tx(444, 91, "2 kΩ") + "</g>");

  // S7 and S9: source, series resistor, shunt resistor, series resistor, load resistor.
  function twoLoop(v, ra, rb, rc, rd) {
    return svg(470, 222,
      "Circuit. " + v + " source on the left, + at the top. Top wire: " + ra + " to a node, then " + rc + " to the top right corner. " +
      rb + " runs from the node down to the bottom wire. " + rd + " runs down the right side; v_o is across it, + at the top. " +
      "Current arrow i_s under the " + ra + " resistor points right; current arrow i_2 under the " + rc + " resistor points right.",
      G + wire(80, 109, 80, 45) + res(80, 45, 220, 45) + res(220, 45, 395, 45) + res(395, 45, 395, 205) +
      wire(395, 205, 80, 205, 80, 141) + res(220, 45, 220, 205) + vsrc(80, 125) + "</g>" +
      dot(220, 45) + dot(220, 205) +
      BLUE + iarrow(128, 70, 172, 70) + iarrow(285, 70, 329, 70) +
      tx(150, 96, sym("i", "s"), "middle") + tx(307, 96, sym("i", "2"), "middle") + "</g>" +
      T + tx(150, 27, ra.replace(" ohms", " Ω"), "middle") + tx(307, 27, rc.replace(" ohms", " Ω"), "middle") +
      tx(205, 132, rb.replace(" ohms", " Ω"), "end") + tx(380, 132, rd.replace(" ohms", " Ω"), "end") + tx(56, 131, v, "end") +
      plus(440, 100) + tx(440, 133, sym("v", "o"), "middle") + minus(440, 168) + "</g>");
  }

  // S8: two divisions in a row.
  var figS8 = svg(575, 225,
    "9 A current source on the left, arrow pointing up. Four branches in parallel between the top and bottom wires: 10 ohms in series with 20 ohms; 60 ohms; 20 ohms, with current arrow i_o pointing down beside it; and on the right a branch of 12 ohms on the top wire, 3 ohms down the right side and 5 ohms on the bottom wire. v_o is across the 5 ohm resistor, minus on the left and + on the right.",
    G + wire(70, 99, 70, 45, 410, 45) + res(410, 45, 525, 45) + res(525, 45, 525, 185) + res(525, 185, 410, 185) +
    wire(410, 185, 70, 185, 70, 131) + isrc(70, 115) + res(150, 45, 150, 115) + res(150, 115, 150, 185) +
    res(258, 45, 258, 185) + res(358, 45, 358, 185) + "</g>" +
    dot(150, 45) + dot(258, 45) + dot(358, 45) + dot(150, 185) + dot(258, 185) + dot(358, 185) +
    BLUE + iarrow(373, 100, 373, 132) + tx(381, 122, sym("i", "o")) + "</g>" +
    T + tx(46, 121, "9 A", "end") + tx(164, 86, "10 Ω") + tx(164, 156, "20 Ω") + tx(244, 121, "60 Ω", "end") + tx(344, 121, "20 Ω", "end") +
    tx(467, 27, "12 Ω", "middle") + tx(539, 121, "3 Ω") + tx(467, 167, "5 Ω", "middle") +
    minus(441, 216) + tx(467, 214, sym("v", "o"), "middle") + plus(495, 216) + "</g>");

  // S10: delta.
  var A = [60, 80], B = [320, 80], C = [190, 305];
  function rd(p, q) { var s = toward(p, q, 4), e = toward(q, p, 4); return res(s[0], s[1], e[0], e[1], 44, 9); }
  var figS10 = svg(380, 325,
    "Delta network with terminals a (top left), b (top right) and c (bottom). 6 ohms between a and b, 18 ohms between a and c, 12 ohms between b and c.",
    G + rd(A, B) + rd(A, C) + rd(B, C) + term(A[0], A[1]) + term(B[0], B[1]) + term(C[0], C[1]) + "</g>" +
    T + tx(190, 58, "6 Ω", "middle") + tx(100, 200, "18 Ω", "end") + tx(280, 200, "12 Ω") +
    tx(46, 86, sym("a"), "end", ' font-size="20"') + tx(334, 86, sym("b"), "start", ' font-size="20"') + tx(178, 312, sym("c"), "end", ' font-size="20"') + "</g>");

  // S11: wye.
  var Ya = [55, 35], Yb = [315, 35], Yn = [185, 130], Yc = [185, 262];
  function ry(p, q) { var s = toward(p, q, 4); return res(s[0], s[1], q[0], q[1], 40, 9); }
  var figS11 = svg(360, 280,
    "Wye network with terminals a (top left), b (top right) and c (bottom), joined at a centre node. 10 ohms from a to the centre, 20 ohms from b to the centre, 40 ohms from the centre down to c.",
    G + ry(Ya, Yn) + ry(Yb, Yn) + ry(Yc, Yn) + term(Ya[0], Ya[1]) + term(Yb[0], Yb[1]) + term(Yc[0], Yc[1]) + "</g>" + dot(Yn[0], Yn[1]) +
    T + tx(78, 116, "10 Ω", "middle") + tx(297, 116, "20 Ω", "middle") + tx(200, 202, "40 Ω") +
    tx(43, 41, sym("a"), "end", ' font-size="20"') + tx(327, 41, sym("b"), "start", ' font-size="20"') + tx(173, 268, sym("c"), "end", ' font-size="20"') + "</g>");

  // S12: bridge.
  var figS12 = svg(450, 275,
    "Bridge circuit. 100 V source on the left, + at the top. 2 ohms on the top wire, with current arrow i_s under it pointing right, to the top node. From the top node, 20 ohms down to the left node and 30 ohms down to the right node. 50 ohms between the left and right nodes, with current arrow i_m under it pointing from left to right. 14 ohms from the left node and 9 ohms from the right node down to the bottom wire, which returns to the source.",
    G + wire(90, 134, 90, 40) + res(90, 40, 180, 40) + wire(180, 40, 385, 40) + res(235, 40, 235, 150) + res(385, 40, 385, 150) +
    res(235, 150, 385, 150) + res(235, 150, 235, 260) + res(385, 150, 385, 260) + wire(385, 260, 90, 260, 90, 166) + vsrc(90, 150) + "</g>" +
    dot(235, 40) + dot(235, 150) + dot(385, 150) +
    BLUE + iarrow(118, 62, 152, 62) + tx(135, 87, sym("i", "s"), "middle") + iarrow(293, 170, 327, 170) + tx(310, 195, sym("i", "m"), "middle") + "</g>" +
    T + tx(135, 24, "2 Ω", "middle") + tx(221, 101, "20 Ω", "end") + tx(399, 101, "30 Ω") + tx(310, 133, "50 Ω", "middle") +
    tx(221, 211, "14 Ω", "end") + tx(399, 211, "9 Ω") + tx(66, 156, "100 V", "end") + "</g>");

  // S13: balanced bridge.
  var figS13 = svg(410, 285,
    "Bridge between terminals a and b. The top wire from a joins 10 ohms (left) and 30 ohms (right). 10 ohms runs down to the left middle node and 30 ohms to the right middle node; 47 ohms joins the two middle nodes. 20 ohms runs from the left middle node and 60 ohms from the right middle node down to the bottom wire, which goes to b.",
    G + term(40, 35) + wire(44, 35, 345, 35) + res(190, 35, 190, 150) + res(345, 35, 345, 150) + res(190, 150, 345, 150) +
    res(190, 150, 190, 265) + res(345, 150, 345, 265) + term(40, 265) + wire(44, 265, 345, 265) + "</g>" +
    dot(190, 35) + dot(190, 150) + dot(345, 150) +
    T + tx(176, 98, "10 Ω", "end") + tx(359, 98, "30 Ω") + tx(267, 133, "47 Ω", "middle") + tx(176, 213, "20 Ω", "end") + tx(359, 213, "60 Ω") +
    tx(28, 41, sym("a"), "end", ' font-size="20"') + tx(28, 271, sym("b"), "end", ' font-size="20"') + "</g>");

  // S15: generator cable.
  var figS15 = svg(475, 305,
    "Generator, a 220 V source with + at the top, feeds the home load, 21.5 ohms, through a cable with 0.25 ohms in the top conductor and 0.25 ohms in the bottom conductor. v_L is across the home load, + at the top.",
    G + wire(110, 144, 110, 80, 150, 80) + res(150, 80, 240, 80) + wire(240, 80, 395, 80) + res(395, 80, 395, 240) +
    wire(395, 240, 240, 240) + res(240, 240, 150, 240) + wire(150, 240, 110, 240, 110, 176) + vsrc(110, 160) + "</g>" +
    T + tx(195, 30, "cable", "middle") + tx(195, 60, "0.25 Ω", "middle") + tx(195, 272, "0.25 Ω", "middle") +
    tx(110, 298, "generator", "middle") + tx(395, 298, "home load", "middle") + tx(86, 166, "220 V", "end") + tx(411, 166, "21.5 Ω") +
    plus(345, 124) + tx(345, 167, sym("v", "L"), "middle") + minus(345, 206) + "</g>");

  E.sheets[3] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. The device-free quiz at the start of week 5, session 1 (Tue 3 Nov), is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Both must be right.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Notation:</strong> $a \parallel b = ab/(a + b)$. Check every answer: resistors in parallel must have the same voltage, and the powers must add to zero.`
    ],

    questions: [
      {
        id: "S1", title: "Series or not?", tags: ["Two-tier"], lp: [1],
        prompt: t`Which pair of resistors is in series?`,
        figure: figS1,
        parts: [
          { label: "Answer", options: [t`$R_1$ and $R_2$`, t`$R_3$ and $R_4$`, t`$R_2$ and $R_5$`, t`$R_1$ and $R_3$`], answer: 1 },
          { label: "Reason", roman: true, options: [
            "Only those two elements meet at the node between them, so they carry the same current.",
            "Resistors drawn one after another along a wire are always in series.",
            "They connect the same two nodes.",
            "They have the same voltage across them."
          ], answer: 0 },
          { label: t`Follow-up: is $R_2$ in parallel with $R_5$? Explain in one sentence.`, options: ["Yes", "No"], answer: 1 }
        ],
        explain: t`$R_3$ and $R_4$ are the only elements at the node between them, so they must carry the same current: they are in series. $R_1$ and $R_2$ (a) and $R_1$ and $R_3$ (d) meet at a node with three branches, so their currents can differ. Reason (iii) is the definition of parallel, not series. Follow-up: no. $R_2$ and $R_5$ share only the bottom node, so $R_2$ is in parallel with the whole $R_3 + R_4 + R_5$ path, not with $R_5$ alone.`
      },
      {
        id: "S2", title: "Equivalent resistance of a ladder", tags: [], lp: [1, 3],
        prompt: t`Find $R_{ab}$.`,
        figure: figS2,
        parts: [{ label: "Answer", options: ["11 Ω", "8 Ω", "51 Ω", "16.5 Ω"], answer: 0 }],
        explain: t`Start at the end farthest from a and b: $6 \parallel 12 = 4$ Ω; in series with the 4 Ω, $4 + 4 = 8$ Ω; in parallel with the 24 Ω, $24 \parallel 8 = 6$ Ω; then $R_{ab} = 2 + 6 + 3 = 11$ Ω. (b) leaves out the 3 Ω in the bottom wire, which is still in series with everything else; (c) adds everything; (d) treats 6 Ω and 12 Ω as series.`
      },
      {
        id: "S3", title: "A wire across a resistor", tags: ["Two-tier"], lp: [2, 3],
        prompt: t`Find $R_{ab}$.`,
        figure: figS3,
        parts: [
          { label: "Answer", options: ["14 Ω", "22.7 Ω", "10 Ω", "45 Ω"], answer: 0 },
          { label: "Reason", roman: true, options: [
            "The wire puts 0 V across the 30 Ω resistor, so it carries no current and the 5 Ω resistor connects straight to b.",
            "The wire and the 30 Ω resistor are in series, so the 30 Ω stays in the circuit.",
            "A wire carries no current, so it can be ignored.",
            "The current splits equally between the wire and the 30 Ω resistor."
          ], answer: 0 }
        ],
        explain: t`The wire shorts the 30 Ω: it puts 0 V across it, so the 30 Ω carries no current and the 5 Ω goes straight to b. Then $20 \parallel 5 = 4$ Ω and $R_{ab} = 10 + 4 = 14$ Ω. (b) ignores the wire: $10 + 20 \parallel 35 = 22.7$ Ω. (c) shorts too much, leaving only the 10 Ω. (d) adds $10 + 5 + 30$. Reason (iii) has it backwards: the wire carries the current, and the shorted resistor carries none.`
      },
      {
        id: "S4", title: "Loading a voltage divider", tags: ["Predict first"], lp: [4, 5],
        prompt: "",
        figure: figS4,
        parts: [
          { label: t`a) With $R_L$ removed, find $v_o$.`, numeric: true, answer: 6, unit: "V", rel: 0.002 },
          { label: t`b) Predict first: when $R_L = 6$ kΩ is connected, does $v_o$ rise, fall or stay the same?`, options: ["Rise", "Fall", "Stay the same"], answer: 1 },
          { label: t`b) Then find $v_o$ with $R_L = 6$ kΩ.`, numeric: true, answer: 3.6, unit: "V" },
          { label: t`c) Repeat b) for $R_L = 600$ kΩ: find $v_o$.`, numeric: true, answer: 5.96, unit: "V", rel: 0.002 },
          { label: t`c) What rule about $R_L$ and the 6 kΩ resistor does this suggest?`, options: [
            t`$R_L$ should be much smaller than 6 kΩ.`,
            t`$R_L$ should equal 6 kΩ.`,
            t`$R_L$ should be much larger than 6 kΩ.`
          ], answer: 2 }
        ],
        explain: t`a) $v_o = 18 \times 6/18 = 6$ V. b) It falls: the load is in parallel with the 6 kΩ, so the bottom of the divider becomes $6 \parallel 6 = 3$ kΩ and $v_o = 18 \times 3/15 = 3.6$ V. c) $6 \parallel 600 = 5.94$ kΩ, so $v_o = 5.96$ V, almost the unloaded 6 V. Rule: $R_L \gg R_2$. The load must be much larger than the resistor it sits across (Nilsson Example 3.4).`
      },
      {
        id: "S5", title: "Current division", tags: ["Two-tier"], lp: [4],
        prompt: t`The current in the 2 kΩ resistor is:`,
        figure: figS5,
        parts: [
          { label: "Answer", options: ["15 mA", "5 mA", "10 mA", "30 mA"], answer: 0 },
          { label: "Reason", roman: true, options: [
            t`$i_j = (R_{eq}/R_j)\,i$ with $R_{eq} = 1$ kΩ, so the smallest resistance takes the largest current.`,
            t`$i_j = (R_j/R_{eq})\,i$, so the largest resistance takes the largest current.`,
            "The current splits equally between the three resistors.",
            "All the current takes the path of least resistance."
          ], answer: 0 },
          { label: "Follow-up: the current in the 3 kΩ resistor", numeric: true, answer: 10, unit: "mA" },
          { label: "Follow-up: the current in the 6 kΩ resistor", numeric: true, answer: 5, unit: "mA" }
        ],
        explain: t`$R_{eq} = 6 \parallel 3 \parallel 2 = 1$ kΩ, so every resistor has $v = 30$ mA × 1 kΩ $= 30$ V across it: 15 mA in the 2 kΩ, 10 mA in the 3 kΩ and 5 mA in the 6 kΩ. KCL checks: $5 + 10 + 15 = 30$ mA. (b) is the 6 kΩ current; (c) follows reason (iii).`
      },
      {
        id: "S6", title: "Design a voltage divider", tags: [], lp: [4, 5],
        prompt: t`You need 3 V from a 12 V supply, and the divider may draw at most 1 mA from it.`,
        parts: [
          { label: t`a) What is the smallest total resistance $R_1 + R_2$ allowed?`, numeric: true, answer: 12, unit: "kΩ" },
          { label: t`b) Choose $R_1$ (top) and $R_2$ (bottom). With the smallest total from a), $R_1$ =`, numeric: true, answer: 9, unit: "kΩ" },
          { label: t`b) … and $R_2$ =`, numeric: true, answer: 3, unit: "kΩ" },
          { label: t`c) The 3 V output now feeds a 3 kΩ load. Find the new output voltage (with $R_1 = 9$ kΩ and $R_2 = 3$ kΩ).`, numeric: true, answer: 1.714, unit: "V" },
          { label: "c) Is your design still good?", options: ["Yes", "No"], answer: 1 }
        ],
        explain: t`a) $12$ V / 1 mA $= 12$ kΩ. b) $R_2/(R_1 + R_2) = 3/12 = 1/4$, so $R_1 = 9$ kΩ and $R_2 = 3$ kΩ (or larger values in a 3 : 1 ratio, which draw less current). c) The answer depends on b). For 9 kΩ and 3 kΩ: $3 \parallel 3 = 1.5$ kΩ, so $v_o = 12 \times 1.5/10.5 = 1.71$ V; for 30 kΩ and 10 kΩ it is 0.86 V. So no: the load must be much larger than $R_2$, so $R_2$ must be made much smaller, which needs more current.`
      },
      {
        id: "S7", title: "Series-parallel reduction, then division", tags: [], lp: [3, 4],
        prompt: "",
        figure: twoLoop("60 V", "6 ohms", "12 ohms", "2 ohms", "4 ohms"),
        parts: [
          { label: "a) Find the equivalent resistance seen by the source…", numeric: true, answer: 10, unit: "Ω" },
          { label: t`a) … and $i_s$.`, numeric: true, answer: 6, unit: "A" },
          { label: t`b) Use current division to find $i_2$…`, numeric: true, answer: 4, unit: "A" },
          { label: t`b) … then voltage division to find $v_o$.`, numeric: true, answer: 16, unit: "V" },
          { label: "c) Find the power of every element and check the power balance. Power delivered by the 60 V source:", numeric: true, answer: 360, unit: "W" },
          { label: "c) Power absorbed by the 6 Ω resistor:", numeric: true, answer: 216, unit: "W" },
          { label: "c) Power absorbed by the 12 Ω resistor:", numeric: true, answer: 48, unit: "W" },
          { label: "c) Power absorbed by the 2 Ω resistor:", numeric: true, answer: 32, unit: "W" },
          { label: "c) Power absorbed by the 4 Ω resistor:", numeric: true, answer: 64, unit: "W" }
        ],
        explain: t`a) $12 \parallel (2 + 4) = 4$ Ω, so $R_{eq} = 6 + 4 = 10$ Ω and $i_s = 60/10 = 6$ A. b) $i_2 = (12/18)(6) = 4$ A. The parallel part has $4 \times 6 = 24$ V across it, so $v_o = (4/6)(24) = 16$ V. c) The source delivers $60 \times 6 = 360$ W. The resistors absorb $216 + 48 + 32 + 64 = 360$ W (6 Ω, 12 Ω, 2 Ω and 4 Ω), so the powers balance.`
      },
      {
        id: "S8", title: "Two divisions in a row", tags: [], lp: [3, 4],
        prompt: t`As in Nilsson Example 3.7.`,
        figure: figS8,
        parts: [
          { label: "a) Find the equivalent resistance seen by the source.", numeric: true, answer: 6.667, unit: "Ω" },
          { label: t`b) Use current division to find $i_o$.`, numeric: true, answer: 3, unit: "A" },
          { label: t`c) Use voltage division to find $v_o$.`, numeric: true, answer: 15, unit: "V" }
        ],
        explain: t`a) The four branches are in parallel: $10 + 20 = 30$ Ω, 60 Ω, 20 Ω, and $12 + 3 + 5 = 20$ Ω. $30 \parallel 60 \parallel 20 \parallel 20 = 60/9 = 6.67$ Ω, so the source voltage is $v = 9 \times 6.67 = 60$ V. b) $i_o = (6.67/20)(9) = 3$ A. c) The $12 + 3 + 5 = 20$ Ω branch has 60 V across it, so $v_o = (5/20)(60) = 15$ V.`
      },
      {
        id: "S9", title: "Spot the error", tags: ["Spot the error"], lp: [4],
        prompt: t`The worked solution below finds $v_o$. It contains the kind of slip AI chat tools often make with the divider rules.`,
        figure: twoLoop("72 V", "4 ohms", "6 ohms", "9 ohms", "3 ohms"),
        work: [
          "The 9 Ω and 3 Ω resistors are in series: 12 Ω.",
          t`$6 \parallel 12 = 72/18 = 4$ Ω.`,
          t`$R_{eq} = 4 + 4 = 8$ Ω.`,
          t`$i_s = 72/8 = 9$ A.`,
          t`Current division: $i_2 = (12/(6 + 12))(9) = 6$ A.`,
          t`$v_o = 3i_2 = 18$ V.`,
          t`KCL at the top node: the 6 Ω resistor carries $9 - 6 = 3$ A, so the currents balance and the answer is correct.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7"], answer: 4 },
          { label: t`b) Correct it: the correct $i_2$`, numeric: true, answer: 3, unit: "A" },
          { label: t`c) Finish the solution: the correct $v_o$`, numeric: true, answer: 9, unit: "V" },
          { label: "c) Check it: the voltage across the 6 Ω resistor", numeric: true, answer: 36, unit: "V" },
          { label: "d) Line 7 says the currents balance. Why is that not a check?", note: true }
        ],
        explain: t`Line 5 puts the wrong resistance on top. In current division each branch gets the <em>other</em> branch’s resistance over the sum: $i_2 = (6/(6 + 12))(9) = 3$ A. Then $v_o = 3 \times 3 = 9$ V. Check: the 6 Ω carries 6 A, so it has 36 V; the right branch carries 3 A through 12 Ω, also 36 V. Powers: $648 = 324 + 216 + 81 + 27$ W. d) Line 7 found the 3 A by subtraction, so KCL holds whatever $i_2$ is. With the wrong $i_2$ the parallel branches would have 18 V and 72 V, which is impossible.`
      },
      {
        id: "S10", title: "Delta to wye", tags: ["Two-tier"], lp: [6],
        prompt: t`In the equivalent Y, the resistor connected to terminal a is:`,
        figure: figS10,
        parts: [
          { label: "Answer", options: ["3 Ω", "2 Ω", "6 Ω", "4.5 Ω"], answer: 0 },
          { label: "Reason", roman: true, options: [
            "Multiply the two Δ resistors that meet at a, and divide by the sum of all three.",
            "Take the Δ resistor opposite a and divide it by 3.",
            "Divide the sum of the pairwise products by the Δ resistor opposite a.",
            "Put the two Δ resistors that meet at a in parallel."
          ], answer: 0 },
          { label: "Follow-up: the Y resistor connected to terminal b", numeric: true, answer: 2, unit: "Ω" },
          { label: "Follow-up: the Y resistor connected to terminal c", numeric: true, answer: 6, unit: "Ω" },
          { label: "Check: the resistance between a and b, the same in both circuits", numeric: true, answer: 5, unit: "Ω" }
        ],
        explain: t`The sum of the Δ resistors is $\Sigma = 36$ Ω. Y at a $= (6)(18)/36 = 3$ Ω, at b $= (6)(12)/36 = 2$ Ω, at c $= (12)(18)/36 = 6$ Ω. Check: the Δ gives $6 \parallel 30 = 5$ Ω between a and b; the Y gives $3 + 2 = 5$ Ω. (d) follows reason (iv); reason (ii) gives 4 Ω; reason (iii) is the Y-to-Δ rule.`
      },
      {
        id: "S11", title: "Wye to delta", tags: [], lp: [6],
        prompt: t`In the equivalent Δ, the resistor between a and b is:`,
        figure: figS11,
        parts: [
          { label: "Answer", options: ["35 Ω", "140 Ω", "70 Ω", "30 Ω"], answer: 0 },
          { label: "Follow-up: the Δ resistor between b and c", numeric: true, answer: 140, unit: "Ω" },
          { label: "Follow-up: the Δ resistor between c and a", numeric: true, answer: 70, unit: "Ω" }
        ],
        explain: t`$\Sigma = (10)(20) + (20)(40) + (40)(10) = 1400$. $R_{ab} = 1400/40 = 35$ Ω: divide by the Y resistor at the third terminal, c. Likewise $R_{bc} = 1400/10 = 140$ Ω and $R_{ca} = 1400/20 = 70$ Ω. Check: $35 \parallel 210 = 30$ Ω $= 10 + 20$, the Y path from a to b. (b) and (c) divide by the wrong Y resistor; (d) is the Y path itself.`
      },
      {
        id: "S12", title: "A bridge needs a Δ-to-Y step", tags: [], lp: [6],
        prompt: t`No two resistors here are in series or in parallel. The 20 Ω, 30 Ω and 50 Ω resistors form a Δ.`,
        figure: figS12,
        parts: [
          { label: "a) Replace it with an equivalent Y: the Y resistor at the top node", numeric: true, answer: 6, unit: "Ω" },
          { label: "a) … at the left node", numeric: true, answer: 10, unit: "Ω" },
          { label: "a) … at the right node", numeric: true, answer: 15, unit: "Ω" },
          { label: "b) Find the equivalent resistance seen by the source…", numeric: true, answer: 20, unit: "Ω" },
          { label: t`b) … and $i_s$.`, numeric: true, answer: 5, unit: "A" },
          { label: t`c) Go back to the original circuit and find $i_m$ in the 50 Ω resistor.`, numeric: true, answer: 0.25, unit: "A" }
        ],
        explain: t`a) $\Sigma = 20 + 30 + 50 = 100$ Ω: top $(20)(30)/100 = 6$ Ω, left $(20)(50)/100 = 10$ Ω, right $(30)(50)/100 = 15$ Ω. b) $(10 + 14) \parallel (15 + 9) = 12$ Ω, so $R_{eq} = 2 + 6 + 12 = 20$ Ω and $i_s = 100/20 = 5$ A. c) Each lower branch carries 2.5 A (the 14 Ω and 9 Ω are outside the Δ, so their currents are the same in both circuits). The left node is at $14 \times 2.5 = 35$ V and the right node at $9 \times 2.5 = 22.5$ V, so $i_m = 12.5/50 = 0.25$ A, left to right. The source delivers 500 W.`
      },
      {
        id: "S13", title: "A balanced bridge", tags: ["Two-tier", "Predict first"], lp: [3, 6],
        prompt: t`Find $R_{ab}$.`,
        figure: figS13,
        parts: [
          { label: t`Predict first: does the 47 Ω resistor change $R_{ab}$?`, options: ["Yes", "No"], answer: 1 },
          { label: "Answer", options: ["22.5 Ω", "15.2 Ω", "120 Ω", "69.5 Ω"], answer: 0 },
          { label: "Reason", roman: true, options: [
            t`$10/20 = 30/60$, so both ends of the 47 Ω are at the same voltage and it carries no current.`,
            "The 47 Ω is in parallel with the whole network.",
            "The 47 Ω is in series with the whole network.",
            "A resistor across the middle of a bridge never carries current."
          ], answer: 0 }
        ],
        explain: t`The bridge is balanced, $10/20 = 30/60$, so the 47 Ω carries no current and $R_{ab} = (10 + 20) \parallel (30 + 60) = 22.5$ Ω, with or without the 47 Ω. (b) puts the 47 Ω in parallel; (d) puts it in series; (c) adds all four. Reason (iv) goes too far: the middle resistor carries no current only when the bridge is balanced.`
      },
      {
        id: "S14", title: "Work backwards", tags: [], lp: [3],
        prompt: t`In the <a href="#S7">S7 circuit</a>, replace the 12 Ω resistor with an unknown $R$. What value of $R$ makes $i_s = 7.5$ A?`,
        parts: [{ label: "Answer", options: ["3 Ω", "2 Ω", "6 Ω", "12 Ω"], answer: 0 }],
        explain: t`$R_{eq} = 60/7.5 = 8$ Ω. The 6 Ω on the left takes 6 of that, so $R \parallel 6 = 2$ Ω (the 6 here is the $2 + 4$ path), and $R = 3$ Ω. (b) stops at $R \parallel 6 = 2$ Ω.`
      },
      {
        id: "S15", title: "The cable from your generator", tags: ["Predict first"], lp: [4],
        prompt: t`A neighbourhood generator holds 220 V at its terminals. Each conductor of the cable to your home has 0.25 Ω, and the home draws power like a 21.5 Ω resistor.`,
        figure: figS15,
        parts: [
          { label: "a) Predict first: does the home receive 220 V?", options: ["Yes", "No"], answer: 1 },
          { label: "a) Then find the current…", numeric: true, answer: 10, unit: "A" },
          { label: t`a) … and $v_L$.`, numeric: true, answer: 215, unit: "V" },
          { label: "b) Find the power delivered to the home…", numeric: true, answer: 2150, unit: "W" },
          { label: "b) … and the power lost in the cable.", numeric: true, answer: 50, unit: "W" },
          { label: "b) What percentage of the generator’s output is lost?", numeric: true, answer: 2.27, unit: "%", rel: 0.02 },
          { label: t`c) A thicker cable halves each conductor’s resistance. Find $v_L$ now.`, numeric: true, answer: 217.47, unit: "V", rel: 0.002 }
        ],
        explain: t`a) No: the cable and the home form a voltage divider. $i = 220/22 = 10$ A, so $v_L = 21.5 \times 10 = 215$ V. b) The home receives 2150 W; the cable loses $2 \times 10^2 \times 0.25 = 50$ W, which is 2.3% of the generator’s 2200 W. c) $i = 220/21.75 = 10.11$ A, so $v_L = 217.5$ V.`
      },
      {
        id: "S16", title: "How a touch screen finds your finger", tags: [], lp: [4],
        prompt: t`In a resistive touch screen (Nilsson’s Practical Perspective for this chapter), the grid in the x-direction is a resistance $R_x$ driven by $V_s = 5$ V. A touch splits it into $\alpha R_x$ and $(1 - \alpha)R_x$, and the screen measures $V_x$ across $\alpha R_x$, so $V_x = \alpha V_s$. The screen is $p_x = 1080$ pixels wide, and the pixel column of the touch is $x = (1 - \alpha)p_x$.`,
        parts: [
          { label: t`a) A touch gives $V_x = 2$ V. Find $\alpha$…`, numeric: true, answer: 0.4, unit: "" },
          { label: t`a) … and the pixel column $x$.`, numeric: true, answer: 648, unit: "" },
          { label: t`b) Which voltage-divider idea makes $V_x = \alpha V_s$?`, options: [
            t`$\alpha R_x$ and $(1 - \alpha)R_x$ are in series across $V_s$, so $V_x$ is a voltage-division fraction of $V_s$.`,
            t`$\alpha R_x$ and $(1 - \alpha)R_x$ are in parallel, so the current divides between them.`,
            t`The screen loads the divider, so $V_x$ falls in proportion to $\alpha$.`
          ], answer: 0 },
          { label: t`c) Where on the screen is a touch that gives $V_x = 5$ V?`, options: [
            t`At the far left edge, $x = 0$`,
            t`In the middle, $x = 540$`,
            t`At the far right edge, $x = 1080$`
          ], answer: 0 }
        ],
        explain: t`a) $\alpha = 2/5 = 0.4$, so $x = 0.6 \times 1080 = 648$. b) $\alpha R_x$ and $(1 - \alpha)R_x$ are in series across $V_s$, so $V_x$ is a voltage-division fraction: $V_x = \dfrac{\alpha R_x}{\alpha R_x + (1 - \alpha)R_x}\,V_s = \alpha V_s$. c) $V_x = V_s$ means $\alpha = 1$: the far left edge, $x = 0$.`
      }
    ]
  };
})(window.EENG);
