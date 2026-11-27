"use client";

import { useState } from "react";
import { NotchedButton } from "@registry/ui/notched-button/component";
import foot from "./drawer-footer.module.css";
import styles from "./drawer.module.css";

export interface NavLeaf {
  label: string;
  href: string;
  newTab?: boolean;
  children?: readonly NavLeaf[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  items: readonly NavLeaf[];
  menuLabel: string;
  closeLabel: string;
  ctaLabel?: string;
  ctaHref?: string;
  socials?: readonly SocialLink[];
}

function Chevron({ expanded, small }: { expanded: boolean; small?: boolean }) {
  const classes = [small ? styles.chevronSmall : styles.chevron, expanded ? styles.flipped : ""];
  return (
    <svg
      className={classes.filter(Boolean).join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function externalProps(item: NavLeaf) {
  const external = item.newTab ?? /^https?:/.test(item.href);
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export function MenuDrawer({
  open,
  onClose,
  items,
  menuLabel,
  closeLabel,
  ctaLabel,
  ctaHref = "#",
  socials = [],
}: MenuDrawerProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [openSubgroups, setOpenSubgroups] = useState<string[]>([]);

  const toggle = (list: string[], key: string) =>
    list.includes(key) ? list.filter((entry) => entry !== key) : [...list, key];

  return (
    <>
      <div
        className={open ? `${styles.drawer} ${styles.open}` : styles.drawer}
        aria-hidden={!open}
        role="dialog"
        aria-label={menuLabel}
      >
        <div className={styles.top}>
          <span className={styles.menuLabel}>{menuLabel}</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
            <svg
              className={styles.closeIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {items.map((group) => {
            const expanded = openGroups.includes(group.href + group.label);
            return (
              <div key={group.href + group.label} className={styles.group}>
                {group.children ? (
                  <button
                    type="button"
                    className={styles.groupTitle}
                    aria-expanded={expanded}
                    onClick={() => setOpenGroups((prev) => toggle(prev, group.href + group.label))}
                  >
                    {group.label}
                    <Chevron expanded={expanded} />
                  </button>
                ) : (
                  <a href={group.href} className={styles.groupLink} onClick={onClose}>
                    {group.label}
                  </a>
                )}

                {group.children && expanded ? (
                  <div className={styles.children}>
                    {group.children.map((child) => {
                      if (child.children) {
                        const subKey = `${group.label}/${child.label}`;
                        const subOpen = openSubgroups.includes(subKey);
                        return (
                          <div key={subKey}>
                            <button
                              type="button"
                              className={styles.subTitle}
                              aria-expanded={subOpen}
                              onClick={() => setOpenSubgroups((prev) => toggle(prev, subKey))}
                            >
                              {child.label}
                              <Chevron expanded={subOpen} small />
                            </button>
                            {subOpen ? (
                              <div className={styles.nested}>
                                {child.children.map((leaf) => (
                                  <a
                                    key={leaf.href + leaf.label}
                                    href={leaf.href}
                                    className={styles.leaf}
                                    onClick={onClose}
                                    {...externalProps(leaf)}
                                  >
                                    {leaf.label}
                                  </a>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      }
                      return (
                        <a
                          key={child.href + child.label}
                          href={child.href}
                          className={styles.leaf}
                          onClick={onClose}
                          {...externalProps(child)}
                        >
                          {child.label}
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}

          {ctaLabel ? (
            <div className={foot.cta}>
              <NotchedButton
                href={ctaHref}
                variant="inverse"
                size="md"
                className={foot.ctaButton}
                onClick={onClose}
              >
                {ctaLabel}
              </NotchedButton>
            </div>
          ) : null}
        </div>

        {socials.length > 0 ? (
          <div className={foot.socials}>
            <div className={foot.socialRow}>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={foot.social}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {open ? <div className={foot.backdrop} onClick={onClose} aria-hidden="true" /> : null}
    </>
  );
}
