import React from 'react'
import ToolBar from "./ToolBar";
import PropTypes from 'prop-types'

export default class Body extends React.Component {
  constructor(props) {
    super(props)
  }

  newNote = () => {
    console.log('new note')
  }

  render() {
    const { card } = this.props

    return (
      <React.Fragment>
        <div>
          <h1>
            {card.name}
          </h1>
        </div>
        <ToolBar
          newNote={this.newNote}
        />
      </React.Fragment>
    )
  }
}

Body.propTypes = {
  card: PropTypes.object.isRequired
}