import { createStore } from 'lib/hookstore';
import app from 'utils/firebase';

export type CardsState = {
  cards: Card[];
}

const cardsState = createStore<CardsState>('cards', {
  state: {
    cards: [],
  },
});

// load cards
app
  .database()
  .ref('/cards/')
  .once('value')
  .then((response) => {
    cardsState.setKey('cards', response.val());
  }, (err) => {
    alert('Error: firebase fetch');
    console.log(err);
  });

export default cardsState;
