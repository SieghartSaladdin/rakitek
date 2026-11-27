"use client";

import { BookclubChoiceWinners } from "./component";

export default function BookclubChoiceWinnersPreview() {
  return (
    <BookclubChoiceWinners
      id="winners"
      title="Members’ Choice Winners"
      description="Every year readers vote on their favourite picks and we celebrate with a special reprinting. These titles have won our hearts and minds over the last few years."
      popupTitle="Want to join the Club?"
      popupCtaLabel="Sign-up now!"
      popupCtaHref="#signup"
      showPopup
      showControls
      prevAriaLabel="Previous Slide"
      nextAriaLabel="Next Slide"
      winners={[
        { id: "2026-upcoming", yearTop: "20", yearBottom: "26", coverAlt: "Next voting round: Fall 2026", nextVotingLabel: "Next voting round: Fall 2026" },
        { id: "2025-winner", yearTop: "20", yearBottom: "25", coverAlt: "The Lantern Keepers (2025 Winner)", authorName: "Maren Vance", href: "#winners" },
        { id: "2024-winner", yearTop: "20", yearBottom: "24", coverAlt: "Salt & Cypress (2024 Winner)", authorName: "Devon Okafor", href: "#winners" },
        { id: "2023-winner", yearTop: "20", yearBottom: "23", coverAlt: "Glass Meridian (2023 Winner)", authorName: "Soren Hale", href: "#winners" },
      ]}
    />
  );
}
