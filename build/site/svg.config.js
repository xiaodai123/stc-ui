const fs = require('fs');
const resolve = require('path').resolve;
const svgFiles = fs.readdirSync(resolve(__dirname, '../../src/core/svgAssets'));
let svgNames = []
svgNames = svgFiles.map(file => {
    return file.replace('.svg', '');
})
fs.writeFile(resolve(__dirname, '../../site/demo/svg.json'), JSON.stringify(svgNames), () => {});