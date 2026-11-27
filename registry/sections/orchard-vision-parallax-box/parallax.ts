import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scrubbed yPercent drift for an oversized image inside a clipped box. The range is clamped so the
 * image never uncovers the box edges.
 */
export function initClampedParallax(
  el: HTMLElement,
  container: HTMLElement,
  { from = -10, to = 10 }: { from?: number; to?: number } = {},
): (() => void) | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  gsap.registerPlugin(ScrollTrigger);
  const clamp = (value: number) => {
    const parent = el.offsetParent instanceof HTMLElement ? el.offsetParent : container;
    const h = el.offsetHeight;
    if (!h) return value;
    const top = -el.offsetTop - 1;
    const bottom = el.offsetTop + h - parent.clientHeight - 1;
    const min = (-Math.max(bottom, 0) / h) * 100;
    const max = (Math.max(top, 0) / h) * 100;
    return Math.min(Math.max(value, min), max);
  };
  const ctx = gsap.context(() => {
    gsap.fromTo(
      el,
      { yPercent: () => clamp(from) },
      {
        yPercent: () => clamp(to),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
  return () => ctx.revert();
}
