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

export function filterImport(pastedContent: string) {
  const { cards } = cardsState.getState();

  const words = parseJSON<
    { front: string; back: string; notes?: string[]; tags: string[] }[]
  >(pastedContent);

  if (!words || !words[0] || !words[0].back) return false;

  const newCards: Card[] = [];

  for (let i = 0; i < words.length; i++) {
    const { front, back, notes, tags } = words[i];

    if (!cards.some(card => card.front === front && card.back === back)) {
      newCards.push({
        id: '0',
        back,
        front,
        notes: notes && notes.length > 0 ? notes : [],
        tags: tags && tags.length > 0 ? tags : [],
        diff: 0,
        lang: 'en',
        wrongReviews: 0,
        repetitions: 0,
      });
    } else {
      alert(`${front}⇢${back} is duplicated.`);
    }
  }

  return newCards;
}
