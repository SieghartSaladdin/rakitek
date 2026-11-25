"use client";

import { WaitlistInput } from "./component";

export default function WaitlistInputPreview() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "640px",
        margin: "0 auto",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      <WaitlistInput
        placeholder="Your Email"
        optInLabel="Allow the team to contact me if they need feedback on early updates"
        showRating
        ratingTitle="What do you think of the idea?"
        ratingSubtitle="We want to know if it makes sense"
        submitLabel="Sign Up"
      />
    </div>
  );
}
