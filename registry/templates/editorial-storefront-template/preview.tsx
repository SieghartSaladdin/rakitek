"use client";

import { EditorialStorefrontTemplate } from "./component";
import styles from "./styles.module.css";

function PlaceholderSlot({
  tag,
  title,
  note,
  variant = "light",
}: {
  tag: string;
  title: string;
  note: string;
  variant?: "light" | "hero" | "dark";
}) {
  const variantClass =
    variant === "hero"
      ? styles.placeholderCardHero
      : variant === "dark"
        ? styles.placeholderCardDark
        : "";
  return (
    <section className={`${styles.placeholderCard} ${variantClass}`}>
      <span className={styles.placeholderTag}>{tag}</span>
      <div>
        <h2 className={styles.placeholderTitle}>{title}</h2>
        <p className={styles.placeholderNote}>{note}</p>
      </div>
    </section>
  );
}

export default function EditorialStorefrontTemplatePreview() {
  return (
    <EditorialStorefrontTemplate
      rail={
        <aside className={styles.placeholderRail} data-template-rail="placeholder">
          <span>Menu</span>
          <span className={styles.placeholderRailLabel}>90px Right Rail Slot</span>
          <span>Bag</span>
        </aside>
      }
      hero={
        <PlaceholderSlot
          tag="Slot 01 · Hero · width: calc(100vw - 90px)"
          title="Editorial Storefront Hero"
          note="Full-bleed visual hero with sticky CTA and featured product ticker. Desktop width reserves 90px for the right rail; collapses to 100% below 1024px."
          variant="hero"
        />
      }
      quiz={
        <PlaceholderSlot
          tag="Slot 02 · Interactive Quiz"
          title="Guided Product Matcher"
          note="Multi-step recommendation flow that syncs the active collection index below."
        />
      }
      showcase={
        <PlaceholderSlot
          tag="Slot 03 · Collection Showcase"
          title="Split Collection Slider"
          note="8/4 split showcase pairing editorial visuals with horizontal product cards."
        />
      }
      mission={
        <PlaceholderSlot
          tag="Slot 04 · Story / Mission"
          title="Editorial Mission Split"
          note="Asymmetric editorial narrative with inset visual and coordinates."
        />
      }
      manifesto={
        <PlaceholderSlot
          tag="Slot 05 · Manifesto & Steps"
          title="Kinetic Manifesto Steps"
          note="Monumental typography headline paired with numbered onboarding steps."
        />
      }
      footer={
        <PlaceholderSlot
          tag="Slot 06 · Dark Footer"
          title="Editorial Dark Footer"
          note="Asymmetric link columns, newsletter underline form, and studio credits."
          variant="dark"
        />
      }
    />
  );
}
