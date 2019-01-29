import { createStore } from "lib/hookstore";

type ModalsState = {
  reviewDialog: boolean;
  review: boolean;
  addCards: boolean;
}

const modalsState = createStore<ModalsState>('modals', {
  state: {
    reviewDialog: false,
    review: false,
    addCards: false,
  },
});

export default modalsState;
