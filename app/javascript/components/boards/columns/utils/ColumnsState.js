export default class ColumnsState {
  static addCard(state, columnUuid, uuid, name, previousCard) {
    let newState = this._deleteCard(state, 'new')

    const newCard = {
      uuid: uuid,
      name: name
    }

    const column = newState.columns[columnUuid]
    let allCards = Array.from(state.allCards)
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

  static addCardOLD(state, columnUuid, uuid, name, previousCard) {
    let newState = this._deleteCard(state, uuid)

    const column = newState.columns[columnUuid]
    const newAllCards = Array.from(state.allCards)
    const newCardUuids = Array.from(column.card_uuids)

    const idxCol = newCardUuids.indexOf(previousCard)
    const idxAll = newAllCards.indexOf(previousCard)

    if (!previousCard || idxCol < 0) {
      newCardUuids.unshift(uuid)
    } else {
      newCardUuids.splice(idxCol + 1, 0, uuid)
    }

    if (!previousCard || idxAll < 0) {
      newAllCards.unshift(uuid)
    } else {
      newAllCards.splice(idxAll + 1, 0, uuid)
    }

    console.log(newCardUuids)
    console.log(newAllCards)
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

  static deleteCard(state, cardUuid) {
    return this._deleteCard(state, cardUuid)
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
    if (destIdx === 0) {
      destIdx = previousCardCount
    } else if (destIdx > source.index) destIdx -= 1

    allCards.splice(source.index, 1)
    allCards.splice(destIdx, 0, draggableId)

    return {
      ...newState,
      allCards: allCards,
      columns: columns
    }
  }

  static reorderColumns(state, source, destination, draggableId) {
    const newColumnOrder = Array.from(state.columnOrder)

    newColumnOrder.splice(source.index, 1)
    newColumnOrder.splice(destination.index, 0, draggableId)

    return {
      ...state,
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

  static _deleteCard(state, cardUuid) {
    const {
      allCards,
      cards,
      columnOrder,
      columns
    } = state

    delete cards[cardUuid]

    let newState = state

    const newAllCards = Array.from(allCards)
    const allCardsIndex = newAllCards.indexOf(cardUuid)

    if (allCardsIndex >= 0) newAllCards.splice(allCardsIndex, 1)

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
          allCards: newAllCards,
          cards: cards,
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