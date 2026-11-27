import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function initBoxScrollSequence(
  wrap: HTMLElement,
  opts: { sequenceBaseUrl?: string; mobileSequenceBaseUrl?: string; frames: number; digits: number },
): () => void {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  let isDestroyed = false;
  const element = wrap.querySelector<HTMLElement>("[data-box-sequence-element]");
  const canvas = wrap.querySelector<HTMLCanvasElement>("[data-box-sequence-canvas]");
  const text = wrap.querySelector<HTMLElement>("[data-box-sequence-handwritten-text]");
  const title = wrap.querySelector<HTMLElement>("[data-box-sequence-title]");
  const finalText = wrap.querySelector<HTMLElement>("[data-box-sequence-text-final]");
  const buttons = wrap.querySelectorAll<HTMLElement>("[data-box-sequence-button]");
  const isShort = wrap.hasAttribute("data-box-sequence-short");

  const loaded = new Map<number, HTMLImageElement>();
  let lastProgress = 0;
  let st: ScrollTrigger | null = null;
  const mm = gsap.matchMedia();

  if (element && canvas && opts.sequenceBaseUrl) {
    const ctx = canvas.getContext("2d");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const baseUrl = isMobile && opts.mobileSequenceBaseUrl ? opts.mobileSequenceBaseUrl : opts.sequenceBaseUrl;
    const pad = (n: number) => String(n).padStart(opts.digits, "0");

    const draw = (idx: number) => {
      if (!ctx || isDestroyed) return;
      const img = loaded.get(idx) ?? loaded.get(0);
      if (!img || !img.naturalWidth) return;
      const s = Math.max(canvas.width / img.width, canvas.height / img.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - img.width * s) / 2, (canvas.height - img.height * s) / 2, img.width * s, img.height * s);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = element.clientWidth * dpr;
      canvas.height = element.clientHeight * dpr;
      draw(Math.round(lastProgress * (opts.frames - 1)));
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < opts.frames; i++) {
      const img = new Image();
      img.onload = () => { if (!isDestroyed && i === 0) draw(0); };
      img.src = `${baseUrl}${pad(i)}.webp`;
      loaded.set(i, img);
    }

    st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 85%",
      end: "bottom 80%",
      scrub: true,
      onUpdate: (self) => {
        lastProgress = self.progress;
        draw(Math.round(self.progress * (opts.frames - 1)));
      },
    });
  }

  const tl = gsap.timeline({ paused: true });
  let textSplit: SplitText | null = null;
  let finalTextSplit: SplitText | null = null;

  if (text) {
    textSplit = new SplitText(text, { type: "words, chars", tag: "span" });
    gsap.set(textSplit.words, { display: "inline-block" });
    gsap.set(textSplit.chars, { display: "inline-block", opacity: 0, rotate: 22, x: "-0.25em", y: "0.5em" });
    tl.to(textSplit.chars, { opacity: 1, rotate: 0, x: "0em", y: "0em", ease: "elastic.out(1, 0.75)", duration: 0.625, stagger: 0.011 });
  }

  const finalTl = gsap.timeline({ paused: true });
  if (finalText) {
    finalTextSplit = new SplitText(finalText, { type: "words, chars", tag: "span" });
    gsap.set(finalTextSplit.words, { display: "inline-block" });
    gsap.set(finalTextSplit.chars, { display: "inline-block", opacity: 0, rotate: 22, x: "-0.25em", y: "0.5em" });
    finalTl.to(finalTextSplit.chars, { opacity: 1, rotate: 0, x: "0em", y: "0em", ease: "elastic.out(1, 0.75)", duration: 0.625, stagger: 0.011 }, "start");
  }
  if (title) {
    gsap.set(title, { opacity: 0, y: "1em" });
    finalTl.to(title, { opacity: 1, y: "0em", ease: "elastic.out(1, 0.75)", duration: 0.625 }, "start");
  }
  if (buttons.length) {
    gsap.set(buttons, { rotate: gsap.utils.random(-16, 16), scale: 0 });
    finalTl.to(buttons, { rotate: 0, scale: 1, ease: "elastic.out(1, 0.75)", duration: 0.625, stagger: 0.026 }, "start+=0.15");
  }

  let textState = "before";
  let finalState = "before";
  const textSt = ScrollTrigger.create({
    trigger: wrap,
    start: "top 85%",
    end: "bottom 80%",
    scrub: true,
    onUpdate: (self) => {
      if (self.progress >= 0.6) {
        if (textState !== "reversed") { tl.timeScale(3.5).reverse(); textState = "reversed"; }
      } else if (self.progress >= 0.3) {
        if (textState !== "played") { tl.timeScale(1.5).play(); textState = "played"; }
      } else if (textState !== "before") {
        tl.timeScale(3.5).reverse(); textState = "before";
      }

      if (self.progress >= 0.81) {
        if (finalState !== "played") { finalTl.timeScale(1.25).play(); finalState = "played"; }
      } else if (finalState !== "before") {
        finalTl.timeScale(3.5).reverse(); finalState = "before";
      }
    },
  });

  if (canvas) {
    const createAnim = (startY: number) => {
      gsap.to(canvas, {
        keyframes: [{ yPercent: startY, duration: 0 }, { yPercent: 0, duration: 0.25 }, { yPercent: 0, duration: 0.75 }],
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top 85%", end: "bottom 80%", scrub: true },
      });
    };
    mm.add("(min-width: 992px)", () => createAnim(isShort ? 0 : -25));
    mm.add("(max-width: 991px)", () => createAnim(isShort ? 0 : -50));
  }

  return () => {
    isDestroyed = true;
    st?.kill();
    textSt.kill();
    mm.revert();
    tl.kill();
    finalTl.kill();
    textSplit?.revert();
    finalTextSplit?.revert();
    loaded.clear();
  };
}
