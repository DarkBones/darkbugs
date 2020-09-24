import React from 'react'
import PropTypes from 'prop-types'
import Note from './Note'

export default function Item(props) {
  const {
    params,
    type,
    uuid
  } = props.item

  let item = <div></div>

  const defaultProps = {
    removeItem: props.removeItem,
    uuid: uuid
  }

  switch(type) {
    case 'note':
      item = (
        <Note
          {...defaultProps}
          content={params.content}
        />
      )
      break
  }

  return (
    <div
      className="card-item"
    >
      {item}
    </div>
  )
}

Item.propTypes = {
  item:       PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired
}