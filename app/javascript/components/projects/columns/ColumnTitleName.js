import React from 'react'
import PropTypes from 'prop-types'
import ApiInput from '../../shared/input/ApiInput'
import { ColumnApi } from '../../../api/InternalApi'

export default class ColumnTitleName extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      name: props.name
    }
  }

  handleClick = e => {
    if (this.name.contains(e.target)) {
      return
    }

    this.handleCancel()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  startEditing = () => {
    if (this.props.userIsAssigned){
      this.setState({
        isEditing: true
      })
    }
  }

  stopEditing = () => {
    this.setState({
      isEditing: false
    })
  }

  handleCancel = () => {
    this.stopEditing()
    this.setState({
      name: this.props.name
    })
  }

  handleSubmit = async () => {
    if (!this.props.userIsAssigned){
      return
    }

    const { columnUuid, handleAfterSubmit } = this.props

    let response = await ColumnApi
      .updateColumn(
        columnUuid,
        {
          name: this.state.name
        }
      )

    if (typeof(response) !== 'undefined') {
      if (response.status === 200) {
        handleAfterSubmit(response.data)
        this.stopEditing()
        return
      }
    }

    this.handleCancel()
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { name } = this.props
    const headerClassName = this.props.userIsAssigned ? 'editable' : ''

    const header = (
      <h3 onClick={this.startEditing} className={`column-name ${headerClassName}`}>
        {name}
      </h3>
    )

    const input = (
      <ApiInput
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}
        handleOnChange={this.handleOnChange}
        name={'name'}
        focus={true}
        value={this.state.name}
      />
    )

    const columnName = this.state.isEditing ? input : header

    return (
      <div
        className='column-title-name'
        ref={name => this.name = name}
      >
        {columnName}
      </div>
    )
  }
}

ColumnTitleName.propTypes = {
  name: PropTypes.string.isRequired,
  handleAfterSubmit: PropTypes.func.isRequired,
  columnUuid: PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}