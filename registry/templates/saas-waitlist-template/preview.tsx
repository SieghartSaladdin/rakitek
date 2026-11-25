"use client";

import { SaasWaitlistTemplate } from "./component";
import styles from "./styles.module.css";

function BandPlaceholder({
  tag,
  title,
  note,
  hero = false,
}: {
  tag: string;
  title: string;
  note: string;
  hero?: boolean;
}) {
  return (
    <section className={`${styles.placeholderBand} ${hero ? styles.placeholderBandHero : ""}`}>
      <span className={styles.placeholderTag}>{tag}</span>
      <div>
        <h2 className={styles.placeholderTitle}>{title}</h2>
        <p className={styles.placeholderNote}>{note}</p>
      </div>
    </section>
  );
}

export default function SaasWaitlistTemplatePreview() {
  return (
    <SaasWaitlistTemplate
      navbar={
        <div className={styles.placeholderNav} data-template-nav="placeholder">
          <span>Brand</span>
          <span>Floating Pill Navbar Slot</span>
          <span>Contact</span>
        </div>
      }
      hero={
        <BandPlaceholder
          tag="Slot 01 · Hero · Full Viewport"
          title="Waitlist Hero & Offer"
          note="Marquee strip, counter headline, interactive star rating, and waitlist email signup."
          hero
        />
      }
      spotlight={
        <BandPlaceholder
          tag="Slot 02 · Spotlight Stat Band"
          title="Pointer Spotlight Metric"
          note="Animated count-up figure with radial pointer spotlight and editorial dual columns."
        />
      }
      footer={
        <BandPlaceholder
          tag="Slot 03 · Minimal SaaS Footer"
          title="Closing Brand Footer"
          note="Clean closing brand signature, tagline, and legal or contact links."
        />
      }
    />
  );
}
