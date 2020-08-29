import React, { useContext } from 'react'
import UserContext from '../contexts/UserContext'

export default function AddColumnButton(props) {
  const user = useContext(UserContext)

  return (
    <div className='add-column-btn-container'>
      {user.isAdmin &&
        <div className='add-column-btn clickable'>
          <i className='fa fa-plus-circle fa-3x' onClick={props.handleClick}/>
        </div>
      }
    </div>
  )
}
