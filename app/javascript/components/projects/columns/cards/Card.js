import React from 'react'
import PropTypes from 'prop-types'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { card } = this.props

    return (
      <div className='card'>
        {card.name}
      </div>
    )
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired
}
