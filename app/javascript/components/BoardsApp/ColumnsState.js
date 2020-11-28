export default class ColumnsState {
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
}