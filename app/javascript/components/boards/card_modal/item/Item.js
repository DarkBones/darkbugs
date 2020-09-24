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

  switch(type) {
    case 'note':
      item = (
        <Note
          content={params.content}
          uuid={uuid}
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
  item: PropTypes.object.isRequired
}