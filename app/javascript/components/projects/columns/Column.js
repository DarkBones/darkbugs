import React from 'react'
import PropTypes from 'prop-types'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import ColumnTitle from './ColumnTitle'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { index, uuid, column, updateColumnName } = this.props
    return (
      <Draggable
        draggableId={uuid}
        index={index}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className='column rounded'
          >
            <div
              className='column-title'
              {...provided.dragHandleProps}
            >
              <ColumnTitle
                columnName={column.name}
                columnUuid={uuid}
                updateColumnName={updateColumnName}
              />
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

Column.propTypes = {
  index: PropTypes.number.isRequired,
  uuid: PropTypes.string.isRequired,
  column: PropTypes.object.isRequired,
  updateColumnName: PropTypes.func.isRequired
}
