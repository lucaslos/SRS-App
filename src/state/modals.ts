import { createStore } from "lib/hookstore";

type ModalsState = {
  reviewDialog: boolean;
  review: boolean;
  addCards: boolean;
  cardsList: boolean;
  version: boolean;
}

const modalsState = createStore<ModalsState>('modals', {
  state: {
    reviewDialog: false,
    review: false,
    addCards: false,
    cardsList: false,
    version: false,
  },
});

export default modalsState;
