import MainContext    from '../MainContext';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Draggable }  from 'react-beautiful-dnd';

export default function Card({ uuid }) {
  return (
    <MainContext.Consumer>
      {context =>
        <Draggable
          draggableId={uuid}
          index={context.cardOrder.indexOf(uuid)}
        >
          {provided => (
            <div
              id={uuid}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <div
                className="card item-card clickable"
                id={uuid}
                {...provided.dragHandleProps}
              >
                CARD
              </div>
              <div
                className="item-card-divider"
              />
            </div>
          )}
        </Draggable>
      }
    </MainContext.Consumer>
  );
}

Card.propTypes = {
  uuid: PropTypes.string.isRequired
}