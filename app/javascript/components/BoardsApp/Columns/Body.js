import Card           from './Card';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Droppable }  from 'react-beautiful-dnd'

export default function Body({ column }) {
  const {
    uuid:       columnUuid,
    card_uuids: cardUuids
  } = column;

  return (
    <Droppable
      droppableId={columnUuid}
      type=       "card"
    >
      {provided => (
        <div
          className="column-body"
          columnid= {columnUuid}
          id=       {columnUuid}
          ref=      {provided.innerRef}
          {...provided.droppableProps}
        >
          {cardUuids.map((uuid, index) =>
            <Card
              columnIndex={index}
              columnUuid= {columnUuid}
              key=        {uuid}
              uuid=       {uuid}
            />
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

Body.propTypes = {
  column: PropTypes.object.isRequired
}