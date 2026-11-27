"use client";

import { TicketMarqueeBar } from "./component";

export default function TicketMarqueeBarPreview() {
  return (
    <div style={{ padding: "96px 0", background: "var(--rk-bg)" }}>
      <TicketMarqueeBar
        id="ticket-bar"
        label="GET TICKETS"
        href="#tickets"
        repeat={32}
        onClick={(event) => event.preventDefault()}
      />
    </div>
  );
}
