import { getGoogleFontsImportUrl } from '@utils/getGoogleFontsImportUrl';

export function addGoogleFonts() {
  const googleFonts = getGoogleFontsImportUrl([
    {
      family: 'Work+Sans',
      weights: [300, '..', 700],
    },
  ]);

  var headID = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = googleFonts;

  headID?.appendChild(link);
}
