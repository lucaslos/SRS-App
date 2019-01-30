import { createStore } from 'lib/hookstore';
import app from 'utils/firebase';
import {
  sortByFrequencyAndRemoveDuplicates,
  timeToDate,
} from 'utils/genericUtils';

type cardsResponse = anyObject<Card>;

export type CardsState = {
  cards: Card[];
  waitingForUpdate: boolean;
  mostUsedTags: string[];
};

const cardsState = createStore<CardsState>('cards', {
  state: {
    cards: [],
    waitingForUpdate: true,
    mostUsedTags: [],
  },
});

function getSuggestions(cards: Card[]) {
  let suggestions: string[] = [];

  cards.forEach(card => {
    if (card.tags && card.tags.length !== 0) {
      suggestions = suggestions.concat(card.tags);
    }
  });

  return sortByFrequencyAndRemoveDuplicates(suggestions);
}

/* update state on db change */
export function listenToCardsChange() {
  const cardsRef = app.database().ref(`${window.userId}/cards/`);

  cardsRef.off();
  cardsRef.on('value', response => {
    if (!response || !response.val()) throw new Error('Error on fetch cards');

    const cardsResponse: cardsResponse = response.val();
    const transformedCards = Object.keys(cardsResponse).map(
      id => cardsResponse[id]
    );

    cardsState.setKey('cards', transformedCards);
    cardsState.setKey('mostUsedTags', getSuggestions(transformedCards));
    cardsState.setKey('waitingForUpdate', false);
  });
}

type NewCard = Omit<Card, 'lastReview'> & { lastReview?: null | string };

/* push changes */
export function pushCards(
  toUpdate: Card[],
  toCreate?: NewCard[],
  toDelete?: string[]
) {
  cardsState.setKey('waitingForUpdate', true);

  const updates: anyObject<Card | NewCard | null> = {};

  toUpdate.forEach(card => {
    updates[`${window.userId}/cards/${card.id}`] = card;
  });

  if (toDelete) toDelete.forEach(id => {
      updates[`${window.userId}/cards/${id}`] = null;
    });

  if (toCreate) toCreate.forEach(card => {
      const newCardId = app
        .database()
        .ref()
        .child(`${window.userId}/cards`)
        .push().key;

      if (newCardId) {
        updates[`${window.userId}/cards/${newCardId}`] = {
          ...card,
          id: newCardId,
          createdAt: Date.now(),
          lastReview: null,
        };
      } else {
        alert(`can't create card ${card.front}`);
      }
    });

  app
    .database()
    .ref()
    .update(updates);
}

export function pushNewCards(cards: Card[]) {
  pushCards([], cards, []);
}

export function pushUpdateCard(card: Card) {
  pushCards([card]);
}

export function pushDeleteCard(id: Card['id']) {
  pushCards([], [], [id]);
}

export function getCardById(id: Card['id'], cards: Card[] = cardsState.getState().cards) {
  const findedcard = cards.find(card => card.id === id);

  if (findedcard) {
    return findedcard;
  }

  throw new Error(`Card of id: ${id} not exists`);
}

export default cardsState;
