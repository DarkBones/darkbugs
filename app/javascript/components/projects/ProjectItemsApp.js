import React      from 'react'
import PropTypes  from 'prop-types'
import Columns    from './columns/Columns'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      cards: props.cards
    }

    console.log(props)
  }

  setColumns = columns => {
    const newState = {
      ...this.state,
      columns: columns
    }

    this.setState(newState)
  }

  setCards = cards => {
    const newState = {
      ...this.state,
      cards: cards
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
          setCards={this.setCards}
          userIsAssigned={this.props.user_is_assigned}
          boardSlug={this.props.board_slug}
          cards={this.state.cards}
          cardOrder={this.props.card_order}
        />
      </div>
    )
  }
}

ProjectItemsApp.propTypes = {
  name:             PropTypes.string.isRequired,
  board_slug:       PropTypes.string.isRequired,
  cards:            PropTypes.object.isRequired,
  columns:          PropTypes.object.isRequired,
  user_is_assigned: PropTypes.bool.isRequired
}
