export function updateColumnOrderState (state, source, destination, draggableId) {
  const newColumnOrder = Array.from(state.columnOrder)

  newColumnOrder.splice(source.index, 1)
  newColumnOrder.splice(destination.index, 0, draggableId)

  return {
    ... state,
    columnOrder: newColumnOrder
  }
}
