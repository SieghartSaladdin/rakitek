"use client";

import { KineticStoryTemplate } from "./component";
import styles from "./styles.module.css";

function ChapterPlaceholder({
  tag,
  title,
  note,
  variant = "dark",
}: {
  tag: string;
  title: string;
  note: string;
  variant?: "dark" | "hero" | "light";
}) {
  const variantClass =
    variant === "hero"
      ? styles.placeholderHero
      : variant === "light"
        ? styles.placeholderLight
        : "";
  return (
    <section className={`${styles.placeholderChapter} ${variantClass}`}>
      <span className={styles.placeholderTag}>{tag}</span>
      <div>
        <h2 className={styles.placeholderTitle}>{title}</h2>
        <p className={styles.placeholderNote}>{note}</p>
      </div>
    </section>
  );
}

export default function KineticStoryTemplatePreview() {
  return (
    <KineticStoryTemplate
      hero={
        <ChapterPlaceholder
          tag="Slot 01 · Hero · 100vh Stage"
          title="Spiral Deck Hero"
          note="Full-bleed dark WebGL/Three.js opening stage with edge-fitted serif headline and floating top navigation."
          variant="hero"
        />
      }
      manifesto={
        <ChapterPlaceholder
          tag="Slot 02 · Chapter 01 · Manifesto"
          title="Editorial Manifesto Chapter"
          note="Asymmetric staggered typography chapter over obsidian background."
        />
      }
      story={
        <ChapterPlaceholder
          tag="Slot 03 · Chapter 03 · Light Narrative Card"
          title="Story Chances List"
          note="Rounded light contrast narrative sheet with expanding crest rows."
          variant="light"
        />
      }
      stats={
        <ChapterPlaceholder
          tag="Slot 04 · Chapter 06 · Interactive Canvas"
          title="Physics Stats Pit"
          note="Full-viewport physics canvas with four interactive stat pillars."
        />
      }
      orbit={
        <ChapterPlaceholder
          tag="Slot 05 · Chapter 07 · Orbital Stage"
          title="Orbital Crest Wheel"
          note="Rotating crest wheel showcase paired with editorial column copy."
        />
      }
      footer={
        <ChapterPlaceholder
          tag="Slot 06 · Chapter 08 · Closing Waitlist"
          title="Rays Waitlist Footer"
          note="WebGL light rays backdrop, waitlist form, and closing wordmark."
        />
      }
    />
  );
}
