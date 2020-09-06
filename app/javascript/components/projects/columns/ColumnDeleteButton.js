import React      from 'react'
import PropTypes  from 'prop-types'

export default function ColumnDeleteButton(props) {
  const handleClick = () => {
    props.handleClick(props.columnUuid)
  }

  return (
    <React.Fragment>
      {props.userIsAssigned &&
        <div className='delete-column-btn clickable float-right'>
          <i
            className='fa fa-times-circle'
            onClick={handleClick}
          />
        </div>
      }
    </React.Fragment>
  )
}

ColumnDeleteButton.propTypes = {
  handleClick:    PropTypes.func.isRequired,
  columnUuid:     PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}
