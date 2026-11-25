"use client";

import { InteractiveQuiz, type QuizQuestion, type QuizResultItem } from "./component";

const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which tasting profile fits you…",
    options: [
      { id: "q1-bright", label: "Bright, floral & botanical", matchKey: "bright" },
      { id: "q1-warm", label: "Velvety, sweet & balanced", matchKey: "warm" },
      { id: "q1-bold", label: "Bold, roasted & structured", matchKey: "bold" },
      { id: "q1-rare", label: "Rare, seasonal & surprising", matchKey: "reserve" },
    ],
  },
  {
    id: "q2",
    prompt: "How do you usually prepare it?",
    options: [
      { id: "q2-filter", label: "Pour-over / Filter carafe", matchKey: "bright" },
      { id: "q2-espresso", label: "Home espresso machine", matchKey: "warm" },
      { id: "q2-press", label: "French press / Automatic", matchKey: "bold" },
      { id: "q2-micro", label: "Dialing in small batches", matchKey: "reserve" },
    ],
  },
  {
    id: "q3",
    prompt: "How do you enjoy the finish?",
    options: [
      { id: "q3-clean", label: "Always clean & neat", matchKey: "bright" },
      { id: "q3-splash", label: "With a light splash of milk", matchKey: "warm" },
      { id: "q3-creamy", label: "Steamed milk & textured foam", matchKey: "bold" },
      { id: "q3-pure", label: "Pure, highlighting every note", matchKey: "reserve" },
    ],
  },
  {
    id: "q4",
    prompt: "Which tasting notes appeal most?",
    options: [
      { id: "q4-citrus", label: "Bergamot, stone fruit & jasmine", matchKey: "bright" },
      { id: "q4-caramel", label: "Milk chocolate, caramel & hazelnut", matchKey: "warm" },
      { id: "q4-cocoa", label: "Dark cocoa, toasted almond & spice", matchKey: "bold" },
      { id: "q4-tropical", label: "Honeyed tropical fruit & florals", matchKey: "reserve" },
    ],
  },
  {
    id: "q5",
    prompt: "How adventurous is your routine?",
    options: [
      { id: "q5-curious", label: "Curious: fresh seasonal harvests", matchKey: "bright" },
      { id: "q5-steady", label: "Consistent: dependable daily ritual", matchKey: "warm" },
      { id: "q5-classic", label: "Traditional: rich every single cup", matchKey: "bold" },
      { id: "q5-collector", label: "Collector: limited micro-lot editions", matchKey: "reserve" },
    ],
  },
];

const DEMO_RESULTS: QuizResultItem[] = [
  {
    key: "bright",
    title: "Solaris Series",
    summary:
      "Lively, crisp profiles roasted light to preserve stone fruit clarity, delicate floral aromatics, and clean citrus acidity.",
    ctaLabel: "Explore Solaris Series",
    secondaryCtaLabel: "Add Signature Lot ($24)",
  },
  {
    key: "warm",
    title: "Solstice Series",
    summary:
      "Approachable, balanced everyday blends bringing together soft caramel sweetness, roasted hazelnut, and a round finish.",
    ctaLabel: "Explore Solstice Series",
    secondaryCtaLabel: "Add House Blend ($22)",
  },
  {
    key: "bold",
    title: "Nocturne Series",
    summary:
      "Full-bodied, structured profiles developed for deep dark cocoa richness, toasted almond warmth, and syrupy espresso crema.",
    ctaLabel: "Explore Nocturne Series",
    secondaryCtaLabel: "Add Dark Reserve ($23)",
  },
  {
    key: "reserve",
    title: "Archive Editions",
    summary:
      "Small-batch experimental harvests sourced in tiny quantities, showcasing expressive fermentation and rare single-estate terroir.",
    ctaLabel: "Explore Archive Editions",
    secondaryCtaLabel: "Add Micro-Lot ($36)",
  },
];

export default function InteractiveQuizPreview() {
  return <InteractiveQuiz questions={DEMO_QUESTIONS} results={DEMO_RESULTS} />;
}
