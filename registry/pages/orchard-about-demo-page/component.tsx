"use client";

import { useState } from "react";
import { OrchardEditorialTemplate } from "@registry/templates/orchard-editorial-template/component";
import { OrchardTopHeader } from "@registry/sections/orchard-top-header/component";
import { OrchardEditorialPageHero } from "@registry/sections/orchard-editorial-page-hero/component";
import { OrchardRhombusIntro } from "@registry/sections/orchard-rhombus-intro/component";
import { OrchardFruitPauseStage } from "@registry/sections/orchard-fruit-pause-stage/component";
import { OrchardVisionParallaxBox } from "@registry/sections/orchard-vision-parallax-box/component";
import { OrchardClosingParallaxFrame } from "@registry/sections/orchard-closing-parallax-frame/component";
import { OrchardEditorialFooter } from "@registry/sections/orchard-editorial-footer/component";
import { ORCHARD_ABOUT_DATA, type OrchardAboutDemoData } from "./demo-data";
import styles from "./styles.module.css";

export interface OrchardAboutDemoPageProps {
  data?: OrchardAboutDemoData;
}

export function OrchardAboutDemoPage({ data = ORCHARD_ABOUT_DATA }: OrchardAboutDemoPageProps) {
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
          <OrchardFruitPauseStage id="pause" title={data.pauseTitle} />
          <OrchardRhombusIntro id="intro-2" className={`${styles.plain} ${styles.gapAbout}`} paragraphs={data.intro2} />
          <OrchardVisionParallaxBox
            id="vision"
            title={data.vision.title}
            subtitle={data.vision.subtitle}
            backgroundImage={data.vision.backgroundImage}
            foregroundImage={data.vision.foregroundImage}
            foregroundAlt={data.vision.foregroundAlt}
          />
          <OrchardRhombusIntro id="intro-3" className={styles.plain} paragraphs={data.intro3} />
          <OrchardClosingParallaxFrame id="closing" imageSrc={data.closing.imageSrc} imageAlt={data.closing.imageAlt} />
        </>
      }
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
