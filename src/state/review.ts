import { createStore } from 'lib/hookstore';

function initialize() {
  createStore('review', {
    state: {
      numOfCards: 0,
    },
  });
}

export default initialize;
