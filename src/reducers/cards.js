import _ from 'lodash';

export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_CARD':
      return Object.assign({}, state, {
        active: action.cardId,
      });

    case 'SET_CARDS':
      return Object.assign({}, state, {
        items: action.cards,
      });

    case 'ADD_CARD':
      return Object.assign({}, state, {
        items: [...state.items, action.card],
      });

    case 'ADD_CARD_TO_DELETION':
      return Object.assign({}, state, {
        deleteCards: [...state.deleteCards, action.cardId],
      });

    case 'DELETE_CARD':
      return Object.assign({}, state, {
        items: state.items.filter(card => card.id !== action.cardId),
      });

    case 'REMOVE_LAST':
      return Object.assign({}, state, {
        items: state.items.slice(0, -1),
      });

    case 'REMOVE_DUPLICATES':
      return { ...state, items: state.items.filter(card => !card.ignoreInSRSAlgo) };

    case 'RESET':
      return {
        isFetching: false,
        active: false,
        items: [],
        deleteCards: [],
      };

    case 'EDIT_CARD_CACHE':
      return Object.assign({}, state, {
        items: state.items.map(card => (
          card.id === action.card.id
            ? action.card
            : card
        )),
      });

    case 'FETCH_CARDS_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      });

    case 'FETCH_CARDS_SUCCESS':
      return Object.assign({}, state, {
        isFetching: false,
        items: action.cards,
      });

    case 'RIFFLE': {
      return Object.assign({}, state, {
        items: _.shuffle(state.items),
      });
    }

    case 'REGISTER_CARD_ANSWER':
      return Object.assign({}, state, {
        items: state.items.map(card => (
          card.id === action.id
            ? Object.assign({}, card, { answer: action.answer, edited: true })
            : card
        )),
      });

    case 'MOVE_TO_END': {
      if (action.position + 1 === state.items.length) {
        const tempArray = state.items.filter(card => card.id !== action.cardId);
        return Object.assign({}, state, {
          items: [
            ...state.items,
            {
              ...tempArray[Math.floor(Math.random() * tempArray.length)],
              ignoreInSRSAlgo: true,
            },
            {
              ...state.items.find(card => card.id === action.cardId),
              ignoreInSRSAlgo: true,
            },
          ],
        });
      }

      return Object.assign({}, state, {
        items: [
          ...state.items,
          {
            ...state.items.find(card => card.id === action.cardId),
            ignoreInSRSAlgo: true,
          },
        ],
      });
    }

    case 'ADD_TAG':
      return {
        ...state,
        items: state.items.map((card) => {
          card.tags = card.tags || [];

          return card.id === action.cardId
          ? {
            ...card,
            tags: [...card.tags, action.tag],
          }
          : card;
        }),
      };

    case 'ADD_NOTE':
      return {
        ...state,
        items: state.items.map((card) => {
          card.notes = card.notes || [];

          return card.id === action.cardId
          ? {
            ...card,
            notes: [...card.notes, action.note],
          }
          : card;
        }),
      };


    default:
      return state;
  }
};
