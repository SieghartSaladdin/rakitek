"use client";

import { BookclubGenreShowcase } from "./component";

export default function BookclubGenreShowcasePreview() {
  return (
    <BookclubGenreShowcase
      id="genres"
      title="Choose from"
      handwrittenNote="We've got a book for every kind of reader"
      showHandwrittenNote
      genres={[
        { label: "Horror" },
        { label: "Science Fiction" },
        { label: "Romance" },
        { label: "Thriller" },
        { label: "Literary Fiction" },
        { label: "Fantasy" },
        { label: "Gothic Fiction" },
        { label: "Historical Fiction" },
        { label: "Magical Realism" },
        { label: "Contemporary Fiction", hasWordBreak: true },
        { label: "and more!" },
      ]}
      popupTitle="Want to join the Club?"
      popupCtaLabel="Sign-up now!"
      popupCtaHref="#signup"
      showPopup
    />
  );
}
