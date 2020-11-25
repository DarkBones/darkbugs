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

    this.setState(newState, function() {
      if (uuid !== 'new') delete this.state.columns['new']
      handleAfterUpdate()
    })
  }

  cancelDrag = () => {
    this.setState({
      isDragging: false
    })
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  componentDidUpdate = prevProps => {
    const {
      allCards,
      cards,
      columns
    } = this.props

    if (prevProps.allCards.length !== this.props.allCards.length) {
      this.setState({
        allCards: allCards,
        cards: cards,
        columns: columns
      })
    }
  }

  deleteNewCard = () => {
    this.props.deleteCard('new')
  }

  deleteColumn = async uuid => {
    if (!this.props.userIsAssigned) return

    const { handleAfterUpdate, state } = this
    const newState = ColumnsState.deleteColumn(state, uuid)

    this.setState(newState, function() {
      delete this.state.columns[uuid]
      handleAfterUpdate()
    })

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
    const classList = e.target.classList

    // return the divider id
    if (classList.contains('item-card-divider')) {
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
    const classList = e.target.classList

    if (this.state.allCards.indexOf('new') < 0) return

    if (e.target.tagName.toLowerCase() === 'input') return
    if (e.target.id === 'new' && classList.contains('item-card')) return
    if (e.target.id === 'new' && classList.contains('item-card')) return

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

    // return if no changes
    if (!destination) {
      this.cancelDrag()
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      this.cancelDrag()
      return
    }

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

  updateCardOrder = async (source, destination, draggableId) => {
    const newState = ColumnsState.reorderCards(
      this.state,
      source,
      destination,
      draggableId
    )

    this.setState(newState)

    const previousCard = newState.allCards[
        newState.allCards.indexOf(draggableId) - 1
      ]

    const params = {
      card_uuid: draggableId,
      previous_card: previousCard,
      column_uuid: destination.droppableId
    }

    let response = await BoardApi
      .reorderCards(
        this.props.boardSlug,
        params
      )

    if (!response) return
    if (response.status !== 200) return

    this.handleAfterUpdate()
  }

  updateColumnName = (columnUuid, name) => {
    const newState = ColumnsState.updateName(this.state, columnUuid, name)

    this.setState(newState, this.handleAfterUpdate())
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
    const { userIsAssigned, boardSlug, columns, columnOrder, allCards, cards, showCardModal } = this.props
    const { isDragging } = this.state

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
                  showCardModal=    {showCardModal}
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
  deleteCard:     PropTypes.func.isRequired,
  setColumns:     PropTypes.func.isRequired,
  showCardModal:  PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}