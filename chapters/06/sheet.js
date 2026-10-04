// Chapter 6 practice sheet (Lane B: open, AI allowed). Interactive version of "Practice sheet.pdf".
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

  // Figure helpers (this sheet only). Lines and text use currentColor.
  function svg(w, h, label, body) {
    return '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" role="img" aria-label="' + label + '">' + body + "</svg>";
  }
  // Inductor: four loops, 33 long, starting at (x, y) and running right ("h", loops above the wire)
  // or down ("v", loops to the right of the wire).
  function coil(x, y, dir) {
    var d = "M0,0";
    for (var k = 0; k < 4; k++) {
      var s = 7 * k;
      d += " C" + s + ",-16 " + (s + 12) + ",-16 " + (s + 12) + ",0";
      if (k < 3) d += " C" + (s + 12) + ",6 " + (s + 7) + ",6 " + (s + 7) + ",0";
    }
    return '<path d="' + d + '" transform="translate(' + x + " " + y + ")" + (dir === "v" ? " rotate(90)" : "") + '"/>';
  }
  // Capacitor plates centred at (x, y): "h" on a horizontal wire, "v" on a vertical wire.
  function cap(x, y, dir) {
    function ln(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke-width="3"/>'; }
    return dir === "h"
      ? ln(x - 4, y - 12, x - 4, y + 12) + ln(x + 4, y - 12, x + 4, y + 12)
      : ln(x - 12, y - 4, x + 12, y - 4) + ln(x - 12, y + 4, x + 12, y + 4);
  }
  // Straight current arrow from (x1, y1) to its tip at (x2, y2), horizontal or vertical.
  function arrow(x1, y1, x2, y2) {
    var ux = Math.sign(x2 - x1), uy = Math.sign(y2 - y1);
    var bx = x2 - 11 * ux, by = y2 - 11 * uy;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx + '" y2="' + by + '" stroke="currentColor" stroke-width="2.5"/>' +
      '<polygon points="' + x2 + "," + y2 + " " + (bx - 6 * uy) + "," + (by + 6 * ux) + " " + (bx + 6 * uy) + "," + (by - 6 * ux) + '" fill="currentColor"/>';
  }
  function dot(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="currentColor"/>'; }
  function term(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="none" stroke="currentColor" stroke-width="2"/>'; }
  // Italic symbol with a subscript, e.g. sym("i", "1"); italic subscript when it is a letter such as o.
  function sym(base, s, italicSub) {
    return '<tspan font-style="italic">' + base + '</tspan><tspan font-size="70%" dy="5"' + (italicSub ? ' font-style="italic"' : "") + ">" + s + "</tspan>";
  }
  function txt(x, y, s, anchor, extra) {
    return '<text x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + (extra || "") + ">" + s + "</text>";
  }
  function sign(x, y, s) { return txt(x, y, s, "middle", ' font-size="20" font-weight="700"'); }

  // S7: Nilsson Example 6.6 style inductor network.
  var s7 = svg(410, 330,
    "Inductor network between terminals a and b. From terminal a, a wire leads to a node where a 30 mH inductor (upper branch) and a 60 mH inductor (lower branch) are in parallel. " +
    "The 30 mH carries an initial current of 4 A, arrow pointing right, away from a; the 60 mH carries an initial current of 1 A, arrow pointing left, towards a. " +
    "From the right-hand node the circuit runs down through a 15 mH inductor on the right, then left along the bottom wire through a 5 mH inductor to terminal b.",
    '<g stroke="currentColor" stroke-width="2.5" fill="none">' +
    '<path d="M44,170 H110 V60 H178.5 M211.5,60 H280 V170 M110,170 H178.5 M211.5,170 H330 V203 M330,236 V290 H271.5 M238.5,290 H44"/>' +
    coil(178.5, 60, "h") + coil(178.5, 170, "h") + coil(330, 203, "v") + coil(238.5, 290, "h") + "</g>" +
    term(40, 170) + term(40, 290) + dot(110, 170) + dot(280, 170) +
    arrow(178, 86, 206, 86) + arrow(208, 196, 180, 196) +
    '<g fill="currentColor" font-size="17">' +
    txt(18, 176, "a") + txt(18, 296, "b") +
    txt(195, 38, "30 mH", "middle") + txt(214, 92, "4 A") +
    txt(195, 148, "60 mH", "middle") + txt(214, 202, "1 A") +
    txt(350, 225, "15 mH") + txt(255, 320, "5 mH", "middle") + "</g>");

  // S8: Nilsson Example 6.7 style capacitor network.
  var s8 = svg(390, 230,
    "Capacitor network between terminals a and b. From terminal a, a 12 µF capacitor on the top wire, with 9 V across it, plus on the a side and minus on the right, leads to a node. " +
    "From that node an 8 µF capacitor goes down to the bottom wire, with no initial voltage marked, and a 6 µF capacitor on the top wire, with 4 V across it, minus on the left and plus on the right, " +
    "leads to a 12 µF capacitor on the right-hand side, with 10 V across it, plus at the top and minus at the bottom. The bottom wire returns to terminal b.",
    '<g stroke="currentColor" stroke-width="2.5" fill="none">' +
    '<path d="M42,70 H98 M106,70 H216 M224,70 H310 V138 M310,146 V205 H42 M166,70 V138 M166,146 V205"/>' +
    cap(102, 70, "h") + cap(220, 70, "h") + cap(310, 142, "v") + cap(166, 142, "v") + "</g>" +
    term(38, 70) + term(38, 205) + dot(166, 70) + dot(166, 205) +
    '<g fill="currentColor" font-size="17">' +
    txt(16, 76, "a") + txt(16, 211, "b") +
    txt(102, 44, "12 µF", "middle") + sign(74, 106, "+") + txt(102, 106, "9 V", "middle") + sign(130, 106, MINUS) +
    txt(220, 44, "6 µF", "middle") + sign(192, 106, MINUS) + txt(220, 106, "4 V", "middle") + sign(248, 106, "+") +
    txt(146, 148, "8 µF", "end") +
    sign(284, 122, "+") + txt(292, 148, "10 V", "end") + sign(284, 184, MINUS) + txt(330, 148, "12 µF") + "</g>");

  // S10: two inductors, a switch that opens at t = 0, and a black box (booklet Problem 6.8 style).
  var s10 = svg(390, 200,
    "A 3 H inductor and a 6 H inductor in parallel between a top wire and a bottom wire. The current i1 in the 3 H and the current i2 in the 6 H are both referenced downward. " +
    "A switch across the inductors opens at t = 0. Further right, current i flows to the right along the top wire into a black box; the voltage v across the box has plus at the top and minus at the bottom.",
    '<g stroke="currentColor" stroke-width="2.5" fill="none">' +
    '<path d="M60,83.5 V50 H310 M60,116.5 V150 H310 M140,50 V83.5 M140,116.5 V150 M230,50 V84.5 M230,115.5 V150"/>' +
    coil(60, 83.5, "v") + coil(140, 83.5, "v") +
    '<circle cx="230" cy="88" r="3.5" stroke-width="2"/><circle cx="230" cy="112" r="3.5" stroke-width="2"/>' +
    '<line x1="228" y1="109" x2="215" y2="89.7"/><path d="M228,95 Q218,96 214.5,103" stroke-width="2"/>' +
    '<rect x="310" y="36" width="62" height="128"/></g>' +
    '<polygon points="211.4,109.3 217.6,104.6 211.4,101.4" fill="currentColor"/>' +
    dot(140, 50) + dot(140, 150) + dot(230, 50) + dot(230, 150) + dot(310, 50) + dot(310, 150) +
    arrow(44, 62, 44, 84) + arrow(156, 62, 156, 84) + arrow(262, 36, 292, 36) +
    '<g fill="currentColor" font-size="17">' +
    txt(36, 80, sym("i", "1"), "end") + txt(48, 106, "3 H", "end") +
    txt(163, 80, sym("i", "2")) + txt(160, 106, "6 H") +
    txt(243, 80, '<tspan font-style="italic">t</tspan> = 0', "", ' font-size="15"') +
    txt(279, 27, "i", "middle", ' font-style="italic"') +
    sign(297, 72, "+") + txt(297, 106, "v", "middle", ' font-style="italic"') + sign(297, 142, MINUS) +
    txt(341, 96, "Black", "middle", ' font-size="15"') + txt(341, 114, "box", "middle", ' font-size="15"') + "</g>");

  // S11: two series capacitors, a switch that closes at t = 0, and a black box (booklet Problem 6.10 style).
  var s11 = svg(370, 230,
    "A 3 µF capacitor above a 6 µF capacitor, in series on the left-hand side. The voltage v1 across the 3 µF and the voltage v2 across the 6 µF each have plus at the top and minus at the bottom. " +
    "A switch in the top wire closes at t = 0. Current i flows to the right along the top wire into a black box; the voltage vo across the box has plus at the top and minus at the bottom. The bottom wire runs from the 6 µF to the box.",
    '<g stroke="currentColor" stroke-width="2.5" fill="none">' +
    '<path d="M70,88 V55 H156.5 M187.5,55 H270 M70,96 V160 M70,168 V200 H270"/>' +
    cap(70, 92, "v") + cap(70, 164, "v") +
    '<circle cx="160" cy="55" r="3.5" stroke-width="2"/><circle cx="184" cy="55" r="3.5" stroke-width="2"/>' +
    '<line x1="162.8" y1="52.8" x2="183" y2="40"/><path d="M171,36 Q177,42 176.5,49" stroke-width="2"/>' +
    '<rect x="270" y="40" width="78" height="176"/></g>' +
    '<polygon points="176.5,56 173,49 180,49" fill="currentColor"/>' +
    dot(270, 55) + dot(270, 200) + arrow(214, 40, 246, 40) +
    '<g fill="currentColor" font-size="17">' +
    txt(52, 97, "3 µF", "end") + txt(52, 169, "6 µF", "end") +
    sign(96, 76, "+") + txt(108, 98, sym("v", "1")) + sign(96, 122, MINUS) +
    sign(96, 148, "+") + txt(108, 170, sym("v", "2")) + sign(96, 194, MINUS) +
    txt(172, 24, '<tspan font-style="italic">t</tspan> = 0', "middle", ' font-size="15"') +
    txt(232, 30, "i", "middle", ' font-style="italic"') +
    sign(254, 80, "+") + txt(254, 132, sym("v", "o", true), "middle") + sign(254, 192, MINUS) +
    txt(309, 124, "Black", "middle", ' font-size="15"') + txt(309, 142, "box", "middle", ' font-size="15"') + "</g>");

  E.sheets[6] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. The device-free quiz at the start of week 12, session 1 (Tue 5 Jan), is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Get both right; on the quiz each earns half the marks.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Conventions:</strong> unless a figure shows otherwise, each element’s current is referenced in the direction of its voltage drop (passive sign convention), so $v = L\,\tfrac{di}{dt}$ and $i = C\,\tfrac{dv}{dt}$. An initial current or voltage that points against the reference is negative. Check every answer: put $t = 0$ into your result, and differentiate it back.`
    ],

    questions: [
      {
        id: "S1", title: "An inductor in a dc circuit", tags: ["Two-tier"], lp: [3, 4],
        prompt: t`A 2 H inductor in a dc circuit that has been on for a long time carries a constant 3 A. What is the voltage across it?`,
        parts: [
          { label: "Answer", options: ["6 V", "0 V", "1.5 V", "3 V"], answer: 1 },
          { label: "Reason", roman: true, options: [
            t`The voltage is $v = Li$.`,
            t`The voltage is $v = L\,di/dt$, and the current is not changing.`,
            t`The voltage is $v = i/L$.`,
            t`The voltage is the stored energy divided by the current, $w/i = Li/2$.`
          ], answer: 1 },
          { label: "Follow-up: how much energy does the inductor store?", numeric: true, answer: 9, unit: "J" }
        ],
        explain: t`The current is constant, so $di/dt = 0$ and $v = L\,di/dt = 0$: in a dc circuit an inductor acts as a short circuit. Reason (i) gives (a), (iii) gives (c) and (iv) gives (d). Follow-up: $w = \tfrac12 Li^2 = \tfrac12(2)(3)^2 = 9$ J.`
      },
      {
        id: "S2", title: "Voltage from current", tags: [], lp: [1, 3, 4],
        prompt: t`As in Nilsson Example 6.1. The current in a 0.5 H inductor is 0 for $t < 0$ and $i = 8te^{-10t}$ A for $t \ge 0$.`,
        parts: [
          { label: "a) When is the current largest, and what is it? The time", numeric: true, answer: 0.1, unit: "s" },
          { label: "a) The largest current", numeric: true, answer: 0.294, unit: "A" },
          { label: t`b) Find $v(t)$ for $t > 0$, in the form $v = K_1 e^{-10t}(1 - K_2 t)$ V: $K_1$`, numeric: true, answer: 4, unit: "V" },
          { label: t`b) $K_2$`, numeric: true, answer: 10, unit: "1/s" },
          { label: "c) When does the voltage change polarity?", numeric: true, answer: 0.1, unit: "s" },
          { label: t`d) Does the voltage change instantly at $t = 0$?`, options: ["Yes", "No"], answer: 0 },
          { label: "d) Does the current?", options: ["Yes", "No"], answer: 1 },
          { label: "e) What is the largest energy the inductor stores?", numeric: true, answer: 21.7, unit: "mJ" }
        ],
        explain: t`a) $di/dt = 8e^{-10t}(1 - 10t) = 0$ at $t = 0.1$ s, where $i = 0.8e^{-1} = 0.294$ A. b) $v = L\,di/dt = 0.5 \times 8e^{-10t}(1 - 10t) = 4e^{-10t}(1 - 10t)$ V. c) The factor $(1 - 10t)$ changes sign at $t = 0.1$ s, when the current peaks: the voltage is positive while the current rises and negative while it falls. d) The voltage jumps from 0 to 4 V at $t = 0$; the current starts at 0 and does not jump. e) The energy is largest when the current is: $\tfrac12(0.5)(0.8e^{-1})^2 = 0.16e^{-2}$ J $= 21.7$ mJ.`
      },
      {
        id: "S3", title: "Current from voltage", tags: [], lp: [1, 3],
        prompt: t`As in Nilsson Example 6.2. A 2 H inductor carries $i(0) = -1$ A. For $t > 0$ the voltage across it is $v = 12e^{-3t}$ V.`,
        parts: [
          { label: t`a) Find $i(t)$ for $t \ge 0$, in the form $i = K_1 + K_2 e^{-3t}$ A: $K_1$`, numeric: true, answer: 1, unit: "A" },
          { label: t`a) $K_2$`, numeric: true, answer: -2, unit: "A" },
          { label: "b) When is the current zero?", numeric: true, answer: 0.231, unit: "s" },
          { label: t`c) In what interval does the inductor deliver energy? Use the sign of $p = vi$.`, options: [t`$0 < t < 0.231$ s`, t`$t > 0.231$ s`, t`All $t > 0$`, "Never"], answer: 0 },
          { label: t`d) Find the stored energy at $t = 0$`, numeric: true, answer: 1, unit: "J" },
          { label: t`d) … and as $t \to \infty$`, numeric: true, answer: 1, unit: "J" },
          { label: "d) Equal values: is that a contradiction?", options: ["Yes", "No"], answer: 1 }
        ],
        explain: t`a) $i = i(0) + \tfrac1L\int_0^t v\,dx = -1 + \tfrac12 \cdot \tfrac{12}{3}(1 - e^{-3t}) = 1 - 2e^{-3t}$ A. Check: $i(0) = -1$ A, and $2\,di/dt = 12e^{-3t}$ V. b) $e^{-3t} = \tfrac12$ at $t = (\ln 2)/3 = 0.231$ s. c) $v$ is positive throughout, so $p = vi < 0$ while $i < 0$: the inductor delivers energy for $0 < t < 0.231$ s, and stores energy after that. d) $\tfrac12(2)(-1)^2 = 1$ J at $t = 0$ and $\tfrac12(2)(1)^2 = 1$ J as $t \to \infty$. No contradiction: the inductor returns its 1 J by 0.231 s, then stores 1 J with the current reversed.`
      },
      {
        id: "S4", title: "A capacitor in a dc circuit", tags: ["Two-tier"], lp: [3, 4],
        prompt: t`A 5 µF capacitor in a dc circuit that has been on for a long time has a constant 12 V across it. What current flows in it?`,
        parts: [
          { label: "Answer", options: ["60 µA", "30 µA", "0 A", t`$2.4 \times 10^6$ A`], answer: 2 },
          { label: "Reason", roman: true, options: [
            t`The current is the stored energy divided by the voltage, $w/v = Cv/2$.`,
            t`The current is $i = Cv$.`,
            t`The current is $i = v/C$.`,
            t`The current is $i = C\,dv/dt$, and the voltage is not changing.`
          ], answer: 3 },
          { label: "Follow-up: how much energy does the capacitor store?", numeric: true, answer: 360, unit: "µJ" }
        ],
        explain: t`The voltage is constant, so $dv/dt = 0$ and $i = C\,dv/dt = 0$: in a dc circuit a capacitor acts as an open circuit. Reason (i) gives (b), (ii) gives (a) and (iii) gives (d). Follow-up: $w = \tfrac12 Cv^2 = \tfrac12(5 \times 10^{-6})(12)^2 = 360$ µJ.`
      },
      {
        id: "S5", title: "Current from voltage", tags: [], lp: [2, 3, 4],
        prompt: t`As in Nilsson Example 6.4. The voltage across a 4 µF capacitor is 0 for $t < 0$ and $v = 20(1 - e^{-500t})$ V for $t \ge 0$.`,
        parts: [
          { label: t`a) Find $i(t)$ for $t > 0$, in the form $i = K e^{-500t}$ mA: $K$`, numeric: true, answer: 40, unit: "mA" },
          { label: t`b) Does the current change instantly at $t = 0$?`, options: ["Yes", "No"], answer: 0 },
          { label: "b) Does the voltage?", options: ["Yes", "No"], answer: 1 },
          { label: t`c) Find the energy stored as $t \to \infty$.`, numeric: true, answer: 0.8, unit: "mJ" },
          { label: "d) When is the power into the capacitor largest, and what is it? The time", numeric: true, answer: 1.39, unit: "ms" },
          { label: "d) The largest power", numeric: true, answer: 0.2, unit: "W" }
        ],
        explain: t`a) $i = C\,dv/dt = (4 \times 10^{-6})(20)(500)e^{-500t} = 40e^{-500t}$ mA. b) The current jumps from 0 to 40 mA at $t = 0$; the voltage starts at 0 and does not jump. c) $\tfrac12(4 \times 10^{-6})(20)^2 = 0.8$ mJ. d) $p = vi = 0.8e^{-500t}(1 - e^{-500t})$ W, which is largest when $e^{-500t} = 0.5$: $t = (\ln 2)/500 = 1.39$ ms, and $p = 0.8(0.5)(0.5) = 0.2$ W.`
      },
      {
        id: "S6", title: "A current pulse", tags: ["Predict first"], lp: [2, 3],
        prompt: t`As in Nilsson Example 6.5. A 0.5 µF capacitor has $v(0) = 5$ V. A current of 2 mA flows into its + terminal from $t = 0$ to $t = 5$ ms, and zero afterwards.`,
        parts: [
          { label: t`a) Find $v(t)$ for $0 \le t \le 5$ ms, in the form $v = K_1 + K_2 t$ V: $K_1$`, numeric: true, answer: 5, unit: "V" },
          { label: t`a) $K_2$`, numeric: true, answer: 4000, unit: "V/s" },
          { label: t`b) What is $v$ for $t > 5$ ms?`, numeric: true, answer: 25, unit: "V" },
          { label: "b) Why does it not return to 5 V?", note: true },
          { label: "c) How much energy does the pulse deliver to the capacitor?", numeric: true, answer: 150, unit: "µJ" },
          { label: t`d) Predict first: repeat (a)–(c) with a −2 mA pulse. $v$ for $t > 5$ ms`, numeric: true, answer: -15, unit: "V" },
          { label: "d) The energy the −2 mA pulse delivers to the capacitor", numeric: true, answer: 50, unit: "µJ" },
          { label: t`d) When does $v$ pass through zero?`, numeric: true, answer: 1.25, unit: "ms" }
        ],
        explain: t`a) $v = v(0) + \tfrac1C\int_0^t i\,dx = 5 + \frac{2 \times 10^{-3}}{0.5 \times 10^{-6}}\,t = 5 + 4000t$ V. b) At 5 ms, $v = 5 + 20 = 25$ V, and it stays at 25 V: with no current, the charge stays, so nothing brings the voltage back. c) $\tfrac12(0.5 \times 10^{-6})(25^2 - 5^2) = 150$ µJ. d) $v = 5 - 4000t$, reaching −15 V at 5 ms; $v = 0$ at $t = 5/4000 = 1.25$ ms. The stored energy falls from 6.25 µJ to 0, then rises to 56.25 µJ: the pulse delivers 50 µJ net, even though its current is negative.`
      },
      {
        id: "S7", title: "Equivalent inductance with initial currents", tags: [], lp: [3, 5],
        prompt: t`As in Nilsson Example 6.6.`,
        figure: s7,
        parts: [
          { label: t`a) Find $L_{eq}$ between a and b.`, numeric: true, answer: 40, unit: "mH" },
          { label: t`b) Find the initial current in $L_{eq}$, entering at a.`, numeric: true, answer: 3, unit: "A" },
          { label: "c) The 15 mH and 5 mH carry the current found in (b). Find the energy stored in the four inductors", numeric: true, answer: 360, unit: "mJ" },
          { label: t`c) … and in $L_{eq}$`, numeric: true, answer: 180, unit: "mJ" },
          { label: "c) Where is the difference?", options: [
            "In the current that circulates around the 30 mH and 60 mH pair",
            "In the 15 mH and 5 mH, which carry the full 3 A",
            "Nowhere: the two totals must be equal, so one of them is wrong"
          ], answer: 0 }
        ],
        explain: t`a) The parallel pair gives $(1/30 + 1/60)^{-1} = 20$ mH; in series with the 15 mH and 5 mH, $L_{eq} = 20 + 15 + 5 = 40$ mH. b) The 4 A in the 30 mH points away from a and the 1 A in the 60 mH points towards a, so $4 - 1 = 3$ A enters at a. c) The four inductors store $\tfrac12(30)(4)^2 + \tfrac12(60)(1)^2 + \tfrac12(15)(3)^2 + \tfrac12(5)(3)^2 = 240 + 30 + 67.5 + 22.5 = 360$ mJ (mH times A² gives mJ); $L_{eq}$ stores $\tfrac12(40)(3)^2 = 180$ mJ. The other 180 mJ belongs to the current circulating in the parallel pair, which the terminals cannot see.`
      },
      {
        id: "S8", title: "Equivalent capacitance with initial voltages", tags: [], lp: [3, 5],
        prompt: t`As in Nilsson Example 6.7.`,
        figure: s8,
        parts: [
          { label: t`a) Find $C_{eq}$ between a and b.`, numeric: true, answer: 6, unit: "µF" },
          { label: t`b) Find the initial voltage $v_{ab}$ across $C_{eq}$.`, numeric: true, answer: 15, unit: "V" },
          { label: "c) What is the initial voltage across the 8 µF, + at the top?", numeric: true, answer: 6, unit: "V" },
          { label: "c) Find the energy stored in the four capacitors", numeric: true, answer: 1278, unit: "µJ" },
          { label: t`c) … and in $C_{eq}$`, numeric: true, answer: 675, unit: "µJ" }
        ],
        explain: t`a) The 6 µF and 12 µF in series give 4 µF; with the 8 µF in parallel, 12 µF; in series with the 12 µF at a, $C_{eq} = 6$ µF. b) Along the outer path from a to b: $v_{ab} = 9 - 4 + 10 = 15$ V. c) Around the right-hand loop, the 8 µF has $-4 + 10 = 6$ V, + at the top. The four capacitors store $\tfrac12(12)(9)^2 + \tfrac12(6)(4)^2 + \tfrac12(12)(10)^2 + \tfrac12(8)(6)^2 = 486 + 48 + 600 + 144 = 1278$ µJ (µF times V² gives µJ); $C_{eq}$ stores $\tfrac12(6)(15)^2 = 675$ µJ.`
      },
      {
        id: "S9", title: "Parallel capacitors", tags: [], lp: [2, 3, 5],
        prompt: t`As in booklet Problem 6.9. A 0.4 µF and a 1.6 µF capacitor are in parallel. For $t \ge 0$ the voltage across them is $v = 50e^{-200t} + 30$ V. $i_1$ is the current in the 0.4 µF and $i_2$ the current in the 1.6 µF, each referenced into the + terminal.`,
        parts: [
          { label: t`a) Find $C_{eq}$.`, numeric: true, answer: 2, unit: "µF" },
          { label: t`b) Find $i_1(t)$ and $i_2(t)$, in the form $i_1 = K_1 e^{-200t}$ and $i_2 = K_2 e^{-200t}$: $K_1$`, numeric: true, answer: -4, unit: "mA" },
          { label: t`b) $K_2$`, numeric: true, answer: -16, unit: "mA" },
          { label: t`c) Check that $i_1 + i_2 = C_{eq}\,dv/dt$. How do the two currents compare with the two capacitances?`, options: [
            t`They divide in the ratio of the capacitances: $i_1 : i_2 = 1 : 4$.`,
            t`They divide in the inverse ratio of the capacitances: $i_1 : i_2 = 4 : 1$.`,
            "They are equal, because both capacitors have the same voltage."
          ], answer: 0 },
          { label: t`d) How much energy do the capacitors release between $t = 0$ and $t \to \infty$?`, numeric: true, answer: 5.5, unit: "mJ" }
        ],
        explain: t`a) Parallel capacitances add: $C_{eq} = 0.4 + 1.6 = 2$ µF. b) $dv/dt = -10\,000e^{-200t}$ V/s, so $i_1 = (0.4 \times 10^{-6})(-10\,000e^{-200t}) = -4e^{-200t}$ mA in the 0.4 µF and $i_2 = -16e^{-200t}$ mA in the 1.6 µF. c) $i_1 + i_2 = -20e^{-200t}$ mA $= (2 \times 10^{-6})(-10\,000e^{-200t})$: the currents divide in the ratio of the capacitances, 1 : 4. d) $v$ falls from 80 V to 30 V, so the capacitors release $\tfrac12(2 \times 10^{-6})(80^2 - 30^2) = 5.5$ mJ.`
      },
      {
        id: "S10", title: "Inductors and a black box", tags: [], lp: [1, 5, 6],
        prompt: t`As in booklet Problem 6.8. Just before the switch opens, $i_1(0) = -9$ A and $i_2(0) = 3$ A. For $t > 0$, $v = 36e^{-3t}$ V.`,
        figure: s10,
        parts: [
          { label: t`a) Find $L_{eq}$`, numeric: true, answer: 2, unit: "H" },
          { label: t`a) … and $i(0^+)$, the box current just after the switch opens`, numeric: true, answer: 6, unit: "A" },
          { label: t`b) Find $i(t)$, $i_1(t)$ and $i_2(t)$ for $t \ge 0$, each in the form $K_1 + K_2 e^{-3t}$ A. For $i(t)$: $K_1$`, numeric: true, answer: 0, abs: 0.005, unit: "A" },
          { label: t`b) For $i(t)$: $K_2$`, numeric: true, answer: 6, unit: "A" },
          { label: t`b) For $i_1(t)$: $K_1$`, numeric: true, answer: -5, unit: "A" },
          { label: t`b) For $i_1(t)$: $K_2$`, numeric: true, answer: -4, unit: "A" },
          { label: t`b) For $i_2(t)$: $K_1$`, numeric: true, answer: 5, unit: "A" },
          { label: t`b) For $i_2(t)$: $K_2$`, numeric: true, answer: -2, unit: "A" },
          { label: "c) Find the initial energy stored in the inductors.", numeric: true, answer: 148.5, unit: "J" },
          { label: "d) Find the energy delivered to the black box", numeric: true, answer: 36, unit: "J" },
          { label: "d) … and the energy trapped in the inductors", numeric: true, answer: 112.5, unit: "J" }
        ],
        explain: t`a) $L_{eq} = (3)(6)/(3 + 6) = 2$ H. Both inductor currents are referenced downward and $i$ flows into the box, so $i = -(i_1 + i_2)$ and $i(0^+) = -(-9 + 3) = 6$ A. (Just before, $i(0^-) = 0$, because the closed switch shorts the box.) b) Each inductor has $v$ across it, + at the top, and $\int_0^t 36e^{-3x}\,dx = 12(1 - e^{-3t})$. So $i_1 = -9 + \tfrac13(12)(1 - e^{-3t}) = -5 - 4e^{-3t}$ A, $i_2 = 3 + \tfrac16(12)(1 - e^{-3t}) = 5 - 2e^{-3t}$ A, and $i = -(i_1 + i_2) = 6e^{-3t}$ A. c) $\tfrac12(3)(9)^2 + \tfrac12(6)(3)^2 = 121.5 + 27 = 148.5$ J. d) The box receives $\tfrac12 L_{eq}\,i(0)^2 = \tfrac12(2)(6)^2 = 36$ J. As $t \to \infty$, $i_1 \to -5$ A and $i_2 \to 5$ A: a current circulates in the two inductors and traps $\tfrac12(3)(5)^2 + \tfrac12(6)(5)^2 = 112.5$ J. Check: $36 + 112.5 = 148.5$ J.`
      },
      {
        id: "S11", title: "Capacitors and a black box", tags: [], lp: [2, 5, 6],
        prompt: t`As in booklet Problem 6.10. At $t = 0$, $v_1(0) = 20$ V and $v_2(0) = -8$ V. For $t > 0$, $i = 1.2e^{-50t}$ mA.`,
        figure: s11,
        parts: [
          { label: t`a) Find $C_{eq}$`, numeric: true, answer: 2, unit: "µF" },
          { label: t`a) … and $v_o(0)$`, numeric: true, answer: 12, unit: "V" },
          { label: t`b) Find $v_1(t)$, $v_2(t)$ and $v_o(t)$ for $t \ge 0$, each in the form $K_1 + K_2 e^{-50t}$ V. For $v_1(t)$: $K_1$`, numeric: true, answer: 12, unit: "V" },
          { label: t`b) For $v_1(t)$: $K_2$`, numeric: true, answer: 8, unit: "V" },
          { label: t`b) For $v_2(t)$: $K_1$`, numeric: true, answer: -12, unit: "V" },
          { label: t`b) For $v_2(t)$: $K_2$`, numeric: true, answer: 4, unit: "V" },
          { label: t`b) For $v_o(t)$: $K_1$`, numeric: true, answer: 0, abs: 0.005, unit: "V" },
          { label: t`b) For $v_o(t)$: $K_2$`, numeric: true, answer: 12, unit: "V" },
          { label: "c) Find the initial energy stored in the capacitors.", numeric: true, answer: 792, unit: "µJ" },
          { label: "d) Find the energy delivered to the black box", numeric: true, answer: 144, unit: "µJ" },
          { label: "d) … and the energy trapped in the capacitors", numeric: true, answer: 648, unit: "µJ" }
        ],
        explain: t`a) Series capacitors: $C_{eq} = (3)(6)/(3 + 6) = 2$ µF, and $v_o(0) = v_1(0) + v_2(0) = 20 - 8 = 12$ V. b) $i$ leaves the + terminal of each capacitor, so the current into each + terminal is $-i$, and $\int_0^t 1.2 \times 10^{-3}e^{-50x}\,dx = 24 \times 10^{-6}(1 - e^{-50t})$. So $v_1 = 20 - 8(1 - e^{-50t}) = 12 + 8e^{-50t}$ V, $v_2 = -8 - 4(1 - e^{-50t}) = -12 + 4e^{-50t}$ V, and $v_o = v_1 + v_2 = 12e^{-50t}$ V. c) $\tfrac12(3)(20)^2 + \tfrac12(6)(8)^2 = 600 + 192 = 792$ µJ. d) The box receives $\tfrac12 C_{eq}\,v_o(0)^2 = \tfrac12(2)(12)^2 = 144$ µJ. As $t \to \infty$, $v_1 \to 12$ V and $v_2 \to -12$ V, trapping $\tfrac12(3)(12)^2 + \tfrac12(6)(12)^2 = 648$ µJ. Check: $144 + 648 = 792$ µJ.`
      },
      {
        id: "S12", title: "Spot the error", tags: ["Spot the error"], lp: [1],
        prompt: t`The worked solution below contains the kind of direction slip AI chat tools often make. A 4 H inductor has its current $i$ referenced in the direction of its voltage drop $v$. At $t = 0$ the current is 2 A, flowing against the reference arrow. For $t > 0$, $v = 24e^{-2t}$ V.`,
        work: [
          t`$i(t) = (1/L)\int v\,dt + i(0)$, integrating from 0 to $t$.`,
          t`$i(0) = 2$ A.`,
          t`The integral of $24e^{-2t}$ from 0 to $t$ is $12(1 - e^{-2t})$.`,
          t`$i(t) = (12/4)(1 - e^{-2t}) + 2 = 5 - 3e^{-2t}$ A.`,
          t`Check: $i(0) = 2$ A and $4\,di/dt = 24e^{-2t}$ V, so the answer is right.`
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"], answer: 1 },
          { label: t`b) Correct it and find $i(t)$. The corrected $i(0)$`, numeric: true, answer: -2, unit: "A" },
          { label: t`b) $i(t)$ in the form $K_1 + K_2 e^{-2t}$ A: $K_1$`, numeric: true, answer: 1, unit: "A" },
          { label: t`b) $K_2$`, numeric: true, answer: -3, unit: "A" },
          { label: "c) Line 5 calls itself a check. Why did it not catch the error?", note: true },
          { label: "d) When does the current reverse direction?", numeric: true, answer: 0.549, unit: "s" }
        ],
        explain: t`a) Line 2: the current flows against the reference arrow, so $i(0) = -2$ A. b) $i = 3(1 - e^{-2t}) - 2 = 1 - 3e^{-2t}$ A. c) The $i(0)$ check repeats line 2’s wrong value, and the derivative check cannot see $i(0)$ at all, because the constant vanishes when differentiated. d) $i = 0$ when $e^{-2t} = \tfrac13$: $t = (\ln 3)/2 = 0.549$ s.`
      },
      {
        id: "S13", title: "Spot the error in an energy balance", tags: ["Spot the error"], lp: [5, 6],
        prompt: t`A 2 H and an 8 H inductor are in parallel, with $i_1(0) = 6$ A and $i_2(0) = -1$ A, both referenced downward; until $t = 0$ a switch across their terminals carries the total current. At $t = 0$ the switch opens and the current flows into a black box, which draws current until the total current is zero.`,
        work: [
          t`$L_{eq} = (2)(8)/(2 + 8) = 1.6$ H.`,
          t`The initial stored energy is $(1/2)(2)(6)^2 + (1/2)(8)(1)^2 = 36 + 4 = 40$ J.`,
          "The box draws current until the inductors are empty, so it receives all the stored energy.",
          "The energy delivered to the box is 40 J."
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4"], answer: 2 },
          { label: t`b) Find the energy delivered to the box. (Use $L_{eq}$ and the total initial current.)`, numeric: true, answer: 20, unit: "J" },
          { label: t`c) Find $i_1$ after a long time`, numeric: true, answer: 2, unit: "A" },
          { label: t`c) … $i_2$ after a long time`, numeric: true, answer: -2, unit: "A" },
          { label: "c) … and the energy trapped", numeric: true, answer: 20, unit: "J" }
        ],
        explain: t`a) Line 3: the box draws current until the <em>total</em> current $i_1 + i_2$ is zero, not until each inductor is empty. b) The total initial current is $6 + (-1) = 5$ A, so $\tfrac12(1.6)(5)^2 = 20$ J reaches the box. c) Both inductors have the same voltage, so the 2 H loses four times as much current as the 8 H: $i_1$ falls by 4 A to 2 A and $i_2$ by 1 A to −2 A, and the total is zero. The trapped energy is $\tfrac12(2)(2)^2 + \tfrac12(8)(2)^2 = 4 + 16 = 20$ J, and $20 + 20 = 40$ J accounts for all the initial energy.`
      },
      {
        id: "S14", title: "A supercapacitor bank", tags: ["Predict first"], lp: [3, 5],
        prompt: t`A supercapacitor cell is rated 3000 F at 2.7 V.`,
        parts: [
          { label: "a) How much energy does one cell store at its rated voltage?", numeric: true, answer: 10.9, unit: "kJ" },
          { label: t`b) Six cells are connected in series for a 16.2 V bank. Find $C_{eq}$`, numeric: true, answer: 500, unit: "F" },
          { label: "b) … and the energy the bank stores at 16.2 V", numeric: true, answer: 65.6, unit: "kJ" },
          { label: "b) Compare with six times the energy of one cell.", options: [
            "The bank stores exactly six times the energy of one cell.",
            "The bank stores less than six times the energy of one cell.",
            "The bank stores more than six times the energy of one cell."
          ], answer: 0 },
          { label: "c) For how long could the bank supply 200 W if all of that energy could be used?", numeric: true, answer: 328, unit: "s" },
          { label: t`d) Predict first: two such banks are put in parallel. What happens to $C_{eq}$ and to the stored energy?`, options: [
            t`$C_{eq}$ doubles and the stored energy doubles.`,
            t`$C_{eq}$ doubles and the stored energy stays the same.`,
            t`$C_{eq}$ halves and the stored energy halves.`,
            t`$C_{eq}$ doubles and the stored energy quadruples.`
          ], answer: 0 },
          { label: "d) The energy the two banks store at 16.2 V", numeric: true, answer: 131, unit: "kJ" }
        ],
        explain: t`a) $\tfrac12(3000)(2.7)^2 = 10.9$ kJ. b) Six equal capacitors in series: $C_{eq} = 3000/6 = 500$ F, and $\tfrac12(500)(16.2)^2 = 65.6$ kJ, exactly six times one cell, since each cell still has 2.7 V across it. c) $65\,610/200 = 328$ s, about 5.5 min. d) Parallel capacitances add: 1000 F at the same 16.2 V stores 131 kJ, twice the energy.`
      },
      {
        id: "S15", title: "Capacitive touch screens", tags: [], lp: [2, 5],
        prompt: t`As in Nilsson’s Practical Perspective for this chapter. Each electrode of a touch screen has a parasitic capacitance $C_p = 20$ pF to ground. A finger adds $C_t = 5$ pF at the point of touch.`,
        parts: [
          { label: "a) What capacitance does the controller see at the touched electrode?", numeric: true, answer: 25, unit: "pF" },
          { label: "a) By what percentage did it change?", numeric: true, answer: 25, unit: "%" },
          { label: "b) A self-capacitance screen is touched at (X1, Y2) and (X3, Y0) at the same time. Which four grid points look touched?", options: [
            "(X1, Y2), (X3, Y0), (X1, Y0) and (X3, Y2)",
            "(X1, Y2), (X3, Y0), (X2, Y1) and (X0, Y3)"
          ], answer: 0 },
          { label: "b) Which two are ghosts?", options: ["(X1, Y0) and (X3, Y2)", "(X1, Y2) and (X3, Y0)", "(X2, Y1) and (X0, Y3)"], answer: 0 },
          { label: "c) Why does a mutual-capacitance screen not produce ghost points?", note: true },
          { label: "d) The controller charges an electrode with a constant 1 µA. How long does the voltage take to reach 1 V when untouched", numeric: true, answer: 20, unit: "µs" },
          { label: "d) … and when touched?", numeric: true, answer: 25, unit: "µs" }
        ],
        explain: t`a) The finger’s capacitance is in parallel with the parasitic one: $20 + 5 = 25$ pF, up 25%. b) A self-capacitance screen measures each electrode on its own, so it only learns that X1, X3, Y0 and Y2 changed, and every crossing of those lines looks touched: (X1, Y2) and (X3, Y0) are real; (X1, Y0) and (X3, Y2) are ghosts. c) It measures the capacitance at each X–Y crossing, so only the touched crossings change. d) A constant current charges the electrode at a steady rate, $v = It/C$, so $t = Cv/I$: $(20 \times 10^{-12})(1)/(1 \times 10^{-6}) = 20$ µs untouched and 25 µs touched.`
      },
      {
        id: "S16", title: "Check an answer without solving again", tags: [], lp: [1],
        prompt: t`A 0.25 H inductor carries $i(0) = 3$ A. For $t > 0$, $v = 10e^{-20t}$ V. Two classmates report $i(t)$ for $t \ge 0$. Student 1: $i = 5 - 2e^{-20t}$ A. Student 2: $i = 1 + 2e^{-20t}$ A. Use $i(0)$ and $v = L\,di/dt$ to decide which student is right.`,
        parts: [{ label: "Answer", options: ["Student 1", "Student 2", "Both", "Neither"], answer: 0 }],
        explain: t`Both answers give $i(0) = 3$ A, so the initial value cannot decide. The derivative can: $0.25\,\tfrac{d}{dt}(5 - 2e^{-20t}) = 10e^{-20t}$ V matches $v$, while Student 2’s answer gives $0.25\,\tfrac{d}{dt}(1 + 2e^{-20t}) = -10e^{-20t}$ V. Student 1 is right.`
      }
    ]
  };
})(window.EENG);
