import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'

export default function Cards(props) {
  const { cardUuids, cards } = props

  return (
    <React.Fragment>
      {cardUuids.map((cardUuid) =>
        <Card
          key={cardUuid}
          card={cards[cardUuid]}
        />
      )}
    </React.Fragment>
  )
}

Cards.propTypes = {
  cards: PropTypes.object.isRequired,
  cardUuids: PropTypes.array.isRequired
}
