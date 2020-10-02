import React      from 'react'
import PropTypes  from 'prop-types'
import i18n       from '../../../../i18n'

export default function DeleteButton(props) {
  const handleClick = () => {
    let r = confirm(i18n.t('components.projects.columns.Column.delete_warning'))

    if (!r) {
      return
    }

    props.handleClick(props.columnUuid)
  }

  return (
    <React.Fragment>
      {props.userIsAssigned &&
        <div
          className="delete-column-btn clickable float-right"
        >
          <i
            className="fa fa-times-circle"
            onClick={handleClick}
          />
        </div>
      }
    </React.Fragment>
  )
}

DeleteButton.propTypes = {
  columnUuid:     PropTypes.string.isRequired,
  handleClick:    PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}