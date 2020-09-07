import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'

import {
  Droppable
} from 'react-beautiful-dnd'

export default class Cards extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cards: props.cards,
      cardUuids: props.cardUuids
    }
  }

  handleClick = e => {
    console.log(this.props.isDragging)
    if (!e.target.classList.contains('column-body') || this.props.isDragging) {
      return
    }

    const aboveCard = this.props.getAboveCard(e)
    let newCardUuids = Array.from(this.state.cardUuids)
    const idx = newCardUuids.indexOf(aboveCard)

    if (
      typeof(aboveCard) === 'undefined'
      || idx === -1
    ) {
      newCardUuids.unshift('new')
    } else {
      newCardUuids.splice(idx + 1, 0, 'new')
    }

    const newState = ({
      ...this.state,
      cards: {
        ...this.state.cards,
        new: {
          name: '',
          uuid: 'new',
          index: 0
        }
      },
      cardUuids: newCardUuids
    })

    this.setState(newState)

    this.props.updateCards(e.target.id, newCardUuids, newState.cards)
  }

  cancelNewCard = () => {
    const cardUuids = this.state.cardUuids
    let newCards = this.state.cards

    let newCardUuids = Array.from(cardUuids)
    const idx = newCardUuids.indexOf('new')

    if (idx === -1) {
      return
    }

    newCardUuids.splice(idx, 1)

    delete newCards['new']

    const newState = {
      ...this.state,
      cards: newCards,
      cardUuids: newCardUuids
    }

    this.setState(newState)

    this.props.updateCards(this.props.columnUuid, newCardUuids, newState.cards)
  }

  render() {
    const {columnUuid, userIsAssigned } = this.props

    return (
      <Droppable
        droppableId={columnUuid}
        type='card'
      >
        {(provided) => (
          <div
            className='column-body'
            id={columnUuid}
            onClick={this.handleClick}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {this.state.cardUuids.map((cardUuid) =>
              <Card
                key={cardUuid}
                card={this.state.cards[cardUuid]}
                userIsAssigned={userIsAssigned}
                cancelNewCard={this.cancelNewCard}
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
  userIsAssigned: PropTypes.bool.isRequired,
  getAboveCard:   PropTypes.func.isRequired,
  updateCards:    PropTypes.func.isRequired,
  isDragging:     PropTypes.bool.isRequired
}
