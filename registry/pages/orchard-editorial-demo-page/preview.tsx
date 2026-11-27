"use client";

import { OrchardEditorialDemoPage } from "./component";
import { ORCHARD_DEMO_DATA } from "./demo-data";

export default function OrchardEditorialDemoPagePreview() {
  return <OrchardEditorialDemoPage data={ORCHARD_DEMO_DATA} />;
}
