import React from 'react'
import ToolBar from "./ToolBar";
import PropTypes from 'prop-types'

export default class Body extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      name
    } = this.props.card

    const {
      newItem
    } = this.props

    return (
      <React.Fragment>
        <div>
          <h1>
            {name}
          </h1>
        </div>
        <ToolBar
          newItem={newItem}
        />
      </React.Fragment>
    )
  }
}

Body.propTypes = {
  card:     PropTypes.object.isRequired,
  newItem:  PropTypes.func.isRequired
}