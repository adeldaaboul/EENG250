// Chapter 1 page content, from "1 Introduction (students).pdf".
// Math goes between $…$ (inline) or $$…$$ (display). Sections are plain HTML.
(function (E) {
  var t = String.raw;
  E.chapters[1] = {
    lead: t`Chapter 1 gives you four quantities (charge, current, voltage and power) and one rule, the passive sign convention. You will use them in every chapter of this course and in every electrical course after it.`,

    sections: [
      {
        title: "What you will learn",
        html: t`<ul>
<li><strong>Units and prefixes:</strong> reading 0.000047 A as 47 µA, and never mixing mA with A.</li>
<li><strong>Current and voltage:</strong> $i = dq/dt$ (charge per second) and $v = dw/dq$ (energy per coulomb).</li>
<li><strong>Power and energy:</strong> $p = vi$, and $w = \int p\,dt$.</li>
<li><strong>The passive sign convention:</strong> deciding from a diagram whether an element absorbs or delivers power.</li>
<li><strong>The power balance:</strong> the powers in any circuit add up to zero. This is your main self-check.</li>
</ul>`
      },
      {
        title: "Later in this course",
        html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Chapter</th><th>Where Chapter 1 comes back</th></tr></thead><tbody>
<tr><td>2 Circuit elements</td><td>Every booklet problem ends with a power balance</td></tr>
<tr><td>3 Simple resistive circuits</td><td>Power ratings of resistors; signs in voltage and current division</td></tr>
<tr><td>4 Analysis techniques</td><td>Signs in node and mesh equations; maximum power transfer</td></tr>
<tr><td>5 Operational amplifiers</td><td>Supply rails limit the output voltage; power delivered to a load</td></tr>
<tr><td>6 Inductors and capacitors</td><td>Stored energy, $w = \tfrac12 Li^2$ and $w = \tfrac12 Cv^2$</td></tr>
<tr><td>7 First-order circuits</td><td>Energy released as a capacitor or inductor discharges</td></tr>
</tbody></table></div>`
      },
      {
        title: "In your program",
        html: t`<ul>
<li><strong>Electrical and Electronics:</strong> every component has a power rating. At grid scale, the same sign rule decides which generator supplies and which load absorbs.</li>
<li><strong>Computer, Communication and Telecom:</strong> phones and sensors run on power budgets, and datasheets quote mW and µA on every page.</li>
<li><strong>Biomedical:</strong> medical devices are specified by energy and current. A defibrillator shock is set in joules, and patient leakage currents are limited in microamperes.</li>
<li><strong>Mechanical and Industrial:</strong> motors, pumps and electric vehicles are rated in kW, and plant energy audits are done in kWh.</li>
<li><strong>Surveying:</strong> field instruments and survey drones run on batteries rated in watt-hours.</li>
</ul>`
      },
      {
        title: "As an engineer",
        html: t`<ul>
<li><strong>Units cost missions.</strong> In 1999 NASA lost the Mars Climate Orbiter because one team’s software reported thruster impulse in pound-force seconds while the navigation software expected newton-seconds (<a href="https://everydayastronaut.com/mars-climate-orbiter/" target="_blank" rel="noopener">source</a>).</li>
<li><strong>Signs carry meaning.</strong> Whether a battery is charging or discharging, or a solar inverter is feeding the grid or drawing from it, is the sign of $p$.</li>
<li><strong>Checking is the job.</strong> A power balance is how engineers verify an analysis before anything is built.</li>
</ul>`
      },
      {
        title: "In real life",
        html: t`<ul>
<li><strong>Your generator subscription.</strong> In Lebanon, a private generator subscription is sized in amperes (5 A, 10 A, …) and billed per kWh at a tariff the Ministry of Energy and Water sets each month (<a href="https://smartioleb.com/generator-tariff-lebanon/" target="_blank" rel="noopener">source</a>). The ampere size limits your <em>power</em>: 5 A × 220 V ≈ 1.1 kW at any moment, which is why the breaker trips when a kettle and a heater run together. The kWh meter counts your <em>energy</em>. Power versus energy is Chapter 1.</li>
<li><strong>Your power bank.</strong> A 10,000 mAh power bank at 3.7 V stores 37 Wh. Airlines allow up to 100 Wh in carry-on baggage, and 100–160 Wh only with airline approval (<a href="https://www.iata.org/en/youandiata/travelers/batteries/" target="_blank" rel="noopener">IATA</a>).</li>
<li><strong>A car jump-start.</strong> Which car has the dead battery? The sign of $p$ tells you (booklet Problem 1.1).</li>
</ul>`
      },
      {
        title: "How to study this chapter, and where AI fits",
        html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>AI chatbots often misread polarities and current directions in circuit diagrams. In a 2025 study of Gemini 2.5 Pro, misread source polarities caused about a third of its wrong answers on undergraduate circuit problems, and misread current directions nearly as many (<a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). That is exactly the skill Chapter 1 teaches, so check the signs in every AI answer.</li>
<li>The quiz at the next session is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
      }
    ],

    // "You can do these without help". The practice sheet tags each question with these numbers.
    checklist: [
      "Write any value in engineering notation with the right prefix",
      "Find charge from a current graph (area) and current from a charge function (slope)",
      t`Say what a negative $v$ or $i$ means physically`,
      t`Write $p = vi$ or $p = -vi$ from a diagram, and say whether the element absorbs or delivers`,
      "Compute energy for constant and for time-varying power",
      "Check an answer with a power balance"
    ]
  };
})(window.EENG);
