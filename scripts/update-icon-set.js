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
  'card-list': `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 10H42V14H14V10Z" fill="#00FFC2"/>
    <path d="M8 15C9.65685 15 11 13.6569 11 12C11 10.3431 9.65685 9 8 9C6.34315 9 5 10.3431 5 12C5 13.6569 6.34315 15 8 15Z" fill="#00FFC2"/>
    <path d="M14 22H42V26H14V22Z" fill="#00FFC2"/>
    <path d="M14 34H42V38H14V34Z" fill="#00FFC2"/>
    <path d="M8 39C9.64 39 11 37.64 11 36C11 34.36 9.66 33 8 33C6.34 33 5 34.36 5 36C5 37.64 6.36 39 8 39Z" fill="#00FFC2"/>
    <path d="M8 27C9.65685 27 11 25.6569 11 24C11 22.3431 9.65685 21 8 21C6.34315 21 5 22.3431 5 24C5 25.6569 6.34315 27 8 27Z" fill="#00FFC2"/>
    </svg>
  `,
  'add-circle': `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 14H22V22H14V26H22V34H26V26H34V22H26V14Z" fill="#00FFC2"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 24C4 12.96 12.96 4 24 4C35.04 4 44 12.96 44 24C44 35.04 35.04 44 24 44C12.96 44 4 35.04 4 24ZM8 24C8 32.82 15.18 40 24 40C32.82 40 40 32.82 40 24C40 15.18 32.82 8 24 8C15.18 8 8 15.18 8 24Z" fill="#00FFC2"/>
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
  const copyIcons = {};

  inputIcons.forEach((icon) => {
    const { data } = svgo.optimizeSync(input[icon]);
    copyIcons[icon] = convertSvg(data);
  });

  const copyJson = JSON.stringify(copyIcons, null, 2);

  clipboardy.writeSync(copyJson);
  process.stdout.write(`${copyJson}\n\n Copied to clipboard!`);
}
