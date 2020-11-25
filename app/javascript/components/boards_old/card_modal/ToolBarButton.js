import React      from 'react'
import PropTypes  from 'prop-types'

export default function ToolBarButton(props) {
  const { onClick, faIconClass, buttonText} = props

  return (
    <React.Fragment>
      <button
        className="btn btn-default btn-circle btn-circle-xl"
        onClick={onClick}
      >
        <i
          className={`${faIconClass} fa-3x`}
        ></i>
      </button>
      <div
        className="text-light font-weight-bold ml-2 p-1 button-label"
      >
        {buttonText}
      </div>
    </React.Fragment>
  )
}

ToolBarButton.propTypes = {
  buttonText:   PropTypes.string.isRequired,
  faIconClass:  PropTypes.string.isRequired,
  onClick:      PropTypes.func.isRequired
}