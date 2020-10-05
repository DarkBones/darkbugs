import React      from 'react'
import PropTypes  from 'prop-types'
import Title      from './Title'

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)

    this.state = {
      boardName: props.name
    }
  }

  setBoardName = name => {
    this.setState({
      boardName: name
    })
  }

  render() {
    const {
      setBoardName
    } = this

    const {
      board_slug,
      user_is_assigned
    } = this.props

    const {
      boardName
    } = this.state

    return (
      <div
        id="project-items-app"
      >
        <Title
          boardSlug=          {board_slug}
          handleAfterUpdate=  {setBoardName}
          name=               {boardName}
          userIsAssigned=     {user_is_assigned}
        />
      </div>
    )
  }
}

BoardsApp.propTypes = {
  board_slug:       PropTypes.string.isRequired,
  cards:            PropTypes.object.isRequired,
  card_order:       PropTypes.array.isRequired,
  columns:          PropTypes.object.isRequired,
  column_order:     PropTypes.array.isRequired,
  name:             PropTypes.string.isRequired,
  user_is_assigned: PropTypes.bool.isRequired
}