/**
 * Generate cute sheep icons at all Android densities using sharp
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const RES_DIR = path.join(__dirname, 'app', 'src', 'main', 'res');

// Create a cute sheep icon as SVG
function createSheepSvg(size, isAdaptive = false) {
  const padding = isAdaptive ? size * 0.2 : 0; // 20% safe zone padding for adaptive
  const innerSize = size - padding * 2;
  const center = size / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#fbbf24"/>
        <stop offset="50%" style="stop-color:#f59e0b"/>
        <stop offset="100%" style="stop-color:#d97706"/>
      </linearGradient>
      <linearGradient id="wool" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffffff"/>
        <stop offset="100%" style="stop-color:#fef3c7"/>
      </linearGradient>
    </defs>

    <!-- Background circle -->
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>

    <!-- Decorative circles -->
    <circle cx="${center * 0.25}" cy="${center * 0.2}" r="${size * 0.12}" fill="#fef3c7" opacity="0.3"/>
    <circle cx="${center * 1.7}" cy="${center * 1.8}" r="${size * 0.15}" fill="#fef3c7" opacity="0.2"/>

    <!-- Main sheep emoji centered -->
    <text
      x="${center}"
      y="${center + size * 0.08}"
      text-anchor="middle"
      font-size="${size * 0.55}"
      filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
    >🐑</text>

    <!-- Small heart accent -->
    <text
      x="${center + size * 0.25}"
      y="${center - size * 0.2}"
      text-anchor="middle"
      font-size="${size * 0.15}"
      opacity="0.8"
    >💕</text>
  </svg>`;
}

// Density configs: [name, size]
const DENSITIES = [
  ['mdpi', 48],
  ['hdpi', 72],
  ['xhdpi', 96],
  ['xxhdpi', 144],
  ['xxxhdpi', 192]
];

const ADAPTIVE_DENSITIES = [
  ['mdpi', 108],
  ['hdpi', 162],
  ['xhdpi', 216],
  ['xxhdpi', 324],
  ['xxxhdpi', 432]
];

async function generateIcons() {
  const sharpAvailable = true; // We know sharp is installed

  console.log('🐑 Generating cute sheep icons...\n');

  // Generate regular launcher icons (fallback for pre-API 26)
  for (const [density, size] of DENSITIES) {
    const dir = path.join(RES_DIR, `mipmap-${density}`);
    fs.mkdirSync(dir, { recursive: true });

    const svgIcon = createSheepSvg(size, false);
    const pngPath = path.join(dir, 'ic_launcher.png');
    const roundPngPath = path.join(dir, 'ic_launcher_round.png');

    await sharp(Buffer.from(svgIcon)).resize(size, size).png().toFile(pngPath);
    await sharp(Buffer.from(svgIcon)).resize(size, size).png().toFile(roundPngPath);

    console.log(`  ✅ mipmap-${density}: ic_launcher.png + ic_launcher_round.png (${size}x${size})`);
  }

  // Generate adaptive foreground icons (larger, with safe zone padding)
  for (const [density, size] of ADAPTIVE_DENSITIES) {
    const dir = path.join(RES_DIR, `mipmap-${density}`);
    fs.mkdirSync(dir, { recursive: true });

    const svgIcon = createSheepSvg(size, true);
    const fgPath = path.join(dir, 'ic_launcher_foreground.png');

    await sharp(Buffer.from(svgIcon)).resize(size, size).png().toFile(fgPath);
    console.log(`  ✅ mipmap-${density}: ic_launcher_foreground.png (${size}x${size})`);
  }

  // Create adaptive icon XMLs for API 26+
  const anydpiDir = path.join(RES_DIR, 'mipmap-anydpi-v26');
  fs.mkdirSync(anydpiDir, { recursive: true });

  // ic_launcher.xml
  const launcherXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), launcherXml);

  // ic_launcher_round.xml
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), launcherXml);

  console.log('  ✅ mipmap-anydpi-v26: adaptive icon XMLs\n');

  // Create background drawable (golden gradient)
  const drawableDir = path.join(RES_DIR, 'drawable');
  fs.mkdirSync(drawableDir, { recursive: true });

  const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <gradient
        android:startColor="#fbbf24"
        android:centerColor="#f59e0b"
        android:endColor="#d97706"
        android:angle="135"
        android:type="linear"/>
    <corners android:radius="20%"/>
</shape>`;
  fs.writeFileSync(path.join(drawableDir, 'ic_launcher_background.xml'), bgXml);

  // Also create the background as a solid color drawable for simplicity
  const bgColorXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#fbbf24</color>
</resources>`;

  // Ensure values directory has colors
  const valuesDir = path.join(RES_DIR, 'values');
  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#fbbf24</color>
</resources>`;
  fs.writeFileSync(path.join(valuesDir, 'colors.xml'), colorsXml);

  // Update adaptive icon XML to use drawable background
  const launcherXmlV2 = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), launcherXmlV2);
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), launcherXmlV2);

  console.log('🎉 All icons generated successfully!');
  console.log(`   Regular icons: mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher.png`);
  console.log(`   Adaptive foregrounds: mipmap-{mdpi...xxxhdpi}/ic_launcher_foreground.png`);
  console.log(`   Adaptive XML: mipmap-anydpi-v26/ic_launcher.xml`);
  console.log(`   Background: drawable/ic_launcher_background.xml`);
}

generateIcons().catch(err => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
