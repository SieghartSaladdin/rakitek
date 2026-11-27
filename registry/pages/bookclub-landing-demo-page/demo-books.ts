import type { BookclubBookItem } from "@registry/sections/bookclub-books-carousel/component";
import type { BookclubWinnerItem } from "@registry/sections/bookclub-choice-winners/component";

export const DEMO_MONTHLY_BOOKS: BookclubBookItem[] = [
  {
    id: "solstice-house",
    title: "The Solstice House",
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
    description: "A blood-soaked love story of rage, revenge, and belonging inside an isolated coastal library.",
    cardColor: "#dddf20",
    textTone: "dark",
    href: "#books",
    tags: [
      { label: "Romance", bgColor: "#ff008f", textColor: "white" },
      { label: "Fantasy", bgColor: "#9e81e4", textColor: "white" },
      { label: "Mystery", bgColor: "#006fff", textColor: "white" },
    ],
  },
  {
    id: "jade-winter",
    title: "Jade & Winter",
    description: "A young scholar makes a bargain with a shapeshifting spirit who promises power in this historical fantasy.",
    cardColor: "#d74a5a",
    textTone: "light",
    href: "#books",
    tags: [
      { label: "Debut Novel", bgColor: "#00ecef", textColor: "black" },
      { label: "Fantasy", bgColor: "#9e81e4", textColor: "white" },
      { label: "Historical", bgColor: "#ff9d00", textColor: "black" },
    ],
  },
  {
    id: "signal-midwest",
    title: "Signals of Ohio",
    description: "A heartfelt exploration of a strange transmission in a small town with big secrets.",
    cardColor: "#5a8aab",
    textTone: "light",
    href: "#books",
    tags: [
      { label: "Sci-Fi", bgColor: "#00e500", textColor: "black" },
      { label: "Satire", bgColor: "#897400", textColor: "white" },
    ],
  },
  {
    id: "stations-north",
    title: "Stations",
    description: "A woman is haunted by the unsettled boy who befriended her as a teenager, long after he drifts out of reach.",
    cardColor: "#d7bbda",
    textTone: "dark",
    href: "#books",
    tags: [{ label: "Literary", bgColor: "#71002e", textColor: "white" }],
  },
  {
    id: "people-here",
    title: "There Used to Be People",
    description: "In 1970s Mississippi, a detective duo takes a case that shifts from mystery to paranormal conspiracy.",
    cardColor: "#081424",
    textTone: "light",
    href: "#books",
    tags: [
      { label: "Debut Novel", bgColor: "#00ecef", textColor: "black" },
      { label: "Thriller", bgColor: "#3d3195", textColor: "white" },
    ],
  },
];

export const DEMO_WINNERS: BookclubWinnerItem[] = [
  { id: "2026-upcoming", yearTop: "20", yearBottom: "26", coverAlt: "Next voting round: Fall 2026", nextVotingLabel: "Next voting round: Fall 2026" },
  { id: "2025-winner", yearTop: "20", yearBottom: "25", coverAlt: "The Lantern Keepers (2025 Members' Choice Winner)", authorName: "Maren Vance", href: "#winners" },
  { id: "2024-winner", yearTop: "20", yearBottom: "24", coverAlt: "Salt & Cypress (2024 Members' Choice Winner)", authorName: "Devon Okafor", href: "#winners" },
  { id: "2023-winner", yearTop: "20", yearBottom: "23", coverAlt: "Glass Meridian (2023 Members' Choice Winner)", authorName: "Soren Hale", href: "#winners" },
];
