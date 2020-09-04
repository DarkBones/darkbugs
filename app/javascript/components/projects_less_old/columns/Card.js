import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

export default function Card(props) {
  return (
    <Draggable draggableId={props.card.uuid} index={props.card.position}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className='item-card p-2 rounded'
            id={props.card.uuid}
          >
            <div
              className='font-weight-bold'
            >
              {props.card.name}
            </div>
          </div>
          <div
            className='item-card-divider'
            id={props.card.uuid}
          >
          </div>
        </div>
      )}
    </Draggable>
  )
}
