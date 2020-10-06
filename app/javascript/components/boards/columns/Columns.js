import React        from 'react'
import Column       from './Column'
import ColumnsState from './utils/ColumnsState'
import PropTypes    from 'prop-types'
import { BoardApi } from '../../../api/InternalApi'
import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columnOrder: props.columnOrder,
      columns: props.columns,
      isDragging: false
    }
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
    const {
      updateCardOrder,
      updateColumnOrder
    } = this

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

  updateCardOrder = async (source, destination, draggableId) => {
    console.log('update card order')
  }

  updateColumnOrder = async (source, destination, draggableId) => {
    const {
      state,
      handleAfterUpdate
    } = this
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
        this.setState(state)
      })

    if (!response) return
    if (response.state !== 200) return

    handleAfterUpdate()
  }

  render() {
    const {
      onDragEnd,
      onDragStart
    } = this

    const {
      userIsAssigned
    } = this.props

    const {
      columnOrder,
      columns
    } = this.state

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
                  column=         {columns[columnUuid]}
                  index=          {index}
                  key=            {columnUuid}
                  userIsAssigned= {userIsAssigned}
                  uuid=           {columnUuid}
                />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

Columns.propTypes = {
  boardSlug:      PropTypes.string.isRequired,
  columnOrder:    PropTypes.array.isRequired,
  columns:        PropTypes.object.isRequired,
  setColumns:     PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}