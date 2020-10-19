import React        from 'react'
import DeleteButton from './DeleteButton'
import Name         from './Name'
import PropTypes    from 'prop-types'

export default function Title(props) {
  const {
    addColumn,
    boardSlug,
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
            addColumn=          {addColumn}
            boardSlug=          {boardSlug}
            columnUuid=         {columnUuid}
            deleteColumn=       {deleteColumn}
            handleAfterSubmit=  {updateColumnName}
            name=               {name}
            userIsAssigned=     {userIsAssigned}
          />
        </div>
        <div className="col-2">
          <DeleteButton
            columnUuid=     {columnUuid}
            handleClick=    {deleteColumn}
            userIsAssigned= {userIsAssigned}
          />
        </div>
      </div>
    </div>
  )
}

Title.propTypes = {
  addColumn:        PropTypes.func.isRequired,
  boardSlug:        PropTypes.string.isRequired,
  columnUuid:       PropTypes.string.isRequired,
  deleteColumn:     PropTypes.func.isRequired,
  name:             PropTypes.string.isRequired,
  updateColumnName: PropTypes.func.isRequired,
  userIsAssigned:   PropTypes.bool.isRequired
}