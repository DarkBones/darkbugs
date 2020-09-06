export function updateColumnOrderState (state, source, destination, draggableId) {
  const newColumnOrder = Array.from(state.columnOrder)

  newColumnOrder.splice(source.index, 1)
  newColumnOrder.splice(destination.index, 0, draggableId)

  return {
    ... state,
    columnOrder: newColumnOrder
  }
}

export function updateColumnNameState (state, columnUuid, newName) {
  return {
    ... state,
    columns: {
      ... state.columns,
      [columnUuid]: {
        ... state.columns[columnUuid],
        name: newName
      }
    }
  }
}

export function addColumnState (state, uuid, name) {
  const newColumn = {
    uuid: uuid,
    name: name
  }

  let newColumnOrder = state.columnOrder
  newColumnOrder.push(uuid)

  return {
    ... state,
    columns: {
      ... state.columns,
      [uuid]: newColumn
    },
    columnOrder: newColumnOrder
  }
}

export function cancelNewColumnState (state) {
  let columnOrder = state.columnOrder
  const columnOrderIndex = columnOrder.indexOf('new')

  if (columnOrderIndex === -1) {
    return state
  }

  columnOrder.splice(columnOrderIndex, 1)
  let columns = state.columns
  delete columns['new']

  return {
    ... state,
    columns: columns,
    columnOrder: columnOrder
  }
}
