import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Column from './Column'

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

  updateColumnName = (data) => {
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
  setColumns: PropTypes.func.isRequired
}
