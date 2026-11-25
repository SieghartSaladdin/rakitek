"use client";

import { StoryChancesList, type StoryChanceItem } from "./component";

const PREVIEW_ITEMS: StoryChanceItem[] = [
  {
    title: "To linger at a new table.",
    description:
      "You stepped out for one brief errand. Hours later you are trading stories with people you had never met at noon.",
  },
  {
    title: "To walk an empty street.",
    description:
      "Nobody watching, nothing to broadcast. Just quiet air in a corner of the city you seldom see at this hour.",
  },
  {
    title: "To notice the hidden doorway.",
    description:
      "A lane you pass every Tuesday. A courtyard you never tried. It has been waiting around the corner all along.",
  },
  {
    title: "To see the hard part vanish.",
    description:
      "The task you postponed for a month took four minutes in practice. After that, the weight simply disappeared.",
  },
  {
    title: "To return with a real story.",
    description:
      "Not a saved post or a clipped frame. An afternoon that actually unfolded while you were standing right in it.",
  },
];

export default function StoryChancesListPreview() {
  return (
    <StoryChancesList
      label="About Journey"
      chapter="Chapter 03"
      headlineTopPrefix="It starts as one"
      headlineTopSuffix="step."
      headlineBottom="It rarely stays small."
      subtitle="No promises. Just what tends to unfold once you begin."
      itemPrefix="A chance"
      items={PREVIEW_ITEMS}
    />
  );
}
