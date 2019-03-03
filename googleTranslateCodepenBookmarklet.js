(() => {
  // version is useful to check witch script is running
  console.log('bookmarklet v1.1.1');

  // code goes here
  function closePopUp() {
    window.document
      .getElementById('boxPopUp')
      .removeEventListener('click', copyText);
    document.body.removeChild(document.getElementById('boxPopUp'));
  }

  function copyText() {
    document.getElementById('input_bookmarklet').focus();
    document.getElementById('input_bookmarklet').select();
    document.execCommand('copy');

    closePopUp();
  }

  function openPopUp(title, content, width) {
    const box = document.createElement('div');

    box.style.zIndex = '99999';

    document.body.appendChild(box);

    const innerHTML = `
      ${title}
      <textarea id='input_bookmarklet' type='text' style='position: absolute; top: 0; left: 0; opacity:0'>
        ${content}
      </textarea>`;

    box.innerHTML = innerHTML;
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
    box.style.boxShadow =
      'rgba(45,45,45,0.05) 0px 2px 2px, rgba(49,49,49,0.05) 0px 4px 4px, rgba(42,42,42,0.05) 0px 8px 8px, rgba(32,32,32,0.05) 0px 16px 16px, rgba(49,49,49,0.05) 0px 32px 32px, rgba(35,35,35,0.05) 0px 64px 64px';

    window.document
      .getElementById('boxPopUp')
      .addEventListener('click', copyText);
  }

  const nextBtn = document.querySelector('.tlid-phrasebook-header-next-page');
  const backBtn = document.querySelector('.tlid-phrasebook-header-prev-page');
  const pages = 12;

  const wordsToCopy = [];
  let currPage = 0;

  function getWords() {
    const words = document.querySelectorAll('.browse-entry bdi');

    for (let i2 = 0; i2 < 20; i2 += 2) {
      wordsToCopy.push({
        front: words[i2].innerText,
        back: words[i2 + 1].innerText,
      });
    }

    currPage++;

    if (currPage < pages) {
      nextBtn.click();
      setTimeout(getWords, 50);
    } else {
      openPopUp(
        `Click to copy ${wordsToCopy.length} cards`,
        JSON.stringify(wordsToCopy.reverse()),
        300
      );
      console.log(wordsToCopy.reverse());
    }
  }

  function goToStart() {
    const pos = document.querySelector(
      '.tlid-phrasebook-header-num-phrases.num-phrases'
    );

    if (/^1–10 /.test(pos.innerText)) {
      getWords();
    } else {
      backBtn.click();
      setTimeout(goToStart, 50);
    }
  }

  goToStart();
})();

/* bookmarklet, create a bookmark with the following code as the url

javascript:(function(){window.s0=document.createElement('script');window.s0.setAttribute('type','text/javascript');window.s0.setAttribute('src','https://codepen.io/lucaslos/pen/XGdORG.js?u='+Math.random().toString(36).substr(2, 9));document.getElementsByTagName('body')[0].appendChild(window.s0);})();

*/
