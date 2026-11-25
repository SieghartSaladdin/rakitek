"use client";

import { KineticStoryTemplate } from "@registry/templates/kinetic-story-template/component";
import { SpiralDeckHero } from "@registry/sections/spiral-deck-hero/component";
import { EditorialManifestoChapter } from "@registry/sections/editorial-manifesto-chapter/component";
import { StoryChancesList } from "@registry/sections/story-chances-list/component";
import { PhysicsStatsPit } from "@registry/sections/physics-stats-pit/component";
import { OrbitalCrestWheel } from "@registry/sections/orbital-crest-wheel/component";
import {
  RaysWaitlistFooter,
  type WaitlistSubmitResult,
} from "@registry/sections/rays-waitlist-footer/component";
import { KINETIC_STORY_DEMO_DATA, type KineticStoryDemoData } from "./demo-data";

export interface KineticStoryDemoPageProps {
  data?: KineticStoryDemoData;
  onWaitlistSubmit?: (email: string) => Promise<WaitlistSubmitResult> | WaitlistSubmitResult;
}

const FOOTER_ID = "story-waitlist-footer";

export function KineticStoryDemoPage({
  data = KINETIC_STORY_DEMO_DATA,
  onWaitlistSubmit,
}: KineticStoryDemoPageProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFooter = () => {
    const el = document.getElementById(FOOTER_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <KineticStoryTemplate
      footerId={FOOTER_ID}
      floatingCtaLabel={data.floatingCtaLabel}
      onFloatingCtaClick={scrollToFooter}
      hero={
        <SpiralDeckHero
          brandName={data.brandName}
          tagline={data.hero.tagline}
          ctaLabel={data.hero.ctaLabel}
          headline={data.hero.headline}
          onBrandClick={scrollToTop}
          onCtaClick={scrollToFooter}
        />
      }
      manifesto={
        <EditorialManifestoChapter
          label={data.manifesto.label}
          chapter={data.manifesto.chapter}
          lines={data.manifesto.lines}
          body={data.manifesto.body}
        />
      }
      story={
        <StoryChancesList
          label={data.story.label}
          chapter={data.story.chapter}
          headlineTopPrefix={data.story.headlineTopPrefix}
          headlineTopSuffix={data.story.headlineTopSuffix}
          headlineBottom={data.story.headlineBottom}
          subtitle={data.story.subtitle}
        />
      }
      stats={
        <PhysicsStatsPit
          label={data.stats.label}
          chapter={data.stats.chapter}
          headlineLines={data.stats.headlineLines}
          body={data.stats.body}
        />
      }
      orbit={
        <OrbitalCrestWheel
          label={data.orbit.label}
          chapter={data.orbit.chapter}
          kicker={data.orbit.kicker}
          headlineLines={data.orbit.headlineLines}
          lead={data.orbit.lead}
          blurb={data.orbit.blurb}
        />
      }
      footer={
        <RaysWaitlistFooter
          brandName={data.brandName}
          label={data.footer.label}
          chapter={data.footer.chapter}
          lead={data.footer.lead}
          pitch={data.footer.pitch}
          placeholder={data.footer.placeholder}
          caption={data.footer.caption}
          creditLabel={data.footer.creditLabel}
          contactEmail={data.footer.contactEmail}
          bottomTagline={data.footer.bottomTagline}
          onSubmit={onWaitlistSubmit}
        />
      }
    />
  );
}
