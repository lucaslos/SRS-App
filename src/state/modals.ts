import { createStore } from "lib/hookstore";

type ModalsState = {
  reviewDialog: boolean;
  review: boolean;
}

const modalsState = createStore<ModalsState>('modals', {
  state: {
    reviewDialog: false,
    review: false,
  },
});

export default modalsState;
