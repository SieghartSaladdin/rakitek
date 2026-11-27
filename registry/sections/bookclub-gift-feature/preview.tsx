"use client";

import { BookclubGiftFeature } from "./component";

export default function BookclubGiftFeaturePreview() {
  return (
    <BookclubGiftFeature
      id="gift"
      curvedHeadline="A gift outside of the box"
      description="Gift a subscription and they can pick their own books. No spying on shelves needed. Order today and instantly receive an e-gift card to print out or forward. If you're lucky, they might let you borrow a copy."
      ctaLabel="Shop gifts!"
      ctaHref="#gift"
      ctaExternal={false}
      showCta
      pressHeading="Mentioned by"
      pressItems={[
        { name: "Publishers Weekly", shortLabel: "PW" },
        { name: "Literary Digest", shortLabel: "LD" },
        { name: "Book Riot", shortLabel: "BR" },
        { name: "Travel + Leisure", shortLabel: "T+L" },
      ]}
      showPress
      visualAlt="Gift Book Club Box"
    />
  );
}
