"use client";

import { OrchardParallaxPosterBand } from "./component";

const JAR_ART = (title: string, hue: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='367' height='481' viewBox='0 0 367 481'><rect x='110' y='92' width='147' height='36' rx='8' fill='peru'/><path d='M92 142c0-16 14-26 32-26h119c18 0 32 10 32 26v236c0 24-18 42-42 42H134c-24 0-42-18-42-42V142Z' fill='${hue}'/><rect x='98' y='210' width='171' height='126' fill='seashell'/><text x='183' y='265' text-anchor='middle' font-family='Georgia,serif' font-size='20' fill='maroon'>SOLARA</text><text x='183' y='296' text-anchor='middle' font-family='Arial,sans-serif' font-size='11' letter-spacing='2' fill='orangered'>${title}</text></svg>`,
  );

export default function OrchardParallaxPosterBandPreview() {
  return (
    <OrchardParallaxPosterBand
      id="savoury"
      title="Savoury"
      backgroundImage="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop"
      backgroundAlt="Harvest pantry table"
      description={[
        "Here, the freshness of terraced coastal citrus meets the richness of the vegetable garden: from marmalades crafted with our finest orchard fruits to pestos and pates prepared with roasted garden vegetables, sun-dried tomatoes and fleshy olives. Each jar holds an artisanal recipe designed to preserve authentic natural aromas, bringing the scent and warmth of orchard harvests to the table. Ideal as pasta sauces, aperitif snacks and toppings for toasted bruschetta.",
      ]}
      weightsLabel="Available weights"
      weights={["190g", "1kg", "3kg"]}
      showWeights={true}
      showSlider={true}
      slides={[
        {
          id: "green-pesto",
          title: "Pistachio Pesto",
          imageSrc: JAR_ART("GREEN PESTO", "forestgreen"),
          hoverBg: "var(--rk-surface)",
          href: "#green-pesto",
        },
        {
          id: "caponata",
          title: "Roasted Eggplant Relish",
          imageSrc: JAR_ART("CAPONATA", "rebeccapurple"),
          hoverBg: "var(--rk-surface)",
          href: "#caponata",
        },
        {
          id: "red-pesto",
          title: "Sun-Dried Tomato Pesto",
          imageSrc: JAR_ART("RED PESTO", "firebrick"),
          hoverBg: "var(--rk-surface)",
          href: "#red-pesto",
        },
        {
          id: "citrus-onion",
          title: "Sweet & Sour Onion",
          imageSrc: JAR_ART("ONION GLAZE", "sienna"),
          hoverBg: "var(--rk-surface)",
          href: "#citrus-onion",
        },
      ]}
      ariaLabel="Savoury preserves showcase"
    />
  );
}
