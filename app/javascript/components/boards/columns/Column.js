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
      addColumn,
      boardSlug,
      cards,
      column,
      deleteColumn,
      index,
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
                cards=                {cards}
                cardUuids=            {column.card_uuids}
                columnUuid=           {column.uuid}
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
  addColumn:          PropTypes.func.isRequired,
  boardSlug:          PropTypes.string.isRequired,
  cards:              PropTypes.object.isRequired,
  column:             PropTypes.object.isRequired,
  deleteColumn:       PropTypes.func.isRequired,
  index:              PropTypes.number.isRequired,
  previousCardCount:  PropTypes.func.isRequired,
  updateColumnName:   PropTypes.func.isRequired,
  userIsAssigned:     PropTypes.bool.isRequired,
  uuid:               PropTypes.string.isRequired
}