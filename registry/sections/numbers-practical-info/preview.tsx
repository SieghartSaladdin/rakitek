"use client";

import { NumbersPracticalInfo } from "./component";

export default function NumbersPracticalInfoPreview() {
  return (
    <NumbersPracticalInfo
      id="numbers"
      numbersLabel="Festival in numbers"
      numbers={[
        { value: "40+", label: "Talks" },
        { value: "20+", label: "Artworks" },
        { value: "3", label: "Parties" },
        { value: "230+", label: "Speakers" },
        { value: "4", label: "Days" },
        { value: "15", label: "Editions" },
      ]}
      infoLabel="Practical info"
      info={[
        { title: "Dates", text: "21 - 24 October 2026", icon: "calendar" },
        { title: "Location", text: "Harbour City, Northland, Europe", icon: "pin" },
        {
          title: "Getting there",
          text: "1h from the capital by train",
          icon: "train",
          actionLabel: "More info",
          actionHref: "#access",
        },
      ]}
    />
  );
}
