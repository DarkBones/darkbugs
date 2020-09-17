import React from 'react'
import PropTypes from 'prop-types'
import Title from './title/Title'
import Body from './body/Body'

import {
  Draggable
} from 'react-beautiful-dnd'

export default class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      addCard,
      addColumn,
      boardSlug,
      cards,
      column,
      deleteCard,
      deleteColumn,
      getPreviousCard,
      index,
      isDragging,
      previousCardCount,
      updateColumnName,
      userIsAssigned,
      uuid
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
            <div className="column rounded">
              <div
                className="column-title"
                {...provided.dragHandleProps}
              >
                <Title
                  addColumn=          {addColumn}
                  boardSlug=          {boardSlug}
                  columnUuid=         {column.uuid}
                  deleteColumn=       {deleteColumn}
                  handleAfterSubmit=  {updateColumnName}
                  name=               {column.name}
                  userIsAssigned=     {userIsAssigned}
                />
              </div>
              <Body
                addCard=              {addCard}
                cards=                {cards}
                cardUuids=            {column.card_uuids}
                columnUuid=           {column.uuid}
                deleteCard=           {deleteCard}
                getPreviousCard=      {getPreviousCard}
                isDragging=           {isDragging}
                previousCardCount=    {previousCardCount}
                userIsAssigned=       {userIsAssigned}
              />
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

Column.propTypes = {
  addCard:            PropTypes.func.isRequired,
  addColumn:          PropTypes.func.isRequired,
  boardSlug:          PropTypes.string.isRequired,
  cards:              PropTypes.object.isRequired,
  column:             PropTypes.object.isRequired,
  deleteCard:         PropTypes.func.isRequired,
  deleteColumn:       PropTypes.func.isRequired,
  index:              PropTypes.number.isRequired,
  isDragging:         PropTypes.bool.isRequired,
  getPreviousCard:    PropTypes.func.isRequired,
  previousCardCount:  PropTypes.func.isRequired,
  updateColumnName:   PropTypes.func.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired,
  uuid:               PropTypes.string.isRequired
}