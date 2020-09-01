import React from 'react'
import { Draggable  } from 'react-beautiful-dnd'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const column = this.props.column
    return (
      <Draggable
        draggableId={column.uuid}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              className='column rounded'
            >
              <h1 {...provided.dragHandleProps}>
                {this.props.column.name}
              </h1>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}
