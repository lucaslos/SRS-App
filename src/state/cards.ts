import { createStore, setKey } from 'lib/hookstore';
import app from 'utils/firebase';

function initialize() {
  createStore('cards', {
    state: {
      cards: [],
    },
  });
}

// load cards
app
  .database()
  .ref('/cards/')
  .once('value')
  .then((response) => {
    setKey('cards', 'cards', response.val());
  });

export default initialize;
