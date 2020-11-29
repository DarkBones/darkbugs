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

  const handleOnClick = (e, findColumnIndex, addCard) => {
    const columnIndex = findColumnIndex(e);
    console.log(columnIndex);

    addCard();
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
                  onClick=  {(e) => { handleOnClick(e, columnsContext.findColumnIndex, context.addCard); }}
                  ref=      {provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cardUuids.map((uuid) =>
                    <Card
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