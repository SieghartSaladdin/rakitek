"use client";

import { BookclubLandingDemoPage } from "./component";
import { BOOKCLUB_DEMO_DATA } from "./demo-data";

export default function BookclubLandingDemoPagePreview() {
  return <BookclubLandingDemoPage data={BOOKCLUB_DEMO_DATA} showIntro />;
}
