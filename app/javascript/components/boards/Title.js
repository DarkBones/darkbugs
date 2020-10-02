import ApiInput     from '../shared/input/ApiInput'
import React        from 'react'
import PropTypes    from 'prop-types'
import { BoardApi } from '../../api/InternalApi'

function TitleElement(props) {

}

export default class Title extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing:  false,
      name:       props.name
    }
  }

  handleClick = e => {
    this.setIsEditing(this.title.contains(e.target))
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    this.updateBoardName()
  }

  updateBoardName = async () => {
    const {
      boardSlug,
      handleAfterUpdate
    } = this.props

    await BoardApi
      .updateName(
        boardSlug,
        {
          board: {
            name: this.state.name
          }
        }
      )
  }

  setIsEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  stopEditing = () => {
    this.setIsEditing(false)
  }

  render() {
    const {
      isEditing,
      name
    } = this.state

    return (
      <TitleElement
        handleSubmit={this.handleSubmit}
        handleOnChange={this.handleOnChange}
        handleOnClick={this.handleClick}
        isEditing={isEditing}
        stopEditing={this.stopEditing}
        value={name}
      />
    )
  }
}

Title.propTypes = {
  boardSlug:          PropTypes.string.isRequired,
  handleAfterUpdate:  PropTypes.string.isRequired,
  name:               PropTypes.string.isRequired
}

TitleElement.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}