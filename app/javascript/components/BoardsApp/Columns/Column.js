import MainContext    from '../MainContext';
import PropTypes      from 'prop-types';
import React          from 'react';
import Title          from './Title';
import { Draggable }  from 'react-beautiful-dnd';

export default function Column({ column, index, uuid }) {
  return (
    <MainContext.Consumer>
      {context =>
        <Draggable
          draggableId=    {uuid}
          index=          {index}
          isDragDisabled= {!context.userIsAssigned}
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
                  <Title
                    columnUuid={uuid}
                    name={column.name}
                  />
                </div>
              </div>
            </div>
          }
        </Draggable>
      }
    </MainContext.Consumer>
  )
}