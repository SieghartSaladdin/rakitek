"use client";

import { BookclubBouncyCta } from "./component";
import styles from "./styles.module.css";

export default function BookclubBouncyCtaPreview() {
  return (
    <div className={styles.previewStage}>
      <div className={styles.previewRow}>
        <BookclubBouncyCta
          label="Log-in / Sign-up now"
          href="#join"
          variant="base"
          tone="magenta"
          icon="arrow"
        />
        <BookclubBouncyCta
          label="Become a member"
          href="https://fableandfold.example/join"
          external
          variant="base"
          tone="magenta"
          icon="arrow"
        />
        <BookclubBouncyCta
          label="Log-in / Sign-up"
          href="#signup"
          variant="base"
          tone="orange"
          icon="arrow"
        />
      </div>
      <div className={styles.previewRow}>
        <BookclubBouncyCta
          label="Sign-up now!"
          href="#signup"
          variant="small"
          tone="magenta"
          icon="arrow"
        />
        <BookclubBouncyCta
          label="Subscribe"
          asButton
          type="button"
          variant="base"
          tone="white"
          icon="arrow"
        />
        <BookclubBouncyCta
          label="Menu"
          asButton
          menuToggle
          tone="orange"
          icon="hamburger"
        />
      </div>
    </div>
  );
}
