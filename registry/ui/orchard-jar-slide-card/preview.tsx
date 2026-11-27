"use client";

import { OrchardJarSlideCard } from "./component";
import styles from "./styles.module.css";

const JAR_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='367' height='481' viewBox='0 0 367 481'><rect width='367' height='481' fill='none'/><rect x='110' y='92' width='147' height='36' rx='8' fill='peru'/><path d='M92 142c0-16 14-26 32-26h119c18 0 32 10 32 26v236c0 24-18 42-42 42H134c-24 0-42-18-42-42V142Z' fill='darkorange'/><rect x='98' y='210' width='171' height='126' fill='seashell'/><text x='183' y='265' text-anchor='middle' font-family='Georgia,serif' font-size='22' fill='maroon'>SOLARA</text><text x='183' y='296' text-anchor='middle' font-family='Arial,sans-serif' font-size='12' letter-spacing='2' fill='orangered'>BLOOD ORANGE</text></svg>",
  );

const ORANGE_DECOR_SVG =
  "<svg width='295' height='354' viewBox='0 0 295 354' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M223.921 2.99117C229.328 0.398555 235.374 -0.540782 241.308 0.299764L287.222 6.79781C289.494 7.1148 290.601 9.74138 289.25 11.5966L267.854 41.0127C264.509 45.6104 259.94 49.1803 254.665 51.3134L229.845 61.3378C225.469 63.1021 220.735 63.8317 216.033 63.4492L156.467 58.6386L157.181 82.4628L191.921 82.8857C198.244 82.9626 204.379 85.0172 209.483 88.75L263.489 128.286C269.131 132.414 273.177 138.368 274.947 145.135L294.011 218.045C295.807 224.911 295.141 232.183 292.145 238.611L261.824 303.589C259.459 308.651 255.748 312.973 251.085 316.062L201.542 348.935C196.46 352.309 190.485 354.071 184.388 353.997L117.645 353.186C112.234 353.121 106.931 351.61 102.295 348.805L40.1807 311.214C34.5397 307.8 30.1664 302.647 27.711 296.532L2.19243 232.983C-0.385812 226.568 -0.697485 219.466 1.2979 212.853L23.0967 140.575C25.2052 133.575 29.7688 127.563 35.9502 123.66L94.5059 86.6211V86.6035C99.4675 83.4629 105.233 81.833 111.105 81.9043L145.618 82.3232L145.915 57.8681L139.522 35.331C139.244 34.3511 139.987 33.3832 140.999 33.3955L153.266 33.5449C154.106 33.5552 154.775 34.2413 154.765 35.082L154.527 54.6728L177.416 28.1318C180.147 24.9643 183.511 22.3927 187.282 20.5849L223.921 2.99117Z' fill='orange'/></svg>";

export default function OrchardJarSlideCardPreview() {
  return (
    <div className={styles.previewRail}>
      <OrchardJarSlideCard
        id="blood-orange-marmalade"
        title="Blood Orange Marmalade"
        imageSrc={JAR_SVG}
        imageAlt="Blood Orange Marmalade Jar"
        imageWidth={367}
        imageHeight={481}
        hoverBg="var(--rk-surface)"
        svgMarkup={ORANGE_DECOR_SVG}
        href="#blood-orange"
        dragging={false}
      />
      <OrchardJarSlideCard
        id="strawberry-preserve"
        title="Strawberry Preserve"
        imageSrc={JAR_SVG}
        imageAlt="Strawberry Preserve Jar"
        imageWidth={367}
        imageHeight={481}
        hoverBg="var(--rk-surface)"
        svgMarkup={ORANGE_DECOR_SVG}
        href="#strawberry"
        dragging={false}
      />
      <OrchardJarSlideCard
        id="mulberry-jam"
        title="Black Mulberry Jam"
        imageSrc={JAR_SVG}
        imageAlt="Black Mulberry Jam Jar"
        imageWidth={367}
        imageHeight={481}
        hoverBg="var(--rk-surface)"
        svgMarkup={ORANGE_DECOR_SVG}
        href="#mulberry"
        dragging={false}
      />
      <OrchardJarSlideCard
        id="pear-cinnamon"
        title="Spiced Pear Jam"
        imageSrc={JAR_SVG}
        imageAlt="Spiced Pear Jam Jar"
        imageWidth={367}
        imageHeight={481}
        hoverBg="var(--rk-surface)"
        svgMarkup={ORANGE_DECOR_SVG}
        href="#pear"
        dragging={false}
      />
    </div>
  );
}
