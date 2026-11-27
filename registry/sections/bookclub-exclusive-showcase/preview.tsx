"use client";

import { BookclubExclusiveShowcase } from "./component";

export default function BookclubExclusiveShowcasePreview() {
  return (
    <BookclubExclusiveShowcase
      id="exclusive"
      title="Club Exclusive"
      subtitle="Horror anthology by club authors. No, you can't get it anywhere else."
      bookTitle="One Bad Night & Other Stories"
      bookDescription="Our club launched in October 2022, and we're celebrating our three-year anniversary with this original horror anthology featuring 8 past featured authors."
      coverAlt="One Bad Night & Other Stories"
      ratingLabel="Reader Rating"
      ratingValue="4.0"
      ctaLabel="Add to box!"
      ctaHref="#exclusive"
      ctaExternal={false}
      tags={[
        { label: "Club Original", bgColor: "#8ef1fd", textColor: "black" },
        { label: "Horror", bgColor: "#000000", textColor: "white" },
      ]}
      authorsHeading="Authors"
      authors={["Kay Chronister", "Del Sandeen", "Kylie Lee Baker", "Rachel Harrison", "CJ Leede", "Jennifer Thorne", "S.A. Barnes", "Stephen Graham Jones"]}
      quote1='"An absolutely phenomenal anthology of short stories from some of the best voices in horror right now!" - Trisha'
      quote2='"Not a bad story in the bunch. "One Bad Night" wrecked me." - Brittany'
      showControls={false}
    />
  );
}
