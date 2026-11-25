"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Controller, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import styles from "./styles.module.css";

export interface CollectionProductItem { id: string; name: string; price?: number; imageSrc: string; }
export interface CollectionSlideData {
  id: string; title: string; description: string; brandLogoSrc?: string;
  visualImageSrc: string; visualAlt: string; shopLabel?: string;
  learnMoreLabel?: string; learnMoreHref?: string; bags: CollectionProductItem[];
}
export interface CollectionSplitShowcaseProps {
  id?: string; heading?: string; viewAllLabel?: string; viewAllHref?: string;
  selectedIndex?: number; collections?: CollectionSlideData[];
  onViewAllClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onSelectProduct?: (product: CollectionProductItem, series: CollectionSlideData) => void;
  onLearnMoreClick?: (series: CollectionSlideData, event: MouseEvent<HTMLAnchorElement>) => void;
}

const ARROW_PATHS = {
  left: "M5.321 11.833c.941.947 2.776 2.652 4.115 3.897.53.493.972.905 1.23 1.147l-2.179 2.064c-1.39-1.918-5.56-6.024-7.97-7.842V8.133C2.928 6.313 7.096 2.207 8.49.29l2.178 2.064c-.5.476-1.205 1.134-1.951 1.827C7.45 5.36 6.019 6.696 5.32 7.397l-.635.639h16.638c.616 0 1.231-.077 1.825-.15.285-.036.574-.071.859-.098v3.653a24.275 24.275 0 0 1-.851-.097c-.602-.075-1.217-.152-1.833-.152H4.686l.635.64v.001Z",
  right: "M19.678 11.833c-.94.947-2.775 2.652-4.114 3.897-.53.493-.972.905-1.23 1.147l2.179 2.064c1.39-1.918 5.56-6.024 7.97-7.842V8.133c-2.41-1.82-6.578-5.926-7.972-7.844l-2.178 2.064c.5.476 1.205 1.134 1.951 1.827 1.265 1.18 2.697 2.516 3.395 3.217l.635.639H3.676c-.616 0-1.231-.077-1.825-.15a26.726 26.726 0 0 0-.859-.098v3.653c.285-.026.572-.061.851-.097.602-.075 1.217-.152 1.833-.152h16.638l-.636.64v.001Z",
};

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={ARROW_PATHS[dir]} fill="currentColor" />
    </svg>
  );
}

const DEFAULT_BAG_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 530"><rect x="76" y="74" width="268" height="370" rx="18" fill="whitesmoke" stroke="lightgray" stroke-width="4"/><rect x="76" y="255" width="268" height="92" fill="firebrick"/><text x="210" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="black">RESERVE</text></svg>',
  );

const DEFAULT_COLLECTIONS: CollectionSlideData[] = [
  {
    id: "limited-series",
    title: "Limited Series",
    description:
      "These represent the highest echelon of quality we source with partner farms every harvest. Each lot is grown in tiny quantities, making every release truly rare. Expect uncommon varieties, careful drying, and a vibrant cup. You owe it to yourself to brew one of these; it may shift how you taste coffee. Too bold? Not at all.",
    visualImageSrc: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&auto=format&fit=crop",
    visualAlt: "Misty mountain ridge above evergreens at dawn",
    bags: [
      { id: "lot-01", name: "Pacamara Reserve", price: 36, imageSrc: DEFAULT_BAG_SVG },
      { id: "lot-02", name: "Pink Bourbon", price: 34, imageSrc: DEFAULT_BAG_SVG },
      { id: "lot-03", name: "Limited Decaf", price: 32, imageSrc: DEFAULT_BAG_SVG },
      { id: "lot-04", name: "Gold Selection", price: 40, imageSrc: DEFAULT_BAG_SVG },
    ],
  },
  {
    id: "bright-series",
    title: "Bright Series",
    description:
      "Developed with bright aromatic flavors and crisp orchard fruit clarity in mind. Each light roast performs cleanly as filter or modern espresso, rewarding careful extraction with floral aromatics and a lively finish.",
    visualImageSrc: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop",
    visualAlt: "Sunlit forest path filtering golden light through tall trees",
    bags: [
      { id: "lot-05", name: "Solstice Washed", price: 27, imageSrc: DEFAULT_BAG_SVG },
      { id: "lot-06", name: "Kirinyaga AA", price: 28, imageSrc: DEFAULT_BAG_SVG },
      { id: "lot-07", name: "Tarrazu Honey", price: 26, imageSrc: DEFAULT_BAG_SVG },
      { id: "lot-08", name: "Cantaloupe Lot", price: 28, imageSrc: DEFAULT_BAG_SVG },
    ],
  },
];

export function CollectionSplitShowcase({
  id = "collections",
  heading = "Collections",
  viewAllLabel = "View all",
  viewAllHref = "#collections",
  selectedIndex,
  collections = DEFAULT_COLLECTIONS,
  onViewAllClick,
  onSelectProduct,
  onLearnMoreClick,
}: CollectionSplitShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualSwiperElRef = useRef<HTMLDivElement | null>(null);
  const detailsSwiperElRef = useRef<HTMLDivElement | null>(null);
  const mobileSwiperElRef = useRef<HTMLDivElement | null>(null);
  const productsWrapperRef = useRef<HTMLDivElement | null>(null);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevMobileBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextMobileBtnRef = useRef<HTMLButtonElement | null>(null);
  const visualSwiperRef = useRef<Swiper | null>(null);
  const mobileSwiperRef = useRef<Swiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex < collections.length) {
      visualSwiperRef.current?.slideTo(selectedIndex);
      mobileSwiperRef.current?.slideTo(selectedIndex);
      setActiveIndex(selectedIndex);
    }
  }, [selectedIndex, collections.length]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (!visualSwiperElRef.current || !detailsSwiperElRef.current || !productsWrapperRef.current) return;
        const detailsSwiper = new Swiper(detailsSwiperElRef.current, {
          modules: [EffectFade, Controller],
          speed: reducedMotion ? 0 : 600,
          effect: "fade",
          fadeEffect: { crossFade: true },
          allowTouchMove: false,
        });
        const visualSwiper = new Swiper(visualSwiperElRef.current, {
          modules: [Navigation, Controller],
          navigation: { nextEl: nextBtnRef.current, prevEl: prevBtnRef.current },
          speed: reducedMotion ? 0 : 600,
          grabCursor: true,
          controller: { control: detailsSwiper },
        });
        visualSwiperRef.current = visualSwiper;
        visualSwiper.on("slideChange", () => setActiveIndex(visualSwiper.activeIndex));
        const stDesktop = reducedMotion
          ? null
          : gsap.to(productsWrapperRef.current, {
              xPercent: -300 / 4,
              scrollTrigger: { trigger: productsWrapperRef.current, scrub: 2, start: "top 70%", end: "bottom 30%" },
            });
        return () => {
          detailsSwiper.destroy(true, false);
          visualSwiper.destroy(true, false);
          visualSwiperRef.current = null;
          stDesktop?.scrollTrigger?.kill();
          stDesktop?.kill();
        };
      });
      mm.add("(max-width: 1023px)", () => {
        if (!mobileSwiperElRef.current) return;
        const mobileSwiper = new Swiper(mobileSwiperElRef.current, {
          modules: [Navigation],
          navigation: { nextEl: nextMobileBtnRef.current, prevEl: prevMobileBtnRef.current },
          speed: reducedMotion ? 0 : 600,
          autoHeight: true,
        });
        mobileSwiperRef.current = mobileSwiper;
        mobileSwiper.on("slideChange", () => setActiveIndex(mobileSwiper.activeIndex));
        return () => {
          mobileSwiper.destroy(true, false);
          mobileSwiperRef.current = null;
        };
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [collections.length]);

  return (
    <section ref={sectionRef} id={id} className={styles.section} aria-label={heading}>
      <div className={styles.homeCollections}>
        <div className={`${styles.sliderHeader} ${styles.grid} ${styles.padX}`}>
          <h2 className={styles.headerTitle}>{heading}</h2>
          <a href={viewAllHref} className={styles.viewAll} onClick={onViewAllClick}>{viewAllLabel}</a>
          <div className={styles.sliderHeaderButtons}>
            <button ref={prevBtnRef} type="button" className={`${styles.swiperBtn} ${styles.prevBtn} ${activeIndex === 0 ? styles.swiperBtnDisabled : ""}`} aria-label="Slide left"><ArrowIcon dir="left" /></button>
            <button ref={nextBtnRef} type="button" className={`${styles.swiperBtn} ${styles.nextBtn} ${activeIndex >= collections.length - 1 ? styles.swiperBtnDisabled : ""}`} aria-label="Slide right"><ArrowIcon dir="right" /></button>
          </div>
        </div>

        <div className={`${styles.innerDesktop} ${styles.grid} ${styles.padX}`}>
          <div ref={visualSwiperElRef} className={`${styles.visuals} swiper`} aria-hidden="true">
            <div className="swiper-wrapper">
              {collections.map((series, idx) => (
                <div key={series.id} className={`swiper-slide ${styles.visualSlide} ${activeIndex === idx ? styles.slideActive : ""}`}>
                  {series.brandLogoSrc ? (
                    <img src={series.brandLogoSrc} className={styles.brandLogo} alt={series.title} />
                  ) : (
                    <div className={`${styles.brandLogo} ${styles.brandBadge}`}>{series.title}</div>
                  )}
                  <div className={styles.visualWrapper}>
                    <div className={styles.mediaInner}><img src={series.visualImageSrc} className={styles.visualImg} alt={series.visualAlt} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.infos}>
            <div className={styles.products}>
              <div ref={productsWrapperRef} className={styles.productsWrapper}>
                {collections.map((series, idx) => (
                  <div key={series.id} className={`${styles.productsLine} ${activeIndex === idx ? styles.productsLineActive : ""}`}>
                    {series.bags.map((bag) => (
                      <button key={bag.id} type="button" className={styles.productMedia} tabIndex={activeIndex === idx ? 0 : -1} onClick={() => onSelectProduct?.(bag, series)} title={bag.price ? `Select ${bag.name} ($${bag.price})` : bag.name}>
                        <img src={bag.imageSrc} alt={bag.name} />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div ref={detailsSwiperElRef} className={`${styles.details} swiper`}>
              <div className="swiper-wrapper">
                {collections.map((series, idx) => (
                  <div key={series.id} className={`swiper-slide ${styles.detailSlide} ${activeIndex === idx ? styles.slideActive : ""}`}>
                    <div className={styles.detailInner}>
                      <h3 className={styles.detailTitle}>{series.title}</h3>
                      <div className={styles.detailBody}><p>{series.description}</p></div>
                      <button type="button" className={`${styles.btn} ${styles.btnSolid}`} tabIndex={activeIndex === idx ? 0 : -1} onClick={() => series.bags[0] && onSelectProduct?.(series.bags[0], series)}>{series.shopLabel ?? "Shop"}</button>
                      <a href={series.learnMoreHref ?? "#mission"} className={`${styles.btn} ${styles.btnGhost}`} tabIndex={activeIndex === idx ? 0 : -1} onClick={(e) => onLearnMoreClick?.(series, e)}>{series.learnMoreLabel ?? "Learn More"}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.innerMobile}>
          <div className={styles.infos}>
            <div className={`${styles.mobileButtons} ${styles.padX}`}>
              <button ref={prevMobileBtnRef} type="button" className={`${styles.swiperBtn} ${activeIndex === 0 ? styles.swiperBtnDisabled : ""}`} aria-label="Previous slide"><ArrowIcon dir="left" /></button>
              <button ref={nextMobileBtnRef} type="button" className={`${styles.swiperBtn} ${activeIndex >= collections.length - 1 ? styles.swiperBtnDisabled : ""}`} aria-label="Next slide"><ArrowIcon dir="right" /></button>
            </div>
            <div ref={mobileSwiperElRef} className={`${styles.details} swiper`}>
              <div className="swiper-wrapper">
                {collections.map((series, idx) => (
                  <div key={series.id} className={`swiper-slide ${styles.padX} ${styles.detailSlide} ${activeIndex === idx ? styles.slideActive : ""}`}>
                    <div className={styles.mobileVisualWrapper}>
                      <div className={styles.mediaInner}><img src={series.visualImageSrc} className={styles.visualImg} alt={series.visualAlt} /></div>
                    </div>
                    <div className={styles.detailInner}>
                      <h3 className={styles.detailTitle}>{series.title}</h3>
                      <div className={styles.detailBody}><p>{series.description}</p></div>
                      <button type="button" className={`${styles.btn} ${styles.btnSolid}`} onClick={() => series.bags[0] && onSelectProduct?.(series.bags[0], series)}>{series.shopLabel ?? "Shop"}</button>
                      <a href={series.learnMoreHref ?? "#mission"} className={`${styles.btn} ${styles.btnGhost}`} onClick={(e) => onLearnMoreClick?.(series, e)}>{series.learnMoreLabel ?? "Learn More"}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
