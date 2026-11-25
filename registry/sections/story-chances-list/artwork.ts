function toSvgDataUri(svg: string): string {
  const compact = svg.replace(/\s+/g, " ").trim();
  return `data:image/svg+xml,${encodeURIComponent(compact)}`;
}

const CREST_MASK_SVG = [
  '<svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">',
  '<path d="M0 2C0 0.895429 0.895431 0 2 0H72C73.1046 0 74 0.89543 74 2V56.2815C74 61.3452 70.5431 65.7548 65.6257 66.9635L39.6257 73.3546C37.9009 73.7785 36.0991 73.7785 34.3743 73.3546L8.37425 66.9635C3.45689 65.7548 0 61.3452 0 56.2815V2Z" fill="white"/>',
  "</svg>",
].join("");

export const CREST_MASK_URL = `url("${toSvgDataUri(CREST_MASK_SVG)}")`;

function makeScallopCrest(): string {
  const rows = [0, 32, 64, 96, 128]
    .map(
      (y, idx) =>
        `<path d="M0 ${y + 16} Q20 ${y} 40 ${y + 16} T80 ${y + 16} T120 ${y + 16} T160 ${y + 16} V${y + 32} H0 Z" fill="${
          idx % 2 === 0 ? "hsl(46, 86%, 54%)" : "hsl(44, 78%, 46%)"
        }"/>`,
    )
    .join("");
  const tiles = [0, 40, 80, 120]
    .flatMap((x) =>
      [0, 32, 64, 96, 128].map(
        (y, r) =>
          `<rect x="${x + (r % 2 === 0 ? 0 : 20)}" y="${y}" width="20" height="16" fill="hsl(220, 8%, 34%)" opacity="0.72"/>`,
      ),
    )
    .join("");
  return toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 158"><rect width="160" height="158" fill="hsl(220, 10%, 28%)"/>${rows}${tiles}</svg>`,
  );
}

function makeChevronCrest(): string {
  const bands = [0, 28, 56, 84, 112, 140]
    .map(
      (y, i) =>
        `<polygon points="0,${y + 20} 40,${y} 80,${y + 20} 120,${y} 160,${y + 20} 160,${y + 34} 120,${y + 14} 80,${y + 34} 40,${y + 14} 0,${y + 34}" fill="${
          i % 2 === 0 ? "hsl(8, 68%, 48%)" : "hsl(36, 42%, 88%)"
        }"/>`,
    )
    .join("");
  return toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 158"><rect width="160" height="158" fill="hsl(14, 24%, 18%)"/>${bands}</svg>`,
  );
}

function makeDiamondCrest(): string {
  const diamonds = [0, 40, 80, 120]
    .flatMap((x) =>
      [0, 40, 80, 120].map(
        (y) =>
          `<polygon points="${x + 20},${y + 2} ${x + 38},${y + 20} ${x + 20},${y + 38} ${x + 2},${y + 20}" fill="hsl(168, 42%, 42%)" stroke="hsl(42, 48%, 84%)" stroke-width="2"/>`,
      ),
    )
    .join("");
  return toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 158"><rect width="160" height="158" fill="hsl(182, 34%, 18%)"/>${diamonds}</svg>`,
  );
}

function makeCheckerCrest(): string {
  const cells = [0, 32, 64, 96, 128]
    .flatMap((x, c) =>
      [0, 32, 64, 96, 128].map(
        (y, r) =>
          `<rect x="${x}" y="${y}" width="32" height="32" fill="${
            (r + c) % 2 === 0 ? "hsl(216, 48%, 34%)" : "hsl(38, 72%, 62%)"
          }"/>`,
      ),
    )
    .join("");
  return toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 158">${cells}<circle cx="80" cy="79" r="24" fill="hsl(216, 42%, 22%)" stroke="hsl(40, 80%, 74%)" stroke-width="4"/></svg>`,
  );
}

function makeSunburstCrest(): string {
  const rays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    .map(
      (deg) =>
        `<rect x="74" y="-20" width="12" height="200" fill="hsl(26, 74%, 56%)" opacity="0.7" transform="rotate(${deg} 80 79)"/>`,
    )
    .join("");
  return toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 158"><rect width="160" height="158" fill="hsl(24, 30%, 20%)"/>${rays}<circle cx="80" cy="79" r="30" fill="hsl(40, 76%, 86%)"/></svg>`,
  );
}

export const CREST_PATTERNS: string[] = [
  makeScallopCrest(),
  makeChevronCrest(),
  makeDiamondCrest(),
  makeCheckerCrest(),
  makeSunburstCrest(),
];

export const DEFAULT_STORY_IMAGES: string[] = [
  // 01: Warm candlelit long table at night
  toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
      <defs>
        <radialGradient id="g1" cx="50%" cy="46%" r="58%">
          <stop offset="0%" stop-color="hsl(36, 72%, 52%)" stop-opacity="0.72"/>
          <stop offset="48%" stop-color="hsl(26, 36%, 20%)" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="hsl(22, 22%, 7%)"/>
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#g1)"/>
      <polygon points="165,400 250,210 350,210 435,400" fill="hsl(34, 28%, 74%)" opacity="0.22"/>
      <ellipse cx="300" cy="238" rx="44" ry="12" fill="hsl(40, 88%, 72%)" opacity="0.45"/>
      <circle cx="192" cy="222" r="32" fill="hsl(24, 24%, 10%)"/>
      <circle cx="408" cy="224" r="34" fill="hsl(24, 24%, 10%)"/>
      <circle cx="242" cy="184" r="24" fill="hsl(24, 20%, 13%)"/>
      <circle cx="358" cy="186" r="24" fill="hsl(24, 20%, 13%)"/>
      <rect x="284" y="182" width="10" height="44" rx="4" fill="hsl(42, 92%, 82%)" opacity="0.8"/>
      <rect x="308" y="190" width="9" height="36" rx="4" fill="hsl(42, 92%, 78%)" opacity="0.7"/>
      <circle cx="289" cy="176" r="14" fill="hsl(44, 100%, 74%)" opacity="0.5"/>
    </svg>`,
  ),
  // 02: Midnight open water under a dim horizon
  toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(210, 26%, 5%)"/>
          <stop offset="44%" stop-color="hsl(188, 22%, 10%)"/>
          <stop offset="100%" stop-color="hsl(166, 20%, 18%)"/>
        </linearGradient>
        <radialGradient id="g2w" cx="50%" cy="68%" r="44%">
          <stop offset="0%" stop-color="hsl(148, 24%, 44%)" stop-opacity="0.62"/>
          <stop offset="100%" stop-color="hsl(180, 24%, 8%)" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#g2)"/>
      <rect y="182" width="600" height="218" fill="url(#g2w)"/>
      <circle cx="96" cy="166" r="2.4" fill="hsl(44, 90%, 84%)" opacity="0.7"/>
      <circle cx="132" cy="172" r="2" fill="hsl(44, 90%, 84%)" opacity="0.55"/>
      <circle cx="496" cy="164" r="2.2" fill="hsl(44, 90%, 84%)" opacity="0.65"/>
      <ellipse cx="300" cy="256" rx="88" ry="12" fill="hsl(154, 28%, 62%)" opacity="0.28"/>
      <ellipse cx="300" cy="252" rx="22" ry="9" fill="hsl(190, 18%, 12%)"/>
      <path d="M120 306 Q300 292 480 310" stroke="hsl(150, 24%, 66%)" stroke-width="2" fill="none" opacity="0.25"/>
      <path d="M168 340 Q300 328 432 344" stroke="hsl(150, 24%, 66%)" stroke-width="2" fill="none" opacity="0.2"/>
    </svg>`,
  ),
  // 03: Sunlit golden narrow stone alleyway
  toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(40, 96%, 72%)"/>
          <stop offset="55%" stop-color="hsl(32, 84%, 44%)"/>
          <stop offset="100%" stop-color="hsl(24, 52%, 16%)"/>
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#g3)"/>
      <polygon points="0,0 252,0 272,226 198,400 0,400" fill="hsl(24, 42%, 13%)"/>
      <polygon points="600,0 348,0 328,226 402,400 600,400" fill="hsl(24, 38%, 15%)"/>
      <polygon points="258,0 342,0 324,230 276,230" fill="hsl(46, 100%, 88%)" opacity="0.88"/>
      <polygon points="274,230 326,230 374,400 226,400" fill="hsl(38, 92%, 62%)" opacity="0.72"/>
      <rect x="64" y="130" width="44" height="96" fill="hsl(26, 36%, 20%)" opacity="0.7"/>
      <rect x="492" y="114" width="46" height="104" fill="hsl(26, 32%, 22%)" opacity="0.7"/>
    </svg>`,
  ),
  // 04: Sunset horizon over quiet coastal water
  toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(214, 32%, 34%)"/>
          <stop offset="52%" stop-color="hsl(30, 68%, 62%)"/>
          <stop offset="100%" stop-color="hsl(38, 92%, 78%)"/>
        </linearGradient>
        <linearGradient id="g4sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(214, 24%, 28%)"/>
          <stop offset="100%" stop-color="hsl(218, 28%, 14%)"/>
        </linearGradient>
      </defs>
      <rect width="600" height="218" fill="url(#g4sky)"/>
      <rect y="218" width="600" height="182" fill="url(#g4sea)"/>
      <circle cx="468" cy="186" r="46" fill="hsl(44, 100%, 88%)" opacity="0.86"/>
      <path d="M0 218 L184 134 L348 206 L440 218 Z" fill="hsl(220, 22%, 18%)"/>
      <rect x="430" y="218" width="76" height="182" fill="hsl(38, 86%, 68%)" opacity="0.22"/>
      <circle cx="198" cy="230" r="36" fill="hsl(220, 20%, 10%)"/>
      <path d="M120 400 C138 308 168 272 204 272 C240 272 268 308 282 400 Z" fill="hsl(220, 22%, 10%)"/>
    </svg>`,
  ),
  // 05: Warm lantern courtyard at dusk
  toSvgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="g5" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(228, 32%, 14%)"/>
          <stop offset="56%" stop-color="hsl(22, 38%, 18%)"/>
          <stop offset="100%" stop-color="hsl(32, 62%, 30%)"/>
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#g5)"/>
      <path d="M84 400 V176 A112 112 0 0 1 308 176 V400 Z" fill="hsl(24, 26%, 10%)" opacity="0.72"/>
      <path d="M352 400 V192 A92 92 0 0 1 536 192 V400 Z" fill="hsl(24, 24%, 11%)" opacity="0.65"/>
      <circle cx="196" cy="176" r="24" fill="hsl(40, 96%, 76%)" opacity="0.88"/>
      <circle cx="196" cy="176" r="68" fill="hsl(38, 92%, 62%)" opacity="0.22"/>
      <circle cx="444" cy="192" r="20" fill="hsl(38, 92%, 72%)" opacity="0.76"/>
      <rect y="330" width="600" height="70" fill="hsl(22, 24%, 8%)" opacity="0.75"/>
    </svg>`,
  ),
];
