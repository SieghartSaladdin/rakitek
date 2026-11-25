"use client";

import { EditorialStorefrontHero, type HeroProductSpec } from "./component";

const PRODUCTS: HeroProductSpec[] = [
  { id: "cantaloupe", title: "Cantaloupe", price: "$28.00", type: "Single Origin", origin: "Nicaragua", process: "Washed" },
  { id: "ca-buche", title: "Ça Bûche", price: "$26.00", type: "Blend", origin: "Mexico, Ethiopia", process: "Natural & Washed" },
  { id: "gold", title: "Gold", price: "$40.00", type: "Single origin", origin: "Colombia", process: "Washed with thermal shock" },
];

export default function EditorialStorefrontHeroPreview() {
  return (
    <EditorialStorefrontHero
      taglineWords={["Go", "Against", "the", "Grain"]}
      description="Surrender to the moment with each sip and every cup of our wide and varied specialty coffee selection."
      moodHeading="A montreal specialty coffee company"
      backgroundImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=70&auto=format&fit=crop"
      backgroundAlt="Mountain ridge under a night sky"
      products={PRODUCTS}
      onProductClick={(_product, event) => event.preventDefault()}
    />
  );
}
