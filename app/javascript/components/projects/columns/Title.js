import React from 'react'
import Name from "./Name";
import DeleteColumnButton from "./DeleteColumnButton";

export default function Title(props) {
  return (
    <React.Fragment>
      <Name
        name={props.name}
        column_uuid={props.uuid}
        userIsAdmin={props.userIsAdmin}
        isNew={props.uuid === ''}
        cancelNewColumns={props.cancelNewColumns}
        saveNewColumn={props.saveNewColumn}
        boardSlug={props.boardSlug}
      />
      <DeleteColumnButton
        handleClick={props.handleDeleteClick}
        userIsAdmin={props.userIsAdmin}
      />
    </React.Fragment>
  )
}
