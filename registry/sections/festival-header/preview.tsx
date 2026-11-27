"use client";

import { FestivalHeader } from "./component";

const LOGO_MARK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 367 356'><path d='M0 0h300l67 67v289H0z' fill='black'/></svg>",
  );

export default function FestivalHeaderPreview() {
  return (
    <div style={{ minHeight: "100svh", background: "var(--rk-bg)" }}>
      <FestivalHeader
        id="site-header"
        logoSrc={LOGO_MARK}
        logoAlt="Festival logo"
        logoHref="#top"
        brandName="Festival"
        languages={[
          { code: "fr", label: "FR" },
          { code: "en", label: "EN" },
        ]}
        activeLanguage="en"
        onLanguageChange={() => undefined}
        ctaLabel="Tickets"
        ctaHref="#tickets"
        menuLabel="Menu"
        toggleMenuLabel="Toggle menu"
        closeMenuLabel="Close menu"
        drawerCtaLabel="Tickets"
        drawerCtaHref="#tickets"
        menuItems={[
          {
            label: "Professionals",
            href: "#pro",
            children: [
              { label: "Talks", href: "#talks" },
              { label: "Art Trail", href: "#trail" },
              {
                label: "Thematic programs",
                href: "#rooms",
                children: [
                  { label: "Open Studio", href: "#studio" },
                  { label: "Night Signals", href: "#signals" },
                ],
              },
            ],
          },
          {
            label: "Public",
            href: "#public",
            children: [
              { label: "Art Trail", href: "#trail" },
              { label: "Market", href: "#market" },
              { label: "For Kids", href: "#kids" },
            ],
          },
          {
            label: "Practical",
            href: "#practical",
            children: [
              { label: "Access", href: "#access" },
              { label: "Accommodation", href: "#stay" },
            ],
          },
          { label: "By Night", href: "#night" },
        ]}
        socials={[
          { label: "Facebook", href: "https://www.facebook.com/" },
          { label: "Instagram", href: "https://www.instagram.com/" },
          { label: "LinkedIn", href: "https://www.linkedin.com/" },
          { label: "YouTube", href: "https://www.youtube.com/" },
        ]}
        fixed
      />
    </div>
  );
}
