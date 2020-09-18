import React      from 'react'
import ApiInput   from '../../shared/input/ApiInput'
import PropTypes  from 'prop-types'

import {
  BoardApi
} from '../../../api/InternalApi'

export default class Title extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing:  false,
      name:       props.name
    }
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  handleClick = e => {
    if (this.title.contains(e.target)){
      this.startEditing()
    } else {
      this.stopEditing()
    }
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    this.updateBoardName()
  }

  setEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  startEditing = () => {
    this.setEditing(true)
  }

  stopEditing = () => {
    this.setEditing(false)
  }

  updateBoardName = async () => {
    const {
      boardSlug,
      handleAfterUpdate
    } = this.props

    const params = {
      board: {
        name: this.state.name
      }
    }

    await BoardApi.updateName(boardSlug, params)

    handleAfterUpdate(this.state.name)
    this.stopEditing()
  }

  render() {
    const {
      name
    } = this.state

    const nameElement = this.state.isEditing
      ? (
        <ApiInput
          handleSubmit={this.handleSubmit}
          name="name"
          focus={true}
          handleOnChange={this.handleOnChange}
          value={name} />
      )
      : (
        <h1
          onClick={this.handleClick}
        >
          {name}
        </h1>
      )

    return (
      <div
        className="board-title"
        ref={title => this.title = title}
      >
        {nameElement}
      </div>
    )
  }
}

Title.propTypes = {
  boardSlug:          PropTypes.string.isRequired,
  handleAfterUpdate:  PropTypes.func.isRequired,
  name:               PropTypes.string.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired
}