"use client";

import { SwissGridShell } from "./component";
import styles from "./styles.module.css";

function Stub({ label }: { label: string }) {
  return <div className={styles.placeholder}>{label}</div>;
}

export default function SwissGridShellPreview() {
  return (
    <SwissGridShell
      header={<Stub label="Header slot (fixed, blend difference)" />}
      note={<span>Note slot, fixed to the right columns</span>}
      footer={<Stub label="Footer slot" />}
      skipLinkLabel="Skip to main content"
      mainId="main"
    >
      <Stub label="Manifesto section" />
      <Stub label="Gallery section" />
      <Stub label="Credits section" />
    </SwissGridShell>
  );
}
