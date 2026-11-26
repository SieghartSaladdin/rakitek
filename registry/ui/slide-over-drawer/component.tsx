"use client";

import { useEffect } from "react";
import styles from "./styles.module.css";

export interface DrawerLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface SlideOverDrawerProps {
  open: boolean;
  items: DrawerLineItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout?: (subtotal: number) => void;
  title?: string;
  currencySymbol?: string;
  currencyCode?: string;
  freeShippingThreshold?: number;
  shippingLabel?: string;
  emptyText?: string;
  subtotalLabel?: string;
  checkoutLabel?: string;
  /** The source theme hides the fill (empty div), so it is off by default for a 1:1 match. */
  progressFill?: boolean;
  /** Formats every amount (items, subtotal, shipping goal). Default: `${currencySymbol}${value.toFixed(2)}` plus the currency code. */
  formatPrice?: (value: number) => string;
  /** Shown once the free-shipping threshold is reached. Default: `You unlocked ${shippingLabel}!` */
  goalReachedText?: string;
  /** Shown while below the threshold; receives formatted remaining and threshold amounts. */
  goalRemainingText?: (amountLabel: string, thresholdLabel: string) => string;
  closeLabel?: string;
  decreaseLabel?: (itemName: string) => string;
  increaseLabel?: (itemName: string) => string;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" fill="none" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 28a.625.625 0 0 1-.884 0L6 6.884A.625.625 0 1 1 6.884 6L28 27.116A.625.625 0 0 1 28 28Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 28a.625.625 0 0 1 0-.884L27.116 6a.625.625 0 1 1 .884.884L6.884 28A.625.625 0 0 1 6 28Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BagPlaceholder() {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 6h20l2 26H2L4 6Z" />
      <path d="M2 12h24" />
    </svg>
  );
}

export function SlideOverDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onCheckout,
  title = "Your Bag",
  currencySymbol = "$",
  currencyCode = "",
  freeShippingThreshold = 55,
  shippingLabel = "FREE shipping",
  emptyText = "Your bag is currently empty.",
  subtotalLabel = "Subtotal",
  checkoutLabel = "Checkout",
  progressFill = false,
  formatPrice,
  goalReachedText,
  goalRemainingText,
  closeLabel = "Close cart",
  decreaseLabel = (name) => `Decrease quantity of ${name}`,
  increaseLabel = (name) => `Increase quantity of ${name}`,
}: SlideOverDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const fmtPrice = (value: number) =>
    formatPrice
      ? formatPrice(value)
      : `${currencySymbol}${value.toFixed(2)}${currencyCode ? ` ${currencyCode}` : ""}`;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const remainingLabel = formatPrice ? formatPrice(remaining) : `${currencySymbol}${remaining.toFixed(2)}`;
  const thresholdLabel = formatPrice ? formatPrice(freeShippingThreshold) : `${currencySymbol}${freeShippingThreshold}`;
  const goalText =
    remaining === 0
      ? (goalReachedText ?? `You unlocked ${shippingLabel}!`)
      : goalRemainingText
        ? goalRemainingText(remainingLabel, thresholdLabel)
        : `Add ${remainingLabel} more for ${shippingLabel} (${thresholdLabel}+)`;

  return (
    <div
      className={`${styles.root} ${open ? styles.rootOpen : ""}`}
      aria-hidden={!open}
      inert={!open}
      data-lenis-prevent
    >
      <div className={styles.backdrop} onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {title} ({totalCount})
          </h2>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label={closeLabel}>
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.goal}>
          <p className={styles.smallText}>
            {goalText}
          </p>
          <div className={styles.bar}>
            {progressFill ? <div className={styles.barFill} style={{ width: `${progress}%` }} /> : null}
          </div>
        </div>

        {items.length === 0 ? (
          <div className={styles.items}>
            <p className={styles.empty}>{emptyText}</p>
          </div>
        ) : (
          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className={styles.thumb} />
                ) : (
                  <span className={`${styles.thumb} ${styles.thumbPlaceholder}`}>
                    <BagPlaceholder />
                  </span>
                )}
                <div className={styles.info}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.smallText}>{fmtPrice(item.price)}</p>
                  <div className={styles.qty}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => onUpdateQty(item.id, -1)}
                      aria-label={decreaseLabel(item.name)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => onUpdateQty(item.id, 1)}
                      aria-label={increaseLabel(item.name)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <div className={styles.subtotal}>
            <span className={styles.subtotalLabel}>{subtotalLabel}</span>
            <span className={styles.subtotalValue}>{fmtPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            className={styles.checkout}
            disabled={items.length === 0}
            onClick={() => onCheckout?.(subtotal)}
          >
            {checkoutLabel}
          </button>
        </div>
      </aside>
    </div>
  );
}
