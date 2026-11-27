"use client";

import { BookclubBoxSequence } from "./component";

export default function BookclubBoxSequencePreview() {
  return (
    <BookclubBoxSequence
      id="box-sequence"
      headline="UNBOX YOUR NEXT READ"
      headerImageAlt="Book Club Box"
      callOutNote="Each box includes a bookmark per book and postcard with a challenge to win a free credit!"
      finalTagline="Made for readers by readers"
      popupTitle="Want to join the Club?"
      popupCtaLabel="Sign-up now!"
      popupCtaHref="#signup"
      showPopup
      appStoreHref="#app-store"
      googlePlayHref="#google-play"
      showAppBadges
      short={false}
    />
  );
}
