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

  static previousCardCount(state, columnUuid) {
    const { columnOrder, columns } = state
    let count = 0
    let breakLoop = false

    columnOrder.forEach(function (uuid) {
      if(uuid === columnUuid) {
        breakLoop = true
      }

      if(!breakLoop) {
        count += columns[uuid].card_uuids.length
      }
    })

    return count
  }

  static updateCardOrder(state, source, destination, draggableId) {
    const {
      columns
    } = state

    const cardOrder = Array.from(state.cardOrder)

    const sourceColumn = columns[source.droppableId]
    const destinationColumn = columns[destination.droppableId]

    const previousCardCount = this.previousCardCount(state, destination.droppableId)

    const sourceCards = Array.from(sourceColumn.card_uuids)

    sourceCards.splice(source.index - this.previousCardCount(state, source.droppableId), 1)
    cardOrder.splice(source.index, 1)

    const destinationCards = source.droppableId === destination.droppableId
      ? Array.from(sourceCards)
      : Array.from(destinationColumn.card_uuids)

    let destinationIndex = destination.index
    let totalIndex = destination.index
    if (destinationIndex > 0) {
      destinationIndex -= previousCardCount
    } else {
      destinationIndex = 0
      totalIndex = previousCardCount
    }

    destinationCards.splice(destinationIndex, 0, draggableId)
    cardOrder.splice(totalIndex, 0, draggableId)

    console.log(cardOrder)

    return {
      ...state,
      cardOrder: cardOrder,
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

  static updateColumnOrder(state, source, destination, draggableId) {
    const newColumnOrder = Array.from(state.columnOrder)

    newColumnOrder.splice(source.index, 1)
    newColumnOrder.splice(destination.index, 0, draggableId)

    return {
      ...state,
      columnOrder: newColumnOrder
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