"use client";

import { OrchardLegalDocument } from "./component";

export default function OrchardLegalDocumentPreview() {
  return (
    <OrchardLegalDocument
      id="privacy"
      title="Privacy & Cookie Policy"
      meta="Last updated: 3 August 2026"
      ariaLabel="Privacy policy"
      sections={[
        {
          heading: "1. Data controller",
          paragraphs: [
            <>
              Example Orchard Growers Ltd., 12 Example Street, 00100 Sample City (SC), Country, VAT / tax code 000000000.
              <br /> Contact for any request concerning your personal data: <a href="mailto:hello@example.com">hello@example.com</a>.
            </>,
            "No Data Protection Officer (DPO) has been appointed, as it is not required in this case.",
          ],
        },
        {
          heading: "2. What data we process",
          paragraphs: [
            <>
              <strong>Browsing data.</strong> Web servers collect, for technical reasons, data such as IP address, browser type, and time of request. These are used only to deliver the site and to protect it from abuse, and are not used to identify you.
            </>,
            <>
              <strong>Cookies.</strong> Small files stored in your browser, described in section 3.
            </>,
            <>
              <strong>This site has no contact forms and no newsletter.</strong> If you write to us at the address above, we process the data you choose to include in your message, for the sole purpose of replying.
            </>,
          ],
        },
        {
          heading: "3. Cookies used",
          table: {
            head: ["Name", "Purpose", "Category", "Duration", "Set by"],
            rows: [
              ["site_consent", "Stores your cookie choice, so you are not asked again at every visit.", "Necessary", "6 months", "This site"],
              ["_stats", "Distinguishes returning visitors for aggregate statistics.", "Analytics", "13 months", "Analytics provider"],
              ["_stats_session", "Keeps the session state for the analytics property.", "Analytics", "13 months", "Analytics provider"],
            ],
          },
          after: [
            <>
              Analytics cookies are written only <strong>after your consent</strong>. Until then the analytics tool runs in a mode that stores nothing on your device and sends no identifiers.
            </>,
          ],
          action: { label: "Change your cookie preferences" },
        },
        {
          heading: "4. Legal basis",
          paragraphs: [
            "Necessary cookies and browsing data: legitimate interest in operating and securing the site (art. 6.1.f). Analytics cookies: your consent (art. 6.1.a), which you can withdraw at any time with no effect on processing already carried out.",
          ],
        },
        {
          heading: "5. Third parties",
          paragraphs: ["These providers may receive data, including your IP address, when you visit the site:"],
          bullets: [
            "Hosting Provider One Inc., hosting, CDN and site protection.",
            "Content Provider Two SAS, content and image delivery.",
            "Font Provider Three Inc., web font delivery.",
            "Analytics Provider Four Ltd., analytics, only with your consent.",
          ],
          after: [
            "Mail Provider Five Ltd. is the registrar for the domain and the provider of our email service: it does not take part in your browsing of this site, but it processes the messages you send us at the address above.",
            "Some of these providers are based outside the region. Transfers take place under the safeguards required by law, in particular standard contractual clauses approved by the competent authority, and you can ask us for a copy of the safeguards in place at any time.",
          ],
        },
        {
          heading: "6. Retention",
          paragraphs: [
            "Cookies are retained for the periods in the table above. Server logs are kept for the short time needed for security. Emails are kept as long as needed to answer your request.",
          ],
        },
        {
          heading: "7. Your rights",
          paragraphs: [
            <>
              You may request access, rectification, erasure, restriction or portability of your data, and object to processing, by writing to <a href="mailto:hello@example.com">hello@example.com</a>.
            </>,
            "You also have the right to lodge a complaint with the data protection authority of your country, for example the national supervisory body.",
          ],
        },
      ]}
    />
  );
}
