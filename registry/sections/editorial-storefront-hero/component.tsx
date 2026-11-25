"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface HeroProductSpec {
  id: string;
  title: string;
  price: string;
  type: string;
  origin: string;
  process: string;
  href?: string;
}

export interface EditorialStorefrontHeroProps {
  taglineWords?: string[];
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  moodHeading?: string;
  moodIcon?: ReactNode;
  marqueeText?: string;
  backgroundImage?: string;
  backgroundAlt?: string;
  products?: HeroProductSpec[];
  specLabels?: { type: string; origin: string; process: string };
  onProductClick?: (product: HeroProductSpec, event: MouseEvent<HTMLAnchorElement>) => void;
}

const DEFAULT_PRODUCTS: HeroProductSpec[] = [
  { id: "p1", title: "Nocturne", price: "$24.00", type: "Espresso", origin: "Brazil, Ethiopia", process: "Natural" },
  { id: "p2", title: "Solstice", price: "$27.00", type: "Filter", origin: "Kenya", process: "Washed" },
  { id: "p3", title: "Altitude", price: "$32.00", type: "Micro-Lot", origin: "Colombia", process: "Anaerobic" },
];

function ArrowUpIcon() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
      <path d="M12.473 5.054c.947.94 2.652 2.776 3.897 4.114.493.53.905.973 1.147 1.23l2.064-2.178c-1.918-1.391-6.024-5.562-7.842-7.97H8.773C6.953 2.659 2.847 6.827.93 8.221L2.993 10.4c.476-.5 1.134-1.205 1.827-1.95C6 7.182 7.336 5.75 8.037 5.053l.639-.636v16.638c0 .617-.077 1.231-.15 1.825a26.73 26.73 0 0 0-.098.859h3.653a24.516 24.516 0 0 0-.097-.851c-.075-.602-.152-1.216-.152-1.833V4.418l.64.636h.001Z" fill="currentColor" />
    </svg>
  );
}

function MugIcon() {
  return (
    <svg width="57" height="69" viewBox="0 0 57 69" fill="none" aria-hidden="true">
      <path d="M52.296 50.322v1.428a6.8 6.8 0 0 1-6.585 6.782 16.954 16.954 0 0 1-5.569 7.853h5.372a1.071 1.071 0 0 1 0 2.142H14.103a1.071 1.071 0 0 1 0-2.142h5.372a16.83 16.83 0 0 1-6.443-13.207V44.61a1.07 1.07 0 0 1 1.071-1.07h31.411a6.782 6.782 0 0 1 6.782 6.781Zm-8.424 6.907c0-.035.018-.071.018-.107.365-1.283.551-2.61.553-3.944v-7.496h-29.27v7.496a14.688 14.688 0 0 0 8.336 13.207h12.6a14.706 14.706 0 0 0 7.763-9.156Zm6.283-6.907a4.64 4.64 0 0 0-3.57-4.515v7.37a16.575 16.575 0 0 1-.303 3.142 4.622 4.622 0 0 0 3.873-4.569v-1.428Z" fill="currentColor" />
      <mask id="rk-hero-mug-mask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="57" height="44">
        <path fill="white" d="M0 0h56.878v43.824H0z" />
      </mask>
      <g mask="url(#rk-hero-mug-mask)">
        <path d="M34.528 50.523c.071-8.397-2.765-15.407-2.918-15.714-.735.276-1.471.46-2.207.46h-.46c-1.379 1.104-3.218 1.655-5.333 1.655-3.127 0-6.897-1.195-10.391-3.678-3.035-2.115-5.426-4.874-6.713-7.725-1.287-3.124-1.196-5.881.184-7.998.827-1.196 2.115-2.023 3.586-2.483-.46-3.586.46-6.713 2.85-8.368 3.126-2.115 7.632-1.012 11.586 2.39 1.563-1.655 3.402-2.482 5.333-2.482 2.483.092 4.782 1.655 6.438 4.598 1.563 2.758 2.298 6.253 2.206 10.023-.184 5.701-2.39 10.483-5.425 12.69l.092.092c.184.368 3.127 7.633 3.035 16.553l-1.864-.014h.001ZM16.805 7.5c-.92 0-1.839.276-2.575.736-1.471 1.011-2.115 2.85-2.115 5.057 0 .46 0 .92.092 1.38 2.667-.276 5.794.46 8.92 2.115.46-2.3 1.288-4.322 2.391-5.978.092-.091.092-.183.184-.183-2.39-2.023-4.874-3.127-6.897-3.127Zm20.047 13.61c.092-3.403-.552-6.621-1.931-9.012-1.288-2.299-3.035-3.586-4.874-3.586h-.092c-1.287 0-2.667.643-3.77 1.839-.368.46-.736.92-1.104 1.471v.092c-.735 1.196-1.379 2.483-1.747 3.954-.184.644-.368 1.288-.46 1.931l.828.552c2.943 2.023 5.242 4.69 6.529 7.357l.184.367c.368.828.644 1.564.736 2.3.367 1.747.183 3.402-.46 4.781 3.218-1.011 5.977-6.069 6.16-12.046ZM8.253 24.605c1.104 2.575 3.31 5.058 6.07 6.989 4.23 2.943 9.103 3.954 12.138 2.759a5.313 5.313 0 0 0 1.839-1.196c.092-.092.184-.276.276-.368.46-.735.735-1.655.735-2.666 0-.736-.091-1.472-.367-2.207a6.387 6.387 0 0 0-.46-1.196c-1.104-2.575-3.31-5.057-6.07-6.989-.551-.367-1.195-.735-1.747-1.103-2.574-1.471-5.333-2.207-7.54-2.207h-.736c-.643 0-1.287.184-1.839.368-1.011.368-1.84.92-2.39 1.747-1.012 1.563-1.012 3.678.091 6.07Z" fill="currentColor" />
      </g>
    </svg>
  );
}

export function EditorialStorefrontHero({
  taglineWords = ["Go", "Against", "the", "Grain"],
  description = "Small-batch specialty coffee roasted for clarity, sweetness, and daily ritual.",
  ctaLabel = "Shop Now",
  ctaHref = "#collections",
  moodHeading = "A small-batch specialty coffee company",
  moodIcon,
  marqueeText = "new * Fresh off the tree * New",
  backgroundImage,
  backgroundAlt = "",
  products = DEFAULT_PRODUCTS,
  specLabels = { type: "Type:", origin: "Origin:", process: "Process:" },
  onProductClick,
}: EditorialStorefrontHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const btnWrapperRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-anim-lines]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lines.forEach((el) => el.classList.add(styles.linesActive));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const chars = Array.from(root.querySelectorAll<HTMLElement>("[data-char]"));
      let xIndex = 0;
      let yIndex = 0;
      root.querySelectorAll<HTMLElement>("[data-word]").forEach((word, wIdx) => {
        let animI = wIdx % 2 ? 1 : 0;
        Array.from(word.children).forEach((node, subIdx) => {
          const opts: gsap.TweenVars = { opacity: 0 };
          if ((subIdx + animI) % 3 === 0) opts.xPercent = xIndex++ % 2 ? 50 : -50;
          else if (animI % 2 === 0) opts.yPercent = yIndex++ % 2 ? -70 : 70;
          (node as HTMLElement).dataset.stagger = String(gsap.utils.random(0.1, 0.6));
          gsap.set(node, opts);
          animI++;
        });
      });
      const stagger = (_i: number, el: Element) => parseFloat((el as HTMLElement).dataset.stagger ?? "0.2");
      const tl = gsap.timeline({ delay: 0.2, scrollTrigger: { trigger: root, once: true } });
      tl.to(chars, { xPercent: 0, yPercent: 0, ease: "expo.out", duration: 1.4, stagger }, 0);
      tl.to(chars, { opacity: 1, ease: "expo.out", duration: 0.8, stagger }, 0);
      lines.forEach((el) =>
        ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => el.classList.add(styles.linesActive) }),
      );

      const img = imgInnerRef.current;
      const wrapper = wrapperRef.current;
      const btn = btnRef.current;
      const btnWrapper = btnWrapperRef.current;
      const desc = descRef.current;
      if (!img || !wrapper || !btn || !btnWrapper || !desc) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (orientation: landscape)", () => {
        gsap.set([btn, desc], { y: 40, opacity: 0 });
        gsap.to(img, { scale: 1, ease: "power2.inOut", duration: 1.4, scrollTrigger: { trigger: img } });
        gsap.to(btn, { y: 0, opacity: 1, ease: "power2.out", duration: 0.6, delay: 0.8, scrollTrigger: { trigger: btn } });
        gsap.to(img, { yPercent: 25, scrollTrigger: { trigger: wrapper, scrub: true, start: "top top", end: "bottom top" } });
        gsap.to(btnWrapper, {
          scale: 1,
          scrollTrigger: {
            trigger: wrapper,
            pin: btnWrapper,
            scrub: 1,
            start: "top top",
            end: () => {
              const dist =
                desc.getBoundingClientRect().bottom - btn.getBoundingClientRect().bottom + desc.offsetHeight - 20;
              return `+=${Math.max(120, dist)}`;
            },
            invalidateOnRefresh: true,
          },
        });
        gsap.to(desc, { y: 0, opacity: 1, ease: "power2.out", duration: 0.6, scrollTrigger: { trigger: desc, start: "top 80%" } });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.to(img, { scale: 1, ease: "power2.inOut", duration: 1.4, scrollTrigger: { trigger: img } });
        gsap.to(img, { yPercent: 18, scrollTrigger: { trigger: wrapper, scrub: true, start: "top top", end: "bottom top" } });
      });
    }, root);
    return () => ctx.revert();
  }, [taglineWords]);

  return (
    <section ref={rootRef} className={styles.hero}>
      <div ref={wrapperRef} className={styles.wrapper}>
        <div className={styles.media}>
          <div ref={imgInnerRef} className={styles.mediaInner}>
            {backgroundImage ? <img src={backgroundImage} alt={backgroundAlt} className={styles.mediaImg} /> : null}
          </div>
        </div>

        <h1 className={styles.srOnly}>{taglineWords.join(" ")}</h1>
        <div className={styles.grid}>
          <div className={styles.tagline} aria-hidden="true">
            {taglineWords.map((word, wIdx) => (
              <div key={`${word}-${wIdx}`} className={styles.taglineLine}>
                <span data-word="" className={styles.word}>
                  {Array.from(word).map((ch, cIdx) => (
                    <span key={cIdx} data-char="" className={styles.char}>
                      {ch}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          <p className={styles.srOnly}>{description}</p>
          <div ref={descRef} data-anim-lines="" className={`${styles.desc} ${styles.lines}`} aria-hidden="true">
            <div>{description}</div>
          </div>
        </div>

        <div ref={btnWrapperRef} className={styles.btnWrapper}>
          <a ref={btnRef} href={ctaHref} className={styles.btn}>
            {ctaLabel}
          </a>
        </div>

        <div className={styles.push}>
          <div className={`${styles.mood} ${styles.block}`}>
            <h2 className={styles.srOnly}>{moodHeading}</h2>
            <div data-anim-lines="" className={`${styles.moodHeading} ${styles.lines}`} aria-hidden="true">
              {moodHeading}
            </div>
            {moodIcon ?? <MugIcon />}
          </div>

          <div className={styles.products}>
            <ul className={styles.list}>
              {products.slice(0, 3).map((product) => (
                <li key={product.id} className={`${styles.product} ${styles.block}`}>
                  <a
                    href={product.href ?? "#"}
                    className={styles.productLink}
                    onClick={onProductClick ? (e) => onProductClick(product, e) : undefined}
                  >
                    <div className={styles.infos}>
                      <h3 className={styles.productTitle}>{product.title}</h3>
                      <p className={styles.productPrice}>{product.price}</p>
                    </div>
                    <table className={styles.spec}>
                      <tbody>
                        <tr><td>{specLabels.type}</td><td className={styles.bold}>{product.type}</td></tr>
                        <tr><td>{specLabels.origin}</td><td className={styles.bold}>{product.origin}</td></tr>
                        <tr><td>{specLabels.process}</td><td className={styles.bold}>{product.process}</td></tr>
                      </tbody>
                    </table>
                  </a>
                </li>
              ))}
            </ul>

            <div className={`${styles.ticker} ${styles.block}`} aria-hidden="true">
              <div>
                {Array.from({ length: 5 }).map((_, i) => <ArrowUpIcon key={`a-${i}`} />)}
                <p className={styles.tickerText}>{marqueeText}</p>
                {Array.from({ length: 5 }).map((_, i) => <ArrowUpIcon key={`b-${i}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
