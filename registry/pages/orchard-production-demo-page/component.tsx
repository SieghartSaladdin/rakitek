"use client";

import { useState } from "react";
import { OrchardEditorialTemplate } from "@registry/templates/orchard-editorial-template/component";
import { OrchardTopHeader } from "@registry/sections/orchard-top-header/component";
import { OrchardEditorialPageHero } from "@registry/sections/orchard-editorial-page-hero/component";
import { OrchardRhombusIntro } from "@registry/sections/orchard-rhombus-intro/component";
import { OrchardProductionLedger } from "@registry/sections/orchard-production-ledger/component";
import { OrchardPhotoDragSlider } from "@registry/sections/orchard-photo-drag-slider/component";
import { OrchardEditorialFooter } from "@registry/sections/orchard-editorial-footer/component";
import { OrchardFloatingPillNav } from "@registry/ui/orchard-floating-pill-nav/component";
import { ORCHARD_PRODUCTION_DATA, type OrchardProductionDemoData } from "./demo-data";
import styles from "./styles.module.css";

export interface OrchardProductionDemoPageProps {
  data?: OrchardProductionDemoData;
}

export function OrchardProductionDemoPage({ data = ORCHARD_PRODUCTION_DATA }: OrchardProductionDemoPageProps) {
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
      intro={<OrchardRhombusIntro id="intro" className={styles.plain} paragraphs={data.intro} />}
      sections={
        <>
          <OrchardProductionLedger
            id={data.citrus.id}
            title={data.citrus.title}
            singleLineTitle={data.citrus.singleLineTitle}
            description={data.citrus.description}
            subtitle={data.citrus.subtitle}
            columns={data.citrus.columns}
            rows={data.citrus.rows}
          />
          <OrchardPhotoDragSlider id="gallery-1" images={data.gallery1} />
          <OrchardProductionLedger
            id={data.nuts.id}
            title={data.nuts.title}
            description={data.nuts.description}
            subtitle={data.nuts.subtitle}
            columns={data.nuts.columns}
            rows={data.nuts.rows}
          />
          <div style={{ marginBottom: "12.5rem" }}>
            <OrchardPhotoDragSlider id="gallery-2" images={data.gallery2} />
          </div>
        </>
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
