"use client";

import { BookclubMascotPopup } from "./component";

export default function BookclubMascotPopupPreview() {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-6 rounded-xl p-10"
      style={{ backgroundColor: "var(--rk-bc-yellow, var(--rk-accent))" }}
    >
      <BookclubMascotPopup
        title="Want to join the Club?"
        ctaLabel="Sign-up now!"
        ctaHref="#signup"
        variant="left"
        tone="light"
        defaultOpen
      />
      <BookclubMascotPopup
        title="Ready to start reading?"
        ctaLabel="Join today!"
        ctaHref="#join"
        variant="right"
        tone="pink"
        defaultOpen={false}
      />
    </div>
  );
}
