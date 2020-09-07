export function updateColumnOrderState (state, source, destination, draggableId) {
  const newColumnOrder = Array.from(state.columnOrder)

  newColumnOrder.splice(source.index, 1)
  newColumnOrder.splice(destination.index, 0, draggableId)

  return {
    ... state,
    columnOrder: newColumnOrder
  }
}

export function updateCardOrderState (state, source, destination, draggableId) {
  let columns = state.columns
  let sourceCards = Array.from(columns[source.droppableId].card_uuids)
  let destinationCards = Array.from(columns[destination.droppableId].card_uuids)

  console.log(sourceCards)
  console.log(source.index)
  sourceCards.splice(source.index, 1)
  console.log(sourceCards)

  if (source.droppableId === destination.droppableId) {
    sourceCards.splice(destination.index, 0, draggableId)
    destinationCards = Array.from(sourceCards)
  } else {
    destinationCards.splice(destination.index, 0, draggableId)
  }

  console.log(destination.index)
  console.log(destinationCards)

  return {
    ...state,
    columns: {
      ...state.columns,
      [source.droppableId]: {
        ...state.columns[source.droppableId],
        card_uuids: sourceCards
      },
      [destination.droppableId]: {
        ...state.columns[destination.droppableId],
        card_uuids: destinationCards
      }
    }
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
    name: name,
    card_uuids: []
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
  return deleteColumn(state, 'new')
}

export function deleteColumnState (state, columnUuid) {
  return deleteColumn(state, columnUuid)
}

function deleteColumn (state, columnUuid) {
  let columnOrder = state.columnOrder
  const columnOrderIndex = columnOrder.indexOf(columnUuid)

  if (columnOrderIndex === -1) {
    return state
  }

  columnOrder.splice(columnOrderIndex, 1)
  let columns = state.columns
  delete columns[columnUuid]

  return {
    ...state,
    columns: columns,
    columnOrder: columnOrder
  }
}
