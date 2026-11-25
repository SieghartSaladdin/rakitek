"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export type NavLocale = "en" | "fr";
export interface NavLinkItem { label: string; href: string; external?: boolean; }
export interface NavAccordionGroup { id: string; label: string; links: NavLinkItem[]; }

export interface RightRailNavbarProps {
  brand?: string; brandHref?: string; showBrandMark?: boolean; brandTone?: "default" | "inverted";
  promoTitle?: string; promoDetail?: string; promoTitleFr?: string; promoDetailFr?: string;
  shopHeading?: string; shopHeadingFr?: string; cartCount?: number; accountHref?: string;
  shopLinks?: NavLinkItem[]; mainLinks?: NavLinkItem[]; accordions?: NavAccordionGroup[];
  defaultOpen?: boolean; onOpenCart?: () => void; onToggleLocale?: (nextLocale: NavLocale) => void;
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

const HAMBURGER_PATHS = [
  "M34 10c0 .345-.28.625-.625.625H.625a.625.625 0 1 1 0-1.25h32.75c.345 0 .625.28.625.625Z",
  "M34 17c0 .345-.28.625-.625.625H.625a.625.625 0 1 1 0-1.25h32.75c.345 0 .625.28.625.625Z",
  "M34 24c0 .345-.28.625-.625.625H.625a.625.625 0 1 1 0-1.25h32.75c.345 0 .625.28.625.625Z",
];
const CLOSE_PATHS = [
  "M28 28a.625.625 0 0 1-.884 0L6 6.884A.625.625 0 1 1 6.884 6L28 27.116A.625.625 0 0 1 28 28Z",
  "M6 28a.625.625 0 0 1 0-.884L27.116 6a.625.625 0 1 1 .884.884L6.884 28A.625.625 0 0 1 6 28Z",
];
const CART_PATH =
  "M9.317.72 8.95.769c-.361.048-.872.18-1.219.313-1.654.639-2.815 2.112-3.208 4.068l-.081.4-1.829.017c-1.006.009-1.86.03-1.896.047a.601.601 0 0 0-.321.305c-.061.138-.063.389-.063 8.513.001 7.448.006 8.384.052 8.493.069.165.14.24.298.312.129.059.476.062 9.284.062 6.193 0 9.19-.01 9.274-.034a.573.573 0 0 0 .382-.358c.058-.15.06-.508.06-8.474 0-7.994-.002-8.322-.061-8.475a.632.632 0 0 0-.339-.345c-.036-.016-.89-.037-1.896-.046l-1.829-.017-.081-.4a6.294 6.294 0 0 0-.909-2.227C13.793 1.764 12.65 1.047 11.15.779 10.894.733 9.533.689 9.317.72m1.537 1.531c.648.111 1.203.326 1.624.628.261.187.669.609.853.883.282.418.592 1.181.683 1.68l.022.125H5.964l.022-.125c.091-.499.401-1.262.683-1.68a4.36 4.36 0 0 1 .853-.883c.411-.295.969-.513 1.595-.625.372-.067 1.357-.068 1.737-.003m7.338 12.191-.009 7.375H1.817l-.009-7.375L1.8 7.067h16.4l-.008 7.375";
const ACCOUNT_PATH =
  "M13.207.774c-2.937.246-5.338 1.173-7.501 2.895-.585.466-1.571 1.452-2.037 2.037C2.141 7.625 1.198 9.844.858 12.32c-.057.414-.08.901-.08 1.68 0 1.556.176 2.708.623 4.083 1.591 4.892 5.76 8.35 10.919 9.059.805.111 2.555.111 3.36 0 2.969-.408 5.571-1.682 7.632-3.738.627-.625.781-.794 1.13-1.245 1.455-1.879 2.37-4.075 2.7-6.479.111-.805.111-2.555 0-3.36-.34-2.476-1.283-4.695-2.811-6.614-.466-.585-1.452-1.571-2.037-2.037A13.336 13.336 0 0 0 15.703.865C15.16.794 13.632.738 13.207.774m2.38 1.582c4.163.592 7.643 3.274 9.265 7.142.61 1.456.88 2.836.88 4.502 0 2.023-.424 3.747-1.355 5.505-.256.485-.74 1.262-.785 1.262a4.52 4.52 0 0 1-.386-.292c-1.2-.963-2.813-1.765-4.516-2.243-2.497-.701-5.743-.786-8.479-.222-1.98.408-4.001 1.328-5.417 2.465-.2.16-.373.292-.386.292-.045 0-.529-.777-.785-1.262-.654-1.235-1.06-2.494-1.273-3.942-.113-.772-.113-2.354 0-3.126.45-3.062 1.939-5.694 4.3-7.598 1.695-1.366 3.827-2.263 5.95-2.503l.607-.069c.348-.04 1.869.017 2.38.089m-2.124 3.435C11.66 5.979 10.13 7.33 9.632 9.17c-.136.504-.126 1.731.019 2.235a4.528 4.528 0 0 0 1.239 2.07 4.598 4.598 0 0 0 2.113 1.164c.48.119 1.6.107 2.077-.023 1.348-.366 2.438-1.273 3.006-2.502.298-.646.368-.989.369-1.824.001-.584-.018-.823-.087-1.097-.475-1.87-2.011-3.21-3.902-3.404a7.227 7.227 0 0 0-.553-.043l-.45.045m1.457 1.604c1.008.319 1.804 1.208 2.025 2.262.077.367.028 1.17-.094 1.553-.37 1.157-1.606 2.042-2.851 2.042-1.329 0-2.57-.95-2.893-2.216-.103-.4-.124-1.068-.045-1.423.265-1.189 1.236-2.111 2.46-2.335.359-.065.987-.012 1.398.117m.713 11.806c1.042.102 1.734.226 2.656.476 1.522.413 3.156 1.241 4.153 2.106l.205.177-.415.411c-1.798 1.782-4.066 2.897-6.669 3.279-.772.113-2.354.113-3.126 0-2.603-.382-4.871-1.497-6.669-3.279l-.415-.411.205-.177c1.327-1.151 3.526-2.099 5.665-2.442 1.277-.205 3.135-.264 4.41-.14";

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
}: RightRailNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(defaultOpen);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [locale, setLocale] = useState<NavLocale>("en");

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
    const next: NavLocale = locale === "en" ? "fr" : "en";
    setLocale(next);
    onToggleLocale?.(next);
  };

  const handleLinkClick = () => setMenuOpen(false);
  const activeTitle = locale === "en" ? promoTitle : promoTitleFr;
  const activeDetail = locale === "en" ? promoDetail : promoDetailFr;

  const logoCls = brandTone === "inverted" ? `${styles.stickyLogo} ${styles.brandInverted}` : styles.stickyLogo;
  const tagCls = brandTone === "inverted" ? `${styles.logoTagline} ${styles.brandInverted}` : styles.logoTagline;

  return (
    <div className={styles.sectionRoot}>
      {showBrandMark ? (
        <>
          <a href={brandHref} className={logoCls} aria-label={`${brand} Home`}>
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
        <header className={styles.railHeader} aria-label="Primary navigation">
          <div className={styles.menuTriggerWrap}>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label={menuOpen ? "Close menu" : "Menu"}
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
            <button type="button" onClick={onOpenCart} className={styles.cartBtn} aria-label="Open cart">
              <svg className={styles.railSvg} aria-hidden="true" viewBox="0 0 20 24" fill="none">
                <path d={CART_PATH} fillRule="evenodd" fill="currentColor" />
              </svg>
              {cartCount > 0 ? <span className={styles.cartBadge}>{cartCount}</span> : null}
            </button>

            <a href={accountHref} className={styles.accountLink} aria-label="Account">
              <svg className={styles.railSvg} aria-hidden="true" viewBox="0 0 28 28" fill="none">
                <path d={ACCOUNT_PATH} fillRule="evenodd" fill="currentColor" />
              </svg>
            </a>

            <button
              type="button"
              onClick={handleLocaleClick}
              className={styles.langBtn}
              aria-label={locale === "en" ? "See content in French" : "Voir le contenu en anglais"}
            >
              {locale === "en" ? "FR" : "EN"}
            </button>
          </div>
        </header>
      </div>

      <div className={`${styles.navDrawer} ${menuOpen ? styles.isOpen : ""}`} aria-hidden={!menuOpen}>
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
        <div className={styles.drawerPanel}>
          <nav className={styles.topNav} aria-label="Shop">
            <p className={styles.shopHeading}>{locale === "en" ? shopHeading : shopHeadingFr}</p>
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

          <nav aria-label="Secondary navigation">
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
