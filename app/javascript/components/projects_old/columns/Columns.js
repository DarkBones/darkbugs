import React from 'react'
import Column from './Column';
import AddColumnButton from './AddColumnButton';
import { DragDropContext } from 'react-beautiful-dnd'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      columnOrder: props.columnOrder
    }
  }

  onBeforeCapture = () => {
    console.log('onBeforeCapture')
  }

  onBeforeDragStart = () => {
    console.log('onBeforeDragStart')
  }

  onDragStart = () => {
    console.log('onDragStart')
  }
  onDragUpdate = () => {
    console.log('onDragUpdate')
  }
  onDragEnd = () => {
    console.log('onDragEnd')
  }

  addColumn = () => {
    let newColumns = {
      name: '',
      uuid: '',
      cards: []
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
        column.cards = []
      }

      persistedColumns.push(column)
    })

    this.setState({
      columns: persistedColumns
    })

    this.props.updateColumns(persistedColumns)
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
      <DragDropContext
        onBeforeCapture={this.onBeforeCapture}
        onBeforeDragStart={this.onBeforeDragStart}
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
        <div
          id='columns'
        >
          {this.state.columnOrder.map((columnUuid) =>
            <Column
              name={this.state.columns[columnUuid].name}
              uuid={this.state.columns[columnUuid].uuid}
              key={this.state.columns[columnUuid].uuid}
              cancelNewColumns={this.cancelNewColumns}
              saveNewColumn={this.saveNewColumn}
              boardSlug={this.props.boardSlug}
              deleteColumn={this.deleteColumn}
              showCardModal={this.props.showCardModal}
              cardOrder={this.state.columns[columnUuid].card_uuids}
              cards={this.props.cards}
              // cards={columns[columnUuid].cards}
            />
          )}
          <AddColumnButton
            handleClick={this.addColumn}
          />
        </div>
      </DragDropContext>
    )
  }
}
