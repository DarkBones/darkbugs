import React        from 'react'
import Column       from './Column'
import ColumnsState from './utils/ColumnsState'
import CreateButton from './CreateButton'
import PropTypes    from 'prop-types'
import {BoardApi, ColumnApi} from '../../../api/InternalApi'
import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      allCards: props.allCards,
      cards: props.cards,
      columnOrder: props.columnOrder,
      columns: props.columns,
      isDragging: false
    }
  }

  addCard = (columnUuid, uuid, name, previousCard) => {
    if (!this.props.userIsAssigned) return

    const { handleAfterUpdate, state } = this

    const newState = ColumnsState.addCard(state, columnUuid, uuid, name, previousCard)

    this.setState(newState, handleAfterUpdate)
  }

  addColumn = (uuid, name = '') => {
    if (!this.props.userIsAssigned) return

    const { handleAfterUpdate, state } = this

    const newState = ColumnsState.addColumn(state, uuid, name)

    this.setState(newState, handleAfterUpdate)
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  deleteNewCard = () => {
    const newState = ColumnsState.deleteCard(this.state, 'new')
    this.setState(newState)
  }

  deleteColumn = async uuid => {
    if (!this.props.userIsAssigned) return

    const { handleAfterUpdate, state } = this
    const newState = ColumnsState.deleteColumn(state, uuid)

    this.setState(newState)

    if (uuid !== 'new') {
      let response = await ColumnApi.deleteColumn(uuid)
        .catch(() => {
          setState(state)
        })

      if (!response) return
      if (response.status !== 200) return
    }

    handleAfterUpdate()
  }

  findPreviousCard = e => {
    // return the divider id
    if (e.target.classList.contains('item-card-divider')) {
      return e.target.parentElement.id
    }

    const { columnOrder, columns } = this.state

    const columnUuid = e.target.id
    const column = columns[columnUuid]
    const y = e.clientY - e.target.getBoundingClientRect().top + e.target.scrollTop

    // if click was below the top card, return the last card in the column
    if (y > 20) {
      const { card_uuids } = column
      if (card_uuids.length > 0) {
        return card_uuids[card_uuids.length - 1]
      }
    }

    // return last card in previous column(s)
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

  handleAfterUpdate = () => {
    const {
      allCards,
      cards,
      columnOrder,
      columns
    } = this.state

    this.props.setColumns(
      allCards,
      cards,
      columnOrder,
      columns
    )
  }

  handleClick = e => {
    if (e.target.id === 'new' && e.target.classList.contains('item-card')) return

    this.deleteNewCard()
  }

  onDragEnd = result => {
    const { updateCardOrder, updateColumnOrder } = this
    const {
      destination,
      draggableId,
      source,
      type
    } = result

    type === 'column'
      ? updateColumnOrder(
          source,
          destination,
          draggableId
        )
      : updateCardOrder(
          source,
          destination,
          draggableId
        )
  }

  onDragStart = () => {
    this.setState({
      isDragging: true
    })
  }

  saveNewColumn = data => {
    console.log(data)
  }

  updateCardOrder = async (source, destination, draggableId) => {
    console.log('update card order')

    const newState = ColumnsState.reorderCards(
      this.state,
      source,
      destination,
      draggableId
    )

    this.setState(newState)
  }

  updateColumnName = (columnUuid, name) => {
    const newState = ColumnsState.updateName(this.state, columnUuid, name)

    this.setState(newState)

    this.handleAfterUpdate()
  }

  updateColumnOrder = async (source, destination, draggableId) => {
    const { state, handleAfterUpdate } = this
    const { boardSlug } = this.props

    const newState = ColumnsState.reorderColumns(
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
        setState(state)
      })

    if (!response) return
    if (response.state !== 200) return

    handleAfterUpdate()
  }

  render() {
    const {
      addCard,
      addColumn,
      deleteColumn,
      deleteNewCard,
      findPreviousCard,
      onDragEnd,
      onDragStart,
      updateColumnName
    } = this
    const { userIsAssigned, boardSlug, allCards } = this.props
    const { columnOrder, columns, cards, isDragging } = this.state

    return (
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
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
                  allCards=         {allCards}
                  addColumn=        {addColumn}
                  boardSlug=        {boardSlug}
                  cards=            {cards}
                  column=           {columns[columnUuid]}
                  deleteColumn=     {deleteColumn}
                  deleteNewCard=    {deleteNewCard}
                  index=            {index}
                  isDragging=       {isDragging}
                  findPreviousCard= {findPreviousCard}
                  key=              {columnUuid}
                  updateColumnName= {updateColumnName}
                  userIsAssigned=   {userIsAssigned}
                  uuid=             {columnUuid}
                />
              )}
              {provided.placeholder}
              <CreateButton
                isEnabled={
                  userIsAssigned &&
                  !columnOrder.includes('new')
                }
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
  allCards:       PropTypes.array.isRequired,
  boardSlug:      PropTypes.string.isRequired,
  cards:          PropTypes.object.isRequired,
  columnOrder:    PropTypes.array.isRequired,
  columns:        PropTypes.object.isRequired,
  setColumns:     PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}