import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import Column from './Column'

export default class ColumnsList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Droppable
        droppableId='dropable_columns'
        direction='horizontal'
        type='column'
      >
        {(provided, snapshot) => (
          <div
            id='columns'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {this.props.columns.order.map((column, index) =>
              <Column
                key={this.props.columns.columns[column].uuid}
                column={this.props.columns.columns[column]}
                index={index}
              />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    )
  }
}
