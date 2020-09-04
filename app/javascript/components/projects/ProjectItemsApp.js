import React from 'react'
import PropTypes from 'prop-types'
import Columns from './columns/Columns'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns
    }

    console.log(props)
  }

  setColumns = (columns) => {
    const newState = {
      ...this.state,
      columns: columns
    }

    this.setState(newState)
  }

  render () {
    return (
      <div id='project-items-app'>
        <Columns
          columns={this.state.columns.columns}
          columnOrder={this.state.columns.order}
          setColumns={this.setColumns}
        />
      </div>
    )
  }
}

ProjectItemsApp.propTypes = {
  name: PropTypes.string.isRequired,
  board_slug: PropTypes.string.isRequired,
  cards: PropTypes.object.isRequired,
  columns: PropTypes.object.isRequired,
  user_is_admin: PropTypes.bool.isRequired
}
