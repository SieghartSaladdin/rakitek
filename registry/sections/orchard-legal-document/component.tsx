"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface OrchardLegalTable {
  head: string[];
  rows: string[][];
}

export interface OrchardLegalAction {
  label: string;
  onClick?: () => void;
}

export interface OrchardLegalSection {
  heading: string;
  /** Rich paragraphs (inline links and emphasis allowed). */
  paragraphs?: ReactNode[];
  bullets?: ReactNode[];
  /** Paragraphs rendered after the bullet list and the table. */
  after?: ReactNode[];
  table?: OrchardLegalTable;
  /** Pill button rendered after the content, e.g. "Edit cookie preferences". */
  action?: OrchardLegalAction;
}

export interface OrchardLegalDocumentProps {
  id?: string;
  title?: string;
  /** Small muted line under the title, e.g. the last update date. */
  meta?: string;
  sections?: OrchardLegalSection[];
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_SECTIONS: OrchardLegalSection[] = [
  {
    heading: "1. Data controller",
    paragraphs: [
      <>
        Example Orchard Ltd., 12 Example Street, 00100 Sample City. For any request about your personal data:{" "}
        <a href="mailto:hello@example.com">hello@example.com</a>.
      </>,
    ],
  },
  {
    heading: "2. Cookies we use",
    table: {
      head: ["Name", "Purpose", "Category", "Duration"],
      rows: [
        ["session", "Keeps the page language between visits.", "Necessary", "Session"],
        ["analytics", "Counts anonymous visits.", "Analytics", "13 months"],
      ],
    },
    action: { label: "Edit cookie preferences" },
  },
];

export function OrchardLegalDocument({
  id,
  title = "Privacy & Cookie Policy",
  meta = "Last updated: 1 January 2026",
  sections = DEFAULT_SECTIONS,
  ariaLabel,
  className,
}: OrchardLegalDocumentProps) {
  return (
    <div id={id} className={className ? `${styles.legal} ${className}` : styles.legal} aria-label={ariaLabel}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {meta ? <p className={styles.meta}>{meta}</p> : null}
        {sections.map((section, i) => (
          <section key={i} className={styles.section}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
            {section.bullets?.length ? (
              <ul>
                {section.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            ) : null}
            {section.table ? (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {section.table.head.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {section.after?.map((p, j) => <p key={`a${j}`}>{p}</p>)}
            {section.action ? (
              <p>
                <button type="button" className={styles.button} onClick={section.action.onClick}>
                  {section.action.label}
                </button>
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
