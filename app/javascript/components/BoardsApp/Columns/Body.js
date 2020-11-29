import Card           from './Card';
import ColumnsContext from './ColumnsContext';
import MainContext    from '../MainContext';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Droppable }  from 'react-beautiful-dnd'

export default function Body({ column }) {
  const {
    uuid: columnUuid,
    card_uuids: cardUuids
  } = column;

  const handleOnClick = (e, findColumnIndex, addCard, userIsAssigned) => {
    if (!userIsAssigned) return;

    const columnIndex = findColumnIndex(e);

    addCard(columnUuid, columnIndex, '', 'new');
  }

  return (
    <MainContext.Consumer>
      {context =>
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
                  onClick=  {(e) => {
                    handleOnClick(e, columnsContext.findColumnIndex, context.addCard, context.userIsAssigned);
                  }}
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
          }
        </ColumnsContext.Consumer>
      }
    </MainContext.Consumer>
  );
}

Body.propTypes = {
  column: PropTypes.object.isRequired
}