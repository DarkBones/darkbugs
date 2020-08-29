import React from 'react'
import Column from './Column';
import AddColumnButton from './AddColumnButton';

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns
    }
  }

  addColumn = () => {
    let newColumns = {
      name: '',
      uuid: ''
    }

    if (JSON.stringify(this.state.columns) !== '{}') {
      newColumns = this.state.columns.concat(newColumns)
    }

    this.setState({
      columns: newColumns
    })
  }

  cancelNewColumns = () => {
    let persistedColumns = []

    this.state.columns.forEach(function (column) {
      if (column.uuid !== '') {
        persistedColumns.push(column)
      }
    })

    this.setState({
      columns: persistedColumns
    })
  }

  saveNewColumn = (uuid, name) => {
    let persistedColumns = []

    this.state.columns.forEach(function (column) {
      if (column.uuid === '') {
        column.uuid = uuid
        column.name = name
      }

      persistedColumns.push(column)
    })

    this.setState({
      columns: persistedColumns
    })
  }

  deleteColumn = (uuid) => {
    let columns = []

    this.state.columns.forEach(function (column) {
      if (column.uuid != uuid) {
        columns.push(column)
      }
    })

    this.setState({
      columns: columns
    })
  }


  render() {
    return (
      <div
        id='columns'
      >
        {this.state.columns.map((column) =>
          <Column
            name={column.name}
            uuid={column.uuid}
            userIsAdmin={this.props.userIsAdmin}
            key={column.uuid}
            cancelNewColumns={this.cancelNewColumns}
            saveNewColumn={this.saveNewColumn}
            boardSlug={this.props.boardSlug}
            deleteColumn={this.deleteColumn}
          />
        )}
        <AddColumnButton
          handleClick={this.addColumn}
          userIsAdmin={this.props.userIsAdmin}
        />
      </div>
    )
  }
}
