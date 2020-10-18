export default class CardModalState {
  static deleteItem(state, itemUuid) {
    return this._deleteItem(state, itemUuid)
  }

  static _deleteItem(state, uuid) {
    const card = state.cardData

    delete card.items[uuid]

    let itemOrder = Array.from(card.itemOrder)
    const idx = itemOrder.indexOf(uuid)

    if (idx >= 0) {
      itemOrder.splice(idx, 1)
    }

    return {
      ...state,
      cardData: {
        ...state.cardData,
        itemOrder: itemOrder,
        items: card.items
      }
    }
  }
}