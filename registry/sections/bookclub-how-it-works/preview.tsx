"use client";

import { BookclubHowItWorks } from "./component";

export default function BookclubHowItWorksPreview() {
  return (
    <BookclubHowItWorks
      id="how-it-works"
      title="How it works"
      handwrittenNote="Consider us your professional book curator"
      showHandwrittenNote
      ctaLabel="Become a member"
      ctaHref="#signup"
      ctaExternal={false}
      showCta
      steps={[
        {
          stepLabel: "Step #1",
          titleLines: ["Explore our books"],
          description: "The first of every month we reveal 6-7 new books. Follow us on socials to keep an eye on any hints we may post.",
          variant: "cyan",
        },
        {
          stepLabel: "Step #2",
          titleLines: ["Build your ", "box"],
          description: "Members can order up to 3 books per box. At least one title must be from the current month's selections.",
          variant: "bright-pink",
        },
        {
          stepLabel: "Step #3",
          titleLines: ["Check your doorstep"],
          description: "Your box is delivered right to your doorstep. This is the best excuse to cancel your Friday night plans.",
          variant: "yellow",
        },
        {
          stepLabel: "Step #4",
          titleLines: ["Share your reads"],
          description: "Share your box and tag us @fableandfold or participate in the Club discussions in-app!",
          variant: "periwinkle",
        },
      ]}
    />
  );
}
