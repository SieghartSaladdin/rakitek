"use client";

import { FestivalFooter } from "./component";

const LOGO_MARK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 367 356'><path d='M0 0h300l67 67v289H0z' fill='black'/></svg>",
  );

export default function FestivalFooterPreview() {
  return (
    <FestivalFooter
      id="footer"
      showNewsletter
      newsletterLabel="Newsletter"
      newsletterTitleLines={["Stay", "Informed"]}
      newsletterText="Subscribe to our newsletter to stay updated on the latest news and announcements for the next edition of Arts Festival."
      newsletterButtonLabel="Subscribe"
      newsletterHref="#newsletter"
      logoSrc={LOGO_MARK}
      logoAlt="Festival logo"
      logoHref="#top"
      brandName="Festival"
      editionLabel="15th edition"
      dateLabel="22 - 25 October 2026"
      placeLabel="Harbour City, Northland"
      socials={[
        { label: "Instagram", href: "https://www.instagram.com/" },
        { label: "Facebook", href: "https://www.facebook.com/" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "YouTube", href: "https://www.youtube.com/" },
      ]}
      columns={[
        {
          title: "Festival",
          links: [
            { label: "About", href: "#about" },
            { label: "Sponsors", href: "#sponsors" },
            { label: "Volunteers", href: "#volunteers" },
          ],
        },
        {
          title: "Program",
          links: [
            { label: "Talks", href: "#talks" },
            { label: "Augmented Playground", href: "#market" },
            { label: "Art Trail", href: "#trail" },
            { label: "By Night", href: "#night" },
          ],
        },
        {
          title: "Practical",
          links: [
            { label: "Access", href: "#access" },
            { label: "Accommodation", href: "#stay" },
            { label: "Tickets", href: "#tickets" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Legal notice", href: "#legal" },
            { label: "Privacy", href: "#privacy" },
            { label: "Contact", href: "mailto:hello@example.com", newTab: false },
          ],
        },
      ]}
      copyright={"© 2026 Arts Festival. All rights reserved."}
      metaItems={[
        { label: "Created by the festival team" },
        { label: "1 Example Street, 1000 Harbour City" },
        { label: "Login", href: "#login" },
      ]}
    />
  );
}
