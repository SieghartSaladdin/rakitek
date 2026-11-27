"use client";

import { BookclubWaveFooter } from "./component";

export default function BookclubWaveFooterPreview() {
  return (
    <BookclubWaveFooter
      id="signup"
      brandName="FABLE & FOLD"
      appStoreHref="#app-store"
      googlePlayHref="#google-play"
      showAppBadges
      socials={[
        { platform: "instagram", href: "https://instagram.com", ariaLabel: "Go to Instagram" },
        { platform: "tiktok", href: "https://tiktok.com", ariaLabel: "Go to TikTok" },
      ]}
      showSocials
      legalLinks={[
        { label: "Terms of Service", href: "#terms" },
        { label: "Privacy Policy", href: "#privacy" },
      ]}
      newsletterHeading="Join our mailing list"
      emailPlaceholder="Email Address"
      emailAriaLabel="Email Address"
      subscribeLabel="Subscribe"
      successLine1="Thank you,"
      successLine2="you joined us!"
      errorText="Please enter a valid email address."
      showNewsletter
      copyrightText="©2026 Fable & Fold Book Club. All rights reserved."
      creditLinks={[
        { label: "Design by Studio North", href: "#design" },
        { label: "Development by Guild Three", href: "#dev" },
      ]}
      showCredits
      visualAlt="Monthly Book Club Box"
    />
  );
}
