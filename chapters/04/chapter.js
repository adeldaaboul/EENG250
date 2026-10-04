// Chapter 4 page content (two parts), from "Introduction (students) – Part 1/2.pdf".
// Math goes between $…$ (inline) or $$…$$ (display). Sections are plain HTML.
(function (E) {
  var t = String.raw;
  E.chapters[4] = {
    lead: t`Chapter 4 turns circuit analysis into a method. Instead of choosing equations by hand, you will write exactly the equations a circuit needs, in a fixed order, and solve them. Chapter 4 runs from week 5 to week 9, the largest share of the material on the final exam.`,

    parts: [
      {
        title: "Part 1: Node Voltages and Mesh Currents",
        lead: t`Part 1 (weeks 5–6) covers the two methods every later topic relies on: node voltages and mesh currents.`,

        sections: [
          {
            title: "What you will learn in Part 1",
            html: t`<ul>
<li><strong>Counting:</strong> essential nodes, essential branches and meshes tell you how many equations a circuit needs, before you write any.</li>
<li><strong>The node-voltage method:</strong> pick a reference node, then write KCL at every other essential node, with each current written from the node voltages.</li>
<li><strong>Dependent sources:</strong> add one constraint equation that expresses the controlling voltage or current through your unknowns.</li>
<li><strong>Special cases with voltage sources:</strong> a source to the reference fixes a node voltage; a source between two non-reference essential nodes makes a supernode.</li>
<li><strong>The mesh-current method:</strong> give each mesh a clockwise current and write KVL around it; a shared resistor carries the difference of two mesh currents.</li>
<li><strong>Special cases with current sources:</strong> a current source in one mesh fixes that mesh current; a source shared by two meshes makes a supermesh.</li>
<li><strong>Choosing a method:</strong> count the equations each method needs and pick the one with fewer.</li>
</ul>`
          },
          {
            title: "Later in this course",
            html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Topic</th><th>Where Part 1 comes back</th></tr></thead><tbody>
<tr><td>Part 2: source transformations and superposition</td><td>Both are checked by solving the same circuit with node voltages or mesh currents</td></tr>
<tr><td>Part 2: Thévenin and Norton equivalents</td><td>The open-circuit voltage, the short-circuit current and the test-source method are all found with node or mesh equations</td></tr>
<tr><td>Chapter 5: Operational amplifiers</td><td>Op-amp circuits are solved with node equations written at the op-amp inputs</td></tr>
<tr><td>Chapter 7: First-order circuits</td><td>The resistance seen by a capacitor or an inductor is found with the same methods</td></tr>
</tbody></table></div>`
          },
          {
            title: "In your program",
            html: t`<ul>
<li><strong>Electrical and Electronics:</strong> power-flow studies of a national grid write node equations at every bus (a node of the network, such as a substation), the node-voltage method on a very large scale.</li>
<li><strong>Computer, Communication and Telecom:</strong> circuit simulators used to design chips, such as SPICE (developed at UC Berkeley and first presented in 1973), solve circuits by writing node equations, an extended form of this week’s method.</li>
<li><strong>Biomedical:</strong> models of tissue and electrode interfaces are networks of resistors and sources solved node by node.</li>
<li><strong>Mechanical and Industrial:</strong> heat flows through walls and pipes are modelled as resistor networks, and the same node equations give the temperatures.</li>
<li><strong>Surveying:</strong> instrument circuits with several batteries and loads are checked with the same node and mesh equations.</li>
</ul>`
          },
          {
            title: "As an engineer",
            html: t`<ul>
<li><strong>Count before you write.</strong> Two minutes spent counting essential nodes and meshes, and spotting supernodes and supermeshes, often halves the algebra.</li>
<li><strong>Signs are a convention, not a guess.</strong> Currents leaving a node are positive; voltage drops around a mesh are positive. Keep the rule and the signs take care of themselves.</li>
<li><strong>Check without solving again.</strong> Substitute your answers into KCL at each node, reading every direction from the figure. A power balance catches most slips too, but not a polarity misread the same way throughout.</li>
</ul>`
          },
          {
            title: "In real life",
            html: t`<ul>
<li><strong>Jump-starting a car.</strong> A good battery, a flat battery and the starter motor all connect to the same two terminals: one node equation tells you whether the flat battery is being charged or is helping to crank the engine (S15).</li>
<li><strong>Every simulator you will use.</strong> Circuit simulation software writes the node equations of Part 1 automatically for circuits with thousands of nodes. Knowing the method lets you judge whether its answer makes sense.</li>
</ul>`
          },
          {
            title: "How to study this part, and where AI fits",
            html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>In a 2025 study of Gemini 2.5 Pro on undergraduate circuit problems, misread source polarities caused about a third of its wrong answers, and misread current directions nearly as many (<a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). In node and mesh equations these slips show up as a current entered with the wrong sign, a shared resistor written with the mesh currents the wrong way round, or a current direction misread when finding a power. S11 and S12 show such slips: find them before you trust any answer.</li>
<li>Check every answer yourself: KCL at each node and a power balance need no device.</li>
<li>The quiz is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
          }
        ],

        // "Checklist: you can do these without help".
        checklist: [
          t`Count the essential nodes and meshes, and say how many equations each method needs`,
          t`Write node-voltage equations, including a dependent source, a known node voltage and a supernode`,
          t`Write mesh-current equations, including a dependent source, a known mesh current and a supermesh`,
          t`Choose the method with fewer equations, and say why`,
          t`Find the power of every source and say whether it absorbs or delivers`,
          t`Check a solution with KCL at each node, KVL around an unused loop, or a power balance`
        ]
      },

      {
        title: "Part 2: Thévenin Equivalents, Superposition and Maximum Power",
        lead: t`Part 1 gave you methods that solve any circuit. Part 2 gives you tools that make a circuit simpler before you solve it, and that answer the questions engineers actually ask: what does a load see, what happens when one source changes, and how much power can a source deliver? Part 2 runs from week 7 to week 9, and the Part 2 quiz is at the start of week 10.`,

        sections: [
          {
            title: "What you will learn in Part 2",
            html: t`<ul>
<li><strong>Source transformations:</strong> a voltage source in series with a resistor can be replaced by a current source in parallel with the same resistor, and back again. A chain of these reduces a circuit step by step.</li>
<li><strong>Superposition:</strong> in a linear circuit with several independent sources, any current or voltage is the sum of the contributions of each source acting alone. Powers do not add this way.</li>
<li><strong>Thévenin equivalent:</strong> seen from two terminals, any linear circuit behaves like one voltage source $V_{\text{Th}}$ in series with one resistor $R_{\text{Th}}$. $V_{\text{Th}}$ is the open-circuit voltage; $R_{\text{Th}} = V_{\text{Th}}/i_{\text{sc}}$ (use a test source when both are zero).</li>
<li><strong>Norton equivalent:</strong> the same circuit seen as a current source $I_N = i_{\text{sc}}$ in parallel with $R_{\text{Th}}$.</li>
<li><strong>Finding $R_{\text{Th}}$:</strong> deactivate the independent sources and combine resistors, or, when dependent sources are present, apply a test source.</li>
<li><strong>Maximum power transfer:</strong> a load receives the most power when its resistance equals $R_{\text{Th}}$, and that power is $(V_{\text{Th}})^2/(4R_{\text{Th}})$.</li>
</ul>`
          },
          {
            title: "Later in this course",
            html: t`<div class="table-scroll"><table class="data-table">
<thead><tr><th>Topic</th><th>Where Part 2 comes back</th></tr></thead><tbody>
<tr><td>Chapter 5: Operational amplifiers</td><td>The source driving an amplifier and the load it drives are both modelled as Thévenin equivalents</td></tr>
<tr><td>Chapter 7: First-order circuits</td><td>A capacitor or inductor sees the rest of the circuit as one Thévenin equivalent; the time constant $\tau = R_{\text{Th}}C$ or $L/R_{\text{Th}}$ uses the Thévenin resistance seen by the capacitor or inductor, often found with a test source</td></tr>
</tbody></table></div>`
          },
          {
            title: "In your program",
            html: t`<ul>
<li><strong>Electrical and Electronics:</strong> a power system engineer models the whole grid behind a substation as a Thévenin equivalent to work out what a fault or a new load will do; an amplifier’s input and output are specified by their Thévenin resistances.</li>
<li><strong>Computer, Communication and Telecom:</strong> antennas, cables and receivers are matched so that maximum power reaches the receiver, the same condition $R_L = R_{\text{Th}}$ in its general form.</li>
<li><strong>Biomedical:</strong> an electrode on the skin is a Thévenin source with a large $R_{\text{Th}}$, which is why the amplifier reading it needs an even larger input resistance.</li>
<li><strong>Mechanical and Industrial:</strong> a sensor and its wiring form a Thévenin source; the reading drops when the instrument draws current.</li>
<li><strong>Surveying:</strong> the battery pack of a field instrument is an open-circuit voltage behind an internal resistance, a Thévenin equivalent; that is why its voltage sags when the instrument draws current.</li>
</ul>`
          },
          {
            title: "As an engineer",
            html: t`<ul>
<li><strong>Reduce before you solve.</strong> One Thévenin equivalent replaces a whole network when only one load changes, so each new load takes one line instead of a new set of equations.</li>
<li><strong>Measure two points, know the source.</strong> The open-circuit voltage and the voltage under one known load are enough to find $V_{\text{Th}}$ and $R_{\text{Th}}$ of a real source you cannot open.</li>
<li><strong>Maximum power is not maximum efficiency.</strong> At maximum power transfer the load receives only half the power of the Thévenin source, and in the real circuit often less (S10: 32%). Power systems run far from this point; signal circuits often sit on it.</li>
</ul>`
          },
          {
            title: "In real life",
            html: t`<ul>
<li><strong>Your generator subscription.</strong> The socket voltage falls each time you switch on a heater. Two readings, with nothing on and with one heater on, give the Thévenin equivalent of the generator and its cables, and predict the voltage with any load (S15).</li>
<li><strong>A power bank or phone charger.</strong> Its open-circuit voltage and internal resistance decide how fast your phone charges, and why a long, thin cable can slow it down.</li>
</ul>`
          },
          {
            title: "How to study this part, and where AI fits",
            html: t`<ul>
<li>AI tools are allowed on the practice sheet. Use them to check your work, not to replace it.</li>
<li>In a 2025 study of Gemini 2.5 Pro on undergraduate circuit problems, misread source polarities caused about a third of its wrong answers, and misread current directions nearly as many (<a href="https://arxiv.org/html/2512.10159" target="_blank" rel="noopener">arXiv 2512.10159</a>). In this part these slips show up as a current-source arrow pointing the wrong way after a source transformation, a Thévenin source drawn upside down, or a current from one source added with the wrong sign in superposition. S11 shows such a slip, and S12 another common one, a current source deactivated as a short circuit: find them before you trust any answer.</li>
<li>Check every answer yourself: $V_{\text{Th}}/R_{\text{Th}}$ must equal the short-circuit current, $R_{\text{Th}}$ found by deactivation must agree with $V_{\text{Th}}/i_{\text{sc}}$, and the powers must add to zero.</li>
<li>The quiz is device-free, and every question is a twin of a practice-sheet question. If you can do the sheet on your own, you will do well on the quiz.</li>
</ul>`
          }
        ],

        // "Checklist: you can do these without help".
        checklist: [
          t`Transform a voltage source with a series resistor into a current source with a parallel resistor, with the arrow the right way, and back`,
          t`Use superposition to find a current, and explain why powers cannot be added`,
          t`Find $V_{\text{Th}}$, $i_{\text{sc}}$ and $R_{\text{Th}}$, and draw the Thévenin and Norton equivalents`,
          t`Find $R_{\text{Th}}$ by deactivating the independent sources, and with a test source when the circuit has a dependent source`,
          t`Choose the load for maximum power transfer and find that power and the efficiency`,
          t`Check an equivalent with $i_{\text{sc}} = V_{\text{Th}}/R_{\text{Th}}$`
        ]
      }
    ]
  };
})(window.EENG);
