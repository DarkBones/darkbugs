import React from 'react'

export default class Column extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title
    }
  }

  render() {
    return (
      <div className='column rounded p-2 pb-5'>
        <h4 className='column-title'>
          {this.state.title}
        </h4>
      </div>
    )
  }
}
