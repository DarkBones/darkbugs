import React from 'react'
import PropTypes from 'prop-types'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import ColumnTitle from './ColumnTitle'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { index, uuid, column, updateColumnName, deleteColumn, cancelNewColumn, userIsAssigned, boardSlug, saveNewColumn } = this.props
    return (
      <Draggable
        draggableId={uuid}
        index={index}
        isDragDisabled={!this.props.userIsAssigned}
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
                deleteColumn={deleteColumn}
                cancelNewColumn={cancelNewColumn}
                userIsAssigned={userIsAssigned}
                boardSlug={boardSlug}
                saveNewColumn={saveNewColumn}
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
  boardSlug: PropTypes.string.isRequired,
  updateColumnName: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  cancelNewColumn: PropTypes.func.isRequired,
  saveNewColumn: PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}
