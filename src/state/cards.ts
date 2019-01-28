import { createStore } from 'lib/hookstore';
import app from 'utils/firebase';

type cardsResponse = anyObject<Card>;

export type CardsState = {
  cards: Card[];
  waitingForUpdate: boolean;
};

const cardsState = createStore<CardsState>('cards', {
  state: {
    cards: [],
    waitingForUpdate: false,
  },
});

const cardsRef = app.database().ref('/cards/');

/* update state on db change */
cardsRef.on('value', (response) => {
  const cardsResponse: cardsResponse = (response as NonNullable<
    typeof response
  >).val();
  const transformedCards = Object.keys(cardsResponse).map(
    id => cardsResponse[id]
  );

  cardsState.setKey('cards', transformedCards);
  cardsState.setKey('waitingForUpdate', false);
});

/* push changes */
export function pushCards(toUpdate: Card[]) {
  cardsState.setKey('waitingForUpdate', true);

  const updates: anyObject<Card | undefined> = {};

  toUpdate.forEach((card) => {
    updates[`/cards/${card.id}`] = card;
  });

  // toDelete.forEach((id) => {
  //   updates[`/cards/${card.id}`] = null;
  // });

  app
    .database()
    .ref()
    .update(updates);
}

export default cardsState;
