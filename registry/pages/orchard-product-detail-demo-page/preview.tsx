"use client";

import { OrchardProductDetailDemoPage } from "./component";
import { ORCHARD_PRODUCT_DETAIL_DATA } from "./demo-data";

export default function OrchardProductDetailDemoPagePreview() {
  return <OrchardProductDetailDemoPage data={ORCHARD_PRODUCT_DETAIL_DATA} />;
}
