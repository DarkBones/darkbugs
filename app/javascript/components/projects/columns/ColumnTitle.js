import React from 'react'
import PropTypes from 'prop-types'
import ColumnTitleName from './ColumnTitleName'

export default class ColumnTitle extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { columnName, columnUuid, updateColumnName } = this.props
    return (
      <React.Fragment>
        <div className='row'>
          <div className='col-10'>
            <ColumnTitleName
              name={columnName}
              columnUuid={columnUuid}
              handleAfterSubmit={updateColumnName}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

ColumnTitle.propTypes = {
  columnName: PropTypes.string.isRequired,
  columnUuid: PropTypes.string.isRequired,
  updateColumnName: PropTypes.string.isRequired,
  updateColumnName: PropTypes.func.isRequired
}
