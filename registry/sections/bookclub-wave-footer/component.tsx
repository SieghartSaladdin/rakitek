"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookclubAppBadges } from "@registry/ui/bookclub-app-badges/component";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import { BookclubSocialButton } from "@registry/ui/bookclub-social-button/component";
import styles from "./styles.module.css";

export interface BookclubFooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface BookclubFooterSocial {
  platform: "instagram" | "tiktok" | "custom";
  href: string;
  ariaLabel?: string;
}

export interface BookclubWaveFooterProps {
  id?: string;
  brandName?: string;
  logoSrc?: string;
  appStoreHref?: string;
  googlePlayHref?: string;
  appStoreImageSrc?: string;
  googlePlayImageSrc?: string;
  showAppBadges?: boolean;
  socials?: BookclubFooterSocial[];
  showSocials?: boolean;
  legalLinks?: BookclubFooterLink[];
  newsletterHeading?: string;
  emailPlaceholder?: string;
  emailAriaLabel?: string;
  subscribeLabel?: string;
  successLine1?: string;
  successLine2?: string;
  errorText?: string;
  showNewsletter?: boolean;
  copyrightText?: string;
  creditLinks?: BookclubFooterLink[];
  showCredits?: boolean;
  visualImageSrc?: string;
  visualAlt?: string;
  className?: string;
  onSubscribe?: (email: string) => void;
}

const DEFAULT_LEGAL: BookclubFooterLink[] = [
  { label: "Terms of Service", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
];

const DEFAULT_CREDITS: BookclubFooterLink[] = [
  { label: "Design by Studio North", href: "#design" },
  { label: "Development by Guild Three", href: "#dev" },
];

const DEFAULT_SOCIALS: BookclubFooterSocial[] = [
  { platform: "instagram", href: "https://instagram.com", ariaLabel: "Go to Instagram" },
  { platform: "tiktok", href: "https://tiktok.com", ariaLabel: "Go to TikTok" },
];

export function BookclubWaveFooter({
  id = "signup",
  brandName = "FABLE & FOLD",
  logoSrc,
  appStoreHref = "#app-store",
  googlePlayHref = "#google-play",
  appStoreImageSrc,
  googlePlayImageSrc,
  showAppBadges = true,
  socials = DEFAULT_SOCIALS,
  showSocials = true,
  legalLinks = DEFAULT_LEGAL,
  newsletterHeading = "Join our mailing list",
  emailPlaceholder = "Email Address",
  emailAriaLabel = "Email Address",
  subscribeLabel = "Subscribe",
  successLine1 = "Thank you,",
  successLine2 = "you joined us!",
  errorText = "Please enter a valid email address.",
  showNewsletter = true,
  copyrightText = "©2026 Fable & Fold Book Club. All rights reserved.",
  creditLinks = DEFAULT_CREDITS,
  showCredits = true,
  visualImageSrc,
  visualAlt = "Monthly Book Club Box",
  className = "",
  onSubscribe,
}: BookclubWaveFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 991px)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "clamp(top bottom)", end: "clamp(top top)", scrub: 0.2 } });
      const top = el.querySelector("[data-footer-top]");
      const bottom = el.querySelector("[data-footer-bottom]");
      const visual = el.querySelector("[data-footer-visual]");
      const overlay = el.querySelector("[data-footer-overlay]");
      if (top) tl.fromTo(top, { y: "-12.5em" }, { y: "0em", ease: "none" });
      if (bottom) tl.fromTo(bottom, { y: "-12.5em" }, { y: "0em", ease: "none" }, "<");
      if (visual) tl.fromTo(visual, { scale: 0.9, xPercent: -35, y: "17.5em", rotate: 30 }, { scale: 1, xPercent: 0, y: "0em", rotate: 0, ease: "none" }, "<");
      if (overlay) tl.fromTo(overlay, { opacity: 0.55 }, { opacity: 0, ease: "none" }, "<");
      return () => tl.kill();
    });
    return () => mm.revert();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email.trim())) { setStatus("error"); return; }
    setStatus("success");
    onSubscribe?.(email.trim());
  };

  return (
    <footer ref={rootRef} id={id} data-rk-wave-footer="" className={[styles.footer, className].filter(Boolean).join(" ")}>
      <div data-footer-top="" className={styles.top}>
        <div className={styles.container}>
          <div className={styles.topInner}>
            <div className={styles.topNav}>
              <div className={styles.logo}>
                {logoSrc ? (
                  <img width={295} height={74} alt={brandName} src={logoSrc} loading="lazy" className={styles.logoImg} />
                ) : (
                  <svg viewBox="0 0 295 74" fill="none" aria-label={brandName} className={styles.logoImg}>
                    <circle cx="37" cy="37" r="31" fill="currentColor" />
                    <path d="M24 27c5 0 10 1.8 13 5v20c-3.5-2.5-8-3.8-13-3.8-2 0-3.8.3-5 .8V28c1.5-.6 3.2-1 5-1Zm26 0c-5 0-10 1.8-13 5v20c3.5-2.5 8-3.8 13-3.8 2 0 3.8.3 5 .8V28c-1.5-.6-3.2-1-5-1Z" fill="var(--rk-bc-violet)" />
                    <text x="82" y="48" fill="currentColor" fontFamily="var(--rk-font-display)" fontWeight="800" fontSize="30">{brandName}</text>
                  </svg>
                )}
              </div>
              {showAppBadges ? (
                <div className={styles.cta}>
                  <BookclubAppBadges variant="outline" appStoreHref={appStoreHref} googlePlayHref={googlePlayHref} appStoreImageSrc={appStoreImageSrc} googlePlayImageSrc={googlePlayImageSrc} />
                </div>
              ) : null}
              {showSocials ? (
                <div className={styles.socials}>
                  {socials.map((s) => <BookclubSocialButton key={s.platform + s.href} platform={s.platform} href={s.href} ariaLabel={s.ariaLabel} size="big" />)}
                </div>
              ) : null}
              <div className={styles.links}>
                {legalLinks.map((l) => (
                  <a key={l.label} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className={styles.link}>
                    <span className={styles.bottomText}>{l.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {showNewsletter ? (
              <div className={styles.topForm}>
                <h3 className={styles.formTitle}>{newsletterHeading}</h3>
                <div className={styles.form}>
                  {status !== "success" ? (
                    <form onSubmit={handleSubmit} noValidate className={styles.formGroup}>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="rk-footer-email" className={styles.screenReader}>{emailAriaLabel}</label>
                        <input id="rk-footer-email" className={styles.input} maxLength={256} name="EMAIL" placeholder={emailPlaceholder} type="email" required value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }} />
                      </div>
                      <div data-hover="" className={styles.submitGroup}>
                        <BookclubBouncyCta label={subscribeLabel} asDiv />
                        <input type="submit" aria-label={subscribeLabel} className={styles.submitBtn} value={subscribeLabel} />
                      </div>
                    </form>
                  ) : (
                    <div className={styles.successMsg}>{successLine1}<br />{successLine2}</div>
                  )}
                  {status === "error" ? <div className={styles.errorMsg}>{errorText}</div> : null}
                </div>
              </div>
            ) : null}

            <div className={styles.mobBottom}>
              <div className={styles.mobLinks}>
                {legalLinks.map((l) => (
                  <a key={l.label} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} className={styles.link}>
                    <span className={styles.bottomText}>{l.label}</span>
                  </a>
                ))}
              </div>
              {showSocials ? (
                <div className={styles.mobSocials}>
                  {socials.map((s) => <BookclubSocialButton key={s.platform + s.href} platform={s.platform} href={s.href} ariaLabel={s.ariaLabel} />)}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div data-footer-bottom="" className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.bottomInner}>
            <div className={styles.bottomCopy}><span className={styles.bottomText}>{copyrightText}</span></div>
            {showCredits ? (
              <div className={styles.bottomCredit}>
                {creditLinks.map((c) => (
                  <a key={c.label} href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener noreferrer" : undefined} className={styles.link}>
                    <span className={styles.bottomText}>{c.label}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.visualWrap}>
          {visualImageSrc ? (
            <img className={styles.visualImg} src={visualImageSrc} width={630} height={789} data-footer-visual="" alt={visualAlt} loading="lazy" />
          ) : (
            <svg viewBox="0 0 630 789" fill="none" aria-hidden="true" data-footer-visual="" className={styles.visualImg}>
              <rect x="95" y="130" width="440" height="540" rx="48" fill="var(--rk-bc-black)" />
              <rect x="115" y="150" width="400" height="500" rx="36" fill="var(--rk-bc-bright-pink)" />
              <circle cx="315" cy="405" r="96" fill="var(--rk-bc-yellow)" />
            </svg>
          )}
        </div>
      </div>
      <div data-footer-overlay="" className={styles.overlay} />
    </footer>
  );
}
