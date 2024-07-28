const fs = require('fs')
const path = require('path')
const exifParser = require('exif-parser')
const lodash = require('lodash')
const sharp = require('sharp')

const imageFolder = './images'
const logoFolder = './logos'
const outputFolder = './output'
const logoSize = { width: 1100, height: 200 }; // 设置 logo 的大小

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}
function getImagesFromFolder(imgSrc) {
    return fs.readdirSync(imgSrc).filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png'].includes(ext)
    }).map(item => path.join(imgSrc, item))
}

function getExifData(imagePath) {
    const buffer = fs.readFileSync(imagePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    return result.tags;
}

const imageFiles = getImagesFromFolder(imageFolder);

// const exifDataArr = []
// imageFiles.forEach(file => {
//     const exifData = getExifData(file);
//     // exifDataArr.push(exifData);
//     exifDataArr.push(lodash.pick(exifData, ['Make',
//         'Model',
//         'ISOSpeedRatings',
//         'ExposureTime',
//         'FocalLength', 'LensMake', 'LensModel', 'ApertureValue']));
//     console.log(exifData);
// });
// console.log("----", exifDataArr)
// fs.writeFile('./demo.json', JSON.stringify(exifDataArr), 'utf-8', (err) => {
//     if (err) {
//         console.error('Error appending file:', err);
//     } else {
//         console.log('File appended successfully');
//     }
// })
// console.log(imageFiles); // 输出文件列表

const kMap = {
    "0.01666666": "1/60",
    "0.00555555": "1/180",
    "0.03333333": "1/30"
}

async function addBorderAndExif(imagePath, exifData) {
    const image = sharp(imagePath);
    let { width, height } = await image.metadata();

    const cameraMake = exifData.Make ? exifData.Make.toLowerCase() : 'unknown';
    const cameraModel = exifData.Model || 'Unknown Model';
    const dateTimeOriginal = exifData.DateTimeOriginal || 'Unknown Date';
    const exposureTime = exifData.ExposureTime ? `${exifData.ExposureTime}s` : 'Unknown Exposure';
    const fNumber = exifData.FNumber ? `f/${exifData.FNumber}` : 'Unknown Aperture';
    const iso = exifData.ISO ? `${exifData.ISO}` : 'Unknown ISO';

    const orientation = exifData.Orientation || 1;

    // 因为存在有些是竖图，有些是横图，所以需要特殊处理一下
    if (orientation === 8) {
        await image.rotate(-90);
        // 宽高交换
        [width, height] = [height, width]
    }

    let kuaimen = ''

    for (const key in kMap) {
        if (exposureTime.toString().startsWith(key)) {
            kuaimen = kMap[key]
        }
    }


    const logoPath = path.join(logoFolder, `${cameraMake}.png`);
    let logoBuffer;

    try {
        logoBuffer = fs.readFileSync(logoPath);
    } catch (err) {
        console.warn(`Logo not found for camera make: ${cameraMake}`);
        logoBuffer = null;
    }

    const borderWidth = 240;
    const text = `${cameraModel} ${kuaimen} ${fNumber} ISO: ${iso}`;

    const svgImage = `
        <svg width="${width}" height="${height + borderWidth}" xmlns="http://www.w3.org/2000/svg" >
          <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="black" stroke-width="10"/>
          <rect x="0" y="${height}" width="${width}" height="${borderWidth}" fill="white"/>
          <text x="${width - 1350}" y="${height + 160}" font-size="100" fill="black">${text}</text>
        </svg>
      `;


    const svgBuffer = Buffer.from(svgImage);
    const compositeLayers = [{ input: svgBuffer, gravity: 'center' }]

    if (logoBuffer) {
        const resizedLogoBuffer = await sharp(logoBuffer)
            .resize(logoSize.width, logoSize.height)
            .toBuffer();
        compositeLayers.push({ input: resizedLogoBuffer, gravity: 'southwest' });
    }


    await image
        .extend({
            top: 0,
            bottom: borderWidth,
            left: 0,
            right: 0,
            background: 'white'
        })
        .composite(compositeLayers)
        .toFile(path.join(outputFolder, path.basename(imagePath)));

    console.log(`Processed ${imagePath}`);
}

(async () => {
    for (const imagePath of imageFiles) {
        const exifData = getExifData(imagePath);
        await addBorderAndExif(imagePath, exifData);
    }

})();
