import React          from 'react'
import ApiInput       from '../../../shared/input/ApiInput'
import PropTypes      from 'prop-types'
import { ColumnApi }  from '../../../../api/InternalApi'

export default class Name extends React.Component {
  constructor(props) {
    super(props)

    const { columnUuid, name } = this.props
    const isNew = columnUuid === 'new'

    this.state = {
      isNew:      isNew,
      isEditing:  isNew,
      name:       name
    }
  }

  cancelEdit = () => {
    this.setState({
      isEditing:  false,
      name:       this.props.name
    })

    if (this.state.isNew) {
      this.props.deleteColumn('new')
    }
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
    if (!this.name.contains(e.target)) this.cancelEdit()
  }

  handleSubmit = () => {
    if (!this.props.userIsAssigned) return

    this.state.isNew
      ? this.saveNewColumn()
      : this.updateName()
  }

  saveNewColumn = async () => {
    const { boardSlug, addColumn } = this.props

    let response = await ColumnApi
      .createColumn(
        boardSlug,
        { name: this.state.name }
      )

    if (!response) return
    if (response.status !== 200) return

    const { uuid, name } = response.data

    addColumn(uuid, name)
  }

  setIsEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  startEditing = () => {
    this.setIsEditing(true)
  }

  removeNewColumn = () => {
    this.cancelEdit()

    this.props.deleteColumn('new')
  }

  updateName = async () => {
    const { cancelEdit, removeNewColumn, setIsEditing } = this
    const { columnUuid, handleAfterSubmit } = this.props
    const { name } = this.state

    if (name === '') {
      cancelEdit()
      return
    }

    let response = await ColumnApi.updateColumn(
      columnUuid,
      { name: name }
    )

    if (!response) return

    if (response.status !== 200) {
      removeNewColumn()
      return
    }

    handleAfterSubmit(response.data)
    setIsEditing(false)
  }

  render() {
    const {
      cancelEdit,
      handleOnChange,
      handleSubmit,
      startEditing
    } = this
    const { name, isEditing } = this.state
    const { userIsAssigned } = this.props

    const headerClass = userIsAssigned ? 'editable' : ''

    const header = (
      <h3
        className={`column-name ${headerClass}`}
        onClick={startEditing}
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
  addColumn:          PropTypes.func.isRequired,
  boardSlug:          PropTypes.string.isRequired,
  columnUuid:         PropTypes.string.isRequired,
  deleteColumn:       PropTypes.func.isRequired,
  handleAfterSubmit:  PropTypes.func.isRequired,
  name:               PropTypes.string.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired
}