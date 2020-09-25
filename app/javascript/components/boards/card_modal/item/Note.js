import React from 'react'
import PropTypes from 'prop-types'
import ApiInput from '../../../shared/input/ApiInput'
import Form from '../../../shared/input/Form'

export default class Note extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      content: props.content,
      fieldOrder: ['content'],
      fields: {
        content: {
          name: 'content',
          type: 'text',
          value: props.content
        }
      },
      isEditing: props.uuid === 'new'
    }
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleCancel = () => {
    this.props.removeItem('new')
  }

  handleSubmit = (data) => {
    this.props.submitItem('note', data)
  }

  render () {
    const {
      content,
      fieldOrder,
      fields,
      isEditing
    } = this.state

    const {
      uuid
    } = this.props

    const note = isEditing
      ? (
        <Form
          fieldOrder={fieldOrder}
          fields={fields}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
        />
      )
      : (
        content
      )

    return (
      <div
        itemType="note"
        id={uuid}
        className="display-linebreak"
      >
        {note}
      </div>
    )
  }
}

Note.propTypes = {
  content:    PropTypes.string.isRequired,
  removeItem: PropTypes.func.isRequired,
  submitItem: PropTypes.func.isRequired,
  uuid:       PropTypes.string.isRequired
}