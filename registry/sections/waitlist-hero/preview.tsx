"use client";

import { WaitlistHero } from "./component";

export default function WaitlistHeroPreview() {
  return (
    <WaitlistHero
      marqueeText="First 500 get free lifetime"
      mobileOfferText="First 500 get free lifetime."
      memberCount={112}
      memberCountLabel="people on the list"
      headline={"Sign up to\nwaitlist"}
      emailPlaceholder="Your Email"
      consentLabel="Allow occasional messages when we need feedback on upcoming features"
      ratingTitle="What do you think of the idea?"
      ratingSubtitle="We want to know if it makes sense"
      submitLabel="Sign Up"
    />
  );
}
