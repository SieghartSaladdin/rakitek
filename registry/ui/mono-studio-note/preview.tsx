"use client";

import { MonoStudioNote } from "./component";

export default function MonoStudioNotePreview() {
  return (
    <MonoStudioNote
      id="studio-note"
      ariaLabel="Studio overview"
      lines={[
        "The studio is shaped by people who care",
        "deeply about design and the process behind.",
        "Each project becomes a case study and a",
        "meaningful part of our portfolio, developed",
        "with care and attention.",
      ]}
      contactLabel="Contact:"
      linkLabel="hello@kora.agency"
      linkHref="mailto:hello@kora.agency"
      showContact
      visible
      fixed
      startDelayMs={0}
    />
  );
}
