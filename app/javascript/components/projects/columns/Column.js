import React from 'react'
import Title from './Title'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='column rounded p-2 pb-5'>
        <Title title={this.props.title} column_uuid={this.props.uuid} />
      </div>
    )
  }
}
