import ApiInput     from '../shared/input/ApiInput'
import React        from 'react'
import PropTypes    from 'prop-types'
import { BoardApi } from '../../api/InternalApi'
import { Dropdown } from 'react-bootstrap'

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
    if (!this.title.contains(e.target)) this.cancelEditing()
  }

  handleBoardClick = e => {
    this.props.visitBoard(e.target.getAttribute('slug'))
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    if (this.state.name.length > 0) {
      this.updateBoardName()
    } else {
      this.cancelEditing()
    }
  }

  updateBoardName = async () => {
    const { cancelEditing, setIsEditing } = this
    const { boardSlug, handleAfterUpdate } = this.props
    const { name } = this.state

    if (name.length === 0) {
      cancelEditing()
      return
    }

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

  startEditing = () => {
    if (!this.props.userIsAssigned) return

    this.setIsEditing(true)
  }

  titleElement = () => {
    const {
      cancelEditing,
      handleOnChange,
      handleBoardClick,
      startEditing,
      updateBoardName
    } = this

    const { boardOrder, boards, userIsAssigned } = this.props

    const { isEditing, name } = this.state

    let el = (
      // <h1
      //   onClick={startEditing}
      //   className="board-title"
      // >
      //   {name}
      // </h1>
      <Dropdown>
        <Dropdown.Toggle
          className="p-0"
          variant="link"
        >
          <h1>
            {name}
          </h1>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {boardOrder.map((slug) =>
            <Dropdown.Item onClick={handleBoardClick} key={slug} slug={slug}>
              {boards[slug]}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
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
  boardOrder:         PropTypes.array.isRequired,
  boards:             PropTypes.object.isRequired,
  boardSlug:          PropTypes.string.isRequired,
  handleAfterUpdate:  PropTypes.func.isRequired,
  name:               PropTypes.string.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired,
  visitBoard:         PropTypes.func.isRequired
}