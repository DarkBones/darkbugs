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

  handleClickOld = e => {
    if (!e.target.classList.contains('column-body')) {
      return
    }

    const aboveCard = this.getAboveCard(e)
    let newCardUuids = Array.from(this.state.cardUuids)

    if (typeof(aboveCard) === 'undefined') {
      newCardUuids.push('new')
      this.setState({
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

      return
    }

    const idx = newCardUuids.indexOf(aboveCard)
    newCardUuids.splice(idx)
  }

  handleClick = e => {
    if (!e.target.classList.contains('column-body')) {
      return
    }

    const aboveCard = this.props.getAboveCard(e)
    console.log(aboveCard)
  }

  getAboveCard = e => {
    const cardUuids = this.props.cardUuids
    const y = e.clientY - e.target.getBoundingClientRect().top
    let idx = Math.floor((y - 20) / 100)

    if (idx > cardUuids.length - 1) {
      idx = cardUuids.length - 1
    }

    return cardUuids[idx]
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
  getAboveCard:   PropTypes.func.isRequired
}
