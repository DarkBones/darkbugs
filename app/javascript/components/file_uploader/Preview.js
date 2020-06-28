import React from 'react'

export default function Preview(props) {
  const boxStyle = {
    width: '100%',
    paddingTop: '100%',
    position: 'relative'
  }

  const mediaStyle = {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }

  const imgStyle = {
    objectFit: 'cover',
    minWidth: '100%',
    minHeight: '100%',
    width: '100%',
    height: 'auto'
  }

  return <div
    className='box'
    style={boxStyle}
    >
    <div
      className='media rounded'
      style={mediaStyle}
    >
      <img
        src={props.file}
        className='img'
        style={imgStyle}
      />
    </div>
  </div>
}
