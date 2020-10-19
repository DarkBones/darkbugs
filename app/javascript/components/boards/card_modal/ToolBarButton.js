import React      from 'react'
import PropTypes  from 'prop-types'

export default function ToolBarButton(props) {
  return (
    <button
      className="btn btn-default btn-circle btn-circle-xl"
      onClick={props.onClick}
    >
      <i
        className={`${props.faIconClass} fa-3x`}
      ></i>
    </button>
  )
}

ToolBarButton.propTypes = {
  faIconClass: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}