(() => {
  function closePopUp() {
    document.body.removeChild(document.getElementById('boxPopUp'));
  }

  function copyText() {
    document.getElementById('input_bookmarklet').focus();
    document.getElementById('input_bookmarklet').select();
    document.execCommand('copy');

    window.removeEventListener('click', copyText);

    closePopUp();
  }

  function openPopUp(content, width) {
    const box = document.createElement('div');

    box.style.zIndex = '99999';

    document.body.appendChild(box);

    box.innerHTML = content;
    box.id = 'boxPopUp';

    box.style.position = 'absolute';
    box.style.background = '#4d90fe';
    box.style.color = '#000';
    box.style.padding = '36px';
    box.style.top = '20px';
    box.style.left = '50%';
    box.style.fontSize = '46px';
    box.style.textAlign = 'center';
    box.style.fontWeight = '300';
    box.style.width = `${width}px`;
    box.style.borderRadius = '16px';
    box.style.cursor = 'pointer';
    box.style.marginLeft = `-${width / 2}px`;
    box.style.boxShadow = 'rgba(45,45,45,0.05) 0px 2px 2px, rgba(49,49,49,0.05) 0px 4px 4px, rgba(42,42,42,0.05) 0px 8px 8px, rgba(32,32,32,0.05) 0px 16px 16px, rgba(49,49,49,0.05) 0px 32px 32px, rgba(35,35,35,0.05) 0px 64px 64px';
  }

  const en = document.getElementsByClassName('gt-pb-stc');
  const pt = document.getElementsByClassName('gt-pb-ttc');

  const wordsTable = [];

  for (let i = 0; i < 100; i++) {
    wordsTable.push([en[i].innerText.toLowerCase(), pt[i].innerText.toLowerCase()]);
  }

  openPopUp(`Click to copy ${wordsTable.length} cards<textarea id='input_bookmarklet' type='text' style='position: absolute; top: 0; left: 0; opacity:0'>${JSON.stringify(wordsTable)}</textarea>`, 300);
  window.document.getElementById('boxPopUp').addEventListener('click', copyText);
})();
