import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Column from './Column'
import i18n from '../../../i18n'
import {ColumnApi} from "../../../api/InternalApi";

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns,
      columnOrder: props.columnOrder
    }
  }

  onDragEnd = result => {
    console.log(result)
  }

  updateColumnName = data => {
    const newState = {
      ... this.state,
      columns: {
        ... this.state.columns,
        [data.uuid]: {
          ... this.state.columns[data.uuid],
          name: data.name
        }
      }
    }

    this.setState(newState)

    this.handleColumnsUpdate()
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
                  userIsAssigned={this.props.userIsAssigned}
                />
              )}
              {provided.placeholder}
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
  userIsAssigned: PropTypes.bool.isRequired
}
