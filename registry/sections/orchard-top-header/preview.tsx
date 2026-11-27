"use client";

import { useState } from "react";
import { OrchardTopHeader } from "./component";

export default function OrchardTopHeaderPreview() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: "180px", position: "relative" }}>
      <OrchardTopHeader
        id="site-header"
        brandName="SOLARA"
        brandSubtitle="Orchard"
        brandHref="#top"
        brandAriaLabel="Solara Orchard"
        showLangSwitcher={true}
        languages={[
          { code: "it", label: "IT", href: "#it" },
          { code: "en", label: "EN", href: "#en" },
        ]}
        activeLang={lang}
        langSwitcherAriaLabel="Language switcher"
        onLangChange={setLang}
        menuLabel="menu"
        closeLabel="close"
        navOpen={open}
        onNavOpenChange={setOpen}
        primaryNav={[
          { label: "Home", href: "#home" },
          { label: "Pantry", href: "#pantry", active: true },
          { label: "Harvest", href: "#harvest" },
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ]}
        secondaryNav={[
          { label: "Tasting Room", href: "#experiences" },
          { label: "Instagram", href: "#instagram", external: true },
        ]}
        legalLinks={[{ label: "Privacy & Cookies", href: "#privacy" }]}
        theme="dark"
        autoCompactOnScroll={false}
        autoHideOnScroll={false}
        enableOverlay={true}
      />
    </div>
  );
}
