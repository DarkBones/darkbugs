import Card           from './Card';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Droppable }  from 'react-beautiful-dnd'

export default function Body({ column }) {
  const {
    uuid: columnUuid,
    card_uuids: cardUuids
  } = column;

  // const handleOnClick = (e, findColumnIndex, addCard, userIsAssigned) => {
  //   if (!userIsAssigned) return;
  //
  //   const classList = e.target.classList;
  //
  //   if (classList.contains('item-card') || classList.contains('form-control')) return;
  //
  //   const columnIndex = findColumnIndex(e);
  //
  //   addCard(columnUuid, columnIndex, '', 'new');
  // }

  return (
    <Droppable
      droppableId={columnUuid}
      type="card"
    >
      {provided => (
        <div
          className="column-body"
          columnid= {columnUuid}
          id=       {columnUuid}
          // onClick=  {(e) => {
          //   handleOnClick(e, columnsContext.findColumnIndex, context.addCard, context.userIsAssigned);
          // }}
          ref=      {provided.innerRef}
          {...provided.droppableProps}
        >
          {cardUuids.map((uuid, index) =>
            <Card
              columnIndex={index}
              columnUuid={columnUuid}
              key={uuid}
              uuid={uuid}
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