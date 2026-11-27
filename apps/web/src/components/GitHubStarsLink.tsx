"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

const REPO_URL = "https://github.com/SieghartSaladdin/rakitek";

let sharedStars: number | null | undefined;
let inflightRequest: Promise<number | null> | null = null;

function fetchStars(): Promise<number | null> {
  if (sharedStars !== undefined) {
    return Promise.resolve(sharedStars);
  }
  if (!inflightRequest) {
    inflightRequest = fetch("/api/github-stars")
      .then((res) => (res.ok ? (res.json() as Promise<{ stars?: unknown }>) : null))
      .then((data) => {
        const value = typeof data?.stars === "number" ? data.stars : null;
        sharedStars = value;
        return value;
      })
      .catch(() => {
        sharedStars = null;
        return null;
      })
      .finally(() => {
        inflightRequest = null;
      });
  }
  return inflightRequest;
}

function formatStarCount(count: number): string {
  if (count >= 1000) {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    })
      .format(count)
      .toLowerCase();
  }
  return String(count);
}

interface GitHubStarsLinkProps {
  variant?: "pill" | "sidebar";
}

export function GitHubStarsLink({ variant = "pill" }: GitHubStarsLinkProps) {
  const { copy } = useLanguage();
  const [stars, setStars] = useState<number | null | undefined>(sharedStars);

  useEffect(() => {
    let active = true;
    fetchStars().then((value) => {
      if (active) setStars(value);
    });
    return () => {
      active = false;
    };
  }, []);

  const hasCount = typeof stars === "number";
  const ariaLabel = hasCount
    ? copy.common.githubStarsAria(stars)
    : copy.common.githubAria;

  const githubIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );

  const starIcon = (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0 text-amber-300"
    >
      <path d="M12 2.5l2.92 5.91 6.53.95-4.72 4.6 1.11 6.5L12 17.38 6.16 20.46l1.11-6.5-4.72-4.6 6.53-.95L12 2.5Z" />
    </svg>
  );

  if (variant === "sidebar") {
    return (
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-lg border border-white/12 bg-white/[0.04] px-3 text-xs text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/[0.1] hover:text-white active:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="inline-flex items-center gap-2 font-medium">
          {githubIcon}
          <span>GitHub</span>
        </span>
        {hasCount ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-zinc-200">
            {starIcon}
            <span>{formatStarCount(stars)}</span>
          </span>
        ) : (
          <span className="font-mono text-[10px] text-zinc-400" aria-hidden="true">
            ↗
          </span>
        )}
      </a>
    );
  }

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="pointer-events-auto inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 text-xs font-medium text-zinc-100 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/[0.12] hover:text-white active:bg-white/[0.16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {githubIcon}
      <span className="hidden sm:inline">GitHub</span>
      {hasCount ? (
        <>
          <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-white">
            {starIcon}
            <span>{formatStarCount(stars)}</span>
          </span>
        </>
      ) : null}
    </a>
  );
}
