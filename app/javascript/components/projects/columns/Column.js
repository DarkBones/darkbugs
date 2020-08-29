import React from 'react'
import Name from './Name'

export default class Column extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isNew: props.uuid === ''
    }
  }

  render() {
    return (
      <div
        className='column rounded p-2 pb-5'
      >
        <Name
          name={this.props.name}
          column_uuid={this.props.uuid}
          userIsAdmin={this.props.userIdAdmin}
          isNew={this.props.uuid === ''}
          cancelNewColumns={this.props.cancelNewColumns}
          saveNewColumn={this.props.saveNewColumn}
          boardSlug={this.props.boardSlug}
        />
      </div>
    )
  }
}
