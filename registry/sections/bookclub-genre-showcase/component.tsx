"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BookclubMascotPopup } from "@registry/ui/bookclub-mascot-popup/component";
import styles from "./styles.module.css";

export interface BookclubGenreItem {
  label: string;
  hasWordBreak?: boolean;
}

export interface BookclubGenreCover {
  src?: string;
  alt: string;
}

export interface BookclubGenreShowcaseProps {
  id?: string;
  title?: string;
  handwrittenNote?: string;
  showHandwrittenNote?: boolean;
  genres?: BookclubGenreItem[];
  coverStacks?: BookclubGenreCover[][];
  popupTitle?: string;
  popupCtaLabel?: string;
  popupCtaHref?: string;
  showPopup?: boolean;
  className?: string;
}

const DEFAULT_GENRES: BookclubGenreItem[] = [
  { label: "Horror" },
  { label: "Science Fiction" },
  { label: "Romance" },
  { label: "Thriller" },
  { label: "Literary Fiction" },
  { label: "Fantasy" },
  { label: "Gothic Fiction" },
  { label: "Historical Fiction" },
  { label: "Magical Realism" },
  { label: "Contemporary Fiction", hasWordBreak: true },
  { label: "and more!" },
];

export function BookclubGenreShowcase({
  id = "genres",
  title = "Choose from",
  handwrittenNote = "We've got a book for every kind of reader",
  showHandwrittenNote = true,
  genres = DEFAULT_GENRES,
  coverStacks,
  popupTitle = "Want to join the Club?",
  popupCtaLabel = "Sign-up now!",
  popupCtaHref = "#signup",
  showPopup = true,
  className = "",
}: BookclubGenreShowcaseProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const list = element.querySelector<HTMLElement>("[data-genre-list]");
    const scope = element.querySelector<HTMLElement>("[data-genre-scope]");
    const items = element.querySelectorAll<HTMLElement>("[data-genre-item]");
    const boxes = element.querySelectorAll<HTMLElement>("[data-genre-box]");
    if (!list || !scope || !items.length || !boxes.length) return;

    const itemCache: { width: number; height: number }[] = [];
    const populate = () => {
      itemCache.length = 0;
      items.forEach((item, i) => {
        item.dataset.index = String(i);
        const { width, height } = item.getBoundingClientRect();
        itemCache.push({ width, height });
      });
    };
    populate();
    window.addEventListener("resize", populate);

    let listBounds: DOMRect | undefined;
    let startIndex = 0;
    let startWidth = 0;

    const setParallax = (e: PointerEvent) => {
      if (!listBounds) return;
      const { x, y, width, height } = listBounds;
      for (let b = 0; b < boxes.length; b++) {
        boxes[b].style.setProperty("--px", String((e.clientX - x) / width - 0.75));
        boxes[b].style.setProperty("--py", String((e.clientY - y) / height - 0.75));
      }
    };

    const onEnter = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName !== "LI") return;
      const index = Number.parseInt(target.dataset.index || "0", 10);
      const bounds = itemCache[index];
      if (!bounds) return;
      if (element.dataset.startSet !== "true") {
        startIndex = index;
        startWidth = bounds.width;
        element.dataset.startSet = "true";
        element.style.setProperty("--start-index", String(index));
        element.style.setProperty("--start-width", String(bounds.width));
      }
      scope.style.setProperty("--active-index", String(index - startIndex));
      scope.style.setProperty("--active-offset", String(bounds.width - startWidth));
      element.style.setProperty("--translate-speed", "0.2s");
      for (let b = 0; b < boxes.length; b++) {
        boxes[b].style.setProperty("--x", String(gsap.utils.random(-15, 15)));
        boxes[b].style.setProperty("--y", String(gsap.utils.random(-15, 15)));
        boxes[b].style.setProperty("--r", String(gsap.utils.random(-15, 15)));
      }
      listBounds = list.getBoundingClientRect();
      list.addEventListener("pointermove", setParallax, true);
    };

    const onLeave = async (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName !== "LI") return;
      const anims = boxes[0].getAnimations().filter((t) => (t as CSSTransition).transitionProperty === "scale");
      await Promise.allSettled(anims.map((a) => a.finished));
      if (anims.length && anims[0].playState === "finished" && getComputedStyle(boxes[0]).scale === "0") {
        element.dataset.startSet = "false";
        element.style.removeProperty("--start-index");
        element.style.removeProperty("--start-width");
        scope.style.removeProperty("--active-index");
        scope.style.removeProperty("--active-offset");
        element.style.removeProperty("--translate-speed");
        listBounds = undefined;
        list.removeEventListener("pointermove", setParallax, true);
      }
    };

    list.addEventListener("pointerenter", onEnter, true);
    list.addEventListener("pointerleave", onLeave, true);
    return () => {
      window.removeEventListener("resize", populate);
      list.removeEventListener("pointerenter", onEnter, true);
      list.removeEventListener("pointerleave", onLeave, true);
      list.removeEventListener("pointermove", setParallax, true);
    };
  }, [genres.length]);

  const stacks: BookclubGenreCover[][] =
    coverStacks && coverStacks.length > 0
      ? coverStacks
      : Array.from({ length: 4 }, (_, sIdx) =>
          genres.map((g) => ({ alt: `${g.label} cover ${sIdx + 1}` })),
        );

  return (
    <section ref={rootRef} id={id} data-rk-genre-showcase="" className={[styles.genre, className].filter(Boolean).join(" ")}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {showHandwrittenNote ? (
              <div className={styles.textWrap}>
                <div className={styles.textOuter}><p className={styles.handwrittenText}>{handwrittenNote}</p></div>
              </div>
            ) : null}
          </header>

          <div className={styles.listWrap}>
            <ul data-genre-list="" role="list" className={styles.list}>
              {genres.map((g) => (
                <li key={g.label} data-genre-item="" className={styles.listItem}>
                  <div className={[styles.link, g.hasWordBreak ? styles.wordBreak : ""].filter(Boolean).join(" ")}>
                    <span className={styles.linkDefault}>{g.label}</span>
                    <span className={styles.linkHover}>{g.label}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.holding}>
              <div data-genre-scope="" className={styles.scope}>
                {stacks.map((stack, sIdx) => (
                  <div key={sIdx} className={styles.holder}>
                    <div data-genre-box="" className={styles.box}>
                      {stack.map((cover, cIdx) =>
                        cover.src ? (
                          <img key={cIdx} src={cover.src} loading="lazy" width={408} height={629} alt={cover.alt} className={styles.img} />
                        ) : (
                          <svg key={cIdx} viewBox="0 0 272 419" fill="none" aria-hidden="true" className={styles.img}>
                            <rect width="272" height="419" fill={cIdx % 2 === 0 ? "var(--rk-bc-yellow)" : "var(--rk-bc-cyan)"} />
                            <rect x="28" y="34" width="216" height="351" rx="12" fill="var(--rk-bc-white)" opacity="0.28" />
                          </svg>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showPopup ? (
            <div className={styles.easterEgg}>
              <BookclubMascotPopup variant="right" title={popupTitle} ctaLabel={popupCtaLabel} ctaHref={popupCtaHref} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
