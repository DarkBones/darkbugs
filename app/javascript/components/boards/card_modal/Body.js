import React from 'react'
import PropTypes from 'prop-types'

export default class Body extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { card } = this.props

    return (
      <div>
        <h1>
          {card.name}
        </h1>
      </div>
    )
  }
}

Body.propTypes = {
  card: PropTypes.object.isRequired
}