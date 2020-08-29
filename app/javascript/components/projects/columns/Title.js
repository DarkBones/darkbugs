import React from 'react'
import Name from "./Name";
import DeleteColumnButton from "./DeleteColumnButton";

export default function Title(props) {
  return (
    <div className='row'>
      <div className='col-10 title-name'>
        <Name
          name={props.name}
          column_uuid={props.uuid}
          isNew={props.uuid === ''}
          cancelNewColumns={props.cancelNewColumns}
          saveNewColumn={props.saveNewColumn}
          boardSlug={props.boardSlug}
        />
      </div>
      <div className='col-2'>
        <DeleteColumnButton
          handleClick={props.handleDeleteClick}
        />
      </div>
    </div>
  )
}
