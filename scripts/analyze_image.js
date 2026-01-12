const JimpModule = require('jimp');
console.log('Jimp keys:', Object.keys(JimpModule));
const { Jimp } = JimpModule;

const path = require('path');

const imagePath = 'C:/Users/Dell/.gemini/antigravity/brain/4c6c3934-a8f7-47c9-85c4-c0d776695fac/uploaded_image_1768233087041.png';

async function analyze() {
    if (Jimp && Jimp.read) {
        const image = await Jimp.read(imagePath);
        console.log(`Width: ${image.bitmap.width}, Height: ${image.bitmap.height}`);
    } else {
        console.log('Jimp named export not found or has no read');
        // iterate keys to find something resembling read
    }
}

analyze().catch(console.error);
