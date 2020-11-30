import MainContext        from '../MainContext';
import PropTypes          from 'prop-types';
import React              from 'react';
import StringTransformer  from '../../shared/StringTransformer';
import ToggleInput        from '../../shared/ToggleInput';
import { CardApi }        from '../../../api/InternalApi';
import { Draggable }      from 'react-beautiful-dnd';

export default function Card({ columnIndex, columnUuid, uuid }) {
  const handleSubmit = async (name, deleteCard, saveCard, addCard) => {
    if (name.length === 0) {
      deleteCard('new');
      return;
    }

    const params = {
      column_uuid:  columnUuid,
      column_index: columnIndex,
      card: {
        name: name
      }
    }

    let response = await CardApi.createCard(params);
    if (!response) return;
    if (response.status !== 200) return;

    saveCard(name, response.data.uuid, columnUuid);

    addCard(columnUuid, columnIndex + 1, '', 'new');
  }

  const input = (deleteCard, saveCard, addCard) => {
    return (
      <ToggleInput
        allowBlank={true}
        cancelOnClick={false}
        handleOnCancel={() => { deleteCard('new'); }}
        handleOnSubmit={data => { handleSubmit(data, deleteCard, saveCard, addCard) }}
        isEditing={true}
      />
    );
  }

  const title = name => {
    return StringTransformer.shortenWidth(name, 1700);
  }

  const element = (name, deleteCard, saveCard, addCard) => {
    return uuid === 'new' ? input(deleteCard, saveCard, addCard) : title(name);
  }

  return (
    <MainContext.Consumer>
      {context =>
        <Draggable
          draggableId={uuid}
          index=      {context.cardOrder.indexOf(uuid)}
        >
          {provided => (
            <div
              id=   {uuid}
              ref=  {provided.innerRef}
              {...provided.draggableProps}
            >
              <div
                className="card item-card clickable"
                id=       {uuid}
                {...provided.dragHandleProps}
              >
                {element(context.cards[uuid].name, context.deleteCard, context.saveCard, context.addCard)}
              </div>
              <div
                className="item-card-divider"
                cardid=   {uuid}
                columnid= {columnUuid}
              />
            </div>
          )}
        </Draggable>
      }
    </MainContext.Consumer>
  );
}

Card.propTypes = {
  columnIndex:  PropTypes.number.isRequired,
  columnUuid:   PropTypes.string.isRequired,
  uuid:         PropTypes.string.isRequired
}