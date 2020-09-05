import React from 'react'
import PropTypes from 'prop-types'
import ColumnTitleName from './ColumnTitleName'
import ColumnDeleteButton from './ColumnDeleteButton'

export default class ColumnTitle extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { columnName, columnUuid, updateColumnName, deleteColumn, cancelNewColumn, userIsAssigned, boardSlug, saveNewColumn } = this.props
    return (
      <div className='column-title'>
        <div className='row'>
          <div className='col-10'>
            <ColumnTitleName
              name={columnName}
              columnUuid={columnUuid}
              handleAfterSubmit={updateColumnName}
              userIsAssigned={userIsAssigned}
              cancelNewColumn={cancelNewColumn}
              boardSlug={boardSlug}
              saveNewColumn={saveNewColumn}
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
  boardSlug: PropTypes.string.isRequired,
  updateColumnName: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  cancelNewColumn: PropTypes.func.isRequired,
  saveNewColumn: PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}
