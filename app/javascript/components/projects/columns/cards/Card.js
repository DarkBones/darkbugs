import React from 'react'
import PropTypes from 'prop-types'

import {
  Draggable
} from 'react-beautiful-dnd'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { card, userIsAssigned } = this.props

    return (
      // <div className='card'>
      //   {card.name}
      // </div>
      <Draggable
        draggableId={card.uuid}
        index={card.position}
        isDragDisabled={!userIsAssigned}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className='card'>
              {card.name}
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

Card.propTypes = {
  card:           PropTypes.object.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}
