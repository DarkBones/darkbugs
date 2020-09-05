import React from 'react'
import PropTypes from 'prop-types'
import ColumnTitleName from './ColumnTitleName'
import ColumnDeleteButton from './ColumnDeleteButton'

export default class ColumnTitle extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { columnName, columnUuid, updateColumnName, deleteColumn, userIsAssigned } = this.props
    return (
      <div className='column-title'>
        <div className='row'>
          <div className='col-10'>
            <ColumnTitleName
              name={columnName}
              columnUuid={columnUuid}
              handleAfterSubmit={updateColumnName}
              userIsAssigned={userIsAssigned}
            />
          </div>
          <div className='col-2'>
            <ColumnDeleteButton
              handleClick={deleteColumn}
              columnUuid={columnUuid}
              userIsAssigned={userIsAssigned}
            />
          </div>
        </div>
      </div>
    )
  }
}

ColumnTitle.propTypes = {
  columnName: PropTypes.string.isRequired,
  columnUuid: PropTypes.string.isRequired,
  updateColumnName: PropTypes.string.isRequired,
  updateColumnName: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}
