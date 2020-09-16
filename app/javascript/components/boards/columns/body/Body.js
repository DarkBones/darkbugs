import React from 'react'
import PropTypes from 'prop-types'
import Card from './card/Card'

import {
  Droppable
} from 'react-beautiful-dnd'

export default class Body extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick = e => {
    const {
      isDragging,
      getPreviousCard
    } = this.props

    if (!e.target.classList.contains('column-body') || isDragging) {
      return
    }

    const previousCard = getPreviousCard(e)
    console.log('previous card:', previousCard)
  }

  render() {
    const {
      cards,
      cardUuids,
      columnUuid,
      previousCardCount,
      userIsAssigned
    } = this.props

    const cardCount = previousCardCount(columnUuid)

    return (
      <Droppable
        droppableId={columnUuid}
        type="card"
      >
        {(provided) => (
          <div
            className="column-body"
            id={columnUuid}
            onClick={this.handleClick}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cardUuids.map((cardUuid, index) =>
              <Card
                card={cards[cardUuid]}
                index={index + cardCount}
                key={cardUuid}
                previousCard={cardUuids[index-1]}
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

Body.propTypes = {
  cards:              PropTypes.object.isRequired,
  cardUuids:          PropTypes.array.isRequired,
  columnUuid:         PropTypes.string.isRequired,
  getPreviousCard:    PropTypes.func.isRequired,
  isDragging:         PropTypes.bool.isRequired,
  previousCardCount:  PropTypes.func.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired
}