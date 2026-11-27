"use client";

import { NotchedButton } from "./component";

export default function NotchedButtonPreview() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        padding: 24,
        background: "var(--rk-bg)",
      }}
    >
      <div>
        <NotchedButton variant="filled" size="lg" href="#newsletter">
          Subscribe
        </NotchedButton>
      </div>
      <NotchedButton variant="outline" size="lg" href="#schedule">
        Timetable
      </NotchedButton>
      <NotchedButton variant="outline" size="md" href="#talks" arrow>
        View all talks
      </NotchedButton>
      <NotchedButton variant="filled" size="sm" href="#tickets">
        Tickets
      </NotchedButton>
      <div>
        <NotchedButton variant="outline" size="sm" href="#access" ariaLabel="More info" arrow>
          More info
        </NotchedButton>
      </div>
      <NotchedButton variant="outline" size="sm" disabled>
        Sold out
      </NotchedButton>
    </div>
  );
}
