import Column         from './Column';
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
            onDragStat= {handleOnDragStart}
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
  columnOrder:  PropTypes.array.isRequired,
  columns:      PropTypes.object.isRequired
};

Columns.contextType = MainContext;