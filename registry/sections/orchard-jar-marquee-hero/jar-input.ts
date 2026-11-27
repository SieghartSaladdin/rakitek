export interface InputState {
  target: number;
  dragging: boolean;
  pointerInside: boolean;
  pointerX: number;
  pointerY: number;
}

export function attachMarqueeInput(
  root: HTMLElement,
  wrap: HTMLElement,
  onResize: () => void,
) {
  const state: InputState = {
    target: 0,
    dragging: false,
    pointerInside: false,
    pointerX: 0,
    pointerY: 0,
  };

  let pressed = false;
  let pointerId = -1;
  let wasDragged = false;
  let lastX = 0;
  let downX = 0;
  let dragVelocity = 0;
  let lastDragTime = 0;

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    state.target -= d * 1.15;
  };
  const onPointerDown = (e: PointerEvent) => {
    pressed = true;
    pointerId = e.pointerId;
    state.dragging = false;
    wasDragged = false;
    lastX = e.clientX;
    downX = e.clientX;
    dragVelocity = 0;
    lastDragTime = e.timeStamp || performance.now();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!pressed || e.pointerId !== pointerId) return;
    if (!state.dragging) {
      if (Math.abs(e.clientX - downX) <= 6) return;
      wrap.setPointerCapture?.(e.pointerId);
      state.dragging = true;
      wasDragged = true;
      lastX = e.clientX;
      lastDragTime = e.timeStamp || performance.now();
      return;
    }
    const dx = e.clientX - lastX;
    const now = e.timeStamp || performance.now();
    const dtMs = Math.max(1, now - lastDragTime);
    dragVelocity = dragVelocity * 0.72 + (dx / dtMs) * 0.28;
    lastX = e.clientX;
    lastDragTime = now;
    state.target += dx * 1.5;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (pointerId !== -1 && e.pointerId !== pointerId) return;
    if (state.dragging) {
      wrap.releasePointerCapture?.(e.pointerId);
      const v = Math.max(-3.5, Math.min(3.5, dragVelocity));
      state.target += v * 1.5 * 190;
    }
    dragVelocity = 0;
    pressed = false;
    pointerId = -1;
    state.dragging = false;
  };
  const onRootMove = (e: PointerEvent) => {
    if (e.pointerType !== "touch") {
      state.pointerInside = true;
      state.pointerX = e.clientX;
      state.pointerY = e.clientY;
    }
  };
  const onRootLeave = () => {
    state.pointerInside = false;
  };
  const onClickCapture = (e: MouseEvent) => {
    if (wasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  window.addEventListener("resize", onResize);
  wrap.addEventListener("wheel", onWheel, { passive: false });
  wrap.addEventListener("pointerdown", onPointerDown);
  wrap.addEventListener("pointermove", onPointerMove);
  wrap.addEventListener("pointerup", onPointerUp);
  wrap.addEventListener("pointercancel", onPointerUp);
  wrap.addEventListener("click", onClickCapture, true);
  root.addEventListener("pointermove", onRootMove, { passive: true });
  root.addEventListener("pointerleave", onRootLeave);

  return {
    state,
    destroy: () => {
      window.removeEventListener("resize", onResize);
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
      wrap.removeEventListener("click", onClickCapture, true);
      root.removeEventListener("pointermove", onRootMove);
      root.removeEventListener("pointerleave", onRootLeave);
    },
  };
}
