"use client";

import { BookclubFloatingHeader } from "./component";
import styles from "./styles.module.css";

export default function BookclubFloatingHeaderPreview() {
  return (
    <div className={styles.previewStage}>
      <BookclubFloatingHeader
        brandName="FABLE & FOLD"
        brandHref="#top"
        navLinks={[
          { label: "All Books", href: "#books" },
          { label: "Gifting", href: "#gift" },
          { label: "Merch", href: "#exclusive" },
          { label: "FAQ", href: "#faq" },
        ]}
        ctaLabel="Log-in / Sign-up"
        ctaHref="#signup"
        regionLabel="Shopping from the UK?"
        regionHref="#region"
        socialLinks={[
          { platform: "instagram", href: "https://instagram.com", ariaLabel: "Go to Instagram" },
          { platform: "tiktok", href: "https://tiktok.com", ariaLabel: "Go to TikTok" },
        ]}
        tone="yellow"
      />
      <p className={styles.previewNote}>Scroll or resize below 991px to test the floating header &amp; mobile drawer.</p>
    </div>
  );
}
