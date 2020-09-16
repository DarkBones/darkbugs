export default class ColumnsState {
  static deleteColumn(state, columnUuid) {
    return this.deleteColumnState(state, columnUuid)
  }

  static addColumn(state, uuid, name) {
    const newState = this.deleteColumnState(state, 'new')

    const newColumn = {
      uuid: uuid,
      name: name,
      cardUuids: []
    }

    let columnOrder = Array.from(newState.columnOrder)

    if (columnOrder.includes(uuid)) return newState

    columnOrder.push(uuid)

    return {
      ...newState,
      columnOrder: columnOrder,
      columns: {
        ...newState.columns,
        [uuid]: newColumn
      }
    }
  }

  static updateName(state, uuid, name) {
    return {
      ...state,
      columns: {
        ...state.columns,
        [uuid]: {
          ...state.columns[uuid],
          name: name
        }
      }
    }
  }

  static deleteColumnState(state, columnUuid) {
    let columnOrder = Array.from(state.columnOrder)
    let columns = state.columns
    const index = columnOrder.indexOf(columnUuid)

    if (index < 0) {
      return state
    }

    columnOrder.splice(index, 1)
    delete columns[columnUuid]

    return {
      ...state,
      columnOrder: columnOrder,
      columns: columns
    }
  }
}