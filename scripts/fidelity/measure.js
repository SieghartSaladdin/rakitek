// Browser snippet: paste this whole file into the page (console or an agent's JS tool),
// then call rkMeasure({ label: "css selector", ... }).
// Run it on the original site and on the rakitek preview with the SAME labels,
// save each result as JSON, then run: npm run fidelity -- <original.json> <extract.json>

// Hide the scrollbar on BOTH sites so every capture has the same layout width.
// Chrome builds differ (15px, 10px, overlay 0px), which made 1905 vs 1910 FAILs.
const RK_NORMALIZE_ID = "rk-fidelity-normalize";
function rkInjectNormalize() {
  if (document.getElementById(RK_NORMALIZE_ID)) return false;
  const style = document.createElement("style");
  style.id = RK_NORMALIZE_ID;
  style.textContent =
    "html{scrollbar-width:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important}";
  document.head.append(style);
  window.dispatchEvent(new Event("resize"));
  return true;
}
window.rkNormalize = async function rkNormalize() {
  if (rkInjectNormalize()) await new Promise((r) => setTimeout(r, 600));
};

// Wait until an element stops moving (open/slide transitions) before measuring.
window.rkSettle = async function rkSettle(selector, timeoutMs = 5000) {
  await window.rkNormalize();
  const start = performance.now();
  let last = "";
  let stable = 0;
  while (performance.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 120));
    const el = document.querySelector(selector);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const onScreen =
      getComputedStyle(el).visibility !== "hidden" &&
      r.width > 0 &&
      r.x < window.innerWidth &&
      r.right > 0 &&
      r.y < window.innerHeight &&
      r.bottom > 0;
    const key = `${r.x},${r.y},${r.width},${r.height}`;
    stable = onScreen && key === last ? stable + 1 : 0;
    last = key;
    if (stable >= 3) return true;
  }
  return false;
};

window.rkMeasure = function rkMeasure(selectors) {
  const ctx = document.createElement("canvas").getContext("2d");
  const sample = "AaBbGgMmWw0123456789 $(Q)";
  const widthOf = (font) => {
    ctx.font = `72px ${font}`;
    return ctx.measureText(sample).width;
  };
  const GENERIC = ["sans-serif", "serif", "monospace", "system-ui", "cursive", "fantasy"];
  const SYSTEM = ["Arial", "Helvetica Neue", "Helvetica", "Segoe UI", "Roboto", "Times New Roman", "Courier New", "Georgia", "Verdana"];
  const loadedFaces = new Set(
    [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replaceAll('"', "")),
  );
  const available = (fam) =>
    loadedFaces.has(fam) ||
    widthOf(`"${fam}", monospace`) !== widthOf("monospace") ||
    widthOf(`"${fam}", serif`) !== widthOf("serif");
  // Font the browser actually paints with: first family in the stack that exists.
  const renderedFont = (stack) => {
    for (const raw of stack.split(",")) {
      const fam = raw.replaceAll('"', "").replaceAll("'", "").trim();
      if (GENERIC.includes(fam)) {
        const match = SYSTEM.find((sys) => available(sys) && widthOf(`"${sys}"`) === widthOf(fam));
        return match ?? fam;
      }
      if (available(fam)) return fam;
    }
    return "unknown";
  };
  const round = (n) => Math.round(n * 10) / 10;
  const px = (v) => (v.endsWith("px") ? round(parseFloat(v)) : v);
  rkInjectNormalize();
  const out = {
    normalized: true,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    url: location.href,
    elements: {},
  };
  for (const [label, selector] of Object.entries(selectors)) {
    const el = document.querySelector(selector);
    if (!el) {
      out.elements[label] = { missing: true, selector };
      continue;
    }
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    out.elements[label] = {
      selector,
      x: round(r.x),
      y: round(r.y),
      width: round(r.width),
      height: round(r.height),
      fontFamily: s.fontFamily.split(",")[0].replaceAll('"', "").trim(),
      fontRendered: renderedFont(s.fontFamily),
      fontSize: px(s.fontSize),
      fontWeight: s.fontWeight,
      lineHeight: px(s.lineHeight),
      letterSpacing: s.letterSpacing,
      textTransform: s.textTransform,
      color: s.color,
      backgroundColor: s.backgroundColor,
      paddingTop: px(s.paddingTop),
      paddingRight: px(s.paddingRight),
      paddingBottom: px(s.paddingBottom),
      paddingLeft: px(s.paddingLeft),
      borderTop: `${s.borderTopWidth} ${s.borderTopColor}`,
      borderBottom: `${s.borderBottomWidth} ${s.borderBottomColor}`,
      borderRadius: s.borderRadius,
      gap: s.gap,
      display: s.display,
      visible: r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none",
      text: (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 60),
    };
  }
  return out;
};
