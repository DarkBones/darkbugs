import React from 'react'

export default function AddColumnButton(props) {
  return (
    <div className='add-column-btn-container'>
      {props.userIsAdmin &&
        <div className='add-column-btn clickable'>
          <i className='fa fa-plus-circle fa-3x' onClick={props.handleClick}/>
        </div>
      }
    </div>
  )
}
