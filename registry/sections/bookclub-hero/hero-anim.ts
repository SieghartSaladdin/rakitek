import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function runBookclubHeroIntro(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const bg = root.querySelector<HTMLElement>("[data-hero-bg]");
  const title = root.querySelector<HTMLElement>("[data-hero-title]");
  const paragraph = root.querySelector<HTMLElement>("[data-hero-paragraph]");
  const cta = root.querySelector<HTMLElement>("[data-hero-cta]");
  const handwritten = root.querySelector<HTMLElement>("[data-hero-handwritten]");
  const easterEgg = root.querySelector<HTMLElement>("[data-hero-easter-egg]");
  const sequence = root.querySelector<HTMLElement>("[data-hero-sequence]");
  const bgPaths = bg?.querySelectorAll("path");

  let titleSplit: SplitText | null = null;
  let textSplit: SplitText | null = null;

  const tl = gsap.timeline();
  const mm = gsap.matchMedia();

  if (bg && window.matchMedia("(min-width: 992px)").matches) {
    tl.set(bg, { clipPath: "ellipse(20% 0% at 100% 100%)" });
    tl.to(bg, { clipPath: "ellipse(150% 130% at 100% 100%)", duration: 0.9, ease: "circ.out" }, 0);
  }

  if (title) {
    titleSplit = new SplitText(title, { type: "words", tag: "span" });
    tl.set(titleSplit.words, {
      willChange: "transform",
      display: "inline-block",
      transformOrigin: "top left",
      yPercent: -10,
      xPercent: 40,
      scaleY: 0.1,
      scaleX: 0.85,
      rotate: 8,
      opacity: 0,
    }, 0);
    tl.to(titleSplit.words, {
      keyframes: {
        "0%": { yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 },
        "10%": { opacity: 1 },
        "100%": { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, rotate: 0, ease: "elastic.out(1,0.72)" },
      },
      duration: 0.85,
      stagger: 0.08,
      delay: 0.1,
    }, 0);
  }

  if (paragraph) {
    tl.fromTo(paragraph, { opacity: 0, y: "-0.75em" }, { opacity: 1, y: "0em", duration: 0.35, delay: 0.25 }, 0);
  }
  if (cta) {
    tl.fromTo(cta, { opacity: 0, y: "-0.75em" }, { opacity: 1, y: "0em", duration: 0.35, delay: 0.32 }, 0);
  }
  if (handwritten) {
    textSplit = new SplitText(handwritten, { type: "words, chars", tag: "span" });
    tl.set(textSplit.words, { display: "inline-block" }, 0);
    tl.fromTo(
      textSplit.chars,
      { display: "inline-block", opacity: 0, rotate: 22, x: "-0.25em", y: "0.5em" },
      { opacity: 1, rotate: 0, x: "0em", y: "0em", ease: "elastic.out(1, 0.75)", duration: 0.7, delay: 0.28, stagger: 0.014 },
      0,
    );
  }
  if (easterEgg) {
    tl.fromTo(easterEgg, { opacity: 0 }, { opacity: 1, duration: 0.35, delay: 0.28 }, 0);
  }
  if (sequence) {
    tl.fromTo(sequence, { opacity: 0, scale: 1.12, rotate: 4 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.8, delay: 0.3, ease: "expo.out" }, 0);
  }

  if (bgPaths?.length) {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(bgPaths, { attr: { "stroke-width": 0 }, rotate: 0, transformOrigin: "center center", transformBox: "fill-box" });
      const bgTl = gsap
        .timeline({ repeat: -1 })
        .to(bgPaths, { attr: { "stroke-width": 35 }, rotate: 2, duration: 3, ease: "sine.inOut" })
        .to(bgPaths, { attr: { "stroke-width": 0 }, rotate: 0, duration: 3, ease: "sine.inOut" });
      return () => bgTl.kill();
    });
  }

  return () => {
    tl.kill();
    mm.revert();
    titleSplit?.revert();
    textSplit?.revert();
  };
}
