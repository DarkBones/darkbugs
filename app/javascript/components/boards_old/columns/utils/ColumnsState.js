export default class ColumnsState {
  static addCard(state, columnUuid, uuid, name, previousCard) {
    let newState = this.deleteCard(state, 'new')

    const newCard = {
      uuid: uuid,
      name: name
    }

    const column = newState.columns[columnUuid]
    let allCards = Array.from(newState.allCards)
    let cardUuids = Array.from(column.card_uuids)

    const idxAll = allCards.indexOf(previousCard)
    const idxCol = cardUuids.indexOf(previousCard)

    const insertCard = (arr, previousCard, idx, uuid) => {
      !previousCard || idx < 0
        ? arr.unshift(uuid)
        : arr.splice(idx + 1, 0, uuid)

      return arr
    }

    allCards = insertCard(allCards, previousCard, idxAll, uuid)
    cardUuids = insertCard(cardUuids, previousCard, idxCol, uuid)

    return {
      ...newState,
      allCards: allCards,
      cards: {
        ...newState.cards,
        [uuid]: newCard
      },
      columns: {
        ...newState.columns,
        [columnUuid]: {
          ...newState.columns[columnUuid],
          card_uuids: cardUuids
        }
      }
    }
  }

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

  static reorderCards(state, source, destination, draggableId) {
    let newState = { ...state }

    const { allCards, columns } = newState
    const sourceCol = columns[source.droppableId]
    const destCol = columns[destination.droppableId]
    const previousCardCount = this._previousCardCount(state, destCol.uuid)

    const relativeSourceIdx = sourceCol.card_uuids.indexOf(draggableId)
    const relativeDestIdx = destination.index - previousCardCount

    sourceCol.card_uuids.splice(relativeSourceIdx, 1)
    destCol.card_uuids.splice(relativeDestIdx, 0, draggableId)

    let destIdx = destination.index
    if (destIdx === 0) destIdx = previousCardCount
    if (destIdx > source.index && destination.droppableId !== source.droppableId) destIdx -= 1

    allCards.splice(source.index, 1)
    allCards.splice(destIdx, 0, draggableId)

    return {
      ...newState,
      allCards: allCards,
      columns: columns,
      isDragging: false
    }
  }

  static reorderColumns(state, source, destination, draggableId) {
    const newColumnOrder = Array.from(state.columnOrder)
    const { columns } = state

    newColumnOrder.splice(source.index, 1)
    newColumnOrder.splice(destination.index, 0, draggableId)

    let allCards = []
    newColumnOrder.forEach((columnUuid) => {
      allCards = allCards.concat(columns[columnUuid].card_uuids)
    })

    return {
      ...state,
      allCards: allCards,
      columnOrder: newColumnOrder,
      isDragging: false
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

  static deleteCard(state, cardUuid) {
    const {
      allCards,
      cards,
      columnOrder,
      columns
    } = state

    let newState = state

    const newAllCards = Array.from(allCards)
    const allCardsIndex = newAllCards.indexOf(cardUuid)

    if (allCardsIndex >= 0) newAllCards.splice(allCardsIndex, 1)

    newState = {
      ...newState,
      allCards: newAllCards,
      cards: cards
    }

    let column
    let newCardUuids
    let idx
    columnOrder.forEach((columnUuid) => {
      column = columns[columnUuid]
      newCardUuids = Array.from(column.card_uuids)
      idx = newCardUuids.indexOf(cardUuid)

      if (idx >= 0) {
        newCardUuids.splice(idx, 1)

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

    return newState
  }

  static _deleteColumn(state, columnUuid) {
    const columnOrder = Array.from(state.columnOrder)
    const index = columnOrder.indexOf(columnUuid)
    const columns = state.columns
    const allCards = Array.from(state.allCards)

    if (index < 0) return state

    const columnCards = columns[columnUuid].card_uuids

    columnOrder.splice(index, 1)

    columnCards.forEach((cardUuid) => {
      allCards.splice(allCards.indexOf(cardUuid), 1)
    })

    return {
      ...state,
      allCards: allCards,
      columnOrder: columnOrder,
      columns: columns
    }
  }

  static _previousCardCount(state, columnUuid) {
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
}