// Chapter 2 page content, from "Introduction (students).pdf".
// Math goes between $…$ (inline) or $$…$$ (display). Sections are plain HTML.
(function (E) {
  var t = String.raw;
  E.chapters[2] = {
    lead: t`Chapter 2 gives you the first three circuit elements (voltage sources, current sources and resistors) and the three laws you will use to analyse every circuit in this course: Ohm’s law, Kirchhoff’s current law and Kirchhoff’s voltage law. With them you can solve any circuit built from sources and resistors, one equation at a time.`,

    sections: [
      {
        title: "What you will learn",
        html: t`<ul>
<li><strong>Ideal sources:</strong> an ideal voltage source holds its voltage whatever its current; an ideal current source holds its current whatever its voltage.</li>
<li><strong>Dependent sources:</strong> a source whose value is set by a voltage or current elsewhere in the circuit. It is drawn as a diamond.</li>
<li><strong>Ohm’s law:</strong> $v = iR$ when the current arrow enters the + terminal, and $v = -iR$ when it enters the − terminal.</li>
<li><strong>Kirchhoff’s current law (KCL):</strong> the currents leaving any node add up to zero.</li>
<li><strong>Kirchhoff’s voltage law (KVL):</strong> the voltage drops around any closed path add up to zero.</li>
<li><strong>The power balance:</strong> every answer in this chapter ends with one.</li>
</ul>`
      },
      {
        title: "Later in this course",
        html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Chapter</th><th>Where Chapter 2 comes back</th></tr></thead><tbody>
<tr><td>3 Simple resistive circuits</td><td>Series and parallel rules, and voltage and current division, all follow from KCL, KVL and Ohm’s law</td></tr>
<tr><td>4 Analysis techniques</td><td>The node-voltage method is KCL written systematically; the mesh-current method is KVL written systematically</td></tr>
<tr><td>5 Operational amplifiers</td><td>An op amp is modelled with a dependent source</td></tr>
<tr><td>6 Inductors and capacitors</td><td>KCL and KVL still hold; only the element laws change</td></tr>
<tr><td>7 First-order circuits</td><td>Every RL and RC equation starts from KCL or KVL</td></tr>
</tbody></table></div>`
      },
      {
        title: "In your program",
        html: t`<ul>
<li><strong>Electrical and Electronics:</strong> transistor and amplifier models are built from dependent sources, and power networks are analysed with KCL and KVL at every node.</li>
<li><strong>Computer, Communication and Telecom:</strong> logic gates and chips are modelled as sources and resistors, and KCL decides how many inputs one output can drive.</li>
<li><strong>Biomedical:</strong> a skin electrode is modelled as a small voltage source with a series resistance, the same model you will build for a car battery in S15.</li>
<li><strong>Mechanical and Industrial:</strong> heaters and sensors are sized with Ohm’s law and $P = v^2/R$, and a strain gauge is a resistor whose resistance changes as it stretches.</li>
<li><strong>Surveying:</strong> total stations and GNSS receivers run on battery packs whose terminal voltage drops under load, the source-plus-resistance model again.</li>
</ul>`
      },
      {
        title: "As an engineer",
        html: t`<ul>
<li><strong>Two laws, every circuit.</strong> Gustav Kirchhoff stated his current and voltage laws in 1845, while still a student. They describe every circuit you will ever analyse, from a phone charger to a national grid.</li>
<li><strong>Wiring changes everything.</strong> Two identical heaters in series give a quarter of the heat of the same two in parallel (S16, and Nilsson’s Practical Perspective for this chapter).</li>
<li><strong>Checking is the job.</strong> A power balance takes a minute and catches most sign errors before anything is built.</li>
</ul>`
      },
      {
        title: "In real life",
        html: t`<ul>
<li><strong>Your heater on a generator line.</strong> A 2000 W, 220 V heater draws about 9 A, so on its own it trips a 5 A generator subscription. If the line sags to 200 V, its power falls by about 17%, not 9%, because $P = v^2/R$ (S6).</li>
<li><strong>A car that won’t start.</strong> A battery that reads 12.6 V at rest drops to around 10 V while the starter draws a few hundred amperes. The drop is the battery’s internal resistance, and it is why the headlights dim while you crank the engine (S15).</li>
</ul>`
      },
      {
        title: "How to study this chapter, and where AI fits",
        html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>In a 2025 study of Gemini 2.5 Pro on undergraduate circuit problems, misread source polarities caused about a third of its wrong answers, and misread current directions nearly as many (<a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). In this chapter that means the sign of a current in a KCL equation and the direction of a dependent source. S13 shows such a mistake: find it before you trust any answer.</li>
<li>Finish every problem with a power balance. It is your own check, and it needs no device.</li>
<li>The quiz is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
      }
    ],

    // "Checklist: you can do these without help".
    checklist: [
      "Say whether two ideal sources may be connected together, and why",
      "Name the four kinds of dependent source and the unit of each gain",
      "Write Ohm’s law with the right sign from a diagram",
      "Write KCL at a node and KVL around a loop with consistent signs",
      "Solve a circuit with two unknowns, including one with a dependent source",
      "Check every answer with a power balance"
    ]
  };
})(window.EENG);
