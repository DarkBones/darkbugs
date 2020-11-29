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

  findColumnIndex = e => {
    const classList = e.target.classList;
    const { columnOrder, columns } = this.props;

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
      findColumnIndex,
      handleOnDragEnd,
      handleOnDragStart
    } = this;

    const {
      columnOrder,
      columns
    } = this.props;

    const contextValue = {
      findColumnIndex: findColumnIndex
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