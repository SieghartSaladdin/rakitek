"use client";

import { EditorialManifestoChapter, type ManifestoLine } from "./component";

const PREVIEW_LINES: ManifestoLine[] = [
  { text: "The days keep", indent: "42.4vw" },
  { text: "passing. You", indent: "25.1vw" },
  { text: "keep watching them", indent: "17vw" },
  { text: "in the feed.", indent: "42.4vw" },
];

const PREVIEW_BODY =
  "Every routine repeats until the months blend into one blur. You plan to start the project, take the trip, build the habit, and somehow it waits for next Monday. Familiar patterns feel safe, which is the trap, because quiet repetition lets a full year pass with little to show for it.";

export default function EditorialManifestoChapterPreview() {
  return (
    <EditorialManifestoChapter
      label="About Pattern"
      chapter="Chapter 01"
      lines={PREVIEW_LINES}
      body={PREVIEW_BODY}
      tone="dark"
    />
  );
}
