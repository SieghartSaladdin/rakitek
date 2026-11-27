"use client";

import { BookclubLandingTemplate } from "@registry/templates/bookclub-landing-template/component";
import { BookclubIntroSplash } from "@registry/ui/bookclub-intro-splash/component";
import { BookclubFloatingHeader } from "@registry/sections/bookclub-floating-header/component";
import { BookclubHero } from "@registry/sections/bookclub-hero/component";
import { BookclubBooksCarousel } from "@registry/sections/bookclub-books-carousel/component";
import { BookclubHowItWorks } from "@registry/sections/bookclub-how-it-works/component";
import { BookclubBoxSequence } from "@registry/sections/bookclub-box-sequence/component";
import { BookclubGenreShowcase } from "@registry/sections/bookclub-genre-showcase/component";
import { BookclubBenefitsStage } from "@registry/sections/bookclub-benefits-stage/component";
import { BookclubFaqAccordion } from "@registry/sections/bookclub-faq-accordion/component";
import { BookclubGiftFeature } from "@registry/sections/bookclub-gift-feature/component";
import { BookclubPromoBanners } from "@registry/sections/bookclub-promo-banners/component";
import { BookclubChoiceWinners } from "@registry/sections/bookclub-choice-winners/component";
import { BookclubExclusiveShowcase } from "@registry/sections/bookclub-exclusive-showcase/component";
import { BookclubWaveFooter } from "@registry/sections/bookclub-wave-footer/component";
import { BOOKCLUB_DEMO_DATA, type BookclubDemoData } from "./demo-data";

export interface BookclubLandingDemoPageProps {
  data?: BookclubDemoData;
  /** Play the page-load splash overlay (it removes itself after about 2s). */
  showIntro?: boolean;
}

export function BookclubLandingDemoPage({
  data = BOOKCLUB_DEMO_DATA,
  showIntro = true,
}: BookclubLandingDemoPageProps) {
  return (
    <BookclubLandingTemplate
      intro={showIntro ? <BookclubIntroSplash /> : null}
      header={
        <BookclubFloatingHeader
          brandName={data.brandName}
          navLinks={data.navLinks}
          socialLinks={data.socials}
          ctaLabel={data.headerCtaLabel}
          regionLabel={data.regionLabel}
        />
      }
      hero={
        <BookclubHero
          headline={data.hero.headline}
          description={data.hero.description}
          ctaLabel={data.hero.ctaLabel}
          handwrittenNote={data.hero.handwrittenNote}
          visualAlt={data.hero.visualAlt}
        />
      }
      books={
        <BookclubBooksCarousel
          title={data.booksSection.title}
          subtitle={data.booksSection.subtitle}
          handwrittenNote={data.booksSection.handwrittenNote}
          books={data.booksSection.books}
        />
      }
      howItWorks={
        <BookclubHowItWorks
          title={data.howItWorks.title}
          handwrittenNote={data.howItWorks.handwrittenNote}
          ctaLabel={data.howItWorks.ctaLabel}
          steps={data.howItWorks.steps}
        />
      }
      boxSequence={
        <BookclubBoxSequence
          headline={data.boxSequence.headline}
          callOutNote={data.boxSequence.callOutNote}
          finalTagline={data.boxSequence.finalTagline}
        />
      }
      genres={
        <BookclubGenreShowcase
          title={data.genres.title}
          handwrittenNote={data.genres.handwrittenNote}
          genres={data.genres.items}
        />
      }
      benefits={
        <BookclubBenefitsStage
          heading={data.benefits.heading}
          pills={data.benefits.pills}
        />
      }
      faq={
        <BookclubFaqAccordion
          title={data.faq.title}
          ctaLabel={data.faq.ctaLabel}
          items={data.faq.items}
        />
      }
      gift={
        <BookclubGiftFeature
          curvedHeadline={data.gift.curvedHeadline}
          description={data.gift.description}
          ctaLabel={data.gift.ctaLabel}
          pressHeading={data.gift.pressHeading}
          pressItems={data.gift.pressItems}
        />
      }
      promoBanners={
        <BookclubPromoBanners
          primaryText={data.promo.primaryText}
          secondaryText={data.promo.secondaryText}
        />
      }
      winners={
        <BookclubChoiceWinners
          title={data.winners.title}
          description={data.winners.description}
          winners={data.winners.items}
        />
      }
      exclusive={
        <BookclubExclusiveShowcase
          title={data.exclusive.title}
          subtitle={data.exclusive.subtitle}
          bookTitle={data.exclusive.bookTitle}
          bookDescription={data.exclusive.bookDescription}
          ratingLabel={data.exclusive.ratingLabel}
          ratingValue={data.exclusive.ratingValue}
          ctaLabel={data.exclusive.ctaLabel}
          tags={data.exclusive.tags}
          authorsHeading={data.exclusive.authorsHeading}
          authors={data.exclusive.authors}
          quote1={data.exclusive.quote1}
          quote2={data.exclusive.quote2}
        />
      }
      footer={
        <BookclubWaveFooter
          brandName={data.brandName}
          socials={data.socials}
          newsletterHeading={data.footer.newsletterHeading}
          copyrightText={data.footer.copyrightText}
          creditLinks={[
            { label: data.footer.creditDesign, href: "#design" },
            { label: data.footer.creditDev, href: "#dev" },
          ]}
        />
      }
    />
  );
}
