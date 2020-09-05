import React from 'react'
import PropTypes from 'prop-types'

export default function ColumnDeleteButton(props) {
  const handleClick = () => {
    props.handleClick(props.columnUuid)
  }

  return (
    <div className='delete-column-btn clickable float-right'>
      <i className='fa fa-times-circle' onClick={handleClick}/>
    </div>
  )
}

ColumnDeleteButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  columnUuid: PropTypes.string.isRequired
}
