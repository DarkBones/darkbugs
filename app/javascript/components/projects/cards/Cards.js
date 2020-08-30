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
          />
        )}
      </div>
    )
  }
}
