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
      cards: props.cards,
      columnOrder: props.columnOrder,
      columns: props.columns,
      isDragging: false
    }
  }

  addColumn = (uuid, name = '') => {
    const { handleAfterUpdate, state } = this

    const newState = ColumnsState.addColumn(state, uuid, name)

    this.setState(newState)

    handleAfterUpdate()
  }

  deleteColumn = async uuid => {
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

  handleAfterUpdate = () => {
    const {
      cardOrder,
      cards,
      columnOrder,
      columns
    } = this.state

    this.props.setColumns(
      cardOrder,
      cards,
      columnOrder,
      columns
    )
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
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

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
      addColumn,
      deleteColumn,
      onDragEnd,
      onDragStart,
      updateColumnName
    } = this
    const { userIsAssigned, boardSlug } = this.props
    const { columnOrder, columns, cards } = this.state

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
                  addColumn=        {addColumn}
                  boardSlug=        {boardSlug}
                  cards=            {cards}
                  column=           {columns[columnUuid]}
                  deleteColumn=     {deleteColumn}
                  index=            {index}
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
  boardSlug:      PropTypes.string.isRequired,
  cards:          PropTypes.object.isRequired,
  columnOrder:    PropTypes.array.isRequired,
  columns:        PropTypes.object.isRequired,
  setColumns:     PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}