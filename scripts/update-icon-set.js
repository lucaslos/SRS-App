const fs = require('fs');
const path = require('path');
// const SVGO = require('svgo-sync');

// TODO: merge sets
// TODO: evennode handling
const input = ``;
const inputFolder = '../resources/Navigation Icons/';
const outputFile = '../src/data/iconsStore.json';

const renames = {
  'turn-left': 'left',
  'turn-right': 'right',
};

const icons = {};

// const svgo = new SVGO({
//   plugins: [
//     { convertShapeToPath: true },
//     { mergePaths: true },
//   ],
// });

function convertSvg(content) {
  // get viewBox
  const viewBox = /viewBox="(.*?)"/g.exec(content)[1];

  const regex = /d="(.*?)"/g;
  const paths = [];
  let result;
  // eslint-disable-next-line no-cond-assign
  while ((result = regex.exec(content)) !== null) {
    paths.push(result[1]);
  }

  const mergedPaths = paths.join(' ');

  if (mergedPaths === '' || content.match(/<(?!(path|svg|\/))/)) {
    return false;
  }

  return {
    path: mergedPaths,
    viewBox,
  };
}

function addIcon(name, fileDir) {
  const data = fs.readFileSync(fileDir, 'utf8');
  // const { data } = svgo.optimizeSync(fs.readFileSync(fileDir, 'utf8'));

  const convertedSvg = convertSvg(data);

  if (!convertedSvg) {
    console.error(`ERR! svg '${name}' has invalid elements`);
  } else {
    icons[renames[name] || name] = convertedSvg;
  }
}

function addSVGFromFolder(folder, prefix = '') {
  const files = fs.readdirSync(folder);

  files.forEach(file => {
    const fileDir = path.join(folder, file);
    const fileName = path.basename(fileDir, '.svg');

    if (fs.statSync(fileDir).isDirectory()) {
      addSVGFromFolder(fileDir, `${prefix}${fileName}-`);
    } else {
      addIcon(`${prefix}${fileName}`, fileDir);
    }
  });
}

if (!input.trim()) {
  addSVGFromFolder(path.join(__dirname, inputFolder));

  fs.writeFile(path.join(__dirname, outputFile), JSON.stringify(icons, null, 2), err => {
    if (err) throw err;

    console.log('JSON svg icon set created!');
  });
} else {
  process.stdout.write(JSON.stringify(convertSvg(input), null, 2));
}
