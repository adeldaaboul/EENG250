// Course data. This is the one file to edit when chapters or materials change:
// list each chapter's PDFs (href) and its quiz, and keep the schedule in "weeks" up to date.
window.EENG = window.EENG || {};

EENG.course = {
  code: "EENG250",
  title: "Electric Circuits I",
  credits: 3,
  hours: 45,
  textbook: "Nilsson &amp; Riedel, <em>Electric Circuits</em>, 11th edition",
  prerequisites: "ENGL051",
  corequisites: "MATH210 (Calculus II), ENGG200 (Introduction to Engineering)",
  description: "An introduction to electrical and electronics engineering: voltage, current, power, resistance, capacitance and inductance; circuit analysis with Kirchhoff&rsquo;s laws, node voltages and mesh currents; Th&eacute;venin and Norton equivalent circuits; op-amp circuits; and the response of first-order RL and RC circuits.",

  preparedBy: "Dr. Adel Daaboul",

  // Public address of the live site, used for search engines and link previews.
  siteUrl: "https://adeldaaboul.github.io/EENG250/",
  seo: {
    title: "EENG250 Electric Circuits I: Free Slides and Practice Problems with Answers",
    description: "Free course materials for Electric Circuits I (Nilsson & Riedel, 11th ed.): lecture slides, chapter introductions and self-check practice problems with answers, from circuit variables and KCL/KVL to node and mesh analysis, Thévenin, op amps and RC/RL circuits."
  },

  // Final exam row at the end of the schedule (tentative). The midterm date is not shown.
  final: { covers: "Chapters 4, 5, 6, 7", date: "exam period 18–30 Jan 2027" },

  clos: [
    { id: "CLO1", text: "Use Ohm&rsquo;s law, Kirchhoff&rsquo;s laws, voltage division and current division in circuit analysis." },
    { id: "CLO2", text: "Use node-voltage and mesh-current methods, source transformation, Th&eacute;venin and Norton equivalent in circuit analysis." },
    { id: "CLO3", text: "Analyze simple ideal op amp circuits." },
    { id: "CLO4", text: "Determine the response of 1st &amp; 2nd order RL &amp; RC circuits." }
  ],
  // Every CLO maps to program learning outcomes 1 and 2.
  plos: "Program learning outcomes 1 (solve complex engineering problems) and 2 (apply engineering design)",

  marking: [
    { item: "Participation", weight: "10%", covers: "All chapters" },
    { item: "Midterm", weight: "40%", covers: "Chapters 1, 2, 3" },
    { item: "Final", weight: "50%", covers: "Chapters 4, 5, 6, 7" }
  ],

  // status: "open" (visible with its materials) or "soon" (listed, materials not online yet)
  // files: href is the PDF path; null shows "Coming soon"
  chapters: [
    {
      n: 1, title: "Circuit Variables", clo: "CLO1", status: "open", sheet: true,
      slug: "chapter-1-circuit-variables",
      seo: {
        "title": "Circuit Variables: Voltage, Current, Power and the Passive Sign Convention",
        "description": "Chapter 1 of Electric Circuits I: SI units and prefixes, charge and current, voltage, power and energy, the passive sign convention and the power balance. Free lecture slides, introduction and practice problems with answers.",
        "sheetTitle": "Passive Sign Convention and Power: Practice Problems with Answers",
        "sheetDescription": "16 self-check practice problems on circuit variables: prefixes, charge from a current graph, negative current and voltage, absorbed and delivered power, energy in kWh and the power balance. Instant feedback and worked explanations."
      },
      when: "Week 1, session 1",
      files: [
        { kind: "Intro", short: "Introduction", label: "Introduction: why Chapter 1 matters", href: "chapters/01/ch01-introduction.pdf" },
        { kind: "Slides", short: "Slides", label: "Lecture slides", href: "chapters/01/ch01-slides.pdf" },
        { kind: "Sheet", short: "Practice sheet", label: "Practice sheet (printable)", href: "chapters/01/ch01-practice-sheet.pdf" }
      ],
      quiz: "Device-free quiz at the start of week 1, session 2 (Thu 8 Oct)"
    },
    {
      n: 2, title: "Circuit Elements", clo: "CLO1", status: "open", sheet: true,
      slug: "chapter-2-circuit-elements",
      seo: {
        "title": "Circuit Elements: Sources, Ohm’s Law, KCL and KVL",
        "description": "Chapter 2 of Electric Circuits I: independent and dependent sources, resistors and Ohm’s law, Kirchhoff’s current and voltage laws, and the power balance. Free lecture slides, introduction and practice problems with answers.",
        "sheetTitle": "Ohm’s Law, KCL, KVL and Dependent Sources: Practice Problems with Answers",
        "sheetDescription": "16 self-check practice problems on circuit elements: source types, Ohm’s law, Kirchhoff’s current and voltage laws, dependent sources and power balance. Instant feedback and worked explanations."
      },
      files: [
        { kind: "Intro", short: "Introduction", label: "Introduction: why Chapter 2 matters", href: "chapters/02/ch02-introduction.pdf" },
        { kind: "Slides", short: "Slides", label: "Lecture slides", href: "chapters/02/ch02-slides.pdf" },
        { kind: "Sheet", short: "Practice sheet", label: "Practice sheet (printable)", href: "chapters/02/ch02-practice-sheet.pdf" }
      ],
      quiz: "Device-free quiz at the start of week 3, session 1 (Tue 20 Oct)"
    },
    {
      n: 3, title: "Simple Resistive Circuits", clo: "CLO1", status: "open", sheet: true,
      slug: "chapter-3-simple-resistive-circuits",
      seo: {
        "title": "Simple Resistive Circuits: Series, Parallel, Voltage and Current Division, Delta–Wye",
        "description": "Chapter 3 of Electric Circuits I: resistors in series and parallel, equivalent resistance, voltage and current division, loading, the Wheatstone bridge and delta-to-wye transformations. Free slides, introduction and practice problems with answers.",
        "sheetTitle": "Series and Parallel Resistors, Voltage and Current Division: Practice Problems with Answers",
        "sheetDescription": "16 self-check practice problems on simple resistive circuits: equivalent resistance, voltage and current dividers, loading, bridges and delta–wye transformations. Instant feedback and worked explanations."
      },
      files: [
        { kind: "Intro", short: "Introduction", label: "Introduction: why Chapter 3 matters", href: "chapters/03/ch03-introduction.pdf" },
        { kind: "Slides", short: "Slides", label: "Lecture slides", href: "chapters/03/ch03-slides.pdf" },
        { kind: "Sheet", short: "Practice sheet", label: "Practice sheet (printable)", href: "chapters/03/ch03-practice-sheet.pdf" }
      ],
      quiz: "Device-free quiz at the start of week 5, session 1 (Tue 3 Nov)"
    },
    {
      n: 4, title: "Techniques of Circuit Analysis", clo: "CLO2", status: "open", sheet: true,
      slug: "chapter-4-techniques-of-circuit-analysis",
      seo: {
        "title": "Techniques of Circuit Analysis: Node Voltages, Mesh Currents, Thévenin and Norton",
        "description": "Chapter 4 of Electric Circuits I, in two parts: the node-voltage and mesh-current methods with supernodes and supermeshes; source transformations, superposition, Thévenin and Norton equivalents and maximum power transfer. Free slides and practice problems with answers.",
        "parts": [
          {
            "sheetTitle": "Node-Voltage and Mesh-Current Methods: Practice Problems with Answers",
            "sheetDescription": "16 self-check practice problems on the node-voltage and mesh-current methods, dependent sources, supernodes and supermeshes, and choosing a method. Instant feedback and worked explanations."
          },
          {
            "sheetTitle": "Thévenin, Norton, Superposition and Maximum Power Transfer: Practice Problems with Answers",
            "sheetDescription": "16 self-check practice problems on source transformations, superposition, Thévenin and Norton equivalents (including dependent sources) and maximum power transfer. Instant feedback and worked explanations."
          }
        ]
      },
      parts: ["Part 1: Node Voltages and Mesh Currents", "Part 2: Th&eacute;venin Equivalents, Superposition and Maximum Power"],
      files: [
        { part: 1, kind: "Intro", short: "Part 1 introduction", label: "Introduction to Part 1", href: "chapters/04/ch04-part1-introduction.pdf" },
        { part: 1, kind: "Slides", short: "Part 1 slides", label: "Lecture slides, Part 1", href: "chapters/04/ch04-part1-slides.pdf" },
        { part: 1, kind: "Sheet", short: "Part 1 practice sheet", label: "Practice sheet, Part 1 (printable)", href: "chapters/04/ch04-part1-practice-sheet.pdf" },
        { part: 2, kind: "Intro", short: "Part 2 introduction", label: "Introduction to Part 2", href: "chapters/04/ch04-part2-introduction.pdf" },
        { part: 2, kind: "Slides", short: "Part 2 slides", label: "Lecture slides, Part 2", href: "chapters/04/ch04-part2-slides.pdf" },
        { part: 2, kind: "Sheet", short: "Part 2 practice sheet", label: "Practice sheet, Part 2 (printable)", href: "chapters/04/ch04-part2-practice-sheet.pdf" }
      ],
      quiz: "Part 1: device-free quiz at the start of week 7, session 1 (Tue 17 Nov). Part 2: at the start of week 10, session 1 (Thu 10 Dec)"
    },
    {
      n: 5, title: "The Operational Amplifier", clo: "CLO3", status: "open", sheet: true,
      slug: "chapter-5-operational-amplifier",
      seo: {
        "title": "The Operational Amplifier: Ideal Op Amp, Inverting, Non-Inverting, Summing and Difference Amplifiers",
        "description": "Chapter 5 of Electric Circuits I: the ideal op amp rules, saturation, and inverting, summing, non-inverting and difference amplifier circuits. Free lecture slides, introduction and practice problems with answers.",
        "sheetTitle": "Ideal Op Amp Circuits: Practice Problems with Answers",
        "sheetDescription": "16 self-check practice problems on ideal op amp circuits: inverting, non-inverting, summing and difference amplifiers, saturation and cascades. Instant feedback and worked explanations."
      },
      files: [
        { kind: "Intro", short: "Introduction", label: "Introduction: why Chapter 5 matters", href: "chapters/05/ch05-introduction.pdf" },
        { kind: "Slides", short: "Slides", label: "Lecture slides", href: "chapters/05/ch05-slides.pdf" },
        { kind: "Sheet", short: "Practice sheet", label: "Practice sheet (printable)", href: "chapters/05/ch05-practice-sheet.pdf" }
      ],
      quiz: "Device-free quiz at the start of week 11, session 1 (Thu 17 Dec)"
    },
    {
      n: 6, title: "Inductors and Capacitors", clo: "CLO4", status: "open", sheet: true,
      slug: "chapter-6-inductors-and-capacitors",
      seo: {
        "title": "Inductors and Capacitors: Voltage–Current Relations, Energy, Series and Parallel",
        "description": "Chapter 6 of Electric Circuits I: inductor and capacitor voltage–current relations, power and stored energy, continuity of inductor current and capacitor voltage, and series and parallel combinations. Free slides, introduction and practice problems with answers.",
        "sheetTitle": "Inductors and Capacitors: Practice Problems with Answers",
        "sheetDescription": "16 self-check practice problems on inductors and capacitors: v = L di/dt and i = C dv/dt, stored energy, initial conditions and series–parallel combinations. Instant feedback and worked explanations."
      },
      files: [
        { kind: "Intro", short: "Introduction", label: "Introduction: why Chapter 6 matters", href: "chapters/06/ch06-introduction.pdf" },
        { kind: "Slides", short: "Slides", label: "Lecture slides", href: "chapters/06/ch06-slides.pdf" },
        { kind: "Sheet", short: "Practice sheet", label: "Practice sheet (printable)", href: "chapters/06/ch06-practice-sheet.pdf" }
      ],
      quiz: "Device-free quiz at the start of week 12, session 1 (Tue 5 Jan)"
    },
    {
      n: 7, title: "Natural and Step Responses of RL and RC Circuits", clo: "CLO4", status: "open", sheet: true,
      slug: "chapter-7-rl-rc-natural-and-step-responses",
      seo: {
        "title": "Natural and Step Responses of RL and RC Circuits: Time Constant and First-Order Transients",
        "description": "Chapter 7 of Electric Circuits I: natural and step responses of first-order RL and RC circuits, the time constant, initial and final values, and the general solution method. Free slides, introduction and practice problems with answers.",
        "sheetTitle": "RC and RL Circuits, Time Constant and Step Response: Practice Problems with Answers",
        "sheetDescription": "16 self-check practice problems on first-order RL and RC circuits: natural and step responses, time constants, switching at t = 0 and the general solution. Instant feedback and worked explanations."
      },
      files: [
        { kind: "Intro", short: "Introduction", label: "Introduction: why Chapter 7 matters", href: "chapters/07/ch07-introduction.pdf" },
        { kind: "Slides", short: "Slides", label: "Lecture slides", href: "chapters/07/ch07-slides.pdf" },
        { kind: "Sheet", short: "Practice sheet", label: "Practice sheet (printable)", href: "chapters/07/ch07-practice-sheet.pdf" }
      ],
      quiz: "Device-free quiz at the start of the last class, week 13, session 2 (Thu 14 Jan)"
    }
  ],

  // Topics page: the subjects students search for, each linked to its chapter (and part) and practice sheet.
  topics: [
    { ch: 1, name: "SI units and engineering prefixes" },
    { ch: 1, name: "Charge and current, i = dq/dt" },
    { ch: 1, name: "Voltage, power and energy" },
    { ch: 1, name: "Passive sign convention" },
    { ch: 1, name: "Absorbed and delivered power, power balance" },
    { ch: 2, name: "Independent and dependent sources" },
    { ch: 2, name: "Ohm’s law" },
    { ch: 2, name: "Kirchhoff’s current law (KCL)" },
    { ch: 2, name: "Kirchhoff’s voltage law (KVL)" },
    { ch: 2, name: "Circuits with dependent sources" },
    { ch: 3, name: "Resistors in series and in parallel" },
    { ch: 3, name: "Voltage division" },
    { ch: 3, name: "Current division" },
    { ch: 3, name: "Loading a voltage divider" },
    { ch: 3, name: "Wheatstone bridge" },
    { ch: 3, name: "Delta-to-wye (Δ–Y) transformation" },
    { ch: 4, part: 1, name: "Node-voltage method" },
    { ch: 4, part: 1, name: "Supernode" },
    { ch: 4, part: 1, name: "Mesh-current method" },
    { ch: 4, part: 1, name: "Supermesh" },
    { ch: 4, part: 2, name: "Source transformation" },
    { ch: 4, part: 2, name: "Superposition" },
    { ch: 4, part: 2, name: "Thévenin equivalent circuit" },
    { ch: 4, part: 2, name: "Norton equivalent circuit" },
    { ch: 4, part: 2, name: "Test-source method with dependent sources" },
    { ch: 4, part: 2, name: "Maximum power transfer" },
    { ch: 5, name: "Ideal op amp rules" },
    { ch: 5, name: "Op amp saturation" },
    { ch: 5, name: "Inverting amplifier" },
    { ch: 5, name: "Summing amplifier" },
    { ch: 5, name: "Non-inverting amplifier" },
    { ch: 5, name: "Difference amplifier" },
    { ch: 6, name: "Inductor: v = L di/dt" },
    { ch: 6, name: "Capacitor: i = C dv/dt" },
    { ch: 6, name: "Energy stored in inductors and capacitors" },
    { ch: 6, name: "Series and parallel inductors" },
    { ch: 6, name: "Series and parallel capacitors" },
    { ch: 7, name: "Natural response of RL and RC circuits" },
    { ch: 7, name: "Step response of RL and RC circuits" },
    { ch: 7, name: "Time constant" },
    { ch: 7, name: "General solution for first-order circuits" }
  ],

  // Schedule for this section: the syllabus topics over the 13 teaching weeks of Fall 2026. Each week lists the chapters taught in it.
  // sessions: the class dates that week, typed from the university calendar, e.g. ["Tue 6 Oct", "Thu 8 Oct"].
  // Every two class days count as one week. 26 classes = 13 weeks: all Tue/Thu from 6 Oct to 14 Jan except
  // the red holidays (24, 29, 31 Dec) and Thu 19 Nov (midterm week, assumed no class for now).
  // When two chapters share a week, each chapter item can carry its own sessions (its class day).
  // events: short notes shown in the Events column (quizzes).
  weeks: [
    { w: 1, sessions: ["Tue 6 Oct", "Thu 8 Oct"], items: [
      { ch: 1, sessions: ["Tue 6 Oct"], topics: "International System of Units. Voltage and current. Power and energy. Problems." },
      { ch: 2, sessions: ["Thu 8 Oct"], topics: "Voltage and current sources. Electrical resistance (Ohm&rsquo;s law)." }
    ], events: [{ type: "quiz", text: "Chapter 1 quiz, Thu 8 Oct" }] },
    { w: 2, sessions: ["Tue 13 Oct", "Thu 15 Oct"], items: [{ ch: 2, topics: "Kirchhoff&rsquo;s laws: KVL and KCL. Analysis of a circuit containing dependent sources. Problems." }] },
    { w: 3, sessions: ["Tue 20 Oct", "Thu 22 Oct"], items: [{ ch: 3, topics: "Resistors in series and in parallel. Voltage and current division." }], events: [{ type: "quiz", text: "Chapter 2 quiz, Tue 20 Oct" }] },
    { w: 4, sessions: ["Tue 27 Oct", "Thu 29 Oct"], items: [{ ch: 3, topics: "Delta-to-wye equivalent circuits. Problems." }] },
    { w: 5, sessions: ["Tue 3 Nov", "Thu 5 Nov"], items: [{ ch: 4, part: 1, topics: "Node-voltage method: procedure; dependent sources and the constraint equation; special cases, the supernode. Problems." }], events: [{ type: "quiz", text: "Chapter 3 quiz, Tue 3 Nov" }] },
    { w: 6, sessions: ["Tue 10 Nov", "Thu 12 Nov"], items: [{ ch: 4, part: 1, topics: "Mesh-current method: introduction, dependent sources, special cases, the supermesh. Choosing a method. Problems." }] },
    { w: 7, sessions: ["Tue 17 Nov", "Tue 24 Nov"], items: [{ ch: 4, part: 2, topics: "Source transformations. Superposition. Problems." }], events: [{ type: "quiz", text: "Chapter 4 Part 1 quiz, Tue 17 Nov" }] },
    { w: 8, sessions: ["Thu 26 Nov", "Tue 1 Dec"], items: [{ ch: 4, part: 2, topics: "Th&eacute;venin and Norton equivalents (V<sub>th</sub>, I<sub>sc</sub>, and the V<sub>test</sub>/I<sub>test</sub> method), including dependent sources. Problems." }] },
    { w: 9, sessions: ["Thu 3 Dec", "Tue 8 Dec"], items: [
      { ch: 4, part: 2, sessions: ["Thu 3 Dec"], topics: "Maximum power transfer. Problems." },
      { ch: 5, sessions: ["Tue 8 Dec"], topics: "Operational amplifier terminals. Terminal voltages and currents." }
    ] },
    { w: 10, sessions: ["Thu 10 Dec", "Tue 15 Dec"], items: [{ ch: 5, topics: "Inverting, summing, non-inverting and difference amplifiers. Problems." }], events: [{ type: "quiz", text: "Chapter 4 Part 2 quiz, Thu 10 Dec" }] },
    { w: 11, sessions: ["Thu 17 Dec", "Tue 22 Dec"], items: [{ ch: 6, topics: "Inductor, capacitor, energy and power. Series and parallel combinations of inductance and capacitance. Problems." }], events: [{ type: "quiz", text: "Chapter 5 quiz, Thu 17 Dec" }] },
    { w: 12, sessions: ["Tue 5 Jan", "Thu 7 Jan"], items: [{ ch: 7, topics: "Natural responses of RL/RC circuits. Step responses of RL/RC circuits." }], events: [{ type: "quiz", text: "Chapter 6 quiz, Tue 5 Jan" }] },
    { w: 13, sessions: ["Tue 12 Jan", "Thu 14 Jan"], items: [{ ch: 7, topics: "General solution for step and natural responses. Problems." }], events: [{ type: "quiz", text: "Chapter 7 quiz, Thu 14 Jan" }] }
  ]
};
