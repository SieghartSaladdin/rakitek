"use client";

import { OrchardAboutDemoPage } from "./component";
import { ORCHARD_ABOUT_DATA } from "./demo-data";

export default function OrchardAboutDemoPagePreview() {
  return <OrchardAboutDemoPage data={ORCHARD_ABOUT_DATA} />;
}
