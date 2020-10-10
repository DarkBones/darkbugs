export default class ColumnsState {
  static addColumn(state, uuid, name) {
    const newState = this._deleteColumn(state, 'new')

    const newColumn = {
      uuid: uuid,
      name: name,
      card_uuids: []
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

  static deleteColumn(state, columnUuid) {
    return this._deleteColumn(state, columnUuid)
  }

  static reorderColumns(state, source, destination, draggableId) {
    const newColumnOrder = Array.from(state.columnOrder)

    newColumnOrder.splice(source.index, 1)
    newColumnOrder.splice(destination.index, 0, draggableId)

    return {
      ...state,
      columnOrder: newColumnOrder
    }
  }

  static updateName(state, columnUuid, name) {
    return {
      ...state,
      columns: {
        ...state.columns,
        [columnUuid]: {
          ...state.columns[columnUuid],
          name: name
        }
      }
    }
  }

  static _deleteColumn(state, columnUuid) {
    const columnOrder = Array.from(state.columnOrder)
    const columns = state.columns
    const index = columnOrder.indexOf(columnUuid)

    if (index < 0) return state

    columnOrder.splice(index, 1)
    delete columns[columnUuid]

    return {
      ...state,
      columnOrder: columnOrder,
      columns: columns
    }
  }
}