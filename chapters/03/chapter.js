// Chapter 3 page content, from "Introduction (students).pdf".
// Math goes between $…$ (inline) or $$…$$ (display). Sections are plain HTML.
(function (E) {
  var t = String.raw;
  E.chapters[3] = {
    lead: t`Chapter 3 turns the laws of Chapter 2 into shortcuts. Instead of writing a KCL or KVL equation for every node and loop, you will combine resistors, split a voltage or a current in one line, and handle networks that look impossible at first sight. Most circuits in this course, and most of the midterm, use these shortcuts.`,

    sections: [
      {
        title: "What you will learn",
        html: t`<ul>
<li><strong>Series resistors:</strong> they carry the same current, and their resistances add.</li>
<li><strong>Parallel resistors:</strong> they share the same two nodes and the same voltage. For two of them, the equivalent is the product over the sum, $R_1R_2/(R_1 + R_2)$.</li>
<li><strong>Voltage division:</strong> in a series string, each resistor takes a share of the voltage in proportion to its resistance.</li>
<li><strong>Current division:</strong> in a parallel group, each resistor takes a share of the current in inverse proportion to its resistance.</li>
<li><strong>Loading:</strong> connecting a load to a voltage divider changes its output, unless the load is much larger than the resistor it sits across.</li>
<li><strong>Delta-to-wye (Δ-to-Y) and wye-to-delta (Y-to-Δ):</strong> the tool for bridges and other networks with no series or parallel pairs.</li>
</ul>`
      },
      {
        title: "Later in this course",
        html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Chapter</th><th>Where Chapter 3 comes back</th></tr></thead><tbody>
<tr><td>4 Analysis techniques</td><td>Thévenin and Norton equivalents, source transformations and maximum power transfer all need $R_{eq}$; dividers are the quickest way to check a node voltage</td></tr>
<tr><td>5 Operational amplifiers</td><td>The gain of an inverting or non-inverting amplifier is set by a ratio of two resistors; in the non-inverting amplifier they form a voltage divider</td></tr>
<tr><td>6 Inductors and capacitors</td><td>Inductors combine like resistors; capacitors combine the other way round</td></tr>
<tr><td>7 First-order circuits</td><td>The time constant $\tau = RC$ or $L/R$ uses the equivalent resistance seen by the capacitor or inductor</td></tr>
</tbody></table></div>`
      },
      {
        title: "In your program",
        html: t`<ul>
<li><strong>Electrical and Electronics:</strong> a transistor amplifier is biased with a voltage divider, and every sensor input is a divider whose loading must be checked.</li>
<li><strong>Computer, Communication and Telecom:</strong> pull-up resistors and level shifters are voltage dividers, and sensors are often connected to a microcontroller’s analog input through one.</li>
<li><strong>Biomedical:</strong> strain gauges and many pressure sensors sit in a Wheatstone bridge, the circuit you will analyse in S12 and S13.</li>
<li><strong>Mechanical and Industrial:</strong> a heater with two elements gives low, medium and high settings by connecting them in series, alone or in parallel.</li>
<li><strong>Surveying:</strong> the level sensors in many instruments are read through a bridge or a divider, so their output depends on the same ratios.</li>
</ul>`
      },
      {
        title: "As an engineer",
        html: t`<ul>
<li><strong>One line instead of four equations.</strong> A divider gives a voltage or a current in one step, and it tells you at a glance how the answer changes when a resistor changes.</li>
<li><strong>Loading is a design rule.</strong> A divider only delivers its design voltage if the load is much larger than the bottom resistor (S4, S6, and Nilsson Example 3.4).</li>
<li><strong>Bridges measure.</strong> When a bridge is balanced, no current flows across the middle; that is how a Wheatstone bridge measures an unknown resistance precisely (S13).</li>
</ul>`
      },
      {
        title: "In real life",
        html: t`<ul>
<li><strong>Your generator cable.</strong> A neighbourhood generator may hold 220 V at its terminals, but the cable to your home has resistance. The cable and your appliances form a voltage divider, so your home receives less than 220 V, and more so when you draw more current (S15).</li>
<li><strong>A resistive touch screen.</strong> Screens of this kind, still used on some card terminals and industrial panels, find your finger with one voltage measurement per direction: the touch splits a resistive sheet into two parts, and the measured voltage is a fraction of the supply set by where you touch (S16, and Nilsson’s Practical Perspective for this chapter).</li>
</ul>`
      },
      {
        title: "How to study this chapter, and where AI fits",
        html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>In a 2025 study of Gemini 2.5 Pro on undergraduate circuit problems, misread source polarities caused about a third of its wrong answers, and misread current directions nearly as many (<a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). In this chapter, the commonest slips are putting the wrong resistance in a divider formula and treating two resistors as series or parallel when they are not. S9 shows one: find it before you trust any answer.</li>
<li>Check every answer yourself: resistors in parallel must have the same voltage, a divided voltage or current can never be larger than the total, and the powers must add to zero. These checks need no device.</li>
<li>The quiz is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
      }
    ],

    // "Checklist: you can do these without help".
    checklist: [
      "Say which resistors are in series and which are in parallel, and why",
      "Spot a wire that shorts out a resistor",
      "Find the equivalent resistance of a series-parallel network",
      "Use voltage division and current division, and check the result",
      "Explain why a load changes a divider’s output",
      "Convert a Δ to a Y and a Y to a Δ, and use it to solve a bridge"
    ]
  };
})(window.EENG);
