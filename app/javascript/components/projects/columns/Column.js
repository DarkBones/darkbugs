import React        from 'react'
import PropTypes    from 'prop-types'
import ColumnTitle  from './ColumnTitle'
import Cards        from './cards/Cards'

import {
  Draggable
} from 'react-beautiful-dnd'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      index,
      uuid,
      column,
      updateColumnName,
      deleteColumn,
      cancelNewColumn,
      userIsAssigned,
      boardSlug,
      saveNewColumn,
      cards,
      getAboveCard,
      updateCards,
      isDragging
    } = this.props

    return (
      <Draggable
        draggableId={uuid}
        index={index}
        isDragDisabled={!userIsAssigned}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div className='column rounded'>
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
              <Cards
                cards={cards}
                cardUuids={column.card_uuids}
                columnUuid={uuid}
                userIsAssigned={userIsAssigned}
                getAboveCard={getAboveCard}
                updateCards={updateCards}
                isDragging={isDragging}
              />
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

Column.propTypes = {
  index:            PropTypes.number.isRequired,
  uuid:             PropTypes.string.isRequired,
  cards:            PropTypes.object.isRequired,
  column:           PropTypes.object.isRequired,
  boardSlug:        PropTypes.string.isRequired,
  updateColumnName: PropTypes.func.isRequired,
  deleteColumn:     PropTypes.func.isRequired,
  cancelNewColumn:  PropTypes.func.isRequired,
  saveNewColumn:    PropTypes.func.isRequired,
  userIsAssigned:   PropTypes.bool.isRequired,
  getAboveCard:     PropTypes.func.isRequired,
  updateCards:      PropTypes.func.isRequired,
  isDragging:       PropTypes.bool.isRequired
}
