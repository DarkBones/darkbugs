import React from 'react'
import Form from '../../../shared/input/Form'
import PropTypes from 'prop-types'

export default function Note(props) {
  const noteElement = () => {
    return props.params.content
  }

  const { uuid } = props
  const note = noteElement()

  return (
    <div
      itemType="note"
      id={uuid}
      className="display-linebreak bg-light rounded p-3 my-3"
    >
      {note}
    </div>
  )
}

Note.propTypes = {
  params:     PropTypes.object.isRequired,
  uuid:       PropTypes.string.isRequired
}