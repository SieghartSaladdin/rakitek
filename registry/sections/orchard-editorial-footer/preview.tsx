"use client";

import { OrchardEditorialFooter } from "./component";

export default function OrchardEditorialFooterPreview() {
  return (
    <OrchardEditorialFooter
      id="footer"
      brandDisplay="SOLARA ORCHARD"
      copyrightTitle="©2026 Solara Orchard"
      companyName="Terraced Groves Agricultural Co."
      vatLabel="VAT 04829100874"
      primaryLinks={[
        { label: "Home", href: "#top" },
        { label: "Pantry", href: "#pantry", active: true },
        { label: "Production", href: "#harvest" },
        { label: "Experience", href: "#experiences" },
        { label: "About", href: "#about" },
      ]}
      secondaryLinks={[
        { label: "Contacts", href: "#contact" },
        { label: "Shop", href: "#shop" },
      ]}
      offices={[
        { label: "Registered office", lines: ["Via degli Agrumi, 18", "95123 - Coastal Valley"] },
        { label: "Operational office", lines: ["Contrada Solare, Lot 4", "96014 - Grove District"] },
      ]}
      socialLabel="Follow us"
      socialLinks={[{ label: "@instagram", href: "https://instagram.com", external: true }]}
      contactPrompt="Do you have a question or would you like to find out more about us? Drop us a line, we would be delighted to tell you all about Solara Orchard."
      emailLabel="hello@solaraorchard.example"
      emailHref="mailto:hello@solaraorchard.example"
      legalLinks={[{ label: "Privacy & Cookies", href: "#privacy" }]}
      creditLabel="Designed by Orchard Studio"
      creditHref="#top"
      ariaLabel="Footer"
    />
  );
}
