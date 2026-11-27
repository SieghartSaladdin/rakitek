"use client";

import { OrchardRelatedProductsRail } from "./component";
import { orchardRelatedJar } from "./default-jars";

export default function OrchardRelatedProductsRailPreview() {
  return (
    <OrchardRelatedProductsRail
      id="related"
      title="The other products"
      products={[
        orchardRelatedJar("almond", "Almond Spread", "ALMOND", "peru"),
        orchardRelatedJar("hazelnut", "Hazelnut Spread", "HAZELNUT", "sienna"),
        orchardRelatedJar("orange", "Orange Marmalade", "ORANGE", "darkorange"),
        orchardRelatedJar("berry", "Strawberry and Berry", "BERRY", "crimson"),
        orchardRelatedJar("mulberry", "Black Mulberry Jam", "MULBERRY", "indigo"),
        orchardRelatedJar("pear", "Pear and Cinnamon", "PEAR", "goldenrod"),
        orchardRelatedJar("caponata", "Aubergine Caponata", "CAPONATA", "rebeccapurple"),
        orchardRelatedJar("red-pesto", "Roasted Red Pesto", "RED PESTO", "firebrick"),
        orchardRelatedJar("green-pesto", "Pistachio Pesto", "GREEN PESTO", "forestgreen"),
        orchardRelatedJar("onions", "Sweet and Sour Onions", "ONIONS", "sienna"),
        orchardRelatedJar("fig", "Wild Fig Jam", "FIG", "saddlebrown"),
      ]}
      ariaLabel="The other products"
    />
  );
}
