/**
 * Generates public/cover.html, which you screenshot to produce the OG image.
 *
 *   node scripts/cover.mjs [sourceColor] [scheme] [WxH]
 *   node scripts/cover.mjs "#6750a4" vibrant 1920x1080
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { buildPalette } from "materialwind-css/runtime";

const source = process.argv[2] ?? "#506546";
const scheme = process.argv[3] ?? "tonalSpot";
const size = process.argv[4] ?? "1200x630";

/* Tuned per aspect ratio rather than scaled, since 16:9 has room 1.91:1 does not. */
const SIZES = {
  "1920x1080": { w: 1920, h: 1080, pad: 100, padBottom: 210, eyebrow: 30, h1: 118,
                 tagline: 36, taglineMax: 980, sw: 108, swGap: 16, chip: 22, foot: 24, badge: 24 },
  "1200x630":  { w: 1200, h: 630,  pad: 56,  padBottom: 120, eyebrow: 19, h1: 68,
                 tagline: 21, taglineMax: 580, sw: 54,  swGap: 9,  chip: 14, foot: 16, badge: 16 },
};
const S = SIZES[size];
if (!S) throw new Error(`unknown size ${size}. Use ${Object.keys(SIZES).join(" or ")}`);

const { dark: c } = buildPalette({ primary: source, scheme });

const ramp = [
  "primary-container",
  "primary",
  "secondary",
  "secondary-container",
  "tertiary",
  "tertiary-container",
  "error",
  "surface-container-highest",
];

const chips = [
  { label: "bg-primary", bg: c["primary"], fg: c["on-primary"] },
  { label: "surface-primary-container", bg: c["primary-container"], fg: c["on-primary-container"] },
  { label: "interactive-secondary-container", bg: c["secondary-container"], fg: c["on-secondary-container"] },
  { label: "bg-tertiary-container", bg: c["tertiary-container"], fg: c["on-tertiary-container"] },
];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>materialwind cover</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #000;
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .cover {
    position: relative;
    width: ${S.w}px;
    height: ${S.h}px;
    overflow: hidden;
    background: ${c["surface"]};
    color: ${c["on-surface"]};
    padding: ${S.pad}px ${S.pad}px ${S.padBottom}px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cover::before {
    content: '';
    position: absolute;
    inset: -30% -10% auto auto;
    width: ${Math.round(S.w * 0.65)}px; height: ${Math.round(S.w * 0.65)}px;
    background: radial-gradient(circle, ${c["primary"]}22 0%, transparent 62%);
    pointer-events: none;
  }

  h1 {
    font-size: ${S.h1}px;
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.02;
  }
  h1 .accent { color: ${c["primary"]}; }

  .tagline {
    margin-top: 22px;
    font-size: ${S.tagline}px;
    line-height: 1.4;
    font-weight: 400;
    color: ${c["on-surface-variant"]};
    max-width: ${S.taglineMax}px;
  }

  .ramp { display: flex; gap: ${S.swGap}px; margin-top: ${Math.round(S.pad * 0.7)}px; }
  .ramp span {
    width: ${S.sw}px; height: ${S.sw}px;
    border-radius: ${Math.round(S.sw * 0.24)}px;
    border: 1px solid ${c["outline-variant"]};
  }

  .chips {
    position: absolute;
    right: ${S.pad}px; bottom: ${S.pad}px;
    display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
  }
  .chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: ${S.chip}px; font-weight: 500;
    padding: ${Math.round(S.chip * 0.8)}px ${Math.round(S.chip * 1.35)}px;
    border-radius: 999px;
    white-space: nowrap;
    box-shadow: 0 8px 30px rgba(0,0,0,0.35);
  }

  .cta {
    display: inline-flex; align-items: center; gap: 10px;
    align-self: flex-start;
    margin-top: ${Math.round(S.pad * 0.55)}px;
    background: ${c["primary"]};
    color: ${c["on-primary"]};
    font-size: ${Math.round(S.badge * 1.15)}px;
    font-weight: 600;
    padding: ${Math.round(S.badge * 0.85)}px ${Math.round(S.badge * 1.7)}px;
    border-radius: 999px;
  }

  .footer {
    position: absolute;
    left: ${S.pad}px; bottom: ${S.pad}px;
    display: flex; align-items: center; gap: 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: ${S.foot}px;
    color: ${c["on-surface-variant"]};
  }
  .footer .dot { width: 5px; height: 5px; border-radius: 50%; background: ${c["outline"]}; }

  .brand {
    display: flex; align-items: center;
    margin-bottom: ${Math.round(S.pad * 0.42)}px; gap: ${Math.round(S.badge * 0.5)}px;
    font-size: ${Math.round(S.badge * 1.15)}px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${c["on-surface"]};
  }
  .brand svg { width: ${Math.round(S.badge * 1.7)}px; height: ${Math.round(S.badge * 1.7)}px; display: block; }

  .badge {
    position: absolute;
    top: ${S.pad}px; right: ${S.pad}px;
    background: ${c["primary-container"]};
    color: ${c["on-primary-container"]};
    font-size: ${S.badge}px; font-weight: 600;
    padding: ${Math.round(S.badge * 0.65)}px ${Math.round(S.badge * 1.2)}px;
    border-radius: 999px;
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="brand">
      <svg viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="8" fill="${c["surface-container-high"]}"/>
        <path d="M6 22a10 10 0 0 1 20 0Z" fill="${c["primary"]}"/>
        <circle cx="16" cy="22" r="4" fill="${c["tertiary"]}"/>
      </svg>
      materialwind
    </div>
    <div class="badge">Tailwind CSS 4</div>

    <h1>Material Design 3 color,<br><span class="accent">the Tailwind way.</span></h1>
    <p class="tagline">One color in. A whole accessible palette out, with dynamic theming at runtime.</p>

    <div class="ramp">
      ${ramp.map((t) => `<span style="background:${c[t]}"></span>`).join("\n      ")}
    </div>

    <div class="chips">
      ${chips
        .map(
          (x) =>
            `<div class="chip" style="background:${x.bg};color:${x.fg}">${x.label}</div>`,
        )
        .join("\n      ")}
    </div>

    <div class="cta">Try the live playground &rarr;</div>

    <div class="footer">
      <span>materialwind.saade.dev</span>
      <span class="dot"></span>
      <span>npm i materialwind-css</span>
    </div>
  </div>
</body>
</html>
`;

mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
const out = new URL("../public/cover.html", import.meta.url);
writeFileSync(out, html);
console.log(`wrote ${out.pathname}`);
console.log(`source ${source}, scheme ${scheme}, size ${size}`);
