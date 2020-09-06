import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'

import {
  Droppable
} from 'react-beautiful-dnd'

export default class Cards extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {cards, cardUuids, columnUuid, userIsAssigned } = this.props

    return (
      <Droppable
        droppableId={columnUuid}
        type='card'
      >
        {(provided) => (
          <div
            className='column-body'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cardUuids.map((cardUuid) =>
              <Card
                key={cardUuid}
                card={cards[cardUuid]}
                userIsAssigned={userIsAssigned}
              />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    )
  }
}

Cards.propTypes = {
  cards:          PropTypes.object.isRequired,
  cardUuids:      PropTypes.array.isRequired,
  columnUuid:     PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}
