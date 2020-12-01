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

  static deleteItem(state, uuid) {
    const newItemOrder = Array.from(state.itemOrder);
    const newItems = { ...state.items };
    const idx = newItemOrder.indexOf(uuid);

    if (idx < 0) return state;

    newItemOrder.splice(idx);
    delete newItems[uuid];

    return {
      itemOrder: newItemOrder,
      items: newItems
    };
  }
}