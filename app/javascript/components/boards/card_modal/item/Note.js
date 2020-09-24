import React from 'react'
import PropTypes from 'prop-types'
import ApiInput from '../../../shared/input/ApiInput'

export default class Note extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      content: '',
      isEditing: props.uuid === 'new'
    }
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    console.log('submit note')
  }

  render () {
    const {
      content,
      isEditing
    } = this.state

    const {
      uuid
    } = this.props

    const note = isEditing
      ? (
        <ApiInput
          handleSubmit={this.handleSubmit}
          handleOnChange={this.handleOnChange}
          name="content"
          focus={true}
          value={content}
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