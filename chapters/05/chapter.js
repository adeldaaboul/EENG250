// Chapter 5 page content, from "Introduction (students).pdf".
// Math goes between $…$ (inline) or $$…$$ (display). Sections are plain HTML.
(function (E) {
  var t = String.raw;
  E.chapters[5] = {
    lead: t`Chapter 5 introduces the first active element of the course: the operational amplifier, or op amp. With two rules and the node equations of Chapter 4 you can design circuits that amplify, add, subtract and buffer signals. Chapter 5 runs from week 9, session 2, to the end of week 10, and its quiz is at the start of week 11.`,

    sections: [
      {
        title: "What you will learn",
        html: t`<ul>
<li><strong>The ideal op amp:</strong> with negative feedback and in its linear region, no current enters either input ($i_p = i_n = 0$) and the two input voltages are equal ($v_p = v_n$).</li>
<li><strong>Saturation:</strong> the output can never go beyond the supply voltages. Outside that range the two rules no longer hold.</li>
<li><strong>The inverting amplifier:</strong> $v_o = -\tfrac{R_f}{R_s} v_s$.</li>
<li><strong>The summing amplifier:</strong> several inputs, each scaled by $R_f$ over its own input resistor, then added and inverted.</li>
<li><strong>The noninverting amplifier:</strong> $v_o = \left(1 + \tfrac{R_f}{R_s}\right) v_g$, and with $R_f = 0$ the voltage follower, which copies a voltage without loading it.</li>
<li><strong>The difference amplifier:</strong> $v_o = \tfrac{R_b}{R_a}(v_b - v_a)$ when the resistor ratios on the two inputs match.</li>
<li><strong>Cascades:</strong> the output of one stage drives the next, and each stage must stay inside its supplies.</li>
</ul>`
      },
      {
        title: "Later in this course",
        html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Topic</th><th>Where Chapter 5 comes back</th></tr></thead><tbody>
<tr><td>Chapter 6: Inductors and capacitors</td><td>An op amp with a capacitor in the feedback path integrates its input; the same node equation with a capacitor current</td></tr>
<tr><td>Chapter 7: First-order circuits</td><td>Op-amp circuits with a capacitor charge and discharge with a time constant, found with the methods of Chapter 7</td></tr>
</tbody></table></div>`
      },
      {
        title: "In your program",
        html: t`<ul>
<li><strong>Electrical and Electronics:</strong> amplifiers, filters, voltage regulators and the control loops of motor drives are built around op amps.</li>
<li><strong>Computer, Communication and Telecom:</strong> every analog signal that reaches a processor, from a microphone, an antenna or a sensor, passes through op-amp stages that scale and shift it for the analog-to-digital converter.</li>
<li><strong>Biomedical:</strong> an ECG amplifier is a difference amplifier: it amplifies the tiny difference between two electrodes and rejects what both pick up.</li>
<li><strong>Mechanical and Industrial:</strong> strain gauges, thermocouples and pressure sensors give millivolts; op amps turn them into volts a controller can read.</li>
<li><strong>Surveying:</strong> the sensors inside levels, total stations and GNSS receivers feed op-amp stages before their signals are digitised.</li>
</ul>`
      },
      {
        title: "As an engineer",
        html: t`<ul>
<li><strong>Two rules, then node equations.</strong> Check for negative feedback, set $v_n = v_p$ and $i_n = i_p = 0$, and write KCL at the inverting input. Every circuit in this chapter yields to that recipe.</li>
<li><strong>Always check the supplies.</strong> An answer outside the supply range is not an answer: the op amp saturates, and the output sits at a supply voltage.</li>
<li><strong>The inputs draw no current; the output can.</strong> The output current comes from the supplies, which is why an op amp can drive a load that would collapse a divider.</li>
</ul>`
      },
      {
        title: "In real life",
        html: t`<ul>
<li><strong>Monitoring a solar battery bank.</strong> A divider scales 60 V down to 5 V for a display, but the display’s own resistance pulls the reading down. A voltage follower between them fixes it (S7).</li>
<li><strong>From a sensor to a microcontroller.</strong> A temperature sensor gives 10 mV per °C; an op amp scales and shifts that signal so that the microcontroller’s 0–5 V input range is used in full (S15, and Nilsson’s Practical Perspective for this chapter).</li>
</ul>`
      },
      {
        title: "How to study this chapter, and where AI fits",
        html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>In a 2025 study of Gemini 2.5 Pro on undergraduate circuit problems, misread source polarities caused about a third of its wrong answers, and misread current directions nearly as many (<a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). In op-amp circuits these slips show up as a feedback current sent the wrong way, which flips the sign of the gain, or as $v_n$ set to 0 when the noninverting input is not grounded. S11 shows a direction slip, and S12 a formula used where it does not apply: find them before you trust any answer.</li>
<li>Check every answer yourself: KCL at the inverting input must hold with your $v_o$, and $v_o$ must lie between the supplies.</li>
<li>The quiz is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
      }
    ],

    // "Checklist: you can do these without help".
    checklist: [
      "State the two ideal op-amp rules and when they apply",
      t`Name an amplifier’s configuration from its circuit and write $v_o$ in terms of its inputs`,
      "Analyse the inverting, summing, noninverting and difference amplifiers with KCL at the inverting input",
      "Find the range of an input that keeps the op amp linear, and the output when it saturates",
      "Find the current in a load and at the op amp’s output",
      "Analyse two op amps in cascade and say which stage saturates first"
    ]
  };
})(window.EENG);
