import Column         from './Column';
import ColumnsContext from './ColumnsContext';
import MainContext    from '../MainContext';
import PropTypes      from 'prop-types';
import React          from 'react';

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

  findPreviousCard = e => {
    const classList = e.target.classList;

    // return the divider id
    if (classList.contains('item-card-divider')) {
      return e.target.parentElement.id;
    }

    const { columnOrder, columns } = this.props;

    const columnUuid = e.target.id;
    const column = columns[columnUuid];
    const y = e.clientY - e.target.getBoundingClientRect().top + e.target.scrollTop;

    // if click was below the top card, return the last card in the column
    if (y > 20) {
      const { card_uuids: cardUuids } = column;
      if (cardUuids.length > 0) {
        return cardUuids[cardUuids.length - 1];
      }
    }

    // return last card in previous column(s)
    let columnIndex = columnOrder.indexOf(columnUuid);
    let columnCards = [];
    while (columnIndex > 0) {
      columnIndex--;

      columnCards = columns[columnOrder[columnIndex]].card_uuids;

      if (columnCards.length > 0) {
        return columnCards[columnCards.length - 1];
      }
    }
  }

  handleOnDragEnd = result => {
    console.log(result);

    this.setState({
      isDragging: false
    });
  }

  handleOnDragStart = () => {
    this.setState({
      isDragging: true
    });
  }

  render() {
    const {
      findPreviousCard,
      handleOnDragEnd,
      handleOnDragStart
    } = this;

    const {
      columnOrder,
      columns
    } = this.props;

    const contextValue = {
      findPreviousCard: findPreviousCard
    }

    return (
      <ColumnsContext.Provider value={contextValue}>
        <MainContext.Consumer>
          {context =>
            <DragDropContext
              onDragEnd=  {handleOnDragEnd}
              onDragStat= {handleOnDragStart}
            >
              <Droppable
                droppableId=  "droppable-columns"
                direction=    "horizontal"
                type=         "column"
              >
                { provided =>
                  <div
                    id="columns"
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
                        className=  "btn create-column"
                        onClick=    {() => { context.addColumn('new'); }}
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
      </ColumnsContext.Provider>
    );
  }
}

Columns.propTypes = {
  columnOrder:  PropTypes.array.isRequired,
  columns:      PropTypes.object.isRequired
};