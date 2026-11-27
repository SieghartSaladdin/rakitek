"use client";

import { MonoUnderlineLink } from "./component";

export default function MonoUnderlineLinkPreview() {
  return (
    <div
      style={{
        fontSize: "calc(var(--rk-u) * 1.1)",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
      }}
    >
      <MonoUnderlineLink
        id="draw-underline-demo"
        href="mailto:hello@kora.agency"
        label="hello@kora.agency"
        className=""
        target="_blank"
        rel="noopener noreferrer"
        ariaLabel="Email the studio"
        onClick={undefined}
      />
    </div>
  );
}
