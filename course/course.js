// Course data. This is the one file to edit each week:
// set a chapter's status to "open" and fill in the href of each PDF you upload.
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

  // status: "open" (visible with its materials) or "soon" (listed, not yet released)
  // files: href is the PDF path; null shows "Coming soon"
  chapters: [
    {
      n: 1, title: "Circuit Variables", clo: "CLO1", status: "open", sheet: true,
      when: "Week 1, session 1",
      files: [
        { kind: "Intro", short: "Introduction", label: "Introduction: why Chapter 1 matters", href: "chapters/01/ch01-introduction.pdf" },
        { kind: "Slides", short: "Slides", label: "Lecture slides", href: "chapters/01/ch01-slides.pdf" },
        { kind: "Sheet", short: "Practice sheet", label: "Practice sheet (printable)", href: "chapters/01/ch01-practice-sheet.pdf" }
      ],
      quiz: "Device-free quiz at the start of week 1, session 2 (Thu 8 Oct)"
    },
    { n: 2, title: "Circuit Elements", clo: "CLO1", status: "soon" },
    { n: 3, title: "Simple Resistive Circuits", clo: "CLO1", status: "soon" },
    { n: 4, title: "Techniques of Circuit Analysis", clo: "CLO2", status: "soon" },
    { n: 5, title: "The Operational Amplifier", clo: "CLO3", status: "soon" },
    { n: 6, title: "Inductance, Capacitance, and Mutual Inductance", clo: "CLO4", status: "soon" },
    { n: 7, title: "Response of First-Order RL and RC Circuits", clo: "CLO4", status: "soon" }
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
    { w: 3, sessions: ["Tue 20 Oct", "Thu 22 Oct"], items: [{ ch: 3, topics: "Resistors in series and in parallel. Voltage and current division." }] },
    { w: 4, sessions: ["Tue 27 Oct", "Thu 29 Oct"], items: [{ ch: 3, topics: "Delta-to-wye equivalent circuits. Problems." }] },
    { w: 5, sessions: ["Tue 3 Nov", "Thu 5 Nov"], items: [{ ch: 4, topics: "Node-voltage method: procedure; dependent sources and the constraint equation; special cases, the supernode. Problems." }] },
    { w: 6, sessions: ["Tue 10 Nov", "Thu 12 Nov"], items: [{ ch: 4, topics: "Mesh-current method: introduction, dependent sources, special cases, the supermesh. Problems. Superposition (overview)." }] },
    { w: 7, sessions: ["Tue 17 Nov", "Tue 24 Nov"], items: [{ ch: 4, topics: "Source transformations. Problems. Th&eacute;venin equivalent circuit." }] },
    { w: 8, sessions: ["Thu 26 Nov", "Tue 1 Dec"], items: [{ ch: 4, topics: "Th&eacute;venin and Norton equivalents (V<sub>th</sub>, I<sub>sc</sub>, and the V<sub>test</sub>/I<sub>test</sub> method). Problems." }] },
    { w: 9, sessions: ["Thu 3 Dec", "Tue 8 Dec"], items: [
      { ch: 4, sessions: ["Thu 3 Dec"], topics: "Maximum power transfer. Problems." },
      { ch: 5, sessions: ["Tue 8 Dec"], topics: "Operational amplifier terminals. Terminal voltages and currents." }
    ] },
    { w: 10, sessions: ["Thu 10 Dec", "Tue 15 Dec"], items: [{ ch: 5, topics: "Inverting, summing, non-inverting and difference amplifiers. Problems." }] },
    { w: 11, sessions: ["Thu 17 Dec", "Tue 22 Dec"], items: [{ ch: 6, topics: "Inductor, capacitor, energy and power. Series and parallel combinations of inductance and capacitance. Problems." }] },
    { w: 12, sessions: ["Tue 5 Jan", "Thu 7 Jan"], items: [{ ch: 7, topics: "Natural responses of RL/RC circuits. Step responses of RL/RC circuits." }] },
    { w: 13, sessions: ["Tue 12 Jan", "Thu 14 Jan"], items: [{ ch: 7, topics: "General solution for step and natural responses. Problems." }] }
  ]
};
