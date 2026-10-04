// Chapter 6 page content, from "Introduction (students).pdf".
// Math goes between $…$ (inline) or $$…$$ (display). Sections are plain HTML.
(function (E) {
  var t = String.raw;
  E.chapters[6] = {
    lead: t`Chapter 6 adds the two elements that store energy: the inductor and the capacitor. Their voltage and current are linked by a derivative, not by Ohm’s law, so they remember the past. Chapter 6 runs through week 11, and its quiz is at the start of week 12.`,

    sections: [
      {
        title: "What you will learn",
        html: t`<ul>
<li><strong>The inductor:</strong> $v = L\,\tfrac{di}{dt}$. Its current cannot change instantly, and in a dc circuit it acts as a short circuit. It stores $w = \tfrac12 Li^2$.</li>
<li><strong>The capacitor:</strong> $i = C\,\tfrac{dv}{dt}$. Its voltage cannot change instantly, and in a dc circuit it acts as an open circuit. It stores $w = \tfrac12 Cv^2$.</li>
<li><strong>From one to the other:</strong> $i(t) = \tfrac{1}{L}\int v\,dt + i(0)$ and $v(t) = \tfrac{1}{C}\int i\,dt + v(0)$. The initial value carries the element’s history, and its sign follows the reference direction.</li>
<li><strong>Power and energy:</strong> $p = vi$ can be positive (the element stores energy) or negative (it gives energy back). Neither element dissipates energy.</li>
<li><strong>Series and parallel:</strong> inductors combine like resistors; capacitors combine the other way round. Initial currents of parallel inductors add at a node, and initial voltages of series capacitors add along the path.</li>
<li><strong>Black boxes:</strong> when stored energy flows into a load, some of it can stay trapped in the elements.</li>
</ul>`
      },
      {
        title: "Later in this course",
        html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Topic</th><th>Where Chapter 6 comes back</th></tr></thead><tbody>
<tr><td>Chapter 7: Natural response</td><td>An inductor’s current and a capacitor’s voltage decay through a resistor; their values just before switching give the initial conditions</td></tr>
<tr><td>Chapter 7: Step response</td><td>In a dc circuit an inductor ends as a short circuit and a capacitor as an open circuit; that gives the final values</td></tr>
</tbody></table></div>`
      },
      {
        title: "In your program",
        html: t`<ul>
<li><strong>Electrical and Electronics:</strong> motors, transformers and relays are inductors at heart; capacitor banks correct the power factor in factories and substations.</li>
<li><strong>Computer, Communication and Telecom:</strong> every bit in a DRAM chip is charge on a tiny capacitor; inductors and capacitors set the frequency of every filter and oscillator in a radio.</li>
<li><strong>Biomedical:</strong> a defibrillator charges a capacitor over a few seconds and releases the energy into the heart in a few milliseconds.</li>
<li><strong>Mechanical and Industrial:</strong> solenoid valves and contactors are inductors; switching them off without protection produces large voltage spikes.</li>
<li><strong>Surveying:</strong> the touch screens of field controllers and data collectors are grids of capacitors.</li>
</ul>`
      },
      {
        title: "As an engineer",
        html: t`<ul>
<li><strong>The current in an inductor and the voltage across a capacitor cannot jump.</strong> Use this to find the values just after a switch moves.</li>
<li><strong>Signs come from the reference arrows.</strong> An initial current or voltage that points against the reference is negative. Read the figure before you write $i(0)$.</li>
<li><strong>Energy has to go somewhere.</strong> Stored energy is either delivered to the rest of the circuit or stays trapped; it is never lost inside an ideal inductor or capacitor.</li>
</ul>`
      },
      {
        title: "In real life",
        html: t`<ul>
<li><strong>The spark when a relay switches off.</strong> A relay coil’s current cannot stop instantly, so when the switch that drives it opens, the voltage across the coil rises far above the supply and can arc across the switch or damage the transistor. A diode across the coil gives the current a path (slides 2 and 21).</li>
<li><strong>Supercapacitors.</strong> A 3000 F cell stores about 11 kJ at 2.7 V. Stacking cells in series raises the voltage but lowers the capacitance (S14).</li>
<li><strong>Touch screens.</strong> Your finger changes the capacitance of the electrodes under it by a few picofarads; the phone measures that change (S15, and Nilsson’s Practical Perspective for this chapter).</li>
</ul>`
      },
      {
        title: "How to study this chapter, and where AI fits",
        html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>In a 2025 study of Gemini 2.5 Pro on undergraduate circuit problems, misread source polarities caused about a third of its wrong answers, and misread current directions nearly as many (<a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). In this chapter the same slips show up as an initial current or voltage with the wrong sign, or initial currents added without looking at their directions. S12 shows such a slip, and S13 an energy balance that forgets the trapped energy: find them before you trust any answer.</li>
<li>Check every answer yourself: put $t = 0$ into your result to recover the initial value, and differentiate it to recover the given voltage or current.</li>
<li>The quiz is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
      }
    ],

    // "Checklist: you can do these without help".
    checklist: [
      "Find an inductor’s voltage from its current, and its current from its voltage and initial current",
      "Do the same for a capacitor’s current and voltage",
      "Find the power and stored energy, and say when the element stores or returns energy",
      "State the dc behaviour of each element and which quantity cannot change instantly",
      "Combine inductors or capacitors in series and parallel, with their initial currents or voltages",
      "Find the energy delivered to a black box and the energy trapped in the elements"
    ]
  };
})(window.EENG);
