import Column       from './Column';
import MainContext  from '../MainContext';
import PropTypes    from 'prop-types';
import React        from 'react';

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
    );
  }
}

Columns.propTypes = {
  columnOrder:  PropTypes.array.isRequired,
  columns:      PropTypes.object.isRequired
};