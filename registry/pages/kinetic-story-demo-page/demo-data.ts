export interface KineticStoryDemoData {
  brandName: string;
  floatingCtaLabel: string;
  hero: {
    tagline: string;
    ctaLabel: string;
    headline: string;
  };
  manifesto: {
    label: string;
    chapter: string;
    lines: Array<{ text: string; indent: string }>;
    body: string;
  };
  story: {
    label: string;
    chapter: string;
    headlineTopPrefix: string;
    headlineTopSuffix: string;
    headlineBottom: string;
    subtitle: string;
  };
  stats: {
    label: string;
    chapter: string;
    headlineLines: string[];
    body: string;
  };
  orbit: {
    label: string;
    chapter: string;
    kicker: string;
    headlineLines: string[];
    lead: string;
    blurb: string;
  };
  footer: {
    label: string;
    chapter: string;
    lead: string;
    pitch: string;
    placeholder: string;
    caption: string;
    creditLabel: string;
    contactEmail: string;
    bottomTagline: string;
  };
}

export const KINETIC_STORY_DEMO_DATA: KineticStoryDemoData = {
  brandName: "Oriel",
  floatingCtaLabel: "Join Waitlist",
  hero: {
    tagline: "Daily real-world prompts that pull you out of quiet repetition.",
    ctaLabel: "Join Waitlist",
    headline: "Real Life Happens Offline",
  },
  manifesto: {
    label: "About Pattern",
    chapter: "Chapter 01",
    lines: [
      { text: "The days keep", indent: "42.4vw" },
      { text: "passing. You", indent: "25.1vw" },
      { text: "keep watching them", indent: "17vw" },
      { text: "in the feed.", indent: "42.4vw" },
    ],
    body: "Every routine repeats until the months blend into one blur. You plan to start the project, take the trip, build the habit, and somehow it waits for next Monday. Familiar patterns feel safe, which is the trap, because quiet repetition lets a full year pass with little to show for it.",
  },
  story: {
    label: "About Journey",
    chapter: "Chapter 03",
    headlineTopPrefix: "It starts as one",
    headlineTopSuffix: "step.",
    headlineBottom: "It rarely stays small.",
    subtitle: "No promises. Just what tends to unfold once you begin.",
  },
  stats: {
    label: "About Metrics",
    chapter: "Chapter 06",
    headlineLines: ["Every habit", "leaves a trace."],
    body: "Choose the part of your craft you want to grow, and every step you take piles up there. Vitality, clarity, craft, presence. Some land right where you aimed. Some surprise you. Either way, it compounds into real progress.",
  },
  orbit: {
    label: "About Circles",
    chapter: "Chapter 07",
    kicker: "Five Houses",
    headlineLines: ["Pick a house.", "They shape", "your craft"],
    lead: "A circle is a quiet corner built around one craft.",
    blurb:
      "Each house gathers people who care about the same discipline, sharing weekly prompts and notes from the field without algorithmic noise.",
  },
  footer: {
    label: "Get In Early",
    chapter: "Chapter 08",
    lead: "Stop meaning to. Start doing.",
    pitch:
      "We are still building Oriel and opening access in small cohorts. Leave your email and we will reserve a seat near the front of the line.",
    placeholder: "Your Email",
    caption: "Early access \u00B7 No card, no spam",
    creditLabel: "Built by Oriel Studio",
    contactEmail: "hello@oriel.studio",
    bottomTagline: "Real Life Happens Offline",
  },
};
