import React from 'react'

export default function ApiInput(props) {
  const handleKeyDown = (e) => {
    if (event.key === 'Enter') {
      console.log('submit to api')
      props.afterSubmit()
    }
  }

  return (
    <input
      className='form-control'
      defaultValue={props.value}
      onKeyDown={handleKeyDown}
    />
  )
}
