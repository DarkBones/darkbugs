import React from 'react'

export default function Preview(props) {
  return <div
    className='box avatar-box'
    >
    <div
      className='media rounded'
    >
      <img
        src={props.file}
        className='img'
      />
    </div>
  </div>
}
