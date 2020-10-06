import React      from 'react'
import Column     from './Column'
import PropTypes  from 'prop-types'
import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columnOrder: props.columnOrder,
      columns: props.columns
    }
  }

  onDragEnd = result => {
    console.log(result)
  }

  onDragStart = () => {
    console.log('on drag start')
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
  columnOrder:    PropTypes.array.isRequired,
  columns:        PropTypes.object.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}