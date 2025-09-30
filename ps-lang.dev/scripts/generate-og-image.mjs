import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');
const inputLogo = join(__dirname, '..', 'public', 'ps-lang-logomark.png');

async function generateOGImage() {
  console.log('Generating OpenGraph image...\n');

  const ogWidth = 1200;
  const ogHeight = 630;
  const logoSize = 300;

  try {
    // Create background
    const background = await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background
      }
    })
      .png()
      .toBuffer();

    // Resize logo
    const logo = await sharp(inputLogo)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Composite logo centered on background
    const logoX = Math.floor((ogWidth - logoSize) / 2);
    const logoY = Math.floor((ogHeight - logoSize) / 2) - 50; // Slightly above center

    // Create SVG text for tagline
    const taglineSvg = `
      <svg width="${ogWidth}" height="${ogHeight}">
        <style>
          .title {
            fill: white;
            font-size: 72px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 300;
            letter-spacing: -2px;
          }
          .subtitle {
            fill: #a8a29e;
            font-size: 28px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 400;
          }
        </style>
        <text x="${ogWidth / 2}" y="120" text-anchor="middle" class="title">PS-LANG</text>
        <text x="${ogWidth / 2}" y="540" text-anchor="middle" class="subtitle">Multi-Agent Context Control</text>
      </svg>
    `;

    const output = await sharp(background)
      .composite([
        {
          input: logo,
          top: logoY,
          left: logoX,
        },
        {
          input: Buffer.from(taglineSvg),
          top: 0,
          left: 0,
        }
      ])
      .png()
      .toFile(join(publicDir, 'og-image.png'));

    console.log('✓ Generated og-image.png (1200x630)');
    console.log(`  Size: ${Math.round(output.size / 1024)}KB`);
    console.log('\n✓ OpenGraph image generated successfully!');
  } catch (error) {
    console.error('✗ Failed to generate OG image:', error.message);
    throw error;
  }
}

generateOGImage().catch(console.error);