const showPopUpsUrls = {
  cambridgeTranslation:
    'http://dictionary.cambridge.org/us/search/english-portuguese/direct/?q=',
  cambridgeDefinition:
    'http://dictionary.cambridge.org/pt/buscar/english/direct/?q=',
  searchImages: 'https://www.shutterstock.com/search?searchterm=',
  oxford: 'https://en.oxforddictionaries.com/definition/us/',
  contextReverso: 'http://context.reverso.net/traducao/ingles-portugues/',
  googleTranslate: 'https://translate.google.com/?source=gtx_m#en/pt/',
  merriamWebster: 'https://www.merriam-webster.com/dictionary/',
};

export function showPopUp(url: keyof typeof showPopUpsUrls, query: string) {
  const urlToOpen = `${showPopUpsUrls[url]}${query}`;
  const title = 'SRS Popup';
  const w = 500;
  const h = 600;

  // Fixes dual-screen position Most browsers Firefox
  const dualScreenLeft = window.screenLeft;
  const dualScreenTop = window.screenTop;
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width; // eslint-disable-line
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height; // eslint-disable-line

  const left = dualScreenLeft;
  const top = height / 2 - h / 2 + dualScreenTop;
  const newWindow = window.open(
    urlToOpen,
    title,
    `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
  );

  // Puts focus on the newWindow
  if (window.focus && newWindow) {
    newWindow.focus();
  }
}
