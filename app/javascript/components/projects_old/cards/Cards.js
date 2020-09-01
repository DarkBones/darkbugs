import React from 'react'
import Card from './Card'

export default class Cards extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {this.props.cards.map((card) =>
          <Card
            name={card.name}
            key={card.uuid}
            id={`card_${card.uuid}`}
            uuid={card.uuid}
            position={card.position}
            index={0}
          />
        )}
      </div>
    )
  }
}
