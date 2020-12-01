const DEFAULT_ITEM = {
  params: {},
  type: '',
  uuid: 'new'
};

const DEFAULT_ITEMS = {
  note: {
    ...DEFAULT_ITEM,
    params: {
      content: ''
    },
    type: 'note'
  }
};

export default class CardModalState {
  static addBoard(state, name, slug, path) {
    const boardOrder = Array.from(state.boardOrder);
    const idx = boardOrder.indexOf('');
    if (idx > 0) boardOrder.splice(idx, 1);

    if (boardOrder.indexOf(slug) < 0) boardOrder.push(slug);

    console.log(boardOrder);
    console.log(state.boardOrder);

    return {
      ...state,
      boardOrder: boardOrder,
      boards: {
        ...state.boards,
        [slug]: {
          name: name,
          path: path
        }
      }
    };
  }

  static addItem(state, type, data, uuid) {
    const newState = this.deleteItem(state, 'new');

    const itemOrder = Array.from(newState.itemOrder);
    itemOrder.push(uuid);

    return {
      itemOrder: itemOrder,
      items: {
        ...newState.items,
        [uuid]: {
          ...DEFAULT_ITEMS[type],
          ...data,
          uuid: uuid
        }
      }
    };
  }

  static deleteBoard(state, slug) {
    const newBoardOrder = Array.from(state.boardOrder);
    const idx = newBoardOrder.indexOf(slug);

    if (idx < 0) return state;

    newBoardOrder.splice(idx, 1);

    return {
      ...state,
      boardOrder: newBoardOrder
    };
  }

  static deleteItem(state, uuid) {
    const newItemOrder = Array.from(state.itemOrder);
    const newItems = { ...state.items };
    const idx = newItemOrder.indexOf(uuid);

    if (idx < 0) return state;

    newItemOrder.splice(idx, 1);
    delete newItems[uuid];

    return {
      itemOrder: newItemOrder,
      items: newItems
    };
  }
}