// Chapter 1 practice sheet (Lane B: open, AI allowed). Interactive version of "2 Practice sheet.pdf".
// Question fields:
//   id, title, tags (labels shown), lp (checklist items it practises), prompt, optional figure / table / work / hint
//   parts: every part must be right for the question to count as correct
//     { label, options, answer (index from 0), roman: true for i) ii) … }
//     { label, numeric: true, answer, unit, rel (relative tolerance, default 1%) }
//   explain: shown after the student checks
(function (E) {
  var t = String.raw;
  var fig = E.fig;

  var loop =
    '<svg class="fig" viewBox="0 0 420 290" width="420" role="img" aria-label="Single loop. Left: 3 A current source, arrow pointing up, voltage V with + at the top. Top: element 1, 9 V, minus on the left and plus on the right. Right: element 2, 15 V, plus at the top and minus at the bottom.">' +
    '<g stroke="currentColor" stroke-width="2.5" fill="none">' +
    '<polyline points="70,121 70,50 150,50"/><polyline points="250,50 330,50 330,110"/>' +
    '<polyline points="330,200 330,260 70,260 70,189"/>' +
    '<circle cx="70" cy="155" r="34"/><line x1="70" y1="178" x2="70" y2="140"/>' +
    '<rect x="150" y="35" width="100" height="30"/><rect x="315" y="110" width="30" height="90"/></g>' +
    '<polygon points="62,142 78,142 70,128" fill="currentColor"/>' +
    '<g fill="currentColor" font-size="20">' +
    '<text x="36" y="108" font-size="24" font-weight="700">+</text><text x="10" y="162" font-style="italic">V</text>' +
    '<text x="36" y="212" font-size="24" font-weight="700">&#8722;</text><text x="112" y="162">3 A</text>' +
    '<text x="200" y="57" text-anchor="middle" font-weight="700">1</text>' +
    '<text x="138" y="26" font-size="24" font-weight="700">&#8722;</text><text x="200" y="24" text-anchor="middle">9 V</text>' +
    '<text x="256" y="26" font-size="24" font-weight="700">+</text>' +
    '<text x="330" y="162" text-anchor="middle" font-weight="700">2</text>' +
    '<text x="294" y="104" font-size="24" font-weight="700">+</text><text x="304" y="162" text-anchor="end">15 V</text>' +
    '<text x="294" y="222" font-size="24" font-weight="700">&#8722;</text></g></svg>';

  E.sheets[1] = {
    intro: t`This sheet is not marked for correctness, and AI tools are allowed. Next session’s device-free quiz is built from twins of these questions, so make sure you can do each one on your own.`,
    rules: [
      t`<strong>Two-tier items</strong> ask for an answer <em>and</em> a reason. Both must be right.`,
      t`<strong>Predict first:</strong> where asked, make your prediction before you calculate.`,
      t`<strong>Confidence:</strong> mark each question <em>Sure</em> or <em>Unsure</em>. It is not marked; it shows you what to revise.`,
      t`<strong>Passive sign convention:</strong> $p > 0$ means the element absorbs power; $p < 0$ means it delivers power.`
    ],

    questions: [
      {
        id: "S1", title: "Prefixes", tags: [], lp: [1],
        prompt: t`A sensor’s output current is 0.000047 A. Which is the way engineers write it, with the prefix chosen so the number lies between 1 and 1000?`,
        parts: [{ label: "Answer", options: ["0.047 mA", "47 µA", "47 nA", t`$4.7 \times 10^{-5}$ mA`], answer: 1 }],
        explain: t`$0.000047$ A $= 47 \times 10^{-6}$ A $= 47$ µA. (a) has the same value but not the preferred prefix, since 0.047 is below 1. (d) is $4.7 \times 10^{-8}$ A, a thousand times too small.`
      },
      {
        id: "S2", title: "Your generator subscription", tags: ["Two-tier"], lp: [5],
        prompt: t`Your home has a 5 A generator subscription at 220 V. Treat each rating as the power the appliance draws: kettle 2000 W, washing machine 500 W, heater fan 300 W, fridge 150 W, TV 100 W, laptop 65 W, all LED lights together 60 W. Which set can run at the same time without tripping the breaker?`,
        parts: [
          { label: "Answer", options: ["Kettle and LED lights", "Washing machine, heater fan, fridge, TV, laptop and LED lights", "Washing machine, fridge, TV, laptop and LED lights", "Kettle alone"], answer: 2 },
          { label: "Reason", roman: true, options: [
            "The subscription limits energy per month, so any set works if used briefly.",
            t`The subscription limits power, $P = VI = 1100$ W at any moment.`,
            "The subscription limits current, so the voltage does not matter.",
            "Only the largest appliance counts."
          ], answer: 1 }
        ],
        explain: t`The limit is power at any moment: $P = VI = 220 \times 5 = 1100$ W. The sets draw (a) 2060 W, (b) 1175 W, (c) 875 W and (d) 2000 W, so only (c) fits. The kWh meter counts energy; the ampere size limits power.`
      },
      {
        id: "S3", title: "Charge from a current graph", tags: ["Predict first"], lp: [2],
        prompt: t`The graph shows the current entering an element (zero outside the times shown).`,
        figure: fig.graph({ xMax: 7, yMax: 4.6, yTicks: [0, 4], xLabel: "t (s)", yLabel: "i (mA)", pts: [[0, 0], [2, 4], [5, 4], [6, 0]] }),
        parts: [
          { label: "Predict first: is the total charge more or less than 4 mA × 6 s = 24 mC?", options: ["More than 24 mC", "Less than 24 mC", "Exactly 24 mC"], answer: 1 },
          { label: "How much charge enters the element in total?", options: ["24 mC", "16 mC", "22 mC", "18 mC"], answer: 3 }
        ],
        explain: t`Charge is the area under $i(t)$: $\tfrac12(2)(4) + (3)(4) + \tfrac12(1)(4) = 4 + 12 + 2 = 18$ mC. It is less than 24 mC because the current is below 4 mA during the ramps.`
      },
      {
        id: "S4", title: "Current from charge", tags: ["Two-tier"], lp: [2],
        prompt: t`The charge entering an element is $q(t) = 4(1 - e^{-250t})$ mC for $t \ge 0$, and zero before. What is the current at $t = 0^+$?`,
        parts: [
          { label: "Answer", options: ["0", "4 mA", "1 A", "250 mA"], answer: 2 },
          { label: "Reason", roman: true, options: [
            t`$q(0) = 0$, so $i(0) = 0$.`,
            "Current is the charge divided by the time.",
            t`Current is the slope $dq/dt$, which is largest at $t = 0$.`,
            "Current is the final charge, 4 mC, per second."
          ], answer: 2 }
        ],
        explain: t`$i = dq/dt = (4 \times 10^{-3})(250)\,e^{-250t} = e^{-250t}$ A, so $i(0^+) = 1$ A. Reason (i) confuses the charge at $t = 0$ with the current at $t = 0$: the charge is zero but it is rising fastest.`
      },
      {
        id: "S5", title: "What a negative current means", tags: ["Two-tier"], lp: [3],
        prompt: t`Through the element, positive charge actually flows:`,
        figure: fig.hElement({ left: "+", right: "−", arrow: { side: "left", dir: "left", label: "−3 A" } }),
        parts: [
          { label: "Answer", options: ["from a to b", "from b to a", "nowhere, because a negative current means no flow", "cannot tell without the voltage"], answer: 0 },
          { label: "Reason", roman: true, options: [
            "The arrow is only a reference; a negative value means the flow is opposite to the arrow.",
            "A negative current means electrons flow instead of charge.",
            "Current always flows from + to −.",
            "The arrow shows the true direction, whatever the sign."
          ], answer: 0 },
          { label: "Follow-up: in which direction do the electrons move?", options: ["from a to b", "from b to a"], answer: 1 }
        ],
        explain: t`The reference arrow points from b to a. A negative value means positive charge actually moves the other way, from a to b. Electrons carry negative charge, so they move from b to a.`
      },
      {
        id: "S6", title: "What a negative voltage means", tags: [], lp: [3],
        prompt: t`Which statement is true?`,
        figure: fig.hElement({ left: "−", right: "+", v: "−12 V" }),
        parts: [{ label: "Answer", options: [
          "Terminal b is 12 V higher than terminal a.",
          "Terminal a is 12 V higher than terminal b.",
          "Terminals a and b are at the same potential.",
          "The element must be delivering power."
        ], answer: 1 }],
        explain: t`The + mark is at b, so $v = v_b - v_a = -12$ V. Then $v_a - v_b = +12$ V: terminal a is 12 V higher. Without a current you cannot say anything about power, so (d) is not justified.`
      },
      {
        id: "S7", title: "Predict, then compute", tags: ["Predict first"], lp: [4, 6],
        prompt: t`Four elements are connected between the same two wires. Their reference values are:`,
        table: t`<table class="data-table"><thead><tr><th>Element</th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead><tbody><tr><th>$v$ (V)</th><td>12</td><td>−12</td><td>−12</td><td>12</td></tr><tr><th>$i$ (A)</th><td>3</td><td>−5</td><td>−4</td><td>2</td></tr></tbody></table>`,
        figure: fig.parallel([
          { name: "A", top: "+", arrow: "down" },
          { name: "B", top: "−", arrow: "down" },
          { name: "C", top: "−", arrow: "up" },
          { name: "D", top: "+", arrow: "up" }
        ]),
        parts: [
          { label: "Predict first, with no numbers: for which elements does the reference arrow enter the + terminal?", options: ["A and B", "B and D", "C and D", "A and C"], answer: 3 },
          { label: "Which elements absorb power?", options: ["A and B", "B and D", "C and D", "A and C"], answer: 3 },
          { label: "Total power delivered", numeric: true, answer: 84, unit: "W" }
        ],
        explain: t`The arrow enters + for A (+ at the top, arrow down) and C (+ at the bottom, arrow up). So $p_A = vi = 36$ W, $p_B = -vi = -60$ W, $p_C = vi = 48$ W, $p_D = -vi = -24$ W. A and C absorb. Delivered $60 + 24 = 84$ W equals absorbed $36 + 48 = 84$ W, so the four powers add up to zero.`
      },
      {
        id: "S8", title: "One element", tags: ["Two-tier"], lp: [4],
        prompt: t`The element:`,
        figure: fig.hElement({ left: "−", right: "+", v: "10 V", arrow: { side: "left", dir: "right", label: "−2 A" } }),
        parts: [
          { label: "Answer", options: ["absorbs 20 W", "delivers 20 W", "absorbs 10 W", "delivers 40 W"], answer: 0 },
          { label: "Reason", roman: true, options: [
            t`The current arrow enters the − terminal, so $p = -vi$.`,
            t`$v$ and $i$ have opposite signs, so $p$ is negative.`,
            "Current flows into the element, so it absorbs.",
            t`$v$ is positive, so it absorbs.`
          ], answer: 0 }
        ],
        explain: t`The arrow enters the − terminal, so $p = -vi = -(10)(-2) = +20$ W: the element absorbs 20 W. Reason (ii) skips the terminal check and ends up with the wrong sign.`
      },
      {
        id: "S9", title: "Same element, different arrows", tags: ["Two-tier"], lp: [3, 4],
        prompt: t`Student X draws the current arrow into the + terminal of an element and finds $v = 5$ V, $i = 2$ A. Student Y analyses the same element but draws the current arrow the other way, keeping the same voltage polarity. What does Y get?`,
        parts: [
          { label: "Answer", options: [
            t`$i = 2$ A, $p = -10$ W (delivered)`,
            t`$i = -2$ A, $p = -10$ W (delivered)`,
            t`$i = -2$ A, $p = 10$ W (absorbed)`,
            "Y cannot get a valid answer with that arrow."
          ], answer: 2 },
          { label: "Reason", roman: true, options: [
            "Reversing an arrow changes the sign of the number, not what the element physically does.",
            "Reversing the arrow reverses the physical current.",
            "Only arrows that enter the + terminal are allowed.",
            "Power has no sign, so both get 10 W."
          ], answer: 0 }
        ],
        explain: t`Y’s arrow enters the − terminal, so Y reads $i = -2$ A and uses $p = -vi = -(5)(-2) = 10$ W, absorbed: the same as X. Reference directions are bookkeeping; the physics cannot depend on how you draw them.`
      },
      {
        id: "S10", title: "Charging a battery", tags: [], lp: [5],
        prompt: t`A 12 V car battery is charged at a constant 5 A for 2 h. How much energy is delivered to the battery?`,
        parts: [
          { label: "Answer", options: ["120 J", "7.2 kJ", "432 kJ", "432 J"], answer: 2 },
          { label: "Follow-up: the same energy in kWh", numeric: true, answer: 0.12, unit: "kWh" },
          { label: "Follow-up: while charging, the charger current enters the battery’s…", options: ["+ terminal", "− terminal"], answer: 0 }
        ],
        explain: t`$w = vit = 12 \times 5 \times 7200$ s $= 432$ kJ $= 0.12$ kWh. (a) used hours instead of seconds; (b) used minutes. While charging, the battery absorbs power, so the current enters its + terminal.`
      },
      {
        id: "S11", title: "Your power bank", tags: ["Two-tier"], lp: [5],
        prompt: t`A power bank is rated 10,000 mAh at 3.7 V. It charges a phone through a 5 V, 3 A output. Ignoring losses, how long can it supply that output?`,
        parts: [
          { label: "Answer", options: ["3.3 h", "2.5 h", "0.8 h", "12.3 h"], answer: 1 },
          { label: "Reason", roman: true, options: [
            "mAh measures charge; when the voltage changes, energy (Wh) is what carries over.",
            "mAh measures energy, so the time is 10 Ah ÷ 3 A.",
            "The phone’s voltage does not matter.",
            "The time is the energy in Wh divided by the current in A."
          ], answer: 0 }
        ],
        explain: t`Stored energy: $10$ Ah $\times 3.7$ V $= 37$ Wh. Output power: $5 \times 3 = 15$ W. Time: $37 / 15 \approx 2.5$ h. (a) treats mAh as energy; (d) divides Wh by A, which does not give hours.`
      },
      {
        id: "S12", title: "Energy from time-varying power", tags: [], lp: [5],
        prompt: t`For $t \ge 0$, an element has $v = 50e^{-200t}$ V and $i = 4e^{-200t}$ A, with the current entering the + terminal. What total energy is delivered to the element from $t = 0$ to $\infty$?`,
        hint: t`First write $p(t)$. How fast does $p$ decay compared with $v$ and $i$?`,
        parts: [{ label: "Answer", options: ["0.5 J", "1 J", "200 J", "0.25 J"], answer: 0 }],
        explain: t`$p = vi = 200e^{-400t}$ W, so $w = \int_0^\infty 200e^{-400t}\,dt = 200/400 = 0.5$ J. (b) keeps 200 in the exponent instead of 400.`
      },
      {
        id: "S13", title: "Power balance", tags: ["Two-tier"], lp: [6],
        prompt: t`A circuit has five elements. Using the passive sign convention, four of the powers are $p_1 = -60$ W, $p_2 = +25$ W, $p_3 = +18$ W and $p_4 = -8$ W. What is $p_5$?`,
        parts: [
          { label: "Answer", options: ["9 W absorbed", "25 W delivered", "111 W absorbed", "25 W absorbed"], answer: 3 },
          { label: "Reason", roman: true, options: [
            "The powers in a circuit add up to zero.",
            "Only the delivered powers need to balance.",
            "Absorbed power is always larger than delivered power.",
            t`$p_5$ is the sum of the other four.`
          ], answer: 0 }
        ],
        explain: t`$-60 + 25 + 18 - 8 + p_5 = 0$, so $p_5 = +25$ W, absorbed. (a) drops the sign of $p_4$.`
      },
      {
        id: "S14", title: "Spot the error", tags: ["Spot the error"], lp: [4, 6],
        prompt: t`The worked solution below contains the kind of mistake AI chat tools most often make on circuit diagrams.`,
        figure: loop,
        work: [
          "The 3 A source drives a clockwise current of 3 A through elements 1 and 2.",
          t`Element 1: $p_1 = (9)(3) = 27$ W, absorbed.`,
          t`Element 2: the current enters the + terminal, so $p_2 = (15)(3) = 45$ W, absorbed.`,
          t`KVL clockwise, drops positive: $-V - 9 + 15 = 0$, so $V = 6$ V.`,
          t`Source: the current leaves its + terminal, so $p_s = -(6)(3) = -18$ W, delivered.`,
          "All powers have been found, so the solution is complete."
        ],
        parts: [
          { label: "a) Which is the first wrong line?", options: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6"], answer: 1 },
          { label: t`b) The corrected value of $p_1$`, numeric: true, answer: -27, unit: "W" },
          { label: "c) With the corrected values, the total power delivered", numeric: true, answer: 45, unit: "W" },
          { label: "d) Which line should have made you distrust this solution?", options: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6"], answer: 5 }
        ],
        explain: t`The clockwise current enters element 1 at its − terminal, so $p_1 = -(9)(3) = -27$ W: element 1 delivers. Balance: delivered $27 + 18 = 45$ W equals absorbed 45 W. Line 6 claims the solution is complete without a power balance; doing one would have shown $27 + 45 \ne 18$.`
      },
      {
        id: "S15", title: "Work backwards", tags: [], lp: [4],
        prompt: t`The current arrow of an element enters its + terminal and $i = 2$ A. What must $v$ be for the element to <em>deliver</em> 30 W?`,
        parts: [{ label: "Answer", options: ["15 V", "−15 V", "60 V", "−60 V"], answer: 1 }],
        explain: t`Delivering 30 W means $p = vi = -30$ W, so $v = -30/2 = -15$ V.`
      },
      {
        id: "S16", title: "When does circuit theory apply?", tags: [], lp: [],
        prompt: t`Use $\lambda = c/f$ with $c = 3 \times 10^8$ m/s and the one-tenth rule. Which systems can be analysed as lumped circuits?<br>(i) a 30 km distribution feeder at 50 Hz &nbsp; (ii) a 10 cm Wi-Fi board at 2.4 GHz &nbsp; (iii) a 20 cm audio amplifier at 20 kHz`,
        parts: [{ label: "Answer", options: ["(i) only", "(i) and (iii)", "all three", "(ii) only"], answer: 1 }],
        explain: t`50 Hz: $\lambda = 6000$ km, limit 600 km, so 30 km is fine. 2.4 GHz: $\lambda = 12.5$ cm, limit 1.25 cm, so 10 cm fails. 20 kHz: $\lambda = 15$ km, limit 1.5 km, so 20 cm is fine.`
      }
    ]
  };
})(window.EENG);
