import React from 'react'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div
        className='item-card mb-3 p-2 rounded'
      >
        <div
          className='font-weight-bold'
        >
          {this.props.name}
        </div>
      </div>
    )
  }
}
