import React from 'react'
import Name from './Name'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className='column rounded p-2 pb-5'
      >
        <Name
          name={this.props.name}
          column_uuid={this.props.uuid}
        />
      </div>
    )
  }
}
