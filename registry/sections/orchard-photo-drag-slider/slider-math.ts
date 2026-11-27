export type SliderLayout = { slideW: number; step: number; total: number; half: number; containerW: number };

const PARALLAX_EXP = 0.84;
const PARALLAX_RANGE = 0.78;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Positions every slide on the infinite loop and shifts each image for the parallax drift. */
export function renderSlides(
  layout: SliderLayout,
  slides: HTMLElement[],
  imgs: (HTMLElement | null)[],
  extra: number[],
  offset: number,
  reduced: boolean,
) {
  const { step, total, half, containerW, slideW } = layout;
  if (!total) return;
  const base = containerW / 2 - slideW / 2;
  for (let i = 0; i < slides.length; i++) {
    let x = i * step - offset;
    x = ((x % total) + total) % total;
    if (x > half) x -= total;
    slides[i].style.transform = `translate3d(${base + x}px, 0, 0)`;
    const img = imgs[i];
    if (!reduced && img) {
      const overflow = extra[i] || 0;
      const range = ((containerW + slideW) / 2) * PARALLAX_RANGE;
      const p = range ? clamp(-x / range, -1, 1) : 0;
      const shift = (p === 0 ? 0 : Math.sign(p) * Math.pow(Math.abs(p), PARALLAX_EXP)) * overflow;
      img.style.transform = `translate3d(calc(-50% + ${shift}px), 0, 0)`;
    }
  }
}
