"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import styles from "./styles.module.css";

export interface DestinationCarouselSlide {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface ParallaxDestinationCarouselProps {
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  slides?: DestinationCarouselSlide[];
  onSlideClick?: (slide: DestinationCarouselSlide, event: MouseEvent<HTMLAnchorElement>) => void;
  onViewAllClick?: (event: MouseEvent<HTMLElement>) => void;
}

const PARALLAX_X = 250;

const DEFAULT_SLIDES: DestinationCarouselSlide[] = [
  { id: "afrique", title: "Africa", href: "#africa", imageSrc: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1000&q=75&auto=format&fit=crop", imageAlt: "Savanna wildlife" },
  { id: "asie", title: "Asia", href: "#asia", imageSrc: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=75&auto=format&fit=crop", imageAlt: "Historic pagoda" },
  { id: "caraibes", title: "Central America & Caribbean", href: "#caribbean", imageSrc: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1000&q=75&auto=format&fit=crop", imageAlt: "Turquoise coastline" },
  { id: "amerique-nord", title: "North America", href: "#north-america", imageSrc: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1000&q=75&auto=format&fit=crop", imageAlt: "Alpine lake" },
  { id: "amerique-sud", title: "South America", href: "#south-america", imageSrc: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&q=75&auto=format&fit=crop", imageAlt: "Andean mountains" },
  { id: "europe", title: "Europe & Mediterranean", href: "#europe", imageSrc: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=75&auto=format&fit=crop", imageAlt: "Mediterranean cliffs" },
];

export function ParallaxDestinationCarousel({
  title = "Destinations",
  viewAllLabel = "View all",
  viewAllHref = "#destinations",
  slides = DEFAULT_SLIDES,
  onSlideClick,
  onViewAllClick,
}: ParallaxDestinationCarouselProps) {
  const swiperElRef = useRef<HTMLDivElement | null>(null);
  const prevWrapRef = useRef<HTMLSpanElement | null>(null);
  const nextWrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const container = swiperElRef.current;
    if (!container) return;

    const prevEl = prevWrapRef.current?.querySelector("button") ?? null;
    const nextEl = nextWrapRef.current?.querySelector("button") ?? null;

    const parallaxInners = Array.from(
      container.querySelectorAll<HTMLElement>("[data-parallax-inner]"),
    );
    parallaxInners.forEach((inner) => {
      gsap.set(inner, {
        width: `calc(100% + ${PARALLAX_X}px)`,
        left: -PARALLAX_X,
      });
    });

    const swiper = new Swiper(container, {
      modules: [Navigation],
      speed: 1000,
      slidesPerView: 1.2,
      spaceBetween: 10,
      slidesOffsetAfter: 10,
      slidesOffsetBefore: 10,
      navigation: { prevEl, nextEl },
      breakpoints: {
        575: { spaceBetween: 15, slidesOffsetAfter: 15, slidesOffsetBefore: 15 },
        650: { slidesPerView: 1.75, spaceBetween: 15, slidesOffsetAfter: 15, slidesOffsetBefore: 15 },
        750: { slidesPerView: 1.75, spaceBetween: 20, slidesOffsetAfter: 20, slidesOffsetBefore: 20 },
        768: { slidesPerView: 1.75, spaceBetween: 15, slidesOffsetAfter: 15, slidesOffsetBefore: 15 },
        900: { slidesPerView: 2.5, spaceBetween: 15, slidesOffsetAfter: 15, slidesOffsetBefore: 15 },
        1175: { slidesPerView: 2.5, spaceBetween: 20, slidesOffsetAfter: 20, slidesOffsetBefore: 20 },
        1440: { slidesPerView: 3.2, spaceBetween: 20, slidesOffsetAfter: 25, slidesOffsetBefore: 25 },
        1750: { slidesPerView: 3.2, spaceBetween: 25, slidesOffsetAfter: 30, slidesOffsetBefore: 30 },
        2075: { slidesPerView: 3.5, spaceBetween: 30, slidesOffsetAfter: 35, slidesOffsetBefore: 35 },
      },
    });

    const updateParallax = () => {
      const vw = document.documentElement.clientWidth || 1440;
      swiper.slides.forEach((slide) => {
        const host = slide.querySelector<HTMLElement>("[data-parallax-host]");
        const inner = slide.querySelector<HTMLElement>("[data-parallax-inner]");
        if (!host || !inner) return;
        const leftRatio = slide.getBoundingClientRect().left / vw;
        const widthDistance = host.getBoundingClientRect().width / vw;
        const rawProgress = gsap.utils.mapRange(1, -widthDistance, 0, 1, leftRatio);
        const progress = gsap.utils.clamp(0, 1, rawProgress);
        gsap.set(inner, { x: PARALLAX_X * progress });
      });
    };

    updateParallax();
    swiper.on("afterInit", updateParallax);
    swiper.on("resize", updateParallax);
    swiper.on("sliderMove", updateParallax);
    const onStart = () => gsap.ticker.add(updateParallax);
    const onEnd = () => {
      gsap.ticker.remove(updateParallax);
      updateParallax();
    };
    swiper.on("transitionStart", onStart);
    swiper.on("transitionEnd", onEnd);

    return () => {
      gsap.ticker.remove(updateParallax);
      swiper.destroy(true, true);
    };
  }, [slides]);

  return (
    <div className={styles.blueBg}>
      <section className={styles.carrousel}>
        <div ref={swiperElRef} className={`${styles.inner} swiper`}>
          <div className={styles.top}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.nav}>
              <div className={styles.ctas}>
                <RollingCtaButton
                  href={viewAllHref}
                  label={viewAllLabel}
                  variant="primary"
                  minWide
                  onClick={(e) => {
                    if (viewAllHref.startsWith("#")) e.preventDefault();
                    onViewAllClick?.(e);
                  }}
                />
              </div>
              <span ref={prevWrapRef} className={styles.arrowWrap}>
                <RollingCtaButton
                  isArrow
                  direction="left"
                  arrowSize="lg"
                  ariaLabel="Previous destination"
                  data-carousel-arrow="left"
                />
              </span>
              <span ref={nextWrapRef} className={styles.arrowWrap}>
                <RollingCtaButton
                  isArrow
                  direction="right"
                  arrowSize="lg"
                  ariaLabel="Next destination"
                  data-carousel-arrow="right"
                />
              </span>
            </div>
          </div>

          <div className={`${styles.swiperWrapper} swiper-wrapper`}>
            {slides.map((slide) => (
              <div key={slide.id} className={`${styles.slide} swiper-slide`}>
                <a
                  href={slide.href}
                  className={styles.slideLink}
                  onClick={(e) => {
                    if (slide.href.startsWith("#")) e.preventDefault();
                    onSlideClick?.(slide, e);
                  }}
                >
                  <div className={styles.slideImg}>
                    <div className={styles.horizontalParallax} data-parallax-host>
                      <div className={styles.parallaxInner} data-parallax-inner>
                        <img
                          src={slide.imageSrc}
                          alt={slide.imageAlt ?? slide.title}
                          decoding="async"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                  <h5 className={styles.slideTitle}>{slide.title}</h5>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
