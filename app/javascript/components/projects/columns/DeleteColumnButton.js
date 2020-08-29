import React from 'react'

export default function DeleteColumnButton(props) {
  return(
    <React.Fragment>
      {props.userIsAdmin &&
        <div className='delete-column-btn clickable float-right'>
          <i className='fa fa-times-circle' onClick={props.handleClick}/>
        </div>
      }
    </React.Fragment>
  )
}
