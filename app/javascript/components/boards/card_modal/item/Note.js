import React from 'react'
import Form from '../../../shared/input/Form'
import PropTypes from 'prop-types'

export default class Note extends React.Component {
  constructor(props) {
    super(props)

    const content = props.params.content

    this.formParams = {
      fieldOrder: ['content'],
      fields: {
        content: {
          name: 'content',
          type: 'text',
          value: content
        }
      }
    }

    this.state = {
      content: content
    }
  }

  handleCancel = () => {
    console.log('handle cancel')
  }

  handleOnChange = e => {
    console.log('handle on change')
  }

  handleSubmit = params => {
    console.log(params)
  }

  noteContent = () => {
    return this.state.content
  }

  noteElement = () => {
    const { noteContent, noteForm } = this

    return this.props.isEditing
      ? noteForm()
      : noteContent()
  }

  noteForm = () => {
    const { handleCancel, handleSubmit } = this
    const { fieldOrder, fields } = this.formParams

    return (
      <Form
        fieldOrder={fieldOrder}
        fields={fields}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
    )
  }

  render() {
    const { noteElement } = this

    const { uuid } = this.props
    const note = noteElement()

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
  isEditing:  PropTypes.bool.isRequired,
  params:     PropTypes.object.isRequired,
  uuid:       PropTypes.string.isRequired
}