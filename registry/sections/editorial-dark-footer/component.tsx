"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import styles from "./styles.module.css";

export interface FooterLinkItem { label: string; href: string; }
export interface FooterVisualFrame { src: string; alt: string; }

export interface EditorialDarkFooterProps {
  mainLinks?: FooterLinkItem[];
  productHeading?: string;
  productLinks?: FooterLinkItem[];
  newsletterLabel?: string;
  emailLabel?: string;
  subscribedMessage?: string;
  labHeading?: string;
  labAddress?: string;
  labMapHref?: string;
  visualFrames?: FooterVisualFrame[];
  socialsHeading?: string;
  facebookHref?: string;
  instagramHref?: string;
  closingHeadline?: string;
  copyright?: string;
  backToTopLabel?: string;
  creditPrefix?: string;
  creditLabel?: string;
  creditHref?: string;
  onSubscribe?: (email: string) => void;
  onLinkClick?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

const DEFAULT_MAIN_LINKS: FooterLinkItem[] = [
  { label: "Shop", href: "#collections" },
  { label: "Subscribe", href: "#subscriptions" },
  { label: "Producers", href: "#mission" },
  { label: "Blogs", href: "#journal" },
  { label: "Contact", href: "#contact" },
  { label: "Refund Policy", href: "#refunds" },
  { label: "Terms of Service", href: "#terms" },
];

const DEFAULT_PRODUCT_LINKS: FooterLinkItem[] = [
  { label: "Limited Series", href: "#limited" },
  { label: "Bright Series", href: "#bright" },
  { label: "Warm Series", href: "#warm" },
  { label: "Dark Series", href: "#dark" },
  { label: "Cool Stuff", href: "#goods" },
];

const DEFAULT_VISUALS: FooterVisualFrame[] = [
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop", alt: "Hands sharing freshly poured specialty coffee cups over a wooden cafe table." },
  { src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80&auto=format&fit=crop", alt: "Roasted espresso crema pouring smoothly into a ceramic cup." },
  { src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80&auto=format&fit=crop", alt: "Barista preparing filter coffee in a warm editorial coffee bar." },
];

const ArrowRightIcon = () => (
  <svg viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M19.678 11.833c-.94.947-2.775 2.652-4.114 3.897-.53.493-.972.905-1.23 1.147l2.179 2.064c1.39-1.918 5.56-6.024 7.97-7.842V8.133c-2.41-1.82-6.578-5.926-7.972-7.844l-2.178 2.064c.5.476 1.205 1.134 1.951 1.827 1.265 1.18 2.697 2.516 3.395 3.217l.635.639H3.676c-.616 0-1.231-.077-1.825-.15a26.726 26.726 0 0 0-.859-.098v3.653c.285-.026.572-.061.851-.097.602-.075 1.217-.152 1.833-.152h16.638l-.636.64v.001Z" fill="currentColor" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12.473 5.054c.947.94 2.652 2.776 3.897 4.114.493.53.905.973 1.147 1.23l2.064-2.178c-1.918-1.391-6.024-5.562-7.842-7.97H8.773C6.953 2.659 2.847 6.827.93 8.221L2.993 10.4c.476-.5 1.134-1.205 1.827-1.95C6 7.182 7.336 5.75 8.037 5.053l.639-.636v16.638c0 .617-.077 1.231-.15 1.825a26.73 26.73 0 0 0-.098.859h3.653a24.516 24.516 0 0 0-.097-.851c-.075-.602-.152-1.216-.152-1.833V4.418l.64.636h.001Z" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M6.528 16V9H4V6.104h2.528V3.897C6.528 1.387 8.014 0 10.288 0c1.09 0 2.23.195 2.23.195V2.66h-1.256c-1.237 0-1.623.773-1.623 1.565v1.879H12.4L11.96 9H9.64v7H6.528z" />
  </svg>
);

const InstagramIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M8.77 1.58c2.34 0 2.62.01 3.54.05.86.04 1.32.18 1.63.3.41.17.7.35 1.01.66.3.3.5.6.65 1 .12.32.27.78.3 1.64.05.92.06 1.2.06 3.54s-.01 2.62-.05 3.54a4.79 4.79 0 01-.3 1.63c-.17.41-.35.7-.66 1.01-.3.3-.6.5-1.01.66-.31.12-.77.26-1.63.3-.92.04-1.2.05-3.54.05s-2.62 0-3.55-.05a4.79 4.79 0 01-1.62-.3c-.42-.16-.7-.35-1.01-.66-.31-.3-.5-.6-.66-1a4.87 4.87 0 01-.3-1.64c-.04-.92-.05-1.2-.05-3.54s0-2.62.05-3.54c.04-.86.18-1.32.3-1.63.16-.41.35-.7.66-1.01.3-.3.6-.5 1-.65.32-.12.78-.27 1.63-.3.93-.05 1.2-.06 3.55-.06zm0-1.58C6.39 0 6.09.01 5.15.05c-.93.04-1.57.2-2.13.4-.57.23-1.06.54-1.55 1.02C1 1.96.7 2.45.46 3.02c-.22.56-.37 1.2-.4 2.13C0 6.1 0 6.4 0 8.77s.01 2.68.05 3.61c.04.94.2 1.57.4 2.13.23.58.54 1.07 1.02 1.56.49.48.98.78 1.55 1.01.56.22 1.2.37 2.13.4.94.05 1.24.06 3.62.06 2.39 0 2.68-.01 3.62-.05.93-.04 1.57-.2 2.13-.41a4.27 4.27 0 001.55-1.01c.49-.49.79-.98 1.01-1.56.22-.55.37-1.19.41-2.13.04-.93.05-1.23.05-3.61 0-2.39 0-2.68-.05-3.62a6.47 6.47 0 00-.4-2.13 4.27 4.27 0 00-1.02-1.55A4.35 4.35 0 0014.52.46a6.43 6.43 0 00-2.13-.41A69 69 0 008.77 0z" />
    <path fill="currentColor" d="M8.8 4a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.43a2.92 2.92 0 110-5.85 2.92 2.92 0 010 5.85zM13.43 5a1.05 1.05 0 100-2.1 1.05 1.05 0 000 2.1z" />
  </svg>
);

export function EditorialDarkFooter({
  mainLinks = DEFAULT_MAIN_LINKS,
  productHeading = "Our products",
  productLinks = DEFAULT_PRODUCT_LINKS,
  newsletterLabel = "Subscribe to our emails",
  emailLabel = "Email",
  subscribedMessage = "Thanks for subscribing to our dispatch!",
  labHeading = "Roastery Lab",
  labAddress = "1420 Rue Notre-Dame O,\nMontreal, QC\nH3C 1K9, Canada",
  labMapHref = "#map",
  visualFrames = DEFAULT_VISUALS,
  socialsHeading = "Follow Us",
  facebookHref = "#facebook",
  instagramHref = "#instagram",
  closingHeadline = "And you? How do you roast?",
  copyright = "2026 © Meridian Coffee Company",
  backToTopLabel = "Scroll back to top",
  creditPrefix = "Original design by",
  creditLabel = "Studio",
  creditHref = "#credit",
  onSubscribe,
  onLinkClick,
}: EditorialDarkFooterProps) {
  const inputId = useId();
  const visualsRef = useRef<HTMLDivElement | null>(null);
  const [activeVisual, setActiveVisual] = useState(0);
  const [inView, setInView] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const el = visualsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || visualFrames.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveVisual((prev) => (prev + 1) % visualFrames.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [inView, visualFrames.length]);

  const handleBackToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    onSubscribe?.(trimmed);
    setSubscribed(true);
    setEmail("");
  };

  const handleNavClick = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    onLinkClick?.(href, e);
  };

  const renderAddress = (className: string) => (
    <div className={className}>
      <h2 className={`${styles.narrowSmall} ${styles.label}`}>{labHeading}</h2>
      <a href={labMapHref} className={`${styles.smallText} ${styles.cta} ${styles.addressLink}`} onClick={handleNavClick(labMapHref)}>
        {labAddress}
      </a>
    </div>
  );

  return (
    <footer className={styles.section} aria-label="Editorial dark footer">
      <div className={styles.footer}>
        <div className={styles.top}>
          <div className={styles.mainMenu}>
            <ul className={styles.linkList}>
              {mainLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={`${styles.smallText} ${styles.cta}`} onClick={handleNavClick(item.href)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.productsMenu}>
            <h2 className={`${styles.narrowSmall} ${styles.label}`}>{productHeading}</h2>
            <ul className={styles.linkList}>
              {productLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={`${styles.smallText} ${styles.cta}`} onClick={handleNavClick(item.href)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.mid}>
          {renderAddress(styles.addressMobile)}
          <div className={styles.newsletter}>
            <h2 className={`${styles.smallText} ${styles.newsletterHeading}`}>{newsletterLabel}</h2>
            <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
              <div className={styles.fieldWrapper}>
                <div className={styles.field}>
                  <input id={inputId} type="email" className={`${styles.fieldInput} ${styles.smallText}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
                  <label className={`${styles.smallText} ${styles.fieldLabel}`} htmlFor={inputId}>{emailLabel}</label>
                  <button type="submit" aria-label="Subscribe" className={styles.submitBtn}><ArrowRightIcon /></button>
                </div>
                {subscribed && <p className={`${styles.smallText} ${styles.thanks}`}>{subscribedMessage}</p>}
              </div>
            </form>
            <div className={styles.visual}>
              <div ref={visualsRef} className={styles.visualInner}>
                {visualFrames.map((vis, idx) => (
                  <img key={vis.src} src={vis.src} alt={vis.alt} width={800} height={800} loading="eager" className={`${styles.visualImg} ${activeVisual === idx ? styles.visualImgActive : ""}`} />
                ))}
              </div>
            </div>
          </div>
          {renderAddress(styles.addressDesktop)}
        </div>

        <div className={styles.lastRow}>
          <div className={styles.socials}>
            <h2 className={`${styles.tH2} ${styles.socialsHeading}`}>{socialsHeading}</h2>
            <ul className={styles.socialList}>
              <li><a href={facebookHref} className={styles.socialLink} aria-label="Facebook" onClick={handleNavClick(facebookHref)}><FacebookIcon /></a></li>
              <li><a href={instagramHref} className={styles.socialLink} aria-label="Instagram" onClick={handleNavClick(instagramHref)}><InstagramIcon /></a></li>
            </ul>
          </div>
          <h2 className={`${styles.tH2} ${styles.moodHeading}`}>{closingHeadline}</h2>
        </div>

        <div className={styles.bottom}>
          <a href="#top" onClick={handleBackToTop} className={styles.centerMobile}>
            <div className={styles.mobileArrows}><ArrowUpIcon /><ArrowUpIcon /><ArrowUpIcon /></div>
            <p className={`${styles.narrowSmall} ${styles.mobileBackLabel}`}>{backToTopLabel}</p>
            <div className={styles.mobileArrows}><ArrowUpIcon /><ArrowUpIcon /><ArrowUpIcon /></div>
          </a>
          <div className={styles.bottomInner}>
            <p className={`${styles.left} ${styles.smallText}`}>{copyright}</p>
            <div className={styles.centerDesktop}>
              {Array.from({ length: 5 }).map((_, i) => <ArrowUpIcon key={`u1-${i}`} />)}
              <a href="#top" onClick={handleBackToTop} className={`${styles.narrowSmall} ${styles.backToTopLink}`}>{backToTopLabel}</a>
              {Array.from({ length: 5 }).map((_, i) => <ArrowUpIcon key={`u2-${i}`} />)}
            </div>
            <p className={`${styles.right} ${styles.smallText}`}>
              {creditPrefix}{" "}
              <a href={creditHref} className={`${styles.cta} ${styles.creditLink}`} onClick={handleNavClick(creditHref)}>{creditLabel}</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
