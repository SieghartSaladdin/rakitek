"use client";

import { BookclubAppBadges } from "./component";
import styles from "./styles.module.css";

export default function BookclubAppBadgesPreview() {
  return (
    <div className={styles.previewStage}>
      <BookclubAppBadges
        variant="base"
        appStoreHref="#app-store"
        googlePlayHref="#google-play"
        appStoreAriaLabel="Download on the App Store"
        googlePlayAriaLabel="Get it on Google Play"
        appStoreSubtitle="Download on the"
        appStoreTitle="App Store"
        googlePlaySubtitle="GET IT ON"
        googlePlayTitle="Google Play"
      />
      <BookclubAppBadges
        variant="outline"
        appStoreHref="#app-store"
        googlePlayHref="#google-play"
        appStoreAriaLabel="Download on the App Store"
        googlePlayAriaLabel="Get it on Google Play"
        appStoreSubtitle="Download on the"
        appStoreTitle="App Store"
        googlePlaySubtitle="GET IT ON"
        googlePlayTitle="Google Play"
      />
    </div>
  );
}
