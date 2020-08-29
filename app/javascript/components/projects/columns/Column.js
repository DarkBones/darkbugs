import React from 'react'
import Name from './Name'
import DeleteColumnButton from './DeleteColumnButton'
import {ColumnApi} from '../../../api/InternalApi'

export default class Column extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isNew: props.uuid === ''
    }
  }

  deleteColumn = async () => {
    let r = confirm("Deleting a column will also delete all its cards. Continue?")

    if (!r) {
      return
    }

    let response = ColumnApi
      .deleteColumn(this.props.uuid)

    if (typeof (response) !== 'undefined') {
      this.props.deleteColumn(this.props.uuid)
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
        <DeleteColumnButton
          handleClick={this.deleteColumn}
          userIsAdmin={this.props.userIdAdmin}
        />
      </div>
    )
  }
}
