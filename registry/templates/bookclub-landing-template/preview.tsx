"use client";

import { BookclubLandingTemplate } from "./component";
import styles from "./styles.module.css";

export default function BookclubLandingTemplatePreview() {
  return (
    <BookclubLandingTemplate
      mainId="main-content"
      header={
        <div className={styles.previewShellHeader}>
          <span>Fixed Floating Header Slot</span>
          <span>12-Column Fluid Scale (--rk-bc-size-font)</span>
        </div>
      }
      hero={<div className={[styles.previewSlotBand, styles.previewYellow].join(" ")}>Hero Slot (87.5em rounded bottom)</div>}
      books={<div className={[styles.previewSlotBand, styles.previewPink].join(" ")}>Books Carousel Slot</div>}
      howItWorks={<div className={[styles.previewSlotBand, styles.previewBlue].join(" ")}>How It Works & Sticky Sequence Slots</div>}
      footer={<div className={styles.previewFooter}>Overlapping Wave Footer Slot (-10em overlap)</div>}
    />
  );
}
