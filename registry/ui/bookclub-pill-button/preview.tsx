"use client";

import { BookclubPillButton } from "./component";
import styles from "./styles.module.css";

export default function BookclubPillButtonPreview() {
  return (
    <div className={styles.previewStage}>
      <div className={styles.previewRow}>
        <BookclubPillButton label="All Books" href="#books" active />
        <BookclubPillButton label="Gifting" href="#gift" />
        <BookclubPillButton label="Merch" href="#exclusive" />
        <BookclubPillButton label="FAQ" href="#faq" />
        <BookclubPillButton label="Shopping from the UK?" href="#uk" showEars={false} />
      </div>
      <div className={styles.previewRow}>
        <BookclubPillButton label="Menu Pill" href="#menu" size="menu" tone="soft-pink" showEars={false} />
        <BookclubPillButton label="Soft Blue Pill" href="#blue" tone="soft-blue" showEars={false} />
      </div>
    </div>
  );
}
