import React        from 'react'
import PropTypes    from 'prop-types'
import Name         from './Name'
import DeleteButton from './DeleteButton'

export default function Title(props) {
  const {
    addColumn,
    boardSlug,
    columnUuid,
    deleteColumn,
    handleAfterSubmit,
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
            handleAfterSubmit=  {handleAfterSubmit}
            name=               {name}
            userIsAssigned=     {userIsAssigned}
          />
        </div>
        <div
          className="col-2"
        >
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
  addColumn:          PropTypes.func.isRequired,
  boardSlug:          PropTypes.string.isRequired,
  columnUuid:         PropTypes.string.isRequired,
  deleteColumn:       PropTypes.func.isRequired,
  handleAfterSubmit:  PropTypes.func.isRequired,
  name:               PropTypes.string.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired
}