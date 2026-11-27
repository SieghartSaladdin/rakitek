"use client";

import { FixedBackdropRevealTemplate } from "./component";
import styles from "./styles.module.css";

function SlotStub({ tag, title }: { tag: string; title: string }) {
  return (
    <div className={styles.placeholderBlock}>
      <span className={styles.placeholderTag}>{tag}</span>
      <h2 className={styles.placeholderTitle}>{title}</h2>
    </div>
  );
}

export default function FixedBackdropRevealTemplatePreview() {
  return (
    <FixedBackdropRevealTemplate
      backdrop={<div className={styles.placeholderBackdrop} />}
      header={
        <div className={styles.placeholderBar}>
          <span>Header slot</span>
          <span>Fixed above everything</span>
        </div>
      }
      footer={<SlotStub tag="Footer slot" title="Closing footer" />}
      revealHeight="100vh"
      mainId="main-content"
      skipLinkLabel="Skip to main content"
    >
      <SlotStub tag="Main slot" title="Sections slide over the backdrop" />
      <SlotStub tag="Main slot" title="Any number of sections" />
    </FixedBackdropRevealTemplate>
  );
}
