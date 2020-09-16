import React from 'react'
import PropTypes from 'prop-types'
import ApiInput from '../../../shared/input/ApiInput'

import {
  ColumnApi
} from '../../../../api/InternalApi'

export default class Name extends React.Component {
  constructor(props) {
    super(props)

    const isNew = props.columnUuid === 'new'

    this.state = {
      isNew: isNew,
      isEditing: isNew,
      name: props.name
    }
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  handleClick = e => {
    if (this.name.contains(e.target)) return

    this.removeNewColumn()
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    if (!this.props.userIsAssigned) return

    this.state.isNew
      ? this.saveNewColumn()
      : this.updateName()
  }

  removeNewColumn = () => {
    this.stopEditing()
    this.setState({
      name: this.props.name
    })

    if (this.state.isNew) {
      this.props.deleteColumn('new')
    }
  }

  saveNewColumn = async () => {
    let response = await ColumnApi
      .createColumn(
        this.props.boardSlug,
        { name: this.state.name }
      )

    if (!response) return

    if (response.status === 200) {
      this.props.addColumn(response.data.uuid, response.data.name)
      return
    }

    this.removeNewColumn()
  }

  setEditing = editing => {
    this.setState({
      isEditing: editing
    })
  }

  startEditing = () => {
    this.setEditing(true)
  }

  stopEditing = () => {
    this.setEditing(false)
  }

  updateName = async () => {
    if (this.state.name === '') {
      this.stopEditing()
      return
    }

    const { columnUuid, handleAfterSubmit } = this.props

    let response = await ColumnApi
      .updateColumn(
        columnUuid,
        { name: this.state.name }
      )

    if (!response) return

    if (response.status === 200) {
      handleAfterSubmit(response.data)
      this.stopEditing()
      return
    }

    this.removeNewColumn()
  }

  render() {
    const { name } = this.state
    const headerClassName = this.props.userIsAssigned ? 'editable' : ''

    const header = (
      <h3
        onClick={this.startEditing}
        className={`column-name ${headerClassName}`}
      >
        {name}
      </h3>
    )

    const input = (
      <ApiInput
        focus={true}
        handleCancel={this.removeNewColumn}
        handleOnChange={this.handleOnChange}
        handleSubmit={this.handleSubmit}
        name="name"
        value={name}
      />
    )

    const columnName = this.state.isEditing ? input : header

    return (
      <div
        className="column-title-name"
        ref={name => this.name = name}
      >
        {columnName}
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