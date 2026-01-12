const JimpModule = require('jimp');
const { Jimp } = JimpModule;
const intToRGBA = JimpModule.intToRGBA; // Get from module root
const path = require('path');
const fs = require('fs');

const imagePath = 'C:/Users/Dell/.gemini/antigravity/brain/4c6c3934-a8f7-47c9-85c4-c0d776695fac/uploaded_image_1768233087041.png';
const outputDir = path.join(__dirname, '../public/logos');

const logos = [
    'vertex', 'novus', 'echo',
    'sphere', 'nexus', 'core',
    'vantage', 'zenith', 'omni'
];

async function cropLogos() {
    const image = await Jimp.read(imagePath);
    const w = image.bitmap.width;
    const h = image.bitmap.height;

    // Detect Grid Bounds
    // We'll scan clear "checkerboard" or "content" area.
    // The header text is white-on-black. The grid is checkerboard.
    // Let's find minX, maxX, minY, maxY of the area that is "greyish".
    // Threshold: distinct from black (0,0,0).
    // But header text is also distinct from black.
    // We can assume grid is the largest bounding box below y=100.

    let minX = w, maxX = 0, minY = h, maxY = 0;

    // Constrain scan to bottom 80% to avoid header if possible, or just scan all and filter?
    // Header is "Powering Innovation..." which is wide.
    // Grid is also wide.
    // Let's scan from y = 150 (skipping top 150px approx).

    const startY = 150;

    for (let y = startY; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const color = intToRGBA(image.getPixelColor(x, y));
            // Detect if pixel is not effectively black
            // Allow some noise (e.g. compression artifacts)
            if (color.r > 20 || color.g > 20 || color.b > 20) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    console.log(`Grid area detected: x=${minX}, y=${minY}, w=${maxX - minX}, h=${maxY - minY}`);

    // If detection failed or is too small, fallback to a central crop estimate
    if (maxX <= minX || maxY <= minY) {
        console.log('Detection failed, using fallback centered crop');
        // Fallback
        minX = 200; maxX = 824;
        minY = 150; maxY = 600;
    }

    const gridW = maxX - minX;
    const gridH = maxY - minY;

    // Split into 3x3
    const cellW = Math.floor(gridW / 3);
    const cellH = Math.floor(gridH / 3);

    // Crop and save
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const logoName = logos[row * 3 + col];
            const x = minX + col * cellW;
            const y = minY + row * cellH;

            const clone = image.clone();
            clone.crop({ x, y, w: cellW, h: cellH });

            // Optional: Clean extraction?
            // For now, raw crop.

            const outFile = path.join(outputDir, `${logoName}.png`);
            await clone.write(outFile);
            console.log(`Saved ${outFile}`);
        }
    }
}

cropLogos().catch(console.error);
