"use client";

import { FixedBackdropRevealTemplate } from "@registry/templates/fixed-backdrop-reveal-template/component";
import { FixedVideoBackdrop } from "@registry/sections/fixed-video-backdrop/component";
import { FestivalHeader } from "@registry/sections/festival-header/component";
import { FestivalHeroManifesto } from "@registry/sections/festival-hero-manifesto/component";
import { CinematicMediaBanner } from "@registry/sections/cinematic-media-banner/component";
import { ProgramTileGrid } from "@registry/sections/program-tile-grid/component";
import { FestivalLineupSection } from "@registry/sections/festival-lineup-section/component";
import { NumbersPracticalInfo } from "@registry/sections/numbers-practical-info/component";
import { TicketMarqueeBar } from "@registry/sections/ticket-marquee-bar/component";
import { FestivalFooter } from "@registry/sections/festival-footer/component";
import { FestivalSectionDivider } from "@registry/ui/festival-section-divider/component";
import { FESTIVAL_DEMO_DATA, type FestivalDemoData } from "./demo-data";

export type { FestivalDemoData } from "./demo-data";

export interface FestivalEventDemoPageProps {
  data?: FestivalDemoData;
}

export function FestivalEventDemoPage({ data = FESTIVAL_DEMO_DATA }: FestivalEventDemoPageProps) {
  const [talksDivider, trailDivider, partiesDivider, numbersDivider] = data.dividers;

  return (
    <FixedBackdropRevealTemplate
      backdrop={<FixedVideoBackdrop {...data.backdrop} />}
      header={<FestivalHeader {...data.header} />}
      footer={<FestivalFooter {...data.footer} />}
      revealHeight="100vh"
      mainId="main-content"
      skipLinkLabel={data.skipLinkLabel}
    >
      <FestivalHeroManifesto {...data.hero} />
      <CinematicMediaBanner {...data.featureBanner} />
      <ProgramTileGrid {...data.program} />
      <FestivalSectionDivider {...talksDivider} />
      <FestivalLineupSection {...data.talks} />
      <FestivalSectionDivider {...trailDivider} />
      <FestivalLineupSection {...data.trail} />
      <CinematicMediaBanner {...data.midBanner} />
      <FestivalLineupSection {...data.playground} />
      <FestivalSectionDivider {...partiesDivider} />
      <FestivalLineupSection {...data.parties} />
      <FestivalSectionDivider {...numbersDivider} />
      <NumbersPracticalInfo {...data.numbers} />
      <TicketMarqueeBar {...data.marquee} />
      <CinematicMediaBanner {...data.closingBanner} />
    </FixedBackdropRevealTemplate>
  );
}
