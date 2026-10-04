// Chapter 2 practice sheet (Lane B: open, AI allowed). Interactive version of "Practice sheet.pdf".
// Question fields:
//   id, title, tags (labels shown), lp (checklist items it practises), prompt, optional figure / table / work / hint
//   parts: every part must be right for the question to count as correct
//     { label, options, answer (index from 0), roman: true for i) ii) … }
//     { label, numeric: true, answer, unit, rel (relative tolerance, default 1%), abs }
//     { label, note: true, text } for a sub-question with nothing to check (its answer is in explain)
//   explain: shown after the student checks
(function (E) {
  var t = String.raw;
  var MINUS = "&#8722;";

  // ---- Small drawing helpers (all strokes and fills use currentColor) ----
  function svg(w, h, label, body) {
    return '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" role="img" aria-label="' + label + '">' +
      '<g stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round">' + body + "</g></svg>";
  }
  function pl(pts) { return '<polyline points="' + pts + '"/>'; }
  function seg(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; }
  function dot(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="currentColor" stroke="none"/>'; }
  // Arrowhead with its tip at (x, y), pointing at angle deg (0 = right, 90 = down).
  function head(x, y, deg, s) {
    s = s || 1;
    return '<polygon points="0,0 ' + (-14 * s) + "," + (-6.5 * s) + " " + (-14 * s) + "," + (6.5 * s) +
      '" transform="translate(' + x + " " + y + ") rotate(" + deg + ')" fill="currentColor" stroke="none"/>';
  }
  // Resistor zigzags.
  function zigH(x1, x2, y) {
    var d = (x2 - x1) / 6, p = x1 + "," + y;
    for (var k = 0; k < 6; k++) p += " " + (x1 + d * (k + 0.5)) + "," + (y + (k % 2 ? 8 : -8));
    return pl(p + " " + x2 + "," + y);
  }
  function zigV(x, y1, y2) {
    var d = (y2 - y1) / 6, p = x + "," + y1;
    for (var k = 0; k < 6; k++) p += " " + (x + (k % 2 ? -8 : 8)) + "," + (y1 + d * (k + 0.5));
    return pl(p + " " + x + "," + y2);
  }
  // Independent voltage source: circle with + at the top and − at the bottom.
  function vsrc(cx, cy, r) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
      '<path stroke-width="2" d="M' + (cx - 5) + " " + (cy - 9) + "h10M" + cx + " " + (cy - 14) + "v10M" + (cx - 5) + " " + (cy + 9) + 'h10"/>';
  }
  // Arrow drawn inside a source symbol, pointing up or down.
  function innerArrow(cx, cy, up) {
    var s = up ? -1 : 1;
    return seg(cx, cy - s * 12, cx, cy + s * 3) + head(cx, cy + s * 12, up ? -90 : 90, 0.75);
  }
  // Independent current source: circle with an arrow.
  function isrc(cx, cy, r, up) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' + innerArrow(cx, cy, up); }
  // Dependent source: diamond, with an arrow inside for a current source.
  function diamond(cx, cy, r, arrow) {
    return '<polygon points="' + cx + "," + (cy - r) + " " + (cx + r) + "," + cy + " " + cx + "," + (cy + r) + " " + (cx - r) + "," + cy + '"/>' +
      (arrow ? innerArrow(cx, cy, arrow === "up") : "");
  }
  // Text (inside the stroke group, so it resets stroke and sets fill).
  function tx(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" stroke="none" fill="currentColor" font-size="' + (o.size || 19) + '"' +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : "") + (o.bold ? ' font-weight="700"' : "") + ">" + s + "</text>";
  }
  function sgn(x, y, s) { return tx(x, y, s === "+" ? "+" : MINUS, { size: 24, bold: true, anchor: "middle" }); }
  // Italic symbol with an optional subscript, e.g. sym("i", "o").
  function sym(base, sub, pre) {
    return (pre || "") + '<tspan font-style="italic">' + base + "</tspan>" +
      (sub ? '<tspan font-size="72%" dy="5" font-style="' + (sub === "Δ" ? "normal" : "italic") + '">' + sub + "</tspan>" : "");
  }

  // ---- Figures ----

  // S1: four panels, each a loop joining two ideal sources.
  function panel(ox, oy, L, R, cap) {
    var xl = ox + 75, xr = ox + 195, yt = oy + 15, yb = oy + 125, cy = oy + 70, r = 19;
    function src(x, s) { return s.v ? vsrc(x, cy, r) : isrc(x, cy, r, s.up); }
    return pl(xl + "," + (cy - r) + " " + xl + "," + yt + " " + xr + "," + yt + " " + xr + "," + (cy - r)) +
      pl(xl + "," + (cy + r) + " " + xl + "," + yb + " " + xr + "," + yb + " " + xr + "," + (cy + r)) +
      src(xl, L) + src(xr, R) +
      tx(xl - r - 7, cy + 7, L.label, { anchor: "end" }) + tx(xr + r + 7, cy + 7, R.label) +
      tx(ox + 135, oy + 158, cap, { anchor: "middle" });
  }
  var s1Fig = svg(540, 340,
    "Four panels, each a loop joining two ideal sources. (a) a 12 V voltage source on the left and a 12 V voltage source on the right, both with + at the top. " +
    "(b) a 3 A current source on the left with its arrow up, and a 3 A current source on the right with its arrow down. " +
    "(c) a 9 V voltage source on the left with + at the top, and a 2 A current source on the right with its arrow up. " +
    "(d) a 2 A current source on the left with its arrow up, and a 5 A current source on the right with its arrow down.",
    panel(0, 0, { v: true, label: "12 V" }, { v: true, label: "12 V" }, "(a)") +
    panel(270, 0, { up: true, label: "3 A" }, { up: false, label: "3 A" }, "(b)") +
    panel(0, 175, { v: true, label: "9 V" }, { up: true, label: "2 A" }, "(c)") +
    panel(270, 175, { up: true, label: "2 A" }, { up: false, label: "5 A" }, "(d)"));

  // S3 (and S4): a 5 Ω resistor between a and b; the current arrow is on the b side, pointing left.
  var s3Fig = svg(400, 130,
    "A 5 Ω resistor between terminal a on the left and terminal b on the right. The + mark is on the a side and the − mark on the b side, with v = 15 V. " +
    "The current arrow i is on the wire between the resistor and b, pointing left, toward the resistor.",
    seg(40, 70, 155, 70) + zigH(155, 225, 70) + seg(225, 70, 350, 70) + dot(40, 70) + dot(350, 70) +
    head(272, 70, 180) +
    tx(14, 77, sym("a"), { size: 22 }) + tx(364, 77, sym("b"), { size: 22 }) +
    sgn(98, 50, "+") + sgn(282, 50, "−") +
    tx(190, 40, "5 Ω", { anchor: "middle" }) + tx(190, 112, sym("v") + " = 15 V", { anchor: "middle" }) +
    tx(300, 104, sym("i"), { anchor: "middle" }));

  // S7: a node with five branches.
  var s7Fig = (function () {
    var cx = 200, cy = 165, L = 125, b = "";
    // [angle in degrees (counter-clockwise from the right), into the node?, label, label x, label y, anchor]
    [[90, true, "4 A", 200, 28, "middle"], [162, false, sym("i", "x"), 70, 124, "end"], [18, false, "7 A", 330, 124, "start"],
      [234, true, "3 A", 112, 293, "middle"], [306, false, MINUS + "2 A", 290, 293, "middle"]].forEach(function (br) {
      var a = br[0] * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      var ex = +(cx + L * ux).toFixed(1), ey = +(cy + L * uy).toFixed(1);
      var d = br[1] ? 55 : 85;
      var hx = +(cx + d * ux).toFixed(1), hy = +(cy + d * uy).toFixed(1);
      b += seg(cx, cy, ex, ey) + head(hx, hy, br[1] ? 180 - br[0] : -br[0]) + tx(br[3], br[4], br[2], { anchor: br[5] });
    });
    return svg(400, 305,
      "A node with five branches. 4 A: from above, arrow pointing into the node. i x: to the upper left, arrow pointing away from the node. " +
      "7 A: to the upper right, arrow pointing away from the node. 3 A: from the lower left, arrow pointing into the node. " +
      "−2 A: to the lower right, arrow pointing away from the node.",
      b + dot(cx, cy));
  })();

  // S8: one loop of four elements.
  function box(x, y, w, h, n) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" stroke-width="2"/>' +
      tx(x + w / 2, y + h / 2 + 6, n, { size: 16, anchor: "middle" });
  }
  var s8Fig = svg(470, 300,
    "A single loop of four elements. Top: element 1, 10 V, + on the left and − on the right. Right side: element 2, v x, + at the top and − at the bottom. " +
    "Bottom: element 3, 4 V, − on the left and + on the right. Left side: element 4, −6 V, − at the top and + at the bottom.",
    pl("100,127 100,60 212,60") + pl("258,60 370,60 370,127") + pl("370,173 370,240 258,240") + pl("212,240 100,240 100,173") +
    box(212, 52, 46, 16, "1") + box(362, 127, 16, 46, "2") + box(212, 232, 46, 16, "3") + box(92, 127, 16, 46, "4") +
    tx(235, 25, "10 V", { anchor: "middle" }) + sgn(179, 44, "+") + sgn(291, 44, "−") +
    sgn(399, 104, "+") + sgn(399, 214, "−") + tx(430, 159, sym("v", "x"), { anchor: "start" }) +
    sgn(179, 276, "−") + sgn(291, 276, "+") + tx(235, 292, "4 V", { anchor: "middle" }) +
    sgn(71, 104, "−") + sgn(71, 214, "+") + tx(26, 159, MINUS + "6 V", { anchor: "middle" }));

  // S9, S11, S13: source and series resistor on the left, resistor in the middle, a source on the right.
  //   o: { vs, rTop, iTop, rMid, iMid, vo (bool), right: "i9" | "dep", rightLabel, label }
  function threeBranch(o) {
    var b = pl("100,128 100,50 165,50") + zigH(165, 225, 50) + pl("225,50 500,50 500,128") +
      pl("500,172 500,250 100,250 100,172") +
      seg(300, 50, 300, 118) + zigV(300, 118, 182) + seg(300, 182, 300, 250) + dot(300, 50) + dot(300, 250) +
      vsrc(100, 150, 22) +
      (o.right === "dep" ? diamond(500, 150, 22, "up") : isrc(500, 150, 22, true)) +
      // current arrows beside the elements
      seg(170, 82, 222, 82) + head(232, 82, 0) + seg(330, 120, 330, 168) + head(330, 178, 90) +
      tx(68, 157, o.vs, { anchor: "end" }) + tx(195, 30, o.rTop, { anchor: "middle" }) +
      tx(196, 114, o.iTop, { anchor: "middle" }) + tx(282, 157, o.rMid, { anchor: "end" }) +
      tx(344, 157, o.iMid) + tx(532, 157, o.rightLabel) +
      (o.vo ? sgn(422, 104, "+") + tx(422, 157, sym("v", "o"), { anchor: "middle" }) + sgn(422, 214, "−") : "");
    return svg(590, 270, o.label, b);
  }
  var s9Fig = threeBranch({
    vs: "60 V", rTop: "4 Ω", iTop: sym("i", "o"), rMid: "8 Ω", iMid: sym("i", "1"), right: "i9", rightLabel: "9 A",
    label: "A circuit with a top node and a bottom node. Left branch: a 60 V voltage source with + at the top, in series with a 4 Ω resistor on the top wire; " +
      "current i o on the top wire, arrow pointing right, toward the top node. Middle branch: an 8 Ω resistor with current i 1, arrow pointing down. " +
      "Right branch: a 9 A current source with its arrow pointing up."
  });
  var s11Fig = threeBranch({
    vs: "100 V", rTop: "5 Ω", iTop: sym("i", "Δ"), rMid: "5 Ω", iMid: sym("i", "o"), vo: true, right: "dep", rightLabel: sym("i", "Δ", "3"),
    label: "A circuit with a top node and a bottom node. Left branch: a 100 V voltage source with + at the top, in series with a 5 Ω resistor on the top wire; " +
      "current i Δ on the top wire, arrow pointing right, toward the top node. Middle branch: a 5 Ω resistor with current i o, arrow pointing down. " +
      "Voltage v o between the two nodes, + at the top. Right branch: a dependent current source (diamond) of 3 i Δ, arrow pointing up."
  });
  var s13Fig = threeBranch({
    vs: "60 V", rTop: "4 Ω", iTop: sym("i", "Δ"), rMid: "12 Ω", iMid: sym("i", "o"), vo: true, right: "dep", rightLabel: sym("i", "Δ", "2"),
    label: "A circuit with a top node and a bottom node. Left branch: a 60 V voltage source with + at the top, in series with a 4 Ω resistor on the top wire; " +
      "current i Δ on the top wire, arrow pointing right, toward the top node. Middle branch: a 12 Ω resistor with current i o, arrow pointing down. " +
      "Voltage v o between the two nodes, + at the top. Right branch: a dependent current source (diamond) of 2 i Δ, arrow pointing up."
  });

  // S12: two separate circuits; the right one contains a current-controlled voltage source.
  var s12Fig = svg(600, 245,
    "Two separate circuits. Left: a 12 V voltage source with + at the top, connected across a 3 Ω resistor; current i s through the resistor, arrow pointing down. " +
    "Right: a 20 V voltage source with + at the top; a 6 Ω resistor on the top wire with voltage v o across it, + on the left and − on the right; " +
    "current i o, arrow pointing right (clockwise); on the right side a dependent voltage source (diamond) of 2 i s, + at the top and − at the bottom.",
    // left circuit
    pl("70,138 70,90 190,90 190,128") + zigV(190, 128, 188) + pl("190,188 190,225 70,225 70,178") + vsrc(70, 158, 20) +
    seg(150, 138, 150, 170) + head(150, 180, 90) +
    tx(42, 165, "12 V", { anchor: "end" }) + tx(206, 165, "3 Ω") + tx(140, 165, sym("i", "s"), { anchor: "end" }) +
    // right circuit
    pl("370,138 370,90 425,90") + zigH(425, 473, 90) + pl("473,90 530,90 530,140") + pl("530,176 530,225 370,225 370,178") +
    vsrc(370, 158, 20) + diamond(530, 158, 18) +
    seg(424, 155, 464, 155) + head(474, 155, 0) +
    tx(342, 165, "20 V", { anchor: "end" }) +
    tx(449, 58, sym("v", "o"), { anchor: "middle" }) + sgn(410, 78, "+") + sgn(490, 78, "−") + tx(449, 122, "6 Ω", { anchor: "middle" }) +
    tx(449, 185, sym("i", "o"), { anchor: "middle" }) +
    sgn(506, 140, "+") + sgn(506, 192, "−") + tx(556, 165, sym("i", "s", "2")));

  var carTable = t`<div class="q-table"><table class="data-table"><thead><tr><th>Current drawn (A)</th><th>0</th><th>100</th><th>200</th></tr></thead><tbody><tr><th>Terminal voltage (V)</th><td>12.6</td><td>11.6</td><td>10.6</td></tr></tbody></table></div>`;

  E.sheets[2] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. The device-free quiz at the start of week 3, session 1 (Tue 20 Oct) is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Both must be right.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Signs:</strong> in KCL, count currents leaving a node as positive. In KVL, walk clockwise and count voltage drops (+ to −) as positive. $p > 0$ means an element absorbs power.`
    ],

    questions: [
      {
        id: "S1", title: "Which connections are allowed?", tags: ["Two-tier"], lp: [1],
        prompt: t`Each panel joins two ideal sources. Which connection is <strong>not</strong> permitted?`,
        figure: s1Fig,
        parts: [
          { label: "Answer", options: ["(a)", "(b)", "(c)", "(d)"], answer: 3 },
          { label: "Reason", roman: true, options: [
            "Two ideal current sources in one loop must carry the same current, so 2 A and 5 A conflict.",
            "An ideal voltage source can never be connected in parallel with an ideal current source.",
            "Two ideal voltage sources can never be connected in parallel.",
            "The 5 A source would overload the 2 A source."
          ], answer: 0 }
        ],
        explain: t`(d) puts 2 A and 5 A in one loop, but a loop carries one current, so it is not permitted. (a) is fine because the two voltages match; in (b) both sources push 3 A clockwise, so they agree; (c) is permitted (Nilsson Example 2.1e). Reason (ii) is the common misconception: (c) is a voltage source in parallel with a current source, and it is allowed.`
      },
      {
        id: "S2", title: "Reading a dependent source", tags: [], lp: [2],
        prompt: t`A source drawn as a diamond containing an arrow is labelled $0.4v_x$, where $v_x$ is the voltage across a resistor elsewhere in the circuit. Which description is correct?`,
        parts: [{ label: "Answer", options: [
          "A current-controlled voltage source; 0.4 is in V/A",
          "A voltage-controlled current source; 0.4 is in A/V",
          "A voltage-controlled voltage source; 0.4 has no unit",
          "An independent current source of 0.4 A"
        ], answer: 1 }],
        explain: t`The arrow inside the diamond makes it a current source, and its value $i_s = 0.4v_x$ is a current set by a voltage. So it is a voltage-controlled current source, and the gain is in A/V (siemens).`
      },
      {
        id: "S3", title: "Ohm’s law and the reference arrow", tags: ["Two-tier"], lp: [3],
        prompt: t`Find the current $i$.`,
        figure: s3Fig,
        parts: [
          { label: "Answer", options: ["3 A", "−3 A", "75 A", "−75 A"], answer: 1 },
          { label: "Reason", roman: true, options: [
            t`The arrow enters the + terminal, so $v = iR$.`,
            t`The arrow enters the − terminal, so $v = -iR$.`,
            t`Current flows from + to −, so $i$ is positive.`,
            t`$i = v/R$ for every resistor, whatever the arrow.`
          ], answer: 1 },
          { label: "Follow-up: through the resistor, does positive charge actually move from a to b or from b to a?", options: ["from a to b", "from b to a"], answer: 0 }
        ],
        explain: t`The arrow enters the − terminal, so $v = -iR$: $i = -15/5 = -3$ A. The minus sign means positive charge actually moves against the arrow, from a to b (from + to − through the resistor, as it must). (c) and (d) multiply instead of dividing; (a) ignores the reference direction.`
      },
      {
        id: "S4", title: "Power in that resistor", tags: ["Two-tier"], lp: [3],
        prompt: t`For the resistor in <a href="#S3">S3</a>, the power is:`,
        parts: [
          { label: "Answer", options: ["45 W absorbed", "45 W delivered", "75 W absorbed", "0 W"], answer: 0 },
          { label: "Reason", roman: true, options: [
            t`$p = vi = (15)(-3) = -45$ W, so it delivers.`,
            t`The arrow enters the − terminal, so $p = -vi = 45$ W; a resistor always absorbs, $p = i^2R$.`,
            t`$i$ is negative, so no power flows.`,
            t`$p = v^2R$.`
          ], answer: 1 }
        ],
        explain: t`The arrow enters the − terminal, so $p = -vi = -(15)(-3) = 45$ W $= i^2R = (3)^2(5)$, absorbed. (b) uses $p = vi$ without checking which terminal the arrow enters. A resistor can only absorb power.`
      },
      {
        id: "S5", title: "Resistor ratings", tags: [], lp: [3],
        prompt: t`A 1 kΩ resistor is rated ¼ W. What is the largest voltage you can put across it without exceeding its rating?`,
        parts: [{ label: "Answer", options: ["250 V", "15.8 V", "0.25 V", "4 V"], answer: 1 }],
        explain: t`$P = V^2/R$, so $V^2 = PR = 0.25 \times 1000 = 250$ and $V = 15.8$ V (the current is then $I = 15.8$ mA). (a) multiplies $P$ by $R$ and stops there, without the square root.`
      },
      {
        id: "S6", title: "A heater on your generator line", tags: ["Predict first"], lp: [3],
        prompt: t`An electric heater is rated 2000 W at 220 V.`,
        parts: [
          { label: "a) Find its resistance", numeric: true, answer: 24.2, unit: "Ω" },
          { label: "a) … and the current it draws", numeric: true, answer: 9.09, unit: "A" },
          { label: "b) Can it run on a 5 A generator subscription?", options: ["Yes", "No"], answer: 1 },
          { label: "c) Predict first: if the line voltage sags to 200 V (9% lower), does the heater’s power fall by less than 9%, about 9% or more than 9%?", options: ["Less than 9%", "About 9%", "More than 9%"], answer: 2 },
          { label: t`c) Then compute it, treating $R$ as constant: the power at 200 V`, numeric: true, answer: 1653, unit: "W" },
          { label: "c) By what percentage has the power fallen?", numeric: true, answer: 17.4, unit: "%", abs: 0.5 }
        ],
        explain: t`a) $R = 220^2/2000 = 24.2$ Ω and $I = 2000/220 = 9.09$ A. b) No: 9.09 A exceeds 5 A, so the heater alone trips the breaker. c) At 200 V, $P = 200^2/24.2 = 1653$ W, about 17% less. That is more than 9% because $P \propto v^2$: $(200/220)^2 = 0.83$.`
      },
      {
        id: "S7", title: "KCL at a node", tags: ["Predict first"], lp: [4],
        prompt: "",
        figure: s7Fig,
        parts: [
          { label: "Predict first: which currents count as leaving the node?", options: [t`$i_x$, 7 A and −2 A`, t`$i_x$ and 7 A only`, "4 A and 3 A", "4 A, 3 A and −2 A"], answer: 0 },
          { label: t`Then find $i_x$.`, options: ["2 A", "−2 A", "6 A", "−6 A"], answer: 0 }
        ],
        explain: t`The arrows for $i_x$, 7 A and −2 A point away from the node, so they count as leaving; the 4 A and 3 A arrows point in. Currents leaving: $7 + (-2) + i_x - 4 - 3 = 0$, so $i_x = 2$ A. (b) drops the minus sign on −2 A.`
      },
      {
        id: "S8", title: "KVL around a loop", tags: ["Predict first"], lp: [4],
        prompt: "",
        figure: s8Fig,
        parts: [
          { label: "Predict first: on a clockwise walk, which elements do you cross from + to −?", options: ["All four", "1 and 2 only", "1, 2 and 3 only", "1 and 3 only"], answer: 0 },
          { label: t`Then find $v_x$.`, options: ["−8 V", "8 V", "0 V", "20 V"], answer: 0 }
        ],
        explain: t`Walking clockwise you meet the + mark first on every element: 1 (left to right), 2 (top to bottom), 3 (right to left) and 4 (bottom to top). The sign of the value does not change the marks. Clockwise drops: $10 + v_x + 4 + (-6) = 0$, so $v_x = -8$ V. (b) reverses one sign.`
      },
      {
        id: "S9", title: "Two unknown currents", tags: [], lp: [4, 5, 6],
        prompt: "",
        figure: s9Fig,
        parts: [
          { label: "a) A KCL equation at the top node (currents leaving positive)", options: [
            t`$-i_o + i_1 - 9 = 0$`, t`$-i_o + i_1 + 9 = 0$`, t`$i_o + i_1 - 9 = 0$`, t`$-i_o - i_1 - 9 = 0$`
          ], answer: 0 },
          { label: "a) A KVL equation around the left loop (clockwise, drops positive)", options: [
            t`$-60 + 4i_o + 8i_1 = 0$`, t`$60 + 4i_o + 8i_1 = 0$`, t`$-60 + 4i_o - 8i_1 = 0$`, t`$-60 - 4i_o + 8i_1 = 0$`
          ], answer: 0 },
          { label: t`b) Find $i_o$`, numeric: true, answer: -1, unit: "A" },
          { label: t`b) Find $i_1$`, numeric: true, answer: 8, unit: "A" },
          { label: "c) Power of the 60 V source", numeric: true, answer: 60, unit: "W" },
          { label: "c) The 60 V source:", options: ["absorbs power", "delivers power"], answer: 0 },
          { label: "c) Power of the 9 A source", numeric: true, answer: -576, unit: "W" },
          { label: "c) The 9 A source:", options: ["absorbs power", "delivers power"], answer: 1 },
          { label: "c) Power balance: total power delivered", numeric: true, answer: 576, unit: "W" }
        ],
        explain: t`a) KCL at the top node, currents leaving: $-i_o + i_1 - 9 = 0$, so $i_1 = i_o + 9$ (the 9 A arrow points into the node). KVL around the left loop: $-60 + 4i_o + 8i_1 = 0$. b) Substituting, $-60 + 4i_o + 8i_o + 72 = 0$, so $i_o = -1$ A and $i_1 = 8$ A. c) $i_o$ leaves the + terminal of the 60 V source, so $p = -60i_o = +60$ W: it absorbs. The 9 A source has $8 \times 8 = 64$ V across it and its current leaves its + end, so $p = -64 \times 9 = -576$ W: it delivers. The resistors absorb $4$ W and $512$ W. Delivered 576 W = absorbed $60 + 4 + 512$ W.`
      },
      {
        id: "S10", title: "Which loop gives a useful KVL equation?", tags: ["Two-tier"], lp: [4],
        prompt: t`In the <a href="#S9">S9</a> circuit, which closed path gives a KVL equation without adding a new unknown?`,
        parts: [
          { label: "Answer", options: [
            "The loop through the 60 V source, the 4 Ω and the 8 Ω resistors",
            "The loop through the 8 Ω resistor and the 9 A source",
            "The outer loop through the 60 V source, the 4 Ω resistor and the 9 A source",
            "All three are equally useful"
          ], answer: 0 },
          { label: "Reason", roman: true, options: [
            "The voltage across an ideal current source is unknown; the rest of the circuit sets it.",
            "The voltage across a current source is always zero.",
            "KVL does not apply to a loop that contains a current source.",
            "An outer loop never gives an independent equation."
          ], answer: 0 }
        ],
        explain: t`Loops (b) and (c) contain the 9 A source, whose voltage is a new unknown: the rest of the circuit sets it (64 V in S9). Only loop (a) gives an equation in $i_o$ and $i_1$ alone. Reason (ii) is the common misconception: the voltage across a current source is not zero.`
      },
      {
        id: "S11", title: "A current-controlled current source", tags: [], lp: [4, 5, 6],
        prompt: t`Find $i_\Delta$ and $v_o$, and the power of the dependent source.`,
        figure: s11Fig,
        parts: [
          { label: t`Find $i_\Delta$`, numeric: true, answer: 4, unit: "A" },
          { label: t`Find $v_o$`, options: [t`$v_o = 80$ V`, t`$v_o = 50$ V`, t`$v_o = 200$ V`, t`$v_o = 100$ V`], answer: 0 },
          { label: "Power of the dependent source", numeric: true, answer: -960, unit: "W" }
        ],
        explain: t`KCL at the top node: $i_o = i_\Delta + 3i_\Delta = 4i_\Delta$. KVL around the left loop: $-100 + 5i_\Delta + 5i_o = 0$, so $25i_\Delta = 100$, $i_\Delta = 4$ A, $i_o = 16$ A and $v_o = 5i_o = 80$ V. The dependent source has 80 V across it with $3i_\Delta = 12$ A leaving its + end, so $p = -(80)(12) = -960$ W: it delivers. Check: delivered $400 + 960 = 1360$ W = absorbed $80 + 1280$ W. (b) ignores the dependent source; (c) reverses its arrow.`
      },
      {
        id: "S12", title: "A current-controlled voltage source", tags: ["Two-tier"], lp: [5, 6],
        prompt: t`The dependent source:`,
        figure: s12Fig,
        parts: [
          { label: "Answer", options: ["absorbs 16 W", "delivers 16 W", "absorbs 8 W", "delivers 24 W"], answer: 0 },
          { label: "Reason", roman: true, options: [
            t`$i_o$ enters its + terminal, so $p = vi > 0$.`,
            "Dependent sources always deliver power.",
            "Its voltage is positive, so it delivers.",
            t`It is controlled by $i_s$, so its power is zero.`
          ], answer: 0 },
          { label: t`Follow-up: find $v_o$.`, numeric: true, answer: 12, unit: "V" }
        ],
        explain: t`From the left circuit, $i_s = 12/3 = 4$ A, so the dependent source is $2i_s = 8$ V. Then $i_o = (20 - 8)/6 = 2$ A and $v_o = 6i_o = 12$ V. $i_o$ enters the source’s + terminal, so $p = vi = (8)(2) = 16$ W: it absorbs. Check: delivered $48 + 40 = 88$ W = absorbed $48 + 24 + 16$ W. A dependent source can absorb power, as this one does.`
      },
      {
        id: "S13", title: "Spot the error", tags: ["Spot the error"], lp: [4, 5, 6],
        prompt: t`The worked solution below finds $v_o$. It contains the kind of mistake AI chat tools often make with dependent sources.`,
        figure: s13Fig,
        work: [
          t`KVL clockwise around the left loop, drops positive: $-60 + 4i_\Delta + 12i_o = 0$.`,
          t`KCL at the top node, currents leaving: $-i_\Delta + i_o + 2i_\Delta = 0$, so $i_o = -i_\Delta$.`,
          t`Substitute: $-60 + 4i_\Delta - 12i_\Delta = 0$, so $i_\Delta = -7.5$ A.`,
          t`Then $i_o = 7.5$ A and $v_o = 12i_o = 90$ V.`,
          t`$v_o$ is positive, so the answer is correct.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"], answer: 1 },
          { label: t`b) Correct it: with the right signs, line 2 gives $i_o = k\,i_\Delta$. What is $k$?`, numeric: true, answer: 3, unit: "" },
          { label: t`c) Finish the solution: $v_o$`, numeric: true, answer: 54, unit: "V" },
          { label: "c) Check it with a power balance: total power delivered", numeric: true, answer: 252, unit: "W" },
          { label: "d) Line 5 claims the answer is correct. Why is that not a check?", note: true, text: "Answer in a sentence, then compare with the explanation." }
        ],
        explain: t`a) Line 1 is right. Line 2 is wrong: the $2i_\Delta$ arrow points up, into the top node, so in a sum of currents leaving it counts as $-2i_\Delta$. b) The corrected line reads $-i_\Delta + i_o - 2i_\Delta = 0$, so $i_o = 3i_\Delta$. c) Then $-60 + 4i_\Delta + 36i_\Delta = 0$, so $i_\Delta = 1.5$ A, $i_o = 4.5$ A and $v_o = 12i_o = 54$ V. Balance: delivered $90 + 162 = 252$ W (the 60 V source and the dependent source, which carries 3 A out of its + end at 54 V) = absorbed $9 + 243$ W (the 4 Ω and 12 Ω resistors). d) A positive $v_o$ says nothing about whether it is right; only a power balance (or substituting back) checks it.`
      },
      {
        id: "S14", title: "Work backwards", tags: [], lp: [4, 5],
        prompt: t`In the <a href="#S9">S9</a> circuit, replace the 9 A source with a source of unknown current $I$, arrow still up. What value of $I$ makes the current in the 60 V source zero?`,
        parts: [{ label: "Answer", options: ["7.5 A", "15 A", "5 A", "0 A"], answer: 0 }],
        explain: t`With no current in the 60 V source, $i_o = 0$, so the 4 Ω resistor drops nothing and the 8 Ω resistor has the full 60 V across it. It carries $60/8 = 7.5$ A, and KCL at the top node says that current comes from the source: $I = 7.5$ A. (b) uses $60/4$; (c) uses $60/12$.`
      },
      {
        id: "S15", title: "Modelling a car battery from measurements", tags: [], lp: [3, 4],
        prompt: t`A car battery is tested at three load currents:` + carTable +
          t`Model it as an ideal voltage source in series with a resistance, as in Nilsson Example 2.9. What terminal voltage do you expect when the starter motor draws 250 A?`,
        parts: [
          { label: "Answer", options: ["10.1 V", "12.6 V", "9.1 V", "11.35 V"], answer: 0 },
          { label: "Follow-up: why do the headlights dim while the engine is cranking?", note: true, text: "Answer in a sentence, then compare with the explanation." }
        ],
        explain: t`At zero current there is no drop inside, so $v_s = 12.6$ V. Each 100 A takes 1 V off, so $R = (12.6 - 11.6)/100 = 0.01$ Ω. At 250 A: $v = 12.6 - 0.01 \times 250 = 10.1$ V. Follow-up: the lights dim because the terminal voltage drops across the internal resistance: while the starter draws its large current, everything connected to the battery, headlights included, sees only about 10 V.`
      },
      {
        id: "S16", title: "Two heaters: series or parallel?", tags: ["Two-tier", "Predict first"], lp: [3],
        prompt: t`Two identical heaters are each rated 1100 W at 220 V. You connect them in series across 220 V.`,
        parts: [
          { label: "Predict first: more heat than one heater alone, or less?", options: ["More heat than one heater alone", "Less heat than one heater alone"], answer: 1 },
          { label: "Then find the total power.", options: ["2200 W", "1100 W", "550 W", "275 W"], answer: 2 },
          { label: "Reason", roman: true, options: [
            t`Each heater keeps $R = 44$ Ω; in series the current is $220/88 = 2.5$ A, so $P = 220 \times 2.5 = 550$ W.`,
            "Each heater still gets 220 V, so the powers add.",
            "Two heaters always give twice the heat of one.",
            "Each heater gets half the voltage, so it gives half its rated power."
          ], answer: 0 }
        ],
        explain: t`Each heater has $R = 220^2/1100 = 44$ Ω. In series $R = 88$ Ω, $I = 220/88 = 2.5$ A and $P = 220 \times 2.5 = 550$ W in total (275 W each): half the heat of one heater alone. (a) is the parallel connection; (b) follows reason (iv), which forgets that halving the voltage also halves the current, so each heater gives a quarter of its rated power.`
      }
    ]
  };
})(window.EENG);
