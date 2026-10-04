// Chapter 7 page content, from "Introduction (students).pdf".
// Math goes between $…$ (inline) or $$…$$ (display). Sections are plain HTML.
(function (E) {
  var t = String.raw;
  E.chapters[7] = {
    lead: t`Chapter 7 puts together everything in the course. When a switch moves in a circuit with one inductor or one capacitor, every current and voltage moves from an initial value to a final value along an exponential curve. Chapter 7 runs through weeks 12 and 13, and its quiz is at the start of the last class, week 13, session 2 (Thu 14 Jan). The final exam covers Chapters 4 to 7.`,

    sections: [
      {
        title: "What you will learn",
        html: t`<ul>
<li><strong>The natural response:</strong> stored energy drains through resistors, and the inductor current or capacitor voltage decays as $\exp(-t/\tau)$.</li>
<li><strong>The step response:</strong> a dc source drives the inductor current or capacitor voltage from its initial value to a new final value.</li>
<li><strong>The time constant:</strong> $\tau = L/R$ for an inductor and $\tau = RC$ for a capacitor, where $R$ is the Thévenin resistance the element sees after switching. After one $\tau$, 37% of the change is still to come; after five, less than 1%.</li>
<li><strong>One formula for both:</strong> $x(t) = x_f + (x_0 - x_f)\exp(-t/\tau)$. Find the initial value, the final value and $\tau$, and the answer follows.</li>
<li><strong>What cannot jump:</strong> the inductor current and the capacitor voltage are the same just after switching as just before. Resistor currents and voltages can jump, unless the circuit forces them to follow $i_L$ or $v_C$.</li>
<li><strong>Dependent sources:</strong> the resistance that sets $\tau$ then needs a test source, as in Chapter 4.</li>
</ul>`
      },
      {
        title: "Where the earlier chapters come back",
        html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Chapter</th><th>What Chapter 7 uses from it</th></tr></thead><tbody>
<tr><td>Chapters 2 and 3: Kirchhoff’s laws, dividers</td><td>The circuit before and after switching is a resistive circuit</td></tr>
<tr><td>Chapter 4: Thévenin equivalents</td><td>$\tau$ uses the Thévenin resistance the element sees; dependent sources need a test source</td></tr>
<tr><td>Chapter 6: Inductors and capacitors</td><td>The continuity rules give the initial value, and the dc rules (short circuit, open circuit) give the final value</td></tr>
</tbody></table></div>`
      },
      {
        title: "In your program",
        html: t`<ul>
<li><strong>Electrical and Electronics:</strong> motor starting currents, relay and contactor timing, and the charging of the capacitors in every power supply are first-order responses.</li>
<li><strong>Computer, Communication and Telecom:</strong> every logic signal charges the capacitance of the next gate through a resistance; that RC time constant limits how fast a chip can run.</li>
<li><strong>Biomedical:</strong> in Nilsson’s simplified model, a pacemaker times each heartbeat with one resistor and one capacitor (S14, and Nilsson’s Practical Perspective for this chapter). Real pacemakers use a crystal-timed microcontroller, but the RC idea is the same.</li>
<li><strong>Mechanical and Industrial:</strong> solenoid valves and relays take a few milliseconds to pull in and let go, set by $L/R$ (S15).</li>
<li><strong>Surveying:</strong> sensors are read after their RC input filters have settled; waiting less than about five time constants gives a wrong reading.</li>
</ul>`
      },
      {
        title: "As an engineer",
        html: t`<ul>
<li><strong>Three numbers decide the answer:</strong> the initial value, the final value and $\tau$. Find each one from its own circuit: before switching, long after switching, and with the independent sources off.</li>
<li><strong>Use the right variable:</strong> solve for the inductor current or the capacitor voltage first, because only these are guaranteed to be continuous. Get every other quantity from it.</li>
<li><strong>Polarity first:</strong> an initial voltage or current that points against the reference is negative. Read the figure before you write $x(0)$.</li>
</ul>`
      },
      {
        title: "In real life",
        html: t`<ul>
<li><strong>A pacemaker (Nilsson’s simplified model):</strong> a capacitor charges toward the battery voltage; at 75% of it, a controller fires a pulse into the heart and starts again. Doubling $R$ halves the heart rate (S14).</li>
<li><strong>A relay letting go:</strong> after the switch opens, the coil current decays through a diode; adding a resistor shortens $\tau$, so the relay releases sooner, but raises the voltage spike (S15).</li>
</ul>`
      },
      {
        title: "How to study this chapter, and where AI fits",
        html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>In a 2025 study of Gemini 2.5 Pro on undergraduate circuit problems, misread source polarities caused 6 of its 17 wrong answers, and misread current directions 5 (a small sample, but a clear pattern; <a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). In this chapter they show up as an initial voltage with the wrong sign, or a time constant built from the wrong resistance. S11 shows a polarity slip, and S12 a wrong resistance: find them before you trust any answer.</li>
<li>Check every answer yourself: $x(0)$ must equal the initial value, $x(\infty)$ the final value, and $\tau$ must come from the circuit after switching.</li>
<li>The quiz is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
      }
    ],

    // "Checklist: you can do these without help".
    checklist: [
      "Find the initial inductor current or capacitor voltage from the circuit before switching",
      "Find the final value from the circuit long after switching",
      t`Find $\tau$ from the resistance the element sees, with a test source when there is a dependent source`,
      t`Write $x(t) = x_f + (x_0 - x_f)\exp(-t/\tau)$ and find other currents and voltages from it`,
      t`Say which quantities can jump at $t = 0$ and find their values at $t = 0^+$`,
      t`Work backwards from a measured response to $\tau$, $R$, $L$ or $C$`
    ]
  };
})(window.EENG);
