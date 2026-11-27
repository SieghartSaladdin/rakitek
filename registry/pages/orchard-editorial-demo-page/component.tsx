"use client";

import { useState } from "react";
import { OrchardEditorialTemplate } from "@registry/templates/orchard-editorial-template/component";
import { OrchardTopHeader } from "@registry/sections/orchard-top-header/component";
import { OrchardEditorialPageHero } from "@registry/sections/orchard-editorial-page-hero/component";
import { OrchardRhombusIntro } from "@registry/sections/orchard-rhombus-intro/component";
import { OrchardProductShowcase } from "@registry/sections/orchard-product-showcase/component";
import { OrchardParallaxPosterBand } from "@registry/sections/orchard-parallax-poster-band/component";
import { OrchardSpecLedgerSection } from "@registry/sections/orchard-spec-ledger-section/component";
import { OrchardExpandingCoverOutro } from "@registry/sections/orchard-expanding-cover-outro/component";
import { OrchardEditorialFooter } from "@registry/sections/orchard-editorial-footer/component";
import { OrchardFloatingPillNav } from "@registry/ui/orchard-floating-pill-nav/component";
import { ORCHARD_DEMO_DATA, type OrchardDemoData } from "./demo-data";

export interface OrchardEditorialDemoPageProps {
  data?: OrchardDemoData;
}

export function OrchardEditorialDemoPage({
  data = ORCHARD_DEMO_DATA,
}: OrchardEditorialDemoPageProps) {
  const [activeLang, setActiveLang] = useState("en");

  return (
    <OrchardEditorialTemplate
      header={
        <OrchardTopHeader
          brandName={data.brandName}
          brandSubtitle={data.brandSubtitle}
          activeLang={activeLang}
          onLangChange={setActiveLang}
          primaryNav={data.primaryNav}
          secondaryNav={data.secondaryNav}
        />
      }
      hero={
        <OrchardEditorialPageHero
          title={data.hero.title}
          coverImage={data.hero.coverImage}
          coverAlt={data.hero.coverAlt}
          coverTitle={data.hero.coverTitle}
        />
      }
      intro={<OrchardRhombusIntro id="intro" paragraphs={data.intro} />}
      sections={
        <>
          <OrchardProductShowcase
            id={data.jams.id}
            title={data.jams.title}
            coverImage={data.jams.coverImage}
            coverAlt={data.jams.coverAlt}
            description={data.jams.description}
            weightsLabel={data.jams.weightsLabel}
            weights={data.jams.weights}
            slides={data.jams.slides}
          />
          <OrchardProductShowcase
            id={data.creams.id}
            title={data.creams.title}
            asideFirst={true}
            mediaLayout="inline-slider"
            description={data.creams.description}
            weightsLabel={data.creams.weightsLabel}
            weights={data.creams.weights}
            slides={data.creams.slides}
          />
          <OrchardParallaxPosterBand
            id={data.savoury.id}
            title={data.savoury.title}
            backgroundImage={data.savoury.backgroundImage}
            backgroundAlt={data.savoury.backgroundAlt}
            description={data.savoury.description}
            weightsLabel={data.savoury.weightsLabel}
            weights={data.savoury.weights}
            slides={data.savoury.slides}
          />
          <OrchardSpecLedgerSection
            id={data.monopack.id}
            title={data.monopack.title}
            description={data.monopack.description}
            coverImage={data.monopack.coverImage}
            coverAlt={data.monopack.coverAlt}
            columns={data.monopack.columns}
            rows={data.monopack.rows}
          />
        </>
      }
      outro={
        <OrchardExpandingCoverOutro
          imageSrc={data.outro.imageSrc}
          imageAlt={data.outro.imageAlt}
        />
      }
      floatingNav={<OrchardFloatingPillNav items={data.floatingNav} />}
      footer={
        <OrchardEditorialFooter
          id="footer"
          brandDisplay={data.footer.brandDisplay}
          copyrightTitle={data.footer.copyrightTitle}
          companyName={data.footer.companyName}
          vatLabel={data.footer.vatLabel}
          primaryLinks={data.footer.primaryLinks}
          secondaryLinks={data.footer.secondaryLinks}
          offices={data.footer.offices}
          socialLabel={data.footer.socialLabel}
          socialLinks={data.footer.socialLinks}
          contactPrompt={data.footer.contactPrompt}
          emailLabel={data.footer.emailLabel}
          emailHref={data.footer.emailHref}
          legalLinks={data.footer.legalLinks}
          creditLabel={data.footer.creditLabel}
        />
      }
    />
  );
}
