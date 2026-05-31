/**
 * Generate cute cartoon sheep app icons at all Android densities
 * Pure vector SVG → PNG via sharp
 *
 * Design: Cute cartoon sheep face with fluffy wool on golden gradient bg
 * Safe zone: center 66.67% (adaptive icon standard)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const RES_DIR = path.join(__dirname, 'app', 'src', 'main', 'res');

// ─── SVG Generation ──────────────────────────────────

/**
 * Draw a cute cartoon sheep face centered in the icon.
 * @param {number} S - total icon size in px
 * @param {boolean} forAdaptive - if true, content stays in safe zone
 */
function createSheepIconSvg(S, forAdaptive = false) {
  const cx = S / 2;
  const cy = forAdaptive ? S * 0.46 : S * 0.45;

  // Wool radius (the fluffy ball around face)
  const woolR = S * (forAdaptive ? 0.27 : 0.29);
  // Face radius
  const faceR = woolR * 0.55;
  // Eye size
  const eyeR = faceR * 0.22;
  // Ear size
  const earW = faceR * 0.45;
  const earH = faceR * 0.8;

  // Wool puff circles around the face
  const woolPuffs = [];
  const puffCount = 12;
  const puffR = woolR * 0.38;
  for (let i = 0; i < puffCount; i++) {
    const angle = (i / puffCount) * Math.PI * 2 - Math.PI / 2;
    const dist = woolR * 0.72;
    woolPuffs.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist * 0.85, // slightly squashed vertically
      r: puffR * (0.85 + 0.15 * Math.sin(i * 2.3))
    });
  }

  // Inner wool puffs
  const innerPuffs = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 3;
    innerPuffs.push({
      x: cx + Math.cos(angle) * woolR * 0.35,
      y: cy + Math.sin(angle) * woolR * 0.3,
      r: puffR * 0.65
    });
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <!-- Wool gradient -->
    <linearGradient id="woolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f5f0e8"/>
    </linearGradient>
    <!-- Face gradient -->
    <radialGradient id="faceGrad" cx="50%" cy="40%">
      <stop offset="0%" stop-color="#fff5f0"/>
      <stop offset="100%" stop-color="#f5e1d0"/>
    </radialGradient>
    <!-- Shine filter -->
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
    <filter id="woolShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#d4a054" flood-opacity="0.15"/>
    </filter>
    <filter id="bgShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#92400e" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Rounded rectangle background -->
  <rect
    x="${S * 0.02}" y="${S * 0.02}"
    width="${S * 0.96}" height="${S * 0.96}"
    rx="${S * 0.22}" ry="${S * 0.22}"
    fill="url(#bgGrad)"
    filter="url(#bgShadow)"
  />

  <!-- Decorative sparkle dots -->
  <circle cx="${cx * 1.22}" cy="${cy * 0.45}" r="${S * 0.04}" fill="#ffffff" opacity="0.25"/>
  <circle cx="${cx * 0.78}" cy="${cy * 0.35}" r="${S * 0.025}" fill="#ffffff" opacity="0.2"/>
  <circle cx="${cx * 1.18}" cy="${cy * 1.55}" r="${S * 0.03}" fill="#ffffff" opacity="0.18"/>

  <!-- ── Wool (outer puffs) ── -->
  <g filter="url(#woolShadow)">
    ${woolPuffs.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="url(#woolGrad)" stroke="#f0ebe0" stroke-width="${S * 0.004}"/>`).join('\n    ')}
  </g>

  <!-- ── Ears (behind wool) ── -->
  <!-- Left ear -->
  <ellipse cx="${cx - woolR * 0.7}" cy="${cy - woolR * 0.4}" rx="${earW}" ry="${earH}"
    fill="#f5e1d0" stroke="#e8c8b0" stroke-width="${S * 0.004}"
    transform="rotate(-25, ${cx - woolR * 0.7}, ${cy - woolR * 0.4})"/>
  <ellipse cx="${cx - woolR * 0.7}" cy="${cy - woolR * 0.4}" rx="${earW * 0.55}" ry="${earH * 0.55}"
    fill="#fbcfe8" transform="rotate(-25, ${cx - woolR * 0.7}, ${cy - woolR * 0.4})"/>

  <!-- Right ear -->
  <ellipse cx="${cx + woolR * 0.7}" cy="${cy - woolR * 0.4}" rx="${earW}" ry="${earH}"
    fill="#f5e1d0" stroke="#e8c8b0" stroke-width="${S * 0.004}"
    transform="rotate(25, ${cx + woolR * 0.7}, ${cy - woolR * 0.4})"/>
  <ellipse cx="${cx + woolR * 0.7}" cy="${cy - woolR * 0.4}" rx="${earW * 0.55}" ry="${earH * 0.55}"
    fill="#fbcfe8" transform="rotate(25, ${cx + woolR * 0.7}, ${cy - woolR * 0.4})"/>

  <!-- ── Inner wool puffs (behind face) ── -->
  ${innerPuffs.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="url(#woolGrad)"/>`).join('\n    ')}

  <!-- ── Face ── -->
  <g filter="url(#softShadow)">
    <ellipse cx="${cx}" cy="${cy}" rx="${faceR * 1.05}" ry="${faceR}" fill="url(#faceGrad)"/>
  </g>

  <!-- Blush circles -->
  <ellipse cx="${cx - faceR * 0.55}" cy="${cy + faceR * 0.25}" rx="${faceR * 0.25}" ry="${faceR * 0.15}" fill="#fbcfe8" opacity="0.7"/>
  <ellipse cx="${cx + faceR * 0.55}" cy="${cy + faceR * 0.25}" rx="${faceR * 0.25}" ry="${faceR * 0.15}" fill="#fbcfe8" opacity="0.7"/>

  <!-- ── Eyes ── -->
  <!-- Left eye - big cute round -->
  <circle cx="${cx - faceR * 0.35}" cy="${cy - faceR * 0.08}" r="${eyeR}" fill="#2d1b0e"/>
  <!-- Left eye highlight -->
  <circle cx="${cx - faceR * 0.35 - eyeR * 0.25}" cy="${cy - faceR * 0.08 - eyeR * 0.3}" r="${eyeR * 0.35}" fill="#ffffff"/>
  <circle cx="${cx - faceR * 0.35 + eyeR * 0.15}" cy="${cy - faceR * 0.08 - eyeR * 0.1}" r="${eyeR * 0.13}" fill="#ffffff"/>

  <!-- Right eye -->
  <circle cx="${cx + faceR * 0.35}" cy="${cy - faceR * 0.08}" r="${eyeR}" fill="#2d1b0e"/>
  <!-- Right eye highlight -->
  <circle cx="${cx + faceR * 0.35 - eyeR * 0.25}" cy="${cy - faceR * 0.08 - eyeR * 0.3}" r="${eyeR * 0.35}" fill="#ffffff"/>
  <circle cx="${cx + faceR * 0.35 + eyeR * 0.15}" cy="${cy - faceR * 0.08 - eyeR * 0.1}" r="${eyeR * 0.13}" fill="#ffffff"/>

  <!-- Nose -->
  <ellipse cx="${cx}" cy="${cy + faceR * 0.15}" rx="${faceR * 0.18}" ry="${faceR * 0.12}" fill="#f472b6"/>
  <!-- Nose highlight -->
  <ellipse cx="${cx - faceR * 0.04}" cy="${cy + faceR * 0.12}" rx="${faceR * 0.06}" ry="${faceR * 0.04}" fill="#ffffff" opacity="0.5"/>

  <!-- Mouth (gentle smile) -->
  <path d="M ${cx - faceR * 0.2} ${cy + faceR * 0.32} Q ${cx} ${cy + faceR * 0.5} ${cx + faceR * 0.2} ${cy + faceR * 0.32}"
    fill="none" stroke="#d4a054" stroke-width="${S * 0.008}" stroke-linecap="round" opacity="0.7"/>

  <!-- ── Small decorative heart ── -->
  <g transform="translate(${cx + woolR * 1.05}, ${cy - woolR * 0.9}) scale(${S * 0.0008})">
    <path d="M 0 15 A 15 15 0 0 1 30 15 A 15 15 0 0 1 60 15 Q 60 30 30 52 Q 0 30 0 15 Z"
      fill="#ffffff" opacity="0.4"/>
  </g>
</svg>`;
}

// ─── Density Configs ────────────────────────────────

const DENSITIES = [
  ['mdpi', 48], ['hdpi', 72], ['xhdpi', 96],
  ['xxhdpi', 144], ['xxxhdpi', 192]
];

// Adaptive foreground: 108dp baseline, density multiplier
const ADAPTIVE_BASE = 108;
const ADAPTIVE_MULTIPLIERS = [
  ['mdpi', 1.0], ['hdpi', 1.5], ['xhdpi', 2.0],
  ['xxhdpi', 3.0], ['xxxhdpi', 4.0]
];

// ─── Main ───────────────────────────────────────────

async function generate() {
  console.log('🐑 Generating cute cartoon sheep icons...\n');

  // 1. Regular launcher icons
  for (const [density, size] of DENSITIES) {
    const dir = path.join(RES_DIR, `mipmap-${density}`);
    fs.mkdirSync(dir, { recursive: true });
    const svg = createSheepIconSvg(size, false);
    const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
    await sharp(buf).toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(buf).toFile(path.join(dir, 'ic_launcher_round.png'));
    console.log(`  ✅ mipmap-${density}: ${size}x${size}`);
  }

  // 2. Adaptive foreground icons
  for (const [density, mult] of ADAPTIVE_MULTIPLIERS) {
    const size = Math.round(ADAPTIVE_BASE * mult);
    const dir = path.join(RES_DIR, `drawable-${density}`);
    fs.mkdirSync(dir, { recursive: true });
    const svg = createSheepIconSvg(size, true);
    const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
    await sharp(buf).toFile(path.join(dir, 'ic_launcher_foreground.png'));
    console.log(`  ✅ drawable-${density}: foreground ${size}x${size}`);
  }

  // 3. Adaptive icon XMLs
  const anydpiDir = path.join(RES_DIR, 'mipmap-anydpi-v26');
  fs.mkdirSync(anydpiDir, { recursive: true });

  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>`;

  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), adaptiveXml);
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), adaptiveXml);
  console.log('  ✅ mipmap-anydpi-v26: adaptive XMLs');

  // 4. Background drawable (matches the SVG bg gradient)
  const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#f59e0b"/>
</shape>`;
  fs.writeFileSync(path.join(RES_DIR, 'drawable', 'ic_launcher_background.xml'), bgXml);

  console.log('\n🎉 All cute sheep icons generated!');
}

generate().catch(err => { console.error(err); process.exit(1); });
