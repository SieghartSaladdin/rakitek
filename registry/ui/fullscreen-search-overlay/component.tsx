"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import { TripSearchBar, type TripSearchStep } from "@registry/ui/trip-search-bar/component";
import { DateRangeCalendar } from "./date-range-calendar";
import styles from "./styles.module.css";

export interface SearchSuggestionItem {
  title: string;
  meta: string;
}

export interface SearchDurationOption {
  range: string;
  label: string;
}

export interface SearchDestinationOption {
  id: string;
  label: string;
  href: string;
}

export interface FullscreenSearchOverlayProps {
  isOpen: boolean;
  initialStep?: TripSearchStep;
  onClose?: () => void;
  query?: string;
  onQueryChange?: (val: string) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  onDatesChange?: (start: Date | null, end: Date | null) => void;
  durationRange?: string;
  onDurationChange?: (range: string) => void;
  selectedDestinationHref?: string;
  selectedDestinationLabel?: string;
  onDestinationChange?: (href: string, label: string) => void;
  suggestions?: SearchSuggestionItem[];
  durations?: SearchDurationOption[];
  destinations?: SearchDestinationOption[];
  submitHref?: string;
  dateLabel?: string;
  onSubmitSearch?: () => void;
}

const DEFAULT_SUGGESTIONS: SearchSuggestionItem[] = [
  { title: "Kyoto Heritage & Coastal Rail", meta: "Japan · 16 d" },
  { title: "Rhone Valley & Riviera Escapade", meta: "France · 18 d" },
  { title: "Andalusia & Atlantic Coast", meta: "Spain · 18 d" },
  { title: "Sicily & Southern Cliffs", meta: "Italy · 16 d" },
  { title: "Alpine Peaks & Pacific Coast", meta: "Canada · 13 d" },
  { title: "Savanna Reserve Safari", meta: "Kenya · 14 d" },
];

const DEFAULT_DURATIONS: SearchDurationOption[] = [
  { range: "0-999", label: "All durations" },
  { range: "1-7", label: "1 to 7 days" },
  { range: "8-14", label: "8 to 14 days" },
  { range: "15-999", label: "15+ days" },
];

const DEFAULT_DESTINATIONS: SearchDestinationOption[] = [
  { id: "all", label: "All destinations", href: "#all" },
  { id: "africa", label: "Africa", href: "#africa" },
  { id: "asia", label: "Asia", href: "#asia" },
  { id: "europe", label: "Europe", href: "#europe" },
];

export function FullscreenSearchOverlay({
  isOpen,
  initialStep = "results",
  onClose,
  query = "",
  onQueryChange,
  startDate = null,
  endDate = null,
  onDatesChange,
  durationRange = "0-999",
  onDurationChange,
  selectedDestinationHref = "#all",
  selectedDestinationLabel = "All destinations",
  onDestinationChange,
  suggestions = DEFAULT_SUGGESTIONS,
  durations = DEFAULT_DURATIONS,
  destinations = DEFAULT_DESTINATIONS,
  submitHref = "#search",
  dateLabel = "Preferred dates",
  onSubmitSearch,
}: FullscreenSearchOverlayProps) {
  const [activeStep, setActiveStep] = useState<TripSearchStep>(initialStep);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) setActiveStep(initialStep ?? "results");
  }, [isOpen, initialStep]);

  useEffect(() => {
    if (isOpen && activeStep === "results") {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [isOpen, activeStep]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const filteredSuggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return suggestions.slice(0, 6);
    return suggestions
      .filter((s) => s.title.toLowerCase().includes(needle) || s.meta.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [query, suggestions]);

  return (
    <search className={`${styles.overlay} ${isOpen ? styles.isOpen : ""}`.trim()} aria-label="Trip search">
      <div className={styles.inner}>
        <TripSearchBar
          inModal
          className={styles.bar}
          activeStep={activeStep}
          query={query}
          onQueryChange={onQueryChange}
          onQueryClear={() => onQueryChange?.("")}
          dateLabel={dateLabel}
          hasCustomDate={Boolean(startDate && endDate)}
          onDateClear={() => {
            onDatesChange?.(null, null);
            onDurationChange?.("0-999");
          }}
          destinationLabel={selectedDestinationLabel}
          submitHref={submitHref}
          onSelectStep={(step) => setActiveStep(step)}
          onSubmitClick={(e) => {
            onSubmitSearch?.();
            if (submitHref.startsWith("#")) e.preventDefault();
            onClose?.();
          }}
          inputRef={inputRef}
          onEnterQuery={() => setActiveStep("dates")}
        />

        <div data-step="results" className={`${styles.step} ${activeStep !== "results" ? styles.stepHidden : ""}`.trim()}>
          <div className={styles.autocompleteList}>
            {filteredSuggestions.map((item) => (
              <button
                key={item.title}
                type="button"
                className={styles.autocompleteItem}
                onClick={() => {
                  onQueryChange?.(item.title);
                  setActiveStep("dates");
                }}
              >
                <span>{item.title}</span>
                <span className={styles.autocompleteMeta}>{item.meta}</span>
              </button>
            ))}
          </div>
        </div>

        <div data-step="dates" className={`${styles.step} ${activeStep !== "dates" ? styles.stepHidden : ""}`.trim()}>
          <DateRangeCalendar
            startDate={startDate}
            endDate={endDate}
            onSelectRange={(s, e) => onDatesChange?.(s, e)}
          />
          <div className={styles.durations}>
            {durations.map((dur) => (
              <button
                key={dur.range}
                type="button"
                className={`${styles.tag} ${durationRange === dur.range ? styles.tagSelected : ""}`.trim()}
                onClick={() => onDurationChange?.(dur.range)}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        <div data-step="destinations" className={`${styles.step} ${activeStep !== "destinations" ? styles.stepHidden : ""}`.trim()}>
          <div className={styles.destinationsGrid}>
            {destinations.map((dest) => (
              <button
                key={dest.id}
                type="button"
                className={`${styles.destinationBtn} ${selectedDestinationHref === dest.href ? styles.destSelected : ""}`.trim()}
                onClick={() => onDestinationChange?.(dest.href, dest.label)}
              >
                <span className={styles.destinationIcon} aria-hidden="true">
                  {dest.label.slice(0, 2).toUpperCase()}
                </span>
                <span>{dest.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <RollingCtaButton
        isClose
        isFixed
        isWhite
        ariaLabel="Close search"
        className={styles.closeBtn}
        onClick={onClose}
      />
    </search>
  );
}
