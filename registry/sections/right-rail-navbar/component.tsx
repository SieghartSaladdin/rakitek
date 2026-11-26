"use client";

import { useEffect, useState } from "react";
import { ACCOUNT_PATH, CART_PATH, CLOSE_PATHS, HAMBURGER_PATHS } from "./icons";
import styles from "./styles.module.css";

/** A locale code from `locales` (default "en" | "fr"). */
export type NavLocale = string;
export interface NavLinkItem { label: string; href: string; external?: boolean; }
export interface NavAccordionGroup { id: string; label: string; links: NavLinkItem[]; }

export interface RightRailNavbarProps {
  brand?: string; brandHref?: string; showBrandMark?: boolean; brandTone?: "default" | "inverted";
  promoTitle?: string; promoDetail?: string; promoTitleFr?: string; promoDetailFr?: string;
  shopHeading?: string; shopHeadingFr?: string; cartCount?: number; accountHref?: string;
  shopLinks?: NavLinkItem[]; mainLinks?: NavLinkItem[]; accordions?: NavAccordionGroup[];
  defaultOpen?: boolean; onOpenCart?: () => void; onToggleLocale?: (nextLocale: NavLocale) => void;
  showCart?: boolean; showLocaleToggle?: boolean;
  /** [primary, secondary] locale codes; the `*Fr` props hold the secondary-locale copy. The toggle shows the
   *  `localeLabels` entry of the locale it switches to; `localeToggleAriaLabels` is indexed by the active locale. */
  locales?: [string, string]; localeLabels?: [string, string]; localeToggleAriaLabels?: [string, string];
  brandHomeLabel?: string; navAriaLabel?: string; menuOpenLabel?: string; menuCloseLabel?: string;
  cartLabel?: string; accountLabel?: string; shopNavLabel?: string; secondaryNavLabel?: string;
}

const DEFAULT_SHOP_LINKS: NavLinkItem[] = [
  { label: "All products", href: "#collections" },
  { label: "All Coffees", href: "#collections" },
  { label: "Gift Card", href: "#gift-card" },
  { label: "Boxes", href: "#boxes" },
  { label: "Cool Stuff", href: "#goods" },
];

const DEFAULT_MAIN_LINKS: NavLinkItem[] = [
  { label: "About Studio", href: "#about" },
  { label: "Subscribe", href: "#subscribe" },
  { label: "Producers", href: "#producers" },
];

const DEFAULT_ACCORDIONS: NavAccordionGroup[] = [
  {
    id: "our-products",
    label: "Our Products",
    links: [
      { label: "Limited Series", href: "#limited" },
      { label: "Bright Series", href: "#bright" },
      { label: "Warm Series", href: "#warm" },
      { label: "Dark Series", href: "#dark" },
      { label: "Pantry", href: "#pantry" },
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    links: [
      { label: "Equipment and Technical Advice", href: "#equipment" },
      { label: "Wholesale Partnerships", href: "#partners" },
      { label: "Wholesale Account Application", href: "#application" },
      { label: "Wholesale Catalog", href: "#catalog" },
    ],
  },
];

export function RightRailNavbar({
  brand = "MERIDIAN",
  brandHref = "#main",
  showBrandMark = true,
  brandTone = "default",
  promoTitle = "Free Shipping",
  promoDetail = "Local & metro orders 35$+ | Domestic orders 55$+ | Express courier daily",
  promoTitleFr = "Livraison gratuite",
  promoDetailFr = "Commandes locales 35$+ | Nationales 55$+ | Envoi express quotidien",
  shopHeading = "Shop",
  shopHeadingFr = "Boutique",
  cartCount = 0,
  accountHref = "#footer",
  shopLinks = DEFAULT_SHOP_LINKS,
  mainLinks = DEFAULT_MAIN_LINKS,
  accordions = DEFAULT_ACCORDIONS,
  defaultOpen = false,
  onOpenCart,
  onToggleLocale,
  showCart = true, showLocaleToggle = true, locales = ["en", "fr"], localeLabels = ["EN", "FR"],
  localeToggleAriaLabels = ["See content in French", "Voir le contenu en anglais"],
  brandHomeLabel, navAriaLabel = "Primary navigation", menuOpenLabel = "Menu", menuCloseLabel = "Close menu",
  cartLabel = "Open cart", accountLabel = "Account", shopNavLabel = "Shop", secondaryNavLabel = "Secondary navigation",
}: RightRailNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(defaultOpen);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isSecondary, setIsSecondary] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleLocaleClick = () => {
    setIsSecondary(!isSecondary);
    onToggleLocale?.(locales[isSecondary ? 0 : 1]);
  };

  const handleLinkClick = () => setMenuOpen(false);
  const activeTitle = isSecondary ? promoTitleFr : promoTitle;
  const activeDetail = isSecondary ? promoDetailFr : promoDetail;

  const logoCls = brandTone === "inverted" ? `${styles.stickyLogo} ${styles.brandInverted}` : styles.stickyLogo;
  const tagCls = brandTone === "inverted" ? `${styles.logoTagline} ${styles.brandInverted}` : styles.logoTagline;

  return (
    <div className={styles.sectionRoot}>
      {showBrandMark ? (
        <>
          <a href={brandHref} className={logoCls} aria-label={brandHomeLabel ?? `${brand} Home`}>
            <svg width="40" height="25" viewBox="0 0 40 25" fill="none" aria-hidden="true">
              <rect x="0" y="0" width="40" height="5.5" />
              <rect x="4" y="9.5" width="36" height="5.5" />
              <rect x="10" y="19" width="30" height="5.5" />
            </svg>
          </a>
          <a href={brandHref} className={tagCls} aria-label={brand}>{brand}</a>
        </>
      ) : null}

      <div className={styles.railWrapper}>
        <header className={styles.railHeader} aria-label={navAriaLabel}>
          <div className={styles.menuTriggerWrap}>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label={menuOpen ? menuCloseLabel : menuOpenLabel}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className={styles.menuGlyphBox}>
                <svg aria-hidden="true" className={menuOpen ? styles.iconClose : styles.iconHamburger} fill="none" viewBox="0 0 34 34">
                  {(menuOpen ? CLOSE_PATHS : HAMBURGER_PATHS).map((d) => (
                    <path key={d} fillRule="evenodd" clipRule="evenodd" d={d} fill="currentColor" />
                  ))}
                </svg>
              </span>
            </button>
          </div>

          <div className={styles.railLines}>
            <p className={styles.railLine}>{activeTitle}</p>
            <p className={styles.railLine}>{activeDetail}</p>
          </div>

          <div className={styles.railIcons}>
            {showCart ? (
              <button type="button" onClick={onOpenCart} className={styles.cartBtn} aria-label={cartLabel}>
                <svg className={styles.railSvg} aria-hidden="true" viewBox="0 0 20 24" fill="none">
                  <path d={CART_PATH} fillRule="evenodd" fill="currentColor" />
                </svg>
                {cartCount > 0 ? <span className={styles.cartBadge}>{cartCount}</span> : null}
              </button>
            ) : null}

            <a href={accountHref} className={styles.accountLink} aria-label={accountLabel}>
              <svg className={styles.railSvg} aria-hidden="true" viewBox="0 0 28 28" fill="none">
                <path d={ACCOUNT_PATH} fillRule="evenodd" fill="currentColor" />
              </svg>
            </a>

            {showLocaleToggle ? (
              <button
                type="button"
                onClick={handleLocaleClick}
                className={styles.langBtn}
                aria-label={localeToggleAriaLabels[isSecondary ? 1 : 0]}
              >
                {localeLabels[isSecondary ? 0 : 1]}
              </button>
            ) : null}
          </div>
        </header>
      </div>

      <div className={`${styles.navDrawer} ${menuOpen ? styles.isOpen : ""}`} aria-hidden={!menuOpen}>
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
        <div className={styles.drawerPanel}>
          <nav className={styles.topNav} aria-label={shopNavLabel}>
            <p className={styles.shopHeading}>{isSecondary ? shopHeadingFr : shopHeading}</p>
            <ul className={styles.menuList} role="list">
              {shopLinks.map((item) => (
                <li key={item.label} className={styles.menuItem}>
                  <a href={item.href} tabIndex={menuOpen ? undefined : -1} onClick={handleLinkClick} className={styles.shopLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={secondaryNavLabel}>
            <ul className={styles.menuList} role="list">
              {mainLinks.map((item) => (
                <li key={item.label} className={styles.menuItem}>
                  <a href={item.href} tabIndex={menuOpen ? undefined : -1} onClick={handleLinkClick} className={styles.mainLink}>
                    {item.label}
                  </a>
                </li>
              ))}

              {accordions.map((group) => {
                const isOpen = openAccordion === group.id;
                return (
                  <li key={group.id} className={styles.menuItem}>
                    <button
                      type="button"
                      tabIndex={menuOpen ? undefined : -1}
                      onClick={() => setOpenAccordion(isOpen ? null : group.id)}
                      className={styles.accBtn}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.cta}>{group.label}</span>
                      <span className={styles.accSign} aria-hidden="true">{isOpen ? "\u2212" : "+"}</span>
                    </button>
                    {isOpen ? (
                      <ul className={styles.accList}>
                        {group.links.map((sub) => (
                          <li key={sub.label} className={styles.menuItem}>
                            <a
                              href={sub.href}
                              target={sub.external ? "_blank" : undefined}
                              rel={sub.external ? "noreferrer noopener" : undefined}
                              tabIndex={menuOpen ? undefined : -1}
                              onClick={handleLinkClick}
                              className={styles.accSubLink}
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
