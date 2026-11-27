import type { OrchardRelatedProduct } from "./rail";

const jarArt = (title: string, hue: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='367' height='481' viewBox='0 0 367 481'><rect x='110' y='92' width='147' height='36' rx='8' fill='peru'/><path d='M92 142c0-16 14-26 32-26h119c18 0 32 10 32 26v236c0 24-18 42-42 42H134c-24 0-42-18-42-42V142Z' fill='${hue}'/><rect x='98' y='210' width='171' height='126' fill='seashell'/><text x='183' y='265' text-anchor='middle' font-family='Georgia,serif' font-size='18' fill='maroon'>PANTRY</text><text x='183' y='296' text-anchor='middle' font-family='Arial,sans-serif' font-size='11' letter-spacing='2' fill='orangered'>${title}</text></svg>`,
  );

/** Sample product card for the rail, using a drawn jar in place of product photography. */
export const orchardRelatedJar = (id: string, title: string, label: string, hue: string): OrchardRelatedProduct => ({
  id,
  title,
  imageSrc: jarArt(label, hue),
  hoverBg: "var(--rk-surface)",
  href: `#${id}`,
});
