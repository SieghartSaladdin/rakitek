"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BookclubSliderControls } from "@registry/ui/bookclub-slider-controls/component";
import { DEFAULT_BOOKS, DefaultBookCover } from "./defaults";
import { BookclubParallaxSlider } from "./parallax-slider";
import styles from "./styles.module.css";

export interface BookclubTag {
  label: string;
  bgColor: string;
  textColor?: "black" | "white";
}

export interface BookclubBookItem {
  id: string;
  title: string;
  description: string;
  coverSrc?: string;
  coverAlt?: string;
  cardColor: string;
  textTone?: "light" | "dark";
  href?: string;
  external?: boolean;
  tags: BookclubTag[];
}

export interface BookclubBooksCarouselProps {
  id?: string;
  title?: string;
  subtitle?: string;
  handwrittenNote?: string;
  showHandwrittenNote?: boolean;
  readMoreLabel?: string;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
  showControls?: boolean;
  books?: BookclubBookItem[];
  className?: string;
}

export function BookclubBooksCarousel({
  id = "books",
  title = "Our Nov books",
  subtitle = "We drop new books on the 1st of every month. Call us creatures of habit.",
  handwrittenNote = "Discover hidden gems and buzzy new releases",
  showHandwrittenNote = true,
  readMoreLabel = "Read more",
  prevAriaLabel = "Previous Slide",
  nextAriaLabel = "Next Slide",
  showControls = true,
  books = DEFAULT_BOOKS,
  className = "",
}: BookclubBooksCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<BookclubParallaxSlider | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let rafId = 0;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 992px)", () => {
      const slider = new BookclubParallaxSlider(
        wrapper,
        { infinite: false, snap: false, dragSensitivity: 0.008, lerpFactor: 0.225, scrollSensitivity: 1, bounceLimit: 0.5, setOffset: ({ wrapperWidth }: { wrapperWidth: number }) => wrapperWidth - 32 },
        (p, n) => { setCanPrev(p); setCanNext(n); },
      );
      sliderRef.current = slider;
      const tick = () => {
        slider.update();
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(rafId);
        slider.destroy();
        sliderRef.current = null;
      };
    });
    return () => {
      cancelAnimationFrame(rafId);
      mm.revert();
    };
  }, [books.length]);

  return (
    <section id={id} data-rk-books-carousel="" className={[styles.books, className].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.paragraph}>{subtitle}</p>
            </div>
          </div>
          {showHandwrittenNote ? (
            <div className={styles.textWrap}>
              <div className={styles.textOuter}>
                <p className={styles.handwrittenText}>{handwrittenNote}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.slider}>
          {showControls ? (
            <BookclubSliderControls
              variant="home"
              canPrev={canPrev}
              canNext={canNext}
              prevAriaLabel={prevAriaLabel}
              nextAriaLabel={nextAriaLabel}
              onPrev={() => sliderRef.current?.goToPrev()}
              onNext={() => sliderRef.current?.goToNext()}
            />
          ) : null}
          <div ref={wrapperRef} role="list" className={styles.list}>
            {books.map((book) => {
              const fgColor = book.textTone === "dark" ? "var(--rk-bc-black, var(--rk-fg))" : "var(--rk-bc-white, var(--rk-bg))";
              return (
                <div key={book.id} role="listitem" className={styles.listItem}>
                  <article data-books-slider-item="" className={styles.item}>
                    <div className={styles.itemInner}>
                      <div style={{ backgroundColor: book.cardColor }} className={styles.itemBg}>
                        <div style={{ color: book.cardColor }} className={styles.itemBgEars} aria-hidden="true">
                          <svg viewBox="0 0 44 45" fill="none" className={styles.leftEar}>
                            <path fill="currentColor" d="M1.335.198c.671-.316 1.5-.254 2.186.187C27.678 16.847 39.839 36.953 44 45h-6.048c-2.382-1.604-6.964-3.674-15.652-4.814C2.999 37.666-.665 14.174.09 2.04.152 1.28.589.515 1.335.198Z" />
                          </svg>
                          <svg viewBox="0 0 29 80" fill="none" className={styles.rightEar}>
                            <path fill="currentColor" d="M19.388.879c.667-.771 1.647-1.018 2.559-.807.912.21 1.682.956 1.926 1.861C34.595 38.09 25.79 69.237 21.823 80h-4.188c-.17-4.22-2.739-13.318-10.975-22.064-8.493-9.099-8.88-21.913-1.063-37.23C11.221 9.603 19.091 1.266 19.388.879Z" />
                          </svg>
                        </div>
                        <div style={{ backgroundColor: book.cardColor }} className={styles.itemBgBottom} />
                        <div className={styles.itemCta}>
                          <div className={styles.ctaPill}>
                            <span className={styles.ctaTextWrap}>
                              <span className={styles.ctaBg} />
                              <span className={styles.ctaTextOuter}><span className={styles.ctaText}>{readMoreLabel}</span></span>
                            </span>
                            <span className={styles.ctaIconWrap}>
                              <span className={styles.ctaBg} />
                              <span className={styles.ctaIconOuter}>
                                <svg viewBox="0 0 14 13" fill="none" aria-hidden="true" className={styles.ctaArrow}>
                                  <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
                                </svg>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.itemContainer}>
                        <div className={styles.itemCover}>
                          {book.coverSrc ? (
                            <img src={book.coverSrc} loading="lazy" alt={book.coverAlt ?? book.title} className={styles.itemImg} />
                          ) : (
                            <DefaultBookCover title={book.title} />
                          )}
                        </div>
                        <div className={styles.itemContent}>
                          <div className={styles.itemText}>
                            <h3 style={{ color: fgColor }} className={styles.itemTitle}>{book.title}</h3>
                            <p style={{ color: fgColor }} className={styles.itemDesc}>{book.description}</p>
                          </div>
                          <ul role="list" className={styles.genreList}>
                            {book.tags.map((tag) => (
                              <li key={tag.label}>
                                <span
                                  style={{
                                    backgroundColor: tag.bgColor,
                                    color: tag.textColor === "white" ? "var(--rk-bc-white, var(--rk-bg))" : "var(--rk-bc-black, var(--rk-fg))",
                                  }}
                                  className={styles.tagSmall}
                                >
                                  <span className={styles.tagSmallText}>{tag.label}</span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {book.href ? (
                        <a
                          aria-label={`${readMoreLabel}: ${book.title}`}
                          href={book.href}
                          target={book.external ? "_blank" : undefined}
                          rel={book.external ? "noopener noreferrer" : undefined}
                          className={styles.itemLink}
                        />
                      ) : null}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
