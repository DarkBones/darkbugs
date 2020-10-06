import React          from 'react'
import ApiInput       from '../../../shared/input/ApiInput'
import PropTypes      from 'prop-types'
import { ColumnApi }  from '../../../../api/InternalApi'

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
    if (!this.props.userIsAssigned) return

    this.state.isNew
      ? this.saveNewColumn()
      : this.updateName()
  }

  saveNewColumn = () => {

  }

  setIsEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  removeNewColumn = () => {
    this.cancelEdit()

    this.props.deleteColumn('new')
  }

  updateName = async () => {
    const {
      columnUuid,
      handleAfterSubmit
    } = this.props

    const {
      name
    } = this.state

    if (this.state.name === '') {
      this.cancelEdit()
      return
    }

    let response = await ColumnApi.updateColumn(
      columnUuid,
      { name: name }
    )

    if (!response) return

    if (response.status !== 200) {
      this.removeNewColumn()
      return
    }

    handleAfterSubmit(response.data)
    this.setIsEditing(false)
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
  deleteColumn: PropTypes.func.isRequired,
  handleAfterSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}