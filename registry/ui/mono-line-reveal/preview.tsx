"use client";

import { LineReveal, RevealWords } from "./component";

const PARAGRAPHS = [
  "Kora is a concept-driven design studio founded by Sana Linderholm and Alexander Montgomery in 2018 and based in the EU (AMS, WAW, BER).",
  "Rooted in modernist design principles and graphic design tradition, our work combines typography, grid systems and motion to create digital experiences that balance clarity, usability and bold visual expression.",
  "Our team remains intentionally small, under 10 people, which allows creative direction to stay personal and decisions to stay sharp. Every project is led closely",
  "by the founders. No layers. No dilution.",
];

export default function MonoLineRevealPreview() {
  return (
    <div
      style={{
        width: "calc(var(--rk-col) * 7.525 + var(--rk-gutter) * 6)",
        fontSize: "calc(var(--rk-u) * 4)",
        lineHeight: 1.18,
        letterSpacing: "-0.03em",
      }}
    >
      <LineReveal as="div" id="line-reveal-demo" startStep={0} lineGapMs={50}>
        {PARAGRAPHS.map((text) => (
          <p key={text} style={{ margin: 0 }}>
            <RevealWords text={text} />
          </p>
        ))}
      </LineReveal>
    </div>
  );
}
