import React from 'react'
import PropTypes from 'prop-types'

export default function ColumnCreateButton(props) {
  const handleClick = () => {
    props.onClick('new', '')
  }

  return (
    <React.Fragment>
      {props.userIsAssigned &&
        <div className='add-column-btn-container'>
          <i className='fa fa-plus-circle fa-3x clickable' onClick={handleClick}/>
        </div>
      }
    </React.Fragment>
  )
}

ColumnCreateButton.propTypes = {
  userIsAssigned: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}
