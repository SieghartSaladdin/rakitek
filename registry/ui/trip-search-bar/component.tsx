"use client";

import type { MouseEvent, RefObject } from "react";
import styles from "./styles.module.css";

export type TripSearchStep = "results" | "dates" | "destinations" | null;

export interface TripSearchBarProps {
  isClicky?: boolean;
  inModal?: boolean;
  activeStep?: TripSearchStep;
  query?: string;
  onQueryChange?: (val: string) => void;
  onQueryClear?: () => void;
  dateLabel?: string;
  hasCustomDate?: boolean;
  onDateClear?: () => void;
  destinationLabel?: string;
  submitHref?: string;
  onSelectStep?: (step: Exclude<TripSearchStep, null>) => void;
  onSubmitClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  onEnterQuery?: () => void;
  queryTitle?: string;
  queryPlaceholder?: string;
  datesTitle?: string;
  destinationsTitle?: string;
  clearLabel?: string;
  submitAriaLabel?: string;
  className?: string;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" fill="none" aria-hidden="true" className={className}>
      <circle
        cx="11.3137"
        cy="11.3137"
        r="7"
        transform="rotate(-45 11.3137 11.3137)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21.2115 22.6274C21.602 23.0179 22.2352 23.0179 22.6257 22.6274C23.0162 22.2369 23.0162 21.6037 22.6257 21.2132L21.2115 22.6274ZM15.5546 16.9705L21.2115 22.6274L22.6257 21.2132L16.9688 15.5563L15.5546 16.9705Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TripSearchBar({
  isClicky = false,
  inModal = false,
  activeStep = null,
  query = "",
  onQueryChange,
  onQueryClear,
  dateLabel = "Preferred dates",
  hasCustomDate = false,
  onDateClear,
  destinationLabel = "All destinations",
  submitHref = "#search",
  onSelectStep,
  onSubmitClick,
  inputRef,
  onEnterQuery,
  queryTitle = "Search",
  queryPlaceholder = "A region, a city...",
  datesTitle = "When",
  destinationsTitle = "Where",
  clearLabel = "Clear",
  submitAriaLabel = "Run search",
  className = "",
}: TripSearchBarProps) {
  const rootCls = [
    styles.searchBar,
    isClicky ? styles.isClicky : "",
    inModal ? styles.inModal : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls}>
      <div
        role="button"
        tabIndex={0}
        data-search-field="results"
        className={`${styles.label} ${styles.labelWithDivider} ${!isClicky ? styles.hasClear : ""} ${activeStep === "results" ? styles.isSelected : ""}`.trim()}
        onClick={() => onSelectStep?.("results")}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelectStep?.("results");
        }}
      >
        <div className={styles.labelTitle}>{queryTitle}</div>
        <div className={styles.labelValue}>
          {isClicky ? (
            <span>{query || queryPlaceholder}</span>
          ) : (
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder={queryPlaceholder}
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onEnterQuery?.();
                }
              }}
              aria-label={queryPlaceholder}
            />
          )}
        </div>
        {!isClicky && query ? (
          <button
            type="button"
            className={`${styles.clearBtn} ${styles.isEditedVisible}`}
            onClick={(e) => {
              e.stopPropagation();
              onQueryClear?.();
            }}
          >
            {clearLabel}
          </button>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        data-search-field="dates"
        className={`${styles.label} ${styles.labelWithDivider} ${styles.labelHideMobile} ${!isClicky ? styles.hasClear : ""} ${activeStep === "dates" ? styles.isSelected : ""}`.trim()}
        onClick={() => onSelectStep?.("dates")}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelectStep?.("dates");
        }}
      >
        <div className={styles.labelTitle}>{datesTitle}</div>
        <div className={styles.labelValue}>{dateLabel}</div>
        {!isClicky && hasCustomDate ? (
          <button
            type="button"
            className={`${styles.clearBtn} ${styles.isEditedVisible}`}
            onClick={(e) => {
              e.stopPropagation();
              onDateClear?.();
            }}
          >
            {clearLabel}
          </button>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        data-search-field="destinations"
        className={`${styles.label} ${styles.labelHideMobile} ${activeStep === "destinations" ? styles.isSelected : ""}`.trim()}
        onClick={() => onSelectStep?.("destinations")}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelectStep?.("destinations");
        }}
      >
        <div className={styles.labelTitle}>{destinationsTitle}</div>
        <div className={styles.labelValue}>{destinationLabel}</div>
      </div>

      <a
        href={submitHref}
        className={styles.submit}
        aria-label={submitAriaLabel}
        onClick={(e) => {
          e.stopPropagation();
          onSubmitClick?.(e);
        }}
      >
        <SearchIcon className={styles.submitIcon} />
      </a>
    </div>
  );
}
