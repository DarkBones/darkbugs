import React from 'react'
import {ColumnApi} from '../../../api/InternalApi'
import Title from './Title';

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
        className='column rounded'
      >
        <div className='column-title'>
          <Title
            name={this.props.name}
            uuid={this.props.uuid}
            userIsAdmin={this.props.userIsAdmin}
            cancelNewColumns={this.props.cancelNewColumns}
            saveNewColumn={this.props.saveNewColumn}
            boardSlug={this.props.boardSlug}
            handleDeleteClick={this.deleteColumn}
          />
        </div>
      </div>
    )
  }
}
