const svgUri = (svg: string) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(svg);

export const DEFAULT_ARCH_SVG = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1407" height="601" viewBox="0 0 1407 601" fill="none"><path d="M0 601V392C95 270 296 146 530 78C764 10 950 -20 1168 62C1310 115 1378 242 1407 346V601H0Z" fill="maroon"/></svg>`,
);

export const DEFAULT_BADGE_SVG = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1168" height="1168" viewBox="0 0 1168 1168" fill="none"><defs><path id="ring" d="M584,584 m-460,0 a460,460 0 1,1 920,0 a460,460 0 1,1 -920,0"/></defs><text fill="orangered" font-family="Georgia,serif" font-size="88" letter-spacing="18"><textPath href="#ring">ARTISAN ORCHARD PRESERVES • TERRACED HARVEST • </textPath></text></svg>`,
);

export const jarSvg = (tint: string) =>
  svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="630" height="1013" viewBox="0 0 630 1013" fill="none"><rect x="115" y="42" width="400" height="128" rx="22" fill="silver"/><rect x="128" y="64" width="374" height="24" rx="12" fill="gainsboro"/><path d="M62 230C62 184 108 164 162 164H468C522 164 568 184 568 230V888C568 952 518 994 452 994H178C112 994 62 952 62 888V230Z" fill="${tint}"/><rect x="86" y="270" width="60" height="600" rx="30" fill="white" fill-opacity="0.18"/></svg>`,
  );

export const labelSvg = (title: string, sub: string, bg: string, band: string) =>
  svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512" fill="none"><rect width="1024" height="512" fill="${bg}"/><rect y="280" width="1024" height="232" fill="${band}"/><text x="512" y="128" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="seashell">SOLARA</text><text x="512" y="176" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="30" fill="seashell">Orchard</text><text x="512" y="382" text-anchor="middle" font-family="Georgia,serif" font-size="68" fill="seashell">${title}</text><text x="512" y="446" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" fill="peachpuff">${sub}</text></svg>`,
  );
