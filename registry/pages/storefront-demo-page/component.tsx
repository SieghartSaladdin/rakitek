"use client";

import { useState } from "react";
import { EditorialStorefrontTemplate } from "@registry/templates/editorial-storefront-template/component";
import { RightRailNavbar } from "@registry/sections/right-rail-navbar/component";
import {
  EditorialStorefrontHero,
  type HeroProductSpec,
} from "@registry/sections/editorial-storefront-hero/component";
import {
  InteractiveQuiz,
  type QuizResultItem,
} from "@registry/sections/interactive-quiz/component";
import {
  CollectionSplitShowcase,
  type CollectionProductItem,
} from "@registry/sections/collection-split-showcase/component";
import { EditorialMissionSplit } from "@registry/sections/editorial-mission-split/component";
import { KineticManifestoSteps } from "@registry/sections/kinetic-manifesto-steps/component";
import { EditorialDarkFooter } from "@registry/sections/editorial-dark-footer/component";
import {
  SlideOverDrawer,
  type DrawerLineItem,
} from "@registry/ui/slide-over-drawer/component";
import { STOREFRONT_DEMO_DATA, type StorefrontDemoData } from "./demo-data";

export interface StorefrontDemoPageProps {
  data?: StorefrontDemoData;
}

function parsePrice(raw: string): number {
  const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 24;
}

export function StorefrontDemoPage({
  data = STOREFRONT_DEMO_DATA,
}: StorefrontDemoPageProps) {
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<DrawerLineItem[]>(data.initialCart);

  const addItem = (item: { id: string; name: string; price: number; image?: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleHeroProductClick = (
    product: HeroProductSpec,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    addItem({
      id: product.id,
      name: product.title,
      price: parsePrice(product.price),
      image: data.fallbackBagImage,
    });
  };

  const handleCollectionProduct = (product: CollectionProductItem) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price ?? 28,
      image: product.imageSrc,
    });
  };

  const handleQuizComplete = (result: QuizResultItem) => {
    const idx = data.quizSeriesIndex[result.key] ?? 0;
    setSelectedSeriesIndex(idx);
  };

  const handleQuizSecondary = (result: QuizResultItem) => {
    addItem({
      id: `quiz-${result.key}`,
      name: result.title,
      price: 26,
      image: data.fallbackBagImage,
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <EditorialStorefrontTemplate
      rail={
        <RightRailNavbar
          brand={data.brand}
          brandTone="inverted"
          promoTitle={data.promoTitle}
          promoDetail={data.promoDetail}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
        />
      }
      hero={
        <EditorialStorefrontHero
          taglineWords={data.hero.taglineWords}
          description={data.hero.description}
          ctaLabel={data.hero.ctaLabel}
          moodHeading={data.hero.moodHeading}
          marqueeText={data.hero.marqueeText}
          backgroundImage={data.hero.backgroundImage}
          products={data.hero.products}
          onProductClick={handleHeroProductClick}
        />
      }
      quiz={
        <InteractiveQuiz
          questions={data.quiz.questions}
          results={data.quiz.results}
          onCompleteAction={handleQuizComplete}
          onSecondaryAction={handleQuizSecondary}
        />
      }
      showcase={
        <CollectionSplitShowcase
          selectedIndex={selectedSeriesIndex}
          onSelectProduct={handleCollectionProduct}
        />
      }
      mission={
        <EditorialMissionSplit
          tagline={data.mission.tagline}
          statement={data.mission.statement}
          ctaLabel={data.mission.ctaLabel}
          topCaption={data.mission.topCaption}
          bottomCaption={data.mission.bottomCaption}
          coordinates={data.mission.coordinates}
        />
      }
      manifesto={
        <KineticManifestoSteps
          words={data.manifesto.words}
          steps={data.manifesto.steps}
          description={data.manifesto.description}
          ctaLabel={data.manifesto.ctaLabel}
        />
      }
      footer={
        <EditorialDarkFooter
          labHeading={data.footer.labHeading}
          labAddress={data.footer.labAddress}
          closingHeadline={data.footer.closingHeadline}
          copyright={data.footer.copyright}
          creditLabel={data.footer.creditLabel}
        />
      }
      drawer={
        <SlideOverDrawer
          open={cartOpen}
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          currencyCode={data.currencyCode}
          shippingLabel={data.shippingLabel}
        />
      }
    />
  );
}
