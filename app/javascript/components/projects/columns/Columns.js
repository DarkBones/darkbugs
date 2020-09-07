import React              from 'react'
import PropTypes          from 'prop-types'
import Column             from './Column'
import i18n               from '../../../i18n'
import ColumnCreateButton from './ColumnCreateButton'

import {
  ColumnApi,
  BoardApi
} from '../../../api/InternalApi'
import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd'
import {
  updateCardOrderState,
  updateColumnOrderState,
  updateColumnNameState,
  addColumnState,
  cancelNewColumnState,
  deleteColumnState
} from '../utils/columns'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      columnOrder: props.columnOrder,
      cards: props.cards,
      isDragging: false
    }
  }

  onDragStart = () => {
    this.setState({
      isDragging: true
    })
  }

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'column') {
      this.updateColumnOrder(source, destination, draggableId)
    } else {
      this.updateCardOrder(source, destination, draggableId)
    }

    this.setState({
      isDragging: false
    })
  }

  updateCardOrder = async (source, destination, draggableId) => {
    const newState = updateCardOrderState(this.state, source, destination, draggableId)

    this.setState(newState)

    const params = {
      card_uuid: draggableId,
      card_index: destination.index,
      column: destination.droppableId
    }

    let response = await BoardApi
      .reorderCards(
        this.props.boardSlug,
        params
      )

    if (typeof(response) !== 'undefined') {
      if (response.status === 200) {
        this.setState({
          ...this.state,
          cards: response.data
        })
      }
    }

    this.handleColumnsUpdate()
    this.handleCardsUpdate()
  }

  updateColumnOrder = async (source, destination, draggableId) => {
    const oldColumnOrder = this.state.columnOrder

    const newState = updateColumnOrderState(
      this.state,
      source,
      destination,
      draggableId
    )

    this.setState(newState)

    let response = await BoardApi
      .reorderColumns(
        this.props.boardSlug,
        {
          columns: newState.columnOrder
        }
      ).catch(() => {
        this.setState({
          ...this.state,
          columnOrder: oldColumnOrder
        })
      })

    if (typeof(response) !== 'undefined') {
      if (response.status === 200) {
        this.handleColumnsUpdate()
      }
    }
  }

  updateColumnName = data => {
    const newState = updateColumnNameState(this.state, data.uuid, data.name)

    this.setState(newState)

    this.handleColumnsUpdate()
  }

  addColumn = (uuid = 'new', name= '') => {
    this.cancelNewColumn()

    const newState = addColumnState(this.state, uuid, name)

    this.setState(newState)
    this.handleColumnsUpdate()
  }

  cancelNewColumn = () => {
    const newState = cancelNewColumnState(this.state)

    this.setState(newState)
    this.handleColumnsUpdate()
  }

  saveNewColumn = (columnUuid, columnName) => {
    this.addColumn(columnUuid, columnName)
  }

  deleteColumn = async (columnUuid) => {
    let r = confirm(i18n.t('components.projects.columns.Column.delete_warning'))

    if (!r) {
      return
    }

    const newState = deleteColumnState(this.state, columnUuid)

    let response = await ColumnApi
      .deleteColumn(columnUuid)

    if (typeof (response) !== 'undefined') {
      this.setState(newState)
      this.handleColumnsUpdate()
    }
  }

  handleColumnsUpdate = () => {
    this.props.setColumns({
      columns: this.state.columns,
      order: this.state.columnOrder
    })
  }

  handleCardsUpdate = () => {
    this.props.setCards(this.state.cards)
  }

  updateCards = (columnUuid, cardUuids, cards) => {
    this.setState({
      ...this.state,
      cards: cards,
      columns: {
        ...this.state.columns,
        [columnUuid]: {
          ...this.state.columns[columnUuid],
          card_uuids: cardUuids
        }
      }
    })

    this.handleColumnsUpdate()
    this.handleCardsUpdate()
  }

  getAboveCard = clickEvent => {
    const { columns, columnOrder } = this.state
    const columnId = clickEvent.target.id
    const cardUuids = columns[columnId].card_uuids

    const y = clickEvent.clientY - clickEvent.target.getBoundingClientRect().top
    let idx = Math.floor((y - 20) / 100)
    if (idx > cardUuids.length - 1) {
      idx = cardUuids.length - 1
    }

    if (typeof (cardUuids[idx]) !== 'undefined') {
      return cardUuids[idx]
    }

    let columnIndex = columnOrder.indexOf(columnId)
    let columnCards = []
    while (columnIndex > 0) {
      columnIndex--

      columnCards = columns[columnOrder[columnIndex]].card_uuids
      if (columnCards.length > 0) {
        return columnCards[columnCards.length - 1]
      }
    }
  }

  render() {
    const { columns, columnOrder } = this.state

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable
          droppableId='dropable_columns'
          direction='horizontal'
          type='column'
        >
          {(provided) => (
            <div
              id='columns'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrder.map((columnUuid, index) =>
                <Column
                  key={columnUuid}
                  uuid={columnUuid}
                  column={columns[columnUuid]}
                  index={index}
                  updateColumnName={this.updateColumnName}
                  deleteColumn={this.deleteColumn}
                  cancelNewColumn={this.cancelNewColumn}
                  userIsAssigned={this.props.userIsAssigned}
                  boardSlug={this.props.boardSlug}
                  saveNewColumn={this.saveNewColumn}
                  cards={this.props.cards}
                  getAboveCard={this.getAboveCard}
                  updateCards={this.updateCards}
                  isDragging={this.state.isDragging}
                />
              )}
              {provided.placeholder}
              <ColumnCreateButton
                userIsAssigned={this.props.userIsAssigned}
                onClick={this.addColumn}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

Columns.propTypes = {
  cards:          PropTypes.object.isRequired,
  columns:        PropTypes.object.isRequired,
  columnOrder:    PropTypes.array.isRequired,
  setColumns:     PropTypes.func.isRequired,
  setCards:       PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired,
  boardSlug:      PropTypes.string.isRequired
}
