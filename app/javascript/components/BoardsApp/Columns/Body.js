import Card           from './Card';
import ColumnsContext from './ColumnsContext';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Droppable }  from 'react-beautiful-dnd'

export default function Body({ column }) {
  const {
    uuid: columnUuid,
    card_uuids: cardUuids
  } = column;

  const handleOnClick = (e, findPreviousCard) => {
    const previousCard = findPreviousCard(e);
    console.log(previousCard);
  }

  return (
    <ColumnsContext.Consumer>
      {columnsContext =>
        <Droppable
          droppableId={columnUuid}
          type="card"
        >
          {provided => (
            <div
              className="column-body"
              id=       {columnUuid}
              onClick=  {(e) => { handleOnClick(e, columnsContext.findPreviousCard); }}
              ref=      {provided.innerRef}
              {...provided.droppableProps}
            >
              {cardUuids.map((uuid) =>
                <Card
                  key={uuid}
                  uuid={uuid}
                />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      }
    </ColumnsContext.Consumer>
  );
}

Body.propTypes = {
  column: PropTypes.object.isRequired
}