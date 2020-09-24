import React from 'react'
import PropTypes from 'prop-types'
import ApiInput from '../../../shared/input/ApiInput'
import Form from '../../../shared/input/Form'

export default class Note extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      content: '',
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
    console.log('cancel')
  }

  handleSubmit = (fields) => {
    console.log('submit note')
    console.log(fields)
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
        {content}
      )

    return (
      <div
        itemType="note"
        id={uuid}
      >
        {note}
      </div>
    )
  }
}

Note.propTypes = {
  content:  PropTypes.string.isRequired,
  uuid:     PropTypes.string.isRequired
}