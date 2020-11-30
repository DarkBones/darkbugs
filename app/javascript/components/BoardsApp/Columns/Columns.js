import Column         from './Column';
import MainContext    from '../MainContext';
import PropTypes      from 'prop-types';
import React          from 'react';
import { BoardApi }   from '../../../api/InternalApi';

import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd';

export default class Columns extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOnClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOnClick);
  }

  findColumnIndex = e => {
    const classList = e.target.classList;
    const { columns } = this.props;

    if (classList.contains('item-card-divider')) {
      const cardId = e.target.getAttribute('cardid');
      const columnId = e.target.getAttribute('columnid');

      const {card_uuids: cardUuids} = columns[columnId];
      return cardUuids.indexOf(cardId) + 1;
    }

    const columnUuid = e.target.id
    const column = columns[columnUuid]
    const y = e.clientY - e.target.getBoundingClientRect().top + e.target.scrollTop;

    if (y > 20) {
      return column.card_uuids.length;
    } else {
      return 0;
    }
  }

  handleOnClick = e => {
    const { addCard, deleteCard, userIsAssigned } = this.context;

    if (!userIsAssigned) return;

    const { classList, id } = e.target;

    if (
      classList.contains('item-card-divider') ||
      classList.contains('column-body')
    ) {
      deleteCard('new');
      const columnIndex = this.findColumnIndex(e);
      const columnUuid = e.target.getAttribute('columnid');

      addCard(columnUuid, columnIndex, '', 'new');
      return;
    }

    if (classList.contains('item-card') && id === 'new' || classList.contains('form-control')) {
      return;
    }

    deleteCard('new');
  }

  handleOnDragEnd = result => {
    const { setIsDragging, updateCardOrder, updateColumnOrder } = this;

    setIsDragging(false);

    const {
      destination,
      draggableId,
      source,
      type
    } = result;

    // return if no changes
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    type === 'column'
      ? updateColumnOrder(
        source,
        destination,
        draggableId
      )
      : updateCardOrder(
        source,
        destination,
        draggableId
      )
  }

  handleOnDragStart = () => {
    this.setIsDragging(true);
  }

  previousCardCount = columnUuid => {
    const { columnOrder, columns } = this.props;
    let count = 0;

    let uuid;
    for (let i = 0; i < columnOrder.length; i++) {
      uuid = columnOrder[i];
      if (uuid === columnUuid) break;

      count += columns[uuid].card_uuids.length;
    }

    return count;
  }

  setIsDragging = isDragging => {
    this.setState({
      isDragging: isDragging
    })
  }

  updateCardOrder = (source, destination, draggableId) => {
    console.log('update card order');

    const { context, props } = this;
    const { cardOrder, columns } = props;

    const sourceColumn      = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const previousCardCount = this.previousCardCount(destinationColumn.uuid);

    const relativeSourceIdx = sourceColumn.card_uuids.indexOf(draggableId);
    const relativeDestIdx   = destination.index - previousCardCount;

    sourceColumn.card_uuids.splice(relativeSourceIdx, 1);
    destinationColumn.card_uuids.splice(relativeDestIdx, 0, draggableId);

    let destIdx = destination.index;
    if (destIdx === 0) destIdx = previousCardCount;
    if (destIdx > source.index && destination.droppableId !== source.droppableId) destIdx -= 1;

    cardOrder.splice(source.index, 1);
    cardOrder.splice(destIdx, 0, draggableId);

    context.setCardOrder(cardOrder, sourceColumn, destinationColumn);
  }

  updateColumnOrder = async (source, destination, draggableId) => {
    const { context, props } = this;

    const originalCardOrder = Array.from(props.cardOrder);
    const originalColumnOrder = Array.from(props.columnOrder);

    const { columns, projectKey } = props;
    const columnOrder = Array.from(props.columnOrder);

    columnOrder.splice(source.index, 1);
    columnOrder.splice(destination.index, 0, draggableId);

    let cardOrder = [];
    columnOrder.forEach((uuid) => {
      cardOrder = cardOrder.concat(columns[uuid].card_uuids);
    });

    context.setColumnOrder(cardOrder, columnOrder);

    await BoardApi.reorderColumns(
      projectKey,
      context.boardSlug,
      {
        columns: columnOrder
      }
    ).catch((e) => {
      console.log(e);
      context.setColumnOrder(originalCardOrder, originalColumnOrder);
    });
  }

  render() {
    const {
      handleOnDragEnd,
      handleOnDragStart
    } = this;

    const {
      columnOrder,
      columns
    } = this.props;

    return (
      <MainContext.Consumer>
        {context =>
          <DragDropContext
            onDragEnd=  {handleOnDragEnd}
            onDragStart={handleOnDragStart}
          >
            <Droppable
              droppableId="droppable-columns"
              direction=  "horizontal"
              type=       "column"
            >
              { provided =>
                <div
                  id= "columns"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {columnOrder.map((uuid, index) =>
                    <Column
                      column= {columns[uuid]}
                      index=  {index}
                      key=    {uuid}
                      uuid=   {uuid}
                    />
                  )}
                  {provided.placeholder}
                  {context.userIsAssigned && !columnOrder.includes('new') &&
                  <React.Fragment>
                    <button
                      className="btn create-column"
                      onClick=  {() => { context.addColumn('new'); }}
                    >
                      <i
                        className="fa fa-plus-circle fa-3x clickable"
                      />
                    </button>
                  </React.Fragment>
                  }
                </div>
              }
            </Droppable>
          </DragDropContext>
        }
      </MainContext.Consumer>
    );
  }
}

Columns.propTypes = {
  cardOrder:    PropTypes.array.isRequired,
  columnOrder:  PropTypes.array.isRequired,
  columns:      PropTypes.object.isRequired,
  projectKey:   PropTypes.string.isRequired
};

Columns.contextType = MainContext;