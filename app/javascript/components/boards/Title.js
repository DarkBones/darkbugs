import ApiInput     from '../shared/input/ApiInput'
import React        from 'react'
import PropTypes    from 'prop-types'
import { BoardApi } from '../../api/InternalApi'

export default class Title extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing:  false,
      name:       props.name
    }
  }

  cancelEditing = () => {
    this.setState({
      isEditing:  false,
      name:       this.props.name
    })
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  handleClick = e => {
    const { setIsEditing, cancelEditing } = this

    this.title.contains(e.target)
      ? setIsEditing(true)
      : cancelEditing()
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
    const { setIsEditing } = this
    const { boardSlug, handleAfterUpdate } = this.props
    const { name } = this.state

    await BoardApi
      .updateName(
        boardSlug,
        { board: { name: name }}
      )

    setIsEditing(false)

    handleAfterUpdate(name)
  }

  setIsEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  titleElement = () => {
    const {
      handleClick,
      handleOnChange,
      cancelEditing,
      updateBoardName
    } = this

    const { userIsAssigned } = this.props

    const { isEditing, name } = this.state

    let el = (
      <h1
        onClick={handleClick}
      >
        {name}
      </h1>
    )

    if (userIsAssigned) {
      if (isEditing) {
        el = (
          <ApiInput
            handleSubmit=   {updateBoardName}
            name=           "name"
            focus=          {true}
            value=          {name}
            handleCancel=   {cancelEditing}
            handleOnChange= {handleOnChange}
          />
        )
      }
    }

    return el
  }

  render() {
    const element = this.titleElement()

    return (
      <div
        id="board-title"
        ref={title => this.title = title}
      >
        {element}
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