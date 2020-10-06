export default class ColumnsState {
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
}