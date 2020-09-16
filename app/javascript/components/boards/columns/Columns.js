import React from 'react'
import Column from './Column'
import ColumnsState from '../utils/columnsState'
import PropTypes from 'prop-types'

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

  deleteColumn = async columnUuid => {
    console.log(this.state)
    const oldState = this.state
    const newState = ColumnsState.deleteColumn(this.state, columnUuid)

    this.setState(newState)

    if (columnUuid === 'new'){
      this.afterUpdate()
      return
    }

    await ColumnApi.deleteColumn(columnUuid)
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
    console.log(result)

    this.setState({
      isDragging: false
    })
  }

  previousCardCount = columnUuid => {
    const { columnOrder, columns } = this.state
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

  updateColumnName = (columnUuid, name) => {
    const newState = ColumnsState.updateName(this.state, columnUuid, name)

    this.setState(newState)

    this.afterUpdate()
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
      addColumn,
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
                  addColumn=        {addColumn}
                  boardSlug=        {boardSlug}
                  cards=            {cards}
                  column=           {columns[columnUuid]}
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