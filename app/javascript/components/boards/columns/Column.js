import React          from 'react'
import Body           from './body/Body'
import PropTypes      from 'prop-types'
import Title          from './title/Title'
import { Draggable }  from 'react-beautiful-dnd'

export default function Column(props) {
  const {
    addCard,
    addColumn,
    allCards,
    boardSlug,
    cards,
    column,
    deleteColumn,
    index,
    isDragging,
    findPreviousCard,
    updateColumnName,
    userIsAssigned,
    uuid
  } = props

  return (
    <Draggable
      draggableId=    {uuid}
      index=          {index}
      isDragDisabled= {!userIsAssigned}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="column rounded">
            <div
              className="column-title"
              {...provided.dragHandleProps}
            >
              <Title
                addColumn=        {addColumn}
                boardSlug=        {boardSlug}
                columnUuid=       {uuid}
                deleteColumn=     {deleteColumn}
                name=             {column.name}
                updateColumnName= {updateColumnName}
                userIsAssigned=   {userIsAssigned}
              />
            </div>
            <Body
              addCard=          {addCard}
              allCards=         {allCards}
              cardOrder=        {column.card_uuids}
              cards=            {cards}
              columnUuid=       {column.uuid}
              findPreviousCard= {findPreviousCard}
              isDragging=       {isDragging}
              userIsAssigned=   {userIsAssigned}
            />
          </div>
        </div>
      )}
    </Draggable>
  )
}

Column.propTypes = {
  addCard:          PropTypes.func.isRequired,
  addColumn:        PropTypes.func.isRequired,
  allCards:         PropTypes.array.isRequired,
  boardSlug:        PropTypes.string.isRequired,
  cards:            PropTypes.object.isRequired,
  column:           PropTypes.object.isRequired,
  deleteColumn:     PropTypes.func.isRequired,
  findPreviousCard: PropTypes.func.isRequired,
  index:            PropTypes.number.isRequired,
  isDragging:       PropTypes.bool.isRequired,
  updateColumnName: PropTypes.func.isRequired,
  userIsAssigned:   PropTypes.bool.isRequired,
  uuid:             PropTypes.string.isRequired
}