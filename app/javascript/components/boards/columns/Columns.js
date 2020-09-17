import React        from 'react'
import Column       from './Column'
import ColumnsState from '../utils/ColumnsState'
import PropTypes    from 'prop-types'

import CreateButton from './CreateButton'

import {
  ColumnApi,
  BoardApi
} from '../../../api/InternalApi'

import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cardOrder:    props.cardOrder,
      cards:        props.cards,
      columnOrder:  props.columnOrder,
      columns:      props.columns,
      isDragging:   false
    }
  }

  addCard = (columnUuid, uuid, name, previousCard) => {
    const column = this.state.columns[columnUuid]
    const newCardUuids = Array.from(column.card_uuids)
    const idx = newCardUuids.indexOf(previousCard)

    if (!previousCard || idx < 0) {
      newCardUuids.unshift(uuid)
    } else {
      newCardUuids.splice(idx + 1, 0, uuid)
    }

    this.setState({
      ...this.state,
      cards: {
        ...this.state.cards,
        [uuid]: {
          name: name,
          uuid: uuid,
          above_card: previousCard
        }
      },
      columns: {
        ...this.state.columns,
        [columnUuid]: {
          ...this.state.columns[columnUuid],
          card_uuids: newCardUuids
        }
      }
    })
  }

  addColumn = (uuid, name) => {
    const oldState = this.state
    const newState = ColumnsState.addColumn(this.state, uuid, name)

    if (oldState === newState) return

    this.deleteColumn('new')
    this.setState(newState)

    this.afterUpdate()
  }

  afterUpdate = () => {
    const {
      cardOrder,
      cards,
      columnOrder,
      columns
    } = this.state

    const {
      setCards,
      setColumns
    } = this.props

    setCards(cardOrder, cards)
    setColumns(columnOrder, columns)
  }

  deleteCard = (cardUuid) => {
    console.log('delete card', cardUuid)
    const newState = ColumnsState.deleteCard(this.state, cardUuid)
    console.log(newState)

    this.setState(newState)
  }

  deleteColumn = columnUuid => {
    const newState = ColumnsState.deleteColumn(this.state, columnUuid)

    this.setState(newState)

    if (columnUuid === 'new'){
      this.afterUpdate()
      return
    }

    ColumnApi.deleteColumn(columnUuid)
  }

  getPreviousCard = clickEvent => {
    const columnUuid = clickEvent.target.id

    const {
      getPreviousCardInColumn,
      getPreviousCardOutsideColumn
    } = this

    let previousCard = getPreviousCardInColumn(clickEvent, columnUuid)

    if (!previousCard) {
      previousCard = getPreviousCardOutsideColumn(columnUuid)
    }

    return previousCard
  }

  getPreviousCardInColumn = (clickEvent, columnUuid) => {
    const column = this.state.columns[columnUuid]
    const cardUuids = column.card_uuids

    const y = clickEvent.clientY - clickEvent.target.getBoundingClientRect().top
    let idx = Math.floor((y - 20) / 100)
    if (idx > cardUuids.length - 1) {
      idx = cardUuids.length - 1
    }

    return cardUuids[idx]
  }

  getPreviousCardOutsideColumn = columnUuid => {
    const { columnOrder, columns } = this.state
    let columnIndex = columnOrder.indexOf(columnUuid)
    let columnCards = []

    while(columnIndex > 0) {
      columnIndex--

      columnCards = columns[columnOrder[columnIndex]].card_uuids
      if (columnCards.length > 0) {
        return columnCards[columnCards.length - 1]
      }
    }
  }

  onDragStart = () => {
    this.setState({
      isDragging: true
    })
  }

  onDragEnd = result => {
    const {
      destination,
      source,
      draggableId,
      type
    } = result

    // return if no changes
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    type === 'column'
      ? this.updateColumnOrder(
        source,
        destination,
        draggableId
      )
      : this.updateCardOrder(
        source,
        destination,
        draggableId
      )

    this.setState({
      isDragging: false
    })
  }

  previousCardCount = columnUuid => {
    return ColumnsState.previousCardCount(this.state, columnUuid)
  }

  updateCardOrder = (source, destination, draggableId) => {
    const newState = ColumnsState
      .updateCardOrder(
        this.state,
        source,
        destination,
        draggableId
      )

    const previousCard = newState.cardOrder[newState.cardOrder.indexOf(draggableId) - 1]

    this.setState(newState)

    const params = {
      card_uuid: draggableId,
      previous_card: previousCard,
      column_uuid: destination.droppableId
    }

    BoardApi
      .reorderCards(
        this.props.boardSlug,
        params
      )

    this.afterUpdate()
  }

  updateColumnName = (columnUuid, name) => {
    const newState = ColumnsState.updateName(this.state, columnUuid, name)

    this.setState(newState)

    this.afterUpdate()
  }

  updateColumnOrder = async (source, destination, draggableId) => {
    const { state } = this
    const { boardSlug } = this.props

    const newState = ColumnsState.updateColumnOrder(
      state,
      source,
      destination,
      draggableId
    )

    this.setState(newState)

    let response = await BoardApi
      .reorderColumns(
        boardSlug,
        {
          columns: newState.columnOrder
        }
      ).catch(() => {
        this.setState(state)
      })

    if(response) {
      if(response.status === 200) {
        this.afterUpdate()
      }
    }
  }

  render() {
    const {
      boardSlug,
      userIsAssigned
    } = this.props

    const {
      cards,
      columns,
      columnOrder,
      isDragging
    } = this.state

    const {
      addCard,
      addColumn,
      deleteCard,
      deleteColumn,
      getPreviousCard,
      updateColumnName
    } = this

    const createButtonEnabled = userIsAssigned && this.state.columnOrder.indexOf('new') < 0

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable
          droppableId="droppable-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              id="columns"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrder.map((columnUuid, index) =>
                <Column
                  addCard=          {addCard}
                  addColumn=        {addColumn}
                  boardSlug=        {boardSlug}
                  cards=            {cards}
                  column=           {columns[columnUuid]}
                  deleteCard=       {deleteCard}
                  deleteColumn=     {deleteColumn}
                  getPreviousCard=  {getPreviousCard}
                  index=            {index}
                  isDragging=       {isDragging}
                  key=              {columnUuid}
                  previousCardCount={this.previousCardCount}
                  updateColumnName= {updateColumnName}
                  userIsAssigned=   {userIsAssigned}
                  uuid=             {columnUuid}
                />
              )}
              {provided.placeholder}
              <CreateButton
                isEnabled={createButtonEnabled}
                onClick={addColumn}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

Columns.propTypes = {
  boardSlug:      PropTypes.string.isRequired,
  cardOrder:      PropTypes.array.isRequired,
  cards:          PropTypes.object.isRequired,
  columnOrder:    PropTypes.array.isRequired,
  columns:        PropTypes.object.isRequired,
  setCards:       PropTypes.func.isRequired,
  setColumns:     PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}