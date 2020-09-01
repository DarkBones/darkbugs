import React, { useContext } from 'react'
import UserContext from '../contexts/UserContext';

export default function DeleteColumnButton(props) {
  const user = useContext(UserContext)

  return(
    <React.Fragment>
      {user.isAdmin &&
        <div className='delete-column-btn clickable float-right'>
          <i className='fa fa-times-circle' onClick={props.handleClick}/>
        </div>
      }
    </React.Fragment>
  )
}
