import React      from 'react'
import PropTypes  from 'prop-types'
import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columnOrder: props.columnOrder
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
      columnOrder
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
                <p>
                  {columnUuid}
                  {index}
                  {" >> "}
                </p>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

Columns.propTypes = {
  columnOrder: PropTypes.array.isRequired
}