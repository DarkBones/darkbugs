import React      from 'react'
import PropTypes  from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'

export default function Column(props) {
  const {
    column,
    index,
    userIsAssigned,
    uuid
  } = props

  return (
    <Draggable
      draggableId={uuid}
      index={index}
      isDragDisabled={!userIsAssigned}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="column rounded">
            <div
              className="column-title"
              {...provided.dragHandleProps}
            >
              {column.name}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

Column.propTypes = {
  column:         PropTypes.object.isRequired,
  index:          PropTypes.number.isRequired,
  userIsAssigned: PropTypes.bool.isRequired,
  uuid:           PropTypes.string.isRequired
}