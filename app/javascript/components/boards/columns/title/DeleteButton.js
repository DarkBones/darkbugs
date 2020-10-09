import React      from 'react'
import i18n       from '../../../../i18n'
import PropTypes  from 'prop-types'

export default function DeleteButton(props) {
  const handleClick = () => {
    const { columnUuid, handleClick } = props

    let r = confirm(
      i18n.t('components.projects.columns.Column.delete_warning')
    )

    if (!r) return

    handleClick(columnUuid)
  }

  const { userIsAssigned } = props

  return (
    <React.Fragment>
      {userIsAssigned &&
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