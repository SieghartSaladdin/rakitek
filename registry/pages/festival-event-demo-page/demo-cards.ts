import type { LineupCard } from "@registry/sections/festival-lineup-section/component";
import type { ProgramTile } from "@registry/sections/program-tile-grid/component";

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export const PROGRAM_TILES: readonly ProgramTile[] = [
  {
    title: "TALKS",
    description: "40+ international speakers on creativity, technology and innovation.",
    imageSrc: img("1540575467063-178a50c2df87", 800),
    imageAlt: "Speaker on a lit stage",
    href: "#talks",
  },
  {
    title: "ART TRAIL",
    description: "20+ installations across the old town.",
    imageSrc: img("1492684223066-81342ee5ff30", 800),
    imageAlt: "Glowing installation in a courtyard",
    href: "#art-trail",
  },
  {
    title: "PLAYGROUND",
    description: "Interactive experiences, workshops and hands-on discoveries.",
    imageSrc: img("1511578314322-379afb476865", 800),
    imageAlt: "People trying an interactive exhibit",
    href: "#playground",
  },
  {
    title: "PARTIES",
    description: "3 nights of music, performance and celebration.",
    imageSrc: img("1470225620780-dba8ba36b745", 800),
    imageAlt: "DJ booth under colored lights",
    href: "#parties",
  },
  {
    title: "WORKSHOPS KIDS",
    description: "Creative hands-on workshops for the youngest explorers.",
    imageSrc: img("1503676260728-1c00da094a0b", 800),
    imageAlt: "Children building together at a table",
    href: "#kids",
  },
];

export const TALK_CARDS: readonly LineupCard[] = [
  { title: "Mira Okafor", subtitle: "Charts that breathe", location: "Norway", imageSrc: img("1540575467063-178a50c2df87"), href: "#talk-1" },
  { title: "Ines Varga & Theo Lund", subtitle: "Games as a dialogue with older knowledge, from ritual to interactive sound", location: "Spain", imageSrc: img("1475721027785-f74eccf877e2"), href: "#talk-2" },
  { title: "Sol Ademi", subtitle: "Every road leads to the studio", location: "Portugal", imageSrc: img("1505373877841-8d25f7d46678"), href: "#talk-3" },
  { title: "Kai Brennan", subtitle: "Seeing like a sensor", imageSrc: img("1511795409834-ef04bbd61622"), href: "#talk-4" },
  { title: "Nora Ilves & Jonas Weber", subtitle: "It is not you, it is us: reading client personas and working with them", companyStudio: "North Studio", location: "Canada", imageSrc: img("1559223607-a43c990c692c"), href: "#talk-5" },
  { title: "Pim de Wit", subtitle: "New work, old work", location: "Netherlands", imageSrc: img("1528605248644-14dd04022da1"), href: "#talk-6" },
];

export const TRAIL_CARDS: readonly LineupCard[] = [
  { title: "Lena Moreau", subtitle: "Cascade", imageSrc: img("1492684223066-81342ee5ff30"), href: "#work-1" },
  { title: "Arvid Holm", subtitle: "The life cycle of a cable", imageSrc: img("1561214115-f2f134cc4912"), href: "#work-2" },
  { title: "School of Media Design", subtitle: "Machines as family", imageSrc: img("1518998053901-5348d3961a04"), href: "#work-3" },
  { title: "Ada Ruiz, Jon Pell & Mae Ortiz", subtitle: "Mapping the invisible", imageSrc: img("1533158326339-7f3cf2404354"), href: "#work-4" },
  { title: "Vera Lind", subtitle: "Earthscapes / 35N, 135E", imageSrc: img("1500530855697-b586d89ba3ee"), href: "#work-5" },
  { title: "Rosa Dumont", subtitle: "What holds the living", imageSrc: img("1469474968028-56623f02e42e"), href: "#work-6" },
];

export const PLAYGROUND_CARDS: readonly LineupCard[] = [
  { title: "Indie Game Collection", imageSrc: img("1550745165-9bc0b252726f"), href: "#play-1" },
  { title: "Clara Monteil", imageSrc: img("1511512578047-dfb367046420"), href: "#play-2" },
  { title: "David Joris", imageSrc: img("1493711662062-fa541adb3fc8"), href: "#play-3" },
  { title: "Retro Arcade", imageSrc: img("1538481199705-c710c4e965fc"), href: "#play-4" },
  { title: "Loop Lab", imageSrc: img("1526374965328-7f61d4dc18c5"), href: "#play-5" },
  { title: "Julie Stern", subtitle: "Portugal", imageSrc: img("1535223289827-42f1e9919769"), href: "#play-6" },
];

export const PARTY_CARDS: readonly LineupCard[] = [
  { title: "Warmup session", subtitle: "THU 22 OCT · 17:30-20:30 · WARMUP DRINK (Vinyl set)", imageSrc: img("1470225620780-dba8ba36b745"), href: "#night-1" },
  { title: "Opening night · Four live acts · Sound system", subtitle: "THU 22 OCT · 21:00-01:45 · THE NAVE · LIVE STAGE", imageSrc: img("1514525253161-7a46d19cd819"), href: "#night-2" },
  { title: "Azure", subtitle: "FRI 23 OCT · 17:30-20:30 · WARMUP DRINK (DJ set)", imageSrc: img("1429962714451-bb934ecdc4ec"), href: "#night-3" },
  { title: "Audiovisual night: one drop, a thousand years + back to back", subtitle: "FRI 23 OCT · 21:30-01:45 · THE DELTA · LIVE STAGE", imageSrc: img("1459749411175-04bf5292ceea"), href: "#night-4" },
  { title: "Live organ concert", subtitle: "SAT 24 OCT · 20:00 · OLD CHURCH · LIVE STAGE", imageSrc: img("1501281668745-f7f57925c3b4"), href: "#night-5" },
];
