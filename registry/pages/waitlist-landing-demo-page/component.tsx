"use client";

import { SaasWaitlistTemplate } from "@registry/templates/saas-waitlist-template/component";
import { FloatingPillNavbar } from "@registry/sections/floating-pill-navbar/component";
import {
  WaitlistHero,
  type WaitlistSubmitResult,
} from "@registry/sections/waitlist-hero/component";
import { SpotlightStatBand } from "@registry/sections/spotlight-stat-band/component";
import { MinimalSaasFooter } from "@registry/sections/minimal-saas-footer/component";
import { WAITLIST_LANDING_DEMO_DATA, type WaitlistLandingDemoData } from "./demo-data";

export interface WaitlistLandingDemoPageProps {
  data?: WaitlistLandingDemoData;
  onJoin?: (payload: {
    email: string;
    allowContact: boolean;
    rating: number;
  }) => Promise<WaitlistSubmitResult | void> | WaitlistSubmitResult | void;
}

export function WaitlistLandingDemoPage({
  data = WAITLIST_LANDING_DEMO_DATA,
  onJoin,
}: WaitlistLandingDemoPageProps) {
  return (
    <SaasWaitlistTemplate
      navbar={
        <FloatingPillNavbar
          brandName={data.brandName}
          links={data.navLinks}
          contactEmail={data.contactEmail}
        />
      }
      spotlight={
        <SpotlightStatBand
          id="spotlight"
          value={data.spotlight.value}
          suffix={data.spotlight.suffix}
          lead={data.spotlight.lead}
          columns={data.spotlight.columns}
        />
      }
      hero={
        <WaitlistHero
          id="waitlist"
          marqueeText={data.hero.marqueeText}
          mobileOfferText={data.hero.mobileOfferText}
          memberCount={data.hero.memberCount}
          memberCountLabel={data.hero.memberCountLabel}
          headline={data.hero.headline}
          emailPlaceholder={data.hero.emailPlaceholder}
          consentLabel={data.hero.consentLabel}
          ratingTitle={data.hero.ratingTitle}
          ratingSubtitle={data.hero.ratingSubtitle}
          submitLabel={data.hero.submitLabel}
          successTitle={data.hero.successTitle}
          successSubtitle={data.hero.successSubtitle}
          onJoin={onJoin}
        />
      }
      footer={
        <MinimalSaasFooter
          brand={data.brandName}
          tagline={data.footer.tagline}
          links={data.footer.links}
        />
      }
    />
  );
}
