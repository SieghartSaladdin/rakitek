"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export interface ManifestoLine {
  text: string;
  indent: string;
}

export interface EditorialManifestoChapterProps {
  id?: string;
  label?: string;
  chapter?: string;
  lines?: ManifestoLine[];
  body?: string;
  tone?: "dark" | "light";
  className?: string;
}

const DEFAULT_LINES: ManifestoLine[] = [
  { text: "The days keep", indent: "42.4vw" },
  { text: "passing. You", indent: "25.1vw" },
  { text: "keep watching them", indent: "17vw" },
  { text: "in the feed.", indent: "42.4vw" },
];

const DEFAULT_BODY =
  "Every routine repeats until the months blend into one blur. You plan to start the project, take the trip, build the habit, and somehow it waits for next Monday. Familiar patterns feel safe, which is the trap, because quiet repetition lets a full year pass with little to show for it.";

export function EditorialManifestoChapter({
  id,
  label = "About Pattern",
  chapter = "Chapter 01",
  lines = DEFAULT_LINES,
  body = DEFAULT_BODY,
  tone = "dark",
  className,
}: EditorialManifestoChapterProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = innerRef.current;

    if (prefersReduced || !el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sectionClasses = [
    styles.section,
    tone === "light" ? styles.toneLight : styles.toneDark,
    inView ? styles.in : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={sectionClasses}>
      <div className={styles.colontitle} aria-hidden="true">
        <span>{label}</span>
        <span className={styles.colontitleRight}>{chapter}</span>
      </div>
      <h2 className={styles.srOnly}>{lines.map((line) => line.text).join(" ")}</h2>
      <div className={styles.inner} ref={innerRef}>
        <div className={styles.head} aria-hidden="true">
          {lines.map((line, index) => (
            <div
              key={`${line.text}-${index}`}
              className={styles.line}
              style={{ marginLeft: line.indent }}
            >
              {line.text}
            </div>
          ))}
        </div>
        <p className={styles.body} data-label={label}>
          {body}
        </p>
      </div>
    </section>
  );
}
