import React from 'react'
import {Draggable} from 'react-beautiful-dnd'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Draggable draggableId={this.props.id} index={this.props.index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className='item-card mb-3 p-2 rounded'
            id={this.props.id}
          >
            <div
              className='font-weight-bold'
            >
              {this.props.name}
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  renderOld() {
    return(
      <div
        className='item-card mb-3 p-2 rounded'
        id={this.props.id}
      >
        <div
          className='font-weight-bold'
        >
          {this.props.name}
        </div>
      </div>
    )
  }
}
