// Chapter 5 practice sheet (Lane B: open, AI allowed). Interactive version of "Practice sheet.pdf".
// Question fields:
//   id, title, tags (labels shown), lp (checklist items it practises), prompt, optional figure / table / work / hint
//   parts: every part must be right for the question to count as correct
//     { label, options, answer (index from 0), roman: true for i) ii) … }
//     { label, numeric: true, answer, unit, rel (relative tolerance, default 1%), abs (absolute tolerance) }
//     { label, note: true } for a sub-question with nothing to check; its answer is in explain
//   explain: shown after the student checks
(function (E) {
  var t = String.raw;
  var MINUS = "&#8722;";

  // ---- A small schematic kit for this sheet's op-amp circuits. Lines and text use currentColor. ----
  // Italic symbol with an optional subscript, e.g. sym("v", "o") for v_o.
  function sym(base, sub) {
    return '<tspan font-style="italic">' + base + "</tspan>" +
      (sub ? '<tspan font-size="75%" dy="4" font-style="italic">' + sub + "</tspan>" : "");
  }

  function kit() {
    var w = "", f = "", tx = "";
    var k = {
      // Polyline through (x0, y0, x1, y1, ...).
      wire: function () {
        var a = arguments, p = [];
        for (var i = 0; i < a.length; i += 2) p.push(a[i] + "," + a[i + 1]);
        w += '<polyline points="' + p.join(" ") + '"/>';
        return k;
      },
      text: function (x, y, s, anchor, extra) {
        tx += '<text x="' + x + '" y="' + y + '"' + (anchor && anchor !== "start" ? ' text-anchor="' + anchor + '"' : "") +
          (extra || "") + ">" + s + "</text>";
        return k;
      },
      // Resistor from (x1, y1) to (x2, y2), horizontal or vertical, zigzag in the middle.
      //   side: "above" (default) or "below" for horizontal; "right" (default) or "left" for vertical.
      res: function (x1, y1, x2, y2, label, side) {
        var h = y1 === y2, L = 30, n = 6, amp = 6, pts = [], i;
        var m = h ? (x1 + x2) / 2 : (y1 + y2) / 2, a0 = m - L / 2;
        if (h) {
          pts.push(x1 + "," + y1, a0 + "," + y1);
          for (i = 0; i < n; i++) pts.push((a0 + (2 * i + 1) * L / (2 * n)) + "," + (y1 + (i % 2 ? amp : -amp)));
          pts.push((a0 + L) + "," + y1, x2 + "," + y2);
        } else {
          pts.push(x1 + "," + y1, x1 + "," + a0);
          for (i = 0; i < n; i++) pts.push((x1 + (i % 2 ? -amp : amp)) + "," + (a0 + (2 * i + 1) * L / (2 * n)));
          pts.push(x1 + "," + (a0 + L), x2 + "," + y2);
        }
        w += '<polyline points="' + pts.join(" ") + '"/>';
        if (label) {
          if (h) k.text(m, side === "below" ? y1 + 26 : y1 - 13, label, "middle");
          else if (side === "left") k.text(x1 - 14, m + 5, label, "end");
          else k.text(x1 + 14, m + 5, label);
        }
        return k;
      },
      dot: function (x, y) { f += '<circle cx="' + x + '" cy="' + y + '" r="3.5"/>'; return k; },
      term: function (x, y) { w += '<circle cx="' + x + '" cy="' + y + '" r="4"/>'; return k; },
      // Ground symbol hanging from the wire end at (x, y).
      gnd: function (x, y) {
        w += '<line x1="' + (x - 11) + '" y1="' + y + '" x2="' + (x + 11) + '" y2="' + y + '"/>' +
          '<line x1="' + (x - 7) + '" y1="' + (y + 5) + '" x2="' + (x + 7) + '" y2="' + (y + 5) + '"/>' +
          '<line x1="' + (x - 3) + '" y1="' + (y + 10) + '" x2="' + (x + 3) + '" y2="' + (y + 10) + '"/>';
        return k;
      },
      // Independent voltage source centred at (x, y), radius 16, + at the top. Label on the left or right.
      src: function (x, y, label, side) {
        w += '<circle cx="' + x + '" cy="' + y + '" r="16"/>';
        tx += '<text x="' + x + '" y="' + (y - 2) + '" text-anchor="middle" font-size="15" font-weight="700">+</text>' +
          '<text x="' + x + '" y="' + (y + 12) + '" text-anchor="middle" font-size="15" font-weight="700">' + MINUS + "</text>";
        if (label) k.text(side === "right" ? x + 24 : x - 24, y + 6, label, side === "right" ? "start" : "end");
        return k;
      },
      // Op amp: left edge at x, centre y, output tip at (x + 70, y).
      // Inverting input (−) at (x, y − 20), noninverting input (+) at (x, y + 20).
      // sup: ["+12 V", "−12 V"] draws the supply stubs and labels (omit when the PDF shows none).
      amp: function (x, y, sup) {
        w += '<polygon points="' + x + "," + (y - 40) + " " + x + "," + (y + 40) + " " + (x + 70) + "," + y + '"/>';
        tx += '<text x="' + (x + 10) + '" y="' + (y - 14) + '" text-anchor="middle" font-size="18" font-weight="700">' + MINUS + "</text>" +
          '<text x="' + (x + 10) + '" y="' + (y + 26) + '" text-anchor="middle" font-size="18" font-weight="700">+</text>';
        if (sup) {
          w += '<line x1="' + (x + 28) + '" y1="' + (y - 24) + '" x2="' + (x + 28) + '" y2="' + (y - 38) + '"/>' +
            '<line x1="' + (x + 28) + '" y1="' + (y + 24) + '" x2="' + (x + 28) + '" y2="' + (y + 38) + '"/>';
          k.text(x + 34, y - 30, sup[0], "start", ' font-size="14"');
          k.text(x + 34, y + 44, sup[1], "start", ' font-size="14"');
        }
        return k;
      },
      // Output terminal at (xt, y), wired from the output node at x1, with + name − and the ground reference below.
      out: function (x1, y, xt, name) {
        k.wire(x1, y, xt - 4, y).term(xt, y);
        tx += '<text x="' + (xt + 8) + '" y="' + (y + 24) + '" text-anchor="middle" font-size="18" font-weight="700">+</text>' +
          '<text x="' + (xt + 16) + '" y="' + (y + 42) + '">' + name + "</text>" +
          '<text x="' + (xt + 8) + '" y="' + (y + 60) + '" text-anchor="middle" font-size="18" font-weight="700">' + MINUS + "</text>";
        return k.term(xt, y + 72).wire(xt, y + 76, xt, y + 84).gnd(xt, y + 84);
      },
      svg: function (vw, vh, label) {
        return '<svg class="fig" viewBox="0 0 ' + vw + " " + vh + '" width="' + vw + '" role="img" aria-label="' + label + '">' +
          '<g stroke="currentColor" stroke-width="2.2" fill="none" stroke-linejoin="round">' + w + "</g>" +
          '<g fill="currentColor">' + f + "</g>" +
          '<g fill="currentColor" font-size="16">' + tx + "</g></svg>";
      }
    };
    return k;
  }

  var VO = sym("v", "o");
  function supplies(v) { return ["+" + v + " V", MINUS + v + " V"]; }

  // Source → R1 → inverting input; R2 from the inverting input to the output.
  // o: { src, rin, rf, plus (label of a source on the + input; omit to ground it), sup, load, aria }
  function invFig(o) {
    var k = kit(), X = 220, Y = 130, xt = 365;
    k.src(75, 185, o.src).wire(75, 169, 75, 110).res(75, 110, 190, 110, o.rin).dot(190, 110).wire(190, 110, X, 110);
    k.wire(75, 201, 75, 236).gnd(75, 236);
    k.wire(190, 110, 190, 60).res(190, 60, 320, 60, o.rf).wire(320, 60, 320, Y);
    k.amp(X, Y, o.sup).wire(X + 70, Y, 320, Y).dot(320, Y);
    if (o.plus) k.wire(X, 150, 160, 150, 160, 184).src(160, 200, o.plus, "right").wire(160, 216, 160, 236).gnd(160, 236);
    else k.wire(X, 150, 185, 150, 185, 175).gnd(185, 175);
    if (o.load) {
      k.dot(380, Y).res(380, Y, 380, 215, o.load).gnd(380, 215);
      xt = 440;
    }
    k.out(320, Y, xt, VO);
    return k.svg(xt + 50, 255, o.aria);
  }

  // Noninverting: R1 from ground to the inverting input, R2 feedback, source through Rin to the + input.
  function nonInvFig(o) {
    var k = kit(), X = 220, Y = 130;
    k.res(110, 110, 190, 110, o.r1).wire(110, 110, 110, 118).gnd(110, 118).dot(190, 110).wire(190, 110, X, 110);
    k.wire(190, 110, 190, 60).res(190, 60, 320, 60, o.rf).wire(320, 60, 320, Y);
    k.amp(X, Y).wire(X + 70, Y, 320, Y).dot(320, Y);
    k.src(75, 190, o.src).wire(75, 174, 75, 150).res(75, 150, X, 150, o.rin, "below");
    k.wire(75, 206, 75, 236).gnd(75, 236);
    k.out(320, Y, 365, VO);
    return k.svg(415, 255, o.aria);
  }

  // Difference amplifier: terminal a → Ra → (−), terminal b → Rb → (+), Rg from (+) to ground, Rf feedback.
  function diffFig(o) {
    var k = kit(), X = 220, Y = 130;
    k.term(60, 110).res(64, 110, 190, 110, o.ra).dot(190, 110).wire(190, 110, X, 110).text(48, 116, o.a, "end");
    k.term(60, 150).res(64, 150, 190, 150, o.rb, "below").dot(190, 150).wire(190, 150, X, 150).text(48, 156, o.b, "end");
    k.res(190, 150, 190, 235, o.rg, "left").gnd(190, 235);
    k.wire(190, 110, 190, 60).res(190, 60, 320, 60, o.rf).wire(320, 60, 320, Y);
    k.amp(X, Y, o.sup).wire(X + 70, Y, 320, Y).dot(320, Y);
    k.out(320, Y, 365, VO);
    return k.svg(415, 255, o.aria);
  }

  var figS1 = nonInvFig({
    r1: "5 kΩ", rf: "15 kΩ", rin: "10 kΩ", src: sym("v", "s"),
    aria: "Noninverting amplifier. Source v_s, plus at the top, drives the noninverting (+) input through 10 kΩ. A 5 kΩ resistor runs from ground to the inverting (−) input, and 15 kΩ runs from the inverting input to the output. Output v_o is measured from ground."
  });

  var figS2 = invFig({
    src: sym("v", "s"), rin: "4 kΩ", rf: "24 kΩ", sup: supplies(12),
    aria: "Inverting amplifier with supplies +12 V and −12 V. Source v_s, plus at the top, connects through 4 kΩ to the inverting (−) input; 24 kΩ runs from the inverting input to the output; the noninverting (+) input is grounded. Output v_o is measured from ground."
  });

  var figS3 = (function () {
    var k = kit(), X = 220, Y = 160;
    [[70, "a", "20 kΩ"], [105, "b", "30 kΩ"], [140, "c", "15 kΩ"]].forEach(function (r) {
      k.term(60, r[0]).res(64, r[0], 170, r[0], r[2]).dot(170, r[0]).text(48, r[0] + 6, sym("v", r[1]), "end");
    });
    k.wire(170, 40, 170, 140).wire(170, 140, X, 140);
    k.res(170, 40, 330, 40, "60 kΩ").wire(330, 40, 330, Y);
    k.amp(X, Y, supplies(15)).wire(X + 70, Y, 330, Y).dot(330, Y);
    k.wire(X, 180, 185, 180, 185, 205).gnd(185, 205);
    k.out(330, Y, 375, VO);
    return k.svg(425, 265, "Summing amplifier with supplies +15 V and −15 V. Inputs v_a through 20 kΩ, v_b through 30 kΩ and v_c through 15 kΩ all meet at the inverting (−) input; 60 kΩ runs from the inverting input to the output; the noninverting (+) input is grounded. Output v_o is measured from ground.");
  })();

  var figS4 = nonInvFig({
    r1: sym("R", "s"), rf: "20 kΩ", rin: "10 kΩ", src: sym("v", "g"),
    aria: "Noninverting amplifier. Source v_g, plus at the top, drives the noninverting (+) input through 10 kΩ. Resistor R_s runs from ground to the inverting (−) input, and 20 kΩ runs from the inverting input to the output. Output v_o is measured from ground."
  });

  var figS5 = diffFig({
    a: sym("v", "a"), b: sym("v", "b"), ra: "5 kΩ", rb: "5 kΩ", rg: "25 kΩ", rf: "25 kΩ", sup: supplies(10),
    aria: "Difference amplifier with supplies +10 V and −10 V. Input v_a connects through 5 kΩ to the inverting (−) input; 25 kΩ runs from the inverting input to the output. Input v_b connects through 5 kΩ to the noninverting (+) input, which has 25 kΩ to ground. Output v_o is measured from ground."
  });

  var figS6 = invFig({
    src: sym("v", "a"), rin: "10 kΩ", rf: "30 kΩ", plus: sym("v", "b"), sup: supplies(10),
    aria: "Op amp with supplies +10 V and −10 V. Source v_a, plus at the top, connects through 10 kΩ to the inverting (−) input; 30 kΩ runs from the inverting input to the output. Source v_b, plus at the top, connects directly to the noninverting (+) input. Output v_o is measured from ground."
  });

  var figS7 = (function () {
    var k = kit();
    k.src(75, 130, "60 V").wire(75, 114, 75, 50, 145, 50).res(145, 50, 145, 130, "110 kΩ").dot(145, 130)
      .res(145, 130, 145, 210, "10 kΩ").gnd(145, 210).wire(75, 146, 75, 210).gnd(75, 210);
    k.wire(145, 130, 285, 130);
    k.amp(285, 110).wire(355, 110, 430, 110).dot(380, 110).wire(380, 110, 380, 50, 260, 50, 260, 90, 285, 90);
    k.dot(430, 110).res(430, 110, 430, 190, "10 kΩ").gnd(430, 190).text(430, 225, "display input", "middle", ' font-size="14"');
    return k.svg(500, 235, "Battery monitor. A 60 V source, plus at the top, feeds a divider: 110 kΩ on top and 10 kΩ to ground. The divider midpoint connects to the noninverting (+) input of an op amp whose output is wired straight back to its inverting (−) input, a voltage follower. The op amp output drives the display input, a 10 kΩ resistor to ground.");
  })();

  var figS9 = invFig({
    src: "2 V", rin: "4 kΩ", rf: "12 kΩ", load: "3 kΩ",
    aria: "Inverting amplifier. A 2 V source, plus at the top, connects through 4 kΩ to the inverting (−) input; 12 kΩ runs from the inverting input to the output; the noninverting (+) input is grounded. A 3 kΩ load runs from the output to ground. Output v_o is measured from ground."
  });

  var figS10 = (function () {
    var k = kit();
    // Stage 1: inverting, op amp at (150, 130).
    k.src(55, 165, sym("v", "s")).wire(55, 149, 55, 110).res(55, 110, 125, 110, "10 kΩ").dot(125, 110).wire(125, 110, 150, 110);
    k.wire(55, 181, 55, 215).gnd(55, 215);
    k.wire(125, 110, 125, 65).res(125, 65, 245, 65, "20 kΩ").wire(245, 65, 245, 130);
    k.amp(150, 130).wire(150, 150, 125, 150, 125, 172).gnd(125, 172);
    k.wire(220, 130, 285, 130, 285, 175, 430, 175).dot(245, 130).text(252, 122, sym("v", "o1"));
    // Stage 2: noninverting, op amp at (430, 155); v_o1 drives its + input.
    k.res(320, 135, 405, 135, "5 kΩ").wire(320, 135, 320, 141).gnd(320, 141).dot(405, 135).wire(405, 135, 430, 135);
    k.wire(405, 135, 405, 95).res(405, 95, 525, 95, "10 kΩ").wire(525, 95, 525, 155);
    k.amp(430, 155).wire(500, 155, 525, 155).dot(525, 155);
    k.out(525, 155, 565, sym("v", "o2"));
    return k.svg(620, 255, "Two op amps in cascade. Stage 1: source v_s, plus at the top, connects through 10 kΩ to the inverting (−) input; 20 kΩ runs from that input to the stage 1 output v_o1; the noninverting (+) input is grounded. Stage 2: v_o1 drives the noninverting (+) input; 5 kΩ runs from ground to the inverting (−) input, and 10 kΩ from that input to the output v_o2, measured from ground.");
  })();

  var figS11 = invFig({
    src: "3 V", rin: "10 kΩ", rf: "40 kΩ", plus: "1 V", sup: supplies(15),
    aria: "Op amp with supplies +15 V and −15 V. A 3 V source, plus at the top, connects through 10 kΩ to the inverting (−) input; 40 kΩ runs from the inverting input to the output. A 1 V source, plus at the top, connects to the noninverting (+) input. Output v_o is measured from ground."
  });

  var figS12 = diffFig({
    a: "1 V", b: "2 V", ra: "10 kΩ", rb: "10 kΩ", rg: "20 kΩ", rf: "40 kΩ",
    aria: "Op amp. A 1 V input connects through 10 kΩ to the inverting (−) input; 40 kΩ runs from the inverting input to the output. A 2 V input connects through 10 kΩ to the noninverting (+) input, which has 20 kΩ to ground. Output v_o is measured from ground."
  });

  var figS14 = invFig({
    src: MINUS + "0.5 V", rin: "10 kΩ", rf: sym("R", "x"), sup: supplies(10),
    aria: "Inverting amplifier with supplies +10 V and −10 V. A −0.5 V source, plus at the top, connects through 10 kΩ to the inverting (−) input; resistor R_x runs from the inverting input to the output; the noninverting (+) input is grounded. Output v_o is measured from ground."
  });

  var figS16 = invFig({
    src: "1.5 V", rin: "5 kΩ", rf: "20 kΩ", plus: "0.5 V",
    aria: "Op amp. A 1.5 V source, plus at the top, connects through 5 kΩ to the inverting (−) input; 20 kΩ runs from the inverting input to the output. A 0.5 V source, plus at the top, connects to the noninverting (+) input. Output v_o is measured from ground."
  });

  var TOWARD_OUT = t`From the inverting input toward the output`;
  var TOWARD_IN = t`From the output toward the inverting input`;

  E.sheets[5] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. The device-free quiz at the start of week 11, session 1 (Thu 17 Dec), is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Get both right; on the quiz each earns half the marks.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Conventions:</strong> every op amp is ideal: no current enters either input, and with negative feedback in the linear region the two input voltages are equal ($v_n = v_p$). The output stays between the supply voltages; outside that range the op amp saturates. Voltages are measured from the ground symbol, and resistances are in kilohms, so currents come out in milliamperes. Check every answer: KCL at the inverting input must hold, and $v_o$ must lie between the supplies.`
    ],

    questions: [
      {
        id: "S1", title: "Which configuration?", tags: ["Two-tier"], lp: [1, 2],
        prompt: t`What is this circuit, and what is $v_o/v_s$?`,
        figure: figS1,
        parts: [
          { label: "Answer", options: ["Inverting amplifier, −3", "Noninverting amplifier, 4", "Noninverting amplifier, 3", "Difference amplifier, 3"], answer: 1 },
          { label: "Reason", roman: true, options: [
            "Every op-amp amplifier inverts, because the feedback goes to the inverting input.",
            t`The source drives the noninverting input; the feedback divider gives $v_n = v_o \times 5/(5 + 15)$, and $v_n = v_p = v_s$.`,
            "The gain is always the feedback resistance divided by the input resistance.",
            "Any circuit with resistors on both inputs is a difference amplifier."
          ], answer: 1 },
          { label: "Follow-up: does the 10 kΩ resistor change the gain?", options: ["Yes", "No"], answer: 1 }
        ],
        explain: t`The source drives the noninverting input, and the 15 kΩ and 5 kΩ form a divider from the output back to the inverting input: $v_n = v_o \times 5/(5 + 15) = v_o/4$. With $v_n = v_p = v_s$, the circuit is a noninverting amplifier with $v_o/v_s = 1 + 15/5 = 4$. Reason (i) leads to (a), reason (iii) to (c), and reason (iv) to (d). Follow-up: no. No current enters the noninverting input, so no current flows in the 10 kΩ; it drops no voltage, and $v_p = v_s$.`
      },
      {
        id: "S2", title: "The inverting amplifier", tags: ["Predict first"], lp: [3, 4],
        prompt: t`As in Nilsson Example 5.2.`,
        figure: figS2,
        parts: [
          { label: t`a) Find $v_o$ for $v_s = 1.5$ V.`, numeric: true, answer: -9, unit: "V" },
          { label: "b) Find the current in the 24 kΩ resistor (its size)…", numeric: true, answer: 0.375, unit: "mA", rel: 0.02 },
          { label: "b) …and its direction.", options: [TOWARD_OUT, TOWARD_IN], answer: 0 },
          { label: t`c) What range of $v_s$ keeps the op amp in its linear region? Lowest $v_s$:`, numeric: true, answer: -2, unit: "V" },
          { label: t`c) Highest $v_s$:`, numeric: true, answer: 2, unit: "V" },
          { label: t`d) Predict first: what is $v_o$ for $v_s = 3$ V?`, numeric: true, answer: -12, unit: "V" }
        ],
        explain: t`a) $v_o = -(24/4)(1.5) = -9$ V, which lies inside ±12 V. b) With $v_n = 0$, the 24 kΩ carries $(0 - (-9))/24 = 0.375$ mA, from the inverting input through the 24 kΩ toward the output. It is the same current that arrives through the 4 kΩ: $1.5/4 = 0.375$ mA. c) $v_o = -6v_s$ must stay between −12 V and +12 V, so $-2$ V $\le v_s \le 2$ V. d) The formula gives −18 V, which is outside the supplies, so the op amp saturates: $v_o = -12$ V.`
      },
      {
        id: "S3", title: "The summing amplifier", tags: [], lp: [2, 3, 4],
        prompt: t`As in Nilsson Example 5.3.`,
        figure: figS3,
        parts: [
          { label: t`a) Write $v_o$ in terms of $v_a$, $v_b$ and $v_c$, and find $v_o$ for $v_a = 1$ V, $v_b = 2$ V and $v_c = -1.5$ V.`, numeric: true, answer: -1, unit: "V" },
          { label: t`b) With $v_a = 1$ V and $v_c = -1.5$ V, what range of $v_b$ keeps the op amp linear? Lowest $v_b$:`, numeric: true, answer: -6, unit: "V" },
          { label: t`b) Highest $v_b$:`, numeric: true, answer: 9, unit: "V" },
          { label: t`c) With $v_a = 2$ V, $v_b = 1$ V and $v_c = -1$ V, how large can the feedback resistor be before the op amp saturates?`, numeric: true, answer: 225, unit: "kΩ" }
        ],
        explain: t`Each input is scaled by the 60 kΩ over its own resistor, then added and inverted: $v_o = -(3v_a + 2v_b + 4v_c)$. a) $v_o = -(3 + 4 - 6) = -1$ V. b) $v_o = -(3 + 2v_b - 6) = 3 - 2v_b$, which must stay between −15 V and +15 V: $-6$ V $\le v_b \le 9$ V. c) With $R_f$ in kΩ, $v_o = -R_f(2/20 + 1/30 - 1/15) = -R_f/15$. Keeping $|v_o| \le 15$ V gives $R_f \le 225$ kΩ.`
      },
      {
        id: "S4", title: "The noninverting amplifier", tags: [], lp: [1, 3, 4],
        prompt: t`As in Nilsson Example 5.4.`,
        figure: figS4,
        parts: [
          { label: t`a) Choose $R_s$ for a gain of 5.`, numeric: true, answer: 5, unit: "kΩ" },
          { label: t`b) $v_g$ ranges from −2 V to +2.5 V. What are the smallest equal supply voltages ($\pm V_{CC}$) that keep the op amp linear? $V_{CC}$ =`, numeric: true, answer: 12.5, unit: "V" },
          { label: "c) What current flows in the 10 kΩ resistor?", numeric: true, answer: 0, unit: "mA", abs: 0.001 },
          { label: t`c) What does that resistor do to $v_o$?`, options: [t`It lowers $v_o$`, t`It raises $v_o$`, t`Nothing: it does not change $v_o$`], answer: 2 }
        ],
        explain: t`a) $1 + 20/R_s = 5$, so $R_s = 5$ kΩ. b) With a gain of 5, $v_o$ runs from −10 V to +12.5 V. Equal supplies must cover the larger of the two, so ±12.5 V. c) None: no current enters the noninverting input, so the 10 kΩ carries no current, drops no voltage, and $v_p = v_g$. It does not change $v_o$.`
      },
      {
        id: "S5", title: "The difference amplifier", tags: [], lp: [2, 3, 4],
        prompt: t`As in Nilsson Example 5.5.`,
        figure: figS5,
        parts: [
          { label: "a) Name the configuration…", options: ["Inverting amplifier", "Summing amplifier", "Noninverting amplifier", "Difference amplifier"], answer: 3 },
          { label: t`a) …and write $v_o$ in terms of $v_a$ and $v_b$: $v_o = K(v_b - v_a)$ with $K$ =`, numeric: true, answer: 5, unit: "V/V" },
          { label: t`b) Find $v_o$ for $v_a = 2$ V and $v_b = 2.8$ V.`, numeric: true, answer: 4, unit: "V" },
          { label: t`c) With $v_b = 2.4$ V, what range of $v_a$ keeps the op amp linear? Lowest $v_a$:`, numeric: true, answer: 0.4, unit: "V" },
          { label: t`c) Highest $v_a$:`, numeric: true, answer: 4.4, unit: "V" }
        ],
        explain: t`a) A difference amplifier with matched ratios ($5/25 = 5/25$), so $v_o = (25/5)(v_b - v_a) = 5(v_b - v_a)$. b) $v_o = 5(2.8 - 2) = 4$ V. c) $5(2.4 - v_a)$ must stay between −10 V and +10 V: $0.4$ V $\le v_a \le 4.4$ V.`
      },
      {
        id: "S6", title: "Both inputs driven", tags: [], lp: [1, 3, 4],
        prompt: t`As in Nilsson Example 5.1.`,
        figure: figS6,
        parts: [
          { label: t`a) Find $v_o$ for $v_a = 2$ V and $v_b = 0$ V.`, numeric: true, answer: -6, unit: "V" },
          { label: t`b) Repeat for $v_a = 2$ V and $v_b = 1$ V.`, numeric: true, answer: -2, unit: "V" },
          { label: t`b) Why is $v_n$ no longer 0? What is it now?`, numeric: true, answer: 1, unit: "V" },
          { label: t`c) With $v_a = 1.5$ V, what range of $v_b$ avoids saturation? Lowest $v_b$:`, numeric: true, answer: -1.375, unit: "V" },
          { label: t`c) Highest $v_b$:`, numeric: true, answer: 3.625, unit: "V" }
        ],
        explain: t`With $v_n = v_p = v_b$, KCL at the inverting input gives $(v_b - v_a)/10 + (v_b - v_o)/30 = 0$, so $v_o = v_b + 3(v_b - v_a) = 4v_b - 3v_a$. a) $v_o = -6$ V. b) $v_o = 4 - 6 = -2$ V. Now $v_n = v_p = 1$ V, because $v_p$ is no longer grounded: it sits at $v_b$. c) $v_o = 4v_b - 4.5$ must stay between −10 V and +10 V: $-1.375$ V $\le v_b \le 3.625$ V.`
      },
      {
        id: "S7", title: "A buffer for a battery monitor", tags: ["Predict first"], lp: [1, 5],
        prompt: t`A 48 V solar battery bank can reach 60 V. A divider scales it down for a display that reads 0 to 5 V.`,
        figure: figS7,
        parts: [
          { label: "a) Without the op amp, the display is connected straight across the 10 kΩ. Predict first: will it read 5 V?", options: ["Yes", "No"], answer: 1 },
          { label: "a) Then find what it reads at 60 V.", numeric: true, answer: 2.609, unit: "V" },
          { label: "b) With the op amp in place, what does the display read?", numeric: true, answer: 5, unit: "V" },
          { label: "b) Why does the display no longer load the divider?", note: true },
          { label: "c) Where does the 0.5 mA in the display come from?", options: ["From the divider", "From the op amp’s output, powered by its supplies"], answer: 1 }
        ],
        explain: t`a) No. The display’s 10 kΩ sits in parallel with the lower 10 kΩ of the divider: $10 \parallel 10 = 5$ kΩ, so it reads $60 \times 5/115 = 2.61$ V, about half of what it should. b) 5 V. The op-amp input draws no current, so nothing is connected across the lower 10 kΩ: the divider gives $60 \times 10/120 = 5$ V and the follower copies it to the display. c) From the op amp’s output, powered by its supplies. The display draws 5 V / 10 kΩ = 0.5 mA, and none of it is taken from the divider.`
      },
      {
        id: "S8", title: "Saturation", tags: ["Two-tier"], lp: [1, 4],
        prompt: t`An inverting amplifier has $R_s = 2$ kΩ and $R_f = 20$ kΩ, with supplies ±12 V. What is $v_o$ for $v_s = 1.5$ V?`,
        parts: [
          { label: "Answer", options: ["+12 V", "−15 V", "−12 V", "0 V"], answer: 2 },
          { label: "Reason", roman: true, options: [
            t`$v_o = -(R_f/R_s)v_s$ holds for every input.`,
            "A saturated op amp gives zero output.",
            "The output cannot pass a supply voltage, so it stops at the negative supply.",
            "A saturated op amp flips to the opposite supply."
          ], answer: 2 },
          { label: t`Follow-up: while saturated, is $v_n$ still 0 V?`, options: ["Yes", "No"], answer: 1 },
          { label: t`Follow-up: find $v_n$.`, numeric: true, answer: 0.273, unit: "V", rel: 0.02 }
        ],
        explain: t`The formula gives $-(20/2)(1.5) = -15$ V, which is beyond −12 V, so the op amp saturates and $v_o = -12$ V. (b) uses the formula without checking the supplies; (a) flips to the opposite supply; (d) is zero. Follow-up: no. Once the op amp saturates, $v_n = v_p$ no longer holds. The 2 kΩ and 20 kΩ form a divider between $v_s = 1.5$ V and $v_o = -12$ V: $v_n = 1.5 + (-13.5)(2/22) = 0.27$ V.`
      },
      {
        id: "S9", title: "The output current", tags: [], lp: [3, 5],
        prompt: "",
        figure: figS9,
        parts: [
          { label: t`a) Find $v_o$.`, numeric: true, answer: -6, unit: "V" },
          { label: "b) Find the current in the 3 kΩ load (its size)…", numeric: true, answer: 2, unit: "mA" },
          { label: "b) …and its direction.", options: ["Up from ground into the output node", "Down from the output node to ground"], answer: 0 },
          { label: "b) Find the current in the 12 kΩ resistor (its size)…", numeric: true, answer: 0.5, unit: "mA" },
          { label: "b) …and its direction.", options: [TOWARD_OUT, TOWARD_IN], answer: 0 },
          { label: "c) Find the current at the op amp’s output terminal (its size)…", numeric: true, answer: 2.5, unit: "mA" },
          { label: "c) …and its direction.", options: ["Into the output terminal: the op amp sinks it", "Out of the output terminal: the op amp sources it"], answer: 0 },
          { label: "c) No current enters the inputs: why can the output carry current?", note: true }
        ],
        explain: t`a) $v_o = -(12/4)(2) = -6$ V. b) The 3 kΩ has −6 V across it, so it carries $6/3 = 2$ mA up from ground into the output node. The 12 kΩ carries $(0 - (-6))/12 = 0.5$ mA from the inverting input toward the output: the same 0.5 mA that arrives through the 4 kΩ. c) KCL at the output node: $2 + 0.5 = 2.5$ mA flows into the output terminal, so the op amp sinks it. The inputs draw no current, but the output is connected inside the op amp to its supplies, and the current flows through them.`
      },
      {
        id: "S10", title: "Two op amps in cascade", tags: [], lp: [4, 6],
        prompt: t`Both op amps use ±9 V supplies.`,
        figure: figS10,
        parts: [
          { label: t`a) Find $v_{o1}$ for $v_s = 0.4$ V…`, numeric: true, answer: -0.8, unit: "V" },
          { label: t`a) …and $v_{o2}$.`, numeric: true, answer: -2.4, unit: "V" },
          { label: t`b) Repeat for $v_s = 2$ V: $v_{o1}$ =`, numeric: true, answer: -4, unit: "V" },
          { label: t`b) $v_{o2}$ =`, numeric: true, answer: -9, unit: "V" },
          { label: "b) Which stage saturates?", options: ["The first stage", "The second stage", "Both stages", "Neither stage"], answer: 1 },
          { label: t`c) What range of $v_s$ keeps both stages linear? Lowest $v_s$:`, numeric: true, answer: -1.5, unit: "V" },
          { label: t`c) Highest $v_s$:`, numeric: true, answer: 1.5, unit: "V" }
        ],
        explain: t`The first stage is an inverting amplifier with gain $-20/10 = -2$; the second is a noninverting amplifier with gain $1 + 10/5 = 3$. a) $v_{o1} = -0.8$ V and $v_{o2} = 3(-0.8) = -2.4$ V. b) $v_{o1} = -4$ V, but $3(-4) = -12$ V is beyond −9 V: the second stage saturates at $v_{o2} = -9$ V. c) The overall gain is $-6$, so $|6v_s| \le 9$ V: $-1.5$ V $\le v_s \le 1.5$ V. The first stage alone would stay linear up to ±4.5 V, so the second stage limits the range.`
      },
      {
        id: "S11", title: "Spot the error", tags: ["Spot the error"], lp: [1, 3],
        prompt: t`The worked solution below finds $v_o$. It contains the kind of direction slip AI chat tools often make.`,
        figure: figS11,
        work: [
          t`Assume the op amp is linear, so $v_n = v_p$ (this is checked in line 5).`,
          t`$v_p = 1$ V, so $v_n = 1$ V.`,
          t`The current from the 3 V source into the inverting node is $(3 - 1)/10 = 0.2$ mA.`,
          t`It flows on through the 40 kΩ to the output, so $v_o = 1 + 0.2 \times 40 = 9$ V.`,
          t`Check: 9 V lies inside ±15 V, so the op amp is linear and the answer stands.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"], answer: 3 },
          { label: t`b) Correct it and find $v_o$.`, numeric: true, answer: -7, unit: "V" },
          { label: "c) Check your answer with KCL at the inverting input.", note: true },
          { label: "d) Line 5 calls itself a check. Why does it prove nothing?", note: true }
        ],
        explain: t`a) Line 4. The current flows from the inverting node through the 40 kΩ toward the output, so the output is <em>below</em> the node, not above it. b) $v_o = 1 - 0.2 \times 40 = -7$ V. c) Currents leaving the inverting node: $(1 - 3)/10 + (1 - (-7))/40 = -0.2 + 0.2 = 0$, so KCL holds. d) A value inside the supplies says nothing about its sign: 9 V and −7 V both lie inside ±15 V, so line 5 cannot tell the right answer from the wrong one.`
      },
      {
        id: "S12", title: "Spot the error in a difference amplifier", tags: ["Spot the error"], lp: [2, 3],
        prompt: "",
        figure: figS12,
        work: [
          t`This is a difference amplifier, so $v_o = (40/10)(v_b - v_a)$.`,
          t`So $v_o = 4(2 - 1) = 4$ V.`,
          t`Check: 4 V lies inside any usual supply range.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3"], answer: 0 },
          { label: t`b) Find $v_p$…`, numeric: true, answer: 1.333, unit: "V" },
          { label: t`b) …then $v_o$.`, numeric: true, answer: 2.667, unit: "V" },
          { label: "c) What resistor value at the noninverting input would make line 1 correct?", numeric: true, answer: 40, unit: "kΩ" }
        ],
        explain: t`a) Line 1. The difference-amplifier formula needs matched ratios, $10/40 = 10/20$, which fails. b) No current enters the noninverting input, so the 10 kΩ and 20 kΩ divide the 2 V: $v_p = 2 \times 20/30 = 1.33$ V. With $v_n = v_p$, KCL at the inverting input gives $v_o = 1.33 \times 5 - 4 \times 1 = 2.67$ V. c) 40 kΩ, so that the ratios match: $10/40 = 10/40$.`
      },
      {
        id: "S13", title: "Design a summing amplifier", tags: [], lp: [2, 3, 4],
        prompt: t`Design a summing amplifier with $v_o = -(2v_a + 5v_b)$, using a 100 kΩ feedback resistor and ±12 V supplies.`,
        parts: [
          { label: t`a) Choose the input resistors. For $v_a$:`, numeric: true, answer: 50, unit: "kΩ" },
          { label: t`a) For $v_b$:`, numeric: true, answer: 20, unit: "kΩ" },
          { label: t`b) With $v_a = 1$ V, what range of $v_b$ keeps the op amp linear? Lowest $v_b$:`, numeric: true, answer: -2.8, unit: "V" },
          { label: t`b) Highest $v_b$:`, numeric: true, answer: 2, unit: "V" },
          { label: t`c) Find the current in the feedback resistor for $v_a = 1$ V and $v_b = 1$ V (its size)…`, numeric: true, answer: 0.07, unit: "mA" },
          { label: "c) …and its direction.", options: [TOWARD_OUT, TOWARD_IN], answer: 0 }
        ],
        explain: t`a) Each gain is the 100 kΩ over the input resistor: $R_a = 100/2 = 50$ kΩ and $R_b = 100/5 = 20$ kΩ. b) $v_o = -2 - 5v_b$ must stay between −12 V and +12 V: $-2.8$ V $\le v_b \le 2$ V. c) $v_o = -(2 + 5) = -7$ V, so the feedback resistor carries $(0 - (-7))/100 = 0.07$ mA from the inverting input toward the output.`
      },
      {
        id: "S14", title: "Work backwards", tags: [], lp: [3, 4],
        prompt: "",
        figure: figS14,
        parts: [
          { label: t`a) Find $v_o$ when $R_x = 150$ kΩ.`, numeric: true, answer: 7.5, unit: "V" },
          { label: t`b) How large can $R_x$ be before the op amp saturates?`, numeric: true, answer: 200, unit: "kΩ" },
          { label: t`c) What happens to $v_o$ if $R_x$ is made larger still?`, options: [
            t`It keeps rising in proportion to $R_x$`,
            "It stays at +10 V (saturated)",
            "It drops to 0 V",
            "It flips to −10 V"
          ], answer: 1 }
        ],
        explain: t`a) $v_o = -(150/10)(-0.5) = 7.5$ V. b) With $R_x$ in kΩ, $v_o = -(R_x/10)(-0.5) = 0.05R_x$, which must not pass +10 V: $R_x \le 200$ kΩ. c) It stays at +10 V: the op amp is saturated, and a larger $R_x$ cannot push the output past its supply.`
      },
      {
        id: "S15", title: "From a sensor to a microcontroller", tags: [], lp: [3, 4],
        prompt: t`As in Nilsson’s Practical Perspective for this chapter. A temperature sensor gives 10 mV per °C, so 0 to 100 °C gives 0 to 1 V. The microcontroller’s analog input reads 0 to 5 V.`,
        parts: [
          { label: "a) What gain maps 0–1 V onto 0–5 V?", numeric: true, answer: 5, unit: "V/V" },
          { label: t`a) Design a noninverting amplifier for it with a 40 kΩ feedback resistor: $R_s$ =`, numeric: true, answer: 10, unit: "kΩ" },
          { label: "b) The amplifier’s supplies are 0 V and +5 V. What does it output at 120 °C…", numeric: true, answer: 5, unit: "V" },
          { label: "b) …and what temperature will the microcontroller report?", numeric: true, answer: 100, unit: "°C" },
          { label: t`c) A second sensor reads −20 °C to 80 °C, that is, −0.2 V to 0.8 V. Find $K$ and $L$ in $v_o = Kv_s + L$ that map this range onto 0–5 V. $K$ =`, numeric: true, answer: 5, unit: "V/V" },
          { label: t`c) $L$ =`, numeric: true, answer: 1, unit: "V" }
        ],
        explain: t`a) The gain is $5/1 = 5$. For a noninverting amplifier, $1 + 40/R_s = 5$, so $R_s = 10$ kΩ. b) At 120 °C the sensor gives 1.2 V, and the amplifier would need $5 \times 1.2 = 6$ V. It saturates at its 5 V supply, so the microcontroller reads 5 V and reports 100 °C. c) The input span is 1 V and the output span is 5 V, so $K = 5/1 = 5$. Then −0.2 V must map to 0 V: $L = 0 - 5 \times (-0.2) = 1$ V.`
      },
      {
        id: "S16", title: "Check an answer without solving again", tags: [], lp: [1, 3],
        prompt: t`Two classmates report $v_o$. Student 1: $v_o = -3.5$ V. Student 2: $v_o = 4.5$ V. Use $v_n = v_p$ and KCL at the inverting input to decide which student is right.`,
        figure: figS16,
        parts: [
          { label: t`First, $v_n$ =`, numeric: true, answer: 0.5, unit: "V" },
          { label: "Which student is right?", options: ["Student 1", "Student 2"], answer: 0 }
        ],
        explain: t`$v_n = v_p = 0.5$ V. Add the currents leaving the inverting node. Student 1: $(0.5 - 1.5)/5 + (0.5 + 3.5)/20 = -0.2 + 0.2 = 0$, so KCL holds. Student 2: $-0.2 + (0.5 - 4.5)/20 = -0.4$ mA, not 0. Student 1 is right.`
      }
    ]
  };
})(window.EENG);
