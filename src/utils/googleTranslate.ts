import cardsState from 'state/cards';
import removeMd from 'remove-markdown';

const wordsLimit = 30;

function parseJSON<T = any>(string: string): T | false {
  try {
    return JSON.parse(string);
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function filterCardsFromGoogleTranslate(pastedContent: string) {
  const { cards } = cardsState.getState();

  const words = parseJSON<{ front: string; back: string }[]>(pastedContent);

  if (!words || !words[0] || !words[0].back) return false;

  const newCards: Card[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const backLines = word.back.split('\n');
    const back = (backLines.length === 1 ? backLines[0] : backLines[1])
      .trim()
      .toLowerCase();
    const front = word.front
      .replace('#', '')
      .trim()
      .toLowerCase();

    if (
      !cards.some(card => card.front === front && card.back === back)
    ) {
      newCards.push({
        id: '0',
        back,
        front,
        notes: [],
        tags: [],
        diff: 0,
        lang: 'en',
        wrongReviews: 0,
        repetitions: 0,
      });
    } else {
      console.log(`${word.front}|${word.back} is duplicated.`);
    }
  }

  return newCards.slice(0, wordsLimit);
}
