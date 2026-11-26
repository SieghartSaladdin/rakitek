"use client";

import { VoyageEditorialTemplate } from "./component";
import styles from "./styles.module.css";

function SlotStub({ tag, title }: { tag: string; title: string }) {
  return (
    <div className={styles.placeholderBlock}>
      <span className={styles.placeholderTag}>{tag}</span>
      <h2 className={styles.placeholderTitle}>{title}</h2>
    </div>
  );
}

export default function VoyageEditorialTemplatePreview() {
  return (
    <VoyageEditorialTemplate
      header={
        <div className={styles.placeholderBar}>
          <span>Header Slot</span>
          <span>Nav Links / Search / CTA</span>
        </div>
      }
      hero={<SlotStub tag="Hero Slot" title="Full-Viewport Hero + Search Bar" />}
      carousel={<SlotStub tag="Carousel Slot" title="Horizontal Parallax Destinations" />}
      packages={<SlotStub tag="Packages Slot" title="3-4 Column Package Grid" />}
      manifesto={<SlotStub tag="Manifesto Slot" title="Deep Navy Editorial Statement" />}
      stories={<SlotStub tag="Stories Slot" title="Alternating Media & Copy Split" />}
      spotlight={<SlotStub tag="Spotlight Slot" title="Full-Bleed Editorial Feature" />}
      partnerBanner={<SlotStub tag="Partner Banner Slot" title="Two-Row Grid CTA Banner" />}
      prefooter={<SlotStub tag="Prefooter Slot" title="Newsletter Signup Band" />}
      footer={<SlotStub tag="Footer Slot" title="Three-Column Editorial Footer" />}
    />
  );
}
