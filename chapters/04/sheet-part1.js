// Chapter 4, Part 1 practice sheet (Lane B: open, AI allowed). Interactive version of "Practice sheet – Part 1.pdf".
// Question fields:
//   id, title, tags (labels shown), lp (Part 1 checklist items it practises), prompt, optional figure / table / work / hint
//   parts: every part must be right for the question to count as correct
//     { label, options, answer (index from 0), roman: true for i) ii) … }
//     { label, numeric: true, answer, unit, rel (relative tolerance, default 1%) }
//     { label, note: true, text } for a step with nothing to check; its answer is in explain
//   explain: shown after the student checks
(function (E) {
  var t = String.raw;

  // ---- Circuit figures, drawn here. Lines and text use currentColor; mesh currents and i_x use the link colour, as in the PDF.
  var RL = 17, RA = 7, CR = 15, DD = 15; // resistor half-length and zigzag amplitude, source radius, diamond half-diagonal

  function r1(n) { return Math.round(n * 10) / 10; }
  function pts(a) { return a.map(function (p) { return r1(p[0]) + "," + r1(p[1]); }).join(" "); }
  function ln(x1, y1, x2, y2) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '"/>'; }
  function head(x, y, ux, uy, len, w) { // filled arrowhead, tip at (x, y), pointing along (ux, uy)
    var bx = x - ux * len, by = y - uy * len;
    return '<polygon points="' + pts([[x, y], [bx - uy * w, by + ux * w], [bx + uy * w, by - ux * w]]) + '"/>';
  }
  function zig(x, y, vert) {
    var f = [0, 1, 3, 5, 7, 9, 11, 12], o = [0, 1, -1, 1, -1, 1, -1, 0];
    return '<polyline points="' + pts(f.map(function (k, j) {
      var along = -RL + k * RL / 6, across = o[j] * RA;
      return vert ? [x + across, y + along] : [x + along, y + across];
    })) + '"/>';
  }
  function plus(x, y) { return ln(x - 4, y, x + 4, y) + ln(x, y - 4, x, y + 4); }
  function minus(x, y) { return ln(x - 4, y, x + 4, y); }
  function symV(sub) { return '<tspan font-style="italic">v</tspan>' + (sub ? '<tspan font-size="70%" dy="4">' + sub + "</tspan>" : ""); }
  function symI(sub) { return '<tspan font-style="italic">i</tspan><tspan font-size="70%" dy="4" font-style="italic">' + sub + "</tspan>"; }
  var TWO_IX = "2" + symI("x");

  function half(e) { return e.k === "R" ? RL : (e.k === "V" || e.k === "I") ? CR : DD; }

  // Element kinds: R resistor; V source (plus: top|bottom|left|right); I current source (dir: up|down);
  // DI dependent current source (dir); DV dependent voltage source (plus: top, signs drawn on its left, as in the PDF).
  function element(d, e, x, y, vert) {
    if (e.k === "R") d.s += zig(x, y, vert);
    else if (e.k === "V" || e.k === "I") d.s += '<circle cx="' + x + '" cy="' + y + '" r="' + CR + '"/>';
    else d.s += '<polygon points="' + pts([[x, y - DD], [x + DD, y], [x, y + DD], [x - DD, y]]) + '"/>';
    if (e.k === "V") {
      var px = e.plus === "left" ? -1 : e.plus === "right" ? 1 : 0, py = e.plus === "top" ? -1 : e.plus === "bottom" ? 1 : 0;
      d.m += plus(x + 7 * px, y + 7 * py) + minus(x - 7 * px, y - 7 * py);
    }
    if (e.k === "DV") {
      var sy = e.plus === "bottom" ? 1 : -1;
      d.m += plus(x - 19, y + 13 * sy) + minus(x - 19, y - 14 * sy);
    }
    if (e.k === "I" || e.k === "DI") {
      var s = e.dir === "down" ? 1 : -1, a = e.k === "I" ? 10 : 9;
      d.m += ln(x, y - s * a, x, y + s * (a - 8));
      d.f += head(x, y + s * a, 0, s, 9, 4.5);
    }
    if (e.label) {
      var off = e.k === "R" ? RA + 10 : half(e) + 6, right = e.side !== "left";
      if (vert) d.f += '<text x="' + (right ? x + off : x - off) + '" y="' + (y + 6) + '"' + (right ? "" : ' text-anchor="end"') + ">" + e.label + "</text>";
      else d.f += '<text x="' + x + '" y="' + (e.k === "R" ? y - 13 : y - half(e) - 7) + '" text-anchor="middle">' + e.label + "</text>";
    }
  }

  // A ladder of vertical branches (cols, left to right) between a top rail and a bottom rail.
  //   top[k]: the element on the top rail between column k and k + 1 (null for a plain wire)
  //   nodes: [[x, label]] node-voltage labels above the top rail; ground: x of the reference symbol on the bottom rail
  //   meshes: [[cx, sub]] clockwise mesh currents; more(d, T, B, M): extra drawing
  function circuit(o) {
    var T = o.T || 50, B = o.B || 170, M = (T + B) / 2;
    var d = { s: "", m: "", f: "", a: "" };
    var xs = o.cols.map(function (c) { return c.x; });
    for (var k = 0; k + 1 < xs.length; k++) {
      var e = (o.top || [])[k];
      if (e) {
        var xc = (xs[k] + xs[k + 1]) / 2, h = half(e);
        d.s += ln(xs[k], T, xc - h, T) + ln(xc + h, T, xs[k + 1], T);
        element(d, e, xc, T, false);
      } else d.s += ln(xs[k], T, xs[k + 1], T);
    }
    d.s += ln(xs[0], B, xs[xs.length - 1], B);
    o.cols.forEach(function (c, j) {
      var y0 = T;
      c.els.forEach(function (e) {
        var y = e.y || M, h = half(e);
        d.s += ln(c.x, y0, c.x, y - h);
        element(d, e, c.x, y, true);
        y0 = y + h;
      });
      d.s += ln(c.x, y0, c.x, B);
      if (j > 0 && j < xs.length - 1) d.f += '<circle cx="' + c.x + '" cy="' + T + '" r="4"/><circle cx="' + c.x + '" cy="' + B + '" r="4"/>';
    });
    (o.nodes || []).forEach(function (n) { d.f += '<text x="' + n[0] + '" y="' + (T - 13) + '" text-anchor="middle">' + n[1] + "</text>"; });
    if (o.ground) d.m += ln(o.ground, B, o.ground, B + 12) + ln(o.ground - 11, B + 12, o.ground + 11, B + 12) +
      ln(o.ground - 7, B + 17, o.ground + 7, B + 17) + ln(o.ground - 3, B + 22, o.ground + 3, B + 22);
    (o.meshes || []).forEach(function (m) { // clockwise arc from just left of 12 o'clock round to about 8 o'clock
      var r = 24, cx = m[0], a0 = 262 * Math.PI / 180, a1 = 140 * Math.PI / 180;
      var ex = cx + r * Math.cos(a1), ey = M + r * Math.sin(a1), ux = -Math.sin(a1), uy = Math.cos(a1);
      d.a += '<path d="M' + r1(cx + r * Math.cos(a0)) + " " + r1(M + r * Math.sin(a0)) + " A" + r + " " + r + " 0 1 1 " + r1(ex) + " " + r1(ey) +
        '" fill="none" stroke="currentColor" stroke-width="2.5"/>' + head(ex + 7 * ux, ey + 7 * uy, ux, uy, 13, 6) +
        '<text x="' + cx + '" y="' + (M + 5) + '" text-anchor="middle">' + symI(m[1]) + "</text>";
    });
    if (o.more) o.more(d, T, B, M);
    return '<svg class="fig" viewBox="0 ' + (o.vy || 0) + " " + o.w + " " + o.h + '" width="' + o.w + '" role="img" aria-label="' + o.aria + '">' +
      '<g stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">' + d.s +
      '<g stroke-width="2">' + d.m + "</g></g>" +
      '<g fill="currentColor" font-size="18">' + d.f + "</g>" +
      (d.a ? '<g style="color: var(--link, #3071a9)" fill="currentColor" font-size="18">' + d.a + "</g>" : "") + "</svg>";
  }

  // i_x arrow pointing right, just below a resistor on the top rail centred at xc (S5, S6)
  function ixRight(xc) {
    return function (d, T) {
      d.a += '<g stroke="currentColor" stroke-width="2.5">' + ln(xc - 36, T + 17, xc - 12, T + 17) + "</g>" + head(xc - 4, T + 17, 1, 0, 10, 5) +
        '<text x="' + (xc + 8) + '" y="' + (T + 30) + '">' + symI("x") + "</text>";
    };
  }

  var X4 = [80, 200, 320, 440], X3 = [80, 260, 440];
  function cols(xs, els) { return xs.map(function (x, k) { return { x: x, els: els[k] }; }); }
  function R(label, side, y) { return { k: "R", label: label, side: side, y: y }; }
  function V(label, plus, side, y) { return { k: "V", label: label, plus: plus, side: side, y: y }; }
  function I(label, dir, side) { return { k: "I", label: label, dir: dir, side: side }; }

  var fS1 = circuit({
    w: 505, h: 160, vy: 25, top: [R(), R(), null],
    cols: cols(X4, [[V("", "top")], [R()], [R()], [I("", "up")]]),
    aria: "Circuit with no values. Left branch: a voltage source, + at the top. Along the top wire: a resistor, then a node with a resistor down to the bottom wire, then a second resistor, then a node with a resistor down to the bottom wire, then a plain wire to the right branch, a current source with its arrow pointing up. The bottom wire is one node; essential nodes are marked with dots."
  });

  var fS2 = circuit({
    w: 505, h: 205, top: [R("2 Ω"), R("10 Ω"), null], nodes: [[200, symV("1")], [320, symV("2")]], ground: 260,
    cols: cols(X4, [[V("60 V", "top", "left")], [R("5 Ω")], [R("4 Ω")], [I("3 A", "up")]]),
    aria: "Left: 60 V source, + at the top. Top wire: 2 ohms to node v1, then 10 ohms to node v2. 5 ohms from v1 to the bottom wire, 4 ohms from v2 to the bottom wire. Right: 3 A current source, arrow pointing up toward v2. The bottom wire is the reference node."
  });

  var fS3 = circuit({
    w: 505, h: 205, top: [null, R("10 Ω"), null], nodes: [[200, symV("1")], [320, symV("2")]], ground: 260,
    cols: cols(X4, [[V("90 V", "top", "left")], [R("30 Ω")], [R("20 Ω")], [I("3 A", "up")]]),
    aria: "Left: 90 V source, + at the top, wired directly to node v1. 10 ohms from v1 to node v2. 30 ohms from v1 to the bottom wire, 20 ohms from v2 to the bottom wire. Right: 3 A current source, arrow pointing up toward v2. The bottom wire is the reference node."
  });

  var fS4 = circuit({
    w: 505, h: 205, top: [R("4 Ω"), { k: "V", label: "5 V", plus: "right" }, null], nodes: [[200, symV("1")], [320, symV("2")]], ground: 260,
    cols: cols(X4, [[V("40 V", "top", "left")], [R("10 Ω")], [R("5 Ω")], [I("2 A", "up")]]),
    aria: "Left: 40 V source, + at the top. Top wire: 4 ohms to node v1, then a 5 V source to node v2, with its minus terminal at v1 and its plus terminal at v2. 10 ohms from v1 to the bottom wire, 5 ohms from v2 to the bottom wire. Right: 2 A current source, arrow pointing up toward v2. The bottom wire is the reference node."
  });

  var fS5 = circuit({
    w: 505, h: 205, top: [R("3 Ω"), R("2 Ω"), null], nodes: [[200, symV("1")], [320, symV("2")]], ground: 260, more: ixRight(260),
    cols: cols(X4, [[V("72 V", "top", "left")], [R("6 Ω")], [R("4 Ω")], [{ k: "DI", label: TWO_IX, dir: "up" }]]),
    aria: "Left: 72 V source, + at the top. Top wire: 3 ohms to node v1, then 2 ohms to node v2; the current i_x in the 2 ohms is marked with an arrow pointing right, from v1 toward v2. 6 ohms from v1 to the bottom wire, 4 ohms from v2 to the bottom wire. Right: dependent current source (diamond) of value 2 i_x, arrow pointing up toward v2. The bottom wire is the reference node."
  });

  var fS6 = circuit({
    w: 505, h: 205, top: [R("2 Ω"), R("10 Ω"), null], nodes: [[200, symV("1")], [320, symV("2")]], ground: 260, more: ixRight(260),
    cols: cols(X4, [[V("60 V", "top", "left")], [R("10 Ω")], [R("20 Ω")], [R("4 Ω", "right", 80), { k: "DV", label: TWO_IX, plus: "top", y: 140 }]]),
    aria: "Left: 60 V source, + at the top. Top wire: 2 ohms to node v1, then 10 ohms to node v2; the current i_x in that 10 ohms is marked with an arrow pointing right, from v1 toward v2. 10 ohms from v1 to the bottom wire, 20 ohms from v2 to the bottom wire. Right branch from v2 down to the bottom wire: 4 ohms, then a dependent voltage source (diamond) of value 2 i_x, + at its top and minus at its bottom. The bottom wire is the reference node."
  });

  var fS7 = circuit({
    w: 505, h: 185, top: [R("6 Ω"), R("2 Ω")], meshes: [[150, "a"], [370, "b"]],
    cols: cols(X3, [[V("60 V", "top", "left")], [R("6 Ω", "left")], [V("10 V", "top", "right")]]),
    aria: "Two meshes. Left: 60 V source, + at the top. Top wire: 6 ohms, then the middle node, then 2 ohms. Middle branch: 6 ohms. Right: 10 V source, + at the top. Mesh current i_a in the left mesh and i_b in the right mesh, both clockwise."
  });

  var fS8 = circuit({
    w: 505, h: 185, top: [R("5 Ω"), R("4 Ω")], meshes: [[150, "a"], [370, "b"]],
    cols: cols(X3, [[V("60 V", "top", "left")], [R("10 Ω", "left")], [I("3 A", "down")]]),
    aria: "Two meshes. Left: 60 V source, + at the top. Top wire: 5 ohms, then the middle node, then 4 ohms. Middle branch: 10 ohms. Right: 3 A current source, arrow pointing down. Mesh current i_a in the left mesh and i_b in the right mesh, both clockwise."
  });

  var fS9 = circuit({
    w: 505, h: 185, top: [R("3 Ω"), R("2 Ω")], meshes: [[150, "a"], [370, "b"]],
    cols: cols(X3, [[V("50 V", "top", "left")], [I("2 A", "up", "left")], [R("2 Ω")]]),
    aria: "Two meshes. Left: 50 V source, + at the top. Top wire: 3 ohms, then the middle node, then 2 ohms. Middle branch: 2 A current source, arrow pointing up. Right branch: 2 ohms. Mesh current i_a in the left mesh and i_b in the right mesh, both clockwise."
  });

  var fS10 = circuit({
    w: 505, h: 185, top: [R("2 Ω"), R("3 Ω")], meshes: [[150, "a"], [370, "b"]],
    cols: cols(X3, [[V("36 V", "top", "left")], [R("5 Ω", "left")], [{ k: "DV", label: TWO_IX, plus: "top" }]]),
    more: function (d, T, B, M) { // i_x beside the 5 Ω, pointing down (drawn in black in the PDF)
      d.m += ln(280, M - 14, 280, M + 4);
      d.f += head(280, M + 13, 0, 1, 10, 5) + '<text x="290" y="' + (M + 8) + '">' + symI("x") + "</text>";
    },
    aria: "Two meshes. Left: 36 V source, + at the top. Top wire: 2 ohms, then the middle node, then 3 ohms. Middle branch: 5 ohms, with the current i_x in it marked by an arrow pointing down. Right: dependent voltage source (diamond) of value 2 i_x, + at the top. Mesh current i_a in the left mesh and i_b in the right mesh, both clockwise."
  });

  var fS11 = circuit({
    w: 505, h: 205, top: [R("5 Ω"), null, null], nodes: [[200, symV()]], ground: 260,
    cols: cols(X4, [[V("60 V", "top", "left")], [R("10 Ω")], [R("5 Ω")], [I("3 A", "up")]]),
    aria: "Left: 60 V source, + at the top. Top wire: 5 ohms to the top node v. From the top node down to the bottom wire: 10 ohms, 5 ohms, and a 3 A current source with its arrow pointing up. The bottom wire is the reference node."
  });

  var fS12 = circuit({
    w: 505, h: 185, top: [R("4 Ω"), R("5 Ω")], meshes: [[150, "a"], [370, "b"]],
    cols: cols(X3, [[V("80 V", "top", "left")], [R("5 Ω", "left")], [V("30 V", "top", "right")]]),
    aria: "Two meshes. Left: 80 V source, + at the top. Top wire: 4 ohms, then the middle node, then 5 ohms. Middle branch: 5 ohms. Right: 30 V source, + at the top. Mesh current i_a in the left mesh and i_b in the right mesh, both clockwise."
  });

  var fS13 = circuit({
    w: 505, h: 205, top: [R("4 Ω"), null, R("2 Ω")], nodes: [[200, symV()]], ground: 260,
    cols: cols(X4, [[V("60 V", "top", "left")], [R("12 Ω")], [R("6 Ω")], [V("20 V", "top", "right")]]),
    aria: "Left: 60 V source, + at the top. Top wire: 4 ohms to the top node v. From v down to the bottom wire: 12 ohms and 6 ohms. From v, 2 ohms along the top wire to a 20 V source on the right, + at the top. The bottom wire is the reference node."
  });

  var fS15 = circuit({
    w: 540, h: 252, T: 50, B: 200, top: [null, null], nodes: [[280, symV()]], ground: 370,
    cols: cols([100, 280, 460], [
      [R("0.05 Ω", "left", 87), V("12.6 V", "top", "left", 162)],
      [R("0.1 Ω", "right", 87), V("12 V", "top", "right", 162)],
      [R("0.1 Ω", "right", 130)]
    ]),
    more: function (d) {
      d.f += '<text x="100" y="244" text-anchor="middle">good battery</text><text x="280" y="244" text-anchor="middle">flat battery</text>' +
        '<text x="460" y="244" text-anchor="middle">starter</text>';
    },
    aria: "Three branches between the top node v and the bottom wire, the reference node. Good battery, left: 0.05 ohms in series with a 12.6 V source, + at the top. Flat battery, middle: 0.1 ohms in series with a 12 V source, + at the top. Starter, right: 0.1 ohms."
  });

  var fS16 = circuit({
    w: 505, h: 205, top: [R("4 Ω"), R("5 Ω"), null], nodes: [[200, symV("1")], [320, symV("2")]], ground: 260,
    cols: cols(X4, [[V("50 V", "top", "left")], [R("10 Ω")], [R("5 Ω")], [I("2 A", "up")]]),
    aria: "Left: 50 V source, + at the top. Top wire: 4 ohms to node v1, then 5 ohms to node v2. 10 ohms from v1 to the bottom wire, 5 ohms from v2 to the bottom wire. Right: 2 A current source, arrow pointing up toward v2. The bottom wire is the reference node."
  });

  var WORDS = "Answer in words, then compare with the explanation.";
  var LINES5 = ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"];

  E.sheets["4-1"] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. The Part 1 device-free quiz, at the start of week 7, session 1 (Tue 17 Nov), is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Both must be right.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Conventions:</strong> node voltages are measured from the reference node, marked with the ground symbol. In KCL, count currents leaving a node as positive. Mesh currents run clockwise; in KVL, count voltage drops as positive. Check every answer: KCL must hold at every node, and the powers must add to zero.`,
      t`<strong>Powers:</strong> where a part asks for the power absorbed, use the passive sign convention: $p > 0$ means the element absorbs power; $p < 0$ means it delivers power.`,
      t`<strong>Equations:</strong> steps that ask you to write equations have nothing to check online. Write them on paper, then compare with the explanation.`
    ],

    questions: [
      {
        id: "S1", title: "How many equations?", tags: ["Two-tier"], lp: [1],
        prompt: t`How many equations does each method need?`,
        figure: fS1,
        parts: [
          { label: "Answer", options: [
            "Node voltages 3, mesh currents 3",
            "Node voltages 3, mesh currents 2",
            "Node voltages 2, mesh currents 2",
            "Node voltages 2, mesh currents 3"
          ], answer: 2 },
          { label: "Reason", roman: true, options: [
            "One KCL equation for every essential node, the reference included.",
            "Every mesh needs its own KVL equation, whatever it contains.",
            "KCL at every essential node but the reference; a current source in one mesh fixes that mesh current.",
            "Count every node, including those where only two elements meet."
          ], answer: 2 }
        ],
        explain: t`There are three essential nodes: the node between the source and the first resistor joins only two elements, so it is not essential. One of the three is the reference, so the node-voltage method needs 2 equations. There are three meshes, but the current source sits in the right-hand mesh only, so that mesh current is known and the mesh-current method needs 2 equations. (b) counts the reference; (d) forgets the known mesh current; reason (iv) counts the two-element node.`
      },
      {
        id: "S2", title: "The node-voltage method", tags: [], lp: [2, 5, 6],
        prompt: "",
        figure: fS2,
        parts: [
          { label: "a) Write the KCL equations at nodes 1 and 2.", note: true },
          { label: t`b) Solve for $v_1$`, numeric: true, answer: 40, unit: "V" },
          { label: t`b) … and $v_2$`, numeric: true, answer: 20, unit: "V" },
          { label: "c) Power absorbed by the 60 V source (negative if it delivers)", numeric: true, answer: -600, unit: "W" },
          { label: "c) Power absorbed by the 3 A source (negative if it delivers)", numeric: true, answer: -60, unit: "W" },
          { label: "c) Check the power balance: total power absorbed by the four resistors", numeric: true, answer: 660, unit: "W" }
        ],
        explain: t`a) KCL, currents leaving: node 1, $(v_1 - 60)/2 + v_1/5 + (v_1 - v_2)/10 = 0$; node 2, $(v_2 - v_1)/10 + v_2/4 - 3 = 0$ (the 3 A enters node 2). b) $v_1 = 40$ V, $v_2 = 20$ V. c) The 60 V source sends $(60 - 40)/2 = 10$ A out of its + terminal: it delivers 600 W. The 3 A source pushes 3 A up into a 20 V node: it delivers 60 W. The resistors absorb $200 + 320 + 40 + 100 = 660$ W, equal to the $600 + 60$ W delivered.`
      },
      {
        id: "S3", title: "A source to the reference", tags: ["Two-tier"], lp: [1, 2],
        prompt: t`With the bottom node as the reference, how many node-voltage equations must you solve?`,
        figure: fS3,
        parts: [
          { label: "Answer", options: ["2", "1", "3", "0"], answer: 1 },
          { label: "Reason", roman: true, options: [
            "Voltage sources are never part of a node equation.",
            t`The 90 V source fixes $v_1 = 90$ V, so only $v_2$ is unknown.`,
            "Every essential node needs its own equation.",
            t`The 3 A source fixes $v_2$.`
          ], answer: 1 },
          { label: t`Follow-up: find $v_2$`, numeric: true, answer: 80, unit: "V" },
          { label: "Follow-up: the current the 90 V source delivers", numeric: true, answer: 4, unit: "A" },
          { label: t`Follow-up: why does the 30 Ω resistor not appear in your equation for $v_2$?`, note: true, text: WORDS }
        ],
        explain: t`The 90 V source connects node 1 to the reference, so it fixes $v_1 = 90$ V and only $v_2$ is unknown: one equation. KCL at node 2: $(v_2 - 90)/10 + v_2/20 - 3 = 0$ gives $v_2 = 80$ V. The source delivers $90/30 + (90 - 80)/10 = 3 + 1 = 4$ A (360 W). The 30 Ω has 90 V across it whatever $v_2$ is, so it never enters the $v_2$ equation. Reasons (i) and (iv) are false but also point to (b): only the reason catches them.`
      },
      {
        id: "S4", title: "A supernode", tags: [], lp: [2, 5],
        prompt: "",
        figure: fS4,
        parts: [
          { label: "a) Draw the supernode. Write its KCL equation and its constraint equation.", note: true },
          { label: t`b) Find $v_1$`, numeric: true, answer: 20, unit: "V" },
          { label: t`b) … and $v_2$`, numeric: true, answer: 25, unit: "V" },
          { label: "c) Power absorbed by the 5 V source (negative if it delivers)", numeric: true, answer: -15, unit: "W" }
        ],
        explain: t`a) The 5 V source joins nodes 1 and 2, neither of them the reference, so one supernode encloses both nodes and the source. KCL out of the supernode: $(v_1 - 40)/4 + v_1/10 + v_2/5 - 2 = 0$, with the constraint $v_2 - v_1 = 5$. b) $v_1 = 20$ V, $v_2 = 25$ V. c) 5 A arrives at node 1 through the 4 Ω and 2 A leaves through the 10 Ω, so 3 A flows through the 5 V source from node 1 to node 2, entering its − terminal: it delivers 15 W.`
      },
      {
        id: "S5", title: "A node equation with a dependent source", tags: [], lp: [2, 5],
        prompt: "",
        figure: fS5,
        parts: [
          { label: t`a) Write the two KCL equations and the constraint equation for $i_x$.`, note: true },
          { label: t`b) Find $v_1$`, numeric: true, answer: 42, unit: "V" },
          { label: t`b) … $v_2$`, numeric: true, answer: 36, unit: "V" },
          { label: t`b) … and $i_x$`, numeric: true, answer: 3, unit: "A" },
          { label: "c) Power absorbed by the dependent source (negative if it delivers)", numeric: true, answer: -216, unit: "W" }
        ],
        explain: t`a) $(v_1 - 72)/3 + v_1/6 + (v_1 - v_2)/2 = 0$; $(v_2 - v_1)/2 + v_2/4 - 2i_x = 0$; constraint $i_x = (v_1 - v_2)/2$. b) $v_1 = 42$ V, $v_2 = 36$ V, $i_x = 3$ A. c) The source pushes $2i_x = 6$ A up into a 36 V node: it delivers $6 \times 36 = 216$ W. The 72 V source delivers 720 W.`
      },
      {
        id: "S6", title: "A dependent voltage source", tags: [], lp: [2, 5],
        prompt: t`As in Nilsson Example 4.4.`,
        figure: fS6,
        parts: [
          { label: "a) Write the node equations and the constraint equation.", note: true },
          { label: t`b) Find $v_1$`, numeric: true, answer: 45, unit: "V" },
          { label: t`b) … $v_2$`, numeric: true, answer: 15, unit: "V" },
          { label: t`b) … and $i_x$`, numeric: true, answer: 3, unit: "A" },
          { label: "c) The current in the 4 Ω resistor, downward", numeric: true, answer: 2.25, unit: "A" },
          { label: "c) Power absorbed by the dependent source (negative if it delivers)", numeric: true, answer: 13.5, unit: "W" }
        ],
        explain: t`a) $(v_1 - 60)/2 + v_1/10 + (v_1 - v_2)/10 = 0$; $(v_2 - v_1)/10 + v_2/20 + (v_2 - 2i_x)/4 = 0$; constraint $i_x = (v_1 - v_2)/10$. b) $v_1 = 45$ V, $v_2 = 15$ V, $i_x = 3$ A. c) The source is $2i_x = 6$ V; the 4 Ω carries $(15 - 6)/4 = 2.25$ A down into its + terminal, so it absorbs $6 \times 2.25 = 13.5$ W.`
      },
      {
        id: "S7", title: "The mesh-current method", tags: [], lp: [3, 5],
        prompt: "",
        figure: fS7,
        parts: [
          { label: "a) Write the two mesh equations.", note: true },
          { label: t`b) Find $i_a$`, numeric: true, answer: 7, unit: "A" },
          { label: t`b) … $i_b$`, numeric: true, answer: 4, unit: "A" },
          { label: "b) … and the current in the 6 Ω middle resistor, downward", numeric: true, answer: 3, unit: "A" },
          { label: "c) Power absorbed by the 60 V source (negative if it delivers)", numeric: true, answer: -420, unit: "W" },
          { label: "c) Power absorbed by the 10 V source (negative if it delivers)", numeric: true, answer: 40, unit: "W" }
        ],
        explain: t`a) $-60 + 6i_a + 6(i_a - i_b) = 0$; $2i_b + 10 + 6(i_b - i_a) = 0$. b) $i_a = 7$ A, $i_b = 4$ A; the middle 6 Ω carries $i_a - i_b = 3$ A down. c) The 60 V source delivers $60 \times 7 = 420$ W; $i_b = 4$ A enters the 10 V source’s + terminal, so it absorbs 40 W.`
      },
      {
        id: "S8", title: "A current source in one mesh", tags: ["Predict first"], lp: [1, 3, 5],
        prompt: "",
        figure: fS8,
        parts: [
          { label: "Predict first: how many mesh equations do you need?", numeric: true, answer: 1, unit: "" },
          { label: t`a) Find $i_a$`, numeric: true, answer: 6, unit: "A" },
          { label: t`a) … and $i_b$`, numeric: true, answer: 3, unit: "A" },
          { label: "b) The voltage across the 3 A source (+ at its top)", numeric: true, answer: 18, unit: "V" },
          { label: "b) Does it absorb or deliver power? Enter the power absorbed by the 3 A source (negative if it delivers)", numeric: true, answer: 54, unit: "W" }
        ],
        explain: t`One equation. a) The 3 A source is in the right-hand mesh only, and clockwise $i_b$ runs down the right branch, with the source, so $i_b = 3$ A without an equation. Mesh a: $-60 + 5i_a + 10(i_a - 3) = 0$ gives $i_a = 6$ A. b) $v = 10(6 - 3) - 4(3) = 18$ V; 3 A enters the + terminal, so the source absorbs 54 W.`
      },
      {
        id: "S9", title: "A supermesh", tags: [], lp: [3, 5],
        prompt: "",
        figure: fS9,
        parts: [
          { label: "a) Write the supermesh KVL equation and the constraint equation.", note: true },
          { label: t`b) Find $i_a$`, numeric: true, answer: 6, unit: "A" },
          { label: t`b) … and $i_b$`, numeric: true, answer: 8, unit: "A" },
          { label: "c) The voltage across the 2 A source (+ at its top)", numeric: true, answer: 32, unit: "V" },
          { label: "c) Power absorbed by the 2 A source (negative if it delivers)", numeric: true, answer: -64, unit: "W" }
        ],
        explain: t`a) The 2 A source is shared by meshes a and b, so the supermesh goes around the outside of both: $-50 + 3i_a + 2i_b + 2i_b = 0$. The source arrow points up, the direction of $i_b$ in the middle branch, so the constraint is $i_b - i_a = 2$. b) $i_a = 6$ A, $i_b = 8$ A. c) $v = 50 - 3(6) = 32$ V, + at the top; 2 A leaves the + terminal, so the source delivers 64 W.`
      },
      {
        id: "S10", title: "A mesh equation with a dependent source", tags: [], lp: [3, 5],
        prompt: "",
        figure: fS10,
        parts: [
          { label: t`a) Write the two mesh equations and the constraint equation for $i_x$.`, note: true },
          { label: t`b) Find $i_a$`, numeric: true, answer: 8, unit: "A" },
          { label: t`b) … $i_b$`, numeric: true, answer: 4, unit: "A" },
          { label: t`b) … and $i_x$`, numeric: true, answer: 4, unit: "A" },
          { label: "c) Power absorbed by the dependent source (negative if it delivers)", numeric: true, answer: 32, unit: "W" }
        ],
        explain: t`a) $-36 + 2i_a + 5(i_a - i_b) = 0$; $3i_b + 2i_x + 5(i_b - i_a) = 0$; constraint $i_x = i_a - i_b$ (the $i_x$ arrow points down, the direction of $i_a$ in the middle branch). b) $i_a = 8$ A, $i_b = 4$ A, $i_x = 4$ A. c) The source is $2i_x = 8$ V and $i_b = 4$ A enters its + terminal: it absorbs 32 W.`
      },
      {
        id: "S11", title: "Spot the error", tags: ["Spot the error"], lp: [2, 5, 6],
        prompt: t`The worked solution below finds $v$ and the power of the 60 V source. It contains the kind of direction slip AI chat tools often make.`,
        figure: fS11,
        work: [
          t`Reference: bottom node; one unknown, $v$.`,
          t`KCL at the top node, currents leaving: $(v - 60)/5 + v/10 + v/5 - 3 = 0$, so $v = 30$ V.`,
          t`The current in the 5 Ω resistor from the node toward the source is $(30 - 60)/5 = -6$ A.`,
          t`So 6 A flows into the source’s + terminal, and the 60 V source absorbs 360 W.`,
          t`Check: $v = 30$ V is less than 60 V, so the answer is reasonable.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: LINES5, answer: 3 },
          { label: "b) Correct it: the power absorbed by the 60 V source (negative if it delivers)", numeric: true, answer: -360, unit: "W" },
          { label: "c) Check the corrected answer with a power balance: the total power delivered", numeric: true, answer: 450, unit: "W" },
          { label: "d) Line 5 calls itself a check. Why does it prove nothing?", note: true, text: WORDS }
        ],
        explain: t`Line 3 is right: −6 A from the node toward the source means 6 A flows from the source to the node, out of its + terminal, so the 60 V source delivers 360 W; line 4 has the direction backwards. c) Delivered: $360 + 90 = 450$ W (the 3 A source delivers $30 \times 3$); absorbed: $180 + 90 + 180 = 450$ W. d) A value between 0 and 60 V says nothing about the sign of a power; only KCL or a power balance checks it.`
      },
      {
        id: "S12", title: "Spot the error in a mesh solution", tags: ["Spot the error"], lp: [3, 6],
        prompt: "",
        figure: fS12,
        work: [
          t`Mesh a, clockwise, drops positive: $-80 + 4i_a + 5(i_a - i_b) = 0$.`,
          t`Mesh b, clockwise, drops positive: $5i_b + 30 + 5(i_a - i_b) = 0$.`,
          t`Line 2 simplifies to $5i_a = -30$, so $i_a = -6$ A, and line 1 then gives $i_b = -26.8$ A.`,
          t`Both currents are negative, so both meshes really circulate counterclockwise.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4"], answer: 1 },
          { label: t`b) Correct it and find $i_a$`, numeric: true, answer: 10, unit: "A" },
          { label: t`b) … and $i_b$`, numeric: true, answer: 2, unit: "A" },
          { label: "c) Check with a power balance: power absorbed by the 30 V source (negative if it delivers)", numeric: true, answer: 60, unit: "W" },
          { label: "c) … and the total power delivered", numeric: true, answer: 800, unit: "W" }
        ],
        explain: t`Line 2 is wrong: in mesh b’s own direction the shared resistor carries $i_b - i_a$, so the equation is $5i_b + 30 + 5(i_b - i_a) = 0$. Then $i_a = 10$ A, $i_b = 2$ A. Check: the 80 V source delivers 800 W; the resistors absorb $400 + 320 + 20$ W, and the 30 V source absorbs 60 W, 800 W in all.`
      },
      {
        id: "S13", title: "Node voltages or mesh currents?", tags: [], lp: [1, 4, 5],
        prompt: "",
        figure: fS13,
        parts: [
          { label: "a) How many equations does the node-voltage method need?", numeric: true, answer: 1, unit: "" },
          { label: "a) How many does the mesh-current method need?", numeric: true, answer: 3, unit: "" },
          { label: t`b) Solve with the method that needs fewer, and find $v$`, numeric: true, answer: 25, unit: "V" },
          { label: "c) The current in the 20 V source", numeric: true, answer: 2.5, unit: "A" },
          { label: "c) Is the source being charged?", options: ["Yes", "No"], answer: 0 }
        ],
        explain: t`a) Two essential nodes: 1 node equation; three meshes: 3 mesh equations. b) $(v - 60)/4 + v/12 + v/6 + (v - 20)/2 = 0$ gives $v = 25$ V. c) $(25 - 20)/2 = 2.5$ A enters the 20 V source’s + terminal: it is being charged (50 W).`
      },
      {
        id: "S14", title: "Work backwards", tags: [], lp: [3],
        prompt: t`In the <a href="#S7">S7 circuit</a>, replace the 10 V source with an unknown source $V$ (+ at top). What value of $V$ makes the current in the 2 Ω resistor zero?`,
        parts: [{ label: "Answer", options: ["30 V", "60 V", "10 V", "15 V"], answer: 0 }],
        explain: t`With no current in the 2 Ω, $i_b = 0$, so $i_a = 60/12 = 5$ A and the middle 6 Ω has $6 \times 5 = 30$ V across it. The 2 Ω then has no voltage across it, so the source must match the 6 Ω: $V = 30$ V. (b) is the source voltage; (c) the original value.`
      },
      {
        id: "S15", title: "Jump-starting a car", tags: ["Predict first"], lp: [2, 5],
        prompt: t`Each battery’s resistance includes its share of the jumper cables.`,
        figure: fS15,
        parts: [
          { label: t`a) Before cranking, the starter is not connected. Write the node equation and find $v$`, numeric: true, answer: 12.4, unit: "V" },
          { label: "a) What current flows in the flat battery?", numeric: true, answer: 4, unit: "A" },
          { label: "a) In which direction?", options: ["Into its + terminal", "Out of its + terminal"], answer: 0 },
          { label: "a) Is it being charged?", options: ["Yes", "No"], answer: 0 },
          { label: "b) Predict first: while the starter cranks, does the flat battery help or keep charging?", options: ["It helps", "It keeps charging"], answer: 0 },
          { label: t`b) Then find $v$`, numeric: true, answer: 9.3, unit: "V" },
          { label: "b) … the starter current", numeric: true, answer: 93, unit: "A" },
          { label: "b) … the current in the good battery", numeric: true, answer: 66, unit: "A" },
          { label: "b) … and the current in the flat battery", numeric: true, answer: 27, unit: "A" }
        ],
        explain: t`a) $(v - 12.6)/0.05 + (v - 12)/0.1 = 0$ gives $v = 12.4$ V. The flat battery carries $(12.4 - 12)/0.1 = 4$ A into its + terminal: it is being charged. b) Add the starter current $v/0.1$: $(v - 12.6)/0.05 + (v - 12)/0.1 + v/0.1 = 0$ gives $v = 9.3$ V. The starter draws $9.3/0.1 = 93$ A; the good battery supplies $(12.6 - 9.3)/0.05 = 66$ A; the flat battery supplies $(12 - 9.3)/0.1 = 27$ A out of its + terminal: it helps.`
      },
      {
        id: "S16", title: "Check a solution without solving again", tags: [], lp: [6],
        prompt: t`Two classmates report their answers. Student 1: $v_1 = 30$ V, $v_2 = 20$ V. Student 2: $v_1 = 28$ V, $v_2 = 24$ V. Without solving the circuit, use KCL at each node to decide which answer is right.`,
        figure: fS16,
        parts: [{ label: "Which answer is right?", options: ["Student 1", "Student 2"], answer: 0 }],
        explain: t`Substitute each answer into KCL, currents leaving positive. Student 1: node 1, $(30 - 50)/4 + 30/10 + (30 - 20)/5 = -5 + 3 + 2 = 0$; node 2, $(20 - 30)/5 + 20/5 - 2 = 0$. Both hold. Student 2 fails at node 1: $(28 - 50)/4 + 28/10 + (28 - 24)/5 = -5.5 + 2.8 + 0.8 = -1.9$ A, not 0.`
      }
    ]
  };
})(window.EENG);
