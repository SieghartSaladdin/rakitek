"use client";

import { useState } from "react";
import { OrchardEditorialTemplate } from "@registry/templates/orchard-editorial-template/component";
import { OrchardTopHeader } from "@registry/sections/orchard-top-header/component";
import { OrchardProductDetailHero } from "@registry/sections/orchard-product-detail-hero/component";
import { OrchardRhombusIntro } from "@registry/sections/orchard-rhombus-intro/component";
import { OrchardProductMetaBand } from "@registry/sections/orchard-product-meta-band/component";
import { OrchardPhotoDragSlider } from "@registry/sections/orchard-photo-drag-slider/component";
import { OrchardRelatedProductsRail } from "@registry/sections/orchard-related-products-rail/component";
import { OrchardEditorialFooter } from "@registry/sections/orchard-editorial-footer/component";
import { ORCHARD_PRODUCT_DETAIL_DATA, type OrchardProductDetailDemoData } from "./demo-data";
import styles from "./styles.module.css";

export interface OrchardProductDetailDemoPageProps {
  data?: OrchardProductDetailDemoData;
}

export function OrchardProductDetailDemoPage({ data = ORCHARD_PRODUCT_DETAIL_DATA }: OrchardProductDetailDemoPageProps) {
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
        <OrchardProductDetailHero
          id="product-hero"
          title={data.product.title}
          category={data.product.category}
          categoryHref={data.product.categoryHref}
          originLabel={data.product.originLabel}
          jarImage={data.product.jarImage}
          labelImage={data.product.labelImage}
          jarAlt={data.product.jarAlt}
        />
      }
      intro={<OrchardRhombusIntro id="intro" className={`${styles.plain} ${styles.gapProduct}`} paragraphs={data.intro} afterParagraphs={data.allergens} />}
      sections={
        <>
          <OrchardProductMetaBand id="details" tips={data.tips} weights={data.weights} conservation={data.conservation} />
          <OrchardPhotoDragSlider id="gallery" images={data.gallery} />
          <OrchardRelatedProductsRail id="related" title={data.relatedTitle} products={data.related} />
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
