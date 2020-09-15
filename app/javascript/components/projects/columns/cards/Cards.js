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
    if (!e.target.classList.contains('column-body') || this.props.isDragging) {
      return
    }

    const aboveCard = this.props.getAboveCard(e)
    this.addCard('new', '', aboveCard)
  }

  deleteCard = (uuid) => {
    const cardUuids = this.state.cardUuids
    let newCards = this.state.cards

    let newCardUuids = Array.from(cardUuids)
    const idx = newCardUuids.indexOf(uuid)

    if (idx === -1) {
      return
    }

    newCardUuids.splice(idx, 1)

    delete newCards[uuid]

    const newState = {
      ...this.state,
      cards: newCards,
      cardUuids: newCardUuids
    }

    console.log(newState)

    this.setState(newState)
    this.props.updateCards(this.props.columnUuid, newCardUuids, newState.cards)
    console.log(newState)
  }

  saveCard = (uuid, name, aboveCard) => {
    this.deleteCard('new')
    this.addCard(uuid, name, aboveCard)
  }

  addCard = (uuid, name, aboveCard) => {
    let newCardUuids = Array.from(this.props.cardUuids)
    const idx = newCardUuids.indexOf(aboveCard)

    if (
      typeof (aboveCard) === 'undefined'
      || idx === -1
    ) {
      newCardUuids.unshift(uuid)
    } else {
      newCardUuids.splice(idx + 1, 0, uuid)
    }

    const newState = ({
      ...this.state,
      cards: {
        ...this.state.cards,
        [uuid]: {
          name: name,
          uuid: uuid,
          above_card: aboveCard,
          index: 0
        }
      },
      cardUuids: newCardUuids
    })

    console.log(newState)

    this.setState(newState)

    this.props.updateCards(this.props.columnUuid, newCardUuids, newState.cards)
  }

  render() {
    const {columnUuid, userIsAssigned, previousCardCount } = this.props
    const cardCount = previousCardCount(columnUuid)

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
            {this.props.cardUuids.map((cardUuid, index) =>
              <Card
                key={cardUuid}
                card={this.state.cards[cardUuid]}
                aboveCard={this.state.cardUuids[index + cardCount - 1]}
                columnUuid={columnUuid}
                userIsAssigned={userIsAssigned}
                deleteCard={this.deleteCard}
                saveCard={this.saveCard}
                index={index + cardCount}
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
  cards:              PropTypes.object.isRequired,
  cardUuids:          PropTypes.array.isRequired,
  columnUuid:         PropTypes.string.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired,
  getAboveCard:       PropTypes.func.isRequired,
  updateCards:        PropTypes.func.isRequired,
  isDragging:         PropTypes.bool.isRequired,
  previousCardCount:  PropTypes.func.isRequired
}
