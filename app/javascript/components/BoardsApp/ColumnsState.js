export default class ColumnsState {
  static addCard(state, columnUuid, columnIndex, name, uuid) {
    state = this.deleteCard(state, 'new');

    const column = state.columns[columnUuid];
    const { cardOrder, columnOrder, columns } = state;
    const cardUuids = column.card_uuids;
    let allIndex = cardOrder.indexOf(cardUuids[columnIndex]);

    if (allIndex < 0) {
      let colIdx = columnOrder.indexOf(columnUuid);
      let col = {};
      while (colIdx >= 0) {
        col = columns[columnOrder[colIdx]];
        if (col.card_uuids.length > 0) {
          allIndex = cardOrder.indexOf(col.card_uuids[col.card_uuids.length - 1]) + 1;
          break;
        }

        colIdx--;
      }
    }

    const cards = {
      ...state.cards,
      [uuid]: {
        name: name,
        uuid: uuid
      }
    };

    cardUuids.splice(columnIndex, 0, uuid);
    cardOrder.splice(allIndex, 0, uuid);

    return {
      ...state,
      cardOrder: cardOrder,
      cards: cards
    }

  }

  static addColumn(state, uuid, name) {
    if (state.columnOrder.includes(uuid)) return state;

    const newState = this.deleteColumn(state, 'new');

    const newColumn = {
      uuid:       uuid,
      name:       name,
      card_uuids: []
    };

    const columnOrder = Array.from(newState.columnOrder);
    columnOrder.push(uuid);

    return {
      ...newState,
      columnOrder:  columnOrder,
      columns:      {
                      ...newState.columns,
                      [uuid]: newColumn
                    }
    };
  }

  static deleteCard(state, uuid) {
    const {
      cardOrder,
      cards,
      columnOrder,
      columns
    } = state;

    let newState = {...state};
    const newCardOrder = Array.from(cardOrder);
    const allIndex = newCardOrder.indexOf(uuid);

    if (allIndex >= 0) newCardOrder.splice(allIndex, 1);

    newState = {
      ...newState,
      cardOrder:  newCardOrder,
      cards:      cards
    }

    let column;
    let newCardUuids;
    let idx;
    columnOrder.forEach((columnUuid) => {
      column = columns[columnUuid];
      newCardUuids = Array.from(column.card_uuids);
      idx = newCardUuids.indexOf(uuid);

      if (idx >= 0) {
        newCardUuids.splice(idx, 1);

        newState = {
          ...newState,
          columns: {
            ...newState.columns,
            [columnUuid]: {
              ...newState.columns[columnUuid],
              card_uuids: newCardUuids
            }
          }
        }
      }
    })

    return newState;
  }

  static deleteColumn(state, uuid) {
    const columnOrder = Array.from(state.columnOrder);
    const index = columnOrder.indexOf(uuid);

    if (index < 0) return state;

    const columns = {...state.columns};
    const cardOrder = Array.from(state.cardOrder);
    const columnCards = columns[uuid].card_uuids;

    columnOrder.splice(index, 1);

    if (columnCards.length > 0) {
      cardOrder.splice(cardOrder.indexOf(columnCards[0]), columnCards.length);
    }

    delete columns[uuid];

    return {
      ...state,
      cardOrder:    cardOrder,
      columnOrder:  columnOrder,
      columns:      columns
    };
  }

  static saveCard(state, name, uuid, columnUuid) {
    const { cardOrder, columns } = state;
    const allIndex = cardOrder.indexOf('new');

    const column = columns[columnUuid];
    const columnIndex = column.card_uuids.indexOf('new');

    if (allIndex < 0) return state;

    const cards = {
      ...state.cards,
      [uuid]: {
        name: name,
        uuid: uuid
      }
    };

    const { card_uuids: cardUuids } = column;
    cardUuids.splice(columnIndex, 1, uuid);

    const newColumn = {
      ...column,
      card_uuids: cardUuids
    }

    cardOrder.splice(allIndex, 1, uuid);

    return {
      ...state,
      cards:      cards,
      cardOrder:  cardOrder,
      columns:    {
                    ...columns,
                    [columnUuid]: newColumn
                  }
    };
  }
}