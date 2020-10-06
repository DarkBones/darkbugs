import React      from 'react'
import ApiInput   from '../../../shared/input/ApiInput'
import PropTypes  from 'prop-types'

export default class Name extends React.Component {
  constructor(props) {
    super(props)

    const {
      columnUuid,
      name
    } = this.props

    const isNew = columnUuid === 'new'

    this.state = {
      isNew:      isNew,
      isEditing:  isNew,
      name:       name
    }
  }

  cancelEdit = () => {
    this.setState({
      isEditing: false,
      name: this.props.name
    })
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleOnClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleOnClick)
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleOnClick = e => {
    const {
      cancelEdit,
      setIsEditing
    } = this

    this.name.contains(e.target)
      ? setIsEditing(true)
      : cancelEdit()
  }

  handleSubmit = () => {
    console.log('handle submit')
  }

  setIsEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  render() {
    const {
      cancelEdit,
      handleOnChange,
      handleOnClick,
      handleSubmit
    } = this
    const {
      name,
      isEditing
    } = this.state
    const { userIsAssigned } = this.props

    const headerClass = userIsAssigned ? 'editable' : ''

    const header = (
      <h3
        className={`column-name ${headerClass}`}
        onClick={handleOnClick}
      >
        {name}
      </h3>
    )

    const input = (
      <ApiInput
        focus={true}
        handleCancel={cancelEdit}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        name="name"
        value={name}
      />
    )

    const nameElement = isEditing ? input : header

    return (
      <div
        className="column-title-name"
        ref={name => this.name = name}
      >
        {nameElement}
      </div>
    )
  }
}

Name.propTypes = {
  columnUuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}