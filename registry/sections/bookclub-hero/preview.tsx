"use client";

import { BookclubHero } from "./component";

export default function BookclubHeroPreview() {
  return (
    <BookclubHero
      id="top"
      headline="Unbox stories worth talking about"
      description="Join the book club that's anything but traditional. Choose up to 3 new reads every month, delivered to your door. Then dive into the stories, and the conversations."
      ctaLabel="Log-in / Sign-up now"
      ctaHref="#signup"
      ctaExternal={false}
      showCta
      handwrittenNote="Shipping to the USA & Canada"
      showHandwrittenNote
      popupTitle="Want to join the Club?"
      popupCtaLabel="Sign-up now!"
      popupCtaHref="#signup"
      showPopup
      visualAlt="Monthly Book Club Box"
    />
  );
}
