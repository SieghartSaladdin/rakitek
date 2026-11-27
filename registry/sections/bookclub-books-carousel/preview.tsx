"use client";

import { BookclubBooksCarousel } from "./component";

export default function BookclubBooksCarouselPreview() {
  return (
    <BookclubBooksCarousel
      id="books"
      title="Our Nov books"
      subtitle="We drop new books on the 1st of every month. Call us creatures of habit."
      handwrittenNote="Discover hidden gems and buzzy new releases"
      showHandwrittenNote
      readMoreLabel="Read more"
      prevAriaLabel="Previous Slide"
      nextAriaLabel="Next Slide"
      showControls
      books={[
        {
          id: "solstice-house",
          title: "Solstice",
          description: "A dark, seductive tale of hunger, love, and transformation on a windswept northern coast.",
          cardColor: "#5e0f12",
          textTone: "light",
          href: "#books",
          tags: [
            { label: "Horror", bgColor: "#000000", textColor: "white" },
            { label: "LGBTQIA+", bgColor: "#e6ff2b", textColor: "black" },
            { label: "Gothic", bgColor: "#7b50d1", textColor: "white" },
          ],
        },
        {
          id: "sunlit-archive",
          title: "The Sunlit Archive",
          description: "A fast-paced dual-timeline mystery of rage, devotion, and belonging inside a coastal archive.",
          cardColor: "#dddf20",
          textTone: "dark",
          href: "#books",
          tags: [
            { label: "Romance", bgColor: "#ff008f", textColor: "white" },
            { label: "Fantasy", bgColor: "#9e81e4", textColor: "white" },
            { label: "Mystery", bgColor: "#006fff", textColor: "white" },
            { label: "Book Club Pick", bgColor: "#000000", textColor: "white" },
          ],
        },
        {
          id: "jade-winter",
          title: "Jade & Winter",
          description: "A young scholar makes a bargain with a shapeshifting spirit in this historical fantasy debut.",
          cardColor: "#d74a5a",
          textTone: "light",
          href: "#books",
          tags: [
            { label: "Debut Novel", bgColor: "#00ecef", textColor: "black" },
            { label: "Historical", bgColor: "#ff9d00", textColor: "black" },
          ],
        },
        {
          id: "signal-ohio",
          title: "Monsters of the Midwest",
          description: "A heartfelt satirical exploration of small-town mysteries and unexpected alliances.",
          cardColor: "#5a8aab",
          textTone: "light",
          href: "#books",
          tags: [
            { label: "Sci-Fi", bgColor: "#00e500", textColor: "black" },
            { label: "Satire", bgColor: "#897400", textColor: "white" },
          ],
        },
      ]}
    />
  );
}
