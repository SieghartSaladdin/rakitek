"use client";

import { BookclubSocialButton } from "./component";
import styles from "./styles.module.css";

export default function BookclubSocialButtonPreview() {
  return (
    <div className={styles.previewStage}>
      <BookclubSocialButton
        platform="instagram"
        href="https://instagram.com"
        ariaLabel="Go to Instagram"
        size="base"
      />
      <BookclubSocialButton
        platform="tiktok"
        href="https://tiktok.com"
        ariaLabel="Go to TikTok"
        size="base"
      />
      <BookclubSocialButton
        platform="instagram"
        href="https://instagram.com"
        ariaLabel="Go to Instagram"
        size="big"
        tone="pink"
      />
      <BookclubSocialButton
        platform="tiktok"
        href="https://tiktok.com"
        ariaLabel="Go to TikTok"
        size="big"
        tone="pink"
      />
    </div>
  );
}
