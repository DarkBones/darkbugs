import Card           from './Card';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Droppable }  from 'react-beautiful-dnd'

export default function Body({ column }) {
  const {
    uuid: columnUuid,
    card_uuids: cardUuids
  } = column;

  const handleOnClick = e => {
    console.log('click');
  }

  return (
    <Droppable
      droppableId={columnUuid}
      type="card"
    >
      {provided => (
        <div
          className="column-body"
          id=       {columnUuid}
          onClick=  {handleOnClick}
          ref=      {provided.innerRef}
          {...provided.droppableProps}
        >
          {cardUuids.map((uuid) =>
            <Card
              key={uuid}
              uuid={uuid}
            />
          )}
        </div>
      )}
    </Droppable>
  );
}

Body.propTypes = {
  column: PropTypes.object.isRequired
}