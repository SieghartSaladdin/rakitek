"use client";

import { MonoClockHeader } from "./component";

const WORDMARK = [
  "M24 12a22 22 0 1 0 0.01 0Z",
  "M64 12h44v44H64Z",
  "M120 56l23-44 23 44Z",
  "M180 56a22 22 0 0 1 44 0Z",
  "M232 12h18v44h-18Z",
];

export default function MonoClockHeaderPreview() {
  return (
    <MonoClockHeader
      id="site-header"
      links={[
        { href: "#work", label: "Work" },
        { href: "#about", label: "About", active: true },
      ]}
      wordmarkPaths={WORDMARK}
      wordmarkViewBox="0 0 251 68"
      homeHref="#top"
      homeLabel="Kora home"
      menuLabel="Main navigation"
      compact
      showClock
      showContact
      contactLabel="Contact"
      copiedLabel="Copied"
      email="hello@kora.studio"
      startDelayMs={400}
    />
  );
}
