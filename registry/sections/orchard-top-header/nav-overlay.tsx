"use client";

import { useEffect, type CSSProperties, type MouseEvent } from "react";
import overlayStyles from "./overlay.module.css";

export interface OrchardHeaderNavItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
}

export interface OrchardNavOverlayProps {
  id: string;
  open: boolean;
  primaryNav: OrchardHeaderNavItem[];
  secondaryNav: OrchardHeaderNavItem[];
  legalLinks: OrchardHeaderNavItem[];
  navAriaLabel: string;
  onClose: () => void;
  onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

export function OrchardNavOverlay({
  id,
  open,
  primaryNav,
  secondaryNav,
  legalLinks,
  navAriaLabel,
  onClose,
  onNavigate,
}: OrchardNavOverlayProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const lastIndex = primaryNav.length - 1;

  const handleLinkClick = (
    item: OrchardHeaderNavItem,
    e: MouseEvent<HTMLAnchorElement>,
  ) => {
    onNavigate?.(item.href, e);
    if (!item.external) onClose();
  };

  return (
    <div
      id={id}
      className={`${overlayStyles.overlay} ${open ? overlayStyles.overlayOpen : ""}`}
      aria-hidden={open ? undefined : "true"}
    >
      <div className={overlayStyles.inner}>
        <nav className={overlayStyles.primary} aria-label={navAriaLabel}>
          <ul
            className={overlayStyles.list}
            style={{ "--fp-nav-last": Math.max(lastIndex, 1) } as CSSProperties}
          >
            {primaryNav.map((item, i) => {
              const isLast = i === lastIndex;
              return (
                <li
                  key={`${item.href}-${i}`}
                  className={[
                    overlayStyles.item,
                    item.active ? overlayStyles.itemActive : "",
                    isLast ? overlayStyles.itemLast : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    {
                      "--i": i,
                      "--fp-marker-delay": `${0.35 + i * 0.08}s`,
                    } as CSSProperties
                  }
                >
                  <div className={overlayStyles.row}>
                    <a
                      href={item.href}
                      className={overlayStyles.link}
                      aria-current={item.active ? "page" : undefined}
                      onClick={(e) => handleLinkClick(item, e)}
                    >
                      <span>{item.label}</span>
                      {item.active ? (
                        <span className={overlayStyles.marker} aria-hidden="true" />
                      ) : null}
                    </a>
                    {isLast && secondaryNav.length ? (
                      <ul className={overlayStyles.secondary}>
                        {secondaryNav.map((sec, j) => (
                          <li
                            key={`${sec.href}-${j}`}
                            className={sec.active ? overlayStyles.secondaryActive : undefined}
                          >
                            <a
                              href={sec.href}
                              target={sec.external ? "_blank" : undefined}
                              rel={sec.external ? "noopener noreferrer" : undefined}
                              className={overlayStyles.secondaryLink}
                              onClick={(e) => handleLinkClick(sec, e)}
                            >
                              <span>{sec.label}</span>
                              {sec.external ? (
                                <svg
                                  width="11"
                                  height="11"
                                  viewBox="0 0 11 11"
                                  fill="none"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M1 10L10 1M10 1H2.5M10 1V8.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {legalLinks.length ? (
          <div className={overlayStyles.legal}>
            {legalLinks.map((link, idx) => (
              <a
                key={`${link.href}-${idx}`}
                href={link.href}
                className={overlayStyles.legalLink}
                onClick={(e) => handleLinkClick(link, e)}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
