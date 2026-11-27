"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import styles from "./styles.module.css";

export interface OrchardPillNavItem {
  id: string;
  label: string;
}

export interface OrchardFloatingPillNavProps {
  items: OrchardPillNavItem[];
  ariaLabel?: string;
  activeId?: string;
  forceVisible?: boolean;
  hideAtSelector?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function OrchardFloatingPillNav({
  items,
  ariaLabel = "Product lines",
  activeId,
  forceVisible = false,
  hideAtSelector = "footer",
  onSelect,
  className,
}: OrchardFloatingPillNavProps) {
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<Element | null>(null);
  const [active, setActive] = useState(activeId ?? items[0]?.id ?? "");
  const [visible, setVisible] = useState(forceVisible);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<CSSProperties>({ opacity: 0 });

  useEffect(() => {
    if (activeId) setActive(activeId);
  }, [activeId]);

  const update = useCallback(() => {
    if (forceVisible) {
      setVisible(true);
      return;
    }
    const line = window.innerHeight * 0.5;
    let current = items[0]?.id ?? "";
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el && el.getBoundingClientRect().top <= line) current = item.id;
    }
    if (!activeId) setActive(current);
    const first = items[0] ? document.getElementById(items[0].id) : null;
    const started = first ? first.getBoundingClientRect().top <= line : true;
    if (!footerRef.current && hideAtSelector) {
      footerRef.current = document.querySelector(hideAtSelector);
    }
    const atFooter = footerRef.current
      ? footerRef.current.getBoundingClientRect().top <= window.innerHeight + 120
      : false;
    setVisible(started && !atFooter);
  }, [items, activeId, forceVisible, hideAtSelector]);

  const movePill = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const link = nav.querySelector<HTMLElement>(`.${styles.linkActive}`);
    if (!link) {
      setPill((p) => ({ ...p, opacity: 0 }));
      return;
    }
    setPill({
      opacity: 1,
      width: `${link.offsetWidth}px`,
      height: `${link.offsetHeight}px`,
      transform: `translate(${link.offsetLeft}px, ${link.offsetTop}px)`,
    });
  }, []);

  useEffect(() => {
    const id = window.requestAnimationFrame(movePill);
    return () => window.cancelAnimationFrame(id);
  }, [active, items, visible, movePill]);

  useEffect(() => {
    const first = window.requestAnimationFrame(() => {
      update();
      movePill();
    });
    const onResize = () => {
      window.requestAnimationFrame(() => {
        update();
        movePill();
      });
    };
    const onScroll = () => {
      setOpen(false);
      window.requestAnimationFrame(update);
    };
    const onPointerDown = (ev: PointerEvent) => {
      const nav = navRef.current;
      if (nav && !nav.contains(ev.target as Node)) setOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.cancelAnimationFrame(first);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [update, movePill]);

  const go = (id: string) => {
    setOpen(false);
    setActive(id);
    onSelect?.(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!items.length) return null;

  const classes = [
    styles.nav,
    visible ? styles.isVisible : "",
    open ? styles.isOpen : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      ref={navRef}
      className={classes}
      aria-hidden={visible ? undefined : "true"}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={styles.current}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.currentPill}>
          <span className={styles.currentOptions}>
            {items.map((item) => (
              <span
                key={item.id}
                className={`${styles.currentOption} ${item.id === active ? styles.currentOptionActive : ""}`}
              >
                {item.label}
              </span>
            ))}
          </span>
        </span>
        <span className={styles.currentDisc} aria-hidden="true">
          <svg className={styles.chevron} viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div className={styles.listWrap}>
        <span className={styles.pill} style={pill} aria-hidden="true" />
        <ul id={listId} className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <button
                type="button"
                className={`${styles.link} ${item.id === active ? styles.linkActive : ""}`}
                aria-current={item.id === active ? "true" : undefined}
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
