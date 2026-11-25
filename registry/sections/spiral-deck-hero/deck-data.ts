// Default white-label challenge cards and 3D spiral configuration.

import type { SpiralCardItem } from "./deck-textures";

export interface DeckConfig {
  angleStep: number;
  radius: number;
  squish: number;
  gapX: number;
  gapY: number;
  edgeTwist: number;
  cardScale: number;
  bend: number;
  smear: number;
  auto: boolean;
  autoSpeed: number;
  mouseTilt: number;
  magnet: number;
}

export const HERO_SPIRAL_CONFIG: DeckConfig = {
  angleStep: 0.65,
  radius: 3,
  squish: 0.7,
  gapX: -0.05,
  gapY: 0.4,
  edgeTwist: -0.06,
  cardScale: 0.5,
  bend: 0.06,
  smear: 1,
  auto: true,
  autoSpeed: 0.15,
  mouseTilt: 0.12,
  magnet: 0.1,
};

export const DEFAULT_SPIRAL_CARDS: SpiralCardItem[] = [
  {
    id: 1,
    house: "The Iron Foundry",
    title: "Leave your phone in another room for the next 2 hours.",
    body: "Out of reach, out of mind. Two hours to find out what your hands do without it.",
    patternIndex: 4,
  },
  {
    id: 2,
    house: "The Story Guild",
    title: "Do something with your hands today that is not typing.",
    body: "Cook, fix, draw, build. Make one thing the screen had nothing to do with.",
    patternIndex: 1,
  },
  {
    id: 3,
    house: "The Windwrights",
    title: "Sit in silence for 10 minutes. No podcast, no music, no phone.",
    body: "No input, no soundtrack. Ten minutes with your own head is longer than it sounds.",
    patternIndex: 3,
  },
  {
    id: 4,
    house: "The Trailfinders",
    title: "Go outside with no destination and no time limit.",
    body: "No map, no goal, no clock. Turn where you feel like turning and see where you land.",
    patternIndex: 2,
  },
  {
    id: 5,
    house: "The Watchmakers",
    title: "Call someone instead of texting them today. Anyone.",
    body: "A voice carries what a text flattens. Pick a name, tap call, let it be a little awkward.",
    patternIndex: 0,
  },
  {
    id: 6,
    house: "The Story Guild",
    title: "Ask a stranger for a recommendation today.",
    body: "People like being asked. Open your mouth to the barista, the neighbor, the person in line.",
    patternIndex: 1,
  },
  {
    id: 7,
    house: "The Trailfinders",
    title: "Eat your next meal with no screen and no book. Just sit.",
    body: "One meal, just the food and you. Notice when you reach for the phone and leave it face down.",
    patternIndex: 2,
  },
  {
    id: 8,
    house: "The Watchmakers",
    title: "Have a conversation today where you ask more than you talk.",
    body: "Trade the update for a question. Then another. Watch how far someone opens up.",
    patternIndex: 0,
  },
];
