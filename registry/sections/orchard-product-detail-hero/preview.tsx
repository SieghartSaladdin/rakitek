"use client";

import { OrchardProductDetailHero } from "./component";
import { jarArt, labelArt } from "@registry/ui/orchard-spinning-jar/component";

export default function OrchardProductDetailHeroPreview() {
  return (
    <OrchardProductDetailHero
      id="product-hero"
      title={"Pistachio\nCream"}
      category="Spreadable Creams"
      categoryHref="#spreads"
      originLabel={"Made in\nSicily - Italy"}
      jarImage={jarArt("goldenrod")}
      labelImage={labelArt("PISTACHIO", "Velvet Cream", "darkseagreen", "darkolivegreen")}
      jarAlt="Pistachio cream jar"
      jarPending={false}
      ariaLabel="Product hero"
    />
  );
}
