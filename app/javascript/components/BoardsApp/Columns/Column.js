import PropTypes      from 'prop-types';
import React          from 'react';
import UserContext    from '../UserContext';
import { Draggable }  from 'react-beautiful-dnd';

export default function Column({ column, index, uuid }) {
  return (
    <UserContext.Consumer>
      {user =>
        <Draggable
          draggableId=    {uuid}
          index=          {index}
          isDragDisabled= {!user.isAssigned}
        >
          {provided =>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <div
                className="column rounded"
              >
                <div
                  className="column-title"
                  {...provided.dragHandleProps}
                >
                  {column.name}
                </div>
              </div>
            </div>
          }
        </Draggable>
      }
    </UserContext.Consumer>
  )
}