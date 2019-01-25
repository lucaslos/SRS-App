/* react icon set creator v1.0.0 */

const fs = require('fs');
const path = require('path');
const clipboardy = require('clipboardy');
const SVGO = require('svgo-sync');

// TODO: merge sets

/* settings */
const inputFolder = '../resources/Navigation Icons/';
const outputFile = '../src/data/iconsStore.json';
const input = {
  logo: `
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10H34.7068C35.5799 10 36.0337 11.0406 35.4396 11.6805L24.2967 23.6805C24.1075 23.8842 23.842 24 23.5639 24H18C14.134 24 11 20.866 11 17C11 13.134 14.134 10 18 10Z" fill="#00FFC2"/>
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M30 24H24.4361C24.158 24 23.8925 24.1158 23.7033 24.3195L12.5604 36.3195C11.9663 36.9594 12.4201 38 13.2932 38H30C33.866 38 37 34.866 37 31C37 27.134 33.866 24 30 24Z" fill="#00FFC2"/>
  </svg>
  `,
};
const renames = {
  'turn-left': 'left',
  'turn-right': 'right',
};
/* settings end */

/* code start */
const icons = {};

const svgo = new SVGO({
  plugins: [{ convertShapeToPath: true }, { mergePaths: true }],
});

function isNumericStr(str) {
  return /^\d+\.\d+$/.test(str);
}

function forEachMatch(regex, string, callback) {
  let result;
  while ((result = regex.exec(string)) !== null) {
    callback(...result);
  }
}

// function ifHasProp(prop, string, callback) {
//   const match = RegExp(`${prop}="(.+)"`, 'g').exec(string);
//   if (match[1]) callback(match[1]);
// }

function convertSvg(content) {
  // get viewBox
  const viewBox = /viewBox="(.*?)"/g.exec(content)[1];
  let paths = [];
  const rects = [];
  let colors = [];
  let finalContent = content;
  let colorIndex = 1;

  // get colors
  forEachMatch(/fill="(.+?)"/g, content, (full, color) => {
    if (color !== 'none' && !colors.includes(color)) {
      finalContent = finalContent.replace(RegExp(color, 'g'), colorIndex);
      colors.push(color);
      colorIndex++;
    }
  });

  // check colors
  if (colors.length < 2) {
    colors = [];
    finalContent = finalContent.replace(/fill=".+?"/g, '');
  }

  // get paths
  forEachMatch(/<path.+?\/>/g, finalContent, (fullMatch) => {
    const elem = {};

    forEachMatch(/(\S+?)="(.+?)"/g, fullMatch, (full, prop, value) => {
      elem[prop] = isNumericStr(value) ? Number(value) : value;
    });

    paths.push(elem);
  });

  paths = paths.map(elem => Object.keys(elem).reduce((object, key) => {
    if (['fill-rule', 'clip-rule'].includes(key)) {
      object.evenodd = true;
    } else {
      object[key] = elem[key];
    }

    return object;
  }, {}));

  // get rects
  forEachMatch(/<rect.+?\/>/g, finalContent, (fullMatch) => {
    const elem = {};

    forEachMatch(/(\S+?)="(.+?)"/g, fullMatch, (full, prop, value) => {
      elem[prop] = isNumericStr(value) ? Number(value) : value;
    });

    rects.push(elem);
  });

  if (paths.length === 0 && rects.length === 0) {
    return false;
  }

  return {
    viewBox,
    ...colors.length > 0 && { colors },
    ...paths.length > 0 && { paths },
    ...rects.length > 0 && { rects },
  };
}

function addIcon(name, fileDir) {
  // const data = fs.readFileSync(fileDir, 'utf8');
  const { data } = svgo.optimizeSync(fs.readFileSync(fileDir, 'utf8'));

  const convertedSvg = convertSvg(data);

  if (!convertedSvg) {
    console.error(`ERR! svg '${name}' has invalid elements`);
  } else {
    icons[renames[name] || name] = convertedSvg;
  }
}

function addSVGFromFolder(folder, prefix = '') {
  const files = fs.readdirSync(folder);

  files.forEach((file) => {
    const fileDir = path.join(folder, file);
    const fileName = path.basename(fileDir, '.svg');

    if (fs.statSync(fileDir).isDirectory()) {
      addSVGFromFolder(fileDir, `${prefix}${fileName}-`);
    } else {
      addIcon(`${prefix}${fileName}`, fileDir);
    }
  });
}

const inputIcons = Object.keys(input);

if (!input[inputIcons[0]]) {
  addSVGFromFolder(path.join(__dirname, inputFolder));

  fs.writeFile(path.join(__dirname, outputFile), JSON.stringify(icons, null, 2), (err) => {
    if (err) throw err;

    console.log('JSON svg icon set created!');
  });
} else {
  let copyIcons = '';

  inputIcons.forEach((icon) => {
    const { data } = svgo.optimizeSync(input[icon]);
    copyIcons = `${copyIcons}"${icon}": ${JSON.stringify(convertSvg(data), null, 2)},\n`;
  });

  copyIcons = copyIcons.slice(0, -2);

  clipboardy.writeSync(copyIcons);
  process.stdout.write(`${copyIcons}\n\n Copied to clipboard!`);
}
