"use client";

import { useState } from "react";
import { MagneticButton } from "./component";

function ArrowDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="5 12 12 19 19 12" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export default function MagneticButtonPreview() {
  const [clicks, setClicks] = useState(0);

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-6 p-6 sm:p-10"
      style={{ fontFamily: "var(--rk-font-body)" }}
    >
      <div
        className="flex w-full max-w-2xl flex-col items-center justify-center gap-5 rounded-[24px] px-8 py-14 text-center"
        style={{
          backgroundColor: "var(--rk-fg)",
          color: "var(--rk-bg)",
        }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.15em]"
          style={{
            color: "color-mix(in srgb, var(--rk-bg) 56%, transparent)",
          }}
        >
          Primary Magnetic Pill CTA
        </span>
        <div>
          <MagneticButton
            variant="primary"
            icon={<ArrowDownIcon />}
            data-magnetic-demo="primary"
            onClick={() => setClicks((count) => count + 1)}
          >
            Join waitlist
          </MagneticButton>
        </div>
        {clicks > 0 && (
          <span
            className="text-xs font-medium"
            style={{
              color: "color-mix(in srgb, var(--rk-bg) 60%, transparent)",
            }}
          >
            Activated {clicks} {clicks === 1 ? "time" : "times"}
          </span>
        )}
      </div>

      <div
        className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-4 rounded-[24px] p-8"
        style={{
          backgroundColor: "var(--rk-surface)",
          border: "1px solid var(--rk-border)",
        }}
      >
        <MagneticButton variant="light">Sign Up</MagneticButton>
        <MagneticButton variant="accent" icon={<ArrowUpRightIcon />}>
          Contact
        </MagneticButton>
        <MagneticButton variant="surface">Watch Demo</MagneticButton>
        <MagneticButton variant="outline" intensity={0.35}>
          Hover &amp; Pull
        </MagneticButton>
      </div>
    </div>
  );
}
