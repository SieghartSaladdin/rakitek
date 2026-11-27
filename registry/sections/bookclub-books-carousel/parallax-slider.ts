import gsap from "gsap";
import Smooothy from "smooothy";

interface ItemSetting {
  el: HTMLElement;
  rotation: number;
  yOffset: number;
}

export class BookclubParallaxSlider extends Smooothy {
  itemsEls: HTMLElement[];
  itemSettings: ItemSetting[];
  onArrowChange?: (canPrev: boolean, canNext: boolean) => void;

  constructor(
    wrapper: HTMLElement,
    config: Record<string, unknown> = {},
    onArrowChange?: (canPrev: boolean, canNext: boolean) => void,
  ) {
    super(wrapper, config);
    this.onArrowChange = onArrowChange;
    this.itemsEls = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-books-slider-item]"));
    this.itemSettings = this.itemsEls.map((el, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      const rotation = gsap.utils.random(1.5, 3, 0.1) * direction;
      const yOffset = gsap.utils.random(3, 9, 0.1) * direction;
      el.style.setProperty("--book-slider-item-rotate", `${-rotation}deg`);
      el.style.willChange = "transform";
      return { el, rotation, yOffset };
    });
    this.updateArrowState();
  }

  updateArrowState() {
    if (!this.onArrowChange) return;
    const currentSlide = this.currentSlide ?? 0;
    const progress = gsap.utils.clamp(0, 1, this.progress ?? 0);
    this.onArrowChange(currentSlide > 0, progress < 0.95);
  }

  onUpdate = () => {
    this.updateArrowState();
    const wrapRect = this.wrapper.getBoundingClientRect();
    const wrapCenter = wrapRect.left + wrapRect.width / 2;
    const maxDistance = wrapRect.width / 2 || 1;

    this.itemSettings.forEach(({ el, rotation, yOffset }) => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.left + rect.width / 2;
      const norm = (elCenter - wrapCenter) / maxDistance;
      const clamped = gsap.utils.clamp(-2, 2, norm);
      const strength = Math.sin(clamped * 1.2);
      el.style.transform = `translateY(${strength * yOffset}%) rotate(${strength * rotation}deg)`;
    });
  };

  destroy() {
    this.itemsEls.forEach((el) => {
      el.style.willChange = "";
      el.style.transform = "";
      el.style.removeProperty("--book-slider-item-rotate");
    });
    super.destroy?.();
  }
}
