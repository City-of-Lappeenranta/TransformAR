/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, './assets/');

function generateSvgIconNames(dirPath) {
  const svgIconNames = [];
  console.log('generating svg icons');

  function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isFile() && path.extname(filePath) === '.svg') {
        const iconName = path.basename(file, '.svg');
        const svgContent = fs.readFileSync(filePath, 'utf-8');
        const { width, height } = getSvgDimensions(svgContent);

        svgIconNames.push({
          name: iconName,
          width,
          height,
          svg: svgContent.replace(/width="([^"]+)"/, 'width="100%"').replace(/height="([^"]+)"/, 'height="100%"'),
        });
      } else if (fileStat.isDirectory()) {
        processDirectory(filePath);
      }
    });
  }

  processDirectory(dirPath);

  console.log('completed generating svg icons');
  return svgIconNames;
}

function getSvgDimensions(svgContent) {
  // Use regular expressions to extract width and height attributes
  const widthMatch = svgContent.match(/width="([^"]+)"/);
  const heightMatch = svgContent.match(/height="([^"]+)"/);

  // If matches are found, extract values and parse as numbers
  const width = widthMatch ? parseFloat(widthMatch[1]) : 0;
  const height = heightMatch ? parseFloat(heightMatch[1]) : 0;

  return { width, height };
}

const svgIconNames = generateSvgIconNames(directoryPath);
const outputFilePath = path.join(__dirname, './app/shared/components/icon/svg-icons.generated.ts');
const exportContent = `export const SVG_ICONS = ${JSON.stringify(svgIconNames, null, 2)}`;

fs.writeFileSync(outputFilePath, exportContent);
