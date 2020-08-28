import React from 'react'

export default function ApiInput(props) {
  const handleKeyDown = (e) => {
    if (event.key === 'Enter') {
      props.submit(e)
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
