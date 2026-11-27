import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface StackStyleClasses {
  sideLeft: string;
  sideRight: string;
  cards: string;
  stage: string;
  cardStack: string;
  mediaImg: string;
}

export function initProposalStackMotion(root: HTMLElement, s: StackStyleClasses) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      const drift = (sel: string, from: number, to: number) => {
        const el = root.querySelector(sel);
        if (!el) return;
        gsap.fromTo(
          el,
          { y: from },
          {
            y: to,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      };
      drift(`.${s.sideLeft}`, -110, 110);
      drift(`.${s.sideRight}`, 110, -110);
    });

    mm.add("(min-width: 481px)", () => {
      const wrap = root.querySelector<HTMLElement>(`.${s.cards}`);
      const stage = root.querySelector<HTMLElement>(`.${s.stage}`);
      const stack = Array.from(root.querySelectorAll<HTMLElement>(`.${s.cardStack}`));
      if (!wrap || !stage || stack.length < 2) return;
      const offscreen = () => {
        const h = stack[0].offsetHeight || 1;
        return ((window.innerHeight + h) / 2 / h) * 100 + 2;
      };
      const img = (card: HTMLElement) => card.querySelector<HTMLElement>(`.${s.mediaImg}`);
      stack.forEach((card, i) => {
        gsap.set(card, {
          zIndex: stack.length - i,
          yPercent: i === 0 ? 0 : offscreen(),
          autoAlpha: i <= 1 ? 1 : 0,
          scale: 1,
          rotationZ: 0,
          rotationX: 0,
          xPercent: 0,
          "--card-shade": 0,
        });
      });
      const firstImg = img(stack[0]);
      if (firstImg) {
        gsap.fromTo(
          firstImg,
          { yPercent: -10 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "top top", scrub: true } },
        );
      }
      const tl = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${(stack.length - 1) * window.innerHeight}`,
          scrub: true,
          pin: stage,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });
      stack.slice(0, -1).forEach((card, i) => {
        const next = stack[i + 1];
        const nextImg = img(next);
        tl.set(next, { zIndex: stack.length + i + 1 }, i)
          .set(next, { autoAlpha: 1 }, i)
          .fromTo(next, { yPercent: () => offscreen() }, { yPercent: 0 }, i)
          .to(
            card,
            { scale: 0.85, rotationZ: -3.8, rotationX: 8, xPercent: -0.8, yPercent: 0, "--card-shade": 0.26 },
            i,
          );
        if (nextImg) tl.fromTo(nextImg, { yPercent: -10 }, { yPercent: 0 }, i);
      });
    });
  }, root);

  return ctx;
}
