"use client";

import type { MouseEvent } from "react";
import { RollingCtaButton } from "./component";

export default function RollingCtaButtonPreview() {
  const preventNav = (e: MouseEvent<HTMLElement>) => e.preventDefault();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "32px",
        padding: "48px 24px",
        background: "var(--rk-bg)",
        color: "var(--rk-fg)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex" }}>
          <RollingCtaButton
            href="#destinations"
            label="View all"
            variant="primary"
            minWide
            data-testid="primary"
            onClick={preventNav}
          />
        </div>
        <div style={{ display: "flex" }}>
          <RollingCtaButton
            href="#partners"
            label="Learn more"
            variant="secondary"
            minWide
            data-testid="secondary"
            onClick={preventNav}
          />
        </div>
        <div style={{ display: "flex" }}>
          <RollingCtaButton
            href="#portal"
            label="Travel agent space"
            variant="primary"
            isFixed
            isSmall
            data-testid="small-fixed"
            onClick={preventNav}
          />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <RollingCtaButton
          isArrow
          direction="left"
          ariaLabel="Previous slide"
          arrowSize="lg"
          data-testid="arrow-left"
        />
        <span style={{ display: "inline-block", width: "12px" }} />
        <RollingCtaButton
          isArrow
          direction="right"
          ariaLabel="Next slide"
          arrowSize="lg"
          data-testid="arrow-right"
        />
        <span style={{ display: "inline-block", width: "12px" }} />
        <RollingCtaButton
          isClose
          isFixed
          ariaLabel="Close modal"
          data-testid="close-btn"
        />
      </div>
    </div>
  );
}
