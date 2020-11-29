import MainContext        from '../MainContext';
import PropTypes          from 'prop-types';
import React              from 'react';
import StringTransformer  from '../../shared/StringTransformer';
import ToggleInput        from '../../shared/ToggleInput';
import { Draggable }      from 'react-beautiful-dnd';

export default function Card({ columnUuid, uuid }) {
  const input = deleteCard => {
    return (
      <ToggleInput
        handleOnCancel={() => { deleteCard('new'); }}
        handleOnSubmit={data => { console.log(data); }}
        isEditing={true}
      />
    );
  }

  const title = name => {
    return StringTransformer.shortenWidth(name, 1700);
  }

  const element = (name, deleteCard) => {
    return uuid === 'new' ? input(deleteCard) : title(name);
  }

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
                {element(context.cards[uuid].name, context.deleteCard)}
              </div>
              <div
                className="item-card-divider"
                cardid={uuid}
                columnid={columnUuid}
              />
            </div>
          )}
        </Draggable>
      }
    </MainContext.Consumer>
  );
}

Card.propTypes = {
  columnUuid: PropTypes.string.isRequired,
  uuid:       PropTypes.string.isRequired
}