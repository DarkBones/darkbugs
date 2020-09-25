import React from 'react'
import PropTypes from 'prop-types'

export default function Avatar(props) {
  const size = props.size || 'xl'
  const divClass = `avatar avatar-${size}`

  return (
    <div
      className={divClass}
      title={props.name}
    >
      <img
        className="avatar-img img-fluid dropdown-user-img"
        src={props.url}
      />
    </div>
  )
}

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  url: PropTypes.string.isRequired
}