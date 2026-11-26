"use client";

import { useMemo, useState } from "react";
import { VoyageEditorialTemplate } from "@registry/templates/voyage-editorial-template/component";
import { SplitDropdownNavbar } from "@registry/sections/split-dropdown-navbar/component";
import { VideoExpandHero } from "@registry/sections/video-expand-hero/component";
import { ParallaxDestinationCarousel } from "@registry/sections/parallax-destination-carousel/component";
import { FeaturedPackagesGrid } from "@registry/sections/featured-packages-grid/component";
import { HeritageManifestoBand } from "@registry/sections/heritage-manifesto-band/component";
import { AlternatingStorySplit } from "@registry/sections/alternating-story-split/component";
import { EditorialSpotlightBanner } from "@registry/sections/editorial-spotlight-banner/component";
import { PartnerCtaBanner } from "@registry/sections/partner-cta-banner/component";
import { NewsletterPrefooter } from "@registry/sections/newsletter-prefooter/component";
import { EditorialColumnsFooter } from "@registry/sections/editorial-columns-footer/component";
import { FullscreenSearchOverlay } from "@registry/ui/fullscreen-search-overlay/component";
import type { TripSearchStep } from "@registry/ui/trip-search-bar/component";
import { VOYAGE_DEMO_DATA, type VoyageDemoData } from "./demo-data";

export interface VoyageEditorialDemoPageProps {
  data?: VoyageDemoData;
}

export function VoyageEditorialDemoPage({
  data = VOYAGE_DEMO_DATA,
}: VoyageEditorialDemoPageProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchStep, setSearchStep] = useState<TripSearchStep>("results");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [durationRange, setDurationRange] = useState("0-999");
  const [destination, setDestination] = useState({
    href: "#all",
    label: "All destinations",
  });

  const dateLabel = useMemo(() => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    return "Preferred dates";
  }, [startDate, endDate]);

  const openSearch = (step: TripSearchStep = "results") => {
    setSearchStep(step);
    setSearchOpen(true);
  };

  return (
    <VoyageEditorialTemplate
      header={
        <SplitDropdownNavbar
          brandName={data.brandName}
          onOpenSearch={() => openSearch("results")}
          onNavigate={(_href, e) => e.preventDefault()}
        />
      }
      overlay={
        <FullscreenSearchOverlay
          isOpen={searchOpen}
          initialStep={searchStep}
          onClose={() => setSearchOpen(false)}
          query={query}
          onQueryChange={setQuery}
          startDate={startDate}
          endDate={endDate}
          onDatesChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
          }}
          durationRange={durationRange}
          onDurationChange={setDurationRange}
          selectedDestinationHref={destination.href}
          selectedDestinationLabel={destination.label}
          onDestinationChange={(href, label) => setDestination({ href, label })}
          dateLabel={dateLabel}
        />
      }
      hero={
        <VideoExpandHero
          title={data.heroTitle}
          backgroundImage={data.heroBackground}
          query={query}
          dateLabel={dateLabel}
          hasCustomDate={Boolean(startDate && endDate)}
          destinationLabel={destination.label}
          onSelectSearchStep={(step) => openSearch(step)}
          onSearchSubmit={() => openSearch("results")}
        />
      }
      carousel={
        <ParallaxDestinationCarousel
          title={data.destinationsTitle}
          slides={data.destinations}
        />
      }
      packages={
        <FeaturedPackagesGrid
          heading={data.packagesHeading}
          packages={data.packages}
        />
      }
      manifesto={
        <HeritageManifestoBand
          surtext={data.manifestoSurtext}
          statement={data.manifestoStatement}
        />
      }
      stories={<AlternatingStorySplit stories={data.stories} />}
      spotlight={
        <EditorialSpotlightBanner
          category={data.spotlightCategory}
          title={data.spotlightTitle}
          authorLine={data.spotlightAuthor}
          imageSrc={data.spotlightImage}
        />
      }
      partnerBanner={
        <PartnerCtaBanner
          title={data.partnerTitle}
          body={data.partnerBody}
        />
      }
      prefooter={
        <NewsletterPrefooter
          title={data.newsletterTitle}
          description={data.newsletterBody}
        />
      }
      footer={<EditorialColumnsFooter brandName={data.brandName} />}
    />
  );
}
