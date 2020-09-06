import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Column from './Column'
import i18n from '../../../i18n'
import { ColumnApi, BoardApi } from '../../../api/InternalApi'
import ColumnCreateButton from './ColumnCreateButton'
import { updateColumnOrderState, updateColumnNameState } from '../utils/columns'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      columnOrder: props.columnOrder
    }
  }

  onDragEnd = result => {
    const {destination, source, draggableId, type} = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'column') {
      this.updateColumnOrder(source, destination, draggableId)
    }
  }

  updateColumnOrder = async (source, destination, draggableId) => {
    const oldColumnOrder = this.state.columnOrder

    const newState = updateColumnOrderState(this.state, source, destination, draggableId)

    this.setState(newState)

    let response = await BoardApi
      .reorderColumns(
        this.props.boardSlug,
        {
          columns: newState.columnOrder
        }
      ).catch(() => {
        this.setState({
          ...this.state,
          columnOrder: oldColumnOrder
        })
      })

    this.handleColumnsUpdate()
  }

  updateColumnName = data => {
    const newState = updateColumnNameState(this.state, data.uuid, data.name)

    this.setState(newState)

    this.handleColumnsUpdate()
  }

  addColumn = (uuid = 'new', name= '') => {
    this.cancelNewColumn()

    const newColumn = {
      uuid: uuid,
      name: name
    }

    let newColumnOrder = this.state.columnOrder
    newColumnOrder.push(uuid)
    const newState = {
      ... this.state,
      columns: {
        ...this.state.columns,
        [uuid]: newColumn
      },
      columnOrder: newColumnOrder
    }

    console.log(newState)

    this.setState(newState)
  }

  cancelNewColumn = () => {
    let columnOrder = this.state.columnOrder
    const columnOrderIndex = columnOrder.indexOf('new')

    if (columnOrderIndex === -1) {
      return
    }

    columnOrder.splice(columnOrderIndex, 1)
    let columns = this.state.columns
    delete columns['new']

    const newState = {
      ...this.state,
      columns: columns,
      columnOrder: columnOrder
    }

    this.setState(newState)
  }

  saveNewColumn = (columnUuid, columnName) => {
    this.addColumn(columnUuid, columnName)
  }

  deleteColumn = async (columnUuid) => {
    let r = confirm(i18n.t('components.projects.columns.Column.delete_warning'))

    if (!r) {
      return
    }

    let columnOrder = this.state.columnOrder
    const columnOrderIndex = columnOrder.indexOf(columnUuid)

    if (columnOrderIndex === -1) {
      return
    }

    columnOrder.splice(columnOrderIndex, 1)
    let columns = this.state.columns
    delete columns[columnUuid]

    const newState = {
      ... this.state,
      columns: columns,
      columnOrder: columnOrder
    }

    let response = await ColumnApi
      .deleteColumn(columnUuid)

    if (typeof (response) !== 'undefined') {
      this.setState(newState)
      this.handleColumnsUpdate()
    }
  }

  handleColumnsUpdate = () => {
    this.props.setColumns({
      columns: this.state.columns,
      order: this.state.columnOrder
    })
  }

  render() {
    const { columns, columnOrder } = this.state

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable
          droppableId='dropable_columns'
          direction='horizontal'
          type='column'
        >
          {(provided) => (
            <div
              id='columns'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrder.map((columnUuid, index) =>
                <Column
                  key={columnUuid}
                  uuid={columnUuid}
                  column={columns[columnUuid]}
                  index={index}
                  updateColumnName={this.updateColumnName}
                  deleteColumn={this.deleteColumn}
                  cancelNewColumn={this.cancelNewColumn}
                  userIsAssigned={this.props.userIsAssigned}
                  boardSlug={this.props.boardSlug}
                  saveNewColumn={this.saveNewColumn}
                />
              )}
              {provided.placeholder}
              <ColumnCreateButton
                userIsAssigned={this.props.userIsAssigned}
                onClick={this.addColumn}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

Columns.propTypes = {
  columns: PropTypes.object.isRequired,
  columnOrder: PropTypes.array.isRequired,
  setColumns: PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired,
  boardSlug: PropTypes.string.isRequired
}
