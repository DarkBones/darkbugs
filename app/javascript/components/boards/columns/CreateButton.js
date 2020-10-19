import React      from 'react'
import PropTypes  from 'prop-types'

export default function CreateButton(props) {
  const handleClick = () => {
    props.onClick('new')
  }

  return (
    <React.Fragment>
      {props.isEnabled &&
        <button
          className="btn create-column"
          onClick={handleClick}
        >
          <i
            className="fa fa-plus-circle fa-3x clickable"
          />
        </button>
      }
    </React.Fragment>
  )
}

CreateButton.propTypes = {
  isEnabled:  PropTypes.bool.isRequired,
  onClick:    PropTypes.func.isRequired
}