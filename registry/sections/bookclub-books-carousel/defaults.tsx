import type { BookclubBookItem } from "./component";
import styles from "./styles.module.css";

export const DEFAULT_BOOKS: BookclubBookItem[] = [
  {
    id: "solstice-house",
    title: "Solstice",
    description: "A darkly atmospheric tale of inheritance, memory, and transformation set on a windswept northern coast.",
    cardColor: "var(--rk-bc-wine)",
    textTone: "light",
    href: "#books",
    tags: [
      { label: "Horror", bgColor: "var(--rk-bc-black)", textColor: "white" },
      { label: "Gothic", bgColor: "var(--rk-bc-periwinkle)", textColor: "white" },
    ],
  },
  {
    id: "sunlit-archive",
    title: "The Sunlit Archive",
    description: "Two rival archivists race across coastal libraries to decode a century-old ledger of missing editions.",
    cardColor: "var(--rk-bc-pale-yellow)",
    textTone: "dark",
    href: "#books",
    tags: [
      { label: "Mystery", bgColor: "var(--rk-bc-cyan)", textColor: "black" },
      { label: "Literary", bgColor: "var(--rk-bc-magenta)", textColor: "white" },
    ],
  },
  {
    id: "glass-harbor",
    title: "Glass Harbor",
    description: "An inventive debut blending maritime folklore and sharp family drama over one unforgettable winter.",
    cardColor: "var(--rk-bc-magenta)",
    textTone: "light",
    href: "#books",
    tags: [
      { label: "Debut", bgColor: "var(--rk-bc-cyan)", textColor: "black" },
      { label: "Historical", bgColor: "var(--rk-bc-orange)", textColor: "black" },
    ],
  },
  {
    id: "signal-coast",
    title: "Signal on the Coast",
    description: "A warm, witty exploration of community radio, strange frequencies, and second chances in a small town.",
    cardColor: "var(--rk-bc-violet)",
    textTone: "light",
    href: "#books",
    tags: [
      { label: "Sci-Fi", bgColor: "var(--rk-bc-pale-green)", textColor: "black" },
      { label: "Satire", bgColor: "var(--rk-bc-yellow)", textColor: "black" },
    ],
  },
];

export function DefaultBookCover({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 320 493" fill="none" aria-hidden="true" className={styles.itemImg}>
      <rect width="320" height="493" fill="var(--rk-bc-soft-pink)" />
      <circle cx="160" cy="210" r="96" fill="var(--rk-bc-yellow)" />
      <rect x="44" y="340" width="232" height="18" rx="9" fill="var(--rk-bc-black)" opacity="0.2" />
      <rect x="76" y="374" width="168" height="14" rx="7" fill="var(--rk-bc-black)" opacity="0.14" />
      <text x="160" y="218" textAnchor="middle" fill="var(--rk-bc-black)" fontFamily="var(--rk-font-display)" fontWeight="700" fontSize="22">
        {title.slice(0, 14)}
      </text>
    </svg>
  );
}
