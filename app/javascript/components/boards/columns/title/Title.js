import React      from 'react'
import Name       from './Name'
import PropTypes  from 'prop-types'

export default function Title(props) {
  const {
    columnUuid,
    deleteColumn,
    updateColumnName,
    name,
    userIsAssigned
  } = props

  return (
    <div className="column-title">
      <div className="row">
        <div className="col-10">
          <Name
            columnUuid=         {columnUuid}
            deleteColumn=       {deleteColumn}
            handleAfterSubmit=  {updateColumnName}
            name=               {name}
            userIsAssigned=     {userIsAssigned}
          />
        </div>
      </div>
    </div>
  )
}

Title.propTypes = {
  columnUuid:       PropTypes.string.isRequired,
  deleteColumn:     PropTypes.func.isRequired,
  name:             PropTypes.string.isRequired,
  updateColumnName: PropTypes.func.isRequired,
  userIsAssigned:   PropTypes.bool.isRequired
}