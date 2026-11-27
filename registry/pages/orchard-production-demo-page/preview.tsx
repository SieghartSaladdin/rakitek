"use client";

import { OrchardProductionDemoPage } from "./component";
import { ORCHARD_PRODUCTION_DATA } from "./demo-data";

export default function OrchardProductionDemoPagePreview() {
  return <OrchardProductionDemoPage data={ORCHARD_PRODUCTION_DATA} />;
}
