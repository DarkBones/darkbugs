import React from 'react'
import Name from "./Name";
import DeleteColumnButton from "./DeleteColumnButton";

export default function Title(props) {
  return (
    <React.Fragment>
      <Name
        name={props.name}
        column_uuid={props.uuid}
        isNew={props.uuid === ''}
        cancelNewColumns={props.cancelNewColumns}
        saveNewColumn={props.saveNewColumn}
        boardSlug={props.boardSlug}
      />
      <DeleteColumnButton
        handleClick={props.handleDeleteClick}
      />
    </React.Fragment>
  )
}
